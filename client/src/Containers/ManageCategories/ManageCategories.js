import React, { useContext } from "react";
import { Table, Space, Button, Divider, Input, Popconfirm } from "antd";
import {
  TableOutlined,
  CheckCircleTwoTone,
  CloseCircleTwoTone,
} from "@ant-design/icons";

import { UserContext } from "../../hooks/useCreateContext";
import numberFormatter from "../../util/numberFormatter";
import classes from "./ManageCategories.module.css";

const ManageCategories = () => {
  const { client } = useContext(UserContext);

  const tableData =
    client.billCategories &&
    client.billCategories.map((category) => ({
      key: category.slug,
      category: category.value,
      users:
        client.users &&
        client.users.filter((user) => user.billCategory === category.value),
    }));

  const columns = [
    {
      title: "Category",
      dataIndex: "category",
    },
    {
      title: "Actions",
      dataIndex: "actions",
      render: (_, render, _2) => (
        <Space size="small">
          <Button type="link">Edit</Button>
          <Divider type="vertical" />
          <Popconfirm
            title="Are you sure you want to delete this category?"
            okText="Yes"
            cancelText="No"
          >
            <Button type="link">Delete</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const subColumns = [
    {
      title: "Name",
      dataIndex: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
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
  ];

  const tableColumns = columns.map((item) => ({ ...item }));
  const tableSubColumns = subColumns.map((item) => ({ ...item }));
  const expandable = {
    expandedRowRender: (record) => {
      const data = record.users.map((user) => ({
        key: user._id,
        ...user,
      }));
      return <Table dataSource={data} columns={tableSubColumns} bordered />;
    },
  };

  return (
    <>
      <Input.Search
        className={classes.SearchInput}
        placeholder="Category"
        prefix={<TableOutlined />}
        allowClear
      />
      <Table
        expandable={expandable}
        dataSource={tableData}
        columns={tableColumns}
        bordered
      />
    </>
  );
};

export default ManageCategories;
