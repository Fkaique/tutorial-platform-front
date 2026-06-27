import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { User, Settings, LogOut, Users, ChevronDown } from 'lucide-react'; 

interface UserSession {
  name: string;
  email: string;
  role: 'USER' | 'ADMIN';
  avatarUrl?: string;
}

interface UserMenuProps {
  user: UserSession;
  setUser: (user: null) => void;
}

export default function UserMenu({ user, setUser }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const clearSession = () => {
    localStorage.removeItem('@tutorials:user');
    localStorage.removeItem('@tutorials:token');
    localStorage.removeItem('@tutorials:refreshToken');
    setUser(null);
  };

  const handleLogout = async () => {
    try {
      const refreshToken = localStorage.getItem('@tutorials:refreshToken');
      if (refreshToken) {
        await api.post('/users/logout', { refreshToken });
      }
    } catch (err) {
      console.error(err);
    } finally {
      clearSession();
      navigate('/');
    }
  };

  const handleSwitchAccount = async () => {
    try {
      const refreshToken = localStorage.getItem('@tutorials:refreshToken');
      if (refreshToken) {
        await api.post('/users/logout', { refreshToken });
      }
    } catch (err) {
      console.error(err);
    } finally {
      clearSession();
      navigate('/login');
    }
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-1.5 rounded-full bg-white/5 border border-white/10 hover:border-white/20 transition focus:outline-none cursor-pointer"
      >
        <div className="w-8 h-8 rounded-full bg-[var(--color-secondary)]/20 overflow-hidden flex items-center justify-center border border-white/10">
          {user.avatarUrl ? (
            <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
          ) : (
            <User className="w-4 h-4 col-white" />
          )}
        </div>
        <ChevronDown className={`w-4 h-4 col-white/60 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-[var(--color-black)] border border-white/10 rounded-2xl p-2 shadow-2xl z-50">
          <div className="px-3 py-2.5 border-b border-white/5 mb-1">
            <p className="text-xs col-white/40 font-sans-serif">Logado como</p>
            <p className="text-sm font-bold col-white font-heading truncate">{user.name}</p>
            {user.role === 'ADMIN' && (
              <span className="inline-block mt-1 text-[9px] bg-purple-500/20 text-purple-400 font-bold px-2 py-0.5 rounded-md uppercase tracking-wider">
                Administrador
              </span>
            )}
          </div>

          {/* 💡 SÓ APARECE SE FOR ADMIN: Link para gerenciar categorias */}
          {user.role === 'ADMIN' && (
            <Link
              to="/categorias/gerenciar"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-purple-300 hover:bg-purple-500/10 transition"
            >
              <Settings className="w-4 h-4 text-purple-400" />
              Painel de Categorias
            </Link>
          )}

          <Link
            to="/configuracoes"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm col-white/80 hover:bg-white/5 hover:col-white transition"
          >
            <Settings className="w-4 h-4 text-blue-400" />
            Configurar Conta
          </Link>

          <button
            onClick={() => { setIsOpen(false); handleSwitchAccount(); }}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm col-white/80 hover:bg-white/5 hover:col-white transition text-left cursor-pointer"
          >
            <Users className="w-4 h-4 text-purple-400" />
            Trocar de Conta
          </button>

          <hr className="border-white/5 my-1" />

          <button
            onClick={() => { setIsOpen(false); handleLogout(); }}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-red-400 hover:bg-red-500/10 transition text-left cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            Sair da Conta
          </button>
        </div>
      )}
    </div>
  );
}