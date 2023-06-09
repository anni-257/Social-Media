import { Link, useNavigate } from "react-router-dom";
import "./Login.scss"
import { useState } from "react";
import { axiosClient } from "../../utils/axiosClient";
import { setItem } from "../../utils/localStorageManager";
import { KEY_ACCESS_TOKEN } from "../../utils/localStorageManager";
const Login=()=>{
    const [email,setEmail]=useState("");
    const [password,setPassword]=useState("");
    const navigate=useNavigate();

    async function handleSubmit(e){

        try{
            
            e.preventDefault();
            const response=await axiosClient.post("/auth/login",{
                email,
                password
            })
            // console.log(response);
            setItem(KEY_ACCESS_TOKEN,response.result.accessToken);
            console.log("access-token: ",response.result.accessToken)
            navigate('/')

        }catch(err){
            console.log(err)
        }

    }
    return(
        <div className="login">
            <div className="loginBox">
                <h2 className="heading">Login</h2>
                <form className="flex" onSubmit={handleSubmit}>
                <label htmlFor="email">Email</label>
                <input className="email" type="text" placeholder="abc@gmail.com" id="email" onChange={(e)=> setEmail(e.target.value)} />

                <label htmlFor="password">Password</label>
                <input className="password" type="password" placeholder="password" id="password" onChange={(e)=> setPassword(e.target.value)}/>

                <input type="submit" className="submit" />
                </form>
                <p className="subHeading">Do not have an account?  <Link to="/signup">Sign Up</Link></p>
            </div>

        </div>
    );
}

export default Login;