import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
    return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center text-center p-4">
            <div className="relative max-w-lg w-full">
                {/* Glow Effect */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-blue-500/20 blur-[100px] rounded-full"></div>

                <img
                    src="/404.png"
                    alt="404 Not Found"
                    className="relative z-10 w-full object-contain mb-8 animate-pulse-slow"
                />
            </div>

            <h2 className="text-2xl font-bold text-white mb-2 z-10">Page Not Found</h2>
            <p className="text-gray-400 mb-8 z-10">The page you are looking for doesn't exist or has been moved.</p>

            <Link
                to="/"
                className="z-10 bg-blue-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-blue-500 transition-all hover:shadow-[0_0_20px_rgba(37,99,235,0.5)]"
            >
                Go Home
            </Link>
        </div>
    );
};

export default NotFound;
