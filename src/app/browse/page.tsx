'use client';

import { useState, useEffect, Suspense } from 'react';
import { IdeaCategory, IdeaStage, Idea } from '@/types';
import { fetchIdeas } from '@/lib/api/ideas';
import { IdeaCard } from '@/components/idea/IdeaCard';
import { IdeaFilters } from '@/components/idea/IdeaFilters';
import { EmptyState } from '@/components/shared/EmptyState';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { useSearchParams } from 'next/navigation';

function BrowseContent() {
  const searchParams = useSearchParams();
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const loadIdeas = async () => {
      setIsLoading(true);
      const filters = {
        category: searchParams.get('category') as IdeaCategory | undefined,
        stage: searchParams.get('stage') as IdeaStage | undefined,
        searchQuery: searchParams.get('q') || undefined,
        sortBy: 'newest' as const,
      };
      
      const fetchedIdeas = await fetchIdeas(filters);
      setIdeas(fetchedIdeas);
      setIsLoading(false);
    };
    
    loadIdeas();
  }, [searchParams]);
  
  useEffect(() => {
    const handleStorageChange = () => {
      const filters = {
        category: searchParams.get('category') as IdeaCategory | undefined,
        stage: searchParams.get('stage') as IdeaStage | undefined,
        searchQuery: searchParams.get('q') || undefined,
        sortBy: 'newest' as const,
      };
      fetchIdeas(filters).then(setIdeas);
    };
    
    window.addEventListener('ideaCreated', handleStorageChange);
    return () => window.removeEventListener('ideaCreated', handleStorageChange);
  }, [searchParams]);
  
  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400">Carregando ideias...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-gray-100 mb-3 bg-gradient-to-r from-violet-600 to-purple-600 dark:from-violet-400 dark:to-purple-400 bg-clip-text text-transparent">Explorar Ideias de Startup</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Descubra ideias inovadoras de estudantes, ex-alunos e membros do corpo docente.
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <div className="sticky top-20">
            <IdeaFilters />
          </div>
        </div>
        
        <div className="lg:col-span-3">
          {ideas.length === 0 ? (
            <EmptyState
              title="Nenhuma ideia encontrada"
              description="Tente ajustar seus filtros ou envie sua própria ideia."
              action={
                <Link href="/submit">
                  <Button variant="primary">Enviar Sua Ideia</Button>
                </Link>
              }
            />
          ) : (
            <>
              <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                {ideas.length} {ideas.length === 1 ? 'ideia encontrada' : 'ideias encontradas'}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {ideas.map((idea) => (
                  <IdeaCard key={idea.id} idea={idea} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function BrowsePage() {
  return (
    <Suspense fallback={
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400">Carregando ideias...</p>
        </div>
      </div>
    }>
      <BrowseContent />
    </Suspense>
  );
}

