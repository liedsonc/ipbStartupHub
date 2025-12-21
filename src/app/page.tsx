import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card, CardBody } from '@/components/ui/Card';
import { fetchIdeas } from '@/lib/api/ideas';
import { IdeaCard } from '@/components/idea/IdeaCard';

export default async function HomePage() {
  const featuredIdeas = await fetchIdeas({ sortBy: 'mostInterest' });
  const recentIdeas = featuredIdeas.slice(0, 6);
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Bem-vindo ao Startup Hub IPB
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Conecte-se com estudantes, mentores e investidores para dar vida às suas ideias de startup.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/browse">
            <Button variant="primary" size="lg">
              Explorar Ideias
            </Button>
          </Link>
          <Link href="/submit">
            <Button variant="outline" size="lg">
              Enviar Sua Ideia
            </Button>
          </Link>
        </div>
      </div>
      
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Como Funciona</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardBody>
              <div className="text-3xl mb-3">1️⃣</div>
              <h3 className="text-lg font-semibold mb-2">Envie Sua Ideia</h3>
              <p className="text-gray-600">
                Compartilhe sua ideia de startup com a comunidade. Descreva sua visão, categoria e estágio atual.
              </p>
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <div className="text-3xl mb-3">2️⃣</div>
              <h3 className="text-lg font-semibold mb-2">Seja Descoberto</h3>
              <p className="text-gray-600">
                Estudantes, mentores e investidores podem descobrir sua ideia e expressar interesse em colaborar ou financiar.
              </p>
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <div className="text-3xl mb-3">3️⃣</div>
              <h3 className="text-lg font-semibold mb-2">Construa Juntos</h3>
              <p className="text-gray-600">
                Conecte-se com pessoas interessadas e transforme sua ideia em realidade através da colaboração.
              </p>
            </CardBody>
          </Card>
        </div>
      </div>
      
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Ideias em Destaque</h2>
          <Link href="/browse">
            <Button variant="ghost" size="sm">
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
    </div>
  );
}

