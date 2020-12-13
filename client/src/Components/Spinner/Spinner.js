import React from "react";
import { Row } from "antd";
import classes from "./Spinner.module.css";

const Spinner = () => {
  return (
    <Row justify="center" align="middle" className={classes.RowVH}>
      <div className={classes.Loader}></div>
    </Row>
  );
};

export default Spinner;
