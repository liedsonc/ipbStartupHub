'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { IdeaCategory, IdeaStage } from '@/types';
import { Input, Select, Button } from '../ui';
import { createIdea } from '@/lib/api/ideas';
import { useToast } from '@/lib/hooks/useToast';

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
  authorName: string;
  authorRole: string;
  tags: string;
}

export function IdeaForm() {
  const router = useRouter();
  const { showSuccess } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  
  const [formData, setFormData] = useState<FormData>({
    title: '',
    shortDescription: '',
    description: '',
    category: IdeaCategory.Tech,
    stage: IdeaStage.Idea,
    contactEmail: '',
    authorName: '',
    authorRole: '',
    tags: '',
  });
  
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
    
    if (!formData.authorName.trim()) {
      newErrors.authorName = 'Seu nome é obrigatório';
    }
    
    if (!formData.authorRole.trim()) {
      newErrors.authorRole = 'Seu papel é obrigatório';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const tagsArray = formData.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);
      
      const newIdea = await createIdea({
        title: formData.title.trim(),
        shortDescription: formData.shortDescription.trim(),
        description: formData.description.trim(),
        category: formData.category,
        stage: formData.stage,
        contactEmail: formData.contactEmail.trim(),
        authorName: formData.authorName.trim(),
        authorRole: formData.authorRole.trim(),
        tags: tagsArray,
      });
      
      showSuccess('Ideia criada com sucesso! Ela aparecerá no feed.');
      
      window.dispatchEvent(new CustomEvent('ideaCreated'));
      
      setTimeout(() => {
        router.push('/browse');
      }, 500);
    } catch (error) {
      console.error('Failed to create idea:', error);
      showSuccess('Falha ao enviar ideia. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-violet-50 border border-violet-200 rounded-lg p-4 mb-6">
        <p className="text-sm text-violet-800">
          <strong>Nota:</strong> Este é um protótipo. Sua ideia será adicionada ao estado local, mas não será salva permanentemente.
        </p>
      </div>
      
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
        <label className="block text-sm font-medium text-gray-700 mb-1">
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
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Seu Nome *"
          value={formData.authorName}
          onChange={(e) => setFormData({ ...formData, authorName: e.target.value })}
          error={errors.authorName}
          placeholder="João Silva"
          required
        />
        
        <Input
          label="Seu Papel *"
          value={formData.authorRole}
          onChange={(e) => setFormData({ ...formData, authorRole: e.target.value })}
          error={errors.authorRole}
          placeholder="ex: Estudante de Ciência da Computação"
          required
        />
      </div>
      
      <Input
        label="Email de Contato *"
        type="email"
        value={formData.contactEmail}
        onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
        error={errors.contactEmail}
        placeholder="seu.email@universidade.edu"
        required
      />
      
      <Input
        label="Tags (separadas por vírgula)"
        value={formData.tags}
        onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
        placeholder="ex: IA, mobile, acessibilidade"
      />
      
      <div className="flex gap-4">
        <Button
          type="submit"
          variant="primary"
          disabled={isSubmitting}
          className="flex-1"
        >
          {isSubmitting ? 'Enviando...' : 'Enviar Ideia'}
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

