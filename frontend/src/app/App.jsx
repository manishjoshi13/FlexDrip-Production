import React from 'react'
import { useAuth } from '../features/auth/hooks/useAuth'
import { useEffect } from 'react'
import { RouterProvider } from 'react-router-dom'
import { router } from '../app.route.jsx'
import ChatbotWidget from '../components/ChatbotWidget'

const App = () => {
  const {getMe}=useAuth()
  useEffect(()=>{
     getMe();
  },[])
  return (
     <>
        <RouterProvider router={router} />
        <ChatbotWidget />
     </>
  )
}

export default App