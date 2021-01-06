import React from "react";
import { Form, Input } from "antd";
import { MobileOutlined } from "@ant-design/icons";

const InputContactNumber = ({ value, handleChange }) => (
  <>
    {/* For Contact Number */}
    <Form.Item
      name="itemContactNumber"
      rules={[
        { required: true, message: "Please input Contact Number!" },
        { min: 11, message: "Contact number must only hav 11 digits!" },
        { max: 11, message: "Contact number must only have 11 digits!" },
      ]}
    >
      <Input
        name="contactNumber"
        value={value}
        onChange={handleChange}
        size="large"
        prefix={<MobileOutlined />}
        placeholder="Contact Number"
      />
    </Form.Item>
  </>
);

export default InputContactNumber;
