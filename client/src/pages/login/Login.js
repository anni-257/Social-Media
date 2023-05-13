import "./Login.scss"
const Login=()=>{
    return(
        <div className="login">
            <div className="loginBox">
                <h2 className="heading">Login</h2>
                <form className="flex">
                <label htmlFor="email">Email</label>
                <input className="email" type="text" placeholder="abc@gmail.com" id="email" />

                <label htmlFor="password">Password</label>
                <input className="password" type="text" placeholder="password" id="password"/>

                <input type="submit" className="submit" />
                </form>
                <p className="subHeading">Do not have an account? Sign Up</p>
            </div>

        </div>
    );
}

export default Login;