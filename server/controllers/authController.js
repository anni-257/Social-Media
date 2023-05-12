const User=require("../models/User"); // user collection from mongoDb atlas
const bcrypt=require("bcrypt"); // hash password
const jwt=require("jsonwebtoken"); // web token


const signupController=async (req,res) =>{
    try {
        
        const {email,password}=req.body;

        if(!email || !password){
            res.status(400).send("Email and Password are required..🙂"); //Bad Request
            return
        }

        const oldUser=await User.findOne({email});
        if(oldUser){
            res.status(409).send("User is already registered..🥲"); // Conflict
            return
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

        res.status(201).send({
            user
        })

    } catch (error) {
        console.log(error);
    }
}

const loginController=async (req,res)=>{
    try {

        const {email,password}=req.body;

        if(!email || !password){
            res.status(403).send("Email and Password are required..🙂");
            return
        }

        const user=await User.findOne({email});
        if(!user){
            res.status(404).send("User id isn't registered..🥲");
            return
        }

        const matched=await bcrypt.compare(password,user.password);

        if(!matched){
            res.status(403).send("wrong password..😶");
            return
        }

        const accessToken=generateAccessToken({
            _id:user._id,
            // email:user.email,
            // password:user.password
        });

        const refreshToken=generateRefreshToken({
            _id:user._id
        });

        return res.status(200).send({accessToken,refreshToken});

    } catch (error) {
        console.log(error);
    }

}

const refreshAccessTokenController=async (req,res)=>{
    const {refreshToken} =req.body;
    if(!refreshToken){
        return res.status(403).send("Refresh Token Required..!!");
    }

    try {
        const decode=jwt.verify(refreshToken,process.env.REFRESH_TOKEN_PRIVATE_KEY);
        const _id=decode._id;

        const accessToken=generateAccessToken({ _id });

        return res.status(201).json({accessToken});
        
    } catch (error) {
        console.log(error);
        return res.status(401).send("Invalid refresh key");
    }


}

// Internal Functions

const generateAccessToken=(data)=>{
    try{

        const token=jwt.sign(data,process.env.ACCESS_TOKEN_PRIVATE_KEY,{
            expiresIn:"20s"
        });
        return token;
    }catch(error){
        console.log(error)
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

