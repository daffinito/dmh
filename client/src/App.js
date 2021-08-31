import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { CookiesProvider, withCookies } from "react-cookie";
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import HomeRoute from "./routes/HomeRoute";
import NotFoundRoute from "./routes/NotFoundRoute";
import ResultsRoute from "./routes/ResultsRoute";
import WallRoute from "./routes/WallRoute";
import DispensarySignUpRoute from "./routes/DispensarySignUpRoute";
import AdminConsoleRoute from "./routes/AdminConsoleRoute";
import AccountLoginRoute from "./routes/AccountLoginRoute";
import AccountConsoleRoute from "./routes/AccountConsoleRoute";
import MasterAccountConsoleRoute from "./routes/MasterAccountConsoleRoute";
import NewUserRoute from "./routes/NewUserRoute";
import reducers from "./reducers";
import { handleResize } from "./actions";
import ForgotPasswordRoute from "./routes/ForgotPasswordRoute";

const createStoreWithMiddleware = applyMiddleware(thunk)(createStore);
const store = createStoreWithMiddleware(reducers);

// handle window resizes events through redux
window.addEventListener("resize", () => {
  store.dispatch(handleResize(window.innerWidth));
});

const App = props => {
  return (
    <CookiesProvider>
      <Provider store={store}>
        <Router>
          <Switch>
            <Route exact path="/" render={p => <HomeRoute {...p} cookies={props.cookies} />} />
            <Route exact path="/q/:id" render={p => <HomeRoute {...p} cookies={props.cookies} />} />
            <Route exact path="/results" render={p => <ResultsRoute {...p} cookies={props.cookies} />} />
            <Route exact path="/saacheck" render={p => <WallRoute {...p} cookies={props.cookies} />} />
            <Route exact path="/signup/dispensary" render={p => <DispensarySignUpRoute {...p} cookies={props.cookies} />} />
            <Route exact path="/signup/dispensary/:token" render={p => <DispensarySignUpRoute {...p} cookies={props.cookies} />} />
            <Route exact path="/signup/:token" render={p => <NewUserRoute {...p} cookies={props.cookies} />} />
            <Route exact path="/forgotpassword" render={p => <ForgotPasswordRoute {...p} cookies={props.cookies} />} />
            <Route exact path="/forgotpassword/:token" render={p => <ForgotPasswordRoute {...p} cookies={props.cookies} />} />
            <Route exact path="/admin/console" render={p => <AdminConsoleRoute {...p} cookies={props.cookies} />} />
            <Route exact path="/account/:id/console" render={p => <AccountConsoleRoute {...p} cookies={props.cookies} />} />
            <Route exact path="/account/:id/masterconsole" render={p => <MasterAccountConsoleRoute {...p} cookies={props.cookies} />} />
            <Route exact path="/login" render={p => <AccountLoginRoute {...p} cookies={props.cookies} />} />
            <Route component={NotFoundRoute} />
          </Switch>
        </Router>
      </Provider>
    </CookiesProvider>
  );
};

export default withCookies(App);
