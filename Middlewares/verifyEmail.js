const jwt= require("jsonwebtoken");
const user= require("../Models/User");

async function VerifyEmail (req, res, next) {
    try {
        const verificationToken= req.params.verificationToken ;
        const userData= await jwt.verify(verificationToken, "afjaiefajdsbfliasdfaeuu");
        if (userData.email) {
            const verifiedUser= await user.updateOne({email: userData.email}, {$set: {isVerified: true, tokens: []}})
            res.json(verifiedUser);
        }
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError){
            res.send({error: "true", message: error.message})
            return
        }
        res.send({error: error.name, message: error.message});
    }

}
module.exports= {VerifyEmail}