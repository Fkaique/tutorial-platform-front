import { useParams, Link } from 'react-router-dom';
import { useFetch } from '../hooks/useFetch';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import VideoPlayer from '../components/video-player/VideoPlayer';
import VideoDescription from '../components/video-player/VideoDescription';
import RelatedVideos from '../components/video-player/RelatedVideos';
import { ChevronLeft } from 'lucide-react';

interface VideoDetails {
  id: string;
  title: string;
  description?: string;
  author: string;
  videoUrl: string;
  thumbnailUrl: string;
  categoryId: string;
  tags?: string[];
}

export default function VideoDetailsPage() {
  const { id } = useParams<{ id: string }>();

  const { data: video, isFetching, error } = useFetch<VideoDetails>(`/videos/${id}`);

  return (
    <div className="min-h-screen bg-[var(--color-black)] flex flex-col justify-between">
      <Navbar />

      <main className="max-w-7xl mx-auto w-full px-4 md:px-8 pt-28 pb-16 flex-grow">
        
        <Link 
          to="/" 
          className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider col-white/60 hover:col-white mb-6 transition"
        >
          <ChevronLeft className="w-4 h-4" />
          Voltar para a Home
        </Link>

        {isFetching && (
          <div className="p-20 text-center font-sans-serif opacity-60 col-white">
            Carregando conteúdo da aula...
          </div>
        )}

        {error && !isFetching && (
          <div className="p-8 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-2xl font-sans-serif text-center max-w-xl mx-auto">
            ⚠️ Não foi possível carregar este vídeo. Verifique se o link está correto ou tente novamente mais tarde.
          </div>
        )}

        {!isFetching && video && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            <div className="lg:col-span-2 flex flex-col gap-6">
              <VideoPlayer 
                videoUrl={video.videoUrl} 
                posterUrl={video.thumbnailUrl} 
              />
              <VideoDescription 
                title={video.title}
                author={video.author}
                description={video.description}
                tags={video.tags}
              />
            </div>

            <div className="lg:col-span-1">
              <RelatedVideos 
                categoryId={video.categoryId} 
                currentVideoId={video.id} 
              />
            </div>

          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}