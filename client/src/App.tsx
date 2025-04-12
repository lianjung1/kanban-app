import { Route, Routes } from "react-router-dom";
import NavBar from "./components/NavBar";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Signup from "./pages/Signup";

function App() {
  return (
    <div>
      <NavBar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </div>
  );
}

export default App;
