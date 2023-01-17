import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import appAxios from "../../appAxios";
import { AppContainer, Post, Comments } from "../../components";
import { fetchPosts, selectPosts } from "../../redux/slices/posts";
import scss from "./Home.module.scss";

export const Home = () => {
  const dispatch = useDispatch();
  const [tags, setTags] = useState();
  const { posts, error, status } = useSelector(selectPosts);
  const [filteredPosts, setFilteredPosts] = useState([]);
  useEffect(() => {
    dispatch(fetchPosts());
    (async () => {
      try {
        const { data } = await appAxios("/last-tags");
        setTags(data);
      } catch (error) {
        if (error?.response) {
          alert(error?.response.data.message);
        } else {
          alert(error.message);
        }
      }
    })();
  }, [dispatch]);

  useEffect(() => setFilteredPosts(posts), [posts]);

  const handleFilterPosts = (tag) => {
    if (tag === "all") {
      return setFilteredPosts(posts);
    }
    setFilteredPosts(posts.filter((post) => post.tags.includes(tag)));
  };

  return (
    <AppContainer>
      <div className={scss.home}>
        <div className={scss.posts}>
          {status === "idle" &&
            filteredPosts.map((post) => <Post key={post._id} post={post} />)}
          {status === "error" && alert(error)}
          {status === "loading" &&
            Array(4)
              .fill()
              .map((el, i) => <Post key={i} isLoadig />)}
        </div>
        <div className={scss.rightSide}>
          <div className={scss.tags}>
            <h3>Filter by Last Tags</h3>
            {tags ? (
              <ul>
                <li onClick={() => handleFilterPosts("all")}>All Posts</li>
                {tags.map((tag) => (
                  <li onClick={() => handleFilterPosts(tag)} key={tag}>
                    #{tag}
                  </li>
                ))}
              </ul>
            ) : (
              <p>Loading...</p>
            )}
          </div>
          <Comments />
        </div>
      </div>
    </AppContainer>
  );
};
