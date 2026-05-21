const pool = require("../db");
const SORT_FIELDS = new Set(["id", "name", "email", "status", "created_at"]);

function safe(field, allowed, fallback) {
  return allowed.has(field) ? field : fallback;
}

async function getUsers({ page = 1, limit = 20, sortBy = "created_at", sortOrder = "desc", search = "", status = "all" }) {
  const values = [];
  const filters = [];

  if (search) {
    values.push(`%${search}%`);
    filters.push(`(name ILIKE $${values.length} OR email ILIKE $${values.length})`);
  }

  if (status === "active") {
    values.push(true);
    filters.push(`status = $${values.length}`);
  } else if (status === "inactive") {
    values.push(false);
    filters.push(`status = $${values.length}`);
  }

  values.push(limit, (page - 1) * limit);
  const query = `
    SELECT id, name, email, status, created_at, COUNT(*) OVER() AS total_count
    FROM users
    ${filters.length ? `WHERE ${filters.join(" AND ")}` : ""}
    ORDER BY ${safe(sortBy, SORT_FIELDS, "created_at")} ${sortOrder === "asc" ? "asc" : "desc"}
    LIMIT $${values.length - 1}
    OFFSET $${values.length}
  `;

  const { rows } = await pool.query(query, values);
  const total = rows[0]?.total_count ? Number(rows[0].total_count) : 0;

  return {
    data: rows.map((row) => ({
      id: row.id,
      name: row.name,
      email: row.email,
      status: row.status,
      createdAt: row.created_at,
    })),
    meta: {
      total,
      page,
      limit,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    },
  };
}

async function updateUserStatus(id, status) {
  const result = await pool.query(
    `UPDATE users SET status = $1 WHERE id = $2 RETURNING id, name, email, status, created_at`,
    [status === "active", id]
  );
  return result.rows[0] || null;
}

module.exports = { getUsers, updateUserStatus };
