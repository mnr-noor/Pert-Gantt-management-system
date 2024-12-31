import React from 'react';
import ReactDOM from 'react-dom/client'; // For React 18 and above
import App from './App'; // Import your main component (App.jsx)

import './index.css'; // Import your global styles (tailwind will be applied here)

const root = ReactDOM.createRoot(document.getElementById('root')); // Create a root element
root.render(
  <React.StrictMode>
    <App />  {/* Your main application component */}
  </React.StrictMode>
);
