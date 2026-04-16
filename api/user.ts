export const DEMO_USERS = {
  'demo@gmail.com': { password: 'password', name: 'Demo User' },
  'test@gmail.com': { password: 'test123', name: 'Test User' },
};

export function getDemoUserByCredentials(email: string, password: string) {
  const user = DEMO_USERS[email as keyof typeof DEMO_USERS];
  if (!user) return null;
  if (user.password !== password) return null;
  return user;
}
