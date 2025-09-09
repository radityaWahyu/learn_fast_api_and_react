import { useSelector } from "react-redux";
import { Navigate } from "react-router";
import SpinnerLoading from "../SpinnerLoading";

export default function ProtectedRoute({ children, roles }) {
  const token = localStorage.getItem("token");
  const user = useSelector((state) => state.auth.user);
  const loadingFetchUser = useSelector((state) => state.auth.loadingFetchUser);

  if (token && loadingFetchUser) {
    console.log('loading protected layout')
    return <SpinnerLoading/>;
  }

  if (roles && user && !roles.includes(user.role)) {
    console.log(user.role);
    return <Navigate to="/not_found" />;
  }

  return <>{children}</>;
}
