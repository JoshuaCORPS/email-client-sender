import React, { useContext } from "react";
import { Layout, Image, Divider } from "antd";

import { UserContext } from "../../../hooks/useCreateContext";
import ClientInfo from "./ClientInfo/ClientInfo";
import SiderMenu from "./SiderMenu/SiderMenu";
import classes from "./Sidebar.module.css";

const { Sider } = Layout;

const Sidebar = ({ defaultOpenSub, defaultKey }) => {
  const { client } = useContext(UserContext);

  return (
    <Sider className={classes.SidebarHeight} breakpoint="lg" collapsedWidth="0">
      {/* Company Logo */}
      <Image
        src="https://www.nasa.gov/sites/default/files/thumbnails/image/nasa-logo-web-rgb.png"
        alt="Company logo"
        width="100%"
      />

      {/* Divider */}
      <Divider className={classes.DividerColor} />

      {/* Client Info */}
      <ClientInfo
        classes={classes}
        photo={client.photo}
        name={client.name}
        role={client.role}
      />

      {/* Menu */}
      <SiderMenu
        classes={classes}
        sub={`${defaultOpenSub}`}
        skey={`${defaultKey}`}
      />
    </Sider>
  );
};

export default Sidebar;
