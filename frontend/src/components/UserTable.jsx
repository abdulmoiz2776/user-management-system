import React from "react";
import "../App.css";

const headers = [
  { key: "name", label: "Name" },
  { key: "email", label: "Email" },
  { key: "status", label: "Status" },
  { key: "created_at", label: "Created" },
  { key: "actions", label: "Actions" },
];

function UserTable({ users, sortBy, sortOrder, onSort, onToggleStatus, pendingStatus }) {
  function renderSortArrow(column) {
    if (sortBy !== column) return null;
    return sortOrder === "asc" ? " ▲" : " ▼";
  }

  return (
    <div className="table-wrapper">
      <table className="user-table">
        <thead>
          <tr>
            {headers.map((header) => (
              <th
                key={header.key}
                className={header.key !== "actions" ? "sortable" : ""}
                onClick={() => header.key !== "actions" && onSort(header.key)}
              >
                {header.label}
                {renderSortArrow(header.key)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {users.length === 0 ? (
            <tr>
              <td colSpan={headers.length} className="empty-row">
                No users match the current filters.
              </td>
            </tr>
          ) : (
            users.map((user) => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <span className={user.status ? "status-pill active" : "status-pill inactive"}>
                    {user.status ? "Active" : "Inactive"}
                  </span>
                </td>
                <td>{new Date(user.createdAt).toLocaleString()}</td>
                <td>
                  <button
                    className="status-toggle"
                    onClick={() => onToggleStatus(user.id, user.status)}
                    disabled={Boolean(pendingStatus[user.id])}
                  >
                    {pendingStatus[user.id] ? "Saving..." : user.status ? "Deactivate" : "Activate"}
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default UserTable;
