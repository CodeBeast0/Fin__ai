import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAndroid } from "@fortawesome/free-brands-svg-icons";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

const Menu = ({ setOpen }) => {
  return (
    <div className="h-screen w-full bg-[#fff] text-gray flex flex-col justify-center items-center relative">
      <FontAwesomeIcon
        icon={faXmark}
        onClick={()=>setOpen(false)}
        className="text-2xl hover:text-black absolute top-10 right-10 cursor-pointer"
      />
      <ul className="mx-auto flex flex-col text-2xl justify-center gap-5 items-center">
        <li className="hover:text-black">
          <a href="#">Benefits</a>
        </li>
        <li className="hover:text-black">
          <a href="#">Features</a>
        </li>
        <button className="bg-black flex flex-row py-3 px-3 cursor-pointer gap-1 items-center rounded-full">
          <FontAwesomeIcon
            icon={faAndroid}
            className="text-3xl text-green-600"
          />
          <p className="text-white">Download App</p>
        </button>
      </ul>
    </div>
  );
};

export default Menu;
