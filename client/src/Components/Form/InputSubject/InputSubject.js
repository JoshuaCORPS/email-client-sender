import React from "react";
import { Form, Input } from "antd";

const inputSubject = ({ value, handleChange }) => {
  return (
    <>
      {/* For Subject */}
      <Form.Item
        name="itemSubject"
        rules={[{ required: true, message: "Please input the Subject!" }]}
      >
        <Input
          name="subject"
          value={value}
          onChange={handleChange}
          size="large"
          placeholder="Subject"
        />
      </Form.Item>
    </>
  );
};

export default inputSubject;
