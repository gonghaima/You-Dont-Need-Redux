import React from "react";
import { Store } from "./Store";

export default function App() {
  const store = React.useContext(Store);

  return (
    <React.Fragment>
      {console.log(store)}
      <div>
        <h1>Rick and Morty</h1>
        <p>Pick your favourite episodes</p>
      </div>
    </React.Fragment>
  );
}
