import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import SubscribeModal from "../ui/SubscribeModal";
import CustomCursor from "../ui/CustomCursor";

const MainLayout = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Exit Intent Logic
  useEffect(() => {
    const handleMouseOut = (e) => {
      // If mouse goes to top of the browser AND hasn't been triggered this session
      if (e.clientY < 10) {
        const hasSeenPopup = sessionStorage.getItem("exit_intent_seen");
        if (!hasSeenPopup) {
          setIsModalOpen(true);
          sessionStorage.setItem("exit_intent_seen", "true");
        }
      }
    };

    document.addEventListener("mouseleave", handleMouseOut);
    return () => document.removeEventListener("mouseleave", handleMouseOut);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-300 selection:bg-indigo-100 dark:selection:bg-indigo-900">
      <Navbar onSubscribeClick={() => setIsModalOpen(true)} />
      <CustomCursor />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* This is where our Home or Blog pages will render */}
        <Outlet />
      </main>
      <footer className="border-t border-slate-200 dark:border-slate-800 py-8 text-center text-slate-500 dark:text-slate-400 text-sm transition-colors duration-300">
        © {new Date().getFullYear()} ModernBlog. Built with Passion.
      </footer>
      <SubscribeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default MainLayout;