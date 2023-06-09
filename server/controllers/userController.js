const Post = require("../models/Post");
const User = require("../models/User");
const { error, success }=require("../utils/responseWrapper");
const cloudinary=require('cloudinary').v2;
const {mapPostOutput}=require("../utils/Utils")
const followOrUnFollowController=async(req,res)=>{
    try{
        const {userIdToFollow}=req.body;
        const curUserId=req._id;

        const userToFollow=await User.findById(userIdToFollow);
        const curUser=await User.findById(curUserId);

        if(!userToFollow){
            // extra check for security purpose.. hacker can mimic as a authenticated
            return res.send(success(404, "User to follow not found"))
        }

        if(userIdToFollow===curUserId){
            return res.send(error(409,"user cannot follow themselves"))
        }

        if(curUser.followings.includes(userIdToFollow)){
            // allready followed
            const followingIndex=curUser.followings.indexOf(userIdToFollow);
            curUser.followings.splice(followingIndex,1);

            const followerIndex=userToFollow.followers.indexOf(curUserId);
            userToFollow.followers.splice(followerIndex);

           
        }else{
            curUser.followings.push(userIdToFollow);
            userToFollow.followers.push(curUserId);
        }

        await curUser.save();
        await userToFollow.save();

        return res.send(success(200,{user : userToFollow}))

    }catch(e){
        console.log(e)
        return res.send(error(500,e.message))

    }
}

const getPostsOfFollowingController= async(req,res)=>{
    try {
        const curUserId=req._id;
        const curUser=await User.findById(curUserId).populate('followings');

        const fullPosts=await Post.find({
            'owner':{
                '$in':curUser.followings
            }
        }).populate('owner')

        const posts=fullPosts.map(item => mapPostOutput(item,req._id)).reverse()
        const followingsIds=curUser.followings.map(item => item._id)
        followingsIds.push(req._id)

        const suggestions= await User.find({
            _id:{
                '$nin':followingsIds
            }

        })

        return res.send(success(200,{...curUser._doc,suggestions,posts}))
    } catch (e) {
        console.log(e);
        return res.send(error(500,e.message))
    }
}

const getMyPostsController= async(req,res)=>{
    try {
        const curUserId=req._id;

        const allCurUserPosts=await Post.find({
            owner:curUserId
        }).populate('likes') // populate : show all information about user's who like the post and many more

        return res.send(success(200,{allCurUserPosts}));

        
    } catch (e) {
        return res.send(error(500,e.message));
    }
}

const getUserPostsController= async(req,res)=>{
    try {
        const userId=req.body.userId;
        if(!userId){
            return res.send(error(400,"userId is required"))
        }

        const allUserPosts=await Post.find({
            owner:userId
        }).populate('likes') // populate : show all information about user's who like the post and many more

        return res.send(success(200,{allUserPosts}));

        
    } catch (e) {
        return res.send(error(500,e.message));
    }
}

const deleteMyProfileController= async (req,res)=>{
    
    try {
        const curUserId=req._id;
        const curUser= await User.findById(curUserId);
        
        // delete all posts
        await Post.deleteMany({
            owner:curUserId
        })
        
        // removed myself from followings list of follower's 
        // mla jo pn konhi follow krto aahe tyacha following list madhun mi remove zalo pahije at the end
        curUser.followers.forEach( async (followerId) =>{
            const follower= await User.findById(followerId);
            const index=follower.followings.indexOf(curUserId);
            follower.followings.splice(index,1);
            await follower.save();
        })
        
        // mi jyanna follow krto tyanchya follower list madhun mi remove zalo pahije at the end
        curUser.followings.forEach( async(followingId) =>{
            const following=await User.findById(followingId);
            const index=following.followers.indexOf(curUserId);
            following.followers.splice(index,1);
            await following.save();
        })
        
        // remove myself from all posts like
        
        const allPosts=await Post.find();
        
        allPosts.forEach(async post => {
            const index=post.likes.indexOf(curUserId);
            if(index!==-1){
                post.likes.splice(index,1)
            }
            await post.save();
        })

        // delete user
        await curUser.deleteOne({ _id:curUserId});

        res.clearCookie('jwt',{
            httpOnly:true,
            secure:true
        })

        return res.send(success(200,"user deleted"));

    } catch (e) {
        return res.send(error(500,e.message))
    }
}

const getMyInfoController=async(req,res)=>{
    try {

        const user=await User.findById(req._id);
        return res.send(success(200,{user}));

    } catch (e) {
        return res.send(error(500,e.message))
    }
}

const updateUserProfileController=async(req,res)=>{
    try {
        const {name,bio,userImg}= req.body;
        const user=await User.findById(req._id);

        if(name){
            user.name=name;
        }
        if(bio){
            user.bio=bio;
        }
        if(userImg){
            const cloudImg=await cloudinary.uploader.upload(userImg, {
                folder:'profileImg'
            })
            user.avatar={
                url: cloudImg.secure_url,
                publicId:cloudImg.public_id
            }
            await user.save();
            return res.send(success(200,{user}))
        }

    } catch (e) {
        return res.send(error(500,e.message))
    }
}

const getUserProfileController= async (req,res)=>{
    try {
        const userId= req.body.userId;
        const user=await User.findById(userId).populate({
            path:'posts',
            populate:{
                path:'owner'
            }
        })
        const fullPosts=user.posts;
        const posts= fullPosts.map(item => mapPostOutput(item,req._id)).reverse();

        return res.send(success(200,{...user._doc,posts})) // user._doc send only require info without mongoose etc data

    } catch (e) {
        return res.send(error(500,e.message));
    }
} 



module.exports={
    followOrUnFollowController,
    getPostsOfFollowingController,
    getMyPostsController, // getMyPosts
    getUserPostsController, // getUserPosts
    deleteMyProfileController, // deleteMyProfile
    getMyInfoController,
    updateUserProfileController,
    getUserProfileController
}