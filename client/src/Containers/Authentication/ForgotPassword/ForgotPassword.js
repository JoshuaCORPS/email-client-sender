import React, { useState } from "react";
import { Form, Button, Row, Typography } from "antd";

import { useForm } from "../../../hooks/useForm";
import { submitData } from "../../../util/submit-data";
import InputEmail from "../../../Components/Form/InputEmail/InputEmail";
import classes from "./ForgotPassword.module.css";

const { Title } = Typography;

const ForgotPassword = () => {
  const [values, handleChange] = useForm({ email: "" });
  const [loading, setLoading] = useState(false);

  const submitFormData = async () => {
    try {
      setLoading(true);

      const endpoint = "/api/v1/auth/forgot-password";
      const alertDesc = "Please check your email to reset your password!";
      const setTimeoutFN = () => window.location.assign("/login");

      await submitData(
        "POST",
        endpoint,
        values,
        {},
        alertDesc,
        setTimeoutFN,
        3000
      );

      setLoading(false);
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <Row align="middle" justify="center" className={classes.RowVH}>
      <Form className={classes.FormSize} onFinish={submitFormData}>
        <Title level={3}>Forgot Password</Title>

        {/* For Email */}
        <InputEmail value={values.email} handleChange={handleChange} />

        {/* For Alert */}
        <div id="alert" className={classes.AlertMargin}></div>

        {/* For Button Login */}
        <Button type="primary" htmlType="submit" block loading={loading}>
          Search
        </Button>
      </Form>
    </Row>
  );
};

export default ForgotPassword;
