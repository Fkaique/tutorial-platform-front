import { useFetch } from '../hooks/useFetch';
import VideoCard from './VideoCard';

interface Video {
  id: string | number;
  title: string;
  author: string;
  tags?: string[];
  thumbnailUrl: string;
}

interface VideoRowProps {
  title: string;
  fetchUrl: string;
}

export default function VideoRow({ title, fetchUrl }: VideoRowProps) {
  const { data: videos, isFetching } = useFetch<Video[]>(fetchUrl);

  if (isFetching) {
    return <div className="px-4 text-xs opacity-40 font-sans-serif">Buscando vídeos...</div>;
  }

  if (!videos || videos.length === 0) {
    return null; 
  }

  return (
    <div className="flex flex-col gap-4 mb-10 last:mb-0">
      <h3 className="font-heading text-xl font-bold col-secondary px-4 md:px-0">
        {title}
      </h3>

      <div className="w-full flex gap-5 overflow-x-auto pb-4 px-4 md:px-0 scrollbar-none snap-x overflow-y-hidden">
        {videos.map((video) => (
          <div key={video.id} className="snap-start">
            <VideoCard
              title={video.title}
              author={video.author}
              tags={video.tags}
              thumb={video.thumbnailUrl}
            />
          </div>
        ))}
      </div>
    </div>
  );
}