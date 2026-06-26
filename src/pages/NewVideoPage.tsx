import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFetch } from '../hooks/useFetch';
import { api } from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import UploadInput from '../components/UploadInput';
import { Film, AlertCircle } from 'lucide-react';

interface Category {
    id: string;
    name: string;
}

export default function NewVideoPage() {
    const navigate = useNavigate();
    const { data: categories } = useFetch<Category[]>('/categories');

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [tagsInput, setTagsInput] = useState(''); 
    const [videoFile, setVideoFile] = useState<File | null>(null);
    const [thumbFile, setThumbFile] = useState<File | null>(null);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setErrorMessage('');

        if (!title || !categoryId || !videoFile) {
            setErrorMessage('Por favor, preencha o título, a categoria e selecione um arquivo de vídeo.');
            return;
        }

        setIsSubmitting(true);

        try {
            const formData = new FormData();
            formData.append('title', title);
            formData.append('description', description);
            formData.append('categoryId', categoryId);
            formData.append('video', videoFile);

            if (thumbFile) {
                formData.append('thumb', thumbFile);
            }

            if (tagsInput.trim()) {
                formData.append('tags', tagsInput); 
            }

            await api.post('/videos', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            navigate('/');
        } catch (err: any) {
            console.error(err);
            if (err.response?.status === 401) {
                setErrorMessage('Sua sessão expirou. Por favor, recarregue a página ou faça login novamente antes de enviar.');
            } else {
                setErrorMessage(err.response?.data?.message || 'Ocorreu um erro ao tentar enviar o vídeo.');
            }
        }
    };

    return (
        <div className="min-h-screen bg-[var(--color-black)] flex flex-col justify-between">
            <Navbar />
            <main className="max-w-3xl mx-auto w-full px-4 pt-28 pb-16 flex-grow">
                <div className="bg-white/5 border border-white/5 rounded-3xl p-6 md:p-10 shadow-xl">

                    <div className="flex items-center gap-3 mb-8 pb-4 border-b border-white/5">
                        <Film className="w-6 h-6 col-secondary" />
                        <h1 className="font-heading text-2xl font-bold col-white">Publicar Novo Vídeo</h1>
                    </div>

                    {errorMessage && (
                        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-2 text-red-400 text-sm font-sans-serif">
                            <AlertCircle className="w-5 h-5 flex-shrink-0" />
                            {errorMessage}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="flex flex-col gap-6">

                        <div className="flex flex-col gap-2">
                            <label className="font-heading text-sm font-semibold col-white/80">Título do Vídeo *</label>
                            <input
                                type="text"
                                placeholder="Ex: Como fazer um Origami de Dragão de Papel"
                                value={title}
                                onChange={e => setTitle(e.target.value)}
                                className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 col-white font-sans-serif text-sm focus:border-[var(--color-secondary)]/40 focus:outline-none transition"
                                required
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="font-heading text-sm font-semibold col-white/80">Descrição / Detalhes da Aula</label>
                            <textarea
                                rows={4}
                                placeholder="Explique o que o aluno vai aprender nesta aula..."
                                value={description}
                                onChange={e => setDescription(e.target.value)}
                                className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 col-white font-sans-serif text-sm focus:border-[var(--color-secondary)]/40 focus:outline-none transition resize-none"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex flex-col gap-2">
                                <label className="font-heading text-sm font-semibold col-white/80">Trilha / Categoria *</label>

                                <select
                                    name="categoryId"
                                    value={categoryId} 
                                    onChange={e => setCategoryId(e.target.value)} 
                                    className="bg-[var(--color-black)] text-white/80 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[var(--color-secondary)]/40 transition"
                                    required
                                >
                                    <option value="">Selecione uma categoria</option>

                                    {Array.isArray(categories) ? (
                                        categories.map((category) => (
                                            <option key={category.id} value={category.id}>
                                                {category.name}
                                            </option>
                                        ))
                                    ) : (
                                        categories && 'data' in categories && Array.isArray((categories as any).data) ? (
                                            (categories as any).data.map((category: any) => (
                                                <option key={category.id} value={category.id}>
                                                    {category.name}
                                                </option>
                                            ))
                                        ) : null
                                    )}
                                </select>
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="font-heading text-sm font-semibold col-white/80">Tags (Separadas por vírgula)</label>
                                <input
                                    type="text"
                                    placeholder="Ex: origami, papel, tutorial"
                                    value={tagsInput}
                                    onChange={e => setTagsInput(e.target.value)}
                                    className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 col-white font-sans-serif text-sm focus:border-[var(--color-secondary)]/40 focus:outline-none transition"
                                />
                            </div>
                        </div>

                        <hr className="border-white/5 my-2" />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <UploadInput
                                label="Arquivo de Vídeo *"
                                accept="video/mp4,video/mkv"
                                selectedFile={videoFile}
                                onChange={setVideoFile}
                                helperText="Apenas formatos MP4 ou MKV"
                            />

                            <UploadInput
                                label="Miniatura (Thumbnail)"
                                accept="image/jpeg,image/png"
                                selectedFile={thumbFile}
                                onChange={setThumbFile}
                                helperText="Formatos JPG ou PNG (Opcional)"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="bg-[var(--color-secondary)] col-primary font-sans-serif font-bold py-4 rounded-xl mt-4 hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2 text-sm md:text-base shadow-lg"
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                                    Enviando arquivos para o Storage da GCP...
                                </>
                            ) : (
                                'Publicar Aula'
                            )}
                        </button>

                    </form>
                </div>
            </main>

            <Footer />
        </div>
    );
}