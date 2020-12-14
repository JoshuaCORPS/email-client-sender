import React, { useState } from "react";
import ReactDOM from "react-dom";
import axios from "axios";
import { useForm } from "../../hooks/useForm";
import { Form, Input, Button, Row, Typography, Alert } from "antd";
import { UserOutlined, LockOutlined, MailOutlined } from "@ant-design/icons";
import classes from "./Signup.module.css";

const { Title } = Typography;

const Signup = () => {
  const [values, handleChange] = useForm({
    name: "",
    email: "",
    password: "",
    passwordConfirm: "",
  });
  const [loading, setLoading] = useState(false);

  const submitFormData = async () => {
    try {
      setLoading(true);

      const registerClient = await axios.post("/api/v1/auth/register", values);

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
        <Title level={3}>Sign up</Title>

        {/* For Name */}
        <Form.Item
          name="itemName"
          rules={[{ required: true, message: "Please input your Name!" }]}
        >
          <Input
            name="name"
            value={values.name}
            onChange={handleChange}
            size="large"
            prefix={<UserOutlined />}
            placeholder="Full Name"
          />
        </Form.Item>

        {/* For Email */}
        <Form.Item
          name="itemEmail"
          rules={[
            { required: true, message: "Please input your Email!" },
            { type: "email", message: "Please input a valid Email!" },
          ]}
        >
          <Input
            name="email"
            value={values.email}
            onChange={handleChange}
            size="large"
            prefix={<MailOutlined />}
            placeholder="Email"
          />
        </Form.Item>

        {/* For password */}
        <Form.Item
          name="itemPassword"
          rules={[
            { required: true, message: "Please input your Password!" },
            { min: 8, message: "Password must have at least 8 characters!" },
          ]}
        >
          <Input.Password
            name="password"
            value={values.password}
            onChange={handleChange}
            prefix={<LockOutlined />}
            size="large"
            type="password"
            placeholder="Password"
          />
        </Form.Item>

        {/* For Password Confirm */}
        <Form.Item
          name="itemPasswordConfirm"
          dependencies={["itemPassword"]}
          hasFeedback
          rules={[
            { required: true, message: "Please confirm your Password!" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("itemPassword") === value)
                  return Promise.resolve();

                return Promise.reject("Password don't match!");
              },
            }),
          ]}
        >
          <Input.Password
            name="passwordConfirm"
            value={values.passwordConfirm}
            onChange={handleChange}
            prefix={<LockOutlined />}
            size="large"
            type="password"
            placeholder="Confirm Your password!"
          />
        </Form.Item>

        {/* For Alert */}
        <div id="alert" style={{ marginBottom: "30px" }}></div>

        {/* Sign up button */}
        <Button type="primary" htmlType="submit" block loading={loading}>
          Sign up
        </Button>
      </Form>
    </Row>
  );
};

export default Signup;
