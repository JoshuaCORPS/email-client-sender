import React from "react";
import { Switch, Route } from "react-router-dom";

import Login from "./Containers/Login/Login";
import Signup from "./Containers/Signup/Signup";
import ForgotPassword from "./Containers/ForgotPassword/ForgotPassword";

const App = () => {
  return (
    <main>
      <Switch>
        <Route path="/login" component={Login} />
        <Route path="/signup" component={Signup} />
        <Route path="/forgot-password" component={ForgotPassword} />
      </Switch>
    </main>
  );
};

export default App;
