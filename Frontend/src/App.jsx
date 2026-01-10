import React from 'react'
import Home from './pages/Home'
import Onboarding from './pages/Onboarding'
import { Routes, Route } from "react-router-dom";

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/onboarding" element={<Onboarding />} />
      </Routes>
    </>
  )
}

export default App