import defaultAvatar from "../../assets/images/default_avatar.svg"
import "./styles/UserAvatar.css"

export default function UserAvatar(){
    return (
        <>
            <div>
                <img className="userAvatar" src={defaultAvatar} alt="User"/>
            </div>
        </>
    )
}