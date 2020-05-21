import React, { useState, useEffect } from 'react';
import queryString from 'query-string'; 
import io from 'socket.io-client';

let socket;

const Chat = ({ location }) => {
    const [ name, setName ] = useState('');
    const [ chatRoom, setChatRoom ] = useState('');
    const ENDPOINT = 'localhost:5000';

    useEffect( () => {
        const { name, chatRoom } = queryString.parse(location.search);

        socket = io(ENDPOINT);
        setName(name);
        setName(chatRoom);

        socket.emit('join', { name, chatRoom }, ({ error }) => {
           
        });

        //Disconnect event
        return () => {
            socket.emit('disconnect');
            
            socket.off();
        }

    }, [ENDPOINT, location.search]);
    return (
        <h1>Chat</h1>
    )
}

export default Chat;