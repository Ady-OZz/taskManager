import { useState, useEffect } from "react";
import { fetchUsers, updateUserRole } from "../api/users";
import { formatDate } from "../utils/dateHelpers";

const TeamMembers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadUsers = async () => {
    try {
      const res = await fetchUsers();
      setUsers(res.data.users);
    } catch (err) {
      setError(err.response?.data?.error?.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadUsers(); }, []);

  const handleRoleChange = async (userId, newRole) => {
    try {
      await updateUserRole(userId, newRole);
      loadUsers();
    } catch { /* handled */ }
  };

  if (loading) return <div className="text-sm text-text-secondary">Loading...</div>;
  if (error) return <div className="text-sm text-danger">{error}</div>;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-border overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-page">
              <th className="text-left px-5 py-3 text-xs font-medium text-text-secondary uppercase tracking-wider">Name</th>
              <th className="text-left px-5 py-3 text-xs font-medium text-text-secondary uppercase tracking-wider">Email</th>
              <th className="text-left px-5 py-3 text-xs font-medium text-text-secondary uppercase tracking-wider">Role</th>
              <th className="text-left px-5 py-3 text-xs font-medium text-text-secondary uppercase tracking-wider">Joined</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="border-b border-border last:border-0" id={`team-row-${user._id}`}>
                <td className="px-5 py-3 text-sm text-text-primary">{user.displayName}</td>
                <td className="px-5 py-3 text-sm text-text-secondary">{user.email}</td>
                <td className="px-5 py-3">
                  <select value={user.role} onChange={(e) => handleRoleChange(user._id, e.target.value)}
                    className="h-8 border border-border rounded-md px-2 text-xs focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                    id={`role-select-${user._id}`}>
                    <option value="admin">Admin</option>
                    <option value="member">Member</option>
                  </select>
                </td>
                <td className="px-5 py-3 text-sm text-text-secondary">{formatDate(user.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TeamMembers;
