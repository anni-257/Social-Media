import "./Avatar.scss"
import userImg from "../../assets/user.png"

const Avatar=({src})=>{
    return (
        <div className="avatar hover-link">
            <img src={src ? src : userImg} alt="user profile" />
        </div>
    )
}

export default Avatar;