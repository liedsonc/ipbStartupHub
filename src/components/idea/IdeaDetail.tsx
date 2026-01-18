'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { IdeaWithInterests, InterestType } from '@/types';
import { Card, CardBody, Badge, Button } from '../ui';
import { InterestButton } from './InterestButton';
import { InterestList } from './InterestList';
import { IdeaOpportunities } from './IdeaOpportunities';
import { formatDate } from '@/lib/utils/format';

interface IdeaDetailProps {
  idea: IdeaWithInterests & { authorId: string };
  currentUserId?: string;
}

const categoryColors: Record<string, 'default' | 'primary' | 'success' | 'warning'> = {
  Tech: 'primary',
  Healthcare: 'success',
  Sustainability: 'success',
  SocialImpact: 'warning',
  Education: 'primary',
  Other: 'default',
};

const categoryLabels: Record<string, string> = {
  Tech: 'Tecnologia',
  Healthcare: 'Saúde',
  Sustainability: 'Sustentabilidade',
  SocialImpact: 'Impacto Social',
  Education: 'Educação',
  Other: 'Outro',
};

const stageLabels: Record<string, string> = {
  Idea: 'Ideia',
  EarlyDevelopment: 'Desenvolvimento Inicial',
  Prototype: 'Protótipo',
  SeekingFunding: 'Buscando Financiamento',
};

export function IdeaDetail({ idea: initialIdea, currentUserId }: IdeaDetailProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const [idea, setIdea] = useState(initialIdea);
  const [refreshKey, setRefreshKey] = useState(0);
  
  const isOwner = idea.authorId ? session?.user?.id === idea.authorId : false;
  
  useEffect(() => {
    const fetchUpdatedIdea = async () => {
      const { fetchIdeaWithInterests } = await import('@/lib/api/ideas');
      const updated = await fetchIdeaWithInterests(idea.id);
      if (updated) {
        setIdea(updated);
      }
    };
    
    if (refreshKey > 0) {
      fetchUpdatedIdea();
    }
  }, [refreshKey, idea.id]);
  
  const handleInterestAdded = () => {
    setIdea((prev) => ({
      ...prev,
      interestCount: prev.interestCount + 1,
    }));
    setRefreshKey(prev => prev + 1);
  };
  
  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-start justify-between mb-4">
          <div className="flex flex-wrap gap-2">
            <Badge variant={categoryColors[idea.category] || 'default'}>
              {categoryLabels[idea.category] || idea.category}
            </Badge>
            <Badge variant="default">
              {stageLabels[idea.stage] || idea.stage}
            </Badge>
          </div>
          {isOwner && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push(`/idea/${idea.id}/edit`)}
            >
              Editar
            </Button>
          )}
        </div>
        
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-gray-100 mb-4 bg-gradient-to-r from-violet-600 to-purple-600 dark:from-violet-400 dark:to-purple-400 bg-clip-text text-transparent">{idea.title}</h1>
        
        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-6">
          <span>Por {idea.authorName} • {idea.authorRole}</span>
          <span>•</span>
          <span>Publicado em {formatDate(idea.publishedAt)}</span>
          <span>•</span>
          <span>{idea.interestCount} {idea.interestCount === 1 ? 'pessoa interessada' : 'pessoas interessadas'}</span>
        </div>
      </div>
      
      <Card>
        <CardBody>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">Descrição</h2>
          <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line leading-relaxed">
            {idea.description}
          </p>
        </CardBody>
      </Card>
      
      {idea.tags.length > 0 && (
        <Card>
          <CardBody>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">Etiquetas</h3>
            <div className="flex flex-wrap gap-2">
              {idea.tags.map((tag) => (
                <Badge key={tag} variant="default">
                  {tag}
                </Badge>
              ))}
            </div>
          </CardBody>
        </Card>
      )}
      
      {idea.openOpportunities && idea.openOpportunities.length > 0 && (
        <Card>
          <CardBody>
            <IdeaOpportunities opportunities={idea.openOpportunities} />
          </CardBody>
        </Card>
      )}
      
      <Card>
        <CardBody>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Expressar Interesse</h2>
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <InterestButton
              ideaId={idea.id}
              idea={idea}
              interestType={InterestType.Explore}
              label="Tenho interesse"
              variant="primary"
              onInterestAdded={handleInterestAdded}
            />
            <InterestButton
              ideaId={idea.id}
              idea={idea}
              interestType={InterestType.Collaborate}
              label="Quero colaborar"
              variant="outline"
              onInterestAdded={handleInterestAdded}
            />
            <InterestButton
              ideaId={idea.id}
              idea={idea}
              interestType={InterestType.Fund}
              label="Quero financiar"
              variant="outline"
              onInterestAdded={handleInterestAdded}
            />
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
              Pessoas Interessadas ({idea.interestedPeople.length})
            </h3>
            <InterestList people={idea.interestedPeople} />
          </div>
        </CardBody>
      </Card>
      
      <Card>
        <CardBody>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">Contato</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Entre em contato com o autor da ideia:{' '}
            <span className="font-mono text-sm">{idea.contactEmail}</span>
          </p>
        </CardBody>
      </Card>
    </div>
  );
}

