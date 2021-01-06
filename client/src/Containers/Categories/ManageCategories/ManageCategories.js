import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  Table,
  Space,
  Button,
  Divider,
  Input,
  Popconfirm,
  message,
} from "antd";
import {
  TableOutlined,
  CheckCircleTwoTone,
  CloseCircleTwoTone,
} from "@ant-design/icons";

import { UserContext } from "../../../hooks/useCreateContext";
import numberFormatter from "../../../util/numberFormatter";
import classes from "./ManageCategories.module.css";

const ManageCategories = () => {
  const { client, setClient } = useContext(UserContext);
  const [clientCategories, setClientCategories] = useState({});

  const tableData =
    clientCategories.billCategories &&
    clientCategories.billCategories.map((category) => ({
      key: category.slug,
      category: category.value,
      users: client.users.filter(
        (user) =>
          user.billCategory &&
          user.billCategory.toLowerCase() === category.value.toLowerCase()
      ),
    }));

  const handleDelete = async (record) => {
    try {
      const slug = record.key;

      await axios.delete(`/api/v1/clients/categories/${slug}`, {
        withCredentials: true,
      });

      const filteredCategory = client.billCategories.filter(
        (category) => category.slug !== slug
      );

      const clientCopy = { ...client };
      clientCopy.billCategories = filteredCategory;

      setClient(clientCopy);

      message.success(`Category ${record.category} deleted`);
    } catch (error) {
      console.log(error.message);
    }
  };

  const inputChangeHandler = (e) => {
    const word = e.target.value;
    const reg = new RegExp(`\\b${word}`, "i");
    const clientCopy = { ...client };

    if (word !== "") {
      const newList = client.billCategories.filter((category) =>
        reg.test(category.value)
      );
      clientCopy.billCategories = newList;
      setClientCategories(clientCopy);
    } else {
      setClientCategories(client);
    }
  };

  const columns = [
    {
      title: "Category",
      dataIndex: "category",
      sorter: (a, b) => a.category.localeCompare(b.category),
    },
    {
      title: "Actions",
      dataIndex: "actions",
      render: (_, record, _2) => (
        <Space size="small">
          <Button type="link">
            <Link to={`categories/${record.key}/edit`}>Edit</Link>
          </Button>
          <Divider type="vertical" />
          <Popconfirm
            title="Are you sure you want to delete this category?"
            okText="Yes"
            cancelText="No"
            onConfirm={(e) => handleDelete(record)}
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

  useEffect(() => {
    setClientCategories(client);
  }, [client]);

  return (
    <>
      <Input.Search
        className={classes.SearchInput}
        placeholder="Category"
        prefix={<TableOutlined />}
        onChange={inputChangeHandler}
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
