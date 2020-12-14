import React from "react";
import { Form, Input } from "antd";
import { LockOutlined } from "@ant-design/icons";

const InputPassword = ({ value, handleChange }) => {
  return (
    <>
      {/* For Password */}
      <Form.Item
        name="itemPassword"
        rules={[
          { required: true, message: "Please input your Password!" },
          { min: 8, message: "Password must have at least 8 characters!" },
        ]}
      >
        <Input.Password
          name="password"
          value={value.password}
          onChange={handleChange}
          prefix={<LockOutlined />}
          size="large"
          type="password"
          placeholder="Password"
        />
      </Form.Item>
    </>
  );
};

export default InputPassword;
