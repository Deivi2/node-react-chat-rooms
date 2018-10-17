import {LOGIN_USER,AUTH_USER,SET_ROOM_USERS_LIST} from "../actions/types";

// const initialState = {
//     login: {},
//     userData: {}
// };


export default function (state = {}, action) {

    switch (action.type) {
        case LOGIN_USER:
            return {...state, login: action.payload};
        case AUTH_USER:
            return {...state, userData: action.payload};

        default:
            return state
    }

}