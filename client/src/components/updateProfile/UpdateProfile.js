import React, { useEffect, useState } from 'react'
import "./UpdateProfile.scss"
import DummyImg from "../../assets/user.png"
import { useDispatch, useSelector } from 'react-redux'
import { updateMyProfile } from '../../redux/slices/appConfigSlice';

function UpdateProfile() {
  const myProfile=useSelector(state => state.appConfigReducer.myProfile)
  const [name,setName]=useState("");
  const [bio,setBio]=useState("");
  const [userImg,setUserImg]=useState("");
  const dispatch=useDispatch();
  useEffect(()=>{
    setName(myProfile?.name || '') // sending null instead of error
    setBio(myProfile?.bio || '')
    setUserImg(myProfile?.avatar?.url || '')
  },[myProfile])

  function handleSubmit(e){
    e.preventDefault();
    dispatch(updateMyProfile({
      name,
      bio,
      userImg
    }))
  }

  function handleImageChange(e){
    const file=e.target.files[0];
    const fileReader= new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onload=()=>{
      if(fileReader.readyState===fileReader.DONE){
        setUserImg(fileReader.result)
      }
    }
  }

  return (
    <div className='updateProfile'>
      <div className='container'>
        <div className='left-part'>
          <div className='input-user-img'>
            <label htmlFor='inputImg' className='labelImg'>
              <img src={userImg ? userImg : DummyImg} alt={name}/>
            </label>
            <input className='inputImg' id="inputImg" type="file" accept='image/*' onChange={handleImageChange}/>
          </div>
        </div>
        <div className='right-part'>
          <form className='form-flex' onSubmit={handleSubmit}>
            <input value={name} type='text' placeholder='Your Name' onChange={(e)=> setName(e.target.value)}/>
            <input value={bio} type='text' placeholder='Your Bio' onChange={(e)=> setBio(e.target.value)}/>
            <input type='submit' className='btn-primary' onClick={handleSubmit}/>

          </form>
        </div>
      </div>
      <button className='delete-account btn-primary'>Delete Account</button>
    </div>
  )
}

export default UpdateProfile