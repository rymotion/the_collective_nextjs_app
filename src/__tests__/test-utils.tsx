import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';

interface MockAuthContextValue {
  user: any;
  isAuthenticated: boolean;
  loading: boolean;
  signIn: jest.Mock;
  signUp: jest.Mock;
  signOut: jest.Mock;
}

export const mockAuthContext: MockAuthContextValue = {
  user: null,
  isAuthenticated: false,
  loading: false,
  signIn: jest.fn(),
  signUp: jest.fn(),
  signOut: jest.fn(),
};

export const mockAuthenticatedUser = {
  id: 'user-123',
  email: 'test@example.com',
  created_at: new Date().toISOString(),
};

export const mockProject = {
  id: 'project-123',
  title: 'Test Film Project',
  author_id: 'user-123',
  synopsis: 'A test film synopsis',
  genre: 'Drama',
  goal: 50000,
  raised: 25000,
  status: 'active' as const,
  is_published: true,
  country_of_origin: 'United States',
  funding_duration_days: 30,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  modified_at: new Date().toISOString(),
  deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
  image_url: 'https://example.com/image.jpg',
};

export const mockDraftProject = {
  ...mockProject,
  id: 'draft-123',
  is_published: false,
  status: 'draft' as const,
};

export const mockCrewInvitation = {
  id: 'invitation-123',
  project_id: 'project-123',
  full_name: 'John Doe',
  email: 'john@example.com',
  invited_by: 'user-123',
  status: 'pending' as const,
  created_at: new Date().toISOString(),
  modified_at: new Date().toISOString(),
};

export function createMockSupabaseClient() {
  return {
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    delete: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    order: jest.fn().mockReturnThis(),
    range: jest.fn().mockReturnThis(),
    single: jest.fn().mockReturnThis(),
    maybeSingle: jest.fn().mockReturnThis(),
    textSearch: jest.fn().mockReturnThis(),
    auth: {
      signUp: jest.fn(),
      signInWithPassword: jest.fn(),
      signOut: jest.fn(),
      resetPasswordForEmail: jest.fn(),
      updateUser: jest.fn(),
      getSession: jest.fn(),
      getUser: jest.fn(),
      onAuthStateChange: jest.fn(() => ({
        data: { subscription: { unsubscribe: jest.fn() } },
      })),
    },
  };
}

export function mockSupabaseResponse<T>(data: T, error: any = null) {
  return {
    data,
    error,
    count: Array.isArray(data) ? data.length : null,
  };
}

export function mockSupabaseError(message: string) {
  return {
    data: null,
    error: { message, details: '', hint: '', code: '' },
  };
}

const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react';
export { customRender as render };

export const waitForLoadingToFinish = () =>
  new Promise((resolve) => setTimeout(resolve, 0));

export function createMockRouter() {
  return {
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
    prefetch: jest.fn(),
    pathname: '/',
    query: {},
    asPath: '/',
  };
}
