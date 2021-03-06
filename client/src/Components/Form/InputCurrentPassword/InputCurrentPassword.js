import React from "react";
import { Form, Input } from "antd";
import { LockOutlined } from "@ant-design/icons";

const InputNewPassword = ({ value, handleChange }) => (
  <>
    {/* For Password */}
    <Form.Item
      name="itemNewPassword"
      rules={[
        { required: true, message: "Please input Password!" },
        { min: 8, message: "Password must have at least 8 characters!" },
      ]}
    >
      <Input.Password
        name="currentPassword"
        value={value}
        onChange={handleChange}
        prefix={<LockOutlined />}
        size="large"
        type="password"
        placeholder="Current Password"
      />
    </Form.Item>
  </>
);

export default InputNewPassword;
