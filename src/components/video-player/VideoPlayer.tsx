interface VideoPlayerProps {
  videoUrl: string;
  posterUrl: string;
}

export default function VideoPlayer({ videoUrl, posterUrl }: VideoPlayerProps) {
  return (
    <div className="w-full aspect-video bg-black rounded-2xl overflow-hidden border border-white/5 shadow-2xl relative group">
      <video
        src={videoUrl}
        poster={posterUrl}
        controls
        className="w-full h-full object-contain"
        controlsList="nodownload" 
      >
        Seu navegador não suporta a reprodução de vídeos.
      </video>
    </div>
  );
}