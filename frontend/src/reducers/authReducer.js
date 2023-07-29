import { AUTH_ACTION_TYPES } from '../actions/types';

export default function authReducer(state, action) {
  switch (action.type) {
    case AUTH_ACTION_TYPES.LOGIN:
      return {
        ...state,
        authed: true,
        is_moderator: action.value.is_moderator,
      };
    case AUTH_ACTION_TYPES.LOGOUT:
      return {
        ...state,
        authed: false,
        is_moderator: false,
        user: null,
      };
    case AUTH_ACTION_TYPES.USER_LOADING:
      return {
        ...state,
        is_user_loading: true,
      };
    case AUTH_ACTION_TYPES.USER_LOADED:
      return {
        ...state,
        is_user_loading: false,
      };
    case AUTH_ACTION_TYPES.ADD_ERRORS:
      return {
        ...state,
        is_error: true,
        errors: { ...state.errors, ...action.value.errors },
      };
    case AUTH_ACTION_TYPES.CLEAR_ERRORS:
      return {
        ...state,
        is_error: false,
        errors: {},
      };
    default:
      throw new Error();
  }
}
