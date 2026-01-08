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
    <nav className="bg-[#F6F5F1] shadow-md py-2 px-5 w-3/4 mx-auto rounded-full flex justify-between flex-row items-center">
      <div className="flex flex-row items-center gap-2">
        <img src="logo-rm.webp" className="w-16" alt="" />
        <h1 className="text-black font-semibold text-base sm:text-2xl font-poppins">
          FIN AI
        </h1>
      </div>
      <div>
        <ul className="hidden md:flex flex-row items-center gap-5">
          <li>
            <a href="#" className="text-lg">
              Benefits
            </a>
          </li>
          <li>
            <a href="#" className="text-lg">
              Features
            </a>
          </li>
          <button className="bg-black flex flex-row py-1 px-2 cursor-pointer gap-1 items-center rounded-full">
            <FontAwesomeIcon
              icon={faAndroid}
              className="text-3xl text-green-600"
            />
            <p className="text-white">Download App</p>
          </button>
        </ul>
        <div className="block md:hidden cursor-pointer text-black text-2xl" onClick={() => setOpen(true)}>
          <FontAwesomeIcon icon={faBars} />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
