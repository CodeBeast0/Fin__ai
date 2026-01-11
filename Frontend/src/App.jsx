import React from 'react'
import Home from './pages/Home'
import Onboarding from './pages/Onboarding'
import { Routes, Route } from "react-router-dom";
import Dashboard from './pages/Dashboard';

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </>
  )
}

export default App