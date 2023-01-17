import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import appAxios from "../../appAxios";

const initialState = {
  status: "loading",
  error: null,
  posts: [],
};

export const fetchPosts = createAsyncThunk(
  "posts/fetchPosts",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await appAxios.get("/posts");
      return data.reverse();
    } catch (error) {
      if (error?.response) {
        alert(error?.response.data.message);
        return rejectWithValue(error?.response.data.message);
      }
      alert(error.message);
      return rejectWithValue(error.message);
    }
  }
);

export const fetchDeletePost = createAsyncThunk(
  "posts/fetchDeletePost",
  async ({_id, imageUrl}, {dispatch}) => {
    try {
      await appAxios.delete(`/posts/${_id}`);
      if (imageUrl) {
        await appAxios.delete(imageUrl);
      }
      dispatch(deletePost(_id));
    } catch (error) {
      if (error?.response) {
        alert(error?.response.data.message);
      } else {
        alert(error.message);
      }
    }
  }
)

export const fetchCreatePost = createAsyncThunk(
  "posts/fetchCreatePost",
  async (reqData) => {
    try {
      await appAxios.post("/posts", reqData);
    } catch (error) {
      if (error?.response) {
        alert(error?.response.data.message);
      } else {
        alert(error.message);
      }
    }
  }
)

export const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    deletePost: (state, action) => {
      state.posts = state.posts.filter(post => post._id !== action.payload);
    }
  },
  extraReducers: (builder) =>
    builder
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.posts = action.payload;
        state.error = null;
        state.status = "idle";
      })
      .addCase(fetchPosts.pending, (state) => {
        state.status = "loading";
        state.posts = [];
        state.error = null;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = "error";
        state.posts = [];
        state.error = action.payload;
      }),
});

export const {deletePost} = postsSlice.actions;

export const selectPosts = (state) => state.posts;

export default postsSlice.reducer;
