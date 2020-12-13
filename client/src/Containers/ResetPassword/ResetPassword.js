import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import axios from "axios";
import { withRouter } from "react-router-dom";
import { LockOutlined } from "@ant-design/icons";
import { Form, Input, Button, Row, Typography, Alert } from "antd";

import Spinner from "../../Components/Spinner/Spinner";

import classes from "./ResetPassword.module.css";

const { Title } = Typography;

const ResetPassword = (props) => {
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [isTokenVerified, setIsTokenVerified] = useState(false);
  const [loading, setLoading] = useState(false);

  const inputChange = (e, name) => {
    if (name === "password") setPassword(e.target.value);

    if (name === "passwordConfirm") setPasswordConfirm(e.target.value);
  };

  const submitFormData = async () => {
    try {
      setLoading(true);
      const searchClient = await axios.post(
        `/api/v1/auth/reset-password/${props.match.params.token}`,
        {
          password,
          passwordConfirm,
        }
      );
      if (searchClient.data.status === "success")
        ReactDOM.render(
          <Alert message="Success" type="success" showIcon />,
          document.getElementById("alert")
        );
      window.setTimeout(() => {
        setLoading(false);
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

  useEffect(() => {
    try {
      const verifyResetToken = async () => {
        try {
          const result = await axios.get(
            `/api/v1/auth/reset-password/${props.match.params.token}`
          );

          if (result.data.status === "success") setIsTokenVerified(true);
        } catch (error) {
          window.location.assign("/");
        }
      };

      verifyResetToken();
    } catch (error) {
      console.log(error);
    }
  }, []);

  let body = <Spinner />;
  if (isTokenVerified)
    body = (
      <Row align="middle" justify="center" className={classes.RowVH}>
        <Form className={classes.FormSize} onFinish={submitFormData}>
          <Title level={3}>Reset Password</Title>

          {/* For password */}
          <Form.Item
            name="password"
            rules={[
              { required: true, message: "Please input your Password!" },
              { min: 8, message: "Password must have at least 8 characters" },
            ]}
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
          <Button type="primary" htmlType="submit" block loading={loading}>
            Update Password
          </Button>
        </Form>
      </Row>
    );

  return <>{body}</>;
};

export default withRouter(ResetPassword);
