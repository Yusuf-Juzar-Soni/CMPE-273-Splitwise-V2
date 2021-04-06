import React from "react";
import { render, cleanup } from "@testing-library/react";
import TestRenderer from "react-test-renderer";
import { createStore } from "redux";
import { MemoryRouter } from "react-router-dom";
// import configureStore from 'redux-mock-store';
import { Provider } from "react-redux";
import "@testing-library/jest-dom";

import combReducers from "../reducers";
import Login from "./Login";

const store = createStore(combReducers);

const component = TestRenderer.create(
  <Provider store={store}>
    <Login></Login>
  </Provider>
);

afterEach(cleanup);

it("renders", async () => {
  expect(component.toJSON()).toMatchSnapshot();
});

test("Check for header", async () => {
  const { getByTestId } = render(
    <Provider store={store}>
      <Login></Login>
    </Provider>
  );
  expect(getByTestId("Login")).toHaveTextContent("LOGIN");
});
