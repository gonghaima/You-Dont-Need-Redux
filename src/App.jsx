import React from "react";
import { Link } from "@reach/router";
import { Store } from "./Store";
const EpisodesList = React.lazy(() => import("./EpisodesList"));

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
  const toggleFavAction = episode => {
    const episodeInFavourites = state.favourites.includes(episode);
    let dispatchObj = {
      type: "ADD_FAV",
      payload: episode
    };
    if (episodeInFavourites) {
      const favouritesWithoutEpisode = state.favourites.filter(
        fav => fav.id !== episode.id
      );
      dispatchObj = {
        type: "REMOVE_FAV",
        payload: favouritesWithoutEpisode
      };
    }
    return dispatch(dispatchObj);
  };
  React.useEffect(() => {
    state.episodes.length === 0 && fetchDataAction();
  });
  const props = {
    episodes: state.episodes,
    toggleFavAction: toggleFavAction,
    favourites: state.favourites
  };
  return (
    <React.Fragment>
      <React.Suspense fallback={<div>Loading...</div>}>
        {console.log(state)}
        <header className="header">
          <div>
            <h1>Rick and Morty</h1>
            <p>Pick your favourite episodes</p>
          </div>
          <div>
            <Link to="/">Home</Link>{" "}
            <Link to="/faves">Favourite(s) {state.favourites.length}</Link>
          </div>
        </header>
        <section className="episode-layout">
          <EpisodesList {...props} />
        </section>
      </React.Suspense>
    </React.Fragment>
  );
}
