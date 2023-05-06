function getPagination(query) {
  const page = Math.abs(query.page) || 1;
  const limit = Math.abs(query.limit) || 0; //if limit is 0 all the document will be returned in the page
  const skip = (page - 1) * limit;
  return { skip, limit };
}

module.exports = {
  getPagination,
};
