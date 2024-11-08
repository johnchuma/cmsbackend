module.exports.getPagination = (req, res, next) => {
  try {
    let { page, limit } = req.query;
    page = parseInt(page) ?? 1;
    limit = parseInt(limit) ?? 8;
    const offset = (page - 1) * limit;
    req.page = page;
    req.limit = limit;
    req.offset = offset;
    next();
  } catch (error) {
    console.log(error);
  }
};
