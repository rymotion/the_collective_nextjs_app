export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  imdbId?: string;
}

export interface CastMember {
  name: string;
  role: string;
  imageUrl?: string;
}

export interface Accolade {
  title: string;
  year: string;
}

export interface Funder {
  id: string;
  name: string;
  amount: number;
  imageUrl?: string;
}

export interface Project {
  id: string;
  title: string;
  author: string;
  imageUrl: string;
  raised: number;
  goal: number;
  genre: string;
  synopsis: string;
  cast: CastMember[];
  crew: CastMember[];
  accolades: Accolade[];
  funders: Funder[];
  createdAt: string;
  deadline?: string;
}

const MOCK_USERS: User[] = [];

const MOCK_PROJECTS: Project[] = [];

export async function getProjects(page: number = 1, limit: number = 10): Promise<{ data: Project[], total: number }> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500));
  
  const start = (page - 1) * limit;
  const end = start + limit;
  const data = MOCK_PROJECTS.slice(start, end);
  
  return {
    data,
    total: MOCK_PROJECTS.length,
  };
}

export async function getProject(id: string): Promise<Project | undefined> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return MOCK_PROJECTS.find((p) => p.id === id);
}

export async function getUser(id: string): Promise<User | undefined> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return MOCK_USERS.find((u) => u.id === id);
}
