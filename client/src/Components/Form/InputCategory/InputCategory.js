import React from "react";
import { Form, Input } from "antd";
import { TableOutlined } from "@ant-design/icons";

const InputCategory = ({ value, handleChange }) => (
  <>
    {/* For Category */}
    <Form.Item
      name="itemCategory"
      rules={[{ required: true, message: "Please input Category name!" }]}
    >
      <Input
        name="billCategory"
        value={value}
        onChange={handleChange}
        size="large"
        prefix={<TableOutlined />}
        placeholder="Category Name"
      />
    </Form.Item>
  </>
);

export default InputCategory;
