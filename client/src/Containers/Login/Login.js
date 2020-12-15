import React, { useState } from "react";
import ReactDOM from "react-dom";
import axios from "axios";
import Cookies from "js-cookie";
import { Link } from "react-router-dom";
import { useForm } from "../../hooks/useForm";
import { Form, Button, Row, Typography, Alert } from "antd";

import InputEmail from "../../Components/Form/InputEmail/InputEmail";
import InputPassword from "../../Components/Form/InputPassword/InputPassword";
import { encrypt } from "../../util/encrypt-decrypt";

import classes from "./Login.module.css";

const { Title } = Typography;

const Login = () => {
  const [values, handleChange] = useForm({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  console.log(process.env.REACT_APP_SECRET_KEY);

  const submitFormData = async () => {
    try {
      setLoading(true);

      const loginClient = await axios.post("/api/v1/auth/login", values, {
        withCredentials: true,
      });

      if (loginClient.data.status === "success")
        ReactDOM.render(
          <Alert message="Success" type="success" showIcon />,
          document.getElementById("alert")
        );
      Cookies.set("name", encrypt(loginClient.data.data.client.name));
      Cookies.set("email", encrypt(loginClient.data.data.client.email));
      Cookies.set("role", encrypt(loginClient.data.data.client.role));
      setLoading(false);

      setTimeout(() => {
        window.location.assign("/");
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
