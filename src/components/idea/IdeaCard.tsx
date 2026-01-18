import Link from 'next/link';
import { Idea, IdeaCategory, IdeaStage } from '@/types';
import { Card, CardBody, Badge } from '../ui';
import { formatRelativeTime } from '@/lib/utils/format';

interface IdeaCardProps {
  idea: Idea;
}

const categoryColors: Record<IdeaCategory, 'default' | 'primary' | 'success' | 'warning'> = {
  [IdeaCategory.Tech]: 'primary',
  [IdeaCategory.Healthcare]: 'success',
  [IdeaCategory.Sustainability]: 'success',
  [IdeaCategory.SocialImpact]: 'warning',
  [IdeaCategory.Education]: 'primary',
  [IdeaCategory.Other]: 'default',
};

const categoryLabels: Record<IdeaCategory, string> = {
  [IdeaCategory.Tech]: 'Tecnologia',
  [IdeaCategory.Healthcare]: 'Saúde',
  [IdeaCategory.Sustainability]: 'Sustentabilidade',
  [IdeaCategory.SocialImpact]: 'Impacto Social',
  [IdeaCategory.Education]: 'Educação',
  [IdeaCategory.Other]: 'Outro',
};

const stageLabels: Record<IdeaStage, string> = {
  [IdeaStage.Idea]: 'Ideia',
  [IdeaStage.EarlyDevelopment]: 'Desenvolvimento Inicial',
  [IdeaStage.Prototype]: 'Protótipo',
  [IdeaStage.SeekingFunding]: 'Buscando Financiamento',
};

export function IdeaCard({ idea }: IdeaCardProps) {
  return (
    <Link href={`/idea/${idea.id}`}>
      <Card className="h-full group">
        <CardBody className="flex flex-col h-full">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2 line-clamp-2 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors duration-200">
                {idea.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">
                {idea.shortDescription}
              </p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 mb-3">
            <Badge variant={categoryColors[idea.category]}>
              {categoryLabels[idea.category]}
            </Badge>
            <Badge variant="default">
              {stageLabels[idea.stage]}
            </Badge>
          </div>
          
          <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-700">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-sm text-gray-500 dark:text-gray-400">
              <span className="font-medium truncate">{idea.authorName} • {idea.authorRole}</span>
              <div className="flex items-center gap-3 sm:gap-4 flex-shrink-0">
                <span className="flex items-center gap-1 whitespace-nowrap">
                  <svg className="w-4 h-4 text-violet-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <span className="whitespace-nowrap">{idea.interestCount} {idea.interestCount === 1 ? 'interessado' : 'interessados'}</span>
                </span>
                <span className="whitespace-nowrap">{formatRelativeTime(idea.publishedAt)}</span>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>
    </Link>
  );
}

