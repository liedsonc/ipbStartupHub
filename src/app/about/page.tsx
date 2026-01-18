import { Card, CardBody } from '@/components/ui/Card';

export const dynamic = 'force-dynamic'

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-gray-100 mb-8 text-center bg-gradient-to-r from-violet-600 to-purple-600 dark:from-violet-400 dark:to-purple-400 bg-clip-text text-transparent">Sobre o Startup Hub</h1>
      
      <div className="space-y-6">
        <Card>
          <CardBody>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">Propósito</h2>
            <p className="text-gray-700 dark:text-gray-300">
              Startup Hub é uma plataforma projetada para conectar pessoas com ideias inovadoras. 
              Nosso objetivo é facilitar colaboração, mentoria e oportunidades de financiamento 
              para startups em todos os estágios de desenvolvimento.
            </p>
          </CardBody>
        </Card>
        
        <Card>
          <CardBody>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">Como Funciona</h2>
            <ol className="list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300">
              <li>Pessoas enviam suas ideias de startup com descrições, categorias e estágio atual.</li>
              <li>Outros membros da comunidade podem navegar e descobrir ideias que os interessam.</li>
              <li>Pessoas podem expressar interesse em colaborar, financiar ou mentorar.</li>
              <li>Ideias ganham visibilidade e conexões são feitas.</li>
            </ol>
          </CardBody>
        </Card>
        
        <Card>
          <CardBody>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">Perguntas Frequentes</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">Como entro em contato com alguém?</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Você pode entrar em contato diretamente com os autores das ideias através do email de contato fornecido em cada ideia.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">O que acontece com minha ideia?</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Suas ideias são armazenadas na plataforma e ficam visíveis para outros membros da comunidade. Você pode gerenciar suas ideias através do seu perfil.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">Como posso colaborar com uma ideia?</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Você pode expressar interesse em colaborar, financiar ou mentorar uma ideia através dos botões disponíveis na página de detalhes de cada ideia.
                </p>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

