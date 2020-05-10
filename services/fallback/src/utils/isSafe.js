export default (func, defaultVal = null) => {
	try {
		return func();
	} catch (e) {
		return defaultVal;
	}
};
