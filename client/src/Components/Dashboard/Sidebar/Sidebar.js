import React, { useContext } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  Layout,
  Image,
  Divider,
  Row,
  Col,
  Menu,
  Avatar,
  Typography,
} from "antd";
import {
  DashboardOutlined,
  MailOutlined,
  UsergroupAddOutlined,
  LogoutOutlined,
  SettingOutlined,
} from "@ant-design/icons";

import { UserContext } from "../../../hooks/useCreateContext";

const { SubMenu } = Menu;
const { Sider } = Layout;
const { Title, Text } = Typography;

const logout = async () => {
  try {
    const result = await axios.get("/api/v1/auth/logout", {
      withCredentials: true,
    });
    if (result.data.status === "success") {
      setTimeout(() => {
        window.location.assign("/login");
      }, 1000);
    }
  } catch (error) {
    console.log(error);
  }
};

const Sidebar = () => {
  const { client } = useContext(UserContext);

  return (
    <Sider
      breakpoint="lg"
      collapsedWidth="0"
      style={{
        height: "100vh",
      }}
    >
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
            src={`https://corps-sender.herokuapp.com/img/users/${
              client.photo ? client.photo : "default.jpg"
            }`}
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
      <Menu mode="inline" theme="dark" defaultSelectedKeys={["1"]}>
        <Menu.Item key="1" icon={<DashboardOutlined />}>
          <Link to="/">Dashboard</Link>
        </Menu.Item>

        <SubMenu key="sub1" icon={<MailOutlined />} title="Mail">
          <Menu.Item>
            <Link to="/mail/mail-users">Mail Users</Link>
          </Menu.Item>
          {/* <Menu.Item>Send to Single User</Menu.Item> */}
        </SubMenu>

        <SubMenu key="sub2" icon={<UsergroupAddOutlined />} title="Users">
          <Menu.Item>
            <Link to="/users/add-user">Add User</Link>
          </Menu.Item>
          <Menu.Item>Manage User</Menu.Item>
        </SubMenu>

        <SubMenu key="sub3" icon={<SettingOutlined />} title="Account Settings">
          <Menu.Item>
            <Link to="/account/update-info">Update Information</Link>
          </Menu.Item>
          <Menu.Item>
            <Link to="/account/update-password">Update Password</Link>
          </Menu.Item>
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
  );
};

export default Sidebar;
