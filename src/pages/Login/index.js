import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Link, Navigate } from "react-router-dom";
import { AppButton } from "../../components/AppComp";
import {
  fetchLogin,
  selectIsAuth,
  selectUserIsLoading,
} from "../../redux/slices/user";
import scss from "./Login.module.scss";

export const Login = () => {
  const dispatch = useDispatch();
  const isAuth = useSelector(selectIsAuth);
  const userIsLoading = useSelector(selectUserIsLoading);
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();
  const onSubmit = (values) => {
    dispatch(fetchLogin(values));
  };

  if (userIsLoading) {
    return <div className={scss.login}>Loading...</div>;
  }

  if (isAuth) {
    return <Navigate to="/" />;
  }

  return (
    <div className={scss.login}>
      <form onSubmit={handleSubmit(onSubmit)} className={scss.box}>
        <h2>Login</h2>
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
          <AppButton type="submit">Login</AppButton>
          <AppButton color="green">
            <Link to="/register">Register</Link>
          </AppButton>
        </div>
      </form>
    </div>
  );
};
