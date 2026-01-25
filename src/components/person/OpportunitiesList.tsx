import { OpportunityType } from '@/types';
import { Badge } from '../ui/Badge';

interface OpportunitiesListProps {
  offering?: OpportunityType[];
  seeking?: OpportunityType[];
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

export function OpportunitiesList({ offering = [], seeking = [] }: OpportunitiesListProps) {
  if (offering.length === 0 && seeking.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3 mt-3">
      {offering.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Oferece:</p>
          <div className="flex flex-wrap gap-1.5">
            {offering.map((opp) => (
              <Badge key={opp} variant="success" className="text-xs">
                {opportunityLabels[opp]}
              </Badge>
            ))}
          </div>
        </div>
      )}
      
      {seeking.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Busca:</p>
          <div className="flex flex-wrap gap-1.5">
            {seeking.map((opp) => (
              <Badge key={opp} variant="primary" className="text-xs">
                {opportunityLabels[opp]}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

