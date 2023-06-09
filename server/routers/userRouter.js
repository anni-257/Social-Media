const router=require("express").Router();
const requireUser = require("../middlewares/requireUser");
const userController=require("../controllers/userController")

router.post('/follow',requireUser,userController.followOrUnFollowController);
router.get('/getFeedData',requireUser,userController.getPostsOfFollowingController);
router.get('/getMyPosts',requireUser,userController.getMyPostsController);
router.get('/getUserPosts',requireUser,userController.getUserPostsController);
router.delete('/',requireUser,userController.deleteMyProfileController);
router.get('/getMyInfo',requireUser,userController.getMyInfoController)
router.put('/',requireUser,userController.updateUserProfileController)
router.post('/getUserProfile',requireUser,userController.getUserProfileController)

module.exports=router;
