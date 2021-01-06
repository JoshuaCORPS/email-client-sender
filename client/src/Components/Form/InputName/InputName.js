import React from "react";
import { Form, Input } from "antd";
import { UserOutlined } from "@ant-design/icons";

const InputName = ({ value, handleChange }) => (
  <>
    {/* For Name */}
    <Form.Item
      name="itemName"
      rules={[{ required: true, message: "Please input Name!" }]}
    >
      <Input
        name="name"
        value={value}
        onChange={handleChange}
        size="large"
        prefix={<UserOutlined />}
        placeholder="Full Name"
      />
    </Form.Item>
  </>
);

export default InputName;
