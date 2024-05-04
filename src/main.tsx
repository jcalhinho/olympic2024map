// import React from 'react'
// import ReactDOM from 'react-dom/client'
// import App from './App'
 import './index.css'




import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";

const containerHTML = document.getElementById("root") as HTMLElement;
const root = ReactDOM.createRoot(containerHTML);

// const isLoggedIn : React.MutableRefObject<boolean> = useRef(false);
root.render(
      <BrowserRouter>
          <App />
      </BrowserRouter>
    
);