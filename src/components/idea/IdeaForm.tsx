'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { IdeaCategory, IdeaStage, OpenOpportunity } from '@/types';
import { Input, Select, Button } from '../ui';
import { useToast } from '@/lib/hooks/useToast';
import { JobOpportunitiesManager } from './JobOpportunitiesManager';

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

interface FormData {
  title: string;
  shortDescription: string;
  description: string;
  category: IdeaCategory;
  stage: IdeaStage;
  contactEmail: string;
  tags: string;
}

interface IdeaFormProps {
  ideaId?: string;
  initialData?: {
    title: string;
    shortDescription: string;
    description: string;
    category: IdeaCategory;
    stage: IdeaStage;
    contactEmail: string;
    tags: string[];
    openOpportunities?: OpenOpportunity[];
  };
}

export function IdeaForm({ ideaId, initialData }: IdeaFormProps = {}) {
  const router = useRouter();
  const { data: session } = useSession();
  const { showSuccess, showError } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  
  const isEditMode = !!ideaId && !!initialData;
  
  const [formData, setFormData] = useState<FormData>({
    title: initialData?.title || '',
    shortDescription: initialData?.shortDescription || '',
    description: initialData?.description || '',
    category: initialData?.category || IdeaCategory.Tech,
    stage: initialData?.stage || IdeaStage.Idea,
    contactEmail: initialData?.contactEmail || session?.user?.email || '',
    tags: initialData?.tags?.join(', ') || '',
  });

  const [jobOpportunities, setJobOpportunities] = useState<OpenOpportunity[]>(
    initialData?.openOpportunities || []
  );
  
  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Título é obrigatório';
    }
    
    if (!formData.shortDescription.trim()) {
      newErrors.shortDescription = 'Descrição curta é obrigatória';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Descrição é obrigatória';
    }
    
    if (!formData.contactEmail.trim()) {
      newErrors.contactEmail = 'Email de contato é obrigatório';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contactEmail)) {
      newErrors.contactEmail = 'Formato de email inválido';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!session) {
      router.push('/login');
      return;
    }
    
    if (!validate()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const tagsArray = formData.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);
      
      const url = isEditMode ? `/api/ideas/${ideaId}` : '/api/ideas';
      const method = isEditMode ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title.trim(),
          shortDescription: formData.shortDescription.trim(),
          description: formData.description.trim(),
          category: formData.category,
          stage: formData.stage,
          contactEmail: formData.contactEmail.trim(),
          tags: tagsArray,
          openOpportunities: jobOpportunities,
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || (isEditMode ? 'Erro ao atualizar ideia' : 'Erro ao criar ideia'));
      }
      
      showSuccess(isEditMode ? 'Ideia atualizada com sucesso!' : 'Ideia criada com sucesso! Ela aparecerá no feed.');
      
      setTimeout(() => {
        if (isEditMode) {
          router.push(`/idea/${ideaId}`);
        } else {
          router.push('/browse');
        }
        router.refresh();
      }, 500);
    } catch (error: any) {
      console.error(`Failed to ${isEditMode ? 'update' : 'create'} idea:`, error);
      showError(error.message || `Falha ao ${isEditMode ? 'atualizar' : 'enviar'} ideia. Tente novamente.`);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      
      <Input
        label="Título da Ideia *"
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        error={errors.title}
        placeholder="ex: Aplicativo de Navegação no Campus com IA"
        required
      />
      
      <Input
        label="Descrição Curta *"
        value={formData.shortDescription}
        onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
        error={errors.shortDescription}
        placeholder="Resumo de uma linha da sua ideia"
        maxLength={200}
        required
      />
      
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Descrição Completa *
        </label>
        <textarea
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent ${
            errors.description ? 'border-red-500' : 'border-gray-300'
          }`}
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={6}
          placeholder="Descrição detalhada da sua ideia de startup..."
          required
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description}</p>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select
          label="Categoria *"
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value as IdeaCategory })}
          error={errors.category}
          required
        >
          {categories.map((category) => (
            <option key={category} value={category}>
              {categoryLabels[category]}
            </option>
          ))}
        </Select>
        
        <Select
          label="Estágio *"
          value={formData.stage}
          onChange={(e) => setFormData({ ...formData, stage: e.target.value as IdeaStage })}
          error={errors.stage}
          required
        >
          {stages.map((stage) => (
            <option key={stage} value={stage}>
              {stageLabels[stage]}
            </option>
          ))}
        </Select>
      </div>
      
      <Input
        label="Email de Contato *"
        type="email"
        value={formData.contactEmail}
        onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
        error={errors.contactEmail}
        placeholder="seu.email@exemplo.com"
        required
      />
      
      <Input
        label="Tags (separadas por vírgula)"
        value={formData.tags}
        onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
        placeholder="ex: IA, mobile, acessibilidade"
      />

      <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
        <JobOpportunitiesManager
          opportunities={jobOpportunities}
          onChange={setJobOpportunities}
        />
      </div>
      
      <div className="flex gap-4">
        <Button
          type="submit"
          variant="primary"
          disabled={isSubmitting}
          className="flex-1"
        >
          {isSubmitting ? (isEditMode ? 'Atualizando...' : 'Enviando...') : (isEditMode ? 'Atualizar Ideia' : 'Enviar Ideia')}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isSubmitting}
        >
          Cancelar
        </Button>
      </div>
    </form>
  );
}

