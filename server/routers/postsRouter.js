const router=require("express").Router();
const { createPostController, likeAndUnlikeController, updatePostController, deletePostController}=require("../controllers/postsController");
const requireUser=require("../middlewares/requireUser")

router.post('/',requireUser,createPostController);
router.put('/',requireUser,updatePostController);
router.post('/like',requireUser,likeAndUnlikeController);
router.delete('/',requireUser,deletePostController);

module.exports=router;

