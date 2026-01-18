import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card, CardBody } from '@/components/ui/Card';
import { fetchIdeasServer } from '@/lib/api/server-ideas';
import { IdeaCard } from '@/components/idea/IdeaCard';

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const featuredIdeas = await fetchIdeasServer({ sortBy: 'mostInterest' });
  const recentIdeas = featuredIdeas.slice(0, 6);
  
  return (
    <div className="overflow-hidden">
      {/* Hero Section with Gradient Background */}
      <section className="relative min-h-[90vh] flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-50 via-purple-50 to-pink-50 dark:from-violet-900/20 dark:via-purple-900/20 dark:to-pink-900/20"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(139,92,246,0.1),transparent_50%)]"></div>
        
        <div className="relative max-w-7xl mx-auto text-center py-20">
          <div className="mb-8">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold mb-6 bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 dark:from-violet-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent leading-tight">
              Transforme Ideias em
              <br />
              <span className="bg-gradient-to-r from-pink-600 via-purple-600 to-violet-600 dark:from-pink-400 dark:via-purple-400 dark:to-violet-400 bg-clip-text text-transparent">
                Startups Reais
              </span>
            </h1>
          </div>
          
          <p className="text-xl md:text-2xl lg:text-3xl text-gray-700 dark:text-gray-300 mb-4 max-w-4xl mx-auto leading-relaxed font-medium">
            A plataforma que conecta visionários com colaboradores, investidores e mentores
          </p>
          
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-12 max-w-3xl mx-auto">
            Seja você um empreendedor com uma ideia inovadora ou alguém buscando participar do próximo grande projeto, 
            o Startup Hub é o lugar onde conexões transformam sonhos em realidade.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link href="/browse">
              <Button variant="primary" size="lg" className="text-lg px-8 py-6">
                Explorar Ideias
              </Button>
            </Link>
            <Link href="/submit">
              <Button variant="outline" size="lg" className="text-lg px-8 py-6 border-2">
                Enviar Sua Ideia
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Value Proposition Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold mb-6 bg-gradient-to-r from-violet-600 to-purple-600 dark:from-violet-400 dark:to-purple-400 bg-clip-text text-transparent">
              Por que escolher o Startup Hub?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Uma plataforma completa para transformar ideias em negócios de sucesso
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="border-2 border-violet-200 dark:border-violet-800 bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20">
              <CardBody className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center text-white text-2xl font-bold">
                  💡
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-gray-100">Ideias Inovadoras</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Descubra e compartilhe ideias revolucionárias de startups em diversos setores
                </p>
              </CardBody>
            </Card>

            <Card className="border-2 border-purple-200 dark:border-purple-800 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
              <CardBody className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-2xl font-bold">
                  🤝
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-gray-100">Colaboração</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Conecte-se com pessoas que querem colaborar, investir ou mentorar seu projeto
                </p>
              </CardBody>
            </Card>

            <Card className="border-2 border-pink-200 dark:border-pink-800 bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20">
              <CardBody className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center text-white text-2xl font-bold">
                  🚀
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-gray-100">Crescimento</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Transforme sua ideia em um negócio real com o apoio da comunidade
                </p>
              </CardBody>
            </Card>

            <Card className="border-2 border-rose-200 dark:border-rose-800 bg-gradient-to-br from-rose-50 to-violet-50 dark:from-rose-900/20 dark:to-violet-900/20">
              <CardBody className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-rose-500 to-violet-500 flex items-center justify-center text-white text-2xl font-bold">
                  🌟
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-gray-100">Networking</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Construa uma rede valiosa de contatos com empreendedores e investidores
                </p>
              </CardBody>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-violet-50/30 dark:from-gray-900 dark:to-violet-900/10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold mb-6 bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 dark:from-violet-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
              Como Funciona
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Três passos simples para transformar sua ideia em realidade
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            <div className="relative">
              <div className="absolute -top-4 -left-4 w-20 h-20 bg-gradient-to-br from-violet-500 to-purple-500 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg z-10">
                1
              </div>
              <Card className="pt-12 border-2 border-violet-200 dark:border-violet-800 bg-gradient-to-br from-white to-violet-50 dark:from-gray-800 dark:to-violet-900/20 h-full">
                <CardBody>
                  <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">Envie Sua Ideia</h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-lg">
                    Compartilhe sua visão de startup com a comunidade. Descreva detalhadamente sua ideia, 
                    categoria, estágio atual e o que você está buscando. Quanto mais detalhes, melhor!
                  </p>
                </CardBody>
              </Card>
            </div>

            <div className="relative">
              <div className="absolute -top-4 -left-4 w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg z-10">
                2
              </div>
              <Card className="pt-12 border-2 border-purple-200 dark:border-purple-800 bg-gradient-to-br from-white to-purple-50 dark:from-gray-800 dark:to-purple-900/20 h-full">
                <CardBody>
                  <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">Seja Descoberto</h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-lg">
                    Sua ideia ficará visível para toda a comunidade. Pessoas interessadas podem descobrir 
                    seu projeto, explorar os detalhes e expressar interesse em colaborar, financiar ou mentorar.
                  </p>
                </CardBody>
              </Card>
            </div>

            <div className="relative">
              <div className="absolute -top-4 -left-4 w-20 h-20 bg-gradient-to-br from-pink-500 to-rose-500 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg z-10">
                3
              </div>
              <Card className="pt-12 border-2 border-pink-200 dark:border-pink-800 bg-gradient-to-br from-white to-pink-50 dark:from-gray-800 dark:to-pink-900/20 h-full">
                <CardBody>
                  <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">Construa Juntos</h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-lg">
                    Receba notificações quando alguém se interessar pela sua ideia. Conecte-se diretamente, 
                    discuta colaborações e transforme sua visão em um negócio real através da parceria.
                  </p>
                </CardBody>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold mb-6 bg-gradient-to-r from-violet-600 to-purple-600 dark:from-violet-400 dark:to-purple-400 bg-clip-text text-transparent">
              Recursos da Plataforma
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            <div className="p-8 rounded-2xl bg-gradient-to-br from-violet-500/10 via-purple-500/10 to-pink-500/10 dark:from-violet-500/20 dark:via-purple-500/20 dark:to-pink-500/20 border border-violet-200 dark:border-violet-800">
              <div className="text-4xl mb-4">🔍</div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-gray-100">Exploração Inteligente</h3>
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                Sistema de busca e filtros avançados para encontrar exatamente o que você procura. 
                Filtre por categoria, estágio, interesse e muito mais.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-rose-500/10 dark:from-purple-500/20 dark:via-pink-500/20 dark:to-rose-500/20 border border-purple-200 dark:border-purple-800">
              <div className="text-4xl mb-4">📬</div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-gray-100">Sistema de Notificações</h3>
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                Receba alertas em tempo real quando alguém se interessar pela sua ideia. 
                Nunca perca uma oportunidade de conexão.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-gradient-to-br from-pink-500/10 via-rose-500/10 to-violet-500/10 dark:from-pink-500/20 dark:via-rose-500/20 dark:to-violet-500/20 border border-pink-200 dark:border-pink-800">
              <div className="text-4xl mb-4">👥</div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-gray-100">Diretório de Pessoas</h3>
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                Explore perfis de estudantes, professores, mentores e investidores. 
                Veja suas habilidades e oportunidades que oferecem ou buscam.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-gradient-to-br from-rose-500/10 via-violet-500/10 to-purple-500/10 dark:from-rose-500/20 dark:via-violet-500/20 dark:to-purple-500/20 border border-rose-200 dark:border-rose-800">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-gray-100">Tipos de Interesse</h3>
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                Expresse diferentes tipos de interesse: explorar, colaborar, financiar ou mentorar. 
                Cada tipo conecta você com o que realmente busca.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 dark:from-violet-700 dark:via-purple-700 dark:to-pink-700">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6">
            Pronto para começar?
          </h2>
          <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
            Junte-se à comunidade de inovadores e transforme suas ideias em realidade. 
            O futuro das startups começa aqui.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link href="/register">
              <button className="font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 transform hover:scale-105 active:scale-95 text-lg px-8 py-6 bg-white text-violet-600 hover:bg-gray-100 shadow-xl hover:shadow-2xl">
                Criar Conta Grátis
              </button>
            </Link>
            <Link href="/browse">
              <button className="font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 transform hover:scale-105 active:scale-95 text-lg px-8 py-6 border-2 border-white text-white hover:bg-white/10 shadow-lg">
                Explorar Ideias
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Ideas Section */}
      {recentIdeas.length > 0 && (
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h2 className="text-4xl md:text-5xl font-extrabold mb-3 bg-gradient-to-r from-violet-600 to-purple-600 dark:from-violet-400 dark:to-purple-400 bg-clip-text text-transparent">
                  Ideias em Destaque
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-400">
                  Descubra as ideias mais interessantes da comunidade
                </p>
              </div>
              <Link href="/browse">
                <Button variant="ghost" size="sm" className="text-base">
                  Ver Todas →
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentIdeas.map((idea) => (
                <IdeaCard key={idea.id} idea={idea} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

