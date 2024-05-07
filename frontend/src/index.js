import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);



// HERE IS THE ORIGINAL PROJECT INDEX.JS FILE
// import React from 'react';
// import { createRoot } from 'react-dom/client';
// import './styles/App.css';
// import App from './components/App';
// import * as serviceWorker from './components/serviceWorker';
// // import mysql from 'mysql';

// const root = createRoot(document.getElementById('root'));
// root.render(<App />);

// serviceWorker.unregister();
