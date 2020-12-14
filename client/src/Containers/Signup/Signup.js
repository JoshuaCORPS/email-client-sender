import React, { useState } from "react";
import ReactDOM from "react-dom";
import axios from "axios";
import { useForm } from "../../hooks/useForm";
import { Form, Button, Row, Typography, Alert } from "antd";

import InputName from "../../Components/Form/InputName/InputName";
import InputEmail from "../../Components/Form/InputEmail/InputEmail";
import InputPassword from "../../Components/Form/InputPassword/InputPassword";
import InputPasswordConfirm from "../../Components/Form/InputPasswordConfirm/InputPasswordConfirm";
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
        <InputName value={values.name} handleChange={handleChange} />

        {/* For Email */}
        <InputEmail value={values.email} handleChange={handleChange} />

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
          Sign up
        </Button>
      </Form>
    </Row>
  );
};

export default Signup;
