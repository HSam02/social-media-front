import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { fetchDeletePost } from "../../redux/slices/posts";
import { selectUser } from "../../redux/slices/user";
import { AppButton } from "../AppComp";
import scss from "./Post.module.scss";

export const Post = ({ children, post, isLoadig, fullPost }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(selectUser);
  const handleDeletePost = (post) => {
    const {_id, imageUrl} = post;
    dispatch(fetchDeletePost({_id, imageUrl}));
    if (fullPost) {
      navigate("/");
    }
  };
  if (isLoadig) {
    return <div className={scss.loading}></div>;
  }
  return (
    <div className={scss.post}>
      <div className={scss.post__image}>
        {user?._id === post?.user._id && (
          <div className={scss.userInteraction}>
            <AppButton><Link to={`/posts/edit/${post._id}`}>Edit</Link></AppButton>
            <AppButton onClick={() => handleDeletePost(post)} color="red">
              Delete
            </AppButton>
          </div>
        )}
        {post.imageUrl && <img src={process.env.REACT_APP_API_URL + post.imageUrl} alt="" />}
      </div>
      <div
        className={scss.info}
        onClick={() => {
          if (!fullPost) {
            navigate(`/posts/${post._id}`);
          }
        }}
      >
        <div className={scss.createInfo}>
          <h5>{post.user.fullName}</h5>
          <p>{post.createdAt}</p>
        </div>
        <div className={scss.title}>
          <h3>{post.title}</h3>
        </div>
        <ul className={scss.tags}>
          {post.tags.map((tag, index) => (
            tag && <li key={index}>#{tag}</li>
          ))}
        </ul>
        {children}
        <div className={scss.subInfo}>
          <div>view: {post.viewsCount}</div>
          <div>coms: {post.comments.length}</div>
        </div>
      </div>
    </div>
  );
};
