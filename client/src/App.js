import React from "react";
import { Switch, Route } from "react-router-dom";

import Login from "./Containers/Authentication/Login/Login";
import Signup from "./Containers/Authentication/Signup/Signup";
import ForgotPassword from "./Containers/Authentication/ForgotPassword/ForgotPassword";
import ResetPassword from "./Containers/Authentication/ResetPassword/ResetPassword";
import VerifyAccount from "./Containers/Authentication/VerifyAccount/VerifyAccount";
import Dashboard from "./Containers/Dashboard/Dashboard";
import MailUsers from "./Containers/Users/MailUsers/MailUsers";
import AddUser from "./Containers/Users/AddUser/AddUser";
import ManageUsers from "./Containers/Users/ManageUsers/ManageUsers";
import EditUser from "./Containers/Users/EditUser/EditUser";
import AddCategory from "./Containers/Categories/AddCategory/AddCategory";
import ManageCategories from "./Containers/Categories/ManageCategories/ManageCategories";
import EditCategory from "./Containers/Categories/EditCategory/EditCategory";
import UpdateInfo from "./Containers/Settings/UpdateInfo/UpdateInfo";
import UpdatePassword from "./Containers/Settings/UpdatePassword/UpdatePassword";

const App = () => (
  <main>
    <Switch>
      {/* Route for Editing Users */}
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

      {/* Route for Editing Categories */}
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

      {/* Route for Mailing Users */}
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

      {/* Route for Adding User */}
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

      {/* Route for Adding Category */}
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

      {/* Route for Updating Client Info */}
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

      {/* Route for Updating Client Password */}
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

      {/* Route for Verifying New Client */}
      <Route path="/verify/:token" component={VerifyAccount} />

      {/* Route for Resetting Client Password */}
      <Route path="/reset-password/:token" component={ResetPassword} />

      {/* Route for Managing Users */}
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

      {/* Route for Managing Categories */}
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

      {/* Route for Login */}
      <Route path="/login" component={Login} />

      {/* Route for Signup */}
      <Route path="/signup" component={Signup} />

      {/* Route for Forgot Password */}
      <Route path="/forgot-password" component={ForgotPassword} />

      {/* Route for main content */}
      <Route
        path="/"
        render={() => <Dashboard defaultKey="1" content={<h3>Dashboard</h3>} />}
      />
    </Switch>
  </main>
);

export default App;
