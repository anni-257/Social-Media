import { useState } from "react";
import "./Signup.scss"
import {Link} from "react-router-dom"
import { axiosClient } from "../../utils/axiosClient";
const Signup=()=>{
    const [name,setName]=useState("");
    const [email,setEmail]=useState("");
    const [password,setPassword]=useState("");

    async function handleSubmit(e){
        try{
            
            e.preventDefault();
            const result=await axiosClient.post("/auth/signup",{
                name,
                email,
                password
            })
            console.log(result);
        }catch(err){
            console.log(err)
        }

    }
    return(
        <div className="signup">
            <div className="signupBox">
                <h2 className="heading">Signup</h2>
                <form className="flex" onSubmit={handleSubmit}>

                <label htmlFor="name">Name</label>
                <input className="name" type="text" placeholder="name" id="name" onChange={(e)=> setName(e.target.value)}/>

                <label htmlFor="email">Email</label>
                <input className="email" type="text" placeholder="abc@gmail.com" id="email" onChange={(e)=> setEmail(e.target.value)} />

                <label htmlFor="password">Password</label>
                <input className="password" type="password" placeholder="password" id="password" onChange={(e)=> setPassword(e.target.value)}/>

                <input type="submit" className="submit" />
                </form>
                <p className="subHeading">Already have an account? <Link to="/login">Log In</Link></p>
            </div>

        </div>
    );
}

export default Signup;