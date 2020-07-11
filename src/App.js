import React from "react";
import "./App.css";
import { createBrowserHistory as createHistory } from "history";
import { Route, HashRouter, Switch } from "react-router-dom";
import EnterUsername from "./pages/EnterUsername";
import "bootstrap/dist/css/bootstrap.min.css";
import PugPage from "./pages/PugPage";

const history = createHistory();

function App() {
  return (
    <div className="App">
      <HashRouter history={history}>
        <Switch>
          <Route exact path="/" component={EnterUsername} />
          <Route path="/pug/:battletag" component={PugPage} />
        </Switch>
      </HashRouter>
    </div>
  );
}

export default App;
