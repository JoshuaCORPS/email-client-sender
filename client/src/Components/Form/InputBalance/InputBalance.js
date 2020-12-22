import React from "react";
import { Form, Input } from "antd";

const InputBill = ({ value, handleChange }) => {
  return (
    <>
      {/* For Numbers */}
      <Form.Item name="itemBalance">
        <Input
          name="balance"
          type="number"
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
          placeholder="Balance (Optional)"
        />
      </Form.Item>
    </>
  );
};

export default InputBill;
