import { useActionState, useEffect } from "react";
import { z } from "zod";
import {
  FormLabel,
  Input,
  Button,
  FormControl,
  FormHelperText,
  Alert,
  IconButton,
} from "@mui/joy";
import VpnKeyOutlinedIcon from "@mui/icons-material/VpnKeyOutlined";
import ErrorOutline from "@mui/icons-material/ErrorOutline";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import api from "../api";
import { useDispatch, useSelector } from "react-redux";
import { setAuth, setAlert, closeAlert } from "../redux/actions/authSlice";
import { useNavigate } from "react-router";

export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const errorAlert = useSelector((state) => state.auth.alert);

  const formSchema = z.object({
    username: z.string().min(1, "Username harus diisi"),
    password: z.string().min(1, "Password harus diisi"),
  });

  useEffect(() => {
    const alertTimer = setTimeout(() => {
      dispatch(setAlert({ show: false, message: "" }));
    }, 3000);
    return () => {
      clearTimeout(alertTimer);
    };
  }, [errorAlert, dispatch]);

  const submitForm = async (prevState, values) => {
    const prevData = {
      username: values.get("username"),
      password: values.get("password"),
    };

    try {
      const validatedForm = formSchema.parse(prevData);

      const formData = new FormData();
      formData.append("username", validatedForm.username);
      formData.append("password", validatedForm.password);

      const { data } = await api.post("/user/token", formData, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });

      // show response after add data
      console.log(data);

      dispatch(setAuth({ token: data.access_token, user: data.user }));

      //setTimeout(()=>{
      navigate("/");
      //},500)
    } catch (error) {
      console.log(error);
      // show message error when failed in add data
      // console.log(error);
      if (error instanceof z.ZodError) {
        return {
          ...prevData,
          success: false,
          errors: error.flatten().fieldErrors,
        };
      }
      if (error.response.status == 401) {
        dispatch(setAlert({ show: true, message: error.response.data.detail }));
        return {
          ...prevData,
          success: false,
          errors: {},
        };
      }
    }

    return {
      ...prevData,
      success: false,
      errors: {},
    };
  };

  const [state, handleSubmitForm, isFormLoading] = useActionState(submitForm, {
    username: "",
    password: "",
    success: false,
    errors: {},
  });

  return (
    <>
      <title>Login User</title>
      <div className="flex justify-center items-center w-screen h-screen">
        <form action={handleSubmitForm}>
          <div className="w-xs space-y-5">
            {errorAlert.show && (
              <Alert
                variant="soft"
                color={errorAlert.type}
                startDecorator={
                  errorAlert.type == "danger" ? (
                    <ErrorOutline />
                  ) : (
                    <CheckCircleOutlineIcon />
                  )
                }
                endDecorator={
                  <IconButton
                    variant="plain"
                    size="sm"
                    color="neutral"
                    onClick={() => dispatch(closeAlert())}
                  >
                    <CloseRoundedIcon />
                  </IconButton>
                }
              >
                {errorAlert.message}
              </Alert>
            )}
            <FormControl error={state.errors?.username}>
              <FormLabel>Username</FormLabel>
              <Input
                type="text"
                placeholder="Username anda..."
                name="username"
                id="username"
                disabled={isFormLoading}
                defaultValue={state?.username || ""}
              />
              {state.errors?.username && (
                <FormHelperText>{state.errors.username}</FormHelperText>
              )}
            </FormControl>
            <FormControl error={state.errors?.password}>
              <FormLabel>Password</FormLabel>
              <Input
                type="password"
                placeholder="Password anda..."
                name="password"
                id="password"
                disabled={isFormLoading}
                defaultValue={state?.password || ""}
              />
              {state.errors?.password && (
                <FormHelperText>{state.errors.password}</FormHelperText>
              )}
            </FormControl>
            <div>
              <Button
                loading={isFormLoading}
                type="submit"
                startDecorator={<VpnKeyOutlinedIcon fontSize="small" />}
                sx={{
                  width: "100%",
                }}
              >
                Log In
              </Button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
