import React, { useState, useEffect, useContext } from "react";
import ReactDOM from "react-dom";
import { withRouter } from "react-router-dom";
import { Form, Row, Button, Typography } from "antd";

import { useForm } from "../../hooks/useForm";
import { UserContext } from "../../hooks/useCreateContext";
import { submitData } from "../../util/submit-data";
import InputCategory from "../../Components/Form/InputCategory/InputCategory";
import classes from "./EditCategory.module.css";

const { Title } = Typography;

const EditCategory = ({ match }) => {
  const [values, handleChange] = useForm({
    billCategory: "",
  });
  const [loading, setLoading] = useState(false);
  const { client, setClient } = useContext(UserContext);
  const [form] = Form.useForm();

  const currentCategoryIdx =
    client.billCategories &&
    client.billCategories.findIndex(
      (category) => category.slug === match.params.category
    );

  const submitFormData = async () => {
    try {
      setLoading(true);

      const endpoint = `/api/v1/clients/categories/${match.params.category}`;
      const alertDesc = "Category successfully updated!";
      const options = { withCredentials: true };
      const setTimeoutFN = () => {
        if (document.getElementById("alert"))
          ReactDOM.render("", document.getElementById("alert"));
      };

      const result = await submitData(
        "PATCH",
        endpoint,
        values,
        options,
        alertDesc,
        setTimeoutFN,
        3000
      );

      if (result && result.status === "success") {
        const clientCopy = { ...client };
        clientCopy.billCategories[currentCategoryIdx] =
          result.data.client.billCategories[currentCategoryIdx];

        setClient(clientCopy);
      }

      setLoading(false);
    } catch (error) {
      console.log(error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentCategoryIdx !== -1) {
      form.setFieldsValue({
        itemCategory:
          client.billCategories &&
          client.billCategories[currentCategoryIdx].value,
      });
      values.billCategory =
        client.billCategories &&
        client.billCategories[currentCategoryIdx].value;
    } else {
      window.location.assign("/categories");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [client]);

  return (
    <Row justify="center" align="middle" className={classes.RowVH}>
      <Form className={classes.FormSize} onFinish={submitFormData} form={form}>
        <Title level={3}>Category Information</Title>

        {/* For Category */}
        <InputCategory
          value={values.billCategory}
          handleChange={handleChange}
        />

        {/* For Alert */}
        <div id="alert" className={classes.AlertMargin}></div>

        {/* For Submit Button */}
        <Button type="primary" htmlType="submit" block loading={loading}>
          Update Category
        </Button>
      </Form>
    </Row>
  );
};

export default withRouter(EditCategory);
