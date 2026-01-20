import React from 'react'
import Home from './pages/Home'
import Onboarding from './pages/Onboarding'
import { Routes, Route } from "react-router-dom";
import Dashboard from './pages/Dashboard';

import NotFound from './pages/NotFound';

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  )
}

export default App