const express=require("express");
const dotenv=require("dotenv");
dotenv.config("./.env");
const mongoConnect=require("./dbConnect")
const authRouter=require("./routers/authRouter");
const postsRouter=require("./routers/postsRouter");
const morgan = require("morgan");
const cookieParser=require("cookie-parser");

const app=express();

// Middlewares
app.use(morgan("common"))
app.use(express.json());
app.use(cookieParser());
app.use('/auth',authRouter);
app.use('/posts',postsRouter);
 
app.use('/',(req,res)=>{
    return res.send("Okay From Server side");
})

const PORT= process.env.PORT || 3000;

mongoConnect();

app.listen(PORT,()=>{
    console.log("listening on port number: "+PORT);
})