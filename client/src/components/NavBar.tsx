import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { useAuthStore } from "@/store/useAuthStore";
import { AuthStore } from "@/types/AuthStore";

const NavBar = () => {
  const { isAuthenticated, logout } = useAuthStore() as AuthStore;

  const handleLogout = () => {
    if (isAuthenticated) {
      logout();
    }
  };

  return (
    <nav className="w-full bg-slate-950 border-b border-slate-800 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <span className="text-xl font-bold bg-gradient-to-r from-purple-500 to-blue-500 text-transparent bg-clip-text">
              Kano
            </span>
          </Link>

          {/* Right side nav actions */}
          <div className="flex items-center gap-4">
            {/* <Link to="/">
              <Button
                size="sm"
                className="bg-slate-800 text-white hover:bg-slate-700 focus:outline-none"
              >
                Home
              </Button>
            </Link> */}
            <Link to="/login">
              <Button
                size="sm"
                className="bg-blue-600 text-white hover:bg-blue-500 focus:outline-none"
              >
                Login
              </Button>
            </Link>
            <Link to="/">
              <Button
                size="sm"
                className="bg-slate-800 text-white hover:bg-slate-700 focus:outline-none"
                onClick={handleLogout}
              >
                Logout
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
