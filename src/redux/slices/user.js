import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import appAxios from "../../appAxios";

const initialState = {
  status: "loading",
  error: null,
  user: null,
};

export const fetchLogin = createAsyncThunk(
  "user/fetchLogin",
  async (reqData, { rejectWithValue }) => {
    try {
      const { data } = await appAxios.post("/auth/login", reqData);
      const { userData, token } = data;
      window.localStorage.setItem("token", token);
      return userData;
    } catch (error) {
      if (error?.response) {
        return rejectWithValue(error?.response.data.message);
      }
      return rejectWithValue(error.message);
    }
  }
);

export const fetchRegister = createAsyncThunk(
  "user/fetchRegister",
  async (values, {rejectWithValue}) => {
    try {
      const {data} = await appAxios.post("/auth/register", values);
      const { userData, token } = data;
      window.localStorage.setItem("token", token);
      return userData;
    } catch (error) {
      if (error?.response) {
        return rejectWithValue(error?.response.data.message);
      }
      return rejectWithValue(error.message);
    }
  }
)

export const fetchUser = createAsyncThunk(
  "user/fetchUser",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await appAxios.get("/auth/user");
      return data;
    } catch (error) {
      if (error?.response) {
        return rejectWithValue(error?.response.data.message);
      }
      return rejectWithValue(error.message);
    }
  }
);

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.error = null;
      state.status = "";
      window.localStorage.removeItem("token");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLogin.fulfilled, (state, action) => {
        state.user = action.payload;
        state.status = "idle";
        state.error = null;
      })
      .addCase(fetchLogin.pending, (state) => {
        state.status = "loading";
        state.user = null;
        state.error = null;
      })
      .addCase(fetchLogin.rejected, (state, action) => {
        state.status = "error";
        state.user = null;
        state.error = action.payload;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.status = "idle";
        state.error = null;
      })
      .addCase(fetchUser.pending, (state) => {
        state.status = "loading";
        state.user = null;
        state.error = null;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.status = "error";
        state.user = null;
        state.error = action.payload;
      })
      .addCase(fetchRegister.fulfilled, (state, action) => {
        state.user = action.payload;
        state.status = "idle";
        state.error = null;
      })
      .addCase(fetchRegister.pending, (state) => {
        state.status = "loading";
        state.user = null;
        state.error = null;
      })
      .addCase(fetchRegister.rejected, (state, action) => {
        state.status = "error";
        state.user = null;
        state.error = action.payload;
      });
  },
});

export const { logout } = userSlice.actions;

export const selectIsAuth = (state) => Boolean(state.user.user);
export const selectUserIsLoading = state => Boolean(state.user.status === "loading");
export const selectUser = state => state.user.user;

export default userSlice.reducer;
