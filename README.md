# You Don't Need Redux

originally from Richard Oliver Bray
![Alt title](./assets/title.jpeg)

If you’ve been in the React world for a decent amount of time you would have heard about Redux. Redux is cool, it’s a way of getting separate components to alter and pull data from the main application store, but it’s not easy to pick up, especially for beginners.

There are these things called reducers, actions, and action creators. There are methods like mapDispatchToProps and mapStateToProps as well as a bunch of files and folders that need to be created for conventional reasons. For just sharing and changing data it is a lot of work.

With the introduction of the Context API and hooks, we can sort of recreate Redux in our React app without actually installing redux and react-redux. I will attempt to show you how in this article.

## What we’re building

We’re going to build a tiny app that lates you pick your favourite Rick and Morty episodes This isn’t a tutorial on CSS so we won’t focus much on styling. The full final project is here on Github or here in Codesandbox, feel free to reference it if you get lost.

![Alt title](./assets/final.gif)

Note: If you just want the steps and not the explanations, just follow the bullet points.

## The Setup

Make sure you have Nodejs installed on your machine (I’m using version 10.12.0) and we’ll put the app together using,
create-react-app:
`$ npx create-react-app no-redux`

Once it’s done, start it by running `$ npm start` in the no-redux directory.
Then open the package.json file. Your version of react and react-domshould be above 16.7.0 to use hooks, if not install the newer version by running.

`$ npm i react@16.8.0-alpha.1 react-dom@16.8.0-alpha.1`

- To avoid confusion let’s delete these files from src/ App.css, App.test.js, logo.svg, and serviceWorker.js.
- In our index.js and remove line 3, 5, and everything below line 8.
- Rename App.js to App.jsx. Delete everything and replace it with this:

```javascript
import React from "react";

export default function App() {
  return (
    <React.Fragment>
      <div>
        <h1>Rick and Morty</h1>
        <p>Pick your favourite episodes</p>
      </div>
    </React.Fragment>
  );
}
```

## The Redux principles

According to its documentation Redux can be described in three fundamental **principles**, **stores**, **actions**, and **reducers**.

- An action is the only thing that should trigger a state change. It typically returns an object with a type and a payload.

  ```javascript
  function actionFunc(dispatch) {
    return dispatch({ type: "COMPLETE_TODO", payload: 1 });
  }
  ```

  The dispatch argument here tells the action what store this reducer the object needs to affect as an application can have multiple reducers. This will make sense later on.

- A reducer specifies what part of the store will be affected by the action. Because redux stores are immutable, reducers return a new store that replaces the current one. Reducers are typically written as switch statements.

  ```javascript
  function visibilityFilter(state, action) {
    switch (action.type) {
      case "SET_VISIBILITY_FILTER":
        return action.payload;
      default:
        return state;
    }
  }
  ```

- The store holds all the application data in an object tree. Redux has one store but other state managers like Facebook’s Flux, can have multiple stores. If you’re familiar with React think of the store as state, but for the whole application.

  ```javascript
  {
  visibilityFilter: 'SHOW_ALL',
  todos: [
    {
      text: 'Consider using Redux',
      completed: true,
    }
  ]
  }
  ```

- Our component or any component in our application has access to the store and can change the store by triggering an action.

## Creating our Store

- Create a new file in src/ called Store.js

Here we’re going to use react context to create a parent component that will give it’s child components access to the data it holds. I won’t go much into context but essentially is has a provider-consumer relationship. The provider has all the data and the consumer consumes it (makes sense).

- Add the following code to your Store.js file

```javascript
import React from "react";

export const Store = React.createContext();

const initialState = {};

function reducer() {}

export function StoreProvider(props) {}
```

Line 3 creates our context object which children components will subscribe to. For now, let’s skip the inisitalState object and reducer function and go to StoreProvider.

This will be the react component that will encapsulate the other components in the application. It has an argument of props because that’s how we’ll get access to the other child components.

- Add this code to the StoreProvider function

```javascript
export function StoreProvider(props) {
return <Store.Provider value='data from store'>{props.children
</Store.Provider>
}
```

Now go to your index.js file and import StoreProvider from ./Store
import { StoreProvider } from './Store';

Still in index.js, nest your `<App />` component in `<StoreProvider>` your code should look like this

```javascript
ReactDOM.render(
  <StoreProvider>
    <App />
  </StoreProvider>,
  document.getElementById("root")
);
```

- In your App.jsx file import, your Store context below the React import.

```javascript
import { Store } from './Store';
On the first line inside the App function, add
const store = React.useContext(Store);
```

We’re using our first hook here, the useContext one. This will give the component access to the data in the value attribute of our context provider.

- On the first line inside <React.Fragment> add {console.log(store)}
- Now when you run the app and look in the dev tools inspector, you should see some data from your store.

Data from the store in your console
If you’re not getting this don’t panic. Let’s make sure we’ve got the same code.

File Structure:

What your file structure should look like at this point

1. Code Structure:

```javascript
// index.js

import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { StoreProvider } from "./Store";

ReactDOM.render(
  <StoreProvider>
    <App />
  </StoreProvider>,
  document.getElementById("root")
);

// Store.js

import React from "react";

export const Store = React.createContext();

const initialState = {};

function reducer() {}

export function StoreProvider(props) {
  return (
    <Store.Provider value="data from store">{props.children}</Store.Provider>
  );
}

// App.jsx

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
```

Note: You’ll notice I’m using syntax React.Fragment and React.useContext instead of importing them directly like import React, {Fragment} from ‘react’. This is because we will move and change a lot of the code during refactoring, so please try to follow along with me for now.

## Creating our Reducer

If you’ve been following along or have looked at the code snippet above, you’ll notice we’ve already started putting in some code for our reducer. Let’s flesh that code out.

- In our Store.js file add this code to your empty initialState object

```javascript
const initialState = {
  episodes: [],
  favourites: []
};
```

This is what our initial store will look like before any new bits of data are added.

- Amend the reducer function to look like this

```javascript
function reducer(state, action) {
  switch (action.type) {
    case "FETCH_DATA":
      return { ...state, episodes: action.payload };
    default:
      return state;
  }
}
```

The reducer function as seen previously takes two arguments, state — the data in the store at the time it’s run, and action — the action object that is returned. Currently, our reducer has one case, ‘FETCH_DATA’ which will replace our episodes array with the data that is passed back. The default keyword returning state is needed just in case an invalid action is dispatched.

In our StoreProvider function, add these lines above the return keyword

```javascript
const [state, dispatch] = React.useReducer(reducer, initialState);
const value = { state, dispatch };
```

We’re using our second hook, the useReducer one. This takes two arguments, our reducer, and our intialState. It returns to us an array with state — the data in the store, and dispatch — how we dispatch an action to our reducer (and in turn change our state). I hope this is making sense. Feel free to refer to the redux principles diagram which should help.

We then turn our new state and dispatch variables into an object and assign it to a variable called value. Essentially value is the same as

```javascript
const value = {
  state: state,
  dispatch: dispatch
};
```

But can be written shorter in Javascript ES6 and above.

- In the Store.Provider replace the value='data from store' attribute with

```javascript
value = { value };
```

Now we can pass our state and dispatch to our child component.

- Go to your App.jsx file and change const store = React.useContext(Store) to

```javascript
const { state, dispatch } = React.useContext(Store);
```

- Now update the store in the console log to state and take a look at the console.

You should see it’s pulling our initialState data from Store.jsx. Now let’s work on putting some data in there.

Note: Don’t worry about the dispatch variable not being used at the moment, we will take care of that now.

## Creating our Action

The final piece to our redux puzzle.

- In our App.jsx file, right before the return keyword create an anonymous async function and call it fetchDataAction

```javascript
const fetchDataAction = async () => {};
```

We’re going to use the fetch api to get data from the tvmaze api using async/await.

Add the following code to our new fetchDataAction function

```javascript
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
```

I encourage you to go to the api url in your browser and see the data. The list of episodes are under \_embedded that why line 6 looks the way it does.

We return the dispatch method with an object of type and payload as an attribute so that our reducer will know what case to execute.

- We want to run fetchDataAction each time the page loads so let’s put it in a useEffect hook above our return keyword.

```javascript
React.useEffect(() => {
  state.episodes.length === 0 && fetchDataAction();
});
```

The above code is similar to componentDidMount. Basically then the app loads, if state.episodes is empty (which it is by default), then run fetchDataAction.

Save, and refresh the page. Look in the dev tools console and you should see some data.

Look at all that data
And that’s the redux pattern in a nutshell. Something triggers an action (in our case it’s a page load), the action runs a case in the reducer which in turn updates the store. Now let’s make use of that data.

In our App.jsx file add this code below <p>Pick your favourite episodes</p>

```javascript
<section>
  {state.episodes.map(episode => {
    return (
      <section key={episode.id}>
        <img
          src={episode.image.medium}
          alt={`Rick and Morty ${episode.name}`}
        />
        <div>{episode.name}</div>
        <section>
          <div>
            Season: {episode.season} Number: {episode.number}
          </div>
        </section>
      </section>
    );
  })}
</section>
```

This code essentially loops over the objects in our episodes array (after it has been populated with data from the api), and populate the dom with this data. Feel free to add or remove data points to your choosing.

Save and you should see some episodes in your browser.

## Some styling

I know I mentioned in Part 1 this tutorial won’t focus on styling but we’re going to do a tiny bit here just to make our app more–navigatable.

- Add the following code to your index.css file

```css
.episode-layout {
  display: flex;
  flex-wrap: wrap;
  min-width: 100vh;
}

.episode-box {
  padding: 0.5rem;
}

.header {
  align-items: center;
  background: white;
  border-bottom: 1px solid black;
  display: flex;
  justify-content: space-between;
  padding: 0.5rem;
  position: sticky;
  top: 0;
}
.header * {
  margin: 0;
}
```

- Just before the closing brace of the style for body add

`font-size: 10px;`

- In your index.js file add this line below the StoreProvider import

`import './index.css';`

- In our App.jsx file in the `<section>` tag above {state.episode.map add a className attribute which should equal episode-layout
- On the first `<section>` tag inside our episode map, add another className attribute equalling this class episode-box
- Copy the last `</div>` just before the closing </React.Fragment> tag and place it right below our <p> tag.
- Finally, give the `<div>` above our `<h1> Rick and Morty </h1>` a className of header.

If you followed those instructions correctly your site should look like this.

If you got lost along the way, here is the full **App.jsx** file with all it’s styling classes.

```javascript
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
              </section>
            </section>
          );
        })}
      </section>
    </React.Fragment>
  );
}
```

## Adding favourites

- Still in our App.jsx file, below our <div> with the season and episode number, add this

```javascript
<button type="button" onClick={() => toggleFavAction(episode)}>
  Fav
</button>
```

This should hopefully break your app because the toggleFavAction function does not exist. We’ll fix that now.

- Below fetchDataAction write this code

```javascript
const toggleFavAction = episode =>
  dispatch({
    type: "ADD_FAV",
    payload: episode
  });
```

As you can see, all toggleFavAction does is return a dispatch that sends the episode object to the store. You’ve probably guessed what we need to do now.

Open Store.js and add this case above default in our reducer.
case 'ADD*FAV':
return {
...state,
favourites: [...state.favourites, action.payload]
};
As you can see, our \*\_ADD_FAV*\* case updates our favourites array with the new episode object we clicked on.

- Go to your browser and open the dev tools console. If all went well, click on the fav button and you should see our favourites array update.

As you’ve probably figured out the button should toggle a favourite episode not just add one. Let’s amend our **toggleFavAction**.

## Removing favourites

- Go to your toggleFavAction function and change it to look like this

```javascript
const toggleFavAction = episode => {
    const episodeInFavourites = state.favourites.includes(episode);
    let dispatchObj = {
      type: 'ADD_FAV',
      payload: episode
    };
    if (episodeInFavourites) {
      const favouritesWithoutEpisode = state.favourites.filter(fav => fav.id !== episode.id)
      dispatchObj = {
        type: 'REMOVE_FAV',
        payload: favouritesWithoutEpisode
      };
    }
    return dispatch(dispatchObj);
```

Note: The variable names used here are verbose so that it’s easier to understand what is going on, feel free to amend and refactor where you see fit.
I’ll do a quick run-through of what the above code is doing. Line 2 episodeInFavourites checks if the episode object bassed in from the argument already exists in our favourites array. If it does, then favouritesWithoutEpisode uses the array.filter method to create a new favourites array without that episode, and a different action is dispatched to the reducer.

- In Store.js add this new case to our reducer.
  case 'REMOVE_FAV':

```javascript
return {
  ...state,
  favourites: action.payload
};
```

And after that everything should work, but let’s indicate to the user that something is changing.

Go back to our App.jsx file and let’s update the div with className header to look like this.

```javascript
<header className="header">
  <div>
    <h1>Rick and Morty</h1>
    <p>Pick your favourite episodes</p>
  </div>
  <div>Favourite(s) {state.favourites.length}</div>
</header>
```

Go to your `<button>` element and replace the word Fav with this code
{state.favourites.find(fav => fav.id === episode.id) ? 'Unfav' : 'Fav'}
This is using the array.find method to check if the id of this episode object exists in the favourites array. If it does, the word Unfav will show.

One more cheeky bit of styling. Locate the `<section>` below `<div>{episode.name}</div>` and give it a style attribute that looks like this.

```javascript
style={{ display: 'flex', justifyContent: 'space-between' }
```

Hopefully all has gone well and you have code that does this in your browser.

If you got lost along the way don’t worry. You can grab all the code up until this point below.

[codesandbox.io](https://codesandbox.io/embed/820pqrvr1j)

This is a project which shows off how to use hooks and context to replace Redux.

## Splitting up our code

Before we get to the exciting stuff, let’s do some basic code splitting.

Create a new file called EpisodesList.jsx and give it this code

```javascript
import React from "react";
export default function EpisodesList(props) {
  const { episodes, toggleFavAction, favourites } = props;
}
```

You can probably figure out what we’re about to do here. We’re splitting the bit that maps the episodes into it’s own component.

- In App.jsx, copy everything in state.episodes.map and paste them below the const of our EpisodesList.jsx file
- In EpisodesList.jsx replace state.episodes.map with return episodes.map
- Where it says state.favourites.find replace that with favourites.find
  After all that is done your EpisodesList.jsx file should look like this:

```javascript
import React from "react";

export default function EpisodesList(props) {
  const { episodes, toggleFavAction, favourites } = props;

  return episodes.map(episode => {
    return (
      <section key={episode.id} className="episode-box">
        <img
          src={episode.image.medium}
          alt={`Rick and Morty ${episode.name}`}
        />
        <div>{episode.name}</div>
        <section style={{ display: "flex", justifyContent: "space-between" }}>
          <div>
            Season: {episode.season} Number: {episode.number}
          </div>
          <button type="button" onClick={() => toggleFavAction(episode)}>
            {favourites.find(fav => fav.id === episode.id) ? "Unfav" : "Fav"}
          </button>
        </section>
      </section>
    );
  });
}
```

## Oh hello suspense and lazy

- In your App.jsx file add this line below your imports

```javascript
const EpisodesList = React.lazy(() => import("./EpisodesList"));
```

- Nest `<React.Suspense>` tags right inside your <React.Fragment> ones
- Your opening React.Suspense tag should have this attribute

```javascript
fallback={<div>Loading...</div>}
```

- Now remove everything in <section className='episode-layout></section> and replace it with this

```javascript
<EpisodesList {...props} />
```

- Above your return keyword add the following code

```javascript
const props = {
  episodes: state.episodes,
  toggleFavAction: toggleFavAction,
  favourites: state.favourites
};
```

Also if you haven’t done so already please delete `{console.log(state)}` from your code.
And with all that done, save, refresh and everything should work as before with the word ‘Loading…’ for those with a slow connection.

## Adding some routing with Reach/Router

Usually, react projects are routed with react-router by React training, but this time we’re going to try out Reach. A newer, more accessible router for React. If you’ve used react-router before the API for reach is quite similar.

## Install reach router with

`npm install @reach/router`
Once that’s done, in your App.jsx file add the following code inside your <header> below the closing <div>

```html
<div>
  <Link to='/'>Home</Link>{' '}
  <Link to='/faves'>Favourite(s) {state.favourites.length}</Link>
</div>
```

Remove the old favourites div

`<div>Favourite(s) {state.favourites.length}</div>`

- And import Link from reach/router

```javascript
import { Link } from "@reach/router";
```

Save and look at the page. You’ll notice we have some links at the top right corner. Let’s make some pages for these links.

## Moving things around

- Create two files, HomePage.jsx and FavPage.jsx inside the same directory as App.jsx
- In App.jsx cut all our actions, our props const, and our React.Effect and paste them in HomePage.jsx
- Cut the lazy EpisodeList import from App.js and paste it in HomePage.jsx along with the other imports
- Then in the return part of HomePage.jsx add a parent React.Fragment with a child React.Suspense, with a child section, then the EpisodeList component with it’s props.
- At the end of this all your HomePage.jsx should look like this:

In App.jsx on the line that has export default, add the argument props to the App function and add {props.children} above the closing </React.Fragment> tag.
The code in your App.jsx file should now look like this:

```javascript
import React from "react";
import { Store } from "./Store";

const EpisodesList = React.lazy(() => import("./EpisodesList"));

export default function HomePage() {
  const { state, dispatch } = React.useContext(Store);

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

  const props = {
    episodes: state.episodes,
    toggleFavAction: toggleFavAction,
    favourites: state.favourites
  };

  React.useEffect(() => {
    state.episodes.length === 0 && fetchDataAction();
  });

  return (
    <React.Fragment>
      <React.Suspense fallback={<div>Loading...</div>}>
        <section className="episode-layout">
          <EpisodesList {...props} />
        </section>
      </React.Suspense>
    </React.Fragment>
  );
}
```

- In your index.js file add an import for the HomePage and a Router from reach/router

```javascript
import HomePage from "./HomePage";
import { Router } from "@reach/router";
```

- Now replace the code nested in `<StoreProvider>` with this

  ```javascript
  <StoreProvider>
    <Router>
      <App path="/">
        <HomePage path="/" />
      </App>
    </Router>
  </StoreProvider>
  ```

- Save your files and refresh the browser, your site should have some simple navigation between two pages with the same header component.

Everything we’ve done so far could have been done without the redux pattern. We could have one component that could fetch data and populate a page in regular react. What we’re about to do from here on I hope will show you why we went about creating this project the ‘redux’ way.

## Adding our favourites page

This page will look very similar to our HomePage.jsx file but only show the episodes in our favourites array, this is a simple thing to achieve.

Note: In the interest of time I will copy and paste similar code, however, you are welcome to look at the final code on github or codesbox to see the refactored version.

- In your FavePage.jsx file populate it with the following code

```javascript
import React from "react";
import { Store } from "./Store";
const EpisodesList = React.lazy(() => import("./EpisodesList"));
export default function FavPage() {
  const { state, dispatch } = React.useContext(Store);
  const props = {
    episodes: state.favourites,
    toggleFavAction: toggleFavAction,
    favourites: state.favourites
  };
  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <div className="episode-layout">
        <EpisodesList {...props} />
      </div>
    </React.Suspense>
  );
}
```

As you can see here the main difference between this file and the HomePage.jsx file is the props const for the episodes key in the object has state.favourites as a value instead of state.episodes.

- Copy the toggleFavAction function from HomePage.jsx to FavPage.jsx right above the props const.
- Now go to your index.js file and below

  ```javascript <HomePage path='/' /> add
  <FavPage path="/faves" />
  ```

- And import your FavPage with the rest of the imports

```javascript
import FavPage from "./FavPage";
```

- Save your code, refresh the browser and you should be able to add, view, and remove your favourite Rick and Morty episodes.

Here is a great example of the app level state being shared and changed by different components. Episodes can be added and removed on HomePage.jsx which is read and can be changed by the FavPage.jsx, the App.jsx displays the length of the favourite episodes each time they change. All this one app level state and no component level states. All without the need to download loads of extra packages, pretty cool right?

## Conclusion

As you can see with the power of the context api and react hooks it is entirely possible to omit redux altogether for small to medium-sized applications. I know redux has some benefits that this option doesn’t, middleware and some great developer tools but it’s very confusing for a newcomer and this process is a bit simpler and doesn’t require you to download more plugins which keeps your app lean.
