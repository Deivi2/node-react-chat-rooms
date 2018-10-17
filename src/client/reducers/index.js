import { combineReducers } from 'redux';
import userReducer from './userReducer';
import chatRooms from './chatReducer';

const rootReducer = combineReducers({
    user: userReducer,
    chat: chatRooms
});

export default rootReducer;