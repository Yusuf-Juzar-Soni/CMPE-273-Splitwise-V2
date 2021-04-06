import { combineReducers } from 'redux';
import loggedReducer from './isLogged';

const combReducers = combineReducers({ isLogged: loggedReducer });

export default combReducers;
