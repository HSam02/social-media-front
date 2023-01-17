import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Link, Navigate } from "react-router-dom";
import appAxios from "../../appAxios";
import { Avatar } from "../../components";
import { AppButton } from "../../components/AppComp";
import {
  fetchRegister,
  selectIsAuth,
  selectUserIsLoading,
} from "../../redux/slices/user";
import scss from "./Register.module.scss";

export const Register = () => {
  const dispatch = useDispatch();
  const isAuth = useSelector(selectIsAuth);
  const userIsLoading = useSelector(selectUserIsLoading);
  const [avatarUrl, setAvatarUrl] = useState('');
  const inputFileRef = useRef(null);
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();

  const handleChangeFile = async (event) => {
    if (event.target.files.length === 0) {
      return;
    }
    try {
      if (avatarUrl) {
        handleRemoveImage();
      }
      const formData = new FormData();
      const file = event.target.files[0];
      formData.append("image", file);
      const {data} = await appAxios.post("/upload-avatar", formData);
      setAvatarUrl(data.url);
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
      const fileName = avatarUrl.split('/').pop();
      await appAxios.delete("/upload-avatar/" + fileName);
      setAvatarUrl('');
    } catch (error) {
      if (error?.response) {
        alert(error?.response.data.message);
      } else {
        alert(error.message);
      }
    }
  }

  const onSubmit = (values) => {
    values.fullName = values.fullName.trim();
    values.avatarUrl = avatarUrl;
    dispatch(fetchRegister(values));
  };

  if (userIsLoading) {
    return <div className={scss.register}>Loading...</div>;
  }

  if (isAuth) {
    return <Navigate to="/" />;
  }

  return (
    <div className={scss.register}>
      <form onSubmit={handleSubmit(onSubmit)} className={scss.box}>
        <h2>Register</h2>
        <div className={scss.imgBtns}>
          <AppButton onClick={() => inputFileRef.current.click()}>
            Choose Avatar
          </AppButton>
          {avatarUrl && <AppButton onClick={handleRemoveImage} color="red">Delete</AppButton>}
          <input ref={inputFileRef} onChange={handleChangeFile} type="file" accept="image/*" />
        </div>
        {avatarUrl && <Avatar avatarUrl={avatarUrl} />}
        <input
          type="text"
          {...register("fullName", {
            required: "Required",
            pattern: {
              value:
                /(^[A-Za-z]{3,16})([ ]{0,1})([A-Za-z]{3,16})?([ ]{0,1})?([A-Za-z]{3,16})?([ ]{0,1})?([A-Za-z]{3,16})/,
              message: "Invalid full name",
            },
          })}
          placeholder="FullName"
        />
        {errors.fullName && errors.fullName.message}
        <input
          type="email"
          {...register("email", {
            required: "Required",
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "Invalid email address",
            },
          })}
          placeholder="Email"
        />
        {errors.email && errors.email.message}
        <input
          type="password"
          {...register("password", {
            required: "Required",
            pattern: {
              value: /[a-zA-Z0-9]{8,}$/,
              message: "Minimum eight characters or numbers",
            },
          })}
          placeholder="Password"
        />
        {errors.password && errors.password.message}
        <div className={scss.buttons}>
          <AppButton type="submit" color="green">
            Register
          </AppButton>
          <AppButton>
            <Link to="/login">Login</Link>
          </AppButton>
        </div>
      </form>
    </div>
  );
};
