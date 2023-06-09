import Post from '../post/Post'
import "./Profile.scss"
import userImg from "../../assets/user.png"
import { useNavigate, useParams } from 'react-router-dom'
import CreatePost from '../createPost/CreatePost'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import { getUserProfile } from '../../redux/slices/postsSlice'
import { followAndFollowingUser } from '../../redux/slices/feedSlice'
import dummyImg from "../../assets/user.png"
const Profile=()=>{
    const navigate=useNavigate();
    const params= useParams();
    const dispatch=useDispatch();
    const [isMyProfile, setIsMyProfile]=useState("");
    const [isFollowing, setIsFollowing] = useState(false);
    const userProfile=useSelector(state => state.postsReducer.userProfile)
    const myProfile=useSelector(state => state.appConfigReducer.myProfile)
    const feedData=useSelector(state => state.feedDataReducer.feedData)
    useEffect(()=>{
        console.log("inside useEffect of Profile")
        dispatch(getUserProfile({
            userId:params.userId
        }))

        setIsMyProfile(myProfile?._id === params.userId)
        setIsFollowing(feedData?.followings?.find((item) => item?._id === params?.userId))
    },[myProfile, params.userId, feedData, isFollowing])

    function handleUserFollow(){
        dispatch(followAndFollowingUser({
            userIdToFollow: params?.userId
          }))
    }
    return(
        <div className="Profile">
            <div className="container">
                <div className="left-part">
                    {isMyProfile && <CreatePost/>}
                { userProfile?.posts?.map(post => <Post key={post._id} post={post}/> )}
                </div>
                <div className="right-part">
                    <div className='profile-card'>
                        <img className='user-img' src={userProfile?.avatar?.url ? userProfile?.avatar?.url : dummyImg }/>
                        <h3 className='user-name'>{userProfile?.name}</h3>
                        <p className='bio'>{userProfile?.bio}</p>
                        <div className='follower-info'>
                            <h4>{`${userProfile?.followers?.length} Followers`}</h4>
                            <h4>{`${userProfile?.followings?.length} Following`}</h4>
                        </div>
                        {!isMyProfile && (
                            <h5 style={{marginTop:"10px"}} onClick={handleUserFollow} className={isFollowing ? 'hover-link follow-link btn-secondary' :"btn-primary" } >{isFollowing ? 'Unfollow' : 'Follow'}</h5>
                        )}
                        
                        {isMyProfile && (
                            <button className=' update-profile btn-secondary' onClick={()=>{navigate('/updateProfile')}}>Update Profile</button>
                        )}
                        
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Profile 