import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Lock, PenTool, BookOpen } from 'lucide-react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'READER' });
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/register`, formData);
      alert("Registration successful! Please login.");
      navigate('/login');
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-700"
      >
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Create Account</h2>
          <p className="text-slate-500 mt-2">Join our community of thinkers</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-6">
          {/* Role Selection Tabs */}
          <div className="flex bg-slate-100 dark:bg-slate-900 p-1 rounded-xl mb-6">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, role: 'READER' })}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg transition-all ${formData.role === 'READER' ? 'bg-white dark:bg-slate-800 shadow-sm text-indigo-600' : 'text-slate-500'}`}
            >
              <BookOpen size={18} /> Reader
            </button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, role: 'AUTHOR' })}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg transition-all ${formData.role === 'AUTHOR' ? 'bg-white dark:bg-slate-800 shadow-sm text-indigo-600' : 'text-slate-500'}`}
            >
              <PenTool size={18} /> Author
            </button>
          </div>

          <div className="space-y-4">
            <div className="relative">
              <User className="absolute left-3 top-3 text-slate-400" size={20} />
              <input 
                type="text" placeholder="Full Name" 
                autoComplete="name"
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent outline-none focus:ring-2 focus:ring-indigo-500 transition-all dark:text-white"
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
              />
            </div>
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-slate-400" size={20} />
              <input 
                type="email" placeholder="Email Address" 
                autoComplete="email"
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent outline-none focus:ring-2 focus:ring-indigo-500 transition-all dark:text-white"
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-slate-400" size={20} />
              <input 
                type="password" placeholder="Password" 
                autoComplete="new-password"
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent outline-none focus:ring-2 focus:ring-indigo-500 transition-all dark:text-white"
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                required
              />
            </div>
          </div>

          <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-bold shadow-lg shadow-indigo-200 dark:shadow-none transition-all active:scale-95">
            Sign Up
          </button>
        </form>

        <p className="text-center text-slate-500 mt-8">
          Already have an account? <Link to="/login" className="text-indigo-600 font-bold">Login</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;
