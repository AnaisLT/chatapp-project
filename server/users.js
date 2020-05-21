//Managing users
const users = [];

const addUser = ({ id, name, chatRoom}) => {
    name = name.trim().toLowerCase();
    chatRoom = chatRoom.trim().toLowerCase();

    //Check for existing users to prevent users with the same username to sign in 
    const existingUser = users.find((user) => user.chatRoom === chatRoom && user.name === name); 
    //If username already exists, display error message
    if(existingUser) {
        return { error: 'Username is taken.' };
    }
    // if not create new user
    const user = { id, name, chatRoom };
    users.push(user);
    return { user };
}

const removeUser = (id) => {
    const index = users.findIndex((user) => user.id === id);
    
    if(index !== -1) {
        return users.splice(index, 1)[0];
    }
}


const getUser = (id) => {
    users.find((user) => user.id === id);
}

const getUsersInRoom = (chatRoom) => {
    //Find all users from a specific room and return them
    users.filter((user) => user.chatRoom === chatRoom);
}

module.exports = { addUser, removeUser, getUser, getUsersInRoom };