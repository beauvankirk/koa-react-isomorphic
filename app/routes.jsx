/* @flow */
import React from "react";
import { syncHistoryWithStore } from "react-router-redux";
import {
  browserHistory,
  createMemoryHistory,
  Router,
  Route
} from "react-router";
import injectReducers from "./client/helpers/injectReducers";

export const getClientHistory = (store: Object): Object =>
  syncHistoryWithStore(browserHistory, store);

export const getServerHistory = (store: Object, url: string): Object =>
  syncHistoryWithStore(createMemoryHistory(url), store);

export const getRoutes = (
  history: Object,
  store: Object,
  options: Object = {}
): Object => (
  <Router history={history} {...options}>
    <Route
      path="/"
      getComponent={(nextState, cb) => {
        // $FlowFixMe
        require.ensure(
          [
            "./client/components/todos",
            "./client/components/todos/logicBundle"
          ],
          require => {
            const {
              default: todosReducer,
              mountPoint: todosMountPoint
            } = require("./client/components/todos/logicBundle");

            injectReducers(store, { [todosMountPoint]: todosReducer });
            cb(null, require("./client/components/todos").default);
          },
          "todos-page"
        );
      }}
    />
    <Route
      path="/static-page"
      getComponent={(nextState, cb) => {
        // $FlowFixMe
        require.ensure(
          ["./client/components/static-page"],
          require => {
            cb(null, require("./client/components/static-page").default);
          },
          "static-page"
        );
      }}
    />
  </Router>
);
