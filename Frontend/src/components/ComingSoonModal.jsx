import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

const ComingSoonModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="relative bg-zinc-900 border border-white/10 p-8 rounded-3xl w-full max-w-md shadow-2xl animate-in fade-in zoom-in duration-300">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors cursor-pointer"
                >
                    <FontAwesomeIcon icon={faTimes} className="text-xl" />
                </button>

                <div className="text-center space-y-4">
                    <div className="bg-blue-600/20 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <span className="text-3xl">🚀</span>
                    </div>
                    <h2 className="text-3xl font-bold text-white font-poppins">Coming Soon!</h2>
                    <p className="text-gray-400 text-lg">
                        We're putting the finishing touches on our mobile app. Stay tuned for an even better experience!
                    </p>
                    <div className="pt-4">
                        <button
                            onClick={onClose}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-full transition-all duration-300 w-full cursor-pointer"
                        >
                            Got it!
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ComingSoonModal;
