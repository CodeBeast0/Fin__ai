import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWallet, faPiggyBank, faFileAlt, faUsers } from "@fortawesome/free-solid-svg-icons";
import { faApple, faGooglePlay } from "@fortawesome/free-brands-svg-icons";

const Benefits = ({ onDownloadClick }) => {
    const benefitsList = [
        {
            icon: faWallet,
            title: "Spend your hard earned money",
            description: "with peace of mind and think more clearly with no stress.",
        },
        {
            icon: faPiggyBank,
            title: "Save up more money",
            description: "to buy that house, car or whatever your financial goals are.",
        },
        {
            icon: faFileAlt,
            title: "Reap the benefits of business tax write-offs",
            description: "and account for all the business expenses incurred by your company.",
        },
        {
            icon: faUsers,
            title: "Support your family",
            description: "and grow your business without feeling any burden.",
        },
    ];

    return (
        <section id="benefits" className="py-20 px-5 max-w-7xl sm:mx-auto">
            <div className="bg-[#fff] rounded-[40px] px-8 pt-8 md:p-16 flex flex-col-reverse lg:flex-row items-center gap-12 overflow-hidden">

                <div className="w-full lg:w-1/2 flex justify-center scale-110 lg:scale-125">
                    <img
                        src="ph.webp"
                        alt="Phone Mockup"
                        className="w-full relative md:top-30 max-w-[350px] object-contain drop-shadow-2xl"
                    />
                </div>

                <div className="w-full lg:w-1/2 p-5 space-y-10">
                    <h2 className="text-4xl  lg:text-5xl w-full font-bold text-black leading-tight">
                        Tired of reckless spending habits?
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {benefitsList.map((benefit, index) => (
                            <div key={index} className="space-y-3">
                                <div className="w-12 h-12 rounded-full border border-black flex items-center justify-center">
                                    <FontAwesomeIcon icon={benefit.icon} className="text-xl text-black" />
                                </div>
                                <p className="text-black text-lg leading-snug">
                                    <span className="font-bold">{benefit.title}</span>{" "}
                                    <span className="opacity-60">{benefit.description}</span>
                                </p>
                            </div>
                        ))}
                    </div>

                    <button
                        onClick={onDownloadClick}
                        className="bg-black text-white flex items-center gap-3 px-8 py-4 rounded-full hover:bg-zinc-800 transition-colors cursor-pointer w-fit"
                    >
                        <div className="flex gap-2 text-xl">
                            <FontAwesomeIcon icon={faApple} />
                            <FontAwesomeIcon icon={faGooglePlay} />
                        </div>
                        <span className="font-semibold text-sm sm:text-lg">Download app</span>
                    </button>
                </div>
            </div>
        </section>
    );
};

export default Benefits;
