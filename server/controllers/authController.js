const User=require("../models/User"); // user collection from mongoDb atlas
const bcrypt=require("bcrypt"); // hash password
const jwt=require("jsonwebtoken"); // web token
const {error,success}=require("../utils/responseWrapper")


const signupController=async (req,res) =>{
    try {
        
        const {email,password}=req.body;

        if(!email || !password){
            //Bad Request
            return res.send(error(400,"Email and Password are required..🙂"))
        }

        const oldUser=await User.findOne({email});
        if(oldUser){
            // Conflict
            return res.send(error(409,"User is already registered..🥲"))
        }

        const hashedPassword=await bcrypt.hash(password,10); // saltRounds 10

        // const user=new User({
        //     email,
        //     password:hashesPassword
        // })

        // await user.save();

        const user=await User.create({
            email,
            password:hashedPassword // storing new password
        })

        res.send(success(201,{
            user
        }))

    } catch (err) {
        console.log(err);
    }
}

const loginController=async (req,res)=>{
    try {

        const {email,password}=req.body;

        if(!email || !password){
            return res.send(error(403,"Email and Password are required..🙂"));
        }

        const user=await User.findOne({email});
        if(!user){
            return res.send(error(404,"User id isn't registered..🥲"))
        }

        const matched=await bcrypt.compare(password,user.password);

        if(!matched){
            return res.send(error(403,"wrong password..😶"))
        }

        const accessToken=generateAccessToken({
            _id:user._id,
            // email:user.email,
            // password:user.password
        });

        const refreshToken=generateRefreshToken({
            _id:user._id
        });

        res.cookie("jwt",refreshToken,{
            // from server to client
            httpOnly:true,
            secure:true
        })

        return res.send(success(200,{accessToken}))

    } catch (err) {
        console.log(err);
    }

}

// this api will check RefreshToken validity and generate a new AccessToken
const refreshAccessTokenController=async (req,res)=>{
    // const {refreshToken} =req.body;
    // if(!refreshToken){
    //     return res.status(403).send("Refresh Token Required..!!");
    // }

    const cookies=req.cookies; // this can be send empty 

    if(!cookies.jwt){
        return res.send(error(403,"Refresh Token In Cookie Required..!!"));
    }

    const refreshToken=cookies.jwt;

    try {
        const decode=jwt.verify(refreshToken,process.env.REFRESH_TOKEN_PRIVATE_KEY);
        const _id=decode._id;

        const accessToken=generateAccessToken({ _id });

        return res.send(success(200,{accessToken}))
        
    } catch (err) {
        console.log(err);
        return res.send(error(401,"Invalid refresh key"));
    }


}

// Internal Functions

const generateAccessToken=(data)=>{
    try{

        const token=jwt.sign(data,process.env.ACCESS_TOKEN_PRIVATE_KEY,{
            expiresIn:"15m"
        });
        return token;
    }catch(err){
        console.log(err)
    }
}

const generateRefreshToken=(data)=>{
    try{
        const token=jwt.sign(data,process.env.REFRESH_TOKEN_PRIVATE_KEY,{
            expiresIn:'1y'
        });
        return token;
    }catch(err){
        console.log(err)
    }
}

module.exports={
    signupController,
    loginController,
    refreshAccessTokenController
}

