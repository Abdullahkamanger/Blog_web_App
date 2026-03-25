import { useState, useEffect } from 'react';
import { Users, FileText, CheckCircle, ShieldAlert, TrendingUp } from 'lucide-react';
import axios from 'axios';
import AuthorApprovalTable from './components/AuthorApprovalTable';
import UserManagementTable from './components/UserManagementTable';
import BlogManagementHub from './components/BlogManagementHub';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ users: 0, pending: 0, blogs: 0 });
  const [activeTab, setActiveTab] = useState('approvals');

  // Fetch quick stats for the dashboard header
  useEffect(() => {
    const fetchStats = async () => {
      const token = localStorage.getItem('token');
      try {
        const res = await axios.get('http://localhost:8000/api/admin/stats', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStats(res.data);
      } catch (error) {
        console.error("Failed to fetch admin stats", error);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* --- 1. HEADER STATS --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <StatCard title="Total Users" value={stats.users} icon={<Users className="text-blue-500" />} />
          <StatCard title="Pending Authors" value={stats.pending} icon={<ShieldAlert className="text-amber-500" />} />
          <StatCard title="Total Blogs" value={stats.blogs} icon={<FileText className="text-indigo-500" />} />
        </div>

        {/* --- 2. TABS NAVIGATION --- */}
        <div className="flex gap-4 mb-8 bg-white dark:bg-slate-900 p-2 rounded-2xl w-fit shadow-sm border border-slate-100 dark:border-slate-800">
          <TabBtn active={activeTab === 'approvals'} onClick={() => setActiveTab('approvals')} label="Approvals" />
          <TabBtn active={activeTab === 'users'} onClick={() => setActiveTab('users')} label="User Control" />
          <TabBtn active={activeTab === 'blogs'} onClick={() => setActiveTab('blogs')} label="Blog Management" />
        </div>

        {/* --- 3. DYNAMIC CONTENT --- */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
          {activeTab === 'approvals' && <AuthorApprovalTable />}
          {activeTab === 'users' && <UserManagementTable />}
          {activeTab === 'blogs' && <BlogManagementHub />}
        </div>
      </div>
    </div>
  );
};

// UI Components
const StatCard = ({ title, value, icon }) => (
  <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center justify-between transition-transform hover:-translate-y-1 duration-300">
    <div>
      <p className="text-slate-500 text-sm font-medium">{title}</p>
      <h3 className="text-3xl font-black mt-1 dark:text-white">{value}</h3>
    </div>
    <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl shadow-inner">{icon}</div>
  </div>
);

const TabBtn = ({ active, onClick, label }) => (
  <button 
    onClick={onClick}
    className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${active ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
  >
    {label}
  </button>
);

export default AdminDashboard;
