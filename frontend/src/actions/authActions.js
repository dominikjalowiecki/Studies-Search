import { AUTH_ACTION_TYPES } from './types';

export function login(dispatch, { email, password }) {
  return new Promise((resolve, reject) => {
    dispatch({ type: AUTH_ACTION_TYPES.USER_LOADING });
    fetch(
      '/token/login/',
      {
        method: 'POST',
        body: JSON.stringify({
          email,
          password,
        }),
      },
      [400]
    )
      .then(async (response) => {
        const data = await response.json();

        localStorage.setItem('auth_token', data.auth_token);
        localStorage.setItem('is_moderator', data.is_moderator);

        dispatch({
          type: AUTH_ACTION_TYPES.CLEAR_ERRORS,
        });
        dispatch({
          type: AUTH_ACTION_TYPES.LOGIN,
          value: { is_moderator: data.is_moderator },
        });
        dispatch({ type: AUTH_ACTION_TYPES.USER_LOADED });

        resolve();
      })
      .catch((error) => {
        dispatch({ type: AUTH_ACTION_TYPES.USER_LOADED });

        if (error != false)
          dispatch({
            type: AUTH_ACTION_TYPES.ADD_ERRORS,
            value: {
              errors: {
                '': error.message,
                ...error.errors,
              },
            },
          });

        reject();
      });
  });
}

export function logout(dispatch, cache) {
  return new Promise((resolve) => {
    fetch(
      '/token/logout/',
      {
        method: 'POST',
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('auth_token'),
        },
      },
      [401]
    )
      .then(() => {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('is_moderator');

        cache.delete('/users/me/');

        dispatch({ type: AUTH_ACTION_TYPES.LOGOUT });
      })
      .finally(() => {
        resolve();
      });
  });
}

export function clear_errors(dispatch) {
  dispatch({ type: AUTH_ACTION_TYPES.CLEAR_ERRORS });
}
