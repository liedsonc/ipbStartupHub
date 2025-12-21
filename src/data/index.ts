import { Idea, Person, InterestSignal, IdeaWithInterests, IdeaFilters, InterestType, PersonWithInterest } from '../types';
import { mockIdeas } from './mockIdeas';
import { mockPeople } from './mockPeople';
import { mockInterests } from './mockInterests';

let ideas: Idea[] = [...mockIdeas];
let interests: InterestSignal[] = [...mockInterests];

export const getAllIdeas = (): Idea[] => {
  return [...ideas];
};

export const getIdeaById = (id: string): Idea | undefined => {
  return ideas.find(idea => idea.id === id);
};

export const getPersonById = (id: string): Person | undefined => {
  return mockPeople.find(person => person.id === id);
};

export const getInterestsByIdeaId = (ideaId: string): InterestSignal[] => {
  return interests.filter(interest => interest.ideaId === ideaId);
};

export const getPeopleByIdeaId = (ideaId: string): Array<Person & { interestTypeForIdea: InterestType }> => {
  const interestSignals = getInterestsByIdeaId(ideaId);
  return interestSignals.map(interest => {
    const person = mockPeople.find(p => p.id === interest.personId);
    if (!person) throw new Error(`Person ${interest.personId} not found`);
    return { ...person, interestTypeForIdea: interest.interestType };
  });
};

export const getIdeaWithInterests = (ideaId: string): IdeaWithInterests | undefined => {
  const idea = getIdeaById(ideaId);
  if (!idea) return undefined;

  const interestedPeople = getPeopleByIdeaId(ideaId) as PersonWithInterest[];
  return {
    ...idea,
    interestedPeople,
  };
};

export const filterIdeas = (filters: IdeaFilters): Idea[] => {
  let filtered = [...ideas];

  if (filters.category) {
    filtered = filtered.filter(idea => idea.category === filters.category);
  }

  if (filters.stage) {
    filtered = filtered.filter(idea => idea.stage === filters.stage);
  }

  if (filters.searchQuery) {
    const query = filters.searchQuery.toLowerCase();
    filtered = filtered.filter(idea =>
      idea.title.toLowerCase().includes(query) ||
      idea.description.toLowerCase().includes(query) ||
      idea.shortDescription.toLowerCase().includes(query) ||
      idea.tags.some(tag => tag.toLowerCase().includes(query))
    );
  }

  if (filters.sortBy === 'mostInterest') {
    filtered.sort((a, b) => b.interestCount - a.interestCount);
  } else {
    filtered.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
  }

  return filtered;
};

export const searchIdeas = (query: string): Idea[] => {
  return filterIdeas({ searchQuery: query });
};

export const addInterest = (ideaId: string, personId: string, type: InterestType): InterestSignal => {
  const idea = getIdeaById(ideaId);
  if (!idea) {
    throw new Error(`Idea with id ${ideaId} not found`);
  }

  const person = getPersonById(personId);
  if (!person) {
    throw new Error(`Person with id ${personId} not found`);
  }

  const newInterest: InterestSignal = {
    id: `interest-${Date.now()}`,
    ideaId,
    personId,
    interestType: type,
    createdAt: new Date().toISOString(),
  };

  interests.push(newInterest);
  idea.interestCount += 1;
  idea.interestedPersonIds.push(personId);

  if (!person.interests.includes(ideaId)) {
    person.interests.push(ideaId);
  }

  return newInterest;
};

export const addIdea = (ideaData: Omit<Idea, 'id' | 'publishedAt' | 'interestCount' | 'interestedPersonIds'>): Idea => {
  const newIdea: Idea = {
    ...ideaData,
    id: `idea-${String(ideas.length + 1).padStart(3, '0')}`,
    publishedAt: new Date().toISOString(),
    interestCount: 0,
    interestedPersonIds: [],
  };

  ideas.push(newIdea);
  return newIdea;
};

export const getAllPeople = (): Person[] => {
  return [...mockPeople];
};

export const getAllInterests = (): InterestSignal[] => {
  return [...interests];
};

