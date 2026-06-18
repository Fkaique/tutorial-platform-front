import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import VideoRow from '../components/VideoRow'
import { useFetch } from '../hooks/useFetch'

// Tipagem de categoria baseada na resposta do seu backend Express
interface Category {
  id: string; // ou number, dependendo do seu schema Drizzle
  name: string;
  description?: string;
}

export default function Home() {
  // Faz uma única requisição para trazer todas as categorias vivas no banco
  const { data: categories, isFetching: loadingCategories, error } = useFetch<Category[]>('/categories')

  return (
    <div className="min-h-screen overflow-x-hidden">
      <Navbar />

      {/* HERO SECTION */}
      <div className="pt-24 pb-12 px-4 flex flex-col gap-6 items-center max-w-4xl mx-auto">
        <span className="bg-[var(--color-white)] col-primary text-xs font-bold font-sans-serif px-4 py-1.5 rounded-full tracking-wider uppercase">
          Plataforma de Vídeo-Aulas
        </span>
        
        <h1 className='font-heading text-4xl font-bold text-center col-white leading-tight tracking-tight sm:text-5xl'>
          Aprenda o que quiser. <br /> Ensine o que você ama.
        </h1>
      </div>

      {/* ÁREA DINÂMICA DAS VITRINES */}
      <div className="max-w-6xl mx-auto md:px-4 py-8 mb-16 flex flex-col gap-6">
        
        {/* 1. Estado de Carregamento Inicial */}
        {loadingCategories && (
          <div className="p-4 opacity-50 font-sans-serif text-sm text-center">
            Carregando trilhas de aprendizado...
          </div>
        )}

        {/* 2. Tratamento de Erro na API */}
        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-xl font-sans-serif text-center mx-4">
            Não foi possível carregar as categorias do sistema.
          </div>
        )}

        {/* 3. Renderização Dinâmica (Gera as linhas conforme o banco de dados) */}
        {!loadingCategories && categories && categories.map((category) => (
          <VideoRow 
            key={category.id} 
            title={category.name} 
            // Passamos a rota de requisição de vídeos específica filtrada por essa categoria
            fetchUrl={`/videos?categoryId=${category.id}`} 
          />
        ))}

        {/* 4. Estado de lista vazia (Caso seu professor não tenha cadastrado nada ainda) */}
        {!loadingCategories && categories?.length === 0 && (
          <div className="p-12 text-center font-sans-serif opacity-40 text-sm">
            Nenhuma categoria disponível no momento.
          </div>
        )}
        
      </div>

      <Footer />
    </div>
  )
}