import { motion } from "framer-motion";
import BlogCard from "./BlogCard";

const BlogGrid = ({ blogs, searchQuery = "" }) => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.2 } // Cards pop in one after another
    }
  };

  const item = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      variants={container} 
      initial="hidden" 
      whileInView="show" 
      viewport={{ once: true }} 
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
    >
      {blogs.map((blog) => (
        <motion.div variants={item} key={blog.id}>
          <BlogCard blog={blog} searchQuery={searchQuery} />
        </motion.div>
      ))}
    </motion.div>
  );
};

export default BlogGrid;