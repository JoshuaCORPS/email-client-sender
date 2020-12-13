import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import axios from "axios";
import { withRouter } from "react-router-dom";
import { Alert, Row } from "antd";

import classes from "./VerifyAccount.module.css";

const VerifyAccount = (props) => {
  useEffect(() => {
    try {
      const verifyToken = async () => {
        try {
          const result = await axios.post(
            `/api/v1/auth/verify/${props.match.params.token}`
          );

          if (result.data.status === "success") {
            ReactDOM.render(
              <Alert
                message="Success"
                description={result.data.message}
                type="success"
                showIcon
              />,
              document.getElementById("alert")
            );
            setTimeout(() => {
              window.location.assign("/login");
            }, 2000);
          }
        } catch (error) {
          ReactDOM.render(
            <Alert
              message="Failed"
              description="Account token is not valid!"
              type="error"
              showIcon
            />,
            document.getElementById("alert")
          );
          setTimeout(() => {
            window.location.assign("/signup");
          }, 2000);
        }
      };
      verifyToken();
    } catch (error) {
      console.log(error);
    }
  }, [props.match.params.token]);

  return (
    <Row justify="center" align="middle" className={classes.RowVH}>
      <div id="alert"></div>
    </Row>
  );
};

export default withRouter(VerifyAccount);
