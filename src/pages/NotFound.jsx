
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-[#0a0812] flex flex-col items-center justify-center gap-4">
      <h1 className="text-6xl font-bold text-violet-500">404</h1>
      <p className="text-gray-500 text-sm">Page not found</p>
      <Link
        to="/chat"
        className="text-violet-400 border border-violet-500/30 px-5 py-2 rounded-lg text-sm hover:bg-violet-500/10 transition-all"
      >
        Go to Chat
      </Link>
    </div>
  );
};

export default NotFound;