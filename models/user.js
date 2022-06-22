const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    id:{
        type: String,
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
        
    },
    password: {
        type: String,
        required: true,
        length: [5, 32]
    }
});

module.exports = mongoose.model('User', userSchema);
