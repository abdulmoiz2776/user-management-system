const { query, param, body, validationResult } = require("express-validator");

const validate = (rules) => [
  ...rules,
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: "Invalid request", errors: errors.array() });
    }
    next();
  },
];

const ALLOWED_SORT_FIELDS = ["id", "name", "email", "status", "created_at"];
const ALLOWED_STATUS = ["all", "active", "inactive"];
const ALLOWED_SORT_ORDER = ["asc", "desc"];

const validatePagination = validate([
  query("page").optional().isInt({ min: 1 }).toInt(),
  query("limit").optional().isInt({ min: 1, max: 100 }).toInt(),
  query("sortBy").optional().isIn(ALLOWED_SORT_FIELDS),
  query("sortOrder").optional().isIn(ALLOWED_SORT_ORDER),
  query("status").optional().isIn(ALLOWED_STATUS),
  query("search").optional().trim().escape(),
]);

const validateStatusUpdate = validate([
  param("id").exists().isInt({ min: 1 }).toInt(),
  body("status").exists().isIn(["active", "inactive"]),
]);

module.exports = { validatePagination, validateStatusUpdate };
