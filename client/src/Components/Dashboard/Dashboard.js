import React, { useState, useEffect } from "react";
import axios from "axios";
import { withRouter } from "react-router-dom";
import {
  Layout,
  Menu,
  Avatar,
  Divider,
  Row,
  Col,
  Typography,
  Image,
} from "antd";
import {
  DashboardOutlined,
  MailOutlined,
  UsergroupAddOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { Footer } from "antd/lib/layout/layout";

import Spinner from "../../Components/Spinner/Spinner";
import AddUser from "../../Containers/AddUser/AddUser";
import MailUsers from "../../Containers/MailUsers/MailUsers";

const { SubMenu } = Menu;
const { Content, Sider } = Layout;
const { Title, Text } = Typography;

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

const Dashboard = (props) => {
  const [link, setLink] = useState("/");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [client, setClient] = useState({});

  let content;
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

  if (link === "/add-user") content = <AddUser />;
  else if (link === "/mail-users") content = <MailUsers />;
  else if (link === "/") content = <h3>Dashboard</h3>;

  if (isLoggedIn)
    body = (
      <Layout style={{ minHeight: "100vh" }}>
        {/* Header */}

        {/* <Header>
          <Menu theme="dark" mode="horizontal">
            <Menu.Item key="1">{client.name}</Menu.Item>
            <Menu.Item key="2">{client.email}</Menu.Item>
            <Menu.Item key="3">{client.role}</Menu.Item>
          </Menu>
        </Header> */}

        {/* Sidebar */}
        <Layout>
          <Sider breakpoint="lg" collapsedWidth="0">
            {/* Company Logo */}
            <Image
              src="https://www.nasa.gov/sites/default/files/thumbnails/image/nasa-logo-web-rgb.png"
              alt="Company logo"
              width="100%"
            />

            {/* Divider */}
            <Divider style={{ backgroundColor: "#ccc", marginTop: "5px" }} />

            {/* User Info */}
            <Row
              justify="space-between"
              align="middle"
              style={{ margin: "20px 10px" }}
            >
              <Col span={6}>
                <Avatar
                  src="https://i.ytimg.com/vi/gY_i1LcDObU/maxresdefault.jpg"
                  alt={client.name && `${client.name} picture`}
                  size={{ xs: 60, sm: 60, md: 60, lg: 60, xl: 60, xxl: 60 }}
                />
              </Col>
              <Col>
                <Title level={2} style={{ color: "white", fontSize: "1.1rem" }}>
                  {client.name}
                </Title>
                <Row justify="center">
                  <Col>
                    <Text type="secondary" style={{ color: "white" }}>
                      {client.role && client.role.toUpperCase()}
                    </Text>
                  </Col>
                </Row>
              </Col>
            </Row>

            {/* Menu */}
            <Menu
              mode="inline"
              theme="dark"
              defaultSelectedKeys={["1"]}
              style={{ height: "100%", borderRight: 0 }}
            >
              <Menu.Item
                key="1"
                onClick={() => setLink("/")}
                icon={<DashboardOutlined />}
              >
                Dashboard
              </Menu.Item>

              <SubMenu key="sub1" icon={<MailOutlined />} title="Mail">
                <Menu.Item onClick={() => setLink("/mail-users")}>
                  Mail Users
                </Menu.Item>
                {/* <Menu.Item>Send to Single User</Menu.Item> */}
              </SubMenu>

              <SubMenu key="sub2" icon={<UsergroupAddOutlined />} title="Users">
                <Menu.Item onClick={() => setLink("/add-user")}>
                  Add User
                </Menu.Item>
                <Menu.Item>Manage User</Menu.Item>
              </SubMenu>
              <Menu.Item
                icon={<LogoutOutlined />}
                onClick={logout}
                style={{ position: "absolute", bottom: "0" }}
              >
                Log out
              </Menu.Item>
            </Menu>
          </Sider>

          {/* Content */}
          <Layout style={{ padding: "0 24px 24px" }}>
            <Content
              className="site-layout-background"
              style={{
                padding: 24,
                margin: 0,
              }}
            >
              {/* <div
                style={{
                  minHeight: "100vh",
                  padding: "24px",
                  backgroundColor: "#fff",
                }}
              > */}
              {content}
              {/* </div> */}
            </Content>
            <Footer style={{ textAlign: "center" }}>
              Ant Design ©2018 Created by Ant UED
            </Footer>
          </Layout>
        </Layout>
      </Layout>
    );

  return <>{body}</>;
};

export default withRouter(Dashboard);
