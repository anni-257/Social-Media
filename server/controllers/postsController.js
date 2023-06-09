const Post = require("../models/Post");
const User = require("../models/User");
const { mapPostOutput } = require("../utils/Utils");
const { success, error } = require("../utils/responseWrapper")
const cloudinary=require("cloudinary").v2;


const createPostController=async (req,res)=>{
    try {
            const {caption,postImg}=req.body;
            const owner=req._id;

            if(!caption || !postImg){
                return res.send(error(400,"caption and postImg is required"))
            }

            const cloudImg=await cloudinary.uploader.upload(postImg,{
                folder:"postImg"
            })

            const user=await User.findById(owner);
            const post=await Post.create({
                    owner,
                    caption,
                    image:{
                        publicId:cloudImg.publicId,
                        url:cloudImg.secure_url
                    }
            })

            console.log("post: ",post);

            user.posts.push(post._id);
            await user.save();

            return res.send(success(201,{post}))

    } catch (e) {
            return res.send(error(500,e.message))
    }
}

const likeAndUnlikeController=async(req,res)=>{
    try {
        const {postId}=req.body;
        console.log(postId);
        const curUserId=req._id;
        console.log(curUserId);
        const post=await Post.findById(postId).populate('owner');
        if(!post){
            return res.send(404,"post not found");
        }
        if(post.likes.includes(curUserId)){
            const index=post.likes.indexOf(curUserId);
            post.likes.splice(index,1);
            
        }else{
            post.likes.push(curUserId);
        }

        await post.save();
        return res.send(success(200,{post: mapPostOutput(post,req._id)}))
    } catch (e) {
        return res.send(500,e.message);
    }
}

const updatePostController=async(req,res)=>{
    try {
        const userId=req._id;
        // console.log(userId);
        const {postId,caption}=req.body;

        if(!postId || !caption){
            return res.send(error(400,"postId and caption required"))
        }
       
        const post=await Post.findById(postId);
        if(!post){
           return res.send(error(404,"post not found"))
        }
        // console.log(post.owner.toString());
        if(post.owner.toString() !== userId){
            return res.send(error(403,"Only owners can update their posts"))
        }
        
        if(caption){
            post.caption=caption
        }
        
        await post.save();
        return res.send(success(200,post))
    } catch (e) {
        return res.send(error(500,e.message))
   }

}

const deletePostController=async(req,res)=>{
    try {
        const {postId}=req.body;
        const userId=req._id;

        if(!postId){
            return res.send(error(400,"postId is required"))
        }

        const post=await Post.findById(postId);
        const user=await User.findById(userId);

        if(!post){
            return res.send(error(404,"post not found"))
        }

        if(post.owner.toString() !== userId){
             return res.send(error(403,"Only owners can delete their posts"))
        }

        const index=user.posts.indexOf(postId);
        user.posts.splice(index,1);
        await user.save();
        // post.remove({"_id":postId}) does not worked
        await Post.deleteOne({"_id":postId});

        res.send(success(200,"post deleted successfully"))

    } catch (e) {
        res.send(error(500,e.message));
    }

}

module.exports={
    createPostController,
    likeAndUnlikeController,
    updatePostController,
    deletePostController
}