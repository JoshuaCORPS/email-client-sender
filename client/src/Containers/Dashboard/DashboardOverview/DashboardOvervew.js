import React, { useContext } from "react";
import { Row, Col } from "antd";
import { UserOutlined, UnorderedListOutlined } from "@ant-design/icons";

import { UserContext } from "../../../hooks/useCreateContext";
import CanvasJSReact from "../../../util/assets/canvasjs.react";
import numberFormatter from "../../../util/numberFormatter";
import {
  userCategorieOptions,
  paidUsersOptions,
} from "../../../util/charts-data";
import CardOverview from "../../../Components/Dashboard/CardOverview/CardOverview";
import classes from "./DashboardOverview.module.css";

const CanvasJSChart = CanvasJSReact.CanvasJSChart;

const DashboardOvervew = () => {
  const { client } = useContext(UserContext);

  let expectedIncome =
    client.users &&
    client.users.reduce(
      (prev, curr) => prev + curr.monthlyBill + curr.balance,
      0
    );

  return (
    <>
      <Row gutter={16}>
        <Col className={classes.CardMargin} xs={24} md={24} lg={8}>
          <CardOverview
            title="No. of Users"
            description={client.users && client.users.length}
            Icon={UserOutlined}
          />
        </Col>

        <Col className={classes.CardMargin} xs={24} md={24} lg={8}>
          <CardOverview
            title="No. of Categories"
            description={client.billCategories && client.billCategories.length}
            Icon={UnorderedListOutlined}
          />
        </Col>

        <Col className={classes.CardMargin} xs={24} md={24} lg={8}>
          <CardOverview
            title="Expected Income this Month"
            description={`₱ ${
              expectedIncome && numberFormatter(expectedIncome)
            }.00`}
          />
        </Col>
      </Row>

      <Row gutter={16}>
        <Col className={classes.ChartSize} xs={24} md={12} lg={12}>
          <CanvasJSChart options={userCategorieOptions(client)} />
        </Col>

        <Col className={classes.ChartSize} xs={24} md={12} lg={12}>
          <CanvasJSChart options={paidUsersOptions(client)} />
        </Col>
      </Row>
    </>
  );
};

export default DashboardOvervew;
