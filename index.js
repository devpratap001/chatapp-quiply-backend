require("dotenv").config();
const express= require("express");
const {createServer} = require("http");
const mongoose = require("mongoose");
const cookieParser= require("cookie-parser");
const cors= require("cors");
const {Register}= require("./Middlewares/register");
const {Login} = require("./Middlewares/login");
const {VerifyEmail} = require("./Middlewares/verifyEmail");
const chatRoute = require("./Router/chatapp");
const {Server} = require("socket.io");

const port= process.env.PORT || 5000 ;
const app= express();
const server= createServer(app);
const io= new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        credentials: true
    }
});

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use(cors({origin: "http://localhost:3000", credentials: true}))
app.use("/chatapp", chatRoute(io));

mongoose.connect(process.env.DATABASE_KEY)
.then(() => {console.log("mongodb connected successfully");})
.catch((err) => {console.error(err)});

app.post("/register", Register)

app.post("/login", Login)

app.get("/verifyUser/:verificationToken", VerifyEmail)

server.listen(port, () => {
    console.log(`server started at the port ${port}`);
})