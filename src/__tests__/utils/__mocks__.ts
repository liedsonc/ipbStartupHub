import { Role } from '@prisma/client'
import { IdeaCategory, IdeaStage, InterestType, PersonRole } from '@/types'

export const mockUser = {
  id: 'user-1',
  email: 'test@example.com',
  name: 'Test User',
  role: 'Student' as Role,
  emailVerified: true,
}

export const mockSession = {
  user: mockUser,
  expires: '2024-12-31',
}

export const mockIdea = {
  id: 'idea-1',
  title: 'Test Idea',
  description: 'Test Description',
  shortDescription: 'Short description',
  category: IdeaCategory.Tech,
  stage: IdeaStage.Idea,
  contactEmail: 'test@example.com',
  publishedAt: new Date().toISOString(),
  authorName: 'Test User',
  authorRole: 'Student' as PersonRole,
  authorId: 'user-1',
  tags: ['tag1', 'tag2'],
  interestCount: 0,
  interestedPersonIds: [],
  interestedPeople: [],
  openOpportunities: [],
}

export const mockPerson = {
  id: 'person-1',
  name: 'Test Person',
  role: PersonRole.Student,
  affiliation: 'Test Affiliation',
  bio: 'Test Bio',
  interestType: InterestType.Explore,
  interests: [],
  opportunitiesOffering: [],
  opportunitiesSeeking: [],
}

export const mockNotification = {
  id: 'notif-1',
  type: 'collaboration' as const,
  entityType: 'interest_signal' as const,
  entityId: 'interest-1',
  message: 'Test message',
  read: false,
  createdAt: new Date().toISOString(),
  ideaId: 'idea-1',
  ideaTitle: 'Test Idea',
  requesterId: 'user-2',
  requesterName: 'Requester User',
  requesterRole: 'Student' as PersonRole,
  requesterEmail: 'requester@example.com',
  requesterAvatarUrl: null,
  interestMessage: null,
}

