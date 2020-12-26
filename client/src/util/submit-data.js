import ReactDOM from "react-dom";
import axios from "axios";
import { Alert } from "antd";

export const submitData = async (
  method,
  url,
  data,
  config,
  alertDesc,
  setTimeoutFN,
  timeoutSec
) => {
  try {
    const clientData = await axios({
      method,
      url,
      data,
      ...config,
    });

    if (clientData.data.status === "success")
      ReactDOM.render(
        <Alert
          message="Success"
          description={alertDesc}
          type="success"
          showIcon
        />,
        document.getElementById("alert")
      );
    setTimeout(() => {
      setTimeoutFN();
    }, timeoutSec);

    return clientData.data;
  } catch (error) {
    ReactDOM.render(
      <Alert message={error.response.data.message} type="error" showIcon />,
      document.getElementById("alert")
    );

    setTimeout(() => {
      ReactDOM.render("", document.getElementById("alert"));
    }, 3000);
  }
};
