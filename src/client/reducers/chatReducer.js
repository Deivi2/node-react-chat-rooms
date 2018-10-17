import {IMPORT_ALL_CHATS, GET_CHAT_INFO, CLEAR_CHAT_INFO, SET_ROOM_USERS_LIST} from "../actions/types";

const initialState = {
    chatRooms: [],
    chatRoomInfo: {},
    loading: false
};


export default function (state=initialState, action) {

    switch (action.type) {

        case IMPORT_ALL_CHATS:
            return {...state, chatRooms: [...action.payload]};

        case GET_CHAT_INFO:
            return{...state, chatRoomInfo: action.payload};

        case CLEAR_CHAT_INFO:
            return{...state, chatRoomInfo: action.payload};

        case SET_ROOM_USERS_LIST:
            return {...state, roomUserList: [...action.payload]};

        default:
            return state
    }

}