import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import appAxios from "../../appAxios";
import { AppButton, AppContainer } from "../../components";
import {
  selectIsAuth,
  selectUser,
  selectUserIsLoading,
} from "../../redux/slices/user";
import scss from "./EditPost.module.scss";

export const EditPost = () => {
  const isAuth = useSelector(selectIsAuth);
  const userIsLoading = useSelector(selectUserIsLoading);
  const user = useSelector(selectUser);
  const { id } = useParams();
  const inputFileRef = useRef(null);
  const currentImgUrl = useRef("");
  const [postIsLoading, setPostIsLoading] = useState(true);
  const [post, setPost] = useState({});
  const [imgUrl, setImgUrl] = useState("");
  const navigate = useNavigate();
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    values: {
      text: post.text,
      title: post.title,
      tags: post.tags,
    },
  });

  useEffect(() => {
    (async () => {
      try {
        const { data } = await appAxios.get(`/posts/${id}?edit=1`);
        data.tags = data.tags.toString();
        setPost(data);
        currentImgUrl.current = data.imageUrl;
        setImgUrl(data.imageUrl);
        setPostIsLoading(false);
      } catch (error) {
        if (error?.response) {
          alert(error?.response.data.message);
        } else {
          alert(error.message);
        }
      }
    })();
  }, [id]);

  const handleChangeFile = async (event) => {
    if (event.target.files.length === 0) {
      return;
    }
    try {
      if (imgUrl && imgUrl !== currentImgUrl.current) {
        await appAxios.delete(imgUrl);
      }
      const formData = new FormData();
      const file = event.target.files[0];
      formData.append("image", file);
      const { data } = await appAxios.post("/uploads", formData);
      setImgUrl(data.url);
    } catch (error) {
      if (error?.response) {
        alert(error?.response.data.message);
      } else {
        alert(error.message);
      }
    }
  };

  const handleRemoveImage = async () => {
    try {
      if (imgUrl !== currentImgUrl.current) {
        await appAxios.delete(imgUrl);
      }
      setImgUrl("");
    } catch (error) {
      if (error?.response) {
        alert(error?.response.data.message);
      } else {
        alert(error.message);
      }
    }
  };

  const onSubmit = async (values) => {
    try {
      values.title = values.title.trim();
      values.tags = values.tags.split(",");
      values.imageUrl = imgUrl;
      if ((!imgUrl || (imgUrl && imgUrl !== currentImgUrl.current)) && currentImgUrl.current) {
        await appAxios.delete(currentImgUrl.current);
      }
      await appAxios.patch(`/posts/${id}`, values);
      navigate("/");
    } catch (error) {
      if (error?.response) {
        alert(error?.response.data.message);
      } else {
        alert(error.message);
      }
    }
  };

  if (userIsLoading || postIsLoading) {
    return <div className={scss.editPost}>Loading...</div>;
  }

  if (!isAuth || user._id !== post.user._id) {
    return <Navigate to="/" />;
  }

  return (
    <AppContainer>
      <form onSubmit={handleSubmit(onSubmit)} className={scss.editPost}>
        <div className={scss.buttons}>
          <AppButton onClick={() => inputFileRef.current.click()}>
            Choose image
          </AppButton>
          {imgUrl && (
            <AppButton onClick={handleRemoveImage} color="red">
              Delete
            </AppButton>
          )}
        </div>
        {imgUrl && (
          <div className={scss.img}>
            <img src={process.env.REACT_APP_API_URL + imgUrl} alt="" />
          </div>
        )}
        <input
          ref={inputFileRef}
          type="file"
          onChange={handleChangeFile}
          accept="image/*"
        />
        <input
          {...register("title", {
            required: "Required",
            minLength: {
              value: 3,
              message: "Minimum 3 symbols",
            },
            pattern: {
              value: /^[A-Za-z0-9\s]*$/gi,
              message: "Input only letters and spaces",
            },
          })}
          type="text"
          placeholder="Title"
        />
        {errors.title && errors.title.message}
        <input {...register("tags", {})} type="text" placeholder="Tags" />
        {errors.tags && errors.tags.message}
        <textarea
          {...register("text", {
            required: "Required",
            minLength: {
              value: 10,
              message: "Minimum 10 symbols",
            },
          })}
          placeholder="Text"
        ></textarea>
        {errors.text && errors.text.message}
        <div className={scss.buttons}>
          <AppButton type="submit">Edit</AppButton>
          <AppButton
            color="red"
            onClick={() => {
              if (imgUrl && imgUrl !== currentImgUrl.current) {
                handleRemoveImage();
              }
              navigate("/");
            }}
          >
            Cancel
          </AppButton>
        </div>
      </form>
    </AppContainer>
  );
};
