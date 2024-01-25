const mongoose= require("mongoose");
const { stringify } = require("querystring");

const userSchema= new mongoose.Schema({
    userName: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    isVerified: {
        type: Boolean,
        required: true,
        default: false
    }, 
    password: {
        type: String,
        required: true,
        minLength: 8
    },
    tokens: [
        {token: String}
    ]
})

const user= mongoose.model("user", userSchema);
module.exports= user ;