const jwt= require("jsonwebtoken");
const user= require("../Models/User");
const sendMail= require("../Utils/sendEmail");
const bcrypt= require("bcryptjs");

async function Register (req, res, next) {
    try {
        const token= await jwt.sign({name: req.body.userName, email: req.body.email}, "afjaiefajdsbfliasdfaeuu", {expiresIn: 300})
        const userProfile= new user(req.body)
        userProfile.tokens.push({token: token})
        userProfile.password= await bcrypt.hash(req.body.password, 10)
        await userProfile.save();
        sendMail(req.body.email, token)
        res.json(userProfile);
    } catch (error) {
        if (error.code === 11000) {
            res.send({
                error: true,
                message: " is already taken!!",
                errorkey: error.keyValue.email || error.keyValue.userName
            })
        } else {
            res.send({
                error: true,
                message: "an error occurred"
            })
        }
    }
}
module.exports= {Register};