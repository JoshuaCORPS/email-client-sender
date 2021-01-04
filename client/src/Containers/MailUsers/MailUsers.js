import React, { useState } from "react";
import ReactDOM from "react-dom";
import { Form, Row, Button, Typography } from "antd";

import { useForm } from "../../hooks/useForm";
import { submitData } from "../../util/submit-data";
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

      const endpoint = "/api/v1/clients/send-email";
      const alertDesc = "Mail successfully sent!";
      const options = { withCredentials: true };
      const setTimeoutFN = () => {
        if (document.getElementById("alert"))
          ReactDOM.render("", document.getElementById("alert"));
        form.resetFields();
      };

      await submitData(
        "POST",
        endpoint,
        values,
        options,
        alertDesc,
        setTimeoutFN,
        3000
      );

      setLoading(false);
    } catch (error) {
      console.error(error.message);
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
