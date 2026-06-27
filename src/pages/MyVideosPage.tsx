import { useFetch } from '../hooks/useFetch';
import { api } from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Video, Trash2, Edit, Loader2, AlertCircle, Film } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface UserVideo {
    id: string | number;
    title: string;
    thumbnailUrl: string;
    createdAt: string;
}

export default function MyVideosPage() {
    const navigate = useNavigate();
    const { data: initialVideos, isFetching, error } = useFetch<UserVideo[]>('/videos/me');
    const [myVideos, setMyVideos] = useState<UserVideo[]>([]);
    const [deletingId, setDeletingId] = useState<string | number | null>(null);

    // Sincroniza a listagem quando o useFetch trouxer os dados do backend
    useEffect(() => {
        if (initialVideos) {
            setMyVideos(initialVideos);
        }
    }, [initialVideos]);

    const handleDelete = async (videoId: string | number) => {
        if (!confirm("Tem certeza que deseja apagar esta vídeo-aula? Essa ação não pode ser desfeita.")) return;

        setDeletingId(videoId);
        try {
            await api.delete(`/videos/${videoId}`);
            setMyVideos(prev => prev.filter(v => v.id !== videoId));
            alert("Vídeo removido com sucesso!");
        } catch (err: any) {
            alert(err.response?.data?.message || "Erro ao deletar o vídeo.");
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div className="min-h-screen bg-[var(--color-black)] flex flex-col justify-between">
            <Navbar />

            <main className="max-w-5xl mx-auto w-full px-4 pt-28 pb-16 flex-grow">
                <div className="bg-white/5 border border-white/5 rounded-3xl p-6 md:p-10 shadow-xl">

                    <div className="flex items-center gap-3 mb-8 pb-4 border-b border-white/5">
                        <Film className="w-6 h-6 col-secondary" />
                        <h1 className="font-heading text-2xl font-bold col-white">Minhas Aulas Publicadas</h1>
                    </div>

                    {isFetching && myVideos.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-12 gap-2 text-white/40 font-sans-serif text-sm">
                            <Loader2 className="w-8 h-8 animate-spin text-[var(--color-secondary)]" />
                            Carregando seu acervo...
                        </div>
                    )}

                    {error && (
                        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-2 text-red-400 text-sm font-sans-serif">
                            <AlertCircle className="w-5 h-5 flex-shrink-0" />
                            Erro ao carregar seus vídeos. Certifique-se de estar logado.
                        </div>
                    )}

                    {!error && (
                        <div className="flex flex-col gap-4">
                            {myVideos.length > 0 ? (
                                myVideos.map((video) => (
                                    <div
                                        key={video.id}
                                        className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded-2xl gap-4 hover:border-white/10 transition"
                                    >
                                        <div className="flex items-center gap-4 w-full sm:w-auto">
                                            <div className="w-24 aspect-video bg-neutral-900 rounded-lg overflow-hidden flex-shrink-0">
                                                <img src={video.thumbnailUrl} alt={video.title} className="w-full h-full object-cover" />
                                            </div>
                                            <div className="truncate">
                                                <h3 className="font-heading font-bold col-white text-sm md:text-base truncate max-w-xs md:max-w-md">
                                                    {video.title}
                                                </h3>
                                                <span className="font-sans-serif text-xs col-white/40">
                                                    Postado em: {new Date(video.createdAt).toLocaleDateString('pt-BR')}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 w-full sm:w-auto justify-end border-t sm:border-t-0 pt-3 sm:pt-0 border-white/5">
                                            <button
                                                onClick={() => navigate(`/videos/edit/${video.id}`)}
                                                className="p-2.5 rounded-xl bg-white/5 text-white/60 hover:bg-white/10 hover:text-white transition cursor-pointer"
                                                title="Editar Detalhes"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </button>

                                            <button
                                                onClick={() => handleDelete(video.id)}
                                                disabled={deletingId === video.id}
                                                className="p-2.5 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition disabled:opacity-40 cursor-pointer"
                                                title="Excluir Aula"
                                            >
                                                {deletingId === video.id ? (
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                ) : (
                                                    <Trash2 className="w-4 h-4" />
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                !isFetching && (
                                    <div className="text-center py-12 flex flex-col gap-2 font-sans-serif text-white/40">
                                        <Video className="w-8 h-8 mx-auto opacity-30 mb-2" />
                                        <p className="text-sm font-semibold">Você ainda não publicou nenhuma aula.</p>
                                        <p className="text-xs">Vá até a página de criação para começar a compartilhar conhecimento!</p>
                                    </div>
                                )
                            )}
                        </div>
                    )}

                </div>
            </main>

            <Footer />
        </div>
    );
}