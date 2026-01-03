import React, { useRef } from "react";
import gsap from "gsap";
import { useState } from "react";
import { useGSAP } from "@gsap/react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";

const AuthPage = () => {
  const container = useRef();
  const [loginOpen, setLoginOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  useGSAP(
    () => {
      gsap.from(".anim-item", {
        y: 50,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: "power3.out",
      });
    },
    { scope: container }
  );

  return (
    <div
      ref={container}
      className="bg-[#2A9134] h-screen text-white font-pixel"
    >
      <div className="flex justify-center items-center flex-col py-10">
        <img src="coin.png" className="w-72 anim-item" alt="" />
        <h1 className="text-6xl mb-10 mt-[-20px] anim-item">Fley</h1>
        <div className="flex justify-center items-center flex-col gap-5 w-full px-5 sm:w-1/2 mt-10 anim-item">
          <button
            onClick={() => setLoginOpen(true)}
            className="bg-[#FED213] text-[#C77F2D] text-lg cursor-pointer rounded-xl p-2 w-full sm:w-1/2"
          >
            Login
          </button>
          <button
            onClick={() => setRegisterOpen(true)}
            className="bg-[#FED213] text-[#C77F2D] text-lg cursor-pointer rounded-xl p-2 w-full sm:w-1/2"
          >
            Register
          </button>
        </div>
        <p
          className="underline mt-5 cursor-pointer anim-item"
          onClick={() => setModalOpen(true)}
        >
          Learn More
        </p>
      </div>

      <Dialog
        open={loginOpen}
        onClose={setLoginOpen}
        className="relative z-10 font-pixel"
      >
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-gray-500/75 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
        />
        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <DialogPanel
              transition
              className="relative transform overflow-hidden rounded-lg bg-[#2A9134] text-left shadow-xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:w-full sm:max-w-lg border-4 border-[#FED213]"
            >
              <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="mt-3 text-center sm:mt-0 sm:text-left">
                  <DialogTitle
                    as="h3"
                    className="text-2xl font-semibold leading-6 text-white text-center mb-5"
                  >
                    Login
                  </DialogTitle>
                  <div className="mt-2 flex flex-col gap-4">
                    <input
                      type="text"
                      placeholder="Username"
                      className="w-full p-2 rounded-md placeholder:text-white text-black focus:outline-none border-2 border-[#FED213] placeholder-gray-500"
                    />
                    <input
                      type="password"
                      placeholder="Password"
                      className="w-full p-2 rounded-md text-black placeholder:text-white focus:outline-none border-2 border-[#FED213] placeholder-gray-500"
                    />
                  </div>
                </div>
              </div>
              <div className="px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6 justify-center">
                <button
                  type="button"
                  onClick={() => setLoginOpen(false)}
                  className="bg-[#FED213] text-[#C77F2D] cursor-pointer w-full  rounded-md px-3 py-2 text-sm font-semibold shadow-sm hover:bg-yellow-400 sm:w-auto"
                >
                  Login
                </button>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>

      <Dialog
        open={registerOpen}
        onClose={setRegisterOpen}
        className="relative z-10 font-pixel"
      >
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-gray-500/75 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
        />
        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <DialogPanel
              transition
              className="relative transform overflow-hidden rounded-lg bg-[#2A9134] text-left shadow-xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:w-full sm:max-w-lg border-4 border-[#FED213]"
            >
              <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="mt-3 text-center sm:mt-0 sm:text-left">
                  <DialogTitle
                    as="h3"
                    className="text-2xl font-semibold leading-6 text-white text-center mb-5"
                  >
                    Register
                  </DialogTitle>
                  <div className="mt-2 flex flex-col gap-4">
                    <input
                      type="text"
                      placeholder="Username"
                      className="w-full p-2 rounded-md placeholder:text-white text-black focus:outline-none border-2 border-[#FED213] placeholder-gray-500"
                    />
                    <input
                      type="email"
                      placeholder="Email"
                      className="w-full p-2 rounded-md placeholder:text-white  text-black focus:outline-none border-2 border-[#FED213] placeholder-gray-500"
                    />
                    <input
                      type="password"
                      placeholder="Password"
                      className="w-full p-2 rounded-md placeholder:text-white text-black focus:outline-none border-2 border-[#FED213] placeholder-gray-500"
                    />
                  </div>
                </div>
              </div>
              <div className="px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6 justify-center">
                <button
                  type="button"
                  onClick={() => setRegisterOpen(false)}
                  className="bg-[#FED213] text-[#C77F2D] cursor-pointer w-full rounded-md px-3 py-2 text-sm font-semibold shadow-sm hover:bg-yellow-400 sm:w-auto"
                >
                  Register
                </button>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>

      <Dialog
        open={modalOpen}
        onClose={setModalOpen}
        className="relative z-10 font-pixel"
      >
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-gray-500/75 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
        />
        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <DialogPanel
              transition
              className="relative transform overflow-hidden rounded-lg bg-[#2A9134] text-left shadow-xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:w-full sm:max-w-lg border-4 border-[#FED213]"
            >
              <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="mt-3 text-center sm:mt-0 sm:text-left">
                  <DialogTitle
                    as="h3"
                    className="text-2xl font-semibold leading-6 text-white text-center mb-5"
                  >
                    Learn More
                  </DialogTitle>
                  <p className="text-white">
                    Fley is your personal financial guide. Whether you’re an
                    employer managing your salary or a student tracking your
                    allowance, Fley helps you take full control of your money.
                    Discover smart ways to save, budget effectively, and
                    maximize your earnings. With Fley, you’ll learn how to split
                    your funds wisely and make every dollar count.
                  </p>
                </div>
              </div>
              <div className="px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6 justify-center">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="bg-[#FED213] text-[#C77F2D] cursor-pointer w-full rounded-md px-3 py-2 text-sm font-semibold shadow-sm hover:bg-yellow-400 sm:w-auto"
                >
                  Close
                </button>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default AuthPage;
