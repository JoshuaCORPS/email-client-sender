import React, { useState } from "react";
import ReactDOM from "react-dom";
import axios from "axios";
import { Form, Input, Button, Row, Typography, Alert } from "antd";
import { MailOutlined } from "@ant-design/icons";
import classes from "./ForgotPassword.module.css";

const { Title } = Typography;

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const inputChange = (e, name) => {
    if (name === "email") setEmail(e.target.value);
  };

  const submitFormData = async () => {
    try {
      const searchClient = await axios.post("/api/v1/auth/forgot-password", {
        email,
      });
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
        <Title level={3}>Forgot Password</Title>

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

        {/* For Alert */}
        <div id="alert" style={{ marginBottom: "30px" }}></div>

        {/* For Button Login */}
        <Button type="primary" htmlType="submit" block>
          Search
        </Button>
      </Form>
    </Row>
  );
};

export default ForgotPassword;
