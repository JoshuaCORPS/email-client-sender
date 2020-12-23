import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Form, Button, Row, Typography } from "antd";

import { useForm } from "../../../hooks/useForm";
import { submitData } from "../../../util/submit-data";
import InputEmail from "../../../Components/Form/InputEmail/InputEmail";
import InputPassword from "../../../Components/Form/InputPassword/InputPassword";
import classes from "./Login.module.css";

const { Title } = Typography;

const Login = () => {
  const [values, handleChange] = useForm({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const submitFormData = async () => {
    try {
      setLoading(true);

      const endpoint = "/api/v1/auth/login";
      const alertDesc = "Logging in... Please wait!";
      const options = { withCredentials: true };
      const setTimeoutFN = () => window.location.assign("/");

      await submitData(
        "POST",
        endpoint,
        values,
        options,
        alertDesc,
        setTimeoutFN,
        1000
      );

      setLoading(false);
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <Row align="middle" justify="center" className={classes.RowVH}>
      <Form className={classes.FormSize} onFinish={submitFormData}>
        <Title level={3}>Log in</Title>

        {/* For Email */}
        <InputEmail value={values.email} handleChange={handleChange} />

        {/* For Password */}
        <InputPassword value={values.password} handleChange={handleChange} />

        {/* For Alert */}
        <div id="alert" className={classes.AlertMargin}></div>

        {/* For Button Login */}
        <Button type="primary" htmlType="submit" block loading={loading}>
          Log in
        </Button>

        {/* For Signup Link */}
        <Row justify="center">
          <Form.Item>
            <Link to="/signup">Sign up</Link>
          </Form.Item>
        </Row>

        {/* For Forgot Password Link */}
        <Row justify="center">
          <Form.Item>
            <Link to="/forgot-password">Forgot password?</Link>
          </Form.Item>
        </Row>
      </Form>
    </Row>
  );
};

export default Login;
