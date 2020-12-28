import React from "react";
import { Link } from "react-router-dom";
import { Menu } from "antd";

const DropdownActionMenu = ({ record }) => {
  return (
    <Menu>
      <Menu.Item key="1">
        <Link to={`users/${record.id}/edit`}>Edit</Link>
      </Menu.Item>
      <Menu.Item key="2">Delete</Menu.Item>
    </Menu>
  );
};

export default DropdownActionMenu;
