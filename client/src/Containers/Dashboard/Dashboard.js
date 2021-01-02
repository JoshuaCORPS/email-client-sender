import React, { useState, useEffect } from "react";
import axios from "axios";
import { withRouter } from "react-router-dom";
import { Layout } from "antd";
import { Footer } from "antd/lib/layout/layout";

import { UserContext } from "../../hooks/useCreateContext";
import Spinner from "../../Components/Spinner/Spinner";
import Sidebar from "../../Components/Dashboard/Sidebar/Sidebar";
import classes from "./Dashboard.module.css";

const { Content, Header } = Layout;

const Dashboard = ({ content, defaultOpenSub, defaultKey }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [client, setClient] = useState({});

  let body = <Spinner />;

  useEffect(() => {
    const verifyLoggedIn = async () => {
      try {
        const result = await axios.get("/api/v1/view/", {
          withCredentials: true,
        });
        if (result.data.status === "success") {
          setIsLoggedIn(true);
          setClient(result.data.data.client);
        }
      } catch (error) {
        window.location.assign("/login");
      }
    };

    verifyLoggedIn();
  }, []);

  if (isLoggedIn)
    body = (
      <UserContext.Provider value={{ client, setClient }}>
        <Layout>
          {/* Sidebar */}
          <Sidebar defaultOpenSub={defaultOpenSub} defaultKey={defaultKey} />

          <Layout className={classes.LayoutPosition}>
            {/* Header */}
            <Header></Header>

            {/* Content */}
            <Content className={classes.ContentMargin}>{content}</Content>
            <Footer className={classes.FooterPostion}>
              © CORPS. All Rights Reserved
            </Footer>
          </Layout>
        </Layout>
      </UserContext.Provider>
    );

  return <>{body}</>;
};

export default withRouter(Dashboard);
