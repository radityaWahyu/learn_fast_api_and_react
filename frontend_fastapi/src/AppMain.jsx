import { BrowserRouter, Routes, Route } from "react-router";
import App from "./pages/App.jsx";
import MainLayout from "./components/Layouts/MainLayout.jsx";
import PageNotFound from "./pages/404.jsx";
import AuthLayout from "./components/Layouts/AuthLayout.jsx";
import EditCrud from "./pages/EditCrud.jsx";
import ProtectedRoute from "./components/Layouts/ProtectedRoute.jsx";
import LoginPage from "./pages/Login.jsx";

export default function AppMain() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <AuthLayout>
              <MainLayout />
            </AuthLayout>
          }
        >
          <Route
            index
            element={
              <ProtectedRoute roles={["admin"]}>
                <App />
              </ProtectedRoute>
            }
          />
          <Route
            path=":pageId"
            element={
              <ProtectedRoute roles={["user","admin"]}>
                <EditCrud />
              </ProtectedRoute>
            }
          />
        </Route>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/not_found" element={<PageNotFound />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
