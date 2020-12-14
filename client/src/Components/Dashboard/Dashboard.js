import React, { useState } from "react";
import { withRouter } from "react-router-dom";
import { Layout, Menu } from "antd";
import {
  DashboardOutlined,
  MailOutlined,
  UsergroupAddOutlined,
} from "@ant-design/icons";
import { Footer } from "antd/lib/layout/layout";
import Signup from "../../Containers/Signup/Signup";

const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;

const Dashboard = (props) => {
  console.log(props);
  const [link, setLink] = useState("/");
  let content = <h3>Dashboard</h3>;

  if (link === "/add-user") content = <Signup />;
  else if (link === "/") content = <h3>Dashboard</h3>;

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Header */}
      <Header>
        <Menu theme="dark" mode="horizontal">
          {/* <Menu.Item key="1">nav 1</Menu.Item>
          <Menu.Item key="2">nav 2</Menu.Item>
          <Menu.Item key="3">nav 3</Menu.Item> */}
        </Menu>
      </Header>

      {/* Sidebar */}
      <Layout>
        <Sider breakpoint="lg" collapsedWidth="0">
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
              <Menu.Item>Send to Users</Menu.Item>
              <Menu.Item>Send to Single User</Menu.Item>
            </SubMenu>
            <SubMenu key="sub2" icon={<UsergroupAddOutlined />} title="Users">
              <Menu.Item onClick={() => setLink("/add-user")}>
                Add User
              </Menu.Item>
              <Menu.Item>Manage User</Menu.Item>
            </SubMenu>
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
            {content}
          </Content>
          <Footer style={{ textAlign: "center" }}>
            Ant Design ©2018 Created by Ant UED
          </Footer>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default withRouter(Dashboard);
