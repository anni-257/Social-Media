import Avatar from "../avatar/Avatar"
import "./Post.scss"
import fakePost from "../../assets/fakePost.jpg"
import {AiFillHeart, AiOutlineHeart} from "react-icons/ai"
import { useDispatch } from "react-redux"
import {useNavigate} from "react-router-dom"
import { likeAndUnlikePost } from "../../redux/slices/postsSlice"
import { showToast } from "../../redux/slices/appConfigSlice"
import { TOAST_SUCCESS } from "../../App"
const Post=({post})=>{
    const navigate=useNavigate();
    const dispatch=useDispatch();
    async function handlePostLiked(){
        dispatch(showToast({
            type:TOAST_SUCCESS,
            message:'liked or unliked'
        }))
        dispatch(likeAndUnlikePost({
            postId: post._id
        }))
    }
    return (
        <div className="post">
            <div className="heading" onClick={()=> navigate(`/profile/${post?.owner?._id}`)}>
                <Avatar src={post?.owner?.avatar?.url}/>
                <h4>{post?.owner?.name}</h4>
            </div>
            <div className="content">
                <img src={post?.image.url} alt="post"/>
            </div>
            <div className="footer">
                <div className="like" onClick={handlePostLiked}>
                    {post?.isLiked ? <AiFillHeart style={{color:"red"}} className="like-icon"/> : <AiOutlineHeart className="like-icon"/>}
                    <h4>{`${post?.likesCount} Likes`}</h4>
                </div>
                <p className="caption">{post?.caption}</p>
                <h6 className="time-ago">{post?.timeAgo}</h6>
            </div>
        </div>
    )
}

export default Post;