import { User } from 'lucide-react';

interface VideoDescriptionProps {
  title: string;
  author: string;
  description?: string;
  tags?: string[] | string | any;
}

export default function VideoDescription({ title, author, description, tags }: VideoDescriptionProps) {
  const validTags: string[] = Array.isArray(tags)
    ? tags
    : typeof tags === 'string'
      ? tags.split(',').map(t => t.trim())
      : [];

  return (
    <div className="flex flex-col gap-4 p-6 bg-white/5 rounded-2xl border border-white/5">
      <div>
        <h1 className="font-heading text-2xl md:text-3xl font-bold col-white leading-tight">
          {title}
        </h1>
        
        <div className="flex items-center gap-2 mt-3">
          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center border border-white/5">
            <User className="w-4 h-4 col-white opacity-80" />
          </div>
          <span className="font-sans-serif text-sm col-white/80">
            Por <strong className="col-secondary">{author || 'Professor Anônimo'}</strong>
          </span>
        </div>
      </div>

      {validTags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 py-1">
          {validTags.map((tag, index) => (
            <span
              key={`${tag}-${index}`}
              className="font-monospace text-[10px] bg-white/10 col-white px-2.5 py-1 rounded border border-white/5"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      <hr className="border-white/5 my-2" />

      <div>
        <h3 className="font-heading text-sm font-semibold col-white/40 uppercase tracking-wider mb-2">
          Sobre esta aula
        </h3>
        <p className="font-sans-serif text-base col-white/80 leading-relaxed whitespace-pre-line">
          {description || 'Nenhuma descrição fornecida para este vídeo.'}
        </p>
      </div>
    </div>
  );
}