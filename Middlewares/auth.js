const jwt = require("jsonwebtoken")
const user = require("../Models/User");

async function Auth(req, res, next) {
    try {
        if (req.cookies.authToken){
            const match = user.findOne({ email: req.body.email })
            const VerificationResponse = await jwt.verify(req.cookies.authToken, "thisisajsonwebtokensecretkeyforgeneratingauthtokens")
            req.user= await user.findOne({_id:VerificationResponse._id})
            req.token= req.cookies.authToken
            next();
        } else {
            res.send({error: true, message: "No Token found"});
        }

    } catch (error) {
        if (error.name === "TokenExpiredError") {
            res.send({ error: true, message: error.message })
        } else if (error.name === "JsonWebTokenError"){
            res.send({error: true, message: error.message})
        } else {
            console.log(error);
        }
    }
};

    module.exports = Auth;