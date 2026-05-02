import { User, UserRole } from '../types';

export interface RegisteredUser {
  id: string;
  fullName: string;
  identity: string; // TC or Username
  email: string;
  phone: string;
  password: string; // Plain text for demo purposes
  role: UserRole;
  createdAt: number;
  lastLoginAt: number | null;
}

const USERS_STORAGE_KEY = 'arz_registered_users';

export const getRegisteredUsers = (): RegisteredUser[] => {
  try {
    const data = localStorage.getItem(USERS_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error reading registered users:', error);
    return [];
  }
};

export const registerLocalUser = (userData: Omit<RegisteredUser, 'id' | 'createdAt' | 'lastLoginAt'>): RegisteredUser => {
  const users = getRegisteredUsers();
  
  const newUser: RegisteredUser = {
    ...userData,
    id: `user_${Math.random().toString(36).substr(2, 9)}`,
    createdAt: Date.now(),
    lastLoginAt: null
  };
  
  users.push(newUser);
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  
  // Note: For production, use Firebase Auth or a secure backend.
  // localStorage is used here for demo persistence.
  
  return newUser;
};

export const loginUser = async (identity: string, password: string, role: UserRole): Promise<User> => {
  // Simulate delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const users = getRegisteredUsers();
  const foundUser = users.find(u => u.identity === identity || u.email === identity);
  
  if (!foundUser) {
    throw new Error('USER_NOT_FOUND');
  }

  if (foundUser.password !== password) {
    throw new Error('WRONG_PASSWORD');
  }
  
  foundUser.lastLoginAt = Date.now();
  foundUser.role = role; // Update role to what was selected on login if allowed, or keep existing
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  
  return {
    id: foundUser.id,
    name: foundUser.fullName,
    email: foundUser.email,
    role: foundUser.role,
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${foundUser.fullName}`,
  };
};

export const loginGuest = async (role: UserRole = 'citizen'): Promise<User> => {
  await new Promise(resolve => setTimeout(resolve, 600));
  return {
    id: 'guest_' + Math.random().toString(36).substr(2, 9),
    name: 'Misafir Kullanıcı',
    email: 'guest@arz.internal',
    role: role,
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=Guest`,
  };
};

export const loginGoogleMailDemo = async (role: UserRole = 'citizen'): Promise<User> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return {
    id: 'google_' + Math.random().toString(36).substr(2, 9),
    name: 'Google Kullanıcısı',
    email: 'demo@arz.local',
    role: role,
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=GoogleUser`,
    loginMethod: 'google-mail-demo' as any
  };
};

export const loginEdevletDemo = async (role: UserRole = 'citizen'): Promise<User> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return {
    id: 'edevlet_' + Math.random().toString(36).substr(2, 9),
    name: 'e-Devlet Vatandaşı',
    email: 'edevlet@turkiye.gov.tr',
    role: role,
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=Turkey`,
    loginMethod: 'edevlet-demo' as any
  };
};

export const saveAuthSession = (user: User, method: string, rememberMe: boolean, identity?: string) => {
  const session = {
    isAuthenticated: true,
    userId: user.id,
    loginMethod: method,
    createdAt: Date.now(),
    expiresAt: Date.now() + 86400000 // 24 hours default
  };

  if (rememberMe) {
    localStorage.setItem('arz_remembered_login', JSON.stringify({
      identity: identity || user.email,
      role: user.role,
      loginMethod: method
    }));
    session.expiresAt = Date.now() + 30 * 86400000; // 30 days
  } else if (method === 'email') {
    localStorage.removeItem('arz_remembered_login');
  }

  localStorage.setItem('arz_auth_session', JSON.stringify(session));
  localStorage.setItem('arz_user_profile', JSON.stringify(user));
  localStorage.setItem('arz_selected_role', user.role);
};

export const logout = () => {
  localStorage.removeItem('arz_auth_session');
  localStorage.removeItem('arz_user_profile');
};

export const clearAuthSession = logout; // Alias for compatibility

export const restoreSession = (): User | null => {
  try {
    const sessionStr = localStorage.getItem('arz_auth_session');
    const profileStr = localStorage.getItem('arz_user_profile');

    if (!sessionStr || !profileStr) return null;

    const session = JSON.parse(sessionStr);
    const profile = JSON.parse(profileStr);

    if (!session.isAuthenticated || (session.expiresAt && session.expiresAt < Date.now())) {
      logout();
      return null;
    }

    return profile;
  } catch (error) {
    console.error('Session restoration failed:', error);
    logout();
    return null;
  }
};

export const getRememberedUser = () => {
  try {
    const saved = localStorage.getItem('arz_remembered_login');
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
};

// Legacy support for mockLogin during transition
export const mockLogin = async (
  method: string,
  params: any
): Promise<User> => {
  if (method === 'guest') return loginGuest(params.role);
  if (method === 'edevlet') return loginEdevletDemo(params.role);
  if (method === 'google' || method === 'outlook' || method === 'apple') return loginGoogleMailDemo(params.role);
  
  if (method === 'email' && params.identity && params.password) {
    return loginUser(params.identity, params.password, params.role || 'citizen');
  }
  
  return loginGuest('citizen');
};
