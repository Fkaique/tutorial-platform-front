import { Link } from 'react-router-dom';
import { Play, Calendar, User, Tag } from 'lucide-react';

interface Video {
  id: string | number;
  title: string;
  description?: string;
  thumbnailUrl: string;
  author: string;
  tags?: string[] | string | any;
  createdAt?: string;
}

interface VideoFeedCardProps {
  video: Video;
}

export default function VideoFeedCard({ video }: VideoFeedCardProps) {
  const currentTags: string[] = Array.isArray(video.tags) 
    ? video.tags 
    : typeof video.tags === 'string' 
      ? video.tags.split(',').map(t => t.trim()) 
      : [];

  return (
    <Link 
      to={`/video/${video.id}`} 
      className="flex flex-col bg-white/5 border border-white/5 rounded-2xl overflow-hidden group hover:border-white/10 hover:scale-[1.02] transition-all duration-300 shadow-lg"
    >
      <div className="w-full aspect-video bg-neutral-900 relative overflow-hidden flex items-center justify-center">
        <img 
          src={video.thumbnailUrl} 
          alt={video.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400';
          }}
        />

        {currentTags.length > 0 && (
          <span className="absolute top-3 left-3 bg-black/70 backdrop-blur-md text-[10px] text-purple-300 font-bold px-2.5 py-1 rounded-md uppercase tracking-wider flex items-center gap-1">
            <Tag className="w-3 h-3 text-purple-400" />
            {currentTags[0]}
          </span>
        )}

        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-[var(--color-secondary)] flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-100 transition-transform">
            <Play className="w-5 h-5 col-primary fill-current ml-0.5" />
          </div>
        </div>
      </div>

      <div className="p-4 flex flex-col gap-3 justify-between flex-grow">
        <div>
          <h3 className="font-heading text-base font-bold col-white line-clamp-2 group-hover:text-[var(--color-secondary)] transition-colors duration-300">
            {video.title}
          </h3>
          <p className="font-sans-serif text-xs col-white/50 line-clamp-2 mt-1">
            {video.description || 'Sem descrição fornecida para esta aula.'}
          </p>
        </div>z

        <div className="flex items-center justify-between pt-3 border-t border-t-white/5 text-[11px] col-white/40 font-sans-serif">
          <div className="flex items-center gap-1.5 truncate max-w-[65%]">
            <User className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
            <span className="truncate font-medium hover:col-white transition-colors">
              By {video.author || 'Instrutor'}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            <span>
              {video.createdAt ? new Date(video.createdAt).toLocaleDateString('pt-BR') : 'Recente'}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}