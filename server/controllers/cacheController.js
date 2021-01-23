const { clearHash } = require('../services/cache');

exports.cleanCache = async (req, res, next) => {
  await next();

  clearHash(req.client.id);
};
