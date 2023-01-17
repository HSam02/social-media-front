import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { logout, selectIsAuth } from "../../redux/slices/user";
import { AppButton, AppContainer } from "../AppComp";
import scss from "./Navbar.module.scss";

export const Navbar = () => {
  const dispatch = useDispatch();
  const isAuth = useSelector(selectIsAuth);
  return (
    <div className={scss.navbar}>
      <AppContainer>
        <div className={scss.navbar__inner}>
          <div className={scss.logo}>
            <AppButton>
              <Link to="/">Home Page</Link>
            </AppButton>
          </div>
          <div className={scss.user}>
            {isAuth ? (
              <>
                <AppButton color="green">
                  <Link to="/create-post">Create Post</Link>
                </AppButton>
                <AppButton color="red" onClick={() => dispatch(logout())}>
                  Logout
                </AppButton>
              </>
            ) : (
              <>
                <AppButton>
                  <Link to="/login">Login</Link>
                </AppButton>
                <AppButton color="green">
                  <Link to="/register">Register</Link>
                </AppButton>
              </>
            )}
          </div>
        </div>
      </AppContainer>
    </div>
  );
};
