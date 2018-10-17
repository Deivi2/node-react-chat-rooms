const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const chatRoomSchema = mongoose.Schema({

    creator:{
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    name:{
        type: String,
        trim: true,
        required: true,
        unique: true,
        min: 6,
        max: 24
    },
    date:{
        type: Date,
        default: Date.now
    }




});


const ChatRoom = mongoose.model('ChatRoom', chatRoomSchema);

module.exports = { ChatRoom };