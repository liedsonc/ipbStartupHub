import { OpenOpportunity, OpportunityType, OpportunityEngagement } from '@/types';
import { Badge } from '../ui/Badge';

interface IdeaOpportunitiesProps {
  opportunities: OpenOpportunity[];
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

export function IdeaOpportunities({ opportunities }: IdeaOpportunitiesProps) {
  if (!opportunities || opportunities.length === 0) {
    return null;
  }

  return (
    <div>
      <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">Oportunidades Abertas</h3>
      <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
        Esta ideia está buscando:
      </p>
      <div className="space-y-3">
        {opportunities.map((opp, index) => (
          <div key={index} className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-violet-300 dark:hover:border-violet-700 hover:shadow-md transition-all duration-200">
            <div className="flex items-start gap-2 mb-1">
              <Badge variant="primary" className="text-xs">
                {opportunityLabels[opp.type]}
              </Badge>
              <Badge variant="default" className="text-xs">
                {engagementLabels[opp.engagement]}
              </Badge>
            </div>
            {opp.description && (
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                {opp.description}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

