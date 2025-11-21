import { render, screen } from '@testing-library/react';
import ProjectCard from '../ProjectCard';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
  })),
}));

describe('ProjectCard', () => {
  const mockProject = {
    id: 'project-123',
    title: 'Test Film',
    author: 'John Doe',
    synopsis: 'A compelling story about filmmaking',
    genre: 'Drama',
    imageUrl: 'https://example.com/image.jpg',
    goal: 50000,
    raised: 25000,
    backers: 100,
  };

  it('should render project title', () => {
    render(<ProjectCard project={mockProject} />);
    expect(screen.getByText('Test Film')).toBeInTheDocument();
  });

  it('should render project author', () => {
    render(<ProjectCard project={mockProject} />);
    expect(screen.getByText(/John Doe/i)).toBeInTheDocument();
  });

  it('should render project synopsis', () => {
    render(<ProjectCard project={mockProject} />);
    expect(screen.getByText(/A compelling story about filmmaking/i)).toBeInTheDocument();
  });

  it('should render project genre', () => {
    render(<ProjectCard project={mockProject} />);
    expect(screen.getByText('Drama')).toBeInTheDocument();
  });

  it('should display funding progress', () => {
    render(<ProjectCard project={mockProject} />);
    expect(screen.getByText(/25000/)).toBeInTheDocument();
    expect(screen.getByText(/50000/)).toBeInTheDocument();
  });

  it('should calculate funding percentage correctly', () => {
    render(<ProjectCard project={mockProject} />);
    const percentage = (25000 / 50000) * 100;
    expect(screen.getByText(`${percentage}%`)).toBeInTheDocument();
  });

  it('should display number of backers', () => {
    render(<ProjectCard project={mockProject} />);
    expect(screen.getByText(/100/)).toBeInTheDocument();
  });

  it('should render project image with correct src', () => {
    render(<ProjectCard project={mockProject} />);
    const image = screen.getByRole('img');
    expect(image).toHaveAttribute('src', expect.stringContaining('image.jpg'));
  });

  it('should handle missing optional fields', () => {
    const minimalProject = {
      ...mockProject,
      imageUrl: undefined,
      backers: undefined,
    };

    render(<ProjectCard project={minimalProject} />);
    expect(screen.getByText('Test Film')).toBeInTheDocument();
  });
});
