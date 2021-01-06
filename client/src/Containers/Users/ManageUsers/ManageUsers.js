import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { Table, message, Input } from "antd";
import { UserOutlined } from "@ant-design/icons";

import { UserContext } from "../../../hooks/useCreateContext";
import { usersColumns } from "../../../util/columns";
import classes from "./ManageUsers.module.css";

const ManageUser = () => {
  const { client, setClient } = useContext(UserContext);
  const [clientDisplay, setClientDisplay] = useState({});

  const tableDataFromClientState =
    clientDisplay.users &&
    clientDisplay.users.map((user) => ({
      key: user._id,
      ...user,
    }));

  const handlePaid = async (record) => {
    try {
      const userId = record.id;
      const { data } = await axios.patch(
        `/api/v1/clients/users/${userId}`,
        {
          balance: 0,
        },
        { withCredentials: true }
      );

      if (data.status === "success") {
        const clientCopy = { ...client };

        const userIndex = clientCopy.users.findIndex(
          (user) => user._id === userId
        );

        const updatedUser = {
          ...clientCopy.users[userIndex],
          balance: 0,
          paid: true,
        };

        clientCopy.users[userIndex] = updatedUser;

        setClient(clientCopy);

        message.success(`User ${data.data.user.name} mark as paid.`);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const inputChangeHandler = (e) => {
    const word = e.target.value;
    const reg = new RegExp(`\\b${word}`, "i");
    const clientCopy = { ...client };

    if (word !== "") {
      const newList = client.users.filter((user) => reg.test(user.name));
      clientCopy.users = newList;
      setClientDisplay(clientCopy);
    } else {
      setClientDisplay(client);
    }
  };

  const uColumns = usersColumns(classes, client, handlePaid);
  const tableColumns = uColumns.map((item) => ({ ...item }));

  useEffect(() => {
    setClientDisplay(client);
  }, [client]);

  return (
    <>
      <Input.Search
        className={classes.SearchInput}
        placeholder="Name"
        prefix={<UserOutlined />}
        allowClear
        onChange={inputChangeHandler}
      />
      <Table
        className={classes.TableSize}
        columns={tableColumns}
        dataSource={tableDataFromClientState}
        scroll={{ x: "100vw" }}
        bordered
      />
    </>
  );
};

export default ManageUser;
