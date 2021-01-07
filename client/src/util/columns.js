import { Link } from "react-router-dom";
import { Space, Button, Divider, Dropdown, Popconfirm } from "antd";
import {
  CheckCircleTwoTone,
  CloseCircleTwoTone,
  DownOutlined,
} from "@ant-design/icons";
import numberFormatter from "./numberFormatter";
import DropdownActionMenu from "../Components/Dashboard/DropdownActionMenu/DropdownActionMenu";

export const usersColumns = (classes, client, handlePaid, loading) => {
  return [
    {
      title: "Name",
      dataIndex: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Contact Number",
      dataIndex: "contactNumber",
    },
    {
      title: "Monthly Bill",
      dataIndex: "monthlyBill",
      sorter: (a, b) => a.monthlyBill - b.monthlyBill,
      render: (monthlyBill) => <>{`₱${numberFormatter(monthlyBill)}`}</>,
    },
    {
      title: "Billing Date",
      dataIndex: "billDate",
      sorter: (a, b) => new Date(a.billDate) - new Date(b.billDate),
      render: (billDate) => <>{new Date(`${billDate}`).toLocaleDateString()}</>,
    },
    {
      title: "Paid",
      dataIndex: "paid",
      sorter: (a, b) => a.paid - b.paid,
      render: (paid) => (
        <>
          {paid === true ? (
            <CheckCircleTwoTone
              className={classes.PaidIconSize}
              twoToneColor="#52c41a"
            />
          ) : (
            <CloseCircleTwoTone
              className={classes.PaidIconSize}
              twoToneColor="#D42322"
            />
          )}
        </>
      ),
    },
    {
      title: "Balance",
      dataIndex: "balance",
      sorter: (a, b) => a.balance - b.balance,
      render: (balance) => <>{`₱${numberFormatter(balance)}`}</>,
    },
    {
      title: "Category",
      dataIndex: "billCategory",
      filters:
        client.billCategories &&
        client.billCategories.map((category) => ({
          text: category.value,
          value: category.value,
        })),
      onFilter: (value, record) => record.billCategory.indexOf(value) === 0,
    },
    {
      title: "Actions",
      dataIndex: "actions",
      render: (_, record, _2) => (
        <Space size="small">
          <Button
            className={classes.ActionCol}
            type="link"
            onClick={(e) => handlePaid(record)}
            disabled={record.paid}
            loading={loading}
          >
            Mark as Paid
          </Button>

          <Divider type="vertical" />

          <Dropdown overlay={() => <DropdownActionMenu record={record} />}>
            <Button className={classes.ActionMoreBtn} type="link">
              More <DownOutlined />
            </Button>
          </Dropdown>
        </Space>
      ),
    },
  ];
};

export const categoriesColumns = (handleDelete) => {
  return [
    {
      title: "Category",
      dataIndex: "category",
      sorter: (a, b) => a.category.localeCompare(b.category),
    },
    {
      title: "Actions",
      dataIndex: "actions",
      render: (_, record, _2) => (
        <Space size="small">
          <Button type="link">
            <Link to={`categories/${record.key}/edit`}>Edit</Link>
          </Button>
          <Divider type="vertical" />
          <Popconfirm
            title="Are you sure you want to delete this category?"
            okText="Yes"
            cancelText="No"
            onConfirm={(e) => handleDelete(record)}
          >
            <Button type="link">Delete</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];
};

export const categoriesSubColumns = (classes) => {
  return [
    {
      title: "Name",
      dataIndex: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Monthly Bill",
      dataIndex: "monthlyBill",
      sorter: (a, b) => a.monthlyBill - b.monthlyBill,
      render: (monthlyBill) => <>{`₱${numberFormatter(monthlyBill)}`}</>,
    },
    {
      title: "Billing Date",
      dataIndex: "billDate",
      sorter: (a, b) => new Date(a.billDate) - new Date(b.billDate),
      render: (billDate) => <>{new Date(`${billDate}`).toLocaleDateString()}</>,
    },
    {
      title: "Paid",
      dataIndex: "paid",
      sorter: (a, b) => a.paid - b.paid,
      render: (paid) => (
        <>
          {paid === true ? (
            <CheckCircleTwoTone
              className={classes.PaidIconSize}
              twoToneColor="#52c41a"
            />
          ) : (
            <CloseCircleTwoTone
              className={classes.PaidIconSize}
              twoToneColor="#D42322"
            />
          )}
        </>
      ),
    },
    {
      title: "Balance",
      dataIndex: "balance",
      sorter: (a, b) => a.balance - b.balance,
      render: (balance) => <>{`₱${numberFormatter(balance)}`}</>,
    },
  ];
};
