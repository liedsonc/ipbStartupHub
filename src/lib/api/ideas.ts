import { Idea, IdeaFilters, IdeaWithInterests, InterestType } from '@/types';
import {
  getAllIdeas,
  getIdeaById,
  filterIdeas,
  getIdeaWithInterests as getIdeaWithInterestsData,
  addInterest as addInterestData,
  addIdea as addIdeaData,
} from '@/data';

export async function fetchIdeas(filters?: IdeaFilters): Promise<Idea[]> {
  if (filters) {
    return filterIdeas(filters);
  }
  return getAllIdeas();
}

export async function fetchIdeaById(id: string): Promise<Idea | null> {
  const idea = getIdeaById(id);
  return idea || null;
}

export async function fetchIdeaWithInterests(id: string): Promise<IdeaWithInterests | null> {
  const idea = getIdeaWithInterestsData(id);
  return idea || null;
}

export async function createInterest(
  ideaId: string,
  personId: string,
  interestType: InterestType
): Promise<void> {
  addInterestData(ideaId, personId, interestType);
}

export async function createIdea(
  ideaData: Omit<Idea, 'id' | 'publishedAt' | 'interestCount' | 'interestedPersonIds'>
): Promise<Idea> {
  return addIdeaData(ideaData);
}

