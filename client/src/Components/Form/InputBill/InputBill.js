import React from "react";
import { Form, Input } from "antd";

const InputBill = ({ value, handleChange }) => (
  <>
    {/* For Numbers */}
    <Form.Item
      name="itemBill"
      rules={[{ required: true, message: "Please input Monthly bill!" }]}
    >
      <Input
        name="monthlyBill"
        type="number"
        min="1"
        value={value}
        onChange={handleChange}
        onKeyDown={(e) => {
          const invalidChars = ["-", "+", "e"];
          if (invalidChars.includes(e.key)) {
            e.preventDefault();
          }
        }}
        size="large"
        prefix="₱"
        placeholder="Monthly Bill"
      />
    </Form.Item>
  </>
);

export default InputBill;
