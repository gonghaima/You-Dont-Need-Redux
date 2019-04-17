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