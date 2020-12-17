import React from "react";
import { Form, Input } from "antd";
import { HomeOutlined } from "@ant-design/icons";

const InputAddress = ({ value, handleChange }) => {
  return (
    <>
      {/* For Address */}
      <Form.Item
        name="itemAddress"
        rules={[{ required: true, message: "Please input Address!" }]}
      >
        <Input
          name="address"
          value={value}
          onChange={handleChange}
          size="large"
          prefix={<HomeOutlined />}
          placeholder="Full Address"
        />
      </Form.Item>
    </>
  );
};

export default InputAddress;
