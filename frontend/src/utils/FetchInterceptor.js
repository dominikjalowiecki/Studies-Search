import { ServiceStatusConsumer } from './serviceStatus';

const DEBUG = process.env.NODE_ENV === 'development';
const SERVER_URL = process.env.REACT_APP_SERVER_URL;
const { fetch: originalFetch } = window;

class ResponseError extends Error {
  #response;
  #errors;

  constructor(message, response, errors = {}) {
    super(message);
    this.#response = response;
    this.#errors = errors;
  }

  get response() {
    return this.#response;
  }

  get errors() {
    return this.#errors;
  }
}

// Monkey patched fetch API
export default function FetchInterceptor({ children }) {
  const { setServiceUnavailability } = ServiceStatusConsumer();

  window.fetch = async (
    resource,
    config,
    handledStatusCodes = [],
    isJson = true
  ) => {
    const headers = {};

    if (isJson) headers['Content-Type'] = 'application/json; charset=UTF-8';

    const newConfig = {
      ...config,
      headers: {
        ...config?.headers,
        Accept: 'application/json',
        ...headers,
      },
    };

    try {
      const response = await originalFetch(
        (SERVER_URL || '') + resource,
        newConfig
      );

      if (DEBUG) console.info(response);

      const responseClose = response.clone();

      if (response.status === 204) return response;
      else if (response.status === 500) throw new ResponseError('', response);

      const message = await response.json();
      if (!response.ok) {
        const err =
          'non_field_errors' in message
            ? message['non_field_errors'].join('; ')
            : '';
        delete message['non_field_errors'];

        throw new ResponseError(err, response, message);
      }

      return responseClose;
    } catch (error) {
      if (DEBUG) console.error(error);
      if (
        !handledStatusCodes.some((el) => el === error?.response?.status) ||
        !error?.response
      ) {
        setServiceUnavailability(true);
        return Promise.reject(false);
      } else return Promise.reject(error);
    }
  };

  return children;
}
