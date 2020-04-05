export default (model, options = {}) => {
  return async (req, res, next) => {
    try {
      const page = parseInt(req.query.page);
      const limit = parseInt(req.query.limit);
      if (!page || !limit) {
        throw new Error("Please send page and limt as query params.");
      }
      const startIndex = (page - 1) * limit;
      const endIndex = page * limit;
      const data = {}
      if (endIndex < await model.countDocuments().exec()) {
        data.next = {
          page: page + 1,
          limit
        };
      }
      if (startIndex > 0) {
        data.previous = {
          page: page - 1,
          limit
        };
      }
      data.result = await model.find({}, options).limit(limit).skip(startIndex).exec();
      if (data.result.length > 0) {
        res.paginatedResults = data;
      }
      next();
    } catch (error) {
      //console.log(error.message);
      res.pagnationError = error.message;
      next();
    }
  }
}