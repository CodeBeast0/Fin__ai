import React, { useState } from 'react'
import Navbar from './Navbar'
import AuthModal from './AuthModal'

const Hero = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  return (
    <div className='min-h-screen w-full py-5'>
      <Navbar />
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
      <div className="flex flex-col lg:flex-row items-center justify-between w-3/4 mx-auto  md:mt-20 gap-10">
        <div className='w-full flex mt-25 flex-col gap-5'>
          <h1 className='text-4xl md:text-6xl font-bold text-white text-center leading-tight'>
            Take control of your finances
          </h1>
          <p className='text-lg text-gray-300 max-w-xl mx-auto text-center'>
            Spend less time worrying about your expenses and focus on becoming financially stable with our easy to use AI-powered expense tracker
          </p>
          <button
            onClick={() => setIsAuthModalOpen(true)}
            className='bg-blue-700 text-white px-8 py-3 mx-auto cursor-pointer rounded-full text-lg font-medium hover:bg-gray-800 transition-colors w-fit'
          >
            Lets get started
          </button>
        </div>
      </div>
    </div>
  )
}

export default Hero