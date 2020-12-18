import React from "react";
import { Form, Input } from "antd";
import { LockOutlined } from "@ant-design/icons";

const InputPasswordConfirm = ({
  value,
  handleChange,
  placeholder = "Confim Your Password!",
}) => {
  return (
    <>
      {/* For Password Confirm */}
      <Form.Item
        name="itemPasswordConfirm"
        dependencies={["itemPassword"]}
        hasFeedback
        rules={[
          { required: true, message: "Please confirm Password!" },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue("itemPassword") === value)
                return Promise.resolve();

              return Promise.reject("Password don't match!");
            },
          }),
        ]}
      >
        <Input.Password
          name="passwordConfirm"
          value={value}
          onChange={handleChange}
          prefix={<LockOutlined />}
          size="large"
          type="password"
          placeholder={placeholder}
        />
      </Form.Item>
    </>
  );
};

export default InputPasswordConfirm;
