import React from "react";
import ReactDOM from "react-dom";
import App from "./App.jsx";
import { StoreProvider } from "./Store";
import "./index.css";

ReactDOM.render(
  <StoreProvider>
    <App />
  </StoreProvider>,
  document.getElementById("root")
);
