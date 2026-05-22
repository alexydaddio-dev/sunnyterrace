import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import Host from './Host.jsx'

const isHost = window.location.pathname === '/host'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {isHost ? <Host /> : <App />}
  </React.StrictMode>,
)
