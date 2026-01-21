import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// Console message for curious developers
console.log(
  '%c🧰',
  'font-size: 60px; line-height: 1;'
)

console.log(
  '%c👷 Built with precision. %c🔧',
  'font-size: 16px; font-weight: bold; color: #dc2626; padding: 4px 0; text-shadow: 0 0 5px #dc2626;',
  'font-size: 16px;'
)

console.log(
  '%cCuriosity brings you far. We\'re looking for talented & hardworking people!\n' +
  '%cInterested in mechanical contracting excellence? We\'ve been building exceptional systems since 1963.\n' +
  '%cReach out to us at info@usmechanicalllc.com or call 801-785-6028\n\n' +
  '%c- The US Mechanical Team.',
  'font-size: 13px; color: #ffffff; line-height: 1.6; text-shadow: 0 0 5px #ffffff;',
  'font-size: 13px; color: #ffffff; line-height: 1.6; text-shadow: 0 0 5px #ffffff;',
  'font-size: 13px; font-weight: bold; color: #dc2626; line-height: 1.6; text-shadow: 0 0 5px #dc2626;',
  'font-size: 12px; color: #ffffff; font-style: italic; line-height: 1.6; text-shadow: 0 0 5px #ffffff;'
)

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
