import React, { useState } from "react";
import ReactDOM from "react-dom";
import axios from "axios";
import { useForm } from "../../hooks/useForm";
import { Form, Button, Row, Typography, Alert } from "antd";

import InputEmail from "../../Components/Form/InputEmail/InputEmail";
import classes from "./ForgotPassword.module.css";

const { Title } = Typography;

const ForgotPassword = () => {
  const [values, handleChange] = useForm({ email: "" });
  const [loading, setLoading] = useState(false);

  const submitFormData = async () => {
    try {
      setLoading(true);

      const searchClient = await axios.post(
        "/api/v1/auth/forgot-password",
        values
      );

      if (searchClient.data.status === "success")
        ReactDOM.render(
          <Alert
            message="Success"
            description="Please check your email to reset your password!"
            type="success"
            showIcon
          />,
          document.getElementById("alert")
        );

      setLoading(false);

      setTimeout(() => {
        window.location.assign("/login");
      }, 2000);
    } catch (error) {
      ReactDOM.render(
        <Alert message={error.response.data.message} type="error" showIcon />,
        document.getElementById("alert")
      );

      setLoading(false);
    }
  };
  return (
    <Row align="middle" justify="center" className={classes.RowVH}>
      <Form className={classes.FormSize} onFinish={submitFormData}>
        <Title level={3}>Forgot Password</Title>

        {/* For Email */}
        <InputEmail value={values.email} handleChange={handleChange} />

        {/* For Alert */}
        <div id="alert" style={{ marginBottom: "30px" }}></div>

        {/* For Button Login */}
        <Button type="primary" htmlType="submit" block loading={loading}>
          Search
        </Button>
      </Form>
    </Row>
  );
};

export default ForgotPassword;
