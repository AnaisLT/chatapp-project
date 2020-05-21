const express = require('express');
const socketio = require('socket.io');
const http = require('http');

const { addUser, removeUser, getUser, getUsersInRoom } = require('./users');

const PORT = process.env.PORT || 5000;

const router = require('./router');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

io.on('connection', (socket) => {

    //Pass in the event 'join' from chat.js and do something when it is emitted
    socket.on('join', ({ name, chatRoom }, callback) => {
        const { error, user } = addUser({ id: socket.id, name, chatRoom });

        if(error) return callback(error);

        socket.join(user.chatRoom);
        //Admin generated messages
        //Display welcome message when user joins in
        socket.emit('message', { user: 'admin', text: `${user.name}, welcome to the room ${user.chatRoom}`});
        //Let other users know the new user has joined the conversation
        socket.broadcast.to(user.chatRoom).emit('message', { user: 'admin', text: `${user.name} has joined!`});
        socket.join(user.chatRoom);
        
        callback();
    });

    //User generated messages
    socket.on('sendMessage', (message, callback) => {
        const user = getUser(socket.id);

        io.to(user.chatRoom).emit('message', { user: user.name, text: message });
        
        callback();
    });

    socket.on('disconnect', () => {
        console.log('User has just left!');
    });
});

app.use(router);

server.listen(PORT, () => console.log(`Server has started on port ${PORT}`));