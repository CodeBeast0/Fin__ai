import React, { useState } from 'react'
import Navbar from './Navbar'
import AuthModal from './AuthModal'

const Hero = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  return (
    <div className='bg-[#fff] min-h-screen py-5'>
      <Navbar />
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
      <div className="flex flex-col lg:flex-row items-center justify-between w-3/4 mx-auto mt-10 md:mt-20 gap-10">
        <div className='flex flex-col gap-6 lg:w-1/2 items-center lg:items-start text-center lg:text-left'>
          <h1 className='text-4xl md:text-6xl font-bold text-black leading-tight'>
            Take control of your finances
          </h1>
          <p className='text-lg text-gray-600 max-w-lg'>
            Spend less time worrying about your expenses and focus on becoming financially stable with our easy to use AI-powered expense tracker
          </p>
          <button
            onClick={() => setIsAuthModalOpen(true)}
            className='bg-black text-white px-8 py-3 rounded-full text-lg font-medium hover:bg-gray-800 transition-colors w-fit'
          >
            Lets get started
          </button>
        </div>
        <div className='md:w-1/2 flex justify-center'>
          <img src="/i1.webp" alt="Finance Dashboard" className='w-full max-w-lg object-contain' />
        </div>
      </div>
    </div>
  )
}

export default Hero