import React, { useEffect, useState } from 'react'
import Avatar from '../avatar/Avatar'
import "./Follower.scss"
import { useDispatch, useSelector } from 'react-redux'
import { followAndFollowingUser } from '../../redux/slices/feedSlice';
import { useNavigate } from 'react-router-dom';


function Follower({user}) {

  const navigate=useNavigate();

  const dispatch=useDispatch();
  const feedData=useSelector(state => state.feedDataReducer.feedData)
  const [isFollowing,setIsFollowing] = useState("");

  useEffect(()=>{
    setIsFollowing(feedData.followings.find(item => item?._id === user?._id))
  }, [feedData])

  function handleUserFollow(){
    dispatch(followAndFollowingUser({
      userIdToFollow: user?._id
    }))
  }
  return (
    <div className='follower'>
        <div className='user-info' onClick={()=> navigate(`profile/${user?._id}`)} >
            <Avatar src={user?.avatar?.url}/>
            <h4 className='name'>{user?.name}</h4>
        </div>
        <h5 onClick={handleUserFollow} className={isFollowing ? 'hover-link follow-link btn-secondary' :"btn-primary" } >{isFollowing ? 'Unfollow' : 'Follow'}</h5>

        
    </div>
  )
}

export default Follower