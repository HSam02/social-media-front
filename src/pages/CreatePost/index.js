import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import appAxios from "../../appAxios";
import { AppButton, AppContainer } from "../../components";
import { fetchCreatePost } from "../../redux/slices/posts";
import { selectIsAuth, selectUserIsLoading } from "../../redux/slices/user";
import scss from "./CreatePost.module.scss";

export const CreatePost = () => {
  const isAuth = useSelector(selectIsAuth);
  const userIsLoading = useSelector(selectUserIsLoading);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const inputFileRef = useRef(null);
  const [imgUrl, setImgUrl] = useState('');
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();

  const onSubmit = (values) => {
    values.title = values.title.trim();
    values.tags = values.tags.split(',');
    if (imgUrl) {
      values.imageUrl = imgUrl;
    }
    dispatch(fetchCreatePost(values));
    navigate('/');
  }

  const handleChangeFile = async (event) => {
    if (event.target.files.length === 0) {
      return;
    }
    try {
      if (imgUrl) {
        handleRemoveImage();
      }
      const formData = new FormData();
      const file = event.target.files[0];
      formData.append("image", file);
      const {data} = await appAxios.post("/uploads", formData);
      setImgUrl(data.url);
    } catch (error) {
      if (error?.response) {
        alert(error?.response.data.message);
      } else {
        alert(error.message);
      }
    }
  }

  const handleRemoveImage = async () => {
    try {
      await appAxios.delete(imgUrl);
      setImgUrl('');
    } catch (error) {
      if (error?.response) {
        alert(error?.response.data.message);
      } else {
        alert(error.message);
      }
    }
  }

  if (userIsLoading) {
    return <div className={scss.newPost}>Loading...</div>
  }

  if (!isAuth) {
    return <Navigate to='/' />
  }

  return (
    <AppContainer>
      <form onSubmit={handleSubmit(onSubmit)} className={scss.newPost}>
        <div className={scss.buttons}>
          <AppButton onClick={() => inputFileRef.current.click()}>
            Choose image
          </AppButton>
          {imgUrl && <AppButton color="red" onClick={handleRemoveImage}>Delete</AppButton>}
        </div>
        {imgUrl && (
            <div className={scss.img}>
              <img src={process.env.REACT_APP_API_URL + imgUrl} alt="" />
            </div>
        )}
        <input ref={inputFileRef} onChange={handleChangeFile} type="file" accept="image/*" />
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
          <AppButton type="submit">Create</AppButton>
          <AppButton color="red" onClick={() => {
            if (imgUrl) {
              handleRemoveImage();
            }
            navigate("/")
        }}>
            Cancel
          </AppButton>
        </div>
      </form>
    </AppContainer>
  );
};
