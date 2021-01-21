const catchAsync = require('../util/catchAsync');

exports.checkTokenAndSearchClient = catchAsync(async (req, res, next) => {
  res.status(200).json({
    status: 'success',
    data: {
      client: req.client,
    },
  });
});
