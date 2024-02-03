const mongoose= require("mongoose");
const jwt= require("jsonwebtoken");

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
    ],
    authTokens: [
        {token: String}
    ]
})

userSchema.methods.generateJWTtoken= async function () {
    const token= await jwt.sign({_id: this._id}, "thisisajsonwebtokensecretkeyforgeneratingauthtokens");
    this.authTokens.push({token: token});
    await this.save();
    return token
}

const user= mongoose.model("user", userSchema);
module.exports= user ;