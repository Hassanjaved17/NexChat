// ============================================================
//  NEXCHAT — NotFound.jsx
//  404 Page
//  Author  : Hassan Javed
//  GitHub  : https://github.com/Hassanjaved17
//  Built   : March 2026
//  © 2026 Hassan Javed — All Rights Reserved
// ============================================================

import { Link }         from "react-router-dom";
import { MessageSquare, MoveLeft } from "lucide-react";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-[#0a0812] flex flex-col items-center justify-center px-4">

      {/* Background glow */}
      <div className="fixed top-[-120px] left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-violet-600/8 rounded-full blur-[120px] pointer-events-none" />

      <div className="flex flex-col items-center gap-6 text-center">

        {/* Icon */}
        <div className="w-16 h-16 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
          <MessageSquare size={28} className="text-violet-700" />
        </div>

        {/* 404 */}
        <div className="flex flex-col gap-2">
          <h1 className="text-7xl font-bold text-violet-500/40 tracking-tight">404</h1>
          <h2 className="text-white font-semibold text-lg">Page not found</h2>
          <p className="text-gray-600 text-sm max-w-xs">
            The page you are looking for doesn't exist or has been moved.
          </p>
        </div>

        {/* Back button */}
        <Link
          to="/chat"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-violet-500/30 text-violet-400 hover:bg-violet-500/10 hover:border-violet-500/50 text-sm font-medium transition-all duration-300"
        >
          <MoveLeft size={15} />
          Back to Chat
        </Link>

      </div>
    </div>
  );
};

export default NotFound;

// © 2026 Hassan Javed — All Rights Reserved