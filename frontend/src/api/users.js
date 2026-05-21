const API_BASE = import.meta.env.VITE_API_BASE || "/api";

function buildUrl(path, params = {}) {
  const url = new URL(`${API_BASE}${path}`, window.location.origin);

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") {
      return;
    }
    url.searchParams.set(key, String(value));
  });

  return url.toString();
}

export async function fetchUsers(filters) {
  const url = buildUrl("/users", filters);
  const response = await fetch(url, { headers: { "Accept": "application/json" } });

  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    throw new Error(payload.message || "Unable to load users");
  }

  return response.json();
}

export async function updateUserStatus(id, status) {
  const response = await fetch(`${API_BASE}/users/${id}/status`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
    body: JSON.stringify({ status }),
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    throw new Error(payload.message || "Unable to update user status");
  }

  return response.json();
}
