import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import BlockRenderer from '../../../components/blog/BlockRenderer';

const BlogPreviewModal = ({ blog, isOpen, onClose }) => {
  if (!blog) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 lg:p-10">
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-4xl max-h-full bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center sticky top-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md z-10">
              <div>
                <h3 className="text-lg font-bold dark:text-white">Admin Preview</h3>
                <p className="text-sm text-slate-500">By {blog.author_name}</p>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                <X size={24} className="dark:text-white" />
              </button>
            </div>

            {/* Scrollable Blog Content */}
            <div className="flex-1 overflow-y-auto p-8 lg:p-12 custom-scrollbar">
              <img src={blog.cover_image} className="w-full h-64 object-cover rounded-2xl mb-10" alt="Cover" />
              <h1 className="text-4xl font-black mb-6 dark:text-white">{blog.title}</h1>
              
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <BlockRenderer blocks={blog.content.blocks} />
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default BlogPreviewModal;
