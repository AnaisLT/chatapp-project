import React, { useState, useEffect } from 'react';
import queryString from 'query-string'; 
import io from 'socket.io-client';
import './chat.css';

let socket;

const Chat = ({ location }) => {
    const [ name, setName ] = useState('');
    const [ chatRoom, setChatRoom ] = useState('');
    const [ message, setMessage ] = useState('');
    const [ messages, setMessages ] = useState([]);
    const ENDPOINT = 'localhost:5000';

    useEffect(() => {
        const { name, chatRoom } = queryString.parse(location.search);

        socket = io(ENDPOINT);
        
        setName(name);
        setChatRoom(chatRoom);

        socket.emit('join', { name, chatRoom }, (error) => {
           if(error) {
               alert(error);
           }
        });
    }, [ENDPOINT, location.search]);

    useEffect( () => {
        socket.on('message', (message) => {
            //Push new message to array of messages
            setMessages([...messages, message]);
        })
        //Run useEffect only when the array of messages changes.
    }, [messages]);

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
                <input 
                    value={message} 
                    onChange={(event) => setMessage(event.target.value)} 
                    onKeyPress={(event) => event.key === 'Enter' ? sendMessage(event) : null }
                    />
            </div>
        </div>
    );
}

export default Chat;