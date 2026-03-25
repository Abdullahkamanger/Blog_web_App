import { motion } from "framer-motion";
import { useBlogs } from "../context/BlogContext";
import BlogGrid from "../components/blog/BlogGrid";

const Library = () => {
  const { blogs, likedIds, savedIds } = useBlogs();

  // Filter our "Database" for blogs the user interacted with
  const savedBlogs = blogs.filter(b => savedIds.includes(b.id));
  const likedBlogs = blogs.filter(b => likedIds.includes(b.id));

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-16"
    >
      <header>
        <h1 className="text-5xl font-extrabold text-slate-900">My Library</h1>
        <p className="text-slate-500 mt-2">Your curated collection of insights.</p>
      </header>

      {/* Saved Section */}
      <section>
        <div className="flex items-center gap-4 mb-8">
          <h2 className="text-2xl font-bold text-slate-800">Reading List</h2>
          <span className="bg-indigo-100 text-indigo-600 px-3 py-1 rounded-full text-sm font-bold">
            {savedBlogs.length}
          </span>
        </div>
        
        {savedBlogs.length > 0 ? (
          <BlogGrid blogs={savedBlogs} />
        ) : (
          <div className="bg-white border-2 border-dashed border-slate-200 rounded-3xl p-12 text-center">
            <p className="text-slate-400">No articles saved yet. Start exploring!</p>
          </div>
        )}
      </section>

      {/* Liked Section */}
      <section>
        <div className="flex items-center gap-4 mb-8">
          <h2 className="text-2xl font-bold text-slate-800">Liked Articles</h2>
          <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-bold">
            {likedBlogs.length}
          </span>
        </div>

        {likedBlogs.length > 0 ? (
          <BlogGrid blogs={likedBlogs} />
        ) : (
          <div className="bg-white border-2 border-dashed border-slate-200 rounded-3xl p-12 text-center">
            <p className="text-slate-400">You haven't liked any articles yet.</p>
          </div>
        )}
      </section>
    </motion.div>
  );
};

export default Library;