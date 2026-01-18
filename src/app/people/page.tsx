import { fetchPeopleServer } from '@/lib/api/server-people';
import { PersonRole, InterestType } from '@/types';
import { Card, CardBody, Badge } from '@/components/ui';
import { EmptyState } from '@/components/shared/EmptyState';
import { OpportunitiesList } from '@/components/person/OpportunitiesList';

const roleColors: Record<PersonRole, 'default' | 'primary' | 'success' | 'warning'> = {
  [PersonRole.Student]: 'default',
  [PersonRole.Professor]: 'primary',
  [PersonRole.Investor]: 'success',
  [PersonRole.Mentor]: 'primary',
  [PersonRole.Alumni]: 'default',
  [PersonRole.External]: 'default',
};

const roleLabels: Record<PersonRole, string> = {
  [PersonRole.Student]: 'Estudante',
  [PersonRole.Professor]: 'Professor',
  [PersonRole.Investor]: 'Investidor',
  [PersonRole.Mentor]: 'Mentor',
  [PersonRole.Alumni]: 'Ex-aluno',
  [PersonRole.External]: 'Externo',
};

const interestTypeLabels: Record<InterestType, string> = {
  [InterestType.Collaborate]: 'Quer colaborar',
  [InterestType.Fund]: 'Quer financiar',
  [InterestType.Explore]: 'Explorando',
  [InterestType.Mentor]: 'Quer mentorar',
};

export const dynamic = 'force-dynamic'

export default async function PeoplePage() {
  const people = await fetchPeopleServer();
  
  const groupedByRole = people.reduce((acc, person) => {
    if (!acc[person.role]) {
      acc[person.role] = [];
    }
    acc[person.role].push(person);
    return acc;
  }, {} as Record<PersonRole, typeof people>);
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-gray-100 mb-3 bg-gradient-to-r from-violet-600 to-purple-600 dark:from-violet-400 dark:to-purple-400 bg-clip-text text-transparent">Diretório de Pessoas</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Conecte-se com estudantes, professores, mentores e investidores na comunidade de startups.
        </p>
      </div>
      
      {people.length === 0 ? (
        <EmptyState
          title="Nenhuma pessoa encontrada"
          description="O diretório está vazio no momento."
        />
      ) : (
        <div className="space-y-8">
          {Object.entries(groupedByRole).map(([role, rolePeople]) => {
            const roleLabels: Record<string, string> = {
              Student: 'Estudantes',
              Alumni: 'Ex-alunos',
              Professor: 'Professores',
              Mentor: 'Mentores',
              Investor: 'Investidores',
              External: 'Externos',
            };
            return (
            <div key={role}>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                {roleLabels[role] || role} ({rolePeople.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {rolePeople.map((person) => (
                  <Card key={person.id}>
                    <CardBody>
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
                            {person.name}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                            {person.affiliation}
                          </p>
                        </div>
                        <Badge variant={roleColors[person.role]}>
                          {roleLabels[person.role] || person.role}
                        </Badge>
                      </div>
                      
                      {person.bio && (
                        <p className="text-sm text-gray-700 dark:text-gray-300 mb-3 line-clamp-2">
                          {person.bio}
                        </p>
                      )}
                      
                      <OpportunitiesList
                        offering={person.opportunitiesOffering}
                        seeking={person.opportunitiesSeeking}
                      />
                      
                      <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700 mt-3">
                        <Badge variant="default" className="text-xs">
                          {interestTypeLabels[person.interestType]}
                        </Badge>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {person.interests.length} {person.interests.length === 1 ? 'ideia' : 'ideias'}
                        </span>
                      </div>
                    </CardBody>
                  </Card>
                ))}
              </div>
            </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

