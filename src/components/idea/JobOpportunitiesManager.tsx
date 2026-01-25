'use client';

import { useState } from 'react';
import { OpenOpportunity, OpportunityType, OpportunityEngagement } from '@/types';
import { Button, Select, Badge, Modal } from '../ui';
import { useToast } from '@/lib/hooks/useToast';

interface JobOpportunitiesManagerProps {
  opportunities: OpenOpportunity[];
  onChange: (opportunities: OpenOpportunity[]) => void;
}

const opportunityLabels: Record<OpportunityType, string> = {
  [OpportunityType.Investor]: 'Investidor',
  [OpportunityType.CoFounder]: 'Sócio/Co-fundador',
  [OpportunityType.Engineer]: 'Engenheiro',
  [OpportunityType.Developer]: 'Desenvolvedor',
  [OpportunityType.Designer]: 'Designer',
  [OpportunityType.Business]: 'Negócios',
  [OpportunityType.Marketing]: 'Marketing',
  [OpportunityType.Sales]: 'Vendas',
  [OpportunityType.HR]: 'Recursos Humanos',
  [OpportunityType.Accountant]: 'Contabilista',
  [OpportunityType.Legal]: 'Jurídico',
  [OpportunityType.DataScientist]: 'Cientista de Dados',
  [OpportunityType.ProductManager]: 'Gerente de Produto',
  [OpportunityType.Mentor]: 'Mentor',
  [OpportunityType.Advisor]: 'Conselheiro',
  [OpportunityType.Other]: 'Outro',
};

const engagementLabels: Record<OpportunityEngagement, string> = {
  [OpportunityEngagement.Partner]: 'Parceiro',
  [OpportunityEngagement.CoFounder]: 'Co-fundador',
  [OpportunityEngagement.FullTime]: 'Tempo Integral',
  [OpportunityEngagement.PartTime]: 'Meio Período',
  [OpportunityEngagement.Internship]: 'Estágio',
  [OpportunityEngagement.Volunteer]: 'Voluntário',
  [OpportunityEngagement.Consultant]: 'Consultor',
  [OpportunityEngagement.Mentor]: 'Mentor',
  [OpportunityEngagement.Advisor]: 'Conselheiro',
};

export function JobOpportunitiesManager({ opportunities, onChange }: JobOpportunitiesManagerProps) {
  const { showSuccess, showError } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [formData, setFormData] = useState<OpenOpportunity>({
    type: OpportunityType.Developer,
    engagement: OpportunityEngagement.FullTime,
    description: '',
  });

  const handleAdd = () => {
    setEditingIndex(null);
    setFormData({
      type: OpportunityType.Developer,
      engagement: OpportunityEngagement.FullTime,
      description: '',
    });
    setIsModalOpen(true);
  };

  const handleEdit = (index: number) => {
    setEditingIndex(index);
    setFormData(opportunities[index]);
    setIsModalOpen(true);
  };

  const handleDelete = (index: number) => {
    const newOpportunities = opportunities.filter((_, i) => i !== index);
    onChange(newOpportunities);
    showSuccess('Vaga removida com sucesso');
  };

  const handleSave = () => {
    if (!formData.type || !formData.engagement) {
      showError('Preencha todos os campos obrigatórios');
      return;
    }

    const newOpportunities = [...opportunities];
    
    if (editingIndex !== null) {
      newOpportunities[editingIndex] = formData;
    } else {
      newOpportunities.push(formData);
    }

    onChange(newOpportunities);
    setIsModalOpen(false);
    showSuccess(editingIndex !== null ? 'Vaga atualizada!' : 'Vaga adicionada!');
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Vagas Abertas
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Adicione as vagas que sua startup está buscando
          </p>
        </div>
        <Button type="button" variant="primary" size="sm" onClick={handleAdd}>
          + Adicionar Vaga
        </Button>
      </div>

      {opportunities.length === 0 ? (
        <div className="text-center py-8 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
          <p className="text-gray-500 dark:text-gray-400">
            Nenhuma vaga adicionada ainda
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {opportunities.map((opp, index) => (
            <div
              key={index}
              className="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="primary">
                      {opportunityLabels[opp.type]}
                    </Badge>
                    <Badge variant="default">
                      {engagementLabels[opp.engagement]}
                    </Badge>
                  </div>
                  {opp.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {opp.description}
                    </p>
                  )}
                </div>
                <div className="flex gap-2 ml-4">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(index)}
                  >
                    Editar
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(index)}
                  >
                    Remover
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingIndex !== null ? 'Editar Vaga' : 'Adicionar Vaga'}
        onConfirm={handleSave}
        confirmLabel={editingIndex !== null ? 'Atualizar' : 'Adicionar'}
        showCancel={true}
      >
        <div className="space-y-4">
          <Select
            label="Tipo de Vaga *"
            value={formData.type}
            onChange={(e) =>
              setFormData({ ...formData, type: e.target.value as OpportunityType })
            }
          >
            {Object.values(OpportunityType).map((type) => (
              <option key={type} value={type}>
                {opportunityLabels[type]}
              </option>
            ))}
          </Select>

          <Select
            label="Tipo de Engajamento *"
            value={formData.engagement}
            onChange={(e) =>
              setFormData({
                ...formData,
                engagement: e.target.value as OpportunityEngagement,
              })
            }
          >
            {Object.values(OpportunityEngagement).map((engagement) => (
              <option key={engagement} value={engagement}>
                {engagementLabels[engagement]}
              </option>
            ))}
          </Select>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Descrição (opcional)
            </label>
            <textarea
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-violet-500"
              value={formData.description || ''}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={3}
              placeholder="Descreva os requisitos, responsabilidades, etc..."
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}

