import React, { useState, useContext } from "react";
import axios from "axios";
import { Table, Space, Dropdown, Menu, Button, message } from "antd";
import {
  CheckCircleTwoTone,
  CloseCircleTwoTone,
  DownOutlined,
} from "@ant-design/icons";

import { UserContext } from "../../hooks/useCreateContext";
import numberFormatter from "../../util/numberFormatter";

const menu = (
  <Menu>
    <Menu.Item key="1">Edit</Menu.Item>
    <Menu.Item key="2">Delete</Menu.Item>
  </Menu>
);

const ManageUser = () => {
  const { client, setClient } = useContext(UserContext);
  const [loading, setLoading] = useState(false);

  const tableData =
    client.users &&
    client.users.map((user) => ({
      key: user._id,
      ...user,
    }));

  const handlePaid = async (e) => {
    try {
      setLoading(true);
      const userId = e.target.parentNode.parentNode.parentNode.parentNode.getAttribute(
        "data-row-key"
      );
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

        message.success(`${data.data.user.name} mark as paid!`);
      }
      setLoading(false);
    } catch (error) {
      console.log(error.message);
      setLoading(false);
    }
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
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
              style={{ fontSize: "1.3rem" }}
              twoToneColor="#52c41a"
            />
          ) : (
            <CloseCircleTwoTone
              style={{ fontSize: "1.3rem" }}
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
      title: "Actions",
      dataIndex: "actions",
      render: () => (
        <Space size="middle">
          <Button type="link" onClick={handlePaid} loading={loading}>
            <span style={{ pointerEvents: "none" }}>Mark as Paid</span>
          </Button>
          |
          <Dropdown overlay={menu}>
            <Button type="link">
              More <DownOutlined />
            </Button>
          </Dropdown>
        </Space>
      ),
    },
  ];

  const tableColumns = columns.map((item) => ({ ...item }));

  return (
    <>
      <Table columns={tableColumns} dataSource={tableData} bordered></Table>
    </>
  );
};

export default ManageUser;
