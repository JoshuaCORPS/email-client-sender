import React from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Menu } from "antd";
import {
  DashboardOutlined,
  MailOutlined,
  UsergroupAddOutlined,
  LogoutOutlined,
  SettingOutlined,
  TableOutlined,
} from "@ant-design/icons";

const { SubMenu } = Menu;

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

const SiderMenu = ({ sub, skey, classes }) => (
  <Menu
    mode="inline"
    theme="dark"
    defaultOpenKeys={[`${sub}`]}
    defaultSelectedKeys={[`${skey}`]}
  >
    {/* Dashboard Menu */}
    <Menu.Item key="1" icon={<DashboardOutlined />}>
      <Link to="/">Dashboard</Link>
    </Menu.Item>

    {/* Mail Menu */}
    <SubMenu key="sub1" icon={<MailOutlined />} title="Mail">
      <Menu.Item key="2">
        <Link to="/mail/mail-users">Mail Users</Link>
      </Menu.Item>
    </SubMenu>

    {/* Users Menu */}
    <SubMenu key="sub2" icon={<UsergroupAddOutlined />} title="Users">
      <Menu.Item key="3">
        <Link to="/users/add-user">Add User</Link>
      </Menu.Item>

      <Menu.Item key="4">
        <Link to="/users">Manage Users</Link>
      </Menu.Item>
    </SubMenu>

    {/* Categories Menu */}
    <SubMenu key="sub3" icon={<TableOutlined />} title="Categories">
      <Menu.Item key="5">
        <Link to="/categories/add-category">Add Category</Link>
      </Menu.Item>

      <Menu.Item key="6">
        <Link to="/categories">Manage Categories</Link>
      </Menu.Item>
    </SubMenu>

    {/* Settings Menu */}
    <SubMenu key="sub4" icon={<SettingOutlined />} title="Account Settings">
      <Menu.Item key="7">
        <Link to="/account/update-info">Update Information</Link>
      </Menu.Item>

      <Menu.Item key="8">
        <Link to="/account/update-password">Update Password</Link>
      </Menu.Item>
    </SubMenu>

    <Menu.Item
      className={classes.LogoutBtn}
      icon={<LogoutOutlined />}
      onClick={logout}
    >
      Log out
    </Menu.Item>
  </Menu>
);

export default SiderMenu;
