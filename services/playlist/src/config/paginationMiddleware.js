export default (model, query = {}, options = {}, populateQuery = []) => {
	return async (req, res, next) => {
		try {
			const page = parseInt(req.query.page);
			const limit = parseInt(req.query.limit);
			const type = req.query.type; // popular/latest/all
			if (!page || !limit) {
				throw new Error("Please send page and limit as query params.");
			}
			if (type !== undefined && !(type === "popular" || type === "latest")) {
				throw new Error("Inavalid type => use either popular or latest type.");
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

			if (type === "latest") {
				const sortOrder = {
					_id: -1,
				};
				data.result = await model.find(query, options).sort(sortOrder).populate(populateQuery).limit(limit).skip(startIndex).lean();
			} else if (type === "popular") {
				const sortOrder = {
					popularityCount: -1,
				};
				data.result = await model.find(query, options).sort(sortOrder).populate(populateQuery).limit(limit).skip(startIndex).lean();
			} else {
				if (req.findQuery) {
					query = req.findQuery;
				} else if (req.scopedAlbums) {
					query = req.scopedAlbums
				}
				data.result = await model.find(query, options).populate(populateQuery).limit(limit).skip(startIndex).lean();
			}
			if (!(data.result.length > 0)) data.result = [];
			res.paginatedResults = data;
			return next();
		} catch (error) {
			res.pagnationError = error.message;
			return next();
		}
	};
};