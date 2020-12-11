import React, { useState } from "react";
import axios from "axios";
import { Form, Input, Button, Row, Typography } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";

const { Title } = Typography;

const App = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const inputEmailOnChange = (e) => {
    setEmail(e.target.value);
  };

  const inputPasswordOnChange = (e) => {
    setPassword(e.target.value);
  };

  const submitFormData = async () => {
    try {
      const client = await axios.post(
        "http://127.0.0.1:5000/api/v1/auth/login",
        {
          email,
          password,
        }
      );
      console.log(client);
    } catch (error) {
      // alert(error.response.data.message);
      console.log(error);
    }
  };

  return (
    <Row
      align="middle"
      justify="center"
      style={{
        minHeight: "75vh",
      }}
    >
      <Form
        style={{
          border: "1px solid #40a9ff",
          padding: "100px",
          width: "35rem",
          top: "50%",
        }}
        name="normal_login"
        className="login-form"
        onFinish={submitFormData}
      >
        <Title level={3}>Log in</Title>

        <Form.Item
          name="email"
          rules={[
            { required: true, message: "Please input your Email!" },
            { type: "email" },
          ]}
        >
          <Input
            onChange={inputEmailOnChange}
            size="large"
            prefix={<UserOutlined className="site-form-item-icon" />}
            placeholder="Email"
          />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[{ required: true, message: "Please input your Password!" }]}
        >
          <Input.Password
            onChange={inputPasswordOnChange}
            prefix={<LockOutlined className="site-form-item-icon" />}
            size="large"
            type="password"
            placeholder="Password"
          />
        </Form.Item>
        <Button type="primary" htmlType="submit" block>
          Log in
        </Button>
        <Row justify="center">
          <Form.Item>
            <a href="">Register</a>
          </Form.Item>
        </Row>
        <Row justify="center">
          <Form.Item>
            <a className="login-form-forgot" href="">
              Forgot password?
            </a>
          </Form.Item>
        </Row>
      </Form>
    </Row>
  );
};

export default App;
