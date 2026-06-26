import { useEffect, useState } from 'react';
import { useFetch } from '../hooks/useFetch';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CategoryFilters from '../components/CategoryFilters';
import { Loader2, ChevronRight, ChevronLeft, Search } from 'lucide-react';
import VideoCard from '../components/VideoCard';

interface Category {
  id: string;
  name: string;
}

interface Video {
  id: string | number;
  title: string;
  description?: string;
  thumbnailUrl: string;
  author: string;
  tags?: string[] | string | any;
  categoryId?: string;
  createdAt?: string;
}

export default function Home() {
  // 1. Busca os dados de Vídeos e Categorias do backend
  const { data: allVideos, isFetching: loadingVideos } = useFetch<Video[]>('/videos');
  const { data: categoriesData, isFetching: loadingCategories } = useFetch<Category[]>('/categories');

  // 2. Estados de Controle
  const [search, setSearch] = useState<string>('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const videosPerPage = 12;

  const categories = categoriesData || [];

  // 3. 🔍 FILTRO COMBINADO: Categoria + Barra de Pesquisa (Front-end side)
  const filteredVideos = (allVideos || []).filter((video) => {
    // Filtro por Categoria
    const matchesCategory = !selectedCategoryId || String(video.categoryId) === String(selectedCategoryId);
    
    // Filtro por Barra de Pesquisa (Título ou Autor)
    const matchesSearch = !search || 
      video.title.toLowerCase().includes(search.toLowerCase()) || 
      (video.author && video.author.toLowerCase().includes(search.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  // Sempre que mudar a categoria, o termo de busca ou o feed, reinicia para a página 1
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategoryId, search, allVideos]);

  // 4. Lógica Matemática da Paginação
  const indexOfLastVideo = currentPage * videosPerPage;
  const indexOfFirstVideo = indexOfLastVideo - videosPerPage;
  
  const currentVideos = filteredVideos.slice(indexOfFirstVideo, indexOfLastVideo);
  const totalPages = Math.ceil(filteredVideos.length / videosPerPage);

  const isFetching = loadingVideos || loadingCategories;

  return (
    <div className="min-h-screen bg-[var(--color-black)] flex flex-col justify-between text-white">
      <Navbar />

      <div className="pt-28 max-w-7xl mx-auto w-full px-4 flex flex-col gap-6">
        
        <div className="relative w-full max-w-200 mx-auto font-sans-serif">
          <input
            type="text"
            placeholder="O que você quer aprender hoje?"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-3.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[var(--color-secondary)]/40 focus:bg-white/[0.07] transition duration-200"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
        </div>

        <CategoryFilters 
          categories={categories}
          selectedId={selectedCategoryId}
          onSelect={(id) => setSelectedCategoryId(id)}
        />
      </div>

      <main className="max-w-7xl mx-auto w-full px-4 py-8 flex-grow">

        {isFetching && (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-white/40 font-sans-serif">
            <Loader2 className="w-10 h-10 animate-spin text-[var(--color-secondary)]" />
            <span>Descobrindo novos tutoriais...</span>
          </div>
        )}

        {!isFetching && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 justify-items-center">
            {currentVideos.length > 0 ? (
              currentVideos.map((video) => (
                <VideoCard
                  key={video.id}
                  title={video.title}
                  author={video.author}
                  tags={video.tags}
                  thumb={video.thumbnailUrl}
                />
              ))
            ) : (
              <div className="col-span-full py-16 text-center text-white/40 font-sans-serif text-sm">
                Nenhum tutorial encontrado para os critérios selecionados.
              </div>
            )}
          </div>
        )}

        {!isFetching && totalPages > 1 && (
          <div className="flex items-center justify-center gap-4 mt-12 pb-8 font-sans-serif">
            
            <button
              disabled={currentPage === 1}
              onClick={() => {
                setCurrentPage(prev => prev - 1);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="p-2 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 text-white disabled:opacity-20 disabled:cursor-not-allowed transition cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <span className="text-sm font-semibold text-white/70">
              Página <span className="text-[var(--color-secondary)]">{currentPage}</span> de {totalPages}
            </span>

            <button
              disabled={currentPage === totalPages}
              onClick={() => {
                setCurrentPage(prev => prev + 1);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="p-2 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 text-white disabled:opacity-20 disabled:cursor-not-allowed transition cursor-pointer"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}