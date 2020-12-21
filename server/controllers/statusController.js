exports.status = (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Up and Running!',
  });
};
