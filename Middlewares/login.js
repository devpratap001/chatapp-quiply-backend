const jwt= require("jsonwebtoken")
const user= require("../Models/User");
const sendMail= require("../Utils/sendEmail");
const bcrypt= require("bcryptjs")

async function Login(req, res, next) {
    try {
        const match= await user.findOne({email: req.body.email})
        if (match){
            bcrypt.compare(req.body.password, match.password, async function (err, status) {
                try{
                    if (status){
                        if (match.isVerified){
                            const token= await match.generateJWTtoken();
                            res.cookie("authToken", token, {
                                Domain: "http://localhost:3000",
                                maxAge: 1000*60*60,
                                httpOnly: true
                            })
                            res.send({
                                error: false,
                                profile: {
                                    _id: match._id,
                                    email: match.email,
                                    userName: match.userName
                                }
                            })
                        } else {
                            const token= await jwt.sign({name: req.body.userName, email: req.body.email}, "afjaiefajdsbfliasdfaeuu", {expiresIn: 300})
                            await user.updateOne({email: req.body.email}, {$push: {"tokens": {"token":token}}});
                            sendMail(req.body.email, token)
                            res.send({
                                error: true,
                                message: "Verification Link has been sent to your mail. Please Verify!"
                            })
                        }
                    } else {
                        res.send({
                            error: true,
                            message: "Invalid Login Credentials!"
                        })
                    }
                } catch (error) {
                    console.log(error)
                }
            })
        } else {
            res.send({
                error: true,
                message: "Invalid Login Credentials"
            })
        }
    } catch (error) {
        console.log(error);
    }
}
module.exports= {Login}