const userService = require("../services/userService");

async function getUsers(req, res, next) {
  try {
    const { page = 1, limit = 20, sortBy = "created_at", sortOrder = "desc", search = "", status = "all" } = req.query;
    const pagination = await userService.getUsers({
      page: Number(page),
      limit: Number(limit),
      sortBy,
      sortOrder,
      search: search.trim(),
      status,
    });
    res.json(pagination);
  } catch (error) {
    next(error);
  }
}

async function updateUserStatus(req, res, next) {
  try {
    const user = await userService.updateUserStatus(Number(req.params.id), req.body.status);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ data: user });
  } catch (error) {
    next(error);
  }
}

module.exports = { getUsers, updateUserStatus };
