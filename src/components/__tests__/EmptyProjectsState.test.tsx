import { render, screen, fireEvent } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import EmptyProjectsState from '../EmptyProjectsState';
import { useSupabaseAuth } from '@/context/SupabaseAuthContext';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('@/context/SupabaseAuthContext', () => ({
  useSupabaseAuth: jest.fn(),
}));

describe('EmptyProjectsState', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
  });

  it('should render empty state with heading and description', () => {
    (useSupabaseAuth as jest.Mock).mockReturnValue({
      isAuthenticated: false,
    });

    render(<EmptyProjectsState locale="en" />);

    expect(screen.getByText('No Projects Yet')).toBeInTheDocument();
    expect(
      screen.getByText(/Be the first to bring your cinematic vision to life/i)
    ).toBeInTheDocument();
  });

  it('should render pitch button', () => {
    (useSupabaseAuth as jest.Mock).mockReturnValue({
      isAuthenticated: false,
    });

    render(<EmptyProjectsState locale="en" />);

    const button = screen.getByRole('button', { name: /Pitch Your Screenplay/i });
    expect(button).toBeInTheDocument();
  });

  it('should redirect authenticated users to create-pitch', () => {
    (useSupabaseAuth as jest.Mock).mockReturnValue({
      isAuthenticated: true,
    });

    render(<EmptyProjectsState locale="en" />);

    const button = screen.getByRole('button', { name: /Pitch Your Screenplay/i });
    fireEvent.click(button);

    expect(mockPush).toHaveBeenCalledWith('/en/create-pitch');
  });

  it('should redirect unauthenticated users to signin', () => {
    (useSupabaseAuth as jest.Mock).mockReturnValue({
      isAuthenticated: false,
    });

    render(<EmptyProjectsState locale="en" />);

    const button = screen.getByRole('button', { name: /Pitch Your Screenplay/i });
    fireEvent.click(button);

    expect(mockPush).toHaveBeenCalledWith('/en/auth/signin?redirect=/create-pitch');
  });

  it('should render feature cards', () => {
    (useSupabaseAuth as jest.Mock).mockReturnValue({
      isAuthenticated: false,
    });

    render(<EmptyProjectsState locale="en" />);

    expect(screen.getByText('Share Your Story')).toBeInTheDocument();
    expect(screen.getByText('Build Your Team')).toBeInTheDocument();
    expect(screen.getByText('Get Funded')).toBeInTheDocument();
  });

  it('should use correct locale in redirect URLs', () => {
    (useSupabaseAuth as jest.Mock).mockReturnValue({
      isAuthenticated: true,
    });

    render(<EmptyProjectsState locale="es" />);

    const button = screen.getByRole('button', { name: /Pitch Your Screenplay/i });
    fireEvent.click(button);

    expect(mockPush).toHaveBeenCalledWith('/es/create-pitch');
  });
});
