import React from "react";
import { Card, Typography } from "antd";
import classes from "./CardOverview.module.css";

const { Meta } = Card;
const { Text } = Typography;

const CardOverview = ({ title, description, Icon = "" }) => {
  return (
    <Card
      className={classes.CardHeight}
      title={<Text type="secondary">{title}</Text>}
    >
      <Meta
        className={classes.CardTextSize}
        avatar={Icon && <Icon />}
        title={<span className={classes.CardTextSize}>{description}</span>}
      />
    </Card>
  );
};

export default CardOverview;
