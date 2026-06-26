import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useFetch } from '../hooks/useFetch';
import { api } from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Loader2, ArrowLeft, Save, Image } from 'lucide-react';

interface VideoDetails {
    id: string;
    title: string;
    description?: string;
    tags?: string[];
    thumbnailUrl: string;
}

export default function EditVideoPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const { data: video, isFetching } = useFetch<VideoDetails>(`/videos/${id}`);

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [tags, setTags] = useState('');
    const [thumbFile, setThumbFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (video) {
            setTitle(video.title);
            setDescription(video.description || '');

            if (video.tags && Array.isArray(video.tags)) {
                setTags(video.tags.join(', '));
            } else if (typeof video.tags === 'string') {
                setTags(video.tags);
            } else {
                setTags('');
            }
        }
    }, [video]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const formData = new FormData();
            formData.append('title', title);

            formData.append('description', description);

            formData.append('tags', tags);

            if (thumbFile) {
                formData.append('thumb', thumbFile);
            }

            await api.patch(`/videos/${id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            alert('Aula atualizada com sucesso!');
            navigate('/videos/me');
        } catch (err: any) {
            alert(err.response?.data?.message || 'Erro ao atualizar os dados do vídeo.');
        } finally {
            setLoading(false);
        }
    };

    if (isFetching) {
        return (
            <div className="min-h-screen bg-[var(--color-black)] flex flex-col justify-between">
                <Navbar />
                <div className="flex-grow flex items-center justify-center gap-2 col-white/40 font-sans-serif">
                    <Loader2 className="w-8 h-8 animate-spin text-[var(--color-secondary)]" />
                    Buscando metadados do vídeo...
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[var(--color-black)] flex flex-col justify-between">
            <Navbar />

            <main className="max-w-3xl mx-auto w-full px-4 pt-28 pb-16 flex-grow">
                <button
                    onClick={() => navigate('/videos/me')}
                    className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider col-white/60 hover:col-white mb-6 transition cursor-pointer"
                >
                    <ArrowLeft className="w-4 h-4" /> Voltar para o gerenciador
                </button>

                <div className="bg-white/5 border border-white/5 rounded-3xl p-6 md:p-8 shadow-xl">
                    <h1 className="font-heading text-2xl font-bold col-white mb-6">Editar Detalhes da Aula</h1>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-5 font-sans-serif">

                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-bold col-white/70 uppercase">Título do Tutorial</label>
                            <input
                                type="text"
                                required
                                value={title}
                                onChange={e => setTitle(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 col-white text-sm focus:border-[var(--color-secondary)]/40 focus:outline-none transition"
                            />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-bold col-white/70 uppercase">Descrição da Aula</label>
                            <textarea
                                rows={5}
                                value={description}
                                onChange={e => setDescription(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 col-white text-sm focus:border-[var(--color-secondary)]/40 focus:outline-none transition resize-none"
                            />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-bold col-white/70 uppercase">Hashtags (Separadas por vírgula)</label>
                            <input
                                type="text"
                                placeholder="ex: react, typescript, nodejs"
                                value={tags}
                                onChange={e => setTags(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 col-white text-sm focus:border-[var(--color-secondary)]/40 focus:outline-none transition"
                            />
                        </div>

                        <div className="flex flex-col gap-2 p-4 bg-white/[0.02] border border-white/5 rounded-2xl">
                            <label className="text-xs font-bold col-white/70 uppercase flex items-center gap-2">
                                <Image className="w-4 h-4 text-[var(--color-secondary)]" /> Substituir Thumbnail (Opcional)
                            </label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={e => setThumbFile(e.target.files ? e.target.files[0] : null)}
                                className="text-xs text-white/40 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-white/5 file:text-white hover:file:bg-white/10 file:cursor-pointer"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="mt-4 w-full bg-[var(--color-secondary)] hover:opacity-90 col-primary font-bold py-3.5 rounded-xl transition flex items-center justify-center gap-2 cursor-pointer shadow-lg disabled:opacity-50"
                        >
                            {loading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <>
                                    <Save className="w-5 h-5" /> Salvar Alterações
                                </>
                            )}
                        </button>

                    </form>
                </div>
            </main>

            <Footer />
        </div>
    );
}