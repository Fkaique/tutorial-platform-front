import { useState, type FormEvent } from 'react';
import { useFetch } from '../hooks/useFetch';
import { api } from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { FolderPlus, Tag, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';

interface Category {
  id: string;
  name: string;
}

export default function ManageCategoriesPage() {
  const { data: categories, isFetching, error: fetchError } = useFetch<Category[]>('/categories');

  const [newCategoryName, setNewCategoryName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleCreateCategory = async (e: FormEvent) => {
    e.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');

    if (!newCategoryName.trim()) {
      setErrorMessage('O nome da categoria não pode estar vazio.');
      return;
    }

    setIsSubmitting(true);

    try {
      await api.post('/categories', { name: newCategoryName });

      setSuccessMessage(`Categoria "${newCategoryName}" criada com sucesso!`);
      setNewCategoryName('');

      setTimeout(() => {
        window.location.reload();
      }, 1500);

    } catch (err: any) {
      console.error(err);
      const backendMessage = err.response?.data?.message || err.response?.data?.error;
      setErrorMessage(backendMessage || 'Erro ao criar a categoria. Verifique suas permissões de Admin.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-black)] flex flex-col justify-between">
      <Navbar />

      <main className="max-w-4xl mx-auto w-full px-4 pt-28 pb-16 flex-grow grid grid-cols-1 md:grid-cols-3 gap-8">
        
        <div className="md:col-span-1 bg-white/5 border border-white/5 rounded-3xl p-6 shadow-xl h-fit">
          <div className="flex items-center gap-2.5 mb-6 pb-3 border-b border-white/5">
            <FolderPlus className="w-5 h-5 text-purple-400" />
            <h2 className="font-heading text-lg font-bold col-white">Nova Categoria</h2>
          </div>

          {successMessage && (
            <div className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-2 text-emerald-400 text-xs font-sans-serif">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              {successMessage}
            </div>
          )}

          {errorMessage && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-2 text-red-400 text-xs font-sans-serif">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleCreateCategory} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label className="font-heading text-xs font-semibold col-white/70">Nome da Trilha</label>
              <input 
                type="text" 
                placeholder="Ex: Computação Gráfica"
                value={newCategoryName}
                onChange={e => setNewCategoryName(e.target.value)}
                className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 col-white font-sans-serif text-sm focus:border-purple-500/40 focus:outline-none transition"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-purple-600 hover:bg-purple-500 text-white font-sans-serif font-bold text-sm py-2.5 rounded-xl transition flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? 'Salvando...' : 'Adicionar'}
            </button>
          </form>
        </div>

        <div className="md:col-span-2 bg-white/5 border border-white/5 rounded-3xl p-6 shadow-xl">
          <div className="flex items-center gap-2.5 mb-6 pb-3 border-b border-white/5">
            <Tag className="w-5 h-5 col-secondary" />
            <h2 className="font-heading text-lg font-bold col-white">Categorias Cadastradas</h2>
          </div>

          {isFetching && (
            <div className="flex flex-col items-center justify-center py-12 gap-2 text-white/40">
              <Loader2 className="w-8 h-8 animate-spin" />
              <span className="text-xs font-sans-serif">Carregando trilhas do banco...</span>
            </div>
          )}

          {fetchError && !isFetching && (
            <p className="text-sm text-red-400 font-sans-serif py-4">Não foi possível carregar as categorias do sistema.</p>
          )}

          {!isFetching && !fetchError && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {categories && categories.length > 0 ? (
                categories.map(category => (
                  <div 
                    key={category.id} 
                    className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-2xl hover:border-white/10 transition group"
                  >
                    <span className="font-sans-serif text-sm font-medium col-white group-hover:col-secondary transition-colors">
                      {category.name}
                    </span>
                    <span className="text-[10px] bg-white/5 col-white/40 px-2 py-0.5 rounded-md font-mono">
                      ID abreviado: {category.id.substring(0, 5)}...
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-sm col-white/40 font-sans-serif sm:col-span-2 py-4 text-center">
                  Nenhuma categoria cadastrada ainda.
                </p>
              )}
            </div>
          )}
        </div>

      </main>

      <Footer />
    </div>
  );
}