import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { useAuthStore } from "@/store/useAuthStore";
import { AuthStore } from "@/types/AuthStore";
import { LayoutDashboard, LogIn, UserPlus } from "lucide-react";

const NavBar = () => {
  const { isAuthenticated, logout } = useAuthStore() as AuthStore;

  const handleLogout = () => {
    if (isAuthenticated) {
      logout();
    }
  };

  return (
    <nav className="w-full bg-background/95 backdrop-blur-sm border-b border-border shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Left side - Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
                Kano
              </span>
            </Link>
          </div>

          {isAuthenticated ? (
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="text-foreground hover:text-primary hover:bg-primary/10"
              >
                <Link to="/dashboard" className="flex items-center gap-1">
                  <LayoutDashboard className="h-4 w-4" />
                  <span>Dashboard</span>
                </Link>
              </Button>

              <Button
                variant="default"
                size="sm"
                onClick={handleLogout}
                asChild
              >
                <Link to="/" className="flex items-center gap-1">
                  <LogIn className="h-4 w-4" />
                  <span>Logout</span>
                </Link>
              </Button>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <Button variant="default" size="sm" asChild>
                <Link to="/login" className="flex items-center gap-1">
                  <LogIn className="h-4 w-4" />
                  <span>Login</span>
                </Link>
              </Button>

              <Button
                variant="default"
                size="sm"
                className="bg-slate-800 text-white hover:bg-slate-700 focus:outline-none"
                asChild
              >
                <Link to="/signup" className="flex items-center gap-1">
                  <UserPlus className="h-4 w-4" />
                  <span>Sign up</span>
                </Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
