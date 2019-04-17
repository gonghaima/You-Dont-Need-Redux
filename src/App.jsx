import React from "react";
import { Store } from "./Store";

export default function App() {
  const { state, dispatch } = React.useContext(Store);
  const fetchDataAction = async () => {
    const data = await fetch(
      "https://api.tvmaze.com/singlesearch/shows?q=rick-&-morty&embed=episodes"
    );
    const dataJSON = await data.json();
    return dispatch({
      type: "FETCH_DATA",
      payload: dataJSON._embedded.episodes
    });
  };
  const toggleFavAction = episode =>
    dispatch({
      type: "ADD_FAV",
      payload: episode
    });
  React.useEffect(() => {
    state.episodes.length === 0 && fetchDataAction();
  });
  return (
    <React.Fragment>
      {console.log(state)}
      <div className="header">
        <h1>Rick and Morty</h1>
        <p>Pick your favourite episodes</p>
      </div>
      <section className="episode-layout">
        {state.episodes.map(episode => {
          return (
            <section key={episode.id} className="episode-box">
              <img
                src={episode.image.medium}
                alt={`Rick and Morty ${episode.name}`}
              />
              <div>{episode.name}</div>
              <section>
                <div>
                  Season: {episode.season} Number: {episode.number}
                </div>
                <button type="button" onClick={() => toggleFavAction(episode)}>
                  Fav
                </button>
              </section>
            </section>
          );
        })}
      </section>
    </React.Fragment>
  );
}
