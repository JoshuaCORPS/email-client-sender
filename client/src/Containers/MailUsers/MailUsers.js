import React, { useState } from "react";
import ReactDOM from "react-dom";
import axios from "axios";
import { Form, Row, Button, Typography, Alert } from "antd";
import { useForm } from "../../hooks/useForm";

import InputSubject from "../../Components/Form/InputSubject/InputSubject";
import InputTextArea from "../../Components/Form/InputTextArea/InputTextArea";
import classes from "./MailUsers.module.css";

const { Title } = Typography;

const MailUsers = () => {
  const [values, handleChange] = useForm({ subject: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const submitFormData = async () => {
    try {
      setLoading(true);

      const sendMail = await axios.post("/api/v1/clients/send-email", values, {
        withCredentials: true,
      });

      if (sendMail.data.status === "success")
        ReactDOM.render(
          <Alert
            message="Success"
            description="Mail successfully sent!"
            type="success"
            showIcon
          />,
          document.getElementById("alert")
        );

      setLoading(false);

      setTimeout(() => {
        ReactDOM.render("", document.getElementById("alert"));
        form.resetFields();
      }, 3000);
    } catch (error) {
      ReactDOM.render(
        <Alert message={error.response.data.message} type="error" showIcon />,
        document.getElementById("alert")
      );
      setLoading(false);
    }
  };

  return (
    <Row justify="center" align="middle" className={classes.RowVH}>
      <Form className={classes.FormSize} onFinish={submitFormData} form={form}>
        <Title level={3}>Mail Details</Title>

        {/* For Subject */}
        <InputSubject value={values.subject} handleChange={handleChange} />

        {/* For Message */}
        <InputTextArea value={values.message} handleChange={handleChange} />

        {/* For Alert */}
        <div id="alert" className={classes.AlertMargin}></div>

        {/* For Submit Button */}
        <Button type="primary" htmlType="submit" block loading={loading}>
          Send Mail
        </Button>
      </Form>
    </Row>
  );
};

export default MailUsers;
