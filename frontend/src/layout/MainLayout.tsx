import React, { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Navbar from '../components/landing/Navbar'
import WhatsAppButton from '../components/common/WhatsAppButton'
import Footer from '../components/landing/Footer'

const MainLayout = () => {
      const location = useLocation()

  useEffect(()=>{

    document.body.scrollIntoView({
      behavior:'smooth',
      block:'start',
    })

  },[location.pathname])
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
     
      <Outlet></Outlet>
     
      <Footer />
      
      {/* Floating WhatsApp Button */}
      <WhatsAppButton
        size="lg"
        variant="floating"
        className="fixed bottom-6 right-6 z-50"
      />
    </div>
  )
}

export default MainLayout