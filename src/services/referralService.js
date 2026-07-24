import { authService } from './authService';
import { loyaltyService } from './loyaltyService';

const REFERRAL_KEY = 'tangy_referral_stats';

export const referralService = {
  getReferralCode: () => {
    const user = authService.getCurrentUser();
    if (!user) return null;
    return `TANGY-${user.name.toUpperCase().substring(0,5)}-${user.id.substring(user.id.length - 4)}`;
  },

  getReferralStats: () => {
    const user = authService.getCurrentUser();
    if (!user) return { totalReferrals: 0 };
    const raw = localStorage.getItem(`${REFERRAL_KEY}_${user.id}`);
    return raw ? JSON.parse(raw) : { totalReferrals: 0 };
  },

  // Mock processing a referral (simulate another user signing up)
  simulateReferralSignup: async () => {
    const user = authService.getCurrentUser();
    if (!user) return false;
    
    const stats = referralService.getReferralStats();
    stats.totalReferrals += 1;
    localStorage.setItem(`${REFERRAL_KEY}_${user.id}`, JSON.stringify(stats));
    
    // Add 5 points
    await loyaltyService.addPoints(5, 'Successful Referral');
    return true;
  }
};
