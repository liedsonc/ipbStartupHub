export enum IdeaCategory {
  Tech = 'Tech',
  Healthcare = 'Healthcare',
  Sustainability = 'Sustainability',
  SocialImpact = 'SocialImpact',
  Education = 'Education',
  Other = 'Other',
}

export enum IdeaStage {
  Idea = 'Idea',
  EarlyDevelopment = 'EarlyDevelopment',
  Prototype = 'Prototype',
  SeekingFunding = 'SeekingFunding',
}

export enum PersonRole {
  Student = 'Student',
  Alumni = 'Alumni',
  Professor = 'Professor',
  Mentor = 'Mentor',
  Investor = 'Investor',
  External = 'External',
}

export enum InterestType {
  Collaborate = 'Collaborate',
  Fund = 'Fund',
  Explore = 'Explore',
  Mentor = 'Mentor',
}

export enum OpportunityType {
  Investor = 'Investor',
  CoFounder = 'CoFounder',
  Engineer = 'Engineer',
  Developer = 'Developer',
  Designer = 'Designer',
  Business = 'Business',
  Marketing = 'Marketing',
  Sales = 'Sales',
  HR = 'HR',
  Accountant = 'Accountant',
  Legal = 'Legal',
  DataScientist = 'DataScientist',
  ProductManager = 'ProductManager',
  Mentor = 'Mentor',
  Advisor = 'Advisor',
  Other = 'Other',
}

export enum OpportunityEngagement {
  Partner = 'Partner',
  CoFounder = 'CoFounder',
  FullTime = 'FullTime',
  PartTime = 'PartTime',
  Internship = 'Internship',
  Volunteer = 'Volunteer',
  Consultant = 'Consultant',
  Mentor = 'Mentor',
  Advisor = 'Advisor',
}

export interface OpenOpportunity {
  type: OpportunityType;
  engagement: OpportunityEngagement;
  description?: string;
}

export enum FundingStatus {
  Open = 'Open',
  InDiscussion = 'InDiscussion',
  Closed = 'Closed',
}

export interface Idea {
  id: string;
  title: string;
  description: string;
  shortDescription: string;
  category: IdeaCategory;
  stage: IdeaStage;
  contactEmail: string;
  publishedAt: string;
  authorName: string;
  authorRole: string;
  tags: string[];
  interestCount: number;
  interestedPersonIds: string[];
  openOpportunities?: OpenOpportunity[];
}

export interface Person {
  id: string;
  name: string;
  role: PersonRole;
  affiliation: string;
  email: string;
  avatarUrl?: string;
  bio?: string;
  interests: string[];
  interestType: InterestType;
  opportunitiesOffering?: OpportunityType[];
  opportunitiesSeeking?: OpportunityType[];
}

export interface InterestSignal {
  id: string;
  ideaId: string;
  personId: string;
  interestType: InterestType;
  message?: string;
  createdAt: string;
}

export interface FundingOpportunity {
  id: string;
  ideaId: string;
  amount?: number;
  stage: string;
  interestedInvestorIds: string[];
  status: FundingStatus;
}

export interface PersonWithInterest extends Person {
  interestTypeForIdea: InterestType;
}

export interface IdeaWithInterests extends Idea {
  interestedPeople: PersonWithInterest[];
}

export interface PersonWithIdeas extends Person {
  interestedIdeas: Idea[];
}

export interface IdeaFilters {
  category?: IdeaCategory;
  stage?: IdeaStage;
  searchQuery?: string;
  sortBy?: 'newest' | 'mostInterest';
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: PersonRole;
  affiliation?: string;
  avatarUrl?: string;
  bio?: string;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}
