const express=require("express");
const dotenv=require("dotenv");
dotenv.config("./.env");
const mongoConnect=require("./dbConnect")
const authRouter=require("./routers/authRouter");
const postsRouter=require("./routers/postsRouter");
const userRouter=require("./routers/userRouter")
const morgan = require("morgan");
const cookieParser=require("cookie-parser");
const cors=require("cors");
const cloudinary= require('cloudinary').v2;
const app=express();
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb'}));

// configuration for cloudinary
cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET 
  });

// Middlewares
app.use(morgan("common"))
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    credentials:true,
    origin:"http://localhost:3000" // we can give array as well/ Allow from this address to access resource
}))
app.use('/auth',authRouter);
app.use('/posts',postsRouter);
app.use('/user',userRouter);


 
app.use('/',(req,res)=>{
    return res.send("Okay From Server side");
})

const PORT= process.env.PORT || 3000;

mongoConnect();

app.listen(PORT,()=>{ // if resolve call this function
    console.log("listening on port number: "+PORT);
})