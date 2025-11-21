import { AuthService } from '../auth.service';
import { supabase } from '@/lib/supabase';

jest.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      signUp: jest.fn(),
      signInWithPassword: jest.fn(),
      signOut: jest.fn(),
      resetPasswordForEmail: jest.fn(),
      updateUser: jest.fn(),
      getSession: jest.fn(),
      getUser: jest.fn(),
    },
  },
}));

describe('AuthService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('signUp', () => {
    it('should successfully sign up a user', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        created_at: new Date().toISOString(),
      };

      (supabase.auth.signUp as jest.Mock).mockResolvedValue({
        data: { user: mockUser, session: { access_token: 'token' } },
        error: null,
      });

      const result = await AuthService.signUp({
        email: 'test@example.com',
        password: 'password123',
      });

      expect(supabase.auth.signUp).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
      expect(result.user).toEqual(mockUser);
    });

    it('should throw error on sign up failure', async () => {
      (supabase.auth.signUp as jest.Mock).mockResolvedValue({
        data: { user: null, session: null },
        error: { message: 'Email already exists' },
      });

      await expect(
        AuthService.signUp({
          email: 'test@example.com',
          password: 'password123',
        })
      ).rejects.toThrow();
    });
  });

  describe('signIn', () => {
    it('should successfully sign in a user', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
      };

      (supabase.auth.signInWithPassword as jest.Mock).mockResolvedValue({
        data: { user: mockUser, session: { access_token: 'token' } },
        error: null,
      });

      const result = await AuthService.signIn({
        email: 'test@example.com',
        password: 'password123',
      });

      expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
      expect(result.user).toEqual(mockUser);
    });

    it('should throw error on invalid credentials', async () => {
      (supabase.auth.signInWithPassword as jest.Mock).mockResolvedValue({
        data: { user: null, session: null },
        error: { message: 'Invalid credentials' },
      });

      await expect(
        AuthService.signIn({
          email: 'test@example.com',
          password: 'wrongpassword',
        })
      ).rejects.toThrow();
    });
  });

  describe('signOut', () => {
    it('should successfully sign out', async () => {
      (supabase.auth.signOut as jest.Mock).mockResolvedValue({
        error: null,
      });

      await AuthService.signOut();

      expect(supabase.auth.signOut).toHaveBeenCalled();
    });

    it('should handle sign out errors', async () => {
      (supabase.auth.signOut as jest.Mock).mockResolvedValue({
        error: { message: 'Sign out failed' },
      });

      await expect(AuthService.signOut()).rejects.toThrow();
    });
  });

  describe('resetPassword', () => {
    it('should send password reset email', async () => {
      (supabase.auth.resetPasswordForEmail as jest.Mock).mockResolvedValue({
        data: {},
        error: null,
      });

      await AuthService.resetPassword('test@example.com');

      expect(supabase.auth.resetPasswordForEmail).toHaveBeenCalledWith(
        'test@example.com'
      );
    });

    it('should handle password reset errors', async () => {
      (supabase.auth.resetPasswordForEmail as jest.Mock).mockResolvedValue({
        data: null,
        error: { message: 'Email not found' },
      });

      await expect(
        AuthService.resetPassword('test@example.com')
      ).rejects.toThrow();
    });
  });

  describe('getCurrentUser', () => {
    it('should return current user', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
      };

      (supabase.auth.getUser as jest.Mock).mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      const user = await AuthService.getCurrentUser();

      expect(supabase.auth.getUser).toHaveBeenCalled();
      expect(user).toEqual(mockUser);
    });

    it('should return null when no user is logged in', async () => {
      (supabase.auth.getUser as jest.Mock).mockResolvedValue({
        data: { user: null },
        error: null,
      });

      const user = await AuthService.getCurrentUser();

      expect(user).toBeNull();
    });
  });

  describe('getSession', () => {
    it('should return current session', async () => {
      const mockSession = {
        access_token: 'token',
        refresh_token: 'refresh',
        user: { id: 'user-123' },
      };

      (supabase.auth.getSession as jest.Mock).mockResolvedValue({
        data: { session: mockSession },
        error: null,
      });

      const session = await AuthService.getSession();

      expect(supabase.auth.getSession).toHaveBeenCalled();
      expect(session).toEqual(mockSession);
    });

    it('should return null when no session exists', async () => {
      (supabase.auth.getSession as jest.Mock).mockResolvedValue({
        data: { session: null },
        error: null,
      });

      const session = await AuthService.getSession();

      expect(session).toBeNull();
    });
  });
});
