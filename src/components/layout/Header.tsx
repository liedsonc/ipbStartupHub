'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { Button } from '../ui/Button';
import { useInbox } from '@/lib/hooks/useInbox';
import { ThemeToggle } from '@/components/shared/ThemeToggle';

export function Header() {
  const { data: session } = useSession();
  const { unreadCount } = useInbox();
  const router = useRouter();
  
  return (
    <header className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50 transition-all duration-300 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center group">
            <span className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 dark:from-violet-400 dark:to-purple-400 bg-clip-text text-transparent group-hover:from-violet-700 group-hover:to-purple-700 dark:group-hover:from-violet-300 dark:group-hover:to-purple-300 transition-all duration-300">Startup Hub</span>
          </Link>
          
          <nav className="hidden md:flex space-x-8">
            <Link
              href="/browse"
              className="text-gray-700 dark:text-gray-300 hover:text-violet-600 dark:hover:text-violet-400 px-3 py-2 text-sm font-medium transition-all duration-200 rounded-md hover:bg-violet-50 dark:hover:bg-violet-900/20 relative group"
            >
              Explorar Ideias
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-violet-600 dark:bg-violet-400 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link
              href="/people"
              className="text-gray-700 dark:text-gray-300 hover:text-violet-600 dark:hover:text-violet-400 px-3 py-2 text-sm font-medium transition-all duration-200 rounded-md hover:bg-violet-50 dark:hover:bg-violet-900/20 relative group"
            >
              Pessoas
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-violet-600 dark:bg-violet-400 group-hover:w-full transition-all duration-300"></span>
            </Link>
            {session && (
              <Link
                href="/inbox"
                className="relative text-gray-700 dark:text-gray-300 hover:text-violet-600 dark:hover:text-violet-400 px-3 py-2 text-sm font-medium transition-all duration-200 rounded-md hover:bg-violet-50 dark:hover:bg-violet-900/20 group"
              >
                Caixa de Entrada
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold shadow-lg animate-pulse">
                    {unreadCount}
                  </span>
                )}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-violet-600 dark:bg-violet-400 group-hover:w-full transition-all duration-300"></span>
              </Link>
            )}
            <Link
              href="/about"
              className="text-gray-700 dark:text-gray-300 hover:text-violet-600 dark:hover:text-violet-400 px-3 py-2 text-sm font-medium transition-all duration-200 rounded-md hover:bg-violet-50 dark:hover:bg-violet-900/20 relative group"
            >
              Sobre
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-violet-600 dark:bg-violet-400 group-hover:w-full transition-all duration-300"></span>
            </Link>
          </nav>
          
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            {session ? (
              <>
                <Button 
                  variant="primary" 
                  size="sm"
                  onClick={() => router.push('/submit')}
                >
                  Enviar Ideia
                </Button>
                <Link href="/profile">
                  <span className="text-gray-700 dark:text-gray-300 hover:text-violet-600 dark:hover:text-violet-400 text-sm font-medium">
                    {session.user.name}
                  </span>
                </Link>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => signOut({ callbackUrl: '/login' })}
                >
                  Sair
                </Button>
              </>
            ) : (
              <>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => router.push('/login')}
                >
                  Entrar
                </Button>
                <Button 
                  variant="primary" 
                  size="sm"
                  onClick={() => router.push('/register')}
                >
                  Criar Conta
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

