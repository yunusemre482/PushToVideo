const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
    name:{
        type: String,
        min : 6,
        required: true,
        max:255
    },
    username:{
        type: String,
        min : 6,
        required: true,
        max:255,
    },

    email:{
        type: String,
        min : 6,
        required: true,
        max:255,
    },
    password:{
        type: String,
        min : 6,
        required: true,
        max:1024, 
    },
    date:{
        type:Date,
        default:Date.now
    }
});

module.exports = mongoose.model('User', userSchema);

