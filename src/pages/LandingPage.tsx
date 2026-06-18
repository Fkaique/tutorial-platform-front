import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

function LandingPage() {
  const metricas = [
    { valor: 'Vídeo', rotulo: 'Formato Prático', desc: 'Aprenda assistindo à execução real das tarefas passo a passo.' },
    { valor: '100%', rotulo: 'Indexado por Tags', desc: 'Filtro preciso baseado no seu RF07 para achar qualquer tema.' },
    { valor: 'Busca', rotulo: 'Filtro Avançado', desc: 'Encontre tutoriais cruzando termos chaves e categorias rapidamente.' }
  ]

  const pilaresProjeto = [
    {
      emoji: '💡',
      title: 'Multitópicos de Verdade',
      description: 'Uma plataforma sem nicho definido. Aprenda o que quiser sem complicações.',
      highlight: 'Para qualquer habilidade'
    },
    {
      emoji: '🛠️',
      title: 'Foco Prático',
      description: 'Conteúdos voltados para a aplicação real e resolução de problemas práticos de cada área.',
      highlight: 'Aprenda fazendo'
    },
    {
      emoji: '🏷️',
      title: 'Filtro por Tags (RF07)',
      description: 'Encontre o que precisa instantaneamente. Busque por tecnologias ou conceitos e encontre seu tutorial.',
      tags: ['origami', 'frontend', 'nodejs', 'csharp']
    }
  ]

  return (
    <div className="min-h-screen overflow-x-hidden">
      <Navbar />

      {/* 1. HERO SECTION */}
      <div className="pt-24 pb-16 px-4 flex flex-col gap-6 items-center max-w-4xl mx-auto">
        <span className="bg-[var(--color-white)] col-primary text-xs font-bold font-sans-serif px-4 py-1.5 rounded-full tracking-wider uppercase">
          Projeto de Extensão / Plataforma de Tutoriais
        </span>
        
        <h1 className='font-heading text-5xl font-bold text-center col-white leading-tight tracking-tight sm:text-6xl'>
          Aprenda o que quiser. <br /> Ensine o que você ama.
        </h1>

        <h2 className='font-sans-serif text-xl text-center opacity-80 max-w-2xl leading-relaxed'>
          Uma comunidade aberta para o compartilhamento de conhecimento prático em formato de vídeo. Criada para quem quer aprender e ensinar com total liberdade.
        </h2>
      </div>

      {/* 2. SEÇÃO: MÉTRICAS E ESTATÍSTICAS */}
      <div className="py-12 bg-[var(--color-black)] border-y border-[var(--color-white)]/5">
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
          {metricas.map((metrica, index) => (
            <div key={index} className="flex flex-col gap-1">
              <span className="font-heading text-4xl font-black col-secondary">
                {metrica.valor}
              </span>
              <span className="font-sans-serif text-sm font-semibold col-white">
                {metrica.rotulo}
              </span>
              <span className="font-sans-serif text-xs opacity-60 max-w-[200px] mx-auto">
                {metrica.desc}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 3. CARDS DE APRESENTAÇÃO DO PROJETO */}
      <div className="max-w-6xl mx-auto px-4 py-20">
        <div className="text-center max-w-2xl mx-auto mb-16 flex flex-col gap-2">
          <h3 className="font-heading text-3xl font-bold col-secondary">
            Como a plataforma funciona?
          </h3>
          <p className="font-sans-serif opacity-70">
            Entenda a proposta e os diferenciais técnicos do sistema que estamos desenvolvendo.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pilaresProjeto.map((pilar, index) => (
            <div 
              key={index} 
              className="bg-[var(--color-black)] p-8 rounded-2xl border border-[var(--color-white)]/5 shadow-lg flex flex-col justify-between gap-6 hover:border-[var(--color-secondary)]/30 transition-all duration-300"
            >
              <div className="flex flex-col gap-4">
                <span className="text-4xl">{pilar.emoji}</span>
                <h4 className="font-heading font-bold text-xl col-white">
                  {pilar.title}
                </h4>
                <p className="font-sans-serif opacity-70 text-sm leading-relaxed">
                  {pilar.description}
                </p>
              </div>

              <div>
                {pilar.highlight && (
                  <span className="font-sans-serif text-xs font-semibold col-secondary bg-[var(--color-secondary)]/10 px-3 py-1 rounded-md">
                    {pilar.highlight}
                  </span>
                )}
                
                {pilar.tags && (
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {pilar.tags.map((tag) => (
                      <span 
                        key={tag} 
                        className="font-monospace text-[11px] bg-[var(--color-white)]/10 col-white px-2 py-0.5 rounded border border-[var(--color-white)]/5"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default LandingPage