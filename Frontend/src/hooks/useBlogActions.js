import { useState, useEffect } from "react";

export const useBlogActions = (blogId) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [likesCount, setLikesCount] = useState(Math.floor(Math.random() * 500) + 100);

  // Load saved states from LocalStorage on mount
  useEffect(() => {
    const savedData = JSON.parse(localStorage.getItem(`blog-${blogId}`)) || {};
    if (savedData.isLiked) setIsLiked(true);
    if (savedData.isSaved) setIsSaved(true);
  }, [blogId]);

  // Sync with LocalStorage whenever state changes
  const toggleLike = () => {
    setIsLiked((prev) => {
      const newState = !prev;
      setLikesCount(c => newState ? c + 1 : c - 1);
      saveToLocal({ isLiked: newState });
      return newState;
    });
  };

  const toggleSave = () => {
    setIsSaved((prev) => {
      const newState = !prev;
      saveToLocal({ isSaved: newState });
      return newState;
    });
  };

  const saveToLocal = (data) => {
    const existing = JSON.parse(localStorage.getItem(`blog-${blogId}`)) || {};
    localStorage.setItem(`blog-${blogId}`, JSON.stringify({ ...existing, ...data }));
  };

  return { isLiked, isSaved, likesCount, toggleLike, toggleSave };
};