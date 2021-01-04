import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { Table, Space, Dropdown, Button, message, Divider, Input } from "antd";
import {
  CheckCircleTwoTone,
  CloseCircleTwoTone,
  DownOutlined,
  UserOutlined,
} from "@ant-design/icons";

import { UserContext } from "../../hooks/useCreateContext";
import numberFormatter from "../../util/numberFormatter";
import DropdownActionMenu from "../../Components/Dashboard/DropdownActionMenu/DropdownActionMenu";
import classes from "./ManageUsers.module.css";

const ManageUser = () => {
  const { client, setClient } = useContext(UserContext);
  const [clientDisplay, setClientDisplay] = useState({});
  const [loading, setLoading] = useState(false);

  const tableDataFromClientState =
    clientDisplay.users &&
    clientDisplay.users.map((user) => ({
      key: user._id,
      ...user,
    }));

  const handlePaid = async (e, record) => {
    try {
      setLoading(true);

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

        message.success(`${data.data.user.name} mark as paid.`);
      }
      setLoading(false);
    } catch (error) {
      console.log(error.message);
      setLoading(false);
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

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Contact Number",
      dataIndex: "contactNumber",
    },
    {
      title: "Monthly Bill",
      dataIndex: "monthlyBill",
      sorter: (a, b) => a.monthlyBill - b.monthlyBill,
      render: (monthlyBill) => <>{`₱${numberFormatter(monthlyBill)}`}</>,
    },
    {
      title: "Billing Date",
      dataIndex: "billDate",
      sorter: (a, b) => new Date(a.billDate) - new Date(b.billDate),
      render: (billDate) => <>{new Date(`${billDate}`).toLocaleDateString()}</>,
    },
    {
      title: "Paid",
      dataIndex: "paid",
      sorter: (a, b) => a.paid - b.paid,
      render: (paid) => (
        <>
          {paid === true ? (
            <CheckCircleTwoTone
              className={classes.PaidIconSize}
              twoToneColor="#52c41a"
            />
          ) : (
            <CloseCircleTwoTone
              className={classes.PaidIconSize}
              twoToneColor="#D42322"
            />
          )}
        </>
      ),
    },
    {
      title: "Balance",
      dataIndex: "balance",
      sorter: (a, b) => a.balance - b.balance,
      render: (balance) => <>{`₱${numberFormatter(balance)}`}</>,
    },
    {
      title: "Category",
      dataIndex: "billCategory",
      filters:
        client.billCategories &&
        client.billCategories.map((category) => ({
          text: category.value,
          value: category.value,
        })),
      onFilter: (value, record) => record.billCategory.indexOf(value) === 0,
    },
    {
      title: "Actions",
      dataIndex: "actions",
      render: (_, record, _2) => (
        <Space size="small">
          <Button
            className={classes.ActionCol}
            type="link"
            onClick={(e) => handlePaid(e, record)}
            loading={loading}
            key={record.id}
          >
            Mark as Paid
          </Button>

          <Divider type="vertical" />

          <Dropdown overlay={() => <DropdownActionMenu record={record} />}>
            <Button className={classes.ActionMoreBtn} type="link">
              More <DownOutlined />
            </Button>
          </Dropdown>
        </Space>
      ),
    },
  ];

  useEffect(() => {
    setClientDisplay(client);
  }, [client]);

  const tableColumns = columns.map((item) => ({ ...item }));

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
        bordered
        scroll={{ x: "100vw" }}
      />
    </>
  );
};

export default ManageUser;
