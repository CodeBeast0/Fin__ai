import React, { useState } from 'react'
import Hero from '../components/Hero'
import Benefits from '../components/Benefits'
import Features from '../components/Features'
import Footer from '../components/Footer'
import ComingSoonModal from '../components/ComingSoonModal'

const Home = () => {
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);

  return (
    <div className="relative min-h-screen font-poppins bg-black">
      <ComingSoonModal
        isOpen={isDownloadModalOpen}
        onClose={() => setIsDownloadModalOpen(false)}
      />

      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/30 rounded-full blur-[120px] animate-blob"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-blue-900/40 rounded-full blur-[130px] animate-blob-slow"></div>
        <div className="absolute top-1/4 left-1/3 w-[400px] h-[400px] bg-blue-500/20 rounded-full blur-[110px] animate-blob-slower"></div>
      </div>

      <div className="relative z-10 flex flex-col">
        <Hero onDownloadClick={() => setIsDownloadModalOpen(true)} />
        <Benefits onDownloadClick={() => setIsDownloadModalOpen(true)} />
        <Features />
        <Footer />
      </div>
    </div>
  )
}

export default Home
