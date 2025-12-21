import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function NotFound() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
      <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-gray-700 mb-4">Página Não Encontrada</h2>
      <p className="text-gray-600 mb-8">
        A página que você está procurando não existe ou foi movida.
      </p>
      <Link href="/">
        <Button variant="primary">Voltar para Início</Button>
      </Link>
    </div>
  );
}

