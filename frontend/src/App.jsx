import { useEffect, useState } from "react";
import { fetchUsers, updateUserStatus } from "./api/users";
import PaginationControls from "./components/PaginationControls";
import UserTable from "./components/UserTable";
import "./App.css";

const PAGE_SIZE_OPTIONS = [20, 50, 100];

function App() {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("created_at");
  const [sortOrder, setSortOrder] = useState("desc");
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [pendingStatus, setPendingStatus] = useState({});

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search.trim()), 300);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, statusFilter, limit]);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError("");
      try {
        const result = await fetchUsers({
          page,
          limit,
          sortBy,
          sortOrder,
          search: debouncedSearch,
          status: statusFilter,
        });
        setUsers(result.data);
        setTotalPages(result.meta.totalPages);
        setTotalRecords(result.meta.total);
      } catch (err) {
        setError(err.message || "Unable to load users");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [page, limit, sortBy, sortOrder, debouncedSearch, statusFilter]);

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  const handleStatusToggle = async (id, currentStatus) => {
    const nextStatus = currentStatus ? "inactive" : "active";
    setPendingStatus((prev) => ({ ...prev, [id]: true }));
    setUsers((prev) => prev.map((user) => (user.id === id ? { ...user, status: !currentStatus } : user)));

    try {
      const response = await updateUserStatus(id, nextStatus);
      setUsers((prev) => prev.map((user) => (user.id === id ? { ...user, status: response.data.status } : user)));
    } catch (err) {
      setError(err.message || "Unable to update status");
      setUsers((prev) => prev.map((user) => (user.id === id ? { ...user, status: currentStatus } : user)));
    } finally {
      setPendingStatus((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
    }
  };

  const statusLabel = statusFilter === "active" ? "Active users" : statusFilter === "inactive" ? "Inactive users" : "All users";

  return (
    <main className="app-shell">
      <section className="hero-card">
        <div>
          <h1>User Management</h1>
          <p>Server-side pagination, filtering, sorting, and status control for large datasets.</p>
        </div>
        <div className="summary-card">
          <span>{statusLabel}</span>
          <strong>{totalRecords.toLocaleString()} records</strong>
        </div>
      </section>

      <section className="controls-panel">
        <div className="control-field">
          <label htmlFor="search">Search</label>
          <input id="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search name or email" />
        </div>

        <div className="control-field">
          <label htmlFor="status">Status</label>
          <select id="status" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
            <option value="all">All</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        <div className="control-field">
          <label htmlFor="pageSize">Rows</label>
          <select id="pageSize" value={limit} onChange={(event) => setLimit(Number(event.target.value))}>
            {PAGE_SIZE_OPTIONS.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>
      </section>

      {error && <div className="alert error">{error}</div>}

      <section className="table-panel">
        <UserTable users={users} sortBy={sortBy} sortOrder={sortOrder} onSort={handleSort} onToggleStatus={handleStatusToggle} pendingStatus={pendingStatus} />
      </section>

      <section className="pagination-panel">
        <PaginationControls page={page} totalPages={totalPages} onPageChange={setPage} />
        <div className="page-meta">{loading ? "Loading page..." : `Page ${page} of ${totalPages}`}</div>
      </section>
    </main>
  );
}

export default App;
