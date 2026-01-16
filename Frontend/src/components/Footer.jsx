import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTwitter, faInstagram, faLinkedin, faGithub } from "@fortawesome/free-brands-svg-icons";

const Footer = () => {
    return (
        <footer className="py-12 px-5 border-t border-white/10 bg-black mt-20">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
                <div className="flex flex-row items-center gap-2">
                    <img src="coin.webp" className="w-12 h-12 object-contain" alt="FIN AI Logo" />
                    <h1 className="text-white font-bold text-2xl font-poppins">
                        FIN AI
                    </h1>
                </div>

                <div className="flex gap-8 text-gray-400 text-base flex-col sm:flex-row text-center justify-center">
                    <a href="#benefits" className="hover:text-white transition-colors">Benefits</a>
                    <a href="#features" className="hover:text-white transition-colors">Features</a>
                    <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                    <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                </div>

                <div className="flex gap-6  text-white">
                    <a href="#" className="hover:text-blue-400  transition-colors">
                        <FontAwesomeIcon icon={faTwitter} />
                    </a>
                    <a href="#" className="hover:text-pink-500 transition-colors">
                        <FontAwesomeIcon icon={faInstagram} />
                    </a>
                    <a href="#" className="hover:text-blue-700 transition-colors">
                        <FontAwesomeIcon icon={faLinkedin} />
                    </a>
                    <a href="#" className="hover:text-gray-400 transition-colors">
                        <FontAwesomeIcon icon={faGithub} />
                    </a>
                </div>
            </div>
            <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-white/5 text-center text-gray-500 text-sm">
                <p>&copy; {new Date().getFullYear()} FIN AI. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;
