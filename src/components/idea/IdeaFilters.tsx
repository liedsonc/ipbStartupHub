'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { IdeaCategory, IdeaStage } from '@/types';
import { Select } from '../ui/Select';
import { SearchBar } from '../ui/SearchBar';
import { Button } from '../ui/Button';

const categories = Object.values(IdeaCategory);
const stages = Object.values(IdeaStage);

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

export function IdeaFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const currentCategory = searchParams.get('category') || '';
  const currentStage = searchParams.get('stage') || '';
  const currentSearch = searchParams.get('q') || '';
  
  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/browse?${params.toString()}`);
  };
  
  const clearFilters = () => {
    router.push('/browse');
  };
  
  const hasActiveFilters = currentCategory || currentStage || currentSearch;
  
  return (
    <div className="space-y-4">
      <SearchBar
        placeholder="Buscar ideias..."
        defaultValue={currentSearch}
        onSearch={(value) => updateFilter('q', value)}
      />
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Select
          label="Categoria"
          value={currentCategory}
          onChange={(e) => updateFilter('category', e.target.value)}
        >
          <option value="">Todas as Categorias</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {categoryLabels[category]}
            </option>
          ))}
        </Select>
        
        <Select
          label="Estágio"
          value={currentStage}
          onChange={(e) => updateFilter('stage', e.target.value)}
        >
          <option value="">Todos os Estágios</option>
          {stages.map((stage) => (
            <option key={stage} value={stage}>
              {stageLabels[stage]}
            </option>
          ))}
        </Select>
      </div>
      
      {hasActiveFilters && (
        <Button
          variant="outline"
          size="sm"
          onClick={clearFilters}
          className="w-full"
        >
          Limpar Filtros
        </Button>
      )}
    </div>
  );
}

