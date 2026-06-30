import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './app/App.jsx'
import { RouterProvider } from 'react-router-dom'
import { router } from './app.route.jsx'
import { Provider } from 'react-redux'
import {store} from './app/app.store.js'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    
      <Provider store={store}>
        
        <App />
       
      </Provider>
    
  </StrictMode>,
)
