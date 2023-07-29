import { useReducer, useContext } from 'react';
import authReducer from '../reducers/authReducer';
import {
  login as loginAction,
  logout as logoutAction,
  clear_errors,
} from '../actions/authActions';
import { useLocation, Navigate, useNavigate } from 'react-router-dom';
import authContext from '../contexts/authContext.js';
import { useSWRConfig } from 'swr';
import useSWRImmutable from 'swr/immutable';

function useAuth() {
  const initialAuthState = {
    authed: localStorage.hasOwnProperty('auth_token'),
    is_moderator: false,
    is_user_loading: false,
    is_error: false,
    errors: {},
    user: null,
  };

  const [authState, dispatch] = useReducer(authReducer, initialAuthState);
  const navigate = useNavigate();

  const authFetch = async (
    resource,
    config,
    handledStatusCodes = [],
    handleUnauthorized = true,
    isJson = true
  ) => {
    const newConfig = {
      ...config,
      headers: {
        ...config?.headers,
        Authorization: 'Bearer ' + localStorage.getItem('auth_token'),
      },
    };

    try {
      const response = await fetch(
        resource,
        newConfig,
        [403, ...handledStatusCodes],
        isJson
      );

      return response;
    } catch (error) {
      if (handleUnauthorized && error?.response?.status === 403) {
        logoutAction(dispatch).then(() => {
          navigate('/login');
        });
      }

      return Promise.reject(error);
    }
  };

  const { data: user } = useSWRImmutable(
    authState.authed ? '/users/me/' : null,
    (url) => {
      return authFetch(url).then((response) => response.json());
    }
  );

  const { cache } = useSWRConfig();

  return {
    authed: authState.authed,
    is_moderator: user ? user.is_moderator : false,
    is_user_loading: authState.is_user_loading,
    login: ({ email, password }) => loginAction(dispatch, { email, password }),
    logout: () => logoutAction(dispatch, cache),
    clear_errors: () => clear_errors(dispatch),
    authFetch,
    errors: authState.errors,
    user,
  };
}

export function AuthProvider({ children }) {
  const auth = useAuth();

  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
}

export function AuthConsumer() {
  return useContext(authContext);
}

export function RequireAuthRoute({ children }) {
  const { authed } = AuthConsumer();
  const location = useLocation();

  return authed === true ? (
    children
  ) : (
    <Navigate to='/login' replace state={{ path: location.pathname }} />
  );
}

export function RequireNotAuthRoute({ children }) {
  const { authed } = AuthConsumer();
  const { state } = useLocation();
  const { path } = state || { path: '/' };

  return authed === true ? <Navigate to={path} replace /> : children;
}
