import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-gradient-to-b from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 border-t border-gray-200 dark:border-gray-700 mt-auto transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-extrabold bg-gradient-to-r from-violet-600 to-purple-600 dark:from-violet-400 dark:to-purple-400 bg-clip-text text-transparent mb-4">Startup Hub</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Conectando ideias com pessoas para construir a próxima geração de startups.
            </p>
          </div>
          
          <div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-4">Links Rápidos</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/browse" className="text-sm text-gray-600 dark:text-gray-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors duration-200 hover:font-medium">
                  Explorar Ideias
                </Link>
              </li>
              <li>
                <Link href="/people" className="text-sm text-gray-600 dark:text-gray-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors duration-200 hover:font-medium">
                  Diretório de Pessoas
                </Link>
              </li>
              <li>
                <Link href="/submit" className="text-sm text-gray-600 dark:text-gray-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors duration-200 hover:font-medium">
                  Enviar Ideia
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-4">Sobre</h4>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Conectando ideias com pessoas para construir o futuro.
            </p>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
          <p className="text-xs text-center text-gray-500 dark:text-gray-400">
            © {new Date().getFullYear()} Startup Hub. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}

