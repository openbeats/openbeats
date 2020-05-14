export default (properyName, urlPram, selector = null) => {
  return (req, res, next) => {
    let findQuery = {};
    if (!selector) {
      findQuery[properyName] = req.params[urlPram];
    } else {
      let selectorsQuery = {};
      selectorsQuery[selector] = req.params[urlPram];
      findQuery[properyName] = selectorsQuery;
    }
    req.findQuery = findQuery;
    return next();
  }
}