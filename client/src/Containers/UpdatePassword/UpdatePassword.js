import React, { useState } from "react";
import ReactDOM from "react-dom";
import { Form, Row, Button, Typography } from "antd";

import { useForm } from "../../hooks/useForm";
import { submitData } from "../../util/submit-data";
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

      const endpoint = "/api/v1/auth/update-password";
      const alertDesc = "Your password has been updated!";
      const options = { withCredentials: true };
      const setTimeoutFN = () => {
        if (document.getElementById("alert"))
          ReactDOM.render("", document.getElementById("alert"));
        form.resetFields();
      };

      await submitData(
        "PATCH",
        endpoint,
        values,
        options,
        alertDesc,
        setTimeoutFN,
        3000
      );

      setLoading(false);
    } catch (error) {
      console.error(error.message);
      setLoading(false);
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
