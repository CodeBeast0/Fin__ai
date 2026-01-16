import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAndroid } from "@fortawesome/free-brands-svg-icons";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

const Menu = ({ setOpen, onDownloadClick }) => {
  const handleLinkClick = () => {
    setOpen(false);
  };

  const handleDownloadClick = () => {
    setOpen(false);
    onDownloadClick();
  };

  return (
    <div className="fixed inset-0 h-screen w-full bg-black text-white flex flex-col justify-center items-center z-[100] animate-in slide-in-from-top duration-300">
      {/* Blurry Background blobs */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/30 rounded-full blur-[120px] animate-blob"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-blue-900/40 rounded-full blur-[130px] animate-blob-slow"></div>
        <div className="absolute top-1/4 left-1/3 w-[400px] h-[400px] bg-blue-500/20 rounded-full blur-[110px] animate-blob-slower"></div>
      </div>

      <button
        onClick={() => setOpen(false)}
        className="absolute top-8 right-8 text-3xl text-white/70 hover:text-white cursor-pointer z-20"
      >
        <FontAwesomeIcon icon={faXmark} />
      </button>

      <div className="relative z-10 w-full px-10">
        <ul className="flex flex-col gap-10 items-center">
          <li>
            <a
              href="#benefits"
              onClick={handleLinkClick}
              className="text-4xl hover:text-blue-500 transition-colors"
            >
              Benefits
            </a>
          </li>
          <li>
            <a
              href="#features"
              onClick={handleLinkClick}
              className="text-4xl hover:text-blue-500 transition-colors"
            >
              Features
            </a>
          </li>
          <button
            onClick={handleDownloadClick}
            className="mt-4 bg-white text-black flex flex-row py-4 text-sm sm:text-base px-8 cursor-pointer gap-3 items-center rounded-full hover:bg-zinc-200 transition-transform active:scale-95 shadow-xl"
          >
            <FontAwesomeIcon
              icon={faAndroid}
              className="text-3xl text-green-600"
            />
            <span className="font-bold text-xl">Download App</span>
          </button>
        </ul>
      </div>
    </div>
  );
};

export default Menu;
