import React from "react";

const Features = () => {
    const featureList = [
        {
            title: "Telegram Bot Integration",
            description: "The Telegram bot acts as a real-time financial assistant connected to the website. Users can send messages to the bot to add expenses immediately after making a purchase, and the system will automatically update the balance.",
            image: "bot.png", 
            bgColor: "bg-[#F5F5F0]",
        },
        {
            title: "Expense Tracking",
            description: "Users can record their expenses directly from the website or through the Telegram bot. Each expense includes an amount, date, category, and optional description.",
            image: "pp.webp", 
            bgColor: "bg-[#F5F5F0]",
        },
        {
            title: "Smart Insights and Alerts",
            description: "Based on collected financial data, the platform generates smart insights such as overspending warnings, monthly comparisons, and budget usage indicators.",
            image: "ppp.webp",
            bgColor: "bg-[#F5F5F0]",
        },
        {
            title: "All your analytics in one dashboard",
            description: "Access detailed reports and charts to visualize your expenses, helping you gain valuable insights into your financial behavior.",
            image: "dash.svg",
            bgColor: "bg-[#F5F5F0]",
        },
    ];

    return (
        <section id="features" className="py-20 px-5 max-w-7xl mx-auto space-y-16">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white text-center">
                Don't let your money control you
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {featureList.map((feature, index) => (
                    <div
                        key={index}
                        className={`${feature.bgColor} rounded-[32px] p-8 md:p-12 flex flex-col gap-8 min-h-[500px] overflow-hidden group`}
                    >
                        <div className="space-y-4 max-w-md">
                            <h3 className="text-2xl md:text-3xl font-bold text-black">{feature.title}</h3>
                            <p className="text-gray-600 text-lg leading-snug">
                                {feature.description}
                            </p>
                        </div>

                        <div className="flex-grow flex items-center justify-center relative">
                            <img
                                src={feature.image}
                                alt={feature.title}
                                className="w-full h-[300px] object-contain group-hover:scale-110 transition-transform duration-500"
                            />
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Features;
