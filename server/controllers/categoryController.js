const slugify = require('slugify');

const Client = require('../models/clientModel');
const catchAsync = require('../util/catchAsync');
const AppError = require('../util/appError');

exports.addCategory = catchAsync(async (req, res, next) => {
  const { billCategory } = req.body;

  if (!billCategory)
    return next(
      new AppError('Please provide the bill category to continue', 400)
    );

  const client = await Client.findById(req.client.id);

  if (!client) return next(new AppError('client not found', 404));

  // search for the index of params.category if exist
  const categoryIdx = client.billCategories.findIndex(
    (category) =>
      category.value.toLowerCase() === billCategory.trim().toLowerCase()
  );

  if (categoryIdx > -1)
    return next(new AppError('Category already exist', 400));

  const category = {
    value: billCategory.trim(),
    slug: slugify(billCategory.trim(), { lower: true }),
  };

  client.billCategories.push(category);
  await client.save({ validateBeforeSave: false });

  res.status(200).json({
    status: 'success',
    data: {
      client,
    },
  });
});

exports.getAllCategories = catchAsync(async (req, res, next) => {
  const client = await Client.findById(req.client.id);

  if (!client) return next(new AppError('client not found', 404));

  res.status(200).json({
    status: 'success',
    data: {
      categories: client.billCategories,
    },
  });
});

exports.updateCategory = catchAsync(async (req, res, next) => {
  const client = await Client.findById(req.client.id);

  if (!client) return next(new AppError('client not found', 404));

  // search for the index of params.category if exist
  const categoryIdx = client.billCategories.findIndex(
    (category) => category.slug === req.params.category.toLowerCase()
  );

  if (categoryIdx < 0) return next(new AppError('Category not found', 404));

  const { billCategory } = req.body;

  if (!billCategory)
    return next(
      new AppError('Please provide the bill category to continue', 400)
    );

  // search for the index of billCategory if exist
  const searchReqCategoryIdx = client.billCategories.findIndex(
    (category) => category.value.toLowerCase() === billCategory.toLowerCase()
  );

  if (searchReqCategoryIdx > -1)
    return next(new AppError('Category already exist', 400));

  client.billCategories[categoryIdx].value = billCategory;
  client.billCategories[categoryIdx].slug = slugify(billCategory, {
    lower: true,
  });

  await client.save({ validateBeforeSave: false });

  res.status(200).json({
    status: 'success',
    data: {
      client,
    },
  });
});

exports.deleteCategory = catchAsync(async (req, res, next) => {
  const client = await Client.findById(req.client.id);

  if (!client) return next(new AppError('client not found', 404));

  // search for the index of params.category if exist
  const categoryIdx = client.billCategories.findIndex(
    (category) => category.slug === req.params.category.toLowerCase()
  );

  if (categoryIdx === -1) return next(new AppError('category not found', 404));

  client.billCategories.splice(categoryIdx, 1);

  await client.save({ validateBeforeSave: false });

  res.status(204).json({
    status: 'success',
    data: null,
  });
});
