// mock authentication service preparing for Supabase
const SESSION_KEY = 'tangy_mock_session';
const OTP_MOCK = '123456';

export const authService = {
  getCurrentUser: () => {
    try {
      const user = localStorage.getItem(SESSION_KEY);
      return user ? JSON.parse(user) : null;
    } catch (e) {
      return null;
    }
  },

  signInWithEmail: async (email) => {
    // Simulate network delay
    await new Promise(r => setTimeout(r, 600));
    return { success: true, method: 'email', id: email };
  },

  signInWithPhone: async (phone) => {
    await new Promise(r => setTimeout(r, 600));
    return { success: true, method: 'phone', id: phone };
  },

  verifyOtp: async (method, id, otp) => {
    await new Promise(r => setTimeout(r, 800));
    if (otp === OTP_MOCK) {
      const user = {
        id: `mock_${Date.now()}`,
        [method]: id,
        name: method === 'email' ? id.split('@')[0] : 'Member',
        memberSince: new Date().getFullYear(),
      };
      localStorage.setItem(SESSION_KEY, JSON.stringify(user));
      return { success: true, user };
    }
    return { success: false, error: 'Invalid OTP. Use 123456 for testing.' };
  },

  logout: async () => {
    await new Promise(r => setTimeout(r, 400));
    localStorage.removeItem(SESSION_KEY);
    return { success: true };
  }
};
