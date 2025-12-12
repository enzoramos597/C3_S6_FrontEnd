import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { ProfileProvider } from './contexts/ProfileContext.jsx'
import { AuthProvider } from './contexts/AuthContext.jsx'
import { ToastContainer } from 'react-toastify'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <ProfileProvider>
      <BrowserRouter>
      <ToastContainer/>
      <App />
    </BrowserRouter> 
    </ProfileProvider>  
    </AuthProvider>         
  </StrictMode>,
)
