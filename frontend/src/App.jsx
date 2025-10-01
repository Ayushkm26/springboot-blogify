import { Routes, Route } from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import BlogDisplay from "./pages/BlogDisplay";
import CreateBlog from "./pages/CreateBlog";
import MyBlog from "./pages/MyBlog";
import ProtectedWrapper from "./pages/ProctectedWrapper";
function AppRoutes() {
  return (
    <div>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<AuthPage />} />
        <Route path="/login" element={<AuthPage />} />

        {/* Protected routes */}
        <Route
          path="/blog"
          element={
            <ProtectedWrapper>
              <BlogDisplay />
            </ProtectedWrapper>
          }
        />
        <Route
          path="/create"
          element={
            <ProtectedWrapper>
              <CreateBlog />
            </ProtectedWrapper>
          }
        />
        <Route
          path="/my-blog"
          element={
            <ProtectedWrapper>
              <MyBlog />
            </ProtectedWrapper>
          }
        />
      </Routes>
    </div>
  );
}

export default AppRoutes;
