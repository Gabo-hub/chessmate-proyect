import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './estilos/globales.css';

window.onerror = function(msg, url, line, col, error) {
  document.getElementById('root').innerHTML =
    '<pre style="color:red;background:#111;padding:20px;min-height:100vh;white-space:pre-wrap;font-size:14px">' +
    'ERROR: ' + msg + '\nArchivo: ' + url + '\nLinea: ' + line +
    (error ? '\n\n' + (error.stack || error) : '') +
    '</pre>';
  return false;
};

window.onunhandledrejection = function(e) {
  document.getElementById('root').innerHTML =
    '<pre style="color:orange;background:#111;padding:20px;min-height:100vh;white-space:pre-wrap;font-size:14px">' +
    'PROMISE ERROR: ' + (e.reason?.message || e.reason) +
    (e.reason?.stack ? '\n\n' + e.reason.stack : '') +
    '</pre>';
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
