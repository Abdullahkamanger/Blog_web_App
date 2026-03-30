import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Heart, Bookmark, ArrowRight, ThumbsDown } from "lucide-react"; // Optional: lucide-react for icons
import { useBlogs } from "../../context/BlogContext";

const BlogCard = ({ blog, searchQuery = "" }) => {
  const { likedIds, savedIds, dislikedIds, toggleLike, toggleSave, toggleDislike } = useBlogs();
  const isLiked = likedIds.includes(blog.id);
  const isSaved = savedIds.includes(blog.id);
  const isDisliked = dislikedIds.includes(blog.id);

  const highlightText = (text, query) => {
    if (!query || !text) return text;
    const parts = (text?.split(new RegExp(`(${query})`, "gi"))) || [];
    return parts.map((part, i) => 
      (part?.toLowerCase?.() || '') === (query?.toLowerCase?.() || '') 
        ? <span key={i} className="bg-yellow-200 dark:bg-yellow-800 text-slate-900 dark:text-white rounded-sm px-1">{part}</span> 
        : part
    );
  };

  const calculateReadingTime = (text) => {
    if (!text) return "1 min read";
    const wpm = 225;
    const words = text.trim().split(/\s+/).length;
    const time = Math.ceil(words / wpm);
    return `${time} min read`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -8 }}
      className="group bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-xl transition-all duration-300"
    >
      {/* Image Container */}
      <div className="relative h-52 overflow-hidden">
        <motion.img
          layoutId={`img-${blog.id}`}
          src={blog.image}
          alt={blog.title}
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-4 left-4">
          <span className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
            {blog.category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <p className="text-slate-400 dark:text-slate-500 text-sm mb-2">
          {blog.date} • {calculateReadingTime(blog.content || blog.description)}
        </p>
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
          {highlightText(blog.title, searchQuery)}
        </h3>
        <p className="text-slate-600 dark:text-slate-300 line-clamp-2 mb-6">{blog.description}</p>

        {/* Action Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-50 dark:border-slate-700">
          <Link
            to={`/blog/${blog.id}`}
            className="flex items-center text-sm font-bold text-indigo-600 hover:gap-2 transition-all"
          >
            Read More <ArrowRight size={16} className="ml-1" />
          </Link>

         <div className="flex gap-4 text-slate-400 items-center">
            {/* Likes */}
            <div className="flex items-center gap-1.5">
              <button 
                onClick={(e) => { e.preventDefault(); toggleLike(blog.id); }}
                className={`transition-colors ${isLiked ? "text-red-500" : "hover:text-red-500"}`}
              >
                <Heart size={18} fill={isLiked ? "currentColor" : "none"} />
              </button>
              <span className="text-xs font-semibold">{blog.likes}</span>
            </div>

            {/* Dislikes */}
            <div className="flex items-center gap-1.5">
              <button 
                onClick={(e) => { e.preventDefault(); toggleDislike(blog.id); }}
                className={`transition-colors ${isDisliked ? "text-slate-800" : "hover:text-slate-800"}`}
              >
                <ThumbsDown size={18} fill={isDisliked ? "currentColor" : "none"} />
              </button>
              <span className="text-xs font-semibold">{blog.dislikes}</span>
            </div>

            {/* Saves */}
            <div className="flex items-center gap-1.5">
              <button 
                onClick={(e) => { e.preventDefault(); toggleSave(blog.id); }}
                className={`transition-colors ${isSaved ? "text-indigo-600" : "hover:text-indigo-600"}`}
              >
                <Bookmark size={18} fill={isSaved ? "currentColor" : "none"} />
              </button>
              <span className="text-xs font-semibold">{blog.saves}</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default BlogCard;
