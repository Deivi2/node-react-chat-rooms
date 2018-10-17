import axios from "axios";
import {GET_CHAT_INFO, IMPORT_ALL_CHATS, CLEAR_CHAT_INFO, SET_ROOM_USERS_LIST} from "../actions/types";


export function importChatRooms() {

    const request = axios.get('/api/chat/getAllChatRooms')
        .then(res => res.data);

    return{
        type: IMPORT_ALL_CHATS,
        payload: request
    }
}

export function getChatInfo(chatId) {

    const request = axios.get(`/api/chat/chatRoomData/${chatId}`)
        .then(res => res.data);

    return{
        type: GET_CHAT_INFO,
        payload: request
    }
}

export function clearChatInfo() {
    return{
        type: CLEAR_CHAT_INFO,
        payload: {}
    }
}

export function setRoomUserList(list, rooms) {

    // let roomsCollection = [];
    // for(let r in rooms){
    //     roomsCollection[r] = rooms[r]._id;
    // }
    //
    // console.log(roomsCollection);
    //
    //
    // for(let l in list){
    //     if(roomsCollection[l] == list[l].room){
    //
    //         roomsCollection[l] =
    //
    //         // roomsCollection.find(function (el) {
    //         //     return el[roomsCollection[l]] ==
    //         // })
    //     }
    // }
    //
    // console.log(roomsCollection);




    return{
        type: SET_ROOM_USERS_LIST,
        payload: list
    }
}