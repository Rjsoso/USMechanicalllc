import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// Console message for curious developers
// Display toolbox icon
console.log(
  '%c ',
  'font-size: 1px; padding: 60px 80px; background: url(/toolbox-icon.png) no-repeat center; background-size: contain;'
)

console.log(
  '%c👷 Built with precision. %c🔧',
  'font-size: 16px; font-weight: bold; color: #2563eb; padding: 4px 0;',
  'font-size: 16px;'
)

console.log(
  '%cCuriosity brings you far. We\'re looking for talented & hardworking people!\n' +
  '%cInterested in mechanical contracting excellence? We\'ve been building exceptional systems since 1963.\n' +
  '%cReach out to us at info@usmechanicalllc.com or call 801-785-6028\n\n' +
  '%c- The US Mechanical Team.',
  'font-size: 13px; color: #1f2937; line-height: 1.6;',
  'font-size: 13px; color: #4b5563; line-height: 1.6;',
  'font-size: 13px; font-weight: bold; color: #2563eb; line-height: 1.6;',
  'font-size: 12px; color: #6b7280; font-style: italic; line-height: 1.6;'
)

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
