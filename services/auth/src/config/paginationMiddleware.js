export default (model, query = {}, options = {}, populateQuery = []) => {
	return async (req, res, next) => {
		try {
			const page = parseInt(req.query.page);
			const limit = parseInt(req.query.limit);
			if (!page || !limit) {
				throw new Error("Please send page and limit as query params.");
			}
			const startIndex = (page - 1) * limit;
			const endIndex = page * limit;
			const data = {};
			endIndex < (await model.countDocuments()) ?
				(data.next = {
					page: page + 1,
					limit,
				}) :
				(data.next = null);

			startIndex > 0 ?
				(data.previous = {
					page: page - 1,
					limit,
				}) :
				(data.previous = null);

			const sortOrder = {
				_id: -1,
			};
			data.result = await model.find(query, options).sort(sortOrder).populate(populateQuery).limit(limit).skip(startIndex);
			if (!(data.result.length > 0)) data.result = [];
			res.paginatedResults = data;
			next();
		} catch (error) {
			res.pagnationError = error.message;
			next();
		}
	};
};