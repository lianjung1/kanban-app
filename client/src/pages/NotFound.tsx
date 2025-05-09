import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center mt-[-5rem]">
      <div className="text-center">
        <p className="text-2xl font-bold mb-4">404 - Page not found</p>
        <Link to="/">
          <Button
            size="lg"
            className="bg-slate-800 text-white hover:bg-slate-700 focus:outline-none"
          >
            Return Home
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
