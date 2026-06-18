import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import iconT from "/src/assets/icon.svg"
import { api } from '../services/api';

interface UserSession {
  name: string;
  email: string;
}

export default function Navbar() {
  const navigate = useNavigate()
  const [user, setUser] = useState<UserSession | null>(null)

  // Disparado sempre que o componente renderiza para checar se o usuário está logado
  useEffect(() => {
    const savedUser = localStorage.getItem('@tutorials:user')
    if (savedUser) {
      setUser(JSON.stringify(savedUser) ? JSON.parse(savedUser) : null)
    }
  }, [])

  // Altere a função handleLogout dentro da sua Navbar.tsx:
  async function handleLogout() {
    try {
      const refreshToken = localStorage.getItem('@tutorials:refreshToken');

      // Avisa o backend para queimar o token na blacklist
      if (refreshToken) {
        await api.post('/users/logout', { refreshToken });
      }
    } catch (err) {
      console.error("Erro ao invalidar sessão no backend", err);
    } finally {
      // Limpa o front-end de qualquer forma (Garantia)
      localStorage.removeItem('@tutorials:user');
      localStorage.removeItem('@tutorials:token');
      localStorage.removeItem('@tutorials:refreshToken');
      setUser(null);
      navigate('/login');
    }
  }

  return (
    <div className="w-full h-16 flex justify-between p-4 items-center bg-[var(--color-black)]/40 backdrop-blur-md border-b border-[var(--color-white)]/5 fixed top-0 left-0 z-50">

      {/* Lado Esquerdo: Logo e Nome (Clica e volta para a Home) */}
      <Link to="/" className="left flex items-center gap-2 cursor-pointer group">
        <img src={iconT} alt="Logo" className="w-8 h-8 group-hover:scale-105 transition-transform" />
        <div className="text-[1.5rem] font-heading font-bold col-white group-hover:text-[var(--color-secondary)] transition-colors">
          Tutorials
        </div>
      </Link>

      {/* Lado Direito: Controle de Sessão Dinâmico */}
      <div className="right flex justify-end items-center gap-4 font-sans-serif text-sm">
        {user ? (
          // SE ESTIVER LOGADO: Mostra as boas-vindas e o botão de sair
          <div className="flex items-center gap-4">
            <span className="col-white opacity-80 hidden sm:inline">
              Olá, <strong className="col-secondary font-semibold">{user.name}</strong>
            </span>
            <button
              onClick={handleLogout}
              className="px-4 py-1.5 border border-red-500/30 hover:bg-red-500/10 text-red-400 font-medium rounded-lg transition-all cursor-pointer"
            >
              Sair
            </button>
          </div>
        ) : (
          // SE NÃO ESTIVER LOGADO: Mostra os botões de navegação padrão
          <div className="flex items-center gap-3">
            <Link to="/cadastro" className="col-white opacity-60 hover:opacity-100 transition-opacity">
              Criar conta
            </Link>
            <Link
              to="/login"
              className="px-5 py-2 bg-[var(--color-secondary)] hover:bg-[var(--color-secondary)]/90 col-white font-heading font-semibold rounded-xl transition-all cursor-pointer"
            >
              Acessar
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}