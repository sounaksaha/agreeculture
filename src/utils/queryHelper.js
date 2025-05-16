export const getQueryOptions = (req, searchField = "name") => {
  const search = req.query.search || "";
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const skip = (page - 1) * limit;

  let searchQuery = {};

  if (search) {
    if (Array.isArray(searchField)) {
      searchQuery = {
        $or: searchField.map((field) => ({
          [field]: { $regex: search, $options: "i" },
        })),
      };
    } else {
      searchQuery = {
        [searchField]: { $regex: search, $options: "i" },
      };
    }
  }

  return { searchQuery, page, limit, skip };
};
