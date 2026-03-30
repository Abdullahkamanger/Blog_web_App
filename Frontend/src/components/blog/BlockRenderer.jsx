const BlockRenderer = ({ blocks }) => {
  if (!blocks || blocks.length === 0) return null;

  return blocks.map((block, index) => {
    switch (block.type) {
      case 'header': {
        const Tag = `h${block.data.level}`;
        const id = (block?.data?.text?.toLowerCase() || 'heading').replace(/ /g, '-');
        const sizeClass = {
          2: 'text-4xl md:text-5xl',
          3: 'text-3xl md:text-4xl',
          4: 'text-2xl md:text-3xl',
        }[block.data.level] || 'text-3xl';
        return (
          <Tag
            id={id}
            key={index}
            className={`${sizeClass} font-black my-8 dark:text-white text-slate-900 tracking-tight leading-tight`}
          >
            {block.data.text}
          </Tag>
        );
      }

      case 'paragraph':
        return (
          <p
            key={index}
            className="text-slate-600 dark:text-slate-400 leading-loose my-4"
            dangerouslySetInnerHTML={{ __html: block.data.text }}
          />
        );

      case 'image': {
        const url = block.data.file?.url || block.data.url;
        return (
          <figure key={index} className="my-8">
            <img
              src={url}
              alt={block.data.caption || ''}
              className="rounded-2xl w-full object-cover"
            />
            {block.data.caption && (
              <figcaption className="text-center text-sm text-slate-400 mt-2 italic">
                {block.data.caption}
              </figcaption>
            )}
          </figure>
        );
      }

      case 'list': {
        const ListTag = block.data.style === 'ordered' ? 'ol' : 'ul';
        const listClass =
          block.data.style === 'ordered'
            ? 'list-decimal pl-6 space-y-2 my-4 dark:text-slate-400 text-slate-600'
            : 'list-disc pl-6 space-y-2 my-4 dark:text-slate-400 text-slate-600';
        return (
          <ListTag key={index} className={listClass}>
            {block.data.items.map((item, i) => (
              <li key={i} dangerouslySetInnerHTML={{ __html: item }} />
            ))}
          </ListTag>
        );
      }

      case 'quote':
        return (
          <blockquote
            key={index}
            className="border-l-4 border-indigo-500 pl-6 my-6 italic text-slate-500 dark:text-slate-400"
          >
            <p dangerouslySetInnerHTML={{ __html: block.data.text }} />
            {block.data.caption && (
              <cite className="text-sm text-slate-400 not-italic mt-2 block">
                — {block.data.caption}
              </cite>
            )}
          </blockquote>
        );

      case 'delimiter':
        return (
          <hr
            key={index}
            className="my-10 border-slate-200 dark:border-slate-700"
          />
        );

      case 'code':
        return (
          <pre
            key={index}
            className="bg-slate-900 dark:bg-slate-950 text-emerald-400 rounded-2xl p-6 overflow-x-auto my-6 text-sm font-mono"
          >
            <code>{block.data.code}</code>
          </pre>
        );

      default:
        return null;
    }
  });
};

export default BlockRenderer;
