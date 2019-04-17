import React from "react";
import ReactDOM from "react-dom";
import App from "./App.jsx";
import { StoreProvider } from "./Store";

ReactDOM.render(
  <StoreProvider>
    <App />
  </StoreProvider>,
  document.getElementById("root")
);
