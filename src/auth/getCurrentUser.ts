export interface User {
  id: string;
  name?: string;
  email?: string;
}

// Stub function - replace with actual authentication logic
export const getCurrentUser = (): User | null => {
  // In development, return a mock user for testing
  if (import.meta.env.DEV) {
    return {
      id: 'test-user-1',
      name: 'Test User',
      email: 'test@example.com',
    };
  }

  // In production, return null since we don't have real auth yet
  return null;
};
