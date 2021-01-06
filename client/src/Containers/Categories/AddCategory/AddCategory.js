import React, { useState, useContext } from "react";
import ReactDOM from "react-dom";
import { Form, Row, Button, Typography } from "antd";

import { useForm } from "../../../hooks/useForm";
import { UserContext } from "../../../hooks/useCreateContext";
import { submitData } from "../../../util/submit-data";
import InputCategory from "../../../Components/Form/InputCategory/InputCategory";
import classes from "./AddCategory.module.css";

const { Title } = Typography;

const AddCategory = () => {
  const [values, handleChange] = useForm({
    billCategory: "",
  });
  const [loading, setLoading] = useState(false);
  const { client, setClient } = useContext(UserContext);
  const [form] = Form.useForm();

  const submitFormData = async () => {
    try {
      setLoading(true);

      const endpoint = "/api/v1/clients/categories";
      const alertDesc = "Category successfully added!";
      const options = { withCredentials: true };
      const setTimeoutFN = () => {
        if (document.getElementById("alert"))
          ReactDOM.render("", document.getElementById("alert"));
        form.resetFields();
      };

      const result = await submitData(
        "PATCH",
        endpoint,
        values,
        options,
        alertDesc,
        setTimeoutFN,
        3000
      );

      if (result && result.status === "success") {
        const clientCopy = { ...client };
        clientCopy.billCategories = result.data.client.billCategories;

        setClient(clientCopy);
      }

      setLoading(false);
    } catch (error) {
      console.log(error.message);
      setLoading(false);
    }
  };

  return (
    <Row justify="center" align="middle" className={classes.RowVH}>
      <Form className={classes.FormSize} onFinish={submitFormData} form={form}>
        <Title level={3}>Category Information</Title>

        {/* For Category */}
        <InputCategory value={values.category} handleChange={handleChange} />

        {/* For Alert */}
        <div id="alert" className={classes.AlertMargin}></div>

        {/* For Submit Button */}
        <Button type="primary" htmlType="submit" block loading={loading}>
          Add Category
        </Button>
      </Form>
    </Row>
  );
};

export default AddCategory;
