import React from 'react'
import { KEY_ACCESS_TOKEN, getItem } from '../utils/localStorageManager'
import { Navigate, Outlet } from 'react-router-dom';

function RequireUser() {

    const user=getItem(KEY_ACCESS_TOKEN);
    console.log("required user called")
    console.log(user)
  return (
    user ? <Outlet/> : <Navigate to='/login'/>
  )
}

export default RequireUser