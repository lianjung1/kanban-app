import { Navigate, Route, Routes } from "react-router-dom";
import NavBar from "./components/NavBar";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import NotFound from "./pages/NotFound";
import { Toaster } from "react-hot-toast";
import Dashboard from "./pages/Dashboard";
import { useAuthStore } from "./store/useAuthStore";
import { AuthStore } from "./types/AuthStore";
import BoardDetail from "./pages/BoardDetail";

function App() {
  const { isAuthenticated } = useAuthStore() as AuthStore;

  return (
    <div>
      <NavBar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/login"
          element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" />}
        />
        <Route
          path="/signup"
          element={!isAuthenticated ? <Signup /> : <Navigate to="/dashboard" />}
        />
        <Route
          path="/dashboard"
          element={isAuthenticated ? <Dashboard /> : <Navigate to="/" />}
        />
        <Route
          path="/board/:boardId"
          element={isAuthenticated ? <BoardDetail /> : <Navigate to="/" />}
        />
        <Route path="*" element={<NotFound />} />
      </Routes>

      <Toaster />
    </div>
  );
}

export default App;
