import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import NavigateWrapper from "./components/NavigateWrapper.jsx";
import { BrowserRouter as Router } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Router>
      <NavigateWrapper />
    </Router>
  </React.StrictMode>
);
