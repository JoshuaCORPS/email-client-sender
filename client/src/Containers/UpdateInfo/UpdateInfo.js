import React, { useEffect, useState, useContext } from "react";
import ReactDOM from "react-dom";
import { Form, Row, Button, Typography, Col, Upload, Avatar } from "antd";
import { UploadOutlined } from "@ant-design/icons";

import { useForm } from "../../hooks/useForm";
import { UserContext } from "../../hooks/useCreateContext";
import { submitData } from "../../util/submit-data";
import InputName from "../../Components/Form/InputName/InputName";
import InputEmail from "../../Components/Form/InputEmail/InputEmail";
import InputContactNumber from "../../Components/Form/InputContactNumber/InputContactNumber";
import InputAddress from "../../Components/Form/InputAddress/InputAddress";
import classes from "./UpdateInfo.module.css";

const { Title } = Typography;

const UpdateInfo = () => {
  const [values, handleChange] = useForm({
    name: "",
    email: "",
    contactNumber: "",
    address: "",
  });
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [form] = Form.useForm();
  const { client, setClient } = useContext(UserContext);

  const submitFormData = async () => {
    try {
      setLoading(true);

      const endpoint = "/api/v1/auth/update-info";
      const alertDesc = "Your info has been updated!";
      const options = { withCredentials: true };
      const setTimeoutFN = () =>
        ReactDOM.render("", document.getElementById("alert"));

      const fd = new FormData();
      fd.append("name", values.name);
      fd.append("email", values.email);
      fd.append("contactNumber", values.contactNumber);
      fd.append("address", values.address);
      if (selectedFile) fd.append("photo", selectedFile);

      const result = await submitData(
        "PATCH",
        endpoint,
        fd,
        options,
        alertDesc,
        setTimeoutFN,
        3000
      );

      if (result.status === "success") setClient(result.data.client);

      setLoading(false);
    } catch (error) {
      console.error(error.message);
    }
  };

  const fileChangedHandler = (e) => {
    setSelectedFile(e.file.originFileObj);
    if (e.file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const updateInfoPhoto = document.getElementById("clientphoto");
        updateInfoPhoto.getElementsByTagName("img")[0].src =
          event.target.result;
      };
      reader.readAsDataURL(e.file.originFileObj);
    }
  };

  const dummyRequest = ({ file, onSuccess }) => {
    setTimeout(() => {
      onSuccess("ok");
    }, 0);
  };

  useEffect(() => {
    form.setFieldsValue({
      itemName: client.name,
      itemEmail: client.email,
      itemContactNumber: client.contactNumber,
      itemAddress: client.address,
    });

    values.name = client.name;
    values.email = client.email;
    values.contactNumber = client.contactNumber;
    values.address = client.address;

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [client]);

  return (
    <Row justify="center" align="middle" className={classes.RowVH}>
      <Form className={classes.FormSize} onFinish={submitFormData} form={form}>
        <Title level={3}>Update Information</Title>

        {/* For Client Name */}
        <InputName value={values.name} handleChange={handleChange} />

        <Row gutter={16}>
          <Col span={12}>
            {/* For Client Email */}
            <InputEmail value={values.email} handleChange={handleChange} />
          </Col>

          <Col span={12}>
            {/* For Client Contact Number */}
            <InputContactNumber
              value={values.contactNumber}
              handleChange={handleChange}
            />
          </Col>
        </Row>

        {/* For Client Address */}
        <InputAddress value={values.address} handleChange={handleChange} />

        {/* For Client Image */}
        <Avatar
          id="clientphoto"
          src={`https://e-sender.herokuapp.com/img/users/${
            client.photo ? client.photo : "default.jpg"
          }`}
          style={{ marginRight: "1rem" }}
          size={{ xs: 60, sm: 60, md: 60, lg: 60, xl: 60, xxl: 60 }}
        />

        {/* For Image Input */}
        <Upload
          name="photo"
          accept="image/*"
          onChange={fileChangedHandler}
          customRequest={dummyRequest}
        >
          <Button icon={<UploadOutlined />}>Browse Image</Button>
        </Upload>

        {/* For Alert */}
        <div id="alert" className={classes.AlertMargin}></div>

        {/* For Submit Button */}
        <Button type="primary" htmlType="submit" block loading={loading}>
          Update Information
        </Button>
      </Form>
    </Row>
  );
};

export default UpdateInfo;
