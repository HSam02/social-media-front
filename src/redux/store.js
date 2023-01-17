import { configureStore } from "@reduxjs/toolkit";
import postsReducer from "./slices/posts";
import userReducer from "./slices/user";

export const store = configureStore({
  reducer: {
    posts: postsReducer,
    user: userReducer,
  }
});
