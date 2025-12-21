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
      <Card className="h-full hover:shadow-lg transition-shadow">
        <CardBody className="flex flex-col h-full">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                {idea.title}
              </h3>
              <p className="text-sm text-gray-600 line-clamp-2 mb-3">
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
          
          <div className="mt-auto pt-3 border-t border-gray-100">
            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>{idea.authorName} • {idea.authorRole}</span>
              <div className="flex items-center gap-4">
                <span>{idea.interestCount} {idea.interestCount === 1 ? 'interessado' : 'interessados'}</span>
                <span>{formatRelativeTime(idea.publishedAt)}</span>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>
    </Link>
  );
}

