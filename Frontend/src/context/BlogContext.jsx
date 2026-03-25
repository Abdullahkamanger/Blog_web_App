import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { mockBlogs as initialData } from "../data/mockBlogs";
const BlogContext = createContext();

export const BlogProvider = ({ children }) => {
  const [blogs, setBlogs] = useState(initialData);
  const [loading, setLoading] = useState(true);
  const [likedIds, setLikedIds] = useState([]);
  const [savedIds, setSavedIds] = useState([]);
  const [dislikedIds, setDislikedIds] = useState([]);

  // Auth State
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")) || null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);

  const login = (userData, userToken) => {
    setUser(userData);
    setToken(userToken);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", userToken);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response && error.response.status === 401) {
          logout();
        }
        return Promise.reject(error);
      }
    );
    return () => axios.interceptors.response.eject(interceptor);
  }, []);

  // Dark Mode Logic
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("theme");
    return saved === "dark" || (!saved && window.matchMedia("(prefers-color-scheme: dark)").matches);
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  // Fetch blogs from backend
  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true);
      try {
        const res = await axios.get("http://localhost:8000/api/blogs");
        const dbBlogs = res.data.map((b) => ({
          ...b,
          // Normalize DB structure to match Mock structure
          image: b.cover_image || "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&q=80&w=800",
          author: { 
            name: b.author_name || "Anonymous",
            role: "Author",
            seed: b.author_name || "Author"
          },
          date: new Date(b.created_at).toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric' 
          }),
          likes: b.likes || 0,
          dislikes: b.dislikes || 0,
          saves: b.saves || 0
        }));
        
        // Merge real database data with mock data
        setBlogs([...dbBlogs, ...initialData]);
      } catch (err) {
        console.error("Failed to fetch blogs from database:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  // Persistence
  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("user-activity")) || {
      L: [],
      S: [],
      D: [],
    };
    setLikedIds(data.L);
    setSavedIds(data.S);
    setDislikedIds(data.D);
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "user-activity",
      JSON.stringify({ L: likedIds, S: savedIds, D: dislikedIds }),
    );
  }, [likedIds, savedIds, dislikedIds]);

  // const toggleLike = (id) => setLikedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  // const toggleSave = (id) => setSavedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  // const toggleDislike = (id) => setDislikedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  // Toggle Like with Database Simulation
  const toggleLike = (id) => {
    const isCurrentlyLiked = likedIds.includes(id);

    // 1. Update the User's Liked List
    setLikedIds((prev) =>
      isCurrentlyLiked ? prev.filter((i) => i !== id) : [...prev, id],
    );

    // 2. Update the "Database" (The blogs state)
    setBlogs((currentBlogs) =>
      currentBlogs.map((blog) => {
        if (blog.id === id) {
          return {
            ...blog,
            likes: isCurrentlyLiked ? blog.likes - 1 : blog.likes + 1,
          };
        }
        return blog;
      }),
    );
  };

  // Toggle Dislike with Database Simulation
  const toggleDislike = (id) => {
    const isCurrentlyDisliked = dislikedIds.includes(id);

    setDislikedIds((prev) =>
      isCurrentlyDisliked ? prev.filter((i) => i !== id) : [...prev, id],
    );

    setBlogs((currentBlogs) =>
      currentBlogs.map((blog) => {
        if (blog.id === id) {
          return {
            ...blog,
            dislikes: isCurrentlyDisliked
              ? blog.dislikes - 1
              : blog.dislikes + 1,
          };
        }
        return blog;
      }),
    );
  };

  const toggleSave = (id) => {
    const isCurrentlySaved = savedIds.includes(id);

    setSavedIds((prev) =>
      isCurrentlySaved ? prev.filter((i) => i !== id) : [...prev, id],
    );

    setBlogs((currentBlogs) =>
      currentBlogs.map((blog) => {
        if (blog.id === id) {
          return {
            ...blog,
            saves: isCurrentlySaved ? blog.saves - 1 : blog.saves + 1,
          };
        }
        return blog;
      }),
    );
  };
  return (
    <BlogContext.Provider
      value={{
        likedIds,
        savedIds,
        dislikedIds,
        darkMode,
        toggleDarkMode,
        toggleLike,
        toggleSave,
        toggleDislike,
        blogs,
        loading,
        user,
        token,
        login,
        logout,
      }}
    >
      {children}
    </BlogContext.Provider>
  );
};

export const useBlogs = () => useContext(BlogContext);
