import React from "react";
import { Form, Input } from "antd";

const InputTextArea = ({ value, handleChange }) => (
  <>
    {/* For Subject */}
    <Form.Item
      name="itemMessage"
      rules={[{ required: true, message: "Please input the Message!" }]}
    >
      <Input.TextArea
        name="message"
        value={value}
        onChange={handleChange}
        autoSize={{ minRows: 5, maxRows: 6 }}
        showCount
        maxLength={500}
        size="large"
        placeholder="Message"
      />
    </Form.Item>
  </>
);

export default InputTextArea;
