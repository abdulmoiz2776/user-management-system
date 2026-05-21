const express = require("express");
const { getUsers, updateUserStatus } = require("../controllers/userController");
const { validatePagination, validateStatusUpdate } = require("../middleware/validate");

const router = express.Router();

router.get("/", validatePagination, getUsers);
router.put("/:id/status", validateStatusUpdate, updateUserStatus);

module.exports = router;
