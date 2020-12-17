import React from "react";
import { Switch, Route } from "react-router-dom";

import Login from "./Containers/Login/Login";
import Signup from "./Containers/Signup/Signup";
import ForgotPassword from "./Containers/ForgotPassword/ForgotPassword";
import ResetPassword from "./Containers/ResetPassword/ResetPassword";
import VerifyAccount from "./Containers/VerifyAccount/VerifyAccount";
import Dashboard from "./Containers/Dashboard/Dashboard";
import MailUsers from "./Containers/MailUsers/MailUsers";
import AddUser from "./Containers/AddUser/AddUser";

const App = () => {
  return (
    <main>
      <Switch>
        <Route
          path="/mail/mail-users"
          render={() => <Dashboard content={<MailUsers />} />}
        />
        <Route
          path="/users/add-user"
          render={() => <Dashboard content={<AddUser />} />}
        />
        <Route path="/verify/:token" component={VerifyAccount} />
        <Route path="/reset-password/:token" component={ResetPassword} />
        <Route path="/login" component={Login} />
        <Route path="/signup" component={Signup} />
        <Route path="/forgot-password" component={ForgotPassword} />
        <Route
          path="/"
          render={() => <Dashboard content={<h3>Dashboard</h3>} />}
        />
      </Switch>
    </main>
  );
};

export default App;
