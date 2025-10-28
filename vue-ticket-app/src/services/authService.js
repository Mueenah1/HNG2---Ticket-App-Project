const SESSION_KEY = 'ticketapp_session';

// Mock user database
const mockUser = {
  email: 'admin@test.com',
  password: 'password123',
  name: 'Admin User'
};

export const authService = {
  login: (email, password) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (email === mockUser.email && password === mockUser.password) {
          const token = 'mock_token_12345abcdef';
          localStorage.setItem(SESSION_KEY, JSON.stringify({ token, name: mockUser.name }));
          resolve({ success: true, user: { name: mockUser.name } });
        } else {
          reject(new Error('Invalid credentials. Please try again.'));
        }
      }, 500);
    });
  },

  signup: (email, password) => {
     return new Promise((resolve) => {
      setTimeout(() => {
        const token = 'mock_token_12345abcdef';
        localStorage.setItem(SESSION_KEY, JSON.stringify({ token, name: 'New User' }));
        resolve({ success: true, user: { name: 'New User' } });
      }, 500);
    });
  },

  logout: () => {
    localStorage.removeItem(SESSION_KEY);
  },

  isAuthenticated: () => {
    const session = localStorage.getItem(SESSION_KEY);
    return session !== null;
  }
};