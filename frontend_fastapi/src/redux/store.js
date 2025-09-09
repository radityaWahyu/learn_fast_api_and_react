import { configureStore } from "@reduxjs/toolkit";
import snackbarReducer from "./actions/snackbarSlice";
import authReducer from "./actions/authSlice";

const store = configureStore({
  reducer: { snackbar: snackbarReducer, auth: authReducer },
});

console.log("oncreate store :", store.getState());

store.subscribe(() => {
  console.log("STORE CHANGE : ", store.getState());
});

export default store;
