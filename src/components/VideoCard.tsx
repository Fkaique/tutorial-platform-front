interface VideoCardProps {
  title: string;
  author: string;
  tags?: string[] | string | any; 
  thumb: string;
}

export default function VideoCard({ title, author, tags, thumb }: VideoCardProps) {

  const validTags: string[] = Array.isArray(tags) 
    ? tags 
    : typeof tags === 'string' 
      ? tags.split(',').map(t => t.trim()) 
      : [];

  return (
    <div className="min-w-[280px] max-w-[280px] bg-[var(--color-black)] rounded-xl overflow-hidden border border-[var(--color-white)]/5 flex flex-col justify-between group cursor-pointer hover:border-[var(--color-secondary)]/30 transition-all duration-300">

      <div className="aspect-video w-full bg-slate-800 overflow-hidden relative">
        <img 
          src={thumb} 
          alt={title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {

            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400';
          }}
        />
      </div>

      <div className="p-4 flex flex-col flex-grow justify-between gap-3">
        <div>
          <h4 className="font-heading font-semibold text-base col-white line-clamp-1 group-hover:text-[var(--color-secondary)] transition-colors">
            {title}
          </h4>
          <span className="font-sans-serif text-xs opacity-60">Por {author || 'Anônimo'}</span>
        </div>

        {validTags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {validTags.map((tag, index) => (
              <span 
                key={`${tag}-${index}`} 
                className="font-monospace text-[10px] bg-[var(--color-white)]/5 col-white px-2 py-0.5 rounded border border-[var(--color-white)]/5"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}