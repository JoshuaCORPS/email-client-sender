import React, { useState, useEffect, useContext } from "react";
import ReactDOM from "react-dom";
import moment from "moment";
import { withRouter } from "react-router-dom";
import { Form, Row, Button, Typography, Col, Divider } from "antd";

import { useForm } from "../../../hooks/useForm";
import { submitData } from "../../../util/submit-data";
import { UserContext } from "../../../hooks/useCreateContext";
import InputName from "../../../Components/Form/InputName/InputName";
import InputEmail from "../../../Components/Form/InputEmail/InputEmail";
import InputContactNumber from "../../../Components/Form/InputContactNumber/InputContactNumber";
import InputAddress from "../../../Components/Form/InputAddress/InputAddress";
import InputBill from "../../../Components/Form/InputBill/InputBill";
import InputBalance from "../../../Components/Form/InputBalance/InputBalance";
import InputDate from "../../../Components/Form/InputDate/InputDate";
import InputDropdownCategory from "../../../Components/Form/InputDropdownCategory/InputDropdownCategory";
import classes from "./EditUser.module.css";

const { Title } = Typography;

const EditUser = ({ match }) => {
  const [values, handleChange] = useForm({
    name: "",
    email: "",
    contactNumber: "",
    address: "",
    monthlyBill: "",
    balance: "0",
    billDate: "",
    billCategory: "",
  });
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const { client, setClient } = useContext(UserContext);

  const currentUser =
    client.users &&
    client.users.findIndex((user) => user.id === match.params.userid);

  const submitFormData = async () => {
    try {
      setLoading(true);

      const endpoint = `/api/v1/clients/users/${match.params.userid}`;
      const alertDesc = "User successfully updated!";
      const options = { withCredentials: true };
      const setTimeoutFN = () => {
        if (document.getElementById("alert"))
          ReactDOM.render("", document.getElementById("alert"));
      };

      await submitData(
        "PATCH",
        endpoint,
        values,
        options,
        alertDesc,
        setTimeoutFN,
        3000
      );

      const clientCopy = { ...client };
      clientCopy.users[currentUser] = {
        ...clientCopy.users[currentUser],
        ...values,
      };

      if (values.balance <= "0") clientCopy.users[currentUser].paid = true;
      else clientCopy.users[currentUser].paid = false;

      setClient(clientCopy);

      setLoading(false);
    } catch (error) {
      console.log(error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser !== -1) {
      form.setFieldsValue({
        itemName: client.users && client.users[currentUser].name,
        itemEmail: client.users && client.users[currentUser].email,
        itemContactNumber:
          client.users && client.users[currentUser].contactNumber,
        itemAddress: client.users && client.users[currentUser].address,
        itemBill: client.users && client.users[currentUser].monthlyBill,
        itemBalance: client.users && client.users[currentUser].balance,
        itemDate: client.users && moment(client.users[currentUser].billDate),
        itemDdCategory: client.users && client.users[currentUser].billCategory,
      });

      values.name = client.users && client.users[currentUser].name;
      values.email = client.users && client.users[currentUser].email;
      values.contactNumber =
        client.users && client.users[currentUser].contactNumber;
      values.address = client.users && client.users[currentUser].address;
      values.monthlyBill =
        client.users && client.users[currentUser].monthlyBill;
      values.balance = client.users && client.users[currentUser].balance;
      values.billDate = client.users && client.users[currentUser].billDate;
      values.billCategory =
        client.users && client.users[currentUser].billCategory;
    } else {
      window.location.assign("/users");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [client]);

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

        <InputDropdownCategory
          value={values.billCategory}
          handleChange={(value) => (values.billCategory = value)}
        />

        {/* For Alert */}
        <div id="alert" className={classes.AlertMargin}></div>

        {/* For Submit Button */}
        <Button type="primary" htmlType="submit" block loading={loading}>
          Update User
        </Button>
      </Form>
    </Row>
  );
};

export default withRouter(EditUser);
