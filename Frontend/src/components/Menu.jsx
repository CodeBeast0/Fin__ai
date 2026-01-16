import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAndroid } from "@fortawesome/free-brands-svg-icons";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

const Menu = ({ setOpen }) => {
  return (
    <div className="h-screen w-full bg-[#000] text-white flex flex-col justify-center items-center relative overflow-hidden">
      {/* Blurry Background blobs */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Blob 1 */}
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/30 rounded-full blur-[120px] animate-blob"></div>

        {/* Blob 2 */}
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-blue-900/40 rounded-full blur-[130px] animate-blob-slow"></div>

        {/* Blob 3 */}
        <div className="absolute top-1/4 left-1/3 w-[400px] h-[400px] bg-blue-500/20 rounded-full blur-[110px] animate-blob-slower"></div>
      </div>

      <div className="relative z-10 flex flex-col items-center">
        <FontAwesomeIcon
          icon={faXmark}
          onClick={() => setOpen(false)}
          className="text-2xl hover:text-blue-700 absolute top-[-150px] right-[-100px] cursor-pointer"
        />
        <ul className="mx-auto flex flex-col text-2xl justify-center gap-5 items-center">
          <li className="hover:text-blue-700">
            <a href="#">Benefits</a>
          </li>
          <li className="hover:text-blue-700">
            <a href="#">Features</a>
          </li>
          <button className="bg-blue-800 flex flex-row py-3 px-3 cursor-pointer gap-1 items-center rounded-full">
            <FontAwesomeIcon
              icon={faAndroid}
              className="text-3xl text-green-600"
            />
            <p className="text-white">Download App</p>
          </button>
        </ul>
      </div>
    </div>
  );
};

export default Menu;
