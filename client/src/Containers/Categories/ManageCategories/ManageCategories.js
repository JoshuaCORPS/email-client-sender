import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Table, Input, message } from "antd";
import { TableOutlined } from "@ant-design/icons";

import { UserContext } from "../../../hooks/useCreateContext";
import { categoriesColumns, categoriesSubColumns } from "../../../util/columns";
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

  const cColumns = categoriesColumns(handleDelete);
  const cSubColumns = categoriesSubColumns(classes);

  const tableColumns = cColumns.map((item) => ({ ...item }));
  const tableSubColumns = cSubColumns.map((item) => ({ ...item }));
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
        scroll={{ x: "100vw" }}
        bordered
      />
    </>
  );
};

export default ManageCategories;
