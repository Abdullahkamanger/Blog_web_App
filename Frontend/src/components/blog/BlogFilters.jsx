import { Search } from "lucide-react";
import { motion } from "framer-motion";

const categories = ["All", "Design", "Engineering", "Environment"];

const BlogFilters = ({ activeCategory, setActiveCategory, searchQuery, setSearchQuery }) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
      {/* Search Bar */}
      <div className="relative w-full md:w-96">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
        <input
          type="text"
          placeholder="Search articles..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm"
        />
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
        {categories.map((cat) => (
       <button
    key={cat}
    onClick={() => setActiveCategory(cat)}
    /* CRITICAL: We add 'isolate' to create a new stacking context 
       and 'relative' so the Z-index works correctly.
    */
    className={`relative px-6 py-2 rounded-full text-sm font-semibold transition-colors duration-300 isolate ${
      activeCategory === cat ? "text-white" : "text-slate-600 hover:bg-slate-100"
    }`}
  >
    {activeCategory === cat && (
      <motion.div
        layoutId="activeTab"
        /* Changed -z-10 to z-[-1] and ensured it stays 
           inside the 'isolate' button. 
        */
        className="absolute inset-0 bg-indigo-600 rounded-full z-[-1]"
        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
      />
    )}
    {cat}
  </button>
        ))}
      </div>
    </div>
  );
};

export default BlogFilters;