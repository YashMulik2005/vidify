import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { MainProvider } from './components/Context/MainContext'

ReactDOM.createRoot(document.getElementById('root')).render(

  <React.StrictMode>
    <MainProvider >
      <App />
    </MainProvider >
  </React.StrictMode>

)
