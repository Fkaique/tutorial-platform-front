import { useFetch } from '../../hooks/useFetch';
import { Play } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Video {
  id: string;
  title: string;
  author: string;
  thumbnailUrl: string;
}

interface RelatedVideosProps {
  categoryId: string;
  currentVideoId: string;
}

export default function RelatedVideos({ categoryId, currentVideoId }: RelatedVideosProps) {
  const { data: videos, isFetching } = useFetch<Video[]>(`/videos?categoryId=${categoryId}`);

  const filteredVideos = videos?.filter(video => video.id !== currentVideoId) || [];

  if (isFetching) {
    return (
      <div className="flex flex-col gap-4 animate-pulse">
        {[1, 2, 3].map((n) => (
          <div key={n} className="flex gap-3 h-20 bg-white/5 rounded-xl border border-white/5" />
        ))}
      </div>
    );
  }

  if (filteredVideos.length === 0) {
    return (
      <div className="p-6 bg-white/5 rounded-2xl border border-dashed border-white/10 text-center font-sans-serif text-xs opacity-40">
        Nenhum vídeo relacionado nesta trilha.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <h3 className="font-heading text-lg font-bold col-white px-1">
        Próximas aulas nesta trilha
      </h3>

      <div className="flex flex-col gap-3">
        {filteredVideos.map((video) => (
          <Link
            to={`/video/${video.id}`}
            key={video.id}
            className="flex gap-3 p-2 bg-white/0 hover:bg-white/5 rounded-xl border border-transparent hover:border-white/5 transition-all duration-200 group cursor-pointer"
          >
            <div className="w-28 md:w-32 aspect-video rounded-lg overflow-hidden bg-slate-800 flex-shrink-0 relative">
              <img
                src={video.thumbnailUrl}
                alt={video.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://placehold.co/600x400/1e293b/ffffff?text=Video';
                }}
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Play className="w-4 h-4 col-secondary fill-secondary" />
              </div>
            </div>

            <div className="flex flex-col justify-center min-w-0">
              <h4 className="font-sans-serif font-semibold text-xs col-white line-clamp-2 group-hover:col-secondary transition-colors leading-tight">
                {video.title}
              </h4>
              <span className="font-sans-serif text-[11px] opacity-50 mt-1">
                Por {video.author || 'Anônimo'}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}