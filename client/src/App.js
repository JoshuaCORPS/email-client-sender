import React from "react";
import { Switch, Route } from "react-router-dom";

import Login from "./Containers/Authentication/Login/Login";
import Signup from "./Containers/Authentication/Signup/Signup";
import ForgotPassword from "./Containers/Authentication/ForgotPassword/ForgotPassword";
import ResetPassword from "./Containers/Authentication/ResetPassword/ResetPassword";
import VerifyAccount from "./Containers/Authentication/VerifyAccount/VerifyAccount";
import Dashboard from "./Containers/Dashboard/Dashboard";
import MailUsers from "./Containers/MailUsers/MailUsers";
import AddUser from "./Containers/AddUser/AddUser";
import UpdateInfo from "./Containers/UpdateInfo/UpdateInfo";
import UpdatePassword from "./Containers/UpdatePassword/UpdatePassword";
import ManageUsers from "./Containers/ManageUsers/ManageUsers";
import EditUser from "./Containers/EditUser/EditUser";
import AddCategory from "./Containers/AddCategory/AddCategory";
import ManageCategories from "./Containers/ManageCategories/ManageCategories";
import EditCategory from "./Containers/EditCategory/EditCategory";

const App = () => {
  return (
    <main>
      <Switch>
        <Route
          path="/users/:userid/edit"
          render={() => (
            <Dashboard
              defaultOpenSub="sub2"
              defaultKey="4"
              content={<EditUser />}
            />
          )}
        />
        <Route
          path="/categories/:category/edit"
          render={() => (
            <Dashboard
              defaultOpenSub="sub3"
              defaultKey="6"
              content={<EditCategory />}
            />
          )}
        />
        <Route
          path="/mail/mail-users"
          render={() => (
            <Dashboard
              defaultOpenSub="sub1"
              defaultKey="2"
              content={<MailUsers />}
            />
          )}
        />
        <Route
          path="/users/add-user"
          render={() => (
            <Dashboard
              defaultOpenSub="sub2"
              defaultKey="3"
              content={<AddUser />}
            />
          )}
        />
        <Route
          path="/categories/add-category"
          render={() => (
            <Dashboard
              defaultOpenSub="sub3"
              defaultKey="5"
              content={<AddCategory />}
            />
          )}
        />
        <Route
          path="/account/update-info"
          render={() => (
            <Dashboard
              defaultOpenSub="sub4"
              defaultKey="7"
              content={<UpdateInfo />}
            />
          )}
        />
        <Route
          path="/account/update-password"
          render={() => (
            <Dashboard
              defaultOpenSub="sub4"
              defaultKey="8"
              content={<UpdatePassword />}
            />
          )}
        />
        <Route path="/verify/:token" component={VerifyAccount} />
        <Route path="/reset-password/:token" component={ResetPassword} />
        <Route
          path="/users"
          render={() => (
            <Dashboard
              defaultOpenSub="sub2"
              defaultKey="4"
              content={<ManageUsers />}
            />
          )}
        />
        <Route
          path="/categories"
          render={() => (
            <Dashboard
              defaultOpenSub="sub3"
              defaultKey="6"
              content={<ManageCategories />}
            />
          )}
        />
        <Route path="/login" component={Login} />
        <Route path="/signup" component={Signup} />
        <Route path="/forgot-password" component={ForgotPassword} />
        <Route
          path="/"
          render={() => (
            <Dashboard defaultKey="1" content={<h3>Dashboard</h3>} />
          )}
        />
      </Switch>
    </main>
  );
};

export default App;
