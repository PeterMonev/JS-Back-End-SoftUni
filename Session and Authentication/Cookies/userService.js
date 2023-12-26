const bcrypt = require('bcrypt')
const users = [];

async function register(username,password){
    if(users.find(u => u.username.toLowerCase() === username)){
        throw new Error('Username is taken')
    }

    const user = {
        username,
        hashedPassword: await bcrypt.hash(password,10)
    }
    users.push(user);
};

async function login(username,password){
    const user = users.find(u => u.username.toLowerCase() === username.toLowerCase());
    
    if(!user){
         return false;
    } else {
        const succes = await bcrypt.compare(password,user.hashedPassword);
        if(succes){
            user.failedAttempts = 0;
            return true;
        } else {
                user.failedAttempts++
                return false;
        }
    }
}

module.exports = {
    users,
    register,
    login
}