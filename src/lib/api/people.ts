import { Person } from '@/types';
import { getAllPeople, getPersonById } from '@/data';

export async function fetchPeople(): Promise<Person[]> {
  return getAllPeople();
}

export async function fetchPersonById(id: string): Promise<Person | null> {
  const person = getPersonById(id);
  return person || null;
}

