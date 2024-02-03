const express= require("express");
const Auth = require("../Middlewares/auth");
const cookieParser= require("cookie-parser");
const cors= require("cors");

const chatRouter= express.Router();

chatRouter.use(express.json());
chatRouter.use(express.urlencoded({extended: true}));
chatRouter.use(cookieParser());
chatRouter.use(cors({origin: "http://localhost:3000", credentials: true}))

chatRouter.use(function (req, res, next) {
    res.header("Access-Control-Allow-Credentials", true);
    res.header("Access-Control-Allow-headers", "origin, content-type, accept, set-cookie")
    next();
})

chatRouter.get("/checkAuthenticated", Auth, async function (req, res, next) {
    res.send({error: false, message: "you can proceed"})
})

chatRouter.get("/logout", Auth, async function (req, res, next) {
    try {
        res.clearCookie("authToken")
        req.user.authTokens= req.user.authTokens.filter(elem => {
            return elem.token !== req.token
        })
        await req.user.save()
        res.send({error: false, message: "logout successfull"})
    } catch (error) {
        res.send(error)
    }
})

module.exports= chatRouter ;