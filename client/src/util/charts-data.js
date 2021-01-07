export const userCategorieOptions = (client) => {
  const userCategories =
    client.billCategories &&
    client.billCategories.map((category) => {
      const userData = {
        label: category.value,
        y: client.users.filter(
          (user) =>
            user.billCategory.toLowerCase() === category.value.toLowerCase()
        ).length,
      };

      return userData;
    });

  return {
    exportEnabled: true,
    animationEnabled: true,
    title: {
      text: "No. of Users Per Category",
    },
    axisY: {
      title: "No. of Users",
    },
    data: [
      {
        // Change type to "doughnut", "line", "splineArea", etc.
        type: "column",
        dataPoints: userCategories,
      },
    ],
  };
};

export const paidUsersOptions = (client) => {
  const paidUsers = [
    {
      label: "Paid",
      y:
        client.users &&
        client.users.length !== 0 &&
        (client.users.filter((user) => user.paid === true).length /
          client.users.length) *
          100,
    },
    {
      label: "Not Paid",
      y:
        client.users &&
        client.users.length !== 0 &&
        (client.users.filter((user) => user.paid === false).length /
          client.users.length) *
          100,
    },
  ];

  return {
    exportEnabled: true,
    animationEnabled: true,
    title: {
      text: "Percentage of Paid and Not Paid Users",
    },
    data: [
      {
        type: "pie",
        startAngle: 75,
        toolTipContent: "<b>{label}</b>: {y}%",
        showInLegend: "true",
        legendText: "{label}",
        indexLabelFontSize: 16,
        indexLabel: "{label} - {y}%",
        dataPoints: paidUsers,
      },
    ],
  };
};
