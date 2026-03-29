import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { mockBlogs as initialData } from "../data/mockBlogs";
const BlogContext = createContext();

export const BlogProvider = ({ children }) => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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
    localStorage.removeItem("user-activity"); // Clear interaction states
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
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/blogs`);
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
          likes: b.likes_count || 0,
          dislikes: b.dislikes_count || 0,
          saves: b.saves_count || 0
        }));
        
        // Merge real database data with mock data
        setBlogs([...dbBlogs, ...initialData]);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch blogs from database:", err);
        setError("Could not connect to the database. Please check your server and try again.");
        setBlogs([]);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  // Fetch user interactions on login
  const fetchUserInteractions = async () => {
    if (!token) return;
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/auth/interactions`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const interactions = res.data;
      const liked = interactions.filter(i => i.type === 'LIKE').map(i => i.blog_id);
      const disliked = interactions.filter(i => i.type === 'DISLIKE').map(i => i.blog_id);
      const saved = interactions.filter(i => i.type === 'SAVE').map(i => i.blog_id);
      setLikedIds(liked);
      setSavedIds(saved);
      setDislikedIds(disliked);
    } catch (err) {
      console.error("Failed to fetch user interactions:", err);
    }
  };

  useEffect(() => {
    if (user && token) {
      fetchUserInteractions();
    }
  }, [user, token]);

  // Toggle Like with Backend Call
  const toggleLike = async (id) => {
    if (!token) return; // Require login

    const isCurrentlyLiked = likedIds.includes(id);

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/blogs/${id}/like`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Update local state based on response
      setLikedIds((prev) =>
        isCurrentlyLiked ? prev.filter((i) => i !== id) : [...prev, id],
      );

      // Update the blogs state with new count
      setBlogs((currentBlogs) =>
        currentBlogs.map((blog) => {
          if (blog.id === id) {
            return {
              ...blog,
              likes: res.data.likes_count,
            };
          }
          return blog;
        }),
      );
    } catch (err) {
      console.error("Failed to toggle like:", err);
    }
  };

  // Toggle Dislike with Backend Call
  const toggleDislike = async (id) => {
    if (!token) return;

    const isCurrentlyDisliked = dislikedIds.includes(id);

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/blogs/${id}/dislike`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setDislikedIds((prev) =>
        isCurrentlyDisliked ? prev.filter((i) => i !== id) : [...prev, id],
      );

      setBlogs((currentBlogs) =>
        currentBlogs.map((blog) => {
          if (blog.id === id) {
            return {
              ...blog,
              dislikes: res.data.dislikes_count,
            };
          }
          return blog;
        }),
      );
    } catch (err) {
      console.error("Failed to toggle dislike:", err);
    }
  };

  const toggleSave = async (id) => {
    if (!token) return;

    const isCurrentlySaved = savedIds.includes(id);

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/blogs/${id}/save`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setSavedIds((prev) =>
        isCurrentlySaved ? prev.filter((i) => i !== id) : [...prev, id],
      );

      setBlogs((currentBlogs) =>
        currentBlogs.map((blog) => {
          if (blog.id === id) {
            return {
              ...blog,
              saves: res.data.saves_count,
            };
          }
          return blog;
        }),
      );
    } catch (err) {
      console.error("Failed to toggle save:", err);
    }
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
        error,
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
