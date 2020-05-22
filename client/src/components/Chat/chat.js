import React, { useState, useEffect } from 'react';
import queryString from 'query-string'; 
import io from 'socket.io-client';
import InfoBar from '../InfoBar/InfoBar';
import Input from '../Input/Input';
import Messages from '../Messages/Messages';

import './chat.css';

let socket;

const Chat = ({ location }) => {
    const [ name, setName ] = useState('');
    const [ room, setRoom ] = useState('');
    const [ users, setUsers ] = useState('');
    const [ message, setMessage ] = useState('');
    const [ messages, setMessages ] = useState([]);
    const ENDPOINT = 'https://chatapp-project-react.herokuapp.com/';

    useEffect(() => {
        const { name, room } = queryString.parse(location.search);

        socket = io(ENDPOINT);
       
        setRoom(room);
        setName(name);
        
        socket.emit('join', { name, room }, (error) => {
           if(error) {
               alert(error);
           }
        });
    }, [ENDPOINT, location.search]);

    useEffect( () => {
        socket.on('message', (message) => {
            //Push new message to array of messages
            setMessages(messages => [ ...messages, message ]);
        });

        socket.on('roomData', ({ users }) => {
            setUsers(users);
          });
    }, []);

    //Function for sending messages
    const sendMessage = (event) => {
        //Prevent reload of the whole page
        event.preventDefault();

        if(message) {
            //Clears the message console
            socket.emit('sendMessage', message, () => setMessage(''));
        }
    }

    console.log(message, messages)

    return (
        <div className="outerContainer">
            <div className="container">
                <InfoBar room={room} />
                <Messages messages={messages} name={name}/>
                <Input message={message} setMessage={setMessage} sendMessage={sendMessage}/>
            </div>
        </div>
    );
}

export default Chat;