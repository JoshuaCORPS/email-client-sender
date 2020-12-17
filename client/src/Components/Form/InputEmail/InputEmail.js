import React from "react";
import { Form, Input } from "antd";
import { MailOutlined } from "@ant-design/icons";

const inputEmail = ({ value, handleChange }) => {
  return (
    <>
      {/* For Email */}
      <Form.Item
        name="itemEmail"
        rules={[
          { required: true, message: "Please input Email!" },
          { type: "email", message: "Please input a valid Email!" },
        ]}
      >
        <Input
          name="email"
          value={value}
          onChange={handleChange}
          size="large"
          prefix={<MailOutlined />}
          placeholder="Email"
        />
      </Form.Item>
    </>
  );
};

export default inputEmail;
