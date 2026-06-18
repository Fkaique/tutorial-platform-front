import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import { api } from '../services/api'

export default function Register() {
  const navigate = useNavigate()

  // Estados para armazenar os inputs do formulário
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  
  // Estados para controle de feedback do usuário
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Validação básica antes de enviar para a API
    if (!name || !email || !password) {
      setError('Por favor, preencha todos os campos.')
      setLoading(false)
      return
    }

    try {
      // Dispara o POST para o seu backend (Ajuste a rota se necessário)
      // No Register.tsx, mude para:
      await api.post('/users/', { name, email, password })

      // Se deu certo, manda o usuário direto para a tela de login
      navigate('/login')
    } catch (err: any) {
      // Trata erros vindos do servidor (ex: e-mail já cadastrado)
      setError(err.response?.data?.message || 'Erro ao realizar o cadastro. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[var(--color-primary)]">
      <div className="w-full max-w-md bg-[var(--color-black)] p-8 rounded-2xl border border-[var(--color-white)]/5 shadow-2xl flex flex-col gap-6">
        
        {/* Cabeçalho do Card */}
        <div className="text-center flex flex-col gap-2">
          <h2 className="font-heading text-3xl font-bold col-white">
            Criar Conta
          </h2>
          <p className="font-sans-serif text-sm opacity-60">
            Junte-se à nossa comunidade de tutoriais
          </p>
        </div>

        {/* Mensagem de Erro, se houver */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs p-3 rounded-lg font-sans-serif">
            {error}
          </div>
        )}

        {/* Formulário de Cadastro */}
        <form onSubmit={handleRegister} className="flex flex-col gap-4 font-sans-serif text-sm">
          
          <div className="flex flex-col gap-1.5">
            <label className="col-white font-medium">Nome completo</label>
            <input 
              type="text"
              placeholder="Seu nome"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full h-11 px-4 bg-[var(--color-primary)] border border-[var(--color-white)]/10 rounded-xl focus:outline-none focus:border-[var(--color-secondary)] col-white transition-all placeholder:opacity-30"
            />
          </div>

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

          {/* Botão de Envio adaptado para o estado de Loading */}
          <button
            type="submit"
            disabled={loading}
            className="w-full h-11 mt-2 bg-[var(--color-secondary)] hover:bg-[var(--color-secondary)]/90 col-white font-heading font-semibold rounded-xl transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading ? 'Cadastrando...' : 'Cadastrar'}
          </button>
        </form>

        {/* Link para alternar para a tela de Login */}
        <p className="font-sans-serif text-xs text-center opacity-60">
          Já tem uma conta?{' '}
          <Link to="/login" className="col-secondary hover:underline font-semibold">
            Fazer Login
          </Link>
        </p>

      </div>
    </div>
  )
}