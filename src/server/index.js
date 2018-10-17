const express = require('express');
const os = require('os');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const http = require('http');
const socketIo = require("socket.io");
const format = require('date-fns/format');

const app = express();
const mongoose = require('mongoose');

require('dotenv').config();

mongoose.Promise = global.Promise;
mongoose.connect(
    process.env.DATABASE,
    {
        useCreateIndex: true,
        useNewUrlParser: true
    }
);

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cookieParser());

app.use(express.static('dist'));

//===========================
//           MODULES
//===========================

const {User} = require('./modals/user');
const {ChatRoom} = require('./modals/chatRoom');

//============================
//          MIDDLEWARE
//============================

const {auth} = require('./middlewares/auth');


app.get('/api/getUsername', (req, res) => res.send({username: os.userInfo().username}));

//============================
//            USER
//============================

app.post('/api/user/createNewUser', (req, res) => {

    User.findOne({email: req.body.email})
        .then(user => {
            if (user) {
                return res.status(400).json({success: false, err: 'User already exist'})
            }
            new User(req.body)
                .save((err) => {
                    if (err) return res.status(400).json({err: err});
                    res.status(200).json({success: true, msg: 'New user created'})
                })
        })

});


app.post('/api/user/loginUser', (req, res) => {

    User.findOne({email: req.body.email}, (err, user) => {
        if (!user) return res.json({'success': false});

        user.comparePassword(req.body.password, (err, isMatch) => {
            if (!isMatch) return res.json({'success': false});

            user.generateToken((err, user) => {
                if (!user) res.status(400).send(err);

                user.online = true;
                user.save(()=>{
                    res.cookie('x_auth', user.token).status(200).json({'success': true})
                })
            })
        })
    });
});

app.get('/api/user/logout', auth, (req, res) => {
    User.findOneAndUpdate(
        {_id: req.user._id},
        {token: ''},
        (err, doc) => {
            if (err) return res.json({success: false, err});
            return res.status(200).send({
                success: true
            })
        }
    )
});


app.get('/api/users/auth', auth, (req, res) => {

    res.status(200).json({
        email: req.user.email,
        name: req.user.name,
        role: req.user.role,
        online: req.user.online,
        id: req.user._id
    })
});




//=======================
//         CHAT
//=======================

app.get('/api/chat/getAllChatRooms', auth, async (req, res) => {

    try {
        const allChatRooms = await ChatRoom.find();
        res.status(200).json(allChatRooms)
    } catch (err) {
        res.json({'err': 'true'})
    }

});


app.post('/api/chat/createNewChatRoom', auth, (req, res) => {

    ChatRoom.findOne({'name': req.body.name})
        .then(chatRoom => {
            if (chatRoom) return res.json({'err': 'This name already exist'});
            new ChatRoom({
                creator: req.user._id,
                name: req.body.name
            }).save(() => {
                res.status(200).json({'success': true})
            })
        })
        .catch(err => res.json({err: err}))
});

app.get('/api/chat/chatRoomData/:id', auth, (req,res) =>{

    const chatId = req.params.id;

    ChatRoom.findById(chatId)
        .then(chatData => {
            if(chatData) return res.status(200).json(chatData)
        })
        .catch(e => res.json({err: e}))


});


app.get('/api/chat/deleteChatRoom', auth, (req, res) => {

    const chatId = req.query.id;
    ChatRoom.findOne({'_id': chatId})
        .then(res => {
            if (!res) res.json({success: 'false'});
            ChatRoom.findByIdAndDelete({'_id': chatId})
                .then(res => res.json({success: true}))
                .catch(err => ress.json({err: err}))
        })
});


//=======================
// Socket.io
//=======================

const server = http.createServer(app);
const io = socketIo(server);

let usersArr = [];

function messagesText(name,text){
    return{
        text: text,
        name: name,
        date: format(
            new Date(),
            'H:mm:ss'
        )
    }
}

function removeUser(userId) {
    var user = usersArr.filter((user) => user.userId === userId)[0];

    if(user){
       usersArr = usersArr.filter((user) => user.userId !== userId)
    }

    return user;
}


function addUser(socketId, name, room, userId){
    const user = {socketId, name, room, userId};
    usersArr.push(user);
    return user;
}


function  getUserList() {
    // let users = usersArr.filter((user) => user.room === room);
    // let namesArray = users.map((user) => user.name);

    return usersArr;
}


io.on("connection", socket => {

    let room = '', name = '', userID = '', sockedId;

    socket.on('join', (params, callback) => {
        room = params.room;
        name = params.name;
        userID = params.userId;
        sockedId = params;
        socket.join(room);
        removeUser(userID);
        addUser(socket.id, name, room, userID);

        io.to(room).emit('updateUserList', getUserList());

        socket.emit('newMessage', messagesText('Admin','Welcome to the chat app'));
        socket.broadcast.to(room).emit('newMessage',messagesText(name, 'has joined.'));
    });


    socket.on('createMessage', (message, callback) => {
        io.to(room).emit('newMessage', messagesText(name,message.text));
    });

    socket.on("discon", () => {
        let user = removeUser(userID);

        if (user) {
            io.to(user.room).emit('updateUserList', getUserList(user.room));
            io.to(user.room).emit('newMessage', messagesText('Admin', `${user.name} has left`));
        }
    });



    socket.on("disconnect", (callback) => {


        let user = removeUser(userID);

        if (user) {
            io.to(user.room).emit('updateUserList', getUserList(user.room));
        }
        io.to(room).emit('newMessage', messagesText(name,'disconnected'));

    });


});


server.listen(8080, () => console.log('Listening on port 8080!'));
