import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Sun, Moon } from "lucide-react";
import { useBlogs } from "../../context/BlogContext";

const Navbar = ({ onSubscribeClick }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { darkMode, toggleDarkMode, user, logout } = useBlogs();
  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
            ModernBlog
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-slate-600 dark:text-slate-300 hover:text-indigo-600 transition-colors font-medium">Home</Link>
            <Link to="/blogs" className="text-slate-600 dark:text-slate-300 hover:text-indigo-600 transition-colors font-medium">Archive</Link>
            <Link to="/library" className="text-slate-600 dark:text-slate-300 hover:text-indigo-600 transition-colors font-medium">
              Library
            </Link>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-4">
            {/* Theme Toggle Button */}
            <button 
              onClick={toggleDarkMode}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-yellow-400 hover:ring-2 ring-indigo-500 transition-all"
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            
            {/* Desktop Auth Area */}
            {!user ? (
              <>
                <Link to="/login" className="hidden md:block text-slate-600 dark:text-slate-300 hover:text-indigo-600 font-medium transition-colors">Login</Link>
                <Link to="/register" className="hidden md:block bg-indigo-600 text-white px-5 py-2.5 rounded-full font-semibold hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-200 transition-all active:scale-95">Join</Link>
              </>
            ) : (
              <div className="hidden md:flex items-center gap-4">
                {user.role === 'ADMIN' && (
                  <Link to="/admin" className="text-indigo-600 font-bold border-r border-slate-300 dark:border-slate-600 pr-4">Admin Panel</Link>
                )}
                {(user.role === 'AUTHOR' && user.status === 'APPROVED') && (
                  <Link to="/create-post" className="text-emerald-600 font-bold border-r border-slate-300 dark:border-slate-600 pr-4">Write Post</Link>
                )}
                {user.status === 'PENDING' && (
                  <span className="text-amber-500 text-xs font-medium italic">Approval Pending...</span>
                )}
                <span className="text-slate-900 dark:text-white font-medium">Hi, {user.name}</span>
                <button onClick={logout} className="text-red-500 text-sm hover:text-red-700 font-medium transition-colors">Logout</button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden text-slate-600 dark:text-slate-300 hover:text-indigo-600 focus:outline-none"
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 flex flex-col space-y-4">
              <Link 
                to="/" 
                onClick={() => setIsOpen(false)}
                className="text-slate-600 dark:text-slate-300 hover:text-indigo-600 font-medium text-lg"
              >
                Home
              </Link>
              <Link 
                to="/blogs" 
                onClick={() => setIsOpen(false)}
                className="text-slate-600 dark:text-slate-300 hover:text-indigo-600 font-medium text-lg"
              >
                Archive
              </Link>
              <Link 
                to="/library" 
                onClick={() => setIsOpen(false)}
                className="text-slate-600 dark:text-slate-300 hover:text-indigo-600 font-medium text-lg"
              >
                Library
              </Link>
              {/* Mobile Auth Area */}
              {!user ? (
                <>
                  <Link to="/login" onClick={() => setIsOpen(false)} className="text-slate-600 dark:text-slate-300 hover:text-indigo-600 font-medium text-lg">Login</Link>
                  <Link to="/register" onClick={() => setIsOpen(false)} className="bg-indigo-600 text-white px-5 py-3 rounded-xl font-bold w-full text-center">Join</Link>
                </>
              ) : (
                <div className="flex flex-col gap-3 pt-2 border-t border-slate-200 dark:border-slate-700">
                  {user.role === 'ADMIN' && (
                    <Link to="/admin" onClick={() => setIsOpen(false)} className="text-indigo-600 font-bold">Admin Panel</Link>
                  )}
                  {(user.role === 'AUTHOR' && user.status === 'APPROVED') && (
                    <Link to="/create-post" onClick={() => setIsOpen(false)} className="text-emerald-600 font-bold">Write Post</Link>
                  )}
                  {user.status === 'PENDING' && (
                    <span className="text-amber-500 text-xs font-medium italic">Approval Pending...</span>
                  )}
                  <span className="text-slate-900 dark:text-white font-medium">Hi, {user.name}</span>
                  <button onClick={() => { logout(); setIsOpen(false); }} className="text-red-500 text-sm font-medium text-left">Logout</button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;