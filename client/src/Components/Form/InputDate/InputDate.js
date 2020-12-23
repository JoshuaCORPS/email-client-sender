import React from "react";
import { Form, DatePicker } from "antd";

const InputDate = ({ value, handleChange }) => {
  return (
    <>
      {/* For Numbers */}
      <Form.Item
        name="itemDate"
        rules={[{ required: true, message: "Please input Billing Date!" }]}
      >
        <DatePicker
          value={value}
          placeholder="Billing Date"
          style={{ width: "100%" }}
          onChange={handleChange}
          format="MM/DD/YYYY"
        />
      </Form.Item>
    </>
  );
};

export default InputDate;
