const express = require('express');
const socketio = require('socket.io');
const http = require('http');

const { addUser, removeUser, getUser, getUsersInRoom } = require('./users.js');

const PORT = process.env.PORT || 5000;

const router = require('./router');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

io.on('connection', (socket) => {
    console.log('We have a new connection.');

    //Pass in the event 'join' from chat.js and do something when it is emitting
    socket.on('join', ({ name, chatRoom }, callback) => {
        console.log(name, chatRoom);
        //Error handling

        // const error = true;
        // if(error) {
        //     callback({ error: 'error' });
        // }      
    });

    socket.on('disconnect', () => {
        console.log('User has just left!');
    })
});

app.use(router);

server.listen(PORT, () => console.log(`Server has started on port ${PORT}`));