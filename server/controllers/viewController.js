const catchAsync = require('../util/catchAsync');
const Client = require('../models/clientModel');

exports.checkTokenAndSearchClient = catchAsync(async (req, res, next) => {
  // for caching
  await Client.findById(req.client.id).cache({
    key: req.client.id,
  });

  res.status(200).json({
    status: 'success',
    data: {
      client: req.client,
    },
  });
});
