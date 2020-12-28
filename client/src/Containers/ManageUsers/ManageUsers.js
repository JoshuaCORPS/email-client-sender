import React, { useState, useContext } from "react";
import axios from "axios";
import { Table, Space, Dropdown, Button, message, Divider } from "antd";
import {
  CheckCircleTwoTone,
  CloseCircleTwoTone,
  DownOutlined,
} from "@ant-design/icons";

import { UserContext } from "../../hooks/useCreateContext";
import numberFormatter from "../../util/numberFormatter";
import DropdownActionMenu from "../../Components/Dashboard/DropdownActionMenu/DropdownActionMenu";

const ManageUser = () => {
  const { client, setClient } = useContext(UserContext);
  const [loading, setLoading] = useState(false);

  const tableData =
    client.users &&
    client.users.map((user) => ({
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
      render: (_, record, _2) => (
        <Space size="small">
          <Button
            type="link"
            onClick={(e) => handlePaid(e, record)}
            loading={loading}
            key={record.id}
          >
            Mark as Paid
          </Button>

          <Divider type="vertical" />

          <Dropdown overlay={() => <DropdownActionMenu record={record} />}>
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
