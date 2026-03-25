import { useState, useEffect } from "react";
import axios from "axios";

const AuthorApprovalTable = () => {
  const [authors, setAuthors] = useState([]);

  useEffect(() => {
    loadPending();
  }, []);

  const loadPending = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await axios.get('http://localhost:8000/api/admin/pending-authors', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAuthors(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleApprove = async (id) => {
    const token = localStorage.getItem('token');
    try {
      await axios.put(`http://localhost:8000/api/admin/approve-author/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      loadPending(); // Refresh list
    } catch (err) {
      console.error(err);
    }
  };

  if (authors.length === 0) {
    return <div className="p-20 text-center text-slate-500 font-medium">No pending authors awaiting approval.</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
          <tr>
            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Author Name</th>
            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Email</th>
            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
          {authors.map(author => (
            <tr key={author.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
              <td className="px-6 py-4 font-bold text-slate-800 dark:text-white capitalize">{author.name}</td>
              <td className="px-6 py-4 text-slate-500 text-sm font-medium">{author.email}</td>
              <td className="px-6 py-4">
                <button 
                  onClick={() => handleApprove(author.id)}
                  className="bg-emerald-50 text-emerald-600 px-4 py-2 rounded-lg text-sm font-bold hover:bg-emerald-500 hover:text-white transition-all shadow-sm"
                >
                  Approve
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AuthorApprovalTable;
