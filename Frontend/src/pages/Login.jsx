import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock } from 'lucide-react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { useBlogs } from '../context/BlogContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useBlogs();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/login`, { email, password });
      login(res.data.user, res.data.token);

      // Redirect based on role
      if (res.data.user.role === 'ADMIN') navigate('/admin');
      else navigate('/');
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-700"
      >
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Welcome Back</h2>
          <p className="text-slate-500 mt-2">Pick up where you left off</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <Mail className="absolute left-3 top-3 text-slate-400" size={20} />
            <input 
              type="email" placeholder="Email" 
              autoComplete="email"
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent outline-none focus:ring-2 focus:ring-indigo-500 transition-all dark:text-white"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-3 text-slate-400" size={20} />
            <input 
              type="password" placeholder="Password" 
              autoComplete="current-password"
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent outline-none focus:ring-2 focus:ring-indigo-500 transition-all dark:text-white"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-bold shadow-lg shadow-indigo-200 dark:shadow-none transition-all active:scale-95">
            Login
          </button>
        </form>

        <p className="text-center text-slate-500 mt-8">
          Don&apos;t have an account? <Link to="/register" className="text-indigo-600 font-bold">Sign Up</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
