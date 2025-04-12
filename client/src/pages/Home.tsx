import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Home = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center px-4">
      <div className="max-w-3xl text-center space-y-6 -mt-24">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
          Welcome to{" "}
          <span className="bg-gradient-to-r from-purple-500 to-blue-500 text-transparent bg-clip-text">
            Kano
          </span>
        </h1>
        <p className="text-slate-400 text-lg">
          Kano is your modern platform for managing tasks, collaborating with
          your team, and boosting productivity — all in one place.
        </p>
        <div className="flex justify-center gap-4 flex-wrap">
          <Link to="/login">
            <Button
              size="lg"
              className="bg-blue-600 text-white hover:bg-blue-500 focus:outline-none"
            >
              Login
            </Button>
          </Link>
          <Link to="/signup">
            <Button
              size="lg"
              className="bg-slate-800 text-white hover:bg-slate-700 focus:outline-none"
            >
              Get Started
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
