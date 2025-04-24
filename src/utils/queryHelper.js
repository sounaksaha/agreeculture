export const getQueryOptions = (req, searchField = 'name') => {
    const search = req.query.search || '';
    const page = parseInt(req.query.page, 10) || 1;
    const limit = 10; // 🔒 Fixed limit
    const skip = (page - 1) * limit;
  
    const searchQuery = search
      ? { [searchField]: { $regex: search, $options: 'i' } }
      : {};
  
    return { searchQuery, page, limit, skip };
  };
  