import { Outlet } from "react-router";
import { Button } from "@mui/joy";
import { clearAuth, setAlert } from "../../redux/actions/authSlice";
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import LogoutIcon from "@mui/icons-material/Logout";

export default function MainLayout() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const doLogout = async () => {
    dispatch(clearAuth());
    dispatch(
      setAlert({
        show: true,
        message: "Selamat anda berhasil logout",
        type: "success",
      })
    );
    navigate("/login");
  };
  return (
    <>
      <div className="max-w-screen px-10 h-[50px] bg-slate-400 flex items-center justify-end">
        <Button
          color="danger"
          onClick={doLogout}
          endDecorator={<LogoutIcon fontSize="small" />}
        >
          Logout
        </Button>
      </div>
      <Outlet />
    </>
  );
}
