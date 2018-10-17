import socketIOClient from "socket.io-client";

export const socketIo = (function () {

    let endpoint = 'http://127.0.0.1:8080';
    let socket = socketIOClient(endpoint);


    let socketConnect = (callback) => {
        socket.on('connect', () =>{
            console.log('connected!!!')
        });
    };

    let join = function(values) {
        socket.emit('join', values);
    };


    let newMessage = function(callback) {
        socket.on('newMessage', (message) => {
            callback(message);
        });
    };

    let createMessage = function(message) {
        socket.emit('createMessage', {
            text: message
        });
    };


    let discon = function () {
        socket.emit('discon', function () {
            console.log('disconnected')
        });
    };

    let disconnect = function () {
        socket.emit('disconnect', function () {
            console.log('disconnected')
        });
    };

    let updateUsrList = function (callback) {

        socket.on('updateUserList', function (users) {
            callback(users);
        })
    };



    return{
        socketConnect: socketConnect,
        newMessage:newMessage,
        join: join,
        createMessage: createMessage,
        disconnect: disconnect,
        discon:discon,
        updateUsrList:updateUsrList
    }

})();


