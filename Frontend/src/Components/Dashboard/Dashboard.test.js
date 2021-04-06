import React from "react";
import { render, cleanup } from "@testing-library/react";
import TestRenderer from "react-test-renderer";
import { createStore } from "redux";
import { MemoryRouter } from "react-router-dom";
// import configureStore from 'redux-mock-store';
import { Provider } from "react-redux";
import "@testing-library/jest-dom";
import Dashboard from "./Dashboard";
import combReducers from "../../reducers";
import TopNavBar from "../TopNavBar";

const store = createStore(combReducers);

const component = TestRenderer.create(
  <Provider store={store}>
    <MemoryRouter>
      <Dashboard>
        <TopNavBar />
      </Dashboard>
    </MemoryRouter>
  </Provider>
);

afterEach(cleanup);

it("renders", async () => {
  expect(component.toJSON()).toMatchSnapshot();
});

test("Check for header", async () => {
  const { getByTestId } = render(
    <Provider store={store}>
      <MemoryRouter>
        <Dashboard>
          <TopNavBar />
        </Dashboard>
      </MemoryRouter>
    </Provider>
  );
  expect(getByTestId("Settle Up")).toHaveTextContent("Settle Up");
});
