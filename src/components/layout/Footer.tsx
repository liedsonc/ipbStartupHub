import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Startup Hub IPB</h3>
            <p className="text-sm text-gray-600">
              Conectando estudantes, mentores e investidores para construir a próxima geração de startups.
            </p>
          </div>
          
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-4">Links Rápidos</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/browse" className="text-sm text-gray-600 hover:text-violet-600">
                  Explorar Ideias
                </Link>
              </li>
              <li>
                <Link href="/people" className="text-sm text-gray-600 hover:text-violet-600">
                  Diretório de Pessoas
                </Link>
              </li>
              <li>
                <Link href="/submit" className="text-sm text-gray-600 hover:text-violet-600">
                  Enviar Ideia
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-4">Sobre</h4>
            <p className="text-xs text-gray-500">
              Conectando ideias com pessoas para construir o futuro.
            </p>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-xs text-center text-gray-500">
            © 2024 Startup Hub IPB. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}

