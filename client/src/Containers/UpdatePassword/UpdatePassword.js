import React, { useState } from "react";
import ReactDOM from "react-dom";
import axios from "axios";
import { Form, Row, Button, Typography, Alert } from "antd";

import { useForm } from "../../hooks/useForm";
import InputNewPassword from "../../Components/Form/InputCurrentPassword/InputCurrentPassword";
import InputPassword from "../../Components/Form/InputPassword/InputPassword";
import InputPasswordConfirm from "../../Components/Form/InputPasswordConfirm/InputPasswordConfirm";
import classes from "./UpdatePassword.module.css";

const { Title } = Typography;

const UpdatePassword = () => {
  const [values, handleChange] = useForm({
    currentPassword: "",
    password: "",
    passwordConfirm: "",
  });

  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const submitFormData = async () => {
    try {
      setLoading(true);

      const updatePassword = await axios.patch(
        "/api/v1/auth/update-password",
        values,
        { withCredentials: true }
      );

      if (updatePassword.data.status === "success")
        ReactDOM.render(
          <Alert
            message="Success"
            description="Your password has been updated!"
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

      setTimeout(() => {
        ReactDOM.render("", document.getElementById("alert"));
      }, 5000);
    }
  };

  return (
    <Row align="middle" justify="center" className={classes.RowVH}>
      <Form className={classes.FormSize} onFinish={submitFormData} form={form}>
        <Title level={3}>Update Password</Title>

        {/* For Current Password */}
        <InputNewPassword
          value={values.currentPassword}
          handleChange={handleChange}
        />

        {/* For password */}
        <InputPassword
          value={values.password}
          handleChange={handleChange}
          placeholder="New Password"
        />

        {/* For Password Confirm */}
        <InputPasswordConfirm
          value={values.passwordConfirm}
          handleChange={handleChange}
          placeholder="Confirm Your New Password"
        />

        {/* For Alert */}
        <div id="alert" className={classes.AlertMargin}></div>

        {/* Sign up button */}
        <Button type="primary" htmlType="submit" block loading={loading}>
          Update Password
        </Button>
      </Form>
    </Row>
  );
};

export default UpdatePassword;
