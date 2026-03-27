import { useEffect, useRef } from 'react';
import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header';
import List from '@editorjs/list';
import ImageTool from '@editorjs/image';
import Quote from '@editorjs/quote';
import Code from '@editorjs/code';
import Delimiter from '@editorjs/delimiter';
import InlineCode from '@editorjs/inline-code';

const Editor = ({ data, onChange }) => {
  const ejInstance = useRef(null);
  const isReadyRef = useRef(false);

  useEffect(() => {
    if (!ejInstance.current) {
      const editor = new EditorJS({
        holder: 'editorjs',
        data: data || { blocks: [] },
        placeholder: "Write something extraordinary...",
        tools: {
          header: {
            class: Header,
            inlineToolbar: true,
            config: {
              placeholder: 'Enter a heading',
              levels: [2, 3, 4],
              defaultLevel: 2,
            },
          },
          list: {
            class: List,
            inlineToolbar: true,
          },
          image: {
            class: ImageTool,
            config: {
              endpoints: {
                byFile: 'http://localhost:8000/api/blogs/upload-image',
              },
              additionalRequestHeaders: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
              }
            },
          },
          quote: {
            class: Quote,
            inlineToolbar: true,
            config: {
              quotePlaceholder: 'Enter a quote',
              captionPlaceholder: 'Quote\'s author',
            },
          },
          code: Code,
          delimiter: Delimiter,
          inlineCode: InlineCode,
        },
        async onChange(api) {
          const content = await api.saver.save();
          onChange(content);
        },
        onReady: () => {
          isReadyRef.current = true;
        }
      });
      ejInstance.current = editor;
    }

    return () => {
      if (ejInstance.current && ejInstance.current.destroy) {
        if (isReadyRef.current) {
          try {
            ejInstance.current.destroy();
          } catch (e) {
            console.error("Editor cleanup error:", e);
          }
          ejInstance.current = null;
          isReadyRef.current = false;
        } else {
          ejInstance.current.isReady
            .then(() => {
              if (ejInstance.current) {
                try {
                  ejInstance.current.destroy();
                } catch (e) {
                  // Ignore if already destroyed
                }
                ejInstance.current = null;
                isReadyRef.current = false;
              }
            })
            .catch((err) => console.error('Editor cleanup error:', err));
        }
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="relative group/editor">
      <div 
        id="editorjs" 
        className="prose prose-lg prose-slate dark:prose-invert max-w-none min-h-[600px] focus:outline-none text-slate-800 dark:text-slate-100 cursor-text"
      />
      
      {/* Visual Instruction Overlay (visible when empty) */}
      <div className="absolute top-0 right-0 pointer-events-none opacity-0 group-hover/editor:opacity-30 transition-opacity">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-bl-2xl">
          Editor.js Engine v3
        </span>
      </div>
    </div>
  );
};




export default Editor;
