import { Idea, IdeaFilters, IdeaWithInterests } from '@/types';
import { getApiUrl } from '@/lib/utils/url';

export async function fetchIdeas(filters?: IdeaFilters): Promise<Idea[]> {
  const params = new URLSearchParams();
  
  if (filters?.category) {
    params.append('category', filters.category);
  }
  if (filters?.stage) {
    params.append('stage', filters.stage);
  }
  if (filters?.searchQuery) {
    params.append('search', filters.searchQuery);
  }
  if (filters?.sortBy) {
    params.append('sortBy', filters.sortBy);
  }

  const url = getApiUrl(`/api/ideas?${params.toString()}`);
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error('Erro ao buscar ideias');
  }
  
  return response.json();
}

export async function fetchIdeaById(id: string): Promise<Idea | null> {
  const url = getApiUrl(`/api/ideas/${id}`);
  const response = await fetch(url);
  
  if (!response.ok) {
    if (response.status === 404) {
      return null;
    }
    throw new Error('Erro ao buscar ideia');
  }
  
  return response.json();
}

export async function fetchIdeaWithInterests(id: string): Promise<(IdeaWithInterests & { authorId: string }) | null> {
  const idea = await fetchIdeaById(id);
  
  if (!idea) {
    return null;
  }

  const url = getApiUrl(`/api/interests?ideaId=${id}`);
  const response = await fetch(url);
  const interests = response.ok ? await response.json() : [];

  return {
    ...idea,
    authorId: (idea as any).authorId || '',
    interestedPeople: interests.map((interest: any) => ({
      id: interest.user.id,
      name: interest.user.name,
      role: interest.user.role,
      affiliation: '',
      email: '',
      interests: [],
      interestType: interest.interestType,
      interestTypeForIdea: interest.interestType,
      avatarUrl: interest.user.avatarUrl
    }))
  } as IdeaWithInterests & { authorId: string };
}

