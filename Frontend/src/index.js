import React from "react";
import ReactDOM from "react-dom";
import { createStore } from "redux";
import { Provider } from "react-redux";
import combReducers from "./reducers";

import App from "./App";
import "bootstrap/dist/css/bootstrap.min.css";

function saveToLocalStorage(state) {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem("state", serializedState);
  } catch (e) {
    console.log(e);
  }
}

function loadFromLocalStorage() {
  try {
    const serializedState = localStorage.getItem("state");
    if (serializedState == null) {
      return undefined;
    } else {
      return JSON.parse(serializedState);
    }
  } catch (e) {
    console.log(e);
    return undefined;
  }
}

const persistedState = loadFromLocalStorage();
const redux_store = createStore(
  combReducers,
  persistedState,
  window.__REDUX_DEVTOOLS_EXTENSION__()
);

ReactDOM.render(
  <React.StrictMode>
    <Provider store={redux_store}>
      <App />
    </Provider>
  </React.StrictMode>,

  document.getElementById("root")
);
redux_store.subscribe(() => {
  saveToLocalStorage(store.getState());
});
