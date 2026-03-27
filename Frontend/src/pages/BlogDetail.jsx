import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, useScroll, useSpring, AnimatePresence, useTransform } from "framer-motion";
import { Heart, ThumbsDown, Bookmark, ArrowLeft, Share2, Check } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { mockBlogs } from "../data/mockBlogs";
import { useBlogs } from "../context/BlogContext";
import CommentSection from "../components/blog/CommentSection";
import BlockRenderer from "../components/blog/BlockRenderer";

const BlogDetail = () => {
  const [copied, setCopied] = useState(false);
  const { id } = useParams();
  const blogId = parseInt(id); // Ensure ID is a number
  const {
    blogs, // Add this to get reactive state
    likedIds,
    savedIds,
    dislikedIds,
    toggleLike,
    toggleSave,
    toggleDislike,
  } = useBlogs();

  // Check if THIS specific blog is in the global arrays
  const isLiked = likedIds.includes(blogId);
  const isSaved = savedIds.includes(blogId);
  const isDisliked = dislikedIds.includes(blogId);

  const navigate = useNavigate();

  // Instantly reset scroll position when navigating to a new blog
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [blogId]);

  // Find the blog that matches the ID in the URL from the REACTIVE state
  const blog = blogs.find((b) => b.id === blogId);

  if (!blog) return <div className="text-center py-20">Blog not found.</div>;

  // LOGIC: Find up to 3 blogs in the same category, excluding the current one
  const relatedBlogs = blogs
    .filter((b) => b.category === blog.category && b.id !== blogId)
    .slice(0, 3);

  // Logic to track scroll progress and parallax
  const { scrollYProgress, scrollY } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  // Parallax transform: over 500px of scroll, move image down by 150px
  const y = useTransform(scrollY, [0, 500], [0, 150]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); // Reset after 2s
  };

  const calculateReadingTime = (text) => {
    if (!text) return "1 min read";
    const wpm = 225; // Average reading speed
    const words = text.trim().split(/\s+/).length;
    const time = Math.ceil(words / wpm);
    return `${time} min read`;
  };

  return (
    <>
      <Helmet>
        <title>{blog.title} | ModernBlog</title>
        <meta name="description" content={blog.description} />
      </Helmet>

      {/* Animated Reading Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1.5 bg-indigo-600 origin-left z-100"
        style={{ scaleX }}
      />

      <motion.article
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-4xl mx-auto px-4"
      >
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 mb-8 transition-colors group"
        >
          <ArrowLeft
            size={20}
            className="mr-2 group-hover:-translate-x-1 transition-transform"
          />
          Back to articles
        </button>

        {/* Hero Image with Parallax */}
        <div className="relative h-[400px] w-full overflow-hidden rounded-3xl mb-10 shadow-2xl">
          <motion.img
            layoutId={`img-${blog.id}`}
            src={blog.image}
            alt={blog.title}
            style={{ y }}
            className="absolute top-0 w-full h-[120%] object-cover"
          />
        </div>

        {/* Content Header */}
        <div className="space-y-4 mb-10">
          <span className="text-indigo-600 dark:text-indigo-400 font-bold uppercase tracking-widest text-sm">
            {blog.category}
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 dark:text-white leading-tight">
            {blog.title}
          </h1>
          <div className="flex items-center gap-4 text-slate-500 dark:text-slate-400 italic">
            <span>By {blog.author?.name || "Alex Rivera"}</span>
            <span>•</span>
            <span>{blog.date}</span>
            <span>•</span>
            <span>{calculateReadingTime(blog.content || blog.description)}</span>
          </div>
        </div>

        {/* Blog Body */}
        <div className="prose prose-lg dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 leading-relaxed mb-12">
          {blog.content ? (
            (() => {
              try {
                const contentObj = typeof blog.content === 'string' ? JSON.parse(blog.content) : blog.content;
                if (contentObj && contentObj.blocks) {
                  return <BlockRenderer blocks={contentObj.blocks} />;
                }
              } catch (e) {
                // Fallback to HTML
              }
              return <div dangerouslySetInnerHTML={{ __html: blog.content }} />;
            })()
          ) : (
            <>
              <p>{blog.description}</p>
              <p className="mt-6">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
                ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                aliquip ex ea commodo consequat.
              </p>
              <p className="mt-6">
                Duis aute irure dolor in reprehenderit in voluptate velit esse
                cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
                cupidatat non proident, sunt in culpa qui officia deserunt mollit
                anim id est laborum.
              </p>
            </>
          )}
        </div>

        {/* --- AUTHOR BIO SECTION --- */}
        <div className="my-16 p-8 bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm flex flex-col md:flex-row items-center gap-6 transition-colors">
          <img 
            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${blog.author?.seed || 'Felix'}`} 
            alt="Author" 
            className="w-24 h-24 rounded-2xl bg-indigo-100 p-2"
          />
          <div className="text-center md:text-left">
            <h4 className="text-xl font-bold text-slate-900 dark:text-white">
              {blog.author?.name || "Alex Rivera"}
            </h4>
            <p className="text-indigo-600 dark:text-indigo-400 font-medium mb-2">
              {blog.author?.role || "Senior Tech Architect"}
            </p>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed max-w-xl">
              {blog.author?.description || "Alex has been building for the web since 2015, specializing in React ecosystems and minimalist design systems."}
            </p>
            <div className="flex justify-center md:justify-start gap-4 mt-4">
              <button className="text-sm font-bold text-slate-400 hover:text-indigo-600 transition-colors">Twitter</button>
              <button className="text-sm font-bold text-slate-400 hover:text-indigo-600 transition-colors">GitHub</button>
            </div>
          </div>
        </div>

        {/* --- COMMENT SECTION --- */}
        <CommentSection />

        {/* --- RELATED POSTS SECTION --- */}
        <section className="mt-24 mb-20 pt-12 border-t border-slate-200 text-left">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h3 className="text-3xl font-bold text-slate-900 dark:text-white">More like this</h3>
              <p className="text-slate-500 dark:text-slate-400 mt-1">Handpicked for you in {blog.category}</p>
            </div>
            <div className="h-px grow mx-8 bg-slate-100 dark:bg-slate-800 hidden md:block"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {relatedBlogs.length > 0 ? (
              relatedBlogs.map((related) => (
                <motion.div
                  key={related.id}
                  whileHover={{ y: -5 }}
                  onClick={() => {
                    navigate(`/blog/${related.id}`);
                    window.scrollTo({ top: 0, behavior: "smooth" }); // Smooth scroll to top
                  }}
                  className="group cursor-pointer"
                >
                  <div className="relative aspect-video mb-4 overflow-hidden rounded-2xl">
                    <img 
                      src={related.image} 
                      alt={related.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <h4 className="font-bold text-lg text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2">
                    {related.title}
                  </h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">{related.date}</p>
                </motion.div>
              ))
            ) : (
              <p className="text-slate-400 italic">No other articles in this category yet.</p>
            )}
          </div>
        </section>

        {/* --- PRODUCTION ACTION BAR --- */}
        {/* --- REFINED ACTION BAR --- */}
        <div className="sticky bottom-8 max-w-fit mx-auto bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200 dark:border-slate-800 px-6 py-3 rounded-full shadow-2xl flex items-center gap-8">
          {/* Like Button */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleLike(blogId)}
              className={`p-2 rounded-full transition-all active:scale-75 ${
                isLiked
                  ? "bg-red-50 dark:bg-red-900/30 text-red-500"
                  : "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
              }`}
            >
              <motion.div
                key={isLiked ? "liked" : "unliked"}
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Heart size={24} fill={isLiked ? "currentColor" : "none"} />
              </motion.div>
            </button>
            <span className="text-sm font-bold text-slate-600">
              {blog.likes}
            </span>
          </div>

          {/* DISLIKE BUTTON - NOW FUNCTIONAL */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleDislike(blogId)}
              className={`p-2 rounded-full transition-all active:scale-75 ${
                isDisliked
                  ? "bg-slate-800 dark:bg-slate-700 text-white"
                  : "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
              }`}
            >
              <ThumbsDown size={24} fill={isDisliked ? "currentColor" : "none"} />
            </button>
            <span className="text-sm font-bold text-slate-600 dark:text-slate-400">
              {blog.dislikes}
            </span>
          </div>

          <div className="h-6 w-px bg-slate-200 dark:bg-slate-700"></div>

          {/* SAVE BUTTON */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleSave(blogId)}
              className={`p-2 rounded-full transition-all active:scale-75 ${
                isSaved
                  ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400"
                  : "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
              }`}
            >
              <Bookmark size={24} fill={isSaved ? "currentColor" : "none"} />
            </button>
            <span className="text-sm font-bold text-slate-600">
              {blog.saves}
            </span>
          </div>

          {/* Share */}
          <div className="relative">
            <button 
              onClick={handleShare}
              className={`p-2 rounded-full transition-all ${copied ? "bg-green-500 text-white" : "hover:bg-green-50 text-slate-400 hover:text-green-600"}`}
            >
              {copied ? <Check size={24} /> : <Share2 size={24} />}
            </button>
            
            {/* Mini Tooltip */}
            <AnimatePresence>
              {copied && (
                <motion.span 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs py-1 px-2 rounded font-bold"
                >
                  Copied!
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.article>
    </>
  );
};

export default BlogDetail;
