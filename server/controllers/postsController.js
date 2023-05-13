const { success } = require("../utils/responseWrapper")

const getAllPostsController=async (req,res)=>{
    return res.send(success(200,"These are all the posts"))
}

module.exports={
    getAllPostsController
}