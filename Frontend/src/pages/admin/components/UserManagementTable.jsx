import { useState, useEffect } from 'react';
import { Search, Trash2, ShieldCheck } from 'lucide-react';
import axios from 'axios';

const UserManagementTable = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchUsers();
  }, [searchTerm]);

  const fetchUsers = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await axios.get(`http://localhost:8000/api/admin/users?search=${searchTerm}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(res.data);
    } catch (err) {
      console.error("Failed to fetch users", err);
    }
  };

  const handleUpdateRole = async (id, newRole) => {
    const token = localStorage.getItem('token');
    try {
      await axios.put(`http://localhost:8000/api/admin/update-role/${id}`, { role: newRole }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchUsers();
    } catch (err) {
      console.error("Failed to update user role", err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure? This action cannot be undone.")) {
      const token = localStorage.getItem('token');
      try {
        await axios.delete(`http://localhost:8000/api/admin/users/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchUsers();
      } catch (err) {
        console.error("Failed to delete user", err);
      }
    }
  };

  return (
    <div className="p-6">
      <div className="relative mb-6">
        <Search className="absolute left-3 top-3 text-slate-400" size={18} />
        <input 
          type="text" 
          placeholder="Search users by name or email..." 
          className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 outline-none border border-transparent focus:bg-white dark:focus:bg-slate-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:text-white transition-all shadow-sm"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="text-xs text-slate-400 uppercase font-bold border-b border-slate-100 dark:border-slate-800">
            <tr>
              <th className="px-4 py-3 tracking-wider">User</th>
              <th className="px-4 py-3 tracking-wider">Role</th>
              <th className="px-4 py-3 text-right tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
            {users.length > 0 ? users.map(user => (
              <tr key={user.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                <td className="px-4 py-4">
                  <p className="font-bold text-slate-800 dark:text-white capitalize">{user.name}</p>
                  <p className="text-sm text-slate-500 font-medium">{user.email}</p>
                </td>
                <td className="px-4 py-4">
                  <select 
                    value={user.role}
                    onChange={(e) => handleUpdateRole(user.id, e.target.value)}
                    className="bg-slate-50 dark:bg-slate-800 border-none rounded-lg text-sm font-bold text-slate-600 dark:text-slate-300 py-1 px-2 outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                  >
                    <option value="READER">Reader</option>
                    <option value="AUTHOR">Author</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                </td>
                <td className="px-4 py-4 text-right space-x-3">
                  <button 
                    onClick={() => handleDelete(user.id)}
                    className="p-2 bg-red-50 dark:bg-red-900/20 text-red-500 rounded-lg hover:bg-red-500 hover:text-white dark:hover:bg-red-600 transition-all shadow-sm"
                    title="Delete User"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="3" className="px-4 py-12 text-center text-slate-500 font-medium">
                  No users matched your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagementTable;
