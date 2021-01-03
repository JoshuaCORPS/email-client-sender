import React, { useContext } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Menu, Popconfirm, message } from "antd";
import { UserContext } from "../../../hooks/useCreateContext";

const DropdownActionMenu = ({ record }) => {
  const { client, setClient } = useContext(UserContext);

  const handleDelete = async (e) => {
    try {
      await axios.delete(`/api/v1/clients/users/${record.id}`, {
        withCredentials: true,
      });

      const filteredUsers = client.users.filter(
        (user) => user._id !== record.id
      );

      const clientCopy = { ...client };
      clientCopy.users = filteredUsers;

      setClient(clientCopy);

      message.success(`User ${record.name} deleted.`);
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <Menu>
      <Menu.Item key="1">
        <Link to={`users/${record.id}/edit`}>Edit</Link>
      </Menu.Item>

      <Menu.Item key="2">
        <Popconfirm
          title="Are you sure you want to delete this user?"
          okText="Yes"
          cancelText="No"
          onConfirm={handleDelete}
        >
          Delete
        </Popconfirm>
      </Menu.Item>
    </Menu>
  );
};

export default DropdownActionMenu;
