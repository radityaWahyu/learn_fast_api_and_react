import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api";

export const fetchUser = createAsyncThunk(
  'auth/fetchUser',
  async (_,{rejectWithValue}) =>{
    try {
        const { data } = await api.get("/user");
        // console.log(data);
        return data.user
    } catch (error) {
      return rejectWithValue(`Error fetch user err_msg: ${error.message}`)
    }
  }
);



const authSlice = createSlice({
  name: "auth",
  initialState: {
    token: localStorage.getItem("token") || "",
    loadingFetchUser:false,
    errorFetchUser:null,
    user: [],
    isLogout: false,
    alert: {
      show: false,
      message: "",
      type: "success",
    },
  },
  reducers: {
    clearAuth: (state) => {
      state.loadingFetchUser = false;
      state.isLogout = true;
      localStorage.removeItem("token");
      state.user = [];
    },
    setAuth: (state, action) => {
      localStorage.setItem("token", action.payload.token);
      state.user = action.payload.user;
    },
    setUser: (state, action) => {
      state.user = action.payload.user;
    },
    closeAlert: ({ alert }) => {
      alert.show = false;
      alert.message = "";
    },
    setAlert: (state, action) => {
      state.alert.type = action.payload.type;
      state.alert.show = action.payload.show;
      state.alert.message = action.payload.message;
    },
    setLoadingFetchUser:(state,action)=>{
      state.loadingFetchUser = action.payload.loading;
    }
  },
  extraReducers:(builder)=>{
    builder.addCase(fetchUser.pending,(state)=>{
      state.loadingFetchUser = true;
      state.error = null;
    }).addCase(fetchUser.fulfilled, (state,action)=>{
      state.loadingFetchUser = false;
      state.user = action.payload;
    }).addCase(fetchUser.rejected, (state, action)=>{
      state.loading = false;
      state.errorFetchUser = action.error.message;
    })
  }
});

export const { clearAuth, setAuth, setAlert, closeAlert, setUser, setLoadingFetchUser } =
  authSlice.actions;
export default authSlice.reducer;
