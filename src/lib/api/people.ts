import { Person } from '@/types';
import { getApiUrl } from '@/lib/utils/url';

export async function fetchPeople(): Promise<Person[]> {
  const url = getApiUrl('/api/users');
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error('Erro ao buscar pessoas');
  }
  
  const users = await response.json();
  
  return users.map((user: any) => ({
    id: user.id,
    name: user.name,
    role: user.role,
    affiliation: user.affiliation || '',
    email: user.email,
    avatarUrl: user.avatarUrl,
    bio: user.bio,
    interests: [],
    interestType: 'Explore' as any,
    opportunitiesOffering: [],
    opportunitiesSeeking: []
  }));
}

export async function fetchPersonById(id: string): Promise<Person | null> {
  const url = getApiUrl(`/api/users?id=${id}`);
  const response = await fetch(url);
  
  if (!response.ok) {
    if (response.status === 404) {
      return null;
    }
    throw new Error('Erro ao buscar pessoa');
  }
  
  const user = await response.json();
  
  if (!user || user.length === 0) {
    return null;
  }
  
  const person = user[0];
  
  return {
    id: person.id,
    name: person.name,
    role: person.role,
    affiliation: person.affiliation || '',
    email: person.email,
    avatarUrl: person.avatarUrl,
    bio: person.bio,
    interests: [],
    interestType: 'Explore' as any,
    opportunitiesOffering: [],
    opportunitiesSeeking: []
  };
}

