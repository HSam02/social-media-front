import scss from "./Avatar.module.scss";

export const Avatar = ({avatarUrl}) => {
    return (
        <div className={scss.avatar}>
            <img src={process.env.REACT_APP_API_URL + avatarUrl} alt="" />
        </div>
    )
}