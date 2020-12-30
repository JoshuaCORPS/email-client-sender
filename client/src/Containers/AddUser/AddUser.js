import React, { useState, useContext } from "react";
import ReactDOM from "react-dom";
import { Form, Row, Button, Typography, Col, Divider } from "antd";

import { useForm } from "../../hooks/useForm";
import { UserContext } from "../../hooks/useCreateContext";
import { submitData } from "../../util/submit-data";
import InputName from "../../Components/Form/InputName/InputName";
import InputEmail from "../../Components/Form/InputEmail/InputEmail";
import InputContactNumber from "../../Components/Form/InputContactNumber/InputContactNumber";
import InputAddress from "../../Components/Form/InputAddress/InputAddress";
import InputBill from "../../Components/Form/InputBill/InputBill";
import InputBalance from "../../Components/Form/InputBalance/InputBalance";
import InputDate from "../../Components/Form/InputDate/InputDate";
import classes from "./AddUser.module.css";

const { Title } = Typography;

const AddUser = () => {
  const [values, handleChange] = useForm({
    name: "",
    email: "",
    contactNumber: "",
    address: "",
    monthlyBill: "",
    balance: "0",
    billDate: "",
  });
  const [loading, setLoading] = useState(false);
  const { client, setClient } = useContext(UserContext);
  const [form] = Form.useForm();

  const submitFormData = async () => {
    try {
      setLoading(true);

      const endpoint = "/api/v1/clients/users";
      const alertDesc = "User successfully added!";
      const options = { withCredentials: true };
      const setTimeoutFN = () => {
        if (document.getElementById("alert"))
          ReactDOM.render("", document.getElementById("alert"));
        form.resetFields();
      };

      const result = await submitData(
        "POST",
        endpoint,
        values,
        options,
        alertDesc,
        setTimeoutFN,
        3000
      );

      if (result && result.status === "success") {
        const clientCopy = { ...client };
        clientCopy.users.push(result.data.user);

        setClient(clientCopy);
      }

      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  return (
    <Row justify="center" align="middle" className={classes.RowVH}>
      <Form className={classes.FormSize} onFinish={submitFormData} form={form}>
        <Title level={3}>User Information</Title>

        {/* For User Name */}
        <InputName value={values.name} handleChange={handleChange} />

        <Row gutter={16}>
          <Col span={12}>
            {/* For User Email */}
            <InputEmail value={values.email} handleChange={handleChange} />
          </Col>

          <Col span={12}>
            {/* For User Contact Number */}
            <InputContactNumber
              value={values.contactNumber}
              handleChange={handleChange}
            />
          </Col>
        </Row>

        {/* For User Address */}
        <InputAddress value={values.address} handleChange={handleChange} />

        <Divider />

        <Title level={3}>Billing Information</Title>

        {/* For Monthly Bill */}
        <InputBill value={values.monthlyBill} handleChange={handleChange} />

        {/* For Balance */}
        <InputBalance value={values.balance} handleChange={handleChange} />

        {/* For Billing Date */}
        <InputDate
          value={values.billDate}
          handleChange={(_, dateString) => (values.billDate = dateString)}
        />

        {/* For Alert */}
        <div id="alert" className={classes.AlertMargin}></div>

        {/* For Submit Button */}
        <Button type="primary" htmlType="submit" block loading={loading}>
          Add User
        </Button>
      </Form>
    </Row>
  );
};

export default AddUser;
