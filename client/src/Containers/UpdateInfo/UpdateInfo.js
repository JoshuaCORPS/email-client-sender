import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import axios from "axios";
import {
  Form,
  Row,
  Button,
  Typography,
  Alert,
  Col,
  Upload,
  Avatar,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";

import { useForm } from "../../hooks/useForm";
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
  const [client, setClient] = useState({});
  const [form] = Form.useForm();

  const submitFormData = async () => {
    try {
      setLoading(true);

      const fd = new FormData();
      fd.append("name", values.name);
      fd.append("email", values.email);
      fd.append("contactNumber", values.contactNumber);
      fd.append("address", values.address);
      fd.append("photo", selectedFile);

      const updateClientInfo = await axios.patch(
        "/api/v1/auth/update-info",
        fd,
        { withCredentials: true }
      );

      if (updateClientInfo.data.status === "success") {
        ReactDOM.render(
          <Alert
            message="Success"
            description="Your info has been updated!"
            type="success"
            showIcon
          />,
          document.getElementById("alert")
        );
      }

      setLoading(false);

      setTimeout(() => {
        ReactDOM.render("", document.getElementById("alert"));
        window.location.assign("/");
      }, 3000);
    } catch (error) {
      ReactDOM.render(
        <Alert message={error.response.data.message} type="error" showIcon />,
        document.getElementById("alert")
      );

      setLoading(false);

      setTimeout(() => {
        ReactDOM.render("", document.getElementById("alert"));
      }, 5000);
    }
  };

  const fileChangedHandler = (e) => {
    setSelectedFile(e.file.originFileObj);
    if (e.file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const parent = document.getElementById("clientphoto");
        parent.getElementsByTagName("img")[0].src = event.target.result;
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
    try {
      const getInfo = async () => {
        try {
          const result = await axios.get("/api/v1/view/", {
            withCredentials: true,
          });

          if (result.data.status === "success") {
            form.setFieldsValue({
              itemName: result.data.data.client.name,
              itemEmail: result.data.data.client.email,
              itemContactNumber: result.data.data.client.contactNumber,
              itemAddress: result.data.data.client.address,
            });

            values.name = result.data.data.client.name;
            values.email = result.data.data.client.email;
            values.contactNumber = result.data.data.client.contactNumber;
            values.address = result.data.data.client.address;
            setClient(result.data.data.client);
          }
        } catch (error) {
          window.location.assign("/login");
        }
      };

      getInfo();
    } catch (error) {
      console.log(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

        <Avatar
          id="clientphoto"
          src={`https://corps-sender.herokuapp.com/img/users/${client.photo}`}
          style={{ marginRight: "2rem" }}
          size={{ xs: 60, sm: 60, md: 60, lg: 60, xl: 60, xxl: 60 }}
        />

        <Upload
          name="photo"
          accept="image/*"
          onChange={fileChangedHandler}
          customRequest={dummyRequest}
        >
          <Button icon={<UploadOutlined />}>Click to Upload</Button>
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
