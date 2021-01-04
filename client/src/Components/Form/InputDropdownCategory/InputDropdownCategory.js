import React, { useContext } from "react";
import { Form, Select } from "antd";

import { UserContext } from "../../../hooks/useCreateContext";

const { Option } = Select;

const InputDropdownCategory = ({ value, handleChange }) => {
  const { client } = useContext(UserContext);

  const options =
    client.billCategories &&
    client.billCategories.map((category) => (
      <Option key={category.value}>{category.value}</Option>
    ));

  return (
    <>
      {/* For Numbers */}
      <Form.Item
        name="itemDdCategory"
        rules={[{ required: true, message: "Please select Billing Category!" }]}
      >
        <Select
          showSearch
          value={value}
          placeholder="Billing Category"
          onChange={handleChange}
        >
          {options}
        </Select>
      </Form.Item>
    </>
  );
};

export default InputDropdownCategory;
