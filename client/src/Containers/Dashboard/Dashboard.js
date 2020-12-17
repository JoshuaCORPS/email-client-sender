import React, { useState, useEffect } from "react";
import axios from "axios";
import { withRouter } from "react-router-dom";
import { Layout } from "antd";

import { Footer } from "antd/lib/layout/layout";

import Spinner from "../../Components/Spinner/Spinner";
import Sidebar from "../../Components/Dashboard/Sidebar/Sidebar";

const { Content, Header } = Layout;

const logout = async () => {
  try {
    const result = await axios.get("/api/v1/auth/logout");
    if (result.data.status === "success") {
      setTimeout(() => {
        window.location.assign("/login");
      }, 1000);
    }
  } catch (error) {
    console.log(error);
  }
};

const Dashboard = ({ content }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [client, setClient] = useState({});

  let body = <Spinner />;

  useEffect(() => {
    try {
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
    } catch (error) {
      console.log(error);
    }
  }, []);

  if (isLoggedIn)
    body = (
      <Layout>
        {/* Sidebar */}
        <Sidebar client={client} logoutHandler={logout} />

        <Layout>
          {/* Header */}
          <Header>
            {/* <Menu theme="dark" mode="horizontal">
            <Menu.Item key="1">{client.name}</Menu.Item>
            <Menu.Item key="2">{client.email}</Menu.Item>
            <Menu.Item key="3">{client.role}</Menu.Item>
          </Menu> */}
          </Header>

          {/* Content */}
          <Content style={{ margin: "24px 16px 0" }}>{content}</Content>
          <Footer style={{ textAlign: "center" }}>
            Ant Design ©2018 Created by Ant UED
          </Footer>

          <Layout style={{ padding: "0 24px 24px" }}></Layout>
        </Layout>
      </Layout>
    );

  return <>{body}</>;
};

export default withRouter(Dashboard);
