import React, { useState } from "react";
import ReactDOM from "react-dom";
import axios from "axios";
import { Form, Input, Button, Row, Typography, Alert } from "antd";
import { UserOutlined, LockOutlined, MailOutlined } from "@ant-design/icons";
import classes from "./Signup.module.css";

const { Title } = Typography;

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  const inputChange = (e, name) => {
    if (name === "name") setName(e.target.value);

    if (name === "email") setEmail(e.target.value);

    if (name === "password") setPassword(e.target.value);

    if (name === "passwordConfirm") setPasswordConfirm(e.target.value);
  };

  const submitFormData = async () => {
    try {
      const registerClient = await axios.post("/api/v1/auth/register", {
        name,
        email,
        password,
        passwordConfirm,
      });
      if (registerClient.data.status === "success")
        ReactDOM.render(
          <Alert
            message="Success"
            description="Please check your email to verify your account!"
            type="success"
            showIcon
          />,
          document.getElementById("alert")
        );
    } catch (error) {
      ReactDOM.render(
        <Alert message={error.response.data.message} type="error" showIcon />,
        document.getElementById("alert")
      );
    }
  };
  return (
    <Row align="middle" justify="center" className={classes.RowVH}>
      <Form className={classes.FormSize} onFinish={submitFormData}>
        <Title level={3}>Sign up</Title>

        {/* For Name */}
        <Form.Item
          name="name"
          rules={[{ required: true, message: "Please input your Name!" }]}
        >
          <Input
            onChange={(e) => inputChange(e, "name")}
            size="large"
            prefix={<UserOutlined />}
            placeholder="Full Name"
          />
        </Form.Item>

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
            prefix={<MailOutlined />}
            placeholder="Email"
          />
        </Form.Item>

        {/* For password */}
        <Form.Item
          name="password"
          rules={[{ required: true, message: "Please input your Password!" }]}
        >
          <Input.Password
            onChange={(e) => inputChange(e, "password")}
            prefix={<LockOutlined />}
            size="large"
            type="password"
            placeholder="Password"
          />
        </Form.Item>

        {/* For Password Confirm */}
        <Form.Item
          name="passwordConfirm"
          dependencies={["password"]}
          hasFeedback
          rules={[
            { required: true, message: "Please confirm your Password!" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value)
                  return Promise.resolve();

                return Promise.reject("Password don't match!");
              },
            }),
          ]}
        >
          <Input.Password
            onChange={(e) => inputChange(e, "passwordConfirm")}
            prefix={<LockOutlined />}
            size="large"
            type="password"
            placeholder="Confirm Your password"
          />
        </Form.Item>

        {/* For Alert */}
        <div id="alert" style={{ marginBottom: "30px" }}></div>

        {/* Sign up button */}
        <Button type="primary" htmlType="submit" block>
          Sign up
        </Button>
      </Form>
    </Row>
  );
};

export default Signup;
