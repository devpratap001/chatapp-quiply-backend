const mongoose= require("mongoose");

const chatSchema= new mongoose.Schema({
    from: String,
    to: String,
    messages: [{
        message: String,
        date: {
            type: Date,
            default: new Date(Date.now())
        }
    }]
})

const chat= mongoose.model("chat", chatSchema);
module.exports= chat ;