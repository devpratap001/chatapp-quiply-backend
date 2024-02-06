const user= require("../Models/User");
const mongoose= require("mongoose");

async function addToContacts(userId, contactId){
    try {
        await user.updateOne({_id: new mongoose.Types.ObjectId(userId)}, {$push: {contacts: contactId.toString()}})
        return {error: false, message: "contact updated"}
    } catch (error) {
        return {error: true, message: error.message}
    }
};
module.exports= addToContacts