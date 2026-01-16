import React from 'react'
import Hero from '../components/Hero'

const Home = () => {
  return (
    <div className="relative min-h-screen overflow-hidden font-poppins bg-black">
      {/* Blurry Background blobs */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Blob 1 */}
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/30 rounded-full blur-[120px] animate-blob"></div>

        {/* Blob 2 */}
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-blue-900/40 rounded-full blur-[130px] animate-blob-slow"></div>

        {/* Blob 3 */}
        <div className="absolute top-1/4 left-1/3 w-[400px] h-[400px] bg-blue-500/20 rounded-full blur-[110px] animate-blob-slower"></div>

        {/* Subtle grid or noise could be added here if needed, but keeping it clean for now */}
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col justify-center items-center min-h-screen">
        <Hero />
      </div>
    </div>
  )
}

export default Home
