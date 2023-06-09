 import React, { useState } from 'react'
 import "./CreatePost.scss"
 import backgroundDummyImg from "../../assets/dummyGirl_img.jpg"
 import Avatar from '../avatar/Avatar'
 import {BsCardImage} from "react-icons/bs"
 import {axiosClient} from "../../utils/axiosClient"
 import {useDispatch, useSelector} from "react-redux"
 import {setLoading} from "../../redux/slices/appConfigSlice"
import { getUserProfile } from '../../redux/slices/postsSlice'

 function CreatePost() {

    const [postImg,setPostImg]=useState("");
    const [caption,setCaption]=useState("");
    const myProfile=useSelector(state => state.appConfigReducer.myProfile)

    const dispatch=useDispatch();

    function handleImageChange(e){
        const file=e.target.files[0];
        const fileReader= new FileReader();
        fileReader.readAsDataURL(file);
        fileReader.onload=()=>{
            if(fileReader.readyState===fileReader.DONE){
                setPostImg(fileReader.result)
            }
        }
    }

    async function handleSubmitButton(e){
        try {
            e.preventDefault();
            dispatch(setLoading(true))
            const result=await axiosClient.post('/posts',{
                caption,
                postImg
            })
            dispatch(getUserProfile({
                userId:myProfile?._id
            }))

            // console.log("Post Done", result)

        } catch (error) {
            console.log(error);
        }finally{
            dispatch(setLoading(false))
            setCaption('');
            setPostImg('');
        }
    }

   return (
     <div className='create-post'>
        <div className='left'>
            <Avatar src={myProfile?.avatar?.url}/>
        </div>
        <div className='right'>
            
            <input value={caption} type="text" className='captionInput' placeholder="What's on your mind?" onChange={(e)=> setCaption(e.target.value)}/>

            {postImg && (
                <div className='img-container'>
                    <img className='post-img' src={postImg} alt="" />
                </div>
            )}

            <div className='bottom-part'>
                <div className='input-post-img'>
                    <label htmlFor='inputImg' className='labelImg'>
                        <BsCardImage/>
                    </label>
                    <input className='inputImg' id="inputImg" type="file" accept='image/*' onChange={handleImageChange}/>
                </div>
                <button className='post-btn btn-primary' onClick={handleSubmitButton}>Post</button>
            </div>
        </div>

     </div>
   )
 }
 
 export default CreatePost