const express= require("express");
const {createServer} = require("http");
const mongoose = require("mongoose");
const cors= require("cors");
const {Register}= require("./Middlewares/register");
const {Login} = require("./Middlewares/login");
const {VerifyEmail} = require("./Middlewares/verifyEmail");

const port= process.env.PORT || 5000 ;
const app= express();
const server= createServer(app);

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors())

mongoose.connect("mongodb://127.0.0.1:27017/Quiply")
.then(() => {console.log("mongodb connected successfully");})
.catch((err) => {console.error(err)});

app.post("/register", Register)

app.post("/login", Login)

app.get("/verifyUser/:verificationToken", VerifyEmail)

server.listen(port, () => {
    console.log(`server started at the port ${port}`);
})