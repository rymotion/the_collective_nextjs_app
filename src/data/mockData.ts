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
}

const MOCK_USERS: User[] = [
  { id: "u1", name: "Alice Director", email: "alice@example.com", imdbId: "nm1234567" },
  { id: "u2", name: "Bob Producer", email: "bob@example.com" },
  { id: "u3", name: "Charlie Fan", email: "charlie@example.com" },
  { id: "u4", name: "Dana Investor", email: "dana@example.com" },
];

const MOCK_PROJECTS: Project[] = [
  {
    id: "p1",
    title: "The Last Horizon",
    author: "Alice Director",
    imageUrl: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&q=80",
    raised: 15000,
    goal: 50000,
    genre: "Sci-Fi",
    synopsis: "In a world where the sun has stopped setting, a lone traveler seeks the last shadow on Earth. A gripping tale of survival, hope, and the blinding light of truth.",
    cast: [
      { name: "John Doe", role: "The Traveler" },
      { name: "Jane Smith", role: "The Scientist" },
    ],
    crew: [
      { name: "Alice Director", role: "Director" },
      { name: "Bob Producer", role: "Producer" },
    ],
    accolades: [
      { title: "Best Screenplay - FutureFest", year: "2024" },
    ],
    funders: [
      { id: "u3", name: "Charlie Fan", amount: 500 },
      { id: "u4", name: "Dana Investor", amount: 10000 },
    ],
    createdAt: "2024-01-01",
  },
  {
    id: "p2",
    title: "Echoes of Silence",
    author: "Sarah Writer",
    imageUrl: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800&q=80",
    raised: 45000,
    goal: 40000,
    genre: "Drama",
    synopsis: "A deaf musician discovers a way to visualize sound, changing the world of music forever. But her invention attracts unwanted attention from a powerful corporation.",
    cast: [
      { name: "Emily Blunt", role: "Musician" },
    ],
    crew: [
      { name: "Sarah Writer", role: "Writer" },
    ],
    accolades: [],
    funders: [
      { id: "u1", name: "Alice Director", amount: 1000 },
    ],
    createdAt: "2024-02-15",
  },
  {
    id: "p3",
    title: "Neon Nights",
    author: "Mike Cyber",
    imageUrl: "https://images.unsplash.com/photo-1555680202-c86f0e12f086?w=800&q=80",
    raised: 5000,
    goal: 100000,
    genre: "Cyberpunk",
    synopsis: "A detective in 2099 Neo-Tokyo uncovers a conspiracy involving synthetic memories and a rogue AI.",
    cast: [],
    crew: [],
    accolades: [],
    funders: [],
    createdAt: "2024-03-10",
  },
  {
    id: "p4",
    title: "The Garden of Time",
    author: "Elena Fantasy",
    imageUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&q=80",
    raised: 25000,
    goal: 30000,
    genre: "Fantasy",
    synopsis: "A young girl discovers a hidden garden where time flows backwards.",
    cast: [],
    crew: [],
    accolades: [{ title: "Audience Choice", year: "2023" }],
    funders: [
      { id: "u2", name: "Bob Producer", amount: 5000 },
    ],
    createdAt: "2024-04-01",
  },
   {
    id: "p5",
    title: "Velocity",
    author: "Jack Speed",
    imageUrl: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&q=80",
    raised: 80000,
    goal: 150000,
    genre: "Action",
    synopsis: "A high-speed chase that never ends. If they stop, they explode.",
    cast: [],
    crew: [],
    accolades: [],
    funders: [],
    createdAt: "2024-04-20",
  },
];

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
