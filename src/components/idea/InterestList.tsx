import { PersonWithInterest, InterestType } from '@/types';
import { Badge } from '../ui/Badge';
import { OpportunitiesList } from '../person/OpportunitiesList';

interface InterestListProps {
  people: PersonWithInterest[];
}

const interestTypeLabels: Record<InterestType, string> = {
  [InterestType.Collaborate]: 'Quer colaborar',
  [InterestType.Fund]: 'Quer financiar',
  [InterestType.Explore]: 'Explorando',
  [InterestType.Mentor]: 'Quer mentorar',
};

const roleColors: Record<string, 'default' | 'primary' | 'success'> = {
  Student: 'default',
  Professor: 'primary',
  Investor: 'success',
  Mentor: 'primary',
  Alumni: 'default',
  External: 'default',
};

const roleLabels: Record<string, string> = {
  Student: 'Estudante',
  Professor: 'Professor',
  Investor: 'Investidor',
  Mentor: 'Mentor',
  Alumni: 'Ex-aluno',
  External: 'Externo',
};

export function InterestList({ people }: InterestListProps) {
  if (people.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        <p>Ninguém expressou interesse ainda.</p>
        <p className="text-sm mt-1">Seja o primeiro a mostrar interesse!</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-3">
      {people.map((person) => (
        <div
          key={person.id}
          className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-violet-300 dark:hover:border-violet-700 hover:shadow-md transition-all duration-200"
        >
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-medium text-gray-900 dark:text-gray-100">{person.name}</span>
              <Badge variant={roleColors[person.role] || 'default'}>
                {roleLabels[person.role] || person.role}
              </Badge>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">{person.affiliation}</p>
            {person.bio && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{person.bio}</p>
            )}
            <OpportunitiesList
              offering={person.opportunitiesOffering}
              seeking={person.opportunitiesSeeking}
            />
          </div>
          <div className="ml-4">
            <Badge variant="default" className="text-xs border border-gray-300 dark:border-gray-600">
              {interestTypeLabels[person.interestTypeForIdea]}
            </Badge>
          </div>
        </div>
      ))}
    </div>
  );
}

