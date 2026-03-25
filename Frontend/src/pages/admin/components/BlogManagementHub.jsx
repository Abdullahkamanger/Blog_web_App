import { useState, useEffect } from 'react';
import { LayoutGrid, List, Trash2, Eye, CheckCircle, XCircle } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import axios from 'axios';
import BlogPreviewModal from './BlogPreviewModal';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-slate-900 p-4 border border-slate-100 dark:border-slate-800 shadow-2xl rounded-2xl">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{label}</p>
        <p className="text-xl font-black text-indigo-600">{payload[0].value} Blogs</p>
      </div>
    );
  }
  return null;
};

const BlogManagementHub = () => {
  const [view, setView] = useState('table'); // 'table' or 'chart'
  const [blogs, setBlogs] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [previewBlog, setPreviewBlog] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  useEffect(() => {
    fetchBlogs();
    fetchChartData();
  }, []);

  const fetchBlogs = async () => {
    const token = localStorage.getItem('token');
    const res = await axios.get('http://localhost:8000/api/admin/all-blogs', {
      headers: { Authorization: `Bearer ${token}` }
    });
    setBlogs(res.data);
  };

  const fetchChartData = async () => {
    const token = localStorage.getItem('token');
    const res = await axios.get('http://localhost:8000/api/admin/blog-stats-chart', {
      headers: { Authorization: `Bearer ${token}` }
    });
    setChartData(res.data);
  };

  const handlePreview = async (id) => {
    const token = localStorage.getItem('token');
    const res = await axios.get(`http://localhost:8000/api/admin/blog-preview/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setPreviewBlog(res.data);
    setIsPreviewOpen(true);
  };

  const togglePublish = async (id, currentStatus) => {
    const token = localStorage.getItem('token');
    await axios.put(`http://localhost:8000/api/admin/toggle-publish/${id}`, { status: !currentStatus }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    fetchBlogs();
  };

  return (
    <div className="p-6">
      {/* --- TOP HEADER WITH TOGGLE BUTTONS --- */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-xl font-bold dark:text-white">Content Inventory</h2>
        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
          <button 
            onClick={() => setView('table')}
            className={`p-2 rounded-lg transition-all ${view === 'table' ? 'bg-white dark:bg-slate-700 shadow-sm text-indigo-600' : 'text-slate-400'}`}
          >
            <List size={20} />
          </button>
          <button 
            onClick={() => setView('chart')}
            className={`p-2 rounded-lg transition-all ${view === 'chart' ? 'bg-white dark:bg-slate-700 shadow-sm text-indigo-600' : 'text-slate-400'}`}
          >
            <LayoutGrid size={20} />
          </button>
        </div>
      </div>

      {/* --- CONDITIONAL RENDERING --- */}
      {view === 'chart' ? (
        <div className="h-[350px] w-full bg-slate-50 dark:bg-slate-800/20 p-4 rounded-3xl border border-dashed border-slate-200 dark:border-slate-700">
           <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.1} />
              <XAxis 
                dataKey="date" 
                tickFormatter={(str) => {
                  const date = new Date(str);
                  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                }}
                stroke="#94a3b8" 
                fontSize={12} 
                tickLine={false} 
                axisLine={false} 
                dy={10}
                interval={0}
              />
              <YAxis 
                stroke="#94a3b8" 
                fontSize={12} 
                tickLine={false} 
                axisLine={false} 
                allowDecimals={false}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#6366f1', strokeWidth: 2 }} />
              <Area 
                type="monotone" 
                dataKey="count" 
                stroke="#6366f1" 
                strokeWidth={4} 
                fillOpacity={1} 
                fill="url(#colorCount)" 
                animationDuration={1500}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
             <thead className="text-xs text-slate-400 uppercase font-bold border-b border-slate-100 dark:border-slate-800">
              <tr>
                <th className="px-4 py-3">Article</th>
                <th className="px-4 py-3">Author</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
              {blogs.map(blog => (
                <tr key={blog.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                  <td className="px-4 py-4 max-w-xs truncate font-semibold dark:text-white">{blog.title}</td>
                  <td className="px-4 py-4 text-slate-500 text-sm">{blog.author}</td>
                  <td className="px-4 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${blog.is_published ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>
                      {blog.is_published ? 'Live' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-right space-x-2">
                    <button onClick={() => togglePublish(blog.id, blog.is_published)} className="p-2 text-slate-400 hover:text-indigo-600 transition-colors">
                      {blog.is_published ? <XCircle size={18} title="Unpublish" /> : <CheckCircle size={18} title="Publish" />}
                    </button>
                    <button onClick={() => handlePreview(blog.id)} className="p-2 text-slate-400 hover:text-blue-500 transition-colors"><Eye size={18} /></button>
                    <button className="p-2 text-slate-400 hover:text-red-500 transition-colors"><Trash2 size={18} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* The Modal Component */}
      <BlogPreviewModal 
        blog={previewBlog} 
        isOpen={isPreviewOpen} 
        onClose={() => setIsPreviewOpen(false)} 
      />
    </div>
  );
};

export default BlogManagementHub;
