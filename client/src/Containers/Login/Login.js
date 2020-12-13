import React, { useState } from "react";
import ReactDOM from "react-dom";
import { Link } from "react-router-dom";
import axios from "axios";
import { Form, Input, Button, Row, Typography, Alert } from "antd";
import { LockOutlined, MailOutlined } from "@ant-design/icons";
import classes from "./Login.module.css";

const { Title } = Typography;

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const inputChange = (e, name) => {
    if (name === "email") setEmail(e.target.value);
    if (name === "password") setPassword(e.target.value);
  };

  const submitFormData = async () => {
    try {
      setLoading(true);
      const loginClient = await axios.post(
        "/api/v1/auth/login",
        {
          email,
          password,
        },
        {
          withCredentials: true,
        }
      );
      if (loginClient.data.status === "success")
        ReactDOM.render(
          <Alert message="Success" type="success" showIcon />,
          document.getElementById("alert")
        );
      setLoading(false);
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
        <Form.Item
          name="email"
          rules={[
            { required: true, message: "Please input your Email!" },
            { type: "email" },
          ]}
        >
          <Input
            onChange={(e) => inputChange(e, "email")}
            size="large"
            prefix={<MailOutlined className="site-form-item-icon" />}
            placeholder="Email"
          />
        </Form.Item>

        {/* For Password */}
        <Form.Item
          name="password"
          rules={[{ required: true, message: "Please input your Password!" }]}
        >
          <Input.Password
            onChange={(e) => inputChange(e, "password")}
            prefix={<LockOutlined className="site-form-item-icon" />}
            size="large"
            type="password"
            placeholder="Password"
          />
        </Form.Item>

        {/* For Alert */}
        <div id="alert" style={{ marginBottom: "30px" }}></div>

        {/* For Button Login */}
        <Button type="primary" htmlType="submit" block loading={loading}>
          Log in
        </Button>

        {/* For Signup Link */}
        <Row justify="center">
          <Form.Item>
            <Link to="/signup">Register</Link>
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
