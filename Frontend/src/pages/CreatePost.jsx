import { useState, useCallback } from 'react';
import Editor from '../components/editor/Editor';
import { motion } from 'framer-motion';
import { Save, List as ListIcon } from 'lucide-react';
import axios from 'axios';
import { useBlogs } from '../context/BlogContext';

const CreatePost = () => {
  const { token, user } = useBlogs();
  const [title, setTitle] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [blocks, setBlocks] = useState([]);
  const [isSaving, setIsSaving] = useState(false);

  // Extract headings for the dynamic sidebar
  const milestones = blocks.filter((b) => b.type === 'header');

  const handleSave = async () => {
    if (!title) return alert("Please enter a title");
    setIsSaving(true);
    
    const blogData = {
      title,
      cover_image: coverImage,
      content: { blocks },
      category: 'Tech',
    };

    try {
      await axios.post('http://localhost:8000/api/blogs', blogData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Post submitted for admin approval!');
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || 'Failed to submit post.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditorChange = useCallback((data) => {
    setBlocks(data.blocks);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* --- TOP STICKY BAR --- */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold">
              {user?.name?.[0] || 'A'}
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Drafting by {user?.name || 'You'}</p>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Untitled Masterpiece</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
             <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-8 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-400 text-white rounded-full font-bold shadow-lg shadow-indigo-200 dark:shadow-none transition-all active:scale-95 flex items-center gap-2"
            >
              {isSaving ? <span className="animate-spin text-lg">◌</span> : <Save size={18} />}
              Publish
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-12 flex flex-col lg:flex-row gap-16 relative">
        
        {/* --- LEFT SIDE: Milestones --- */}
        <aside className="hidden xl:block w-48 shrink-0 sticky top-32 h-fit">
          <div className="flex items-center gap-2 mb-6 text-indigo-600 dark:text-indigo-400 font-bold uppercase text-[10px] tracking-[0.2em]">
            <ListIcon size={14} /> Milestones
          </div>
          <div className="space-y-4 border-l border-slate-200 dark:border-slate-800 pl-4">
            {milestones.length > 0 ? (
              milestones.map((m, i) => (
                <p
                  key={i}
                  className="text-xs text-slate-400 hover:text-indigo-500 cursor-default transition-colors line-clamp-2"
                >
                  {m.data.text}
                </p>
              ))
            ) : (
              <p className="text-[10px] text-slate-400 italic">
                Add H2/H3/H4 headers to index your content...
              </p>
            )}
          </div>
        </aside>

        {/* --- CENTER: Writing Canvas --- */}
        <main className="flex-1 max-w-3xl">
          {/* Cover Image Placeholder */}
          <div className="mb-12 group relative rounded-3xl overflow-hidden bg-slate-100 dark:bg-slate-900 border-2 border-dashed border-slate-200 dark:border-slate-800 transition-colors hover:border-indigo-300">
            {coverImage ? (
              <img src={coverImage} alt="Cover" className="w-full h-64 object-cover" />
            ) : (
              <div className="h-48 flex flex-col items-center justify-center text-slate-400">
                <span className="text-sm font-medium">Add a cover image URL below</span>
              </div>
            )}
            <input
              type="text"
              placeholder="Paste image URL here..."
              className="absolute bottom-4 left-4 right-4 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm px-4 py-2 rounded-xl text-xs outline-none border border-slate-200 dark:border-slate-700 shadow-xl"
              onChange={(e) => setCoverImage(e.target.value)}
            />
          </div>

          {/* Title Area */}
          <div className="mb-12">
            <textarea
              placeholder="Enter your title..."
              rows="1"
              className="text-4xl md:text-6xl font-black w-full bg-transparent outline-none text-slate-900 dark:text-white placeholder:text-slate-200 dark:placeholder:text-slate-800 resize-none overflow-hidden"
              onChange={(e) => {
                setTitle(e.target.value);
                e.target.style.height = 'auto';
                e.target.style.height = e.target.scrollHeight + 'px';
              }}
            />
            <div className="h-1.5 w-24 bg-indigo-600 rounded-full mt-6 scale-x-0 group-focus-within:scale-x-100 transition-transform origin-left" />
          </div>

          {/* Editor Canvas */}
          <div className="bg-white dark:bg-slate-900/50 rounded-[2.5rem] p-8 md:p-12 border border-slate-100 dark:border-slate-800 shadow-2xl shadow-slate-200/50 dark:shadow-none min-h-[800px]">
            <Editor onChange={handleEditorChange} />
          </div>

          {/* Bottom Tip */}
          <div className="mt-12 text-center">
            <p className="text-xs text-slate-400 font-medium tracking-wide">
              Press <kbd className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300">Tab</kbd> to open tool menu
            </p>
          </div>
        </main>
      </div>
    </div>
  );
};


export default CreatePost;
