import { authService } from './authService';

const LOYALTY_KEY = 'tangy_loyalty_data';

// Helper to get or init loyalty data for a user
const getLoyaltyData = (userId) => {
  if (!userId) return null;
  const raw = localStorage.getItem(`${LOYALTY_KEY}_${userId}`);
  if (raw) return JSON.parse(raw);
  return { points: 0, history: [] };
};

const saveLoyaltyData = (userId, data) => {
  localStorage.setItem(`${LOYALTY_KEY}_${userId}`, JSON.stringify(data));
};

export const loyaltyService = {
  getTangyPoints: async () => {
    const user = authService.getCurrentUser();
    if (!user) return { points: 0, history: [] };
    return getLoyaltyData(user.id);
  },

  addPoints: async (amount, reason) => {
    const user = authService.getCurrentUser();
    if (!user) return false;
    const data = getLoyaltyData(user.id);
    data.points += amount;
    data.history.unshift({ type: 'earn', amount, reason, date: new Date().toISOString() });
    saveLoyaltyData(user.id, data);
    return true;
  },

  redeemPoints: async (amount, reason) => {
    const user = authService.getCurrentUser();
    if (!user) return { success: false, error: 'Not logged in' };
    const data = getLoyaltyData(user.id);
    if (data.points < amount) return { success: false, error: 'Not enough Tangy Points' };
    
    data.points -= amount;
    data.history.unshift({ type: 'redeem', amount: -amount, reason, date: new Date().toISOString() });
    saveLoyaltyData(user.id, data);
    return { success: true };
  }
};
