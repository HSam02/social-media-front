import { useNavigate } from "react-router-dom";
import { Avatar } from "../Avatar";
import scss from "./Comment.module.scss";

export const Comment = ({ user, text, postId, fullPost }) => {
  const navigate = useNavigate();
  return (
    <li
      className={scss.comment}
      onClick={() => !fullPost && navigate(`/posts/${postId}`)}
    >
      <div className={scss.userImg}>
        {user.avatarUrl && <Avatar avatarUrl={user.avatarUrl} />}
      </div>

      <div className={scss.info}>
        <h5>{user.fullName}</h5>
        <p>{text}</p>
      </div>
    </li>
  );
};
