import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAndroid } from "@fortawesome/free-brands-svg-icons";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import Menu from "./Menu";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  return open ? (
    <Menu setOpen={setOpen} />
  ) : (
    <nav className="bg-black/20 backdrop-blur-md border border-white/10 shadow-lg py-2 px-5 w-3/4 mx-auto rounded-full flex justify-between flex-row items-center">
      <div className="flex flex-row items-center gap-2">
        <img src="logo-rm.webp" className="w-16" alt="" />
        <h1 className="text-white font-semibold text-base sm:text-2xl font-poppins">
          FIN AI
        </h1>
      </div>
      <div>
        <ul className="hidden md:flex flex-row items-center gap-5 text-white">
          <li>
            <a href="#" className="text-lg hover:text-blue-400 transition-colors">
              Benefits
            </a>
          </li>
          <li>
            <a href="#" className="text-lg hover:text-blue-400 transition-colors">
              Features
            </a>
          </li>
          <button className="bg-white text-black flex flex-row py-2 px-4 cursor-pointer gap-2 items-center rounded-full hover:bg-gray-200 transition-colors">
            <FontAwesomeIcon
              icon={faAndroid}
              className="text-2xl text-green-600"
            />
            <p className="font-semibold">Download App</p>
          </button>
        </ul>
        <div className="block md:hidden cursor-pointer text-white text-2xl" onClick={() => setOpen(true)}>
          <FontAwesomeIcon icon={faBars} />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
