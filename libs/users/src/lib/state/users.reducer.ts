import {Action, createReducer, on} from '@ngrx/store';

import * as UsersActions from './users.actions';
import {User} from "../models/user";

export const USERS_FEATURE_KEY = 'users';

export interface UsersState {
  user: User | null,
  isAuthenticated: boolean;
}


export interface UsersPartialState {
    readonly [USERS_FEATURE_KEY]: UsersState;
}

export const initialUserState: UsersState ={
  user: null,
  isAuthenticated: false
}

const usersReducer = createReducer(
  initialUserState,
  on(UsersActions.buildUserSession, (state) => ({...state})),
  on(UsersActions.buildUserSessionSuccess, (state, action) => ({
    ...state,
    user: action.user,
    isAuthenticated: true
  })),
  on(UsersActions.buildUserSessionFailed, (state) => ({
    ...state,
    user: null,
    isAuthenticated: false
  })),
);

export function reducer(state: UsersState | undefined, action: Action) {
    return usersReducer(state, action);
}
