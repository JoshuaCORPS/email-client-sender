import React, { useState } from "react";
import ReactDOM from "react-dom";
import axios from "axios";
import { Form, Row, Button, Typography, Alert } from "antd";
import { useForm } from "../../hooks/useForm";

import InputName from "../../Components/Form/InputName/InputName";
import InputEmail from "../../Components/Form/InputEmail/InputEmail";

import classes from "./AddUser.module.css";

const { Title } = Typography;

const AddUser = () => {
  const [values, handleChange] = useForm({ name: "", email: "" });
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const submitFormData = async () => {
    try {
      setLoading(true);

      const addUser = await axios.post("/api/v1/clients/users", values, {
        withCredentials: true,
      });

      if (addUser.data.status === "success")
        ReactDOM.render(
          <Alert
            message="Success"
            description="User successfully added!"
            type="success"
            showIcon
          />,
          document.getElementById("alert")
        );

      setLoading(false);

      setTimeout(() => {
        ReactDOM.render("", document.getElementById("alert"));
        form.resetFields();
      }, 3000);
    } catch (error) {
      ReactDOM.render(
        <Alert message={error.response.data.message} type="error" showIcon />,
        document.getElementById("alert")
      );
      setLoading(false);
    }
  };

  return (
    <Row justify="center" align="middle" className={classes.RowVH}>
      <Form className={classes.FormSize} onFinish={submitFormData} form={form}>
        <Title level={3}>User Information</Title>

        {/* For User Name */}
        <InputName value={values.name} handleChange={handleChange} />

        {/* For User Email */}
        <InputEmail value={values.name} handleChange={handleChange} />

        {/* For Alert */}
        <div id="alert" className={classes.AlertMargin}></div>

        {/* For Submit Button */}
        <Button type="primary" htmlType="submit" block loading={loading}>
          Add User
        </Button>
      </Form>
    </Row>
  );
};

export default AddUser;
