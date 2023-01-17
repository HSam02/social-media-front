import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { AppButton, Avatar, Comment } from "../";
import appAxios from "../../appAxios";
import { selectUser } from "../../redux/slices/user";
import scss from "./Comments.module.scss";

export const Comments = ({ enableAddCom, postId, fullPost }) => {
  const [newCommentText, setNewCommentText] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [comments, setComments] = useState([]);
  const user = useSelector(selectUser);

  useEffect(() => {
    (async () => {
      try {
          const { data } = await appAxios.get(`/comments/${fullPost ? postId : ''}`);
          setComments(data);
        setIsLoading(false);
      } catch (error) {
        if (error?.response) {
          alert(error?.response.data.message);
        } else {
          alert(error.message);
        }
      }
    })();
  }, []);

  const addComment = async () => {
    let text = newCommentText.trim();
    if (text.length < 3) {
      return alert("Minimum 3 symbols");
    }
    const reqData = { text, postId };
    try {
      setNewCommentText("");
      const { data } = await appAxios.post("/comments", reqData);
      setComments([...comments, data]);
    } catch (error) {
      if (error?.response) {
        alert(error?.response.data.message);
      } else {
        alert(error.message);
      }
    }
  };

  return (
    <div className={scss.comments}>
      <h3>{!fullPost && "Last "}Comments</h3>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {comments &&
            comments.map((comment) => (
              <Comment
                key={comment._id}
                text={comment.text}
                user={comment.user}
                postId={comment.post}
                fullPost={fullPost}
              />
            ))}
          {enableAddCom && (
            <li className={scss.newComment}>
              {user.avatarUrl ? (
                <Avatar avatarUrl={user.avatarUrl} />
              ) : (
                <div className={scss.userImg}>{/* <img alt="U" /> */}</div>
              )}
              <div className={scss.form}>
                <textarea
                  onChange={(evt) => setNewCommentText(evt.target.value)}
                  value={newCommentText}
                ></textarea>
                <AppButton onClick={addComment}>Send</AppButton>
              </div>
            </li>
          )}
        </ul>
      )}
    </div>
  );
};
