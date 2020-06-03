import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import "./index.css";
import "./App.css";
import "./assets/css/argon-dashboard-react.css";
import * as serviceWorker from "./serviceWorker";
import MainLayout from "./layouts/MainLayout.js";
import VideoLayout from "./layouts/VideoLayout";

ReactDOM.render(
  <BrowserRouter>
    <Switch>
      <Route path="/main" render={(props) => <MainLayout {...props} />} />
        <Route path="/video" render={(props) => <VideoLayout {...props} />} />
      <Redirect from="/" to="/main/upload" />
    </Switch>
  </BrowserRouter>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
