import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAndroid } from "@fortawesome/free-brands-svg-icons";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import Menu from "./Menu";

const Navbar = ({ onDownloadClick }) => {
  const [open, setOpen] = useState(false);
  return open ? (
    <Menu setOpen={setOpen} onDownloadClick={onDownloadClick} />
  ) : (
    <nav className="bg-black/20 backdrop-blur-lg border border-white/10 shadow-2xl py-3 px-8 w-[95%] md:w-[85%] lg:w-[75%] mx-auto rounded-full flex justify-between flex-row items-center sticky top-5 z-50">
      <div className="flex flex-row items-center gap-3">
        <img src="coin.webp" className="w-10 h-10 object-contain" alt="" />
        <h1 className="text-white font-bold text-xl sm:text-2xl font-poppins tracking-tight">
          FIN AI
        </h1>
      </div>
      <div className="flex items-center gap-8">
        <ul className="hidden md:flex flex-row items-center gap-8 text-white/80">
          <li>
            <a href="#benefits" className="text-base font-medium hover:text-white hover:scale-105 transition-all">
              Benefits
            </a>
          </li>
          <li>
            <a href="#features" className="text-base font-medium hover:text-white hover:scale-105 transition-all">
              Features
            </a>
          </li>
        </ul>
        <button
          onClick={onDownloadClick}
          className="hidden md:flex bg-white text-black py-2.5 px-6 cursor-pointer gap-2 items-center rounded-full hover:bg-zinc-200 hover:scale-105 transition-all shadow-lg active:scale-95"
        >
          <FontAwesomeIcon
            icon={faAndroid}
            className="text-xl text-green-600"
          />
          <span className="font-bold text-sm">Download App</span>
        </button>
        <div className="block md:hidden cursor-pointer text-white text-2xl hover:text-gray-300" onClick={() => setOpen(true)}>
          <FontAwesomeIcon icon={faBars} />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
