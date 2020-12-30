import React, { useState, useEffect } from "react";
import axios from "axios";
import { withRouter } from "react-router-dom";
import { Layout } from "antd";
import { Footer } from "antd/lib/layout/layout";

import { UserContext } from "../../hooks/useCreateContext";
import Spinner from "../../Components/Spinner/Spinner";
import Sidebar from "../../Components/Dashboard/Sidebar/Sidebar";

const { Content, Header } = Layout;

const Dashboard = ({ content }) => {
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
          <Sidebar />

          <Layout style={{ position: "relative" }}>
            {/* Header */}
            <Header></Header>

            {/* Content */}
            <Content style={{ margin: "24px 16px 0" }}>{content}</Content>
            <Footer
              style={{
                position: "absolute",
                bottom: "0",
                left: "0",
                right: "0",
                textAlign: "center",
              }}
            >
              © CORPS. All Rights Reserved
            </Footer>

            <Layout style={{ padding: "0 24px 24px" }}></Layout>
          </Layout>
        </Layout>
      </UserContext.Provider>
    );

  return <>{body}</>;
};

export default withRouter(Dashboard);
