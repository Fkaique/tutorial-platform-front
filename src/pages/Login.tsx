import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import { api } from '../services/api'

export default function Login() {
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (!email || !password) {
      setError('Por favor, preencha todos os campos.')
      setLoading(false)
      return
    }

    // Dentro do seu try/catch na função handleLogin:
    try {
      // Passamos a usar a nossa 'api' configurada
      const response = await api.post('/users/login', {
        email,
        password
      });

      // Salva tudo o que seu backend Express retorna nos testes
      localStorage.setItem('@tutorials:user', JSON.stringify(response.data.user));
      localStorage.setItem('@tutorials:token', response.data.accessToken);
      localStorage.setItem('@tutorials:refreshToken', response.data.refreshToken); // 💡 SALVA O REFRESH AQUI

      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'E-mail ou senha incorretos.');
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[var(--color-primary)]">
      <div className="w-full max-w-md bg-[var(--color-black)] p-8 rounded-2xl border border-[var(--color-white)]/5 shadow-2xl flex flex-col gap-6">

        <div className="text-center flex flex-col gap-2">
          <h2 className="font-heading text-3xl font-bold col-white">
            Acessar Plataforma
          </h2>
          <p className="font-sans-serif text-sm opacity-60">
            Bem-vindo de volta! Faça seu login.
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs p-3 rounded-lg font-sans-serif">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="flex flex-col gap-4 font-sans-serif text-sm">
          <div className="flex flex-col gap-1.5">
            <label className="col-white font-medium">E-mail</label>
            <input
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-11 px-4 bg-[var(--color-primary)] border border-[var(--color-white)]/10 rounded-xl focus:outline-none focus:border-[var(--color-secondary)] col-white transition-all placeholder:opacity-30"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="col-white font-medium">Senha</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-11 px-4 bg-[var(--color-primary)] border border-[var(--color-white)]/10 rounded-xl focus:outline-none focus:border-[var(--color-secondary)] col-white transition-all placeholder:opacity-30"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-11 mt-2 bg-[var(--color-secondary)] hover:bg-[var(--color-secondary)]/90 col-white font-heading font-semibold rounded-xl transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <p className="font-sans-serif text-xs text-center opacity-60">
          Não tem uma conta ainda?{' '}
          <Link to="/cadastro" className="col-secondary hover:underline font-semibold">
            Cadastre-se
          </Link>
        </p>

      </div>
    </div>
  )
}