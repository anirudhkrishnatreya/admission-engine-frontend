import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import withAuth from "../utils/withAuth";
import API from "../utils/api";
import { jwtDecode } from "jwt-decode";

function Users() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: 2,
    status: "active",
    phone: "",
    notes: "",
  });

  const [editingId, setEditingId] = useState(null);

  // Check if admin
useEffect(() => {
  const token = localStorage.getItem("token");

  if (!token) {
    window.location.href = "/";
    return;
  }

  try {
    const decoded = jwtDecode(token);
    console.log("Decoded Token:", decoded);

  } catch (err) {
    console.log("Invalid token");
    localStorage.removeItem("token");
    window.location.href = "/";
  }
}, []);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const res = await API.get("/users");
    setUsers(res.data);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      if (editingId) {
        await API.put(`/users/${editingId}`, form);
      } else {
        await API.post("/users", form);
      }

      setForm({
        name: "",
        email: "",
        password: "",
        role: 2,
        status: "active",
        phone: "",
        notes: "",
      });

      setEditingId(null);
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || "Error");
    }
  };

  const handleEdit = (user) => {
    setForm({
      name: user.name,
      email: user.email,
      password: "",
      role: user.role,
      status: user.status,
      phone: user.phone || "",
      notes: user.notes || "",
    });
    setEditingId(user._id);
  };

  const handleDisable = async (id) => {
    await API.delete(`/users/${id}`);
    fetchUsers();
  };

  const roleLabel = (role) => {
    if (role === 0) return "Admin";
    if (role === 1) return "Moderator";
    return "Sales";
  };

  const roleBadge = (role) => {
    if (role === 0) return "bg-red-100 text-red-600";
    if (role === 1) return "bg-yellow-100 text-yellow-600";
    return "bg-blue-100 text-blue-600";
  };

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-8">Users Management</h1>

      {/* Form Card */}
      <div className="bg-white p-8 rounded-2xl shadow mb-10">
        <h2 className="text-xl font-semibold mb-6">
          {editingId ? "Edit User" : "Add New User"}
        </h2>

        <div className="grid grid-cols-2 gap-6">
          <input
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            className="p-3 border rounded-lg"
          />

          <input
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="p-3 border rounded-lg"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="p-3 border rounded-lg"
          />

          <input
            name="phone"
            placeholder="Phone"
            value={form.phone}
            onChange={handleChange}
            className="p-3 border rounded-lg"
          />

          <select
            name="role"
            value={form.role}
            onChange={(e) =>
              setForm({ ...form, role: Number(e.target.value) })
            }
            className="p-3 border rounded-lg"
          >
            <option value={0}>Admin</option>
            <option value={1}>Moderator</option>
            <option value={2}>Sales</option>
          </select>

          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="p-3 border rounded-lg"
          >
            <option value="active">Active</option>
            <option value="disabled">Disabled</option>
          </select>

          <textarea
            name="notes"
            placeholder="Internal Notes"
            value={form.notes}
            onChange={handleChange}
            className="p-3 border rounded-lg col-span-2"
          />
        </div>

        <button
          onClick={handleSubmit}
          className="mt-6 bg-primary text-white px-6 py-3 rounded-xl hover:opacity-90"
        >
          {editingId ? "Update User" : "Add User"}
        </button>
      </div>

      {/* Users Table */}
      <div className="bg-white p-8 rounded-2xl shadow">
        <h2 className="text-xl font-semibold mb-6">Users List</h2>

        <table className="w-full text-left">
          <thead>
            <tr className="border-b text-gray-500">
              <th className="pb-3">Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="border-b hover:bg-gray-50">
                <td className="py-3">{user.name}</td>
                <td>{user.email}</td>

                <td>
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${roleBadge(
                      user.role
                    )}`}
                  >
                    {roleLabel(user.role)}
                  </span>
                </td>

                <td>{user.status}</td>

                <td className="space-x-3">
                  <button
                    onClick={() => handleEdit(user)}
                    className="text-blue-600"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDisable(user._id)}
                    className="text-red-600"
                  >
                    Disable
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}

export default withAuth(Users);