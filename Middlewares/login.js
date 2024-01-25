const mongoose= require("mongoose");
const jwt= require("jsonwebtoken")
const user= require("../Models/User");
const sendMail= require("../Utils/sendEmail");

async function Login(req, res, next) {
    try {
        const match= await user.findOne({email: req.body.email})
        if (match){
            if (req.body.password === match.password) {
                if (match.isVerified){
                    res.json({
                        error: false,
                        profile: {
                            email: match.email,
                            userName: match.userName
                        }
                    })
                } else {
                    const token= await jwt.sign({name: req.body.userName, email: req.body.email}, "afjaiefajdsbfliasdfaeuu", {expiresIn: 300})
                    await user.updateOne({email: req.body.email}, {$push: {"tokens": {"token":token}}});
                    sendMail(req.body.email, token)
                    res.json({
                        error: true,
                        message: "Verification Link has been sent to your mail. Please Verify!"
                    })
                }
            } else {
                res.json({
                    error: true,
                    message: "Invalid Login Credentials!"
                })
            }
        } else {
            res.json({
                error: true,
                message: "Invalid Login Credentials"
            })
        }
    } catch (error) {
        console.log(error);
    }
}
module.exports= {Login}