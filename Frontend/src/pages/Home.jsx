import React, { useEffect, useRef, useState } from 'react'
import Hero from '../components/Hero'
import * as THREE from 'three'
import HALO from 'vanta/dist/vanta.halo.min.js'

const Home = () => {
  const vantaRef = useRef(null)
  const [vantaEffect, setVantaEffect] = useState(null)

  useEffect(() => {
    if (!vantaEffect) {
      setVantaEffect(HALO({
        el: vantaRef.current,
        THREE: THREE,
        mouseControls: true,
        touchControls: true,
        minHeight: 200,
        minWidth: 200,
        baseColor: 0x0a1628,
        backgroundColor: 0x0a1628,
        haloColor: 0x00ffff,
        size: 1.0,
        xOffset: 0.2,
        yOffset: 0,
        amplitude: 1.5,
      }))
    }

    return () => {
      if (vantaEffect) vantaEffect.destroy()
    }
  }, [vantaEffect])

  return (
    <div className="relative min-h-screen overflow-hidden font-poppins">
      {/* Vanta HALO Background */}
      <div
        ref={vantaRef}
        className="absolute inset-0 w-full h-screen z-0"
        style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col justify-center items-center min-h-screen">
        <Hero />
      </div>
    </div>
  )
}

export default Home

