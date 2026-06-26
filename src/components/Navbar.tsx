import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import iconT from "/src/assets/icon.svg"
import UserMenu from './UserMenu'
import { PlusCircle, Video } from 'lucide-react'

interface UserSession {
  name: string;
  email: string;
  role: 'USER' | 'ADMIN';
}

export default function Navbar() {
  const [user, setUser] = useState<UserSession | null>(null)

  useEffect(() => {
    const savedUser = localStorage.getItem('@tutorials:user')
    if (savedUser) {
      setUser(savedUser.startsWith('{') ? JSON.parse(savedUser) : null)
    }
  }, [])

  return (
    <div className="w-full h-16 flex justify-between p-4 items-center bg-[var(--color-black)]/40 backdrop-blur-md border-b border-[var(--color-white)]/5 fixed top-0 left-0 z-50">

      <Link to="/" className="left flex items-center gap-2 cursor-pointer group">
        <img src={iconT} alt="Logo" className="w-8 h-8 group-hover:scale-105 transition-transform" />
        <div className="text-[1.5rem] font-heading font-bold col-white group-hover:text-[var(--color-secondary)] transition-colors">
          Tutorials
        </div>
      </Link>

      <div className="right flex justify-end items-center gap-4 font-sans-serif text-sm">
        {user ? (
          <div className="flex items-center gap-3">

            <Link
              to="/video/novo"
              className="group bg-[var(--color-secondary)] hover:brightness-110 col-primary font-sans-serif font-bold text-xs p-2.5 h-9 rounded-full flex items-center justify-center transition-all duration-300 shadow-md overflow-hidden max-w-[40px] hover:max-w-[150px] gap-0 hover:gap-1.5"
            >
              <PlusCircle className="w-5 h-5 flex-shrink-0" />
              <span className="max-w-0 opacity-0 group-hover:max-w-xs group-hover:opacity-100 transition-all duration-300 ease-in-out whitespace-nowrap overflow-hidden">
                Novo Vídeo
              </span>
            </Link>

            <Link
              to="/videos/me"
              className="flex items-center gap-2 px-4 py-2 text-sm font-sans-serif font-semibold col-white/80 hover:col-white hover:bg-white/5 rounded-xl transition"
            >
              <Video className="w-4 h-4 text-[var(--color-secondary)]" />
              Meus Vídeos
            </Link>

            <UserMenu user={user} setUser={setUser} />

          </div>
        ) : (
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