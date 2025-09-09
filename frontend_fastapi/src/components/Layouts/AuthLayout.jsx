import { useEffect, useState } from "react";
import { Navigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { setAlert, fetchUser } from "../../redux/actions/authSlice";
import SpinnerLoading from "../SpinnerLoading";

export default function AuthLayout({ children }) {
  const dispatch = useDispatch();
  const token = localStorage.getItem("token");
  const user = useSelector((state) => state.auth.user);
  const isLogout = useSelector((state) => state.auth.isLogout);
  const [userFetched, setUserFetched] = useState(false);

  useEffect(() => {
    // console.log('effect')
    const userFetchedTimer = setTimeout(() => setUserFetched(true), 500);
    
    return () => {
      clearTimeout(userFetchedTimer);
    };
  }, []);
  useEffect(() => {
    if (token && user.length == 0 && !userFetched) {
      dispatch(fetchUser()).then(() => {
        console.log("fetch user");
        setUserFetched(true);
      });
    } else if (user.length > 0) {
      setUserFetched(false);
    }
  }, [token, userFetched, dispatch, user]);

  if (!token) {
    if (isLogout == false) {
      dispatch(
        setAlert({
          show: true,
          message: "Anda harus login terlebih dahulu",
          type: "danger",
        })
      );
    }

    return <Navigate to="/login" />;
  }

  if (token && !userFetched) {
    console.log("show loading");
    return <SpinnerLoading />;
  }

  return <>{children}</>;
}
