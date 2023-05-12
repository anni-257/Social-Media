const router=require("express").Router();
const {getAllPostsController}=require("../controllers/postsController");
const requireUser=require("../middlewares/requireUser")

router.get('/all',requireUser,getAllPostsController);

module.exports=router;

