import React, { useState, useEffect } from "react";
import axios from "axios";
import { withRouter } from "react-router-dom";
import { Form, Button, Row, Typography } from "antd";

import { useForm } from "../../../hooks/useForm";
import { submitData } from "../../../util/submit-data";
import InputPassword from "../../../Components/Form/InputPassword/InputPassword";
import InputPasswordConfirm from "../../../Components/Form/InputPasswordConfirm/InputPasswordConfirm";
import Spinner from "../../../Components/Spinner/Spinner";
import classes from "./ResetPassword.module.css";

const { Title } = Typography;

const ResetPassword = (props) => {
  const [values, handleChange] = useForm({ password: "", passwordConfirm: "" });
  const [isTokenVerified, setIsTokenVerified] = useState(false);
  const [loading, setLoading] = useState(false);

  const submitFormData = async () => {
    try {
      setLoading(true);

      const endpoint = `/api/v1/auth/reset-password/${props.match.params.token}`;
      const alertDesc =
        "Your password has been reset! Please log in to continue.";
      const setTimeoutFN = () => window.location.assign("/login");

      await submitData(
        "POST",
        endpoint,
        values,
        {},
        alertDesc,
        setTimeoutFN,
        3000
      );

      setLoading(false);
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
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
          <div id="alert" className={classes.AlertMargin}></div>

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
