const express= require("express");
const Auth = require("../Middlewares/auth");
const cookieParser= require("cookie-parser");
const cors= require("cors");
const user= require("../Models/User");
const chat= require("../Models/chat");
const mongoose= require("mongoose");

function chatRoute (io){
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
        res.send({error: false, profile: {_id: req.user._id, userName: req.user.userName}})
    })
    
    chatRouter.get("/allusers/:userId", async function (req, res) {
        try {
            const users= await user.find({}, {email:1, userName:1, _id:1});
            const userList= users.filter(elem => elem._id.toString() !== req.params.userId.toString())
            res.send(userList)
        } catch (error) {
            res.send({error: true, message: error.message})
        }
    })
    
    chatRouter.get("/getcontacts/:contactId", async function (req, res) {
        try {
            const contacts= []
            const contactsFound= await user.findOne({_id: req.params.contactId}, {_id:0, contacts:1});
            for(let contact of contactsFound.contacts){
                responseUser= await user.findOne({_id: new mongoose.Types.ObjectId(contact)}, {_id:1, email:1, userName:1});
                contacts.push(responseUser);
            };
            res.send(contacts);
        } catch (error) {
            res.send({error: true, message: error.message})
        }
    })
    chatRouter.get("/getmessages/:from/:to", async function(req, res) {
        try {
            const {from, to}= req.params;
            const [responseOne, responseTwo]= await Promise.all([chat.findOne({from:from, to:to}, {_id:0, messages:1}).exec(), chat.findOne({from:to, to:from}, {_id:0, messages:1}).exec()])
            const firstResponse= [];
            const secondResponse= [];
            responseOne.messages.forEach(elem => {
                firstResponse.push({classType: "outgoing", message: elem.message, date: elem.date})
            });
            responseTwo.messages.forEach(elem => {
                secondResponse.push({classType: "incoming", message: elem.message, date:elem.date})
            });
            res.send([...firstResponse, ...secondResponse])
        } catch (error) {
            console.log(error)
        }
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
    });
    
    // socket io connection events 
    io.on("connection", function (socket) {
        socket.data= socket.handshake.auth;
        socket.on("sent_message", async (data) => {
            try {
                const contactSocketList = await io.fetchSockets()
                const contactSocket= contactSocketList.filter(elem => elem.data.myId === socket.data.contactId);
                if (contactSocket[0]){
                    contactSocket[0].emit("sent_message_server", {classType: "incoming", message: data.message, date: data.date})
                    const chatMessageElem= await chat.findOne({from: socket.data.myId, to: socket.data.contactId});
                    if (chatMessageElem){
                        chatMessageElem.messages.push({message:data.message, date: new Date(Date.now())});
                        await chatMessageElem.save();
                    } else {
                        const newChat= new chat({from: socket.data.myId, to: socket.data.contactId, messages:[{message: data.message, date: new Date(Date.now())}]})
                        await newChat.save()
                    }
                    const contactUser= await user.findOne({_id: new mongoose.Types.ObjectId(socket.data.contactId)})
                    if (! contactUser.contacts.includes(socket.data.myId)){
                        contactUser.contacts.push(socket.data.myId)
                        await contactUser.save();
                    }
                } else {
                    console.log(contactSocketList)
                }
            } catch (error) {
                console.log(error)
            }
        })
    })

    return chatRouter
}


module.exports= chatRoute ;