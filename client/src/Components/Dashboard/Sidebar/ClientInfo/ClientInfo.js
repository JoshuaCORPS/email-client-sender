import React from "react";
import { Row, Col, Avatar, Typography } from "antd";

const { Title, Text } = Typography;

const ClientInfo = ({ photo, name, role, classes }) => (
  <Row className={classes.RowMargin} justify="space-between" align="middle">
    <Col span={6}>
      <Avatar
        src={`https://e-sender.herokuapp.com/img/users/${photo && photo}`}
        alt={`${name} picture`}
        size={{ xs: 60, sm: 60, md: 60, lg: 60, xl: 60, xxl: 60 }}
      />
    </Col>
    <Col>
      <Title className={classes.NameColor} level={2}>
        {name}
      </Title>
      <Row justify="center">
        <Col>
          <Text className={classes.RoleColor} type="secondary">
            {role && role.toUpperCase()}
          </Text>
        </Col>
      </Row>
    </Col>
  </Row>
);

export default ClientInfo;
