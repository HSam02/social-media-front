import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import appAxios from "../../appAxios";
import { AppContainer, Post, Comments } from "../../components";
import scss from "./FullPost.module.scss";

export const FullPost = () => {
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [post, setPost] = useState({});
  useEffect(() => {
    (async () => {
      try {
        const { data } = await appAxios.get(`/posts/${id}`);
        setPost(data);
        setIsLoading(false);
      } catch (error) {
        if (error?.response) {
          alert(error?.response.data.message);
        } else {
          alert(error.message);
        }
      }
    })();
  }, [id]);
  return (
    <AppContainer>
      <div className={scss.fullPost}>
        <Post post={post} isLoadig={isLoading} fullPost>
          <div className={scss.text}>
            <pre>
              {post.text}
            </pre>
          </div>
        </Post>
        {!isLoading && <Comments enableAddCom={true} postId={post._id} fullPost/>}
      </div>
    </AppContainer>
  );
};
