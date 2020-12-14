import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import axios from "axios";
import { useForm } from "../../hooks/useForm";
import { withRouter } from "react-router-dom";
import { Form, Button, Row, Typography, Alert } from "antd";

import InputPassword from "../../Components/Form/InputPassword/InputPassword";
import InputPasswordConfirm from "../../Components/Form/InputPasswordConfirm/InputPasswordConfirm";
import Spinner from "../../Components/Spinner/Spinner";

import classes from "./ResetPassword.module.css";

const { Title } = Typography;

const ResetPassword = (props) => {
  const [values, handleChange] = useForm({ password: "", passwordConfirm: "" });
  const [isTokenVerified, setIsTokenVerified] = useState(false);
  const [loading, setLoading] = useState(false);

  const submitFormData = async () => {
    try {
      setLoading(true);

      const searchClient = await axios.post(
        `/api/v1/auth/reset-password/${props.match.params.token}`,
        values
      );

      if (searchClient.data.status === "success")
        ReactDOM.render(
          <Alert message="Success" type="success" showIcon />,
          document.getElementById("alert")
        );

      setLoading(false);

      window.setTimeout(() => {
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
  }, [props.match.params.token]);

  let content = <Spinner />;

  if (isTokenVerified)
    content = (
      <Row align="middle" justify="center" className={classes.RowVH}>
        <Form className={classes.FormSize} onFinish={submitFormData}>
          <Title level={3}>Reset Password</Title>

          {/* For password */}
          <InputPassword value={values.password} handleChange={handleChange} />

          {/* For Password Confirm */}
          <InputPasswordConfirm
            value={values.passwordConfirm}
            handleChange={handleChange}
          />

          {/* For Alert */}
          <div id="alert" style={{ marginBottom: "30px" }}></div>

          {/* Sign up button */}
          <Button type="primary" htmlType="submit" block loading={loading}>
            Update Password
          </Button>
        </Form>
      </Row>
    );

  return <>{content}</>;
};

export default withRouter(ResetPassword);
