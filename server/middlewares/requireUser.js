const jwt=require("jsonwebtoken");
const { error, success } = require("../utils/responseWrapper");
const User = require("../models/User");
module.exports=async (req,res,next)=>{
    if(!req.headers || !req.headers.authorization || !req.headers.authorization.startsWith("Bearer")){
        return res.send(error(401,"Authorization header is required"));
    }

    // req?.headers?.authorization?.startsWith("Bearer") 

    const accessToken=req.headers.authorization.split(" ")[1];
    console.log("This is Access Token: ",accessToken);
    
    try{
        const decode=jwt.verify(accessToken,process.env.ACCESS_TOKEN_PRIVATE_KEY);
        console.log("decode: ",decode);
        req._id=decode._id;
        const user=await User.findById(req._id);
        // extra layer check for insomnia for deleteMyProfile 
        // if(!user){
        //     return res.send(error(404,"User Not found"));
        // }
        next();
    }catch(err){
        // console.log("error from requireUser: ",err);
        return res.send(error(401,"Invalid access key"));
    }
}