/**
 * Subscription Slice
 */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { firebaseDb } from '../../firebase/config.ts';

export type SubscriptionPlan = 'free' | 'monthly' | 'yearly';

interface SubscriptionState {
  currentPlan: SubscriptionPlan;
  isActive: boolean;
  expiresAt: Date | null;
  isPremium: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: SubscriptionState = {
  currentPlan: 'free',
  isActive: false,
  expiresAt: null,
  isPremium: false,
  loading: false,
  error: null,
};

const subscriptionSlice = createSlice({
  name: 'subscription',
  initialState,
  reducers: {
    // Set subscription plan
    setSubscription: (
      state,
      action: PayloadAction<{
        plan: SubscriptionPlan;
        expiresAt?: Date;
      }>,
    ) => {
      state.currentPlan = action.payload.plan;
      state.isPremium = action.payload.plan !== 'free';
      state.isActive = action.payload.plan !== 'free';
      state.expiresAt = action.payload.expiresAt || null;
      state.error = null;
    },

    // Set loading state
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },

    // Set error
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.loading = false;
    },

    // Cancel subscription
    cancelSubscription: state => {
      state.currentPlan = 'free';
      state.isActive = false;
      state.expiresAt = null;
      state.isPremium = false;
    },

    clearSubscription: () => initialState,
  },
});

export const {
  setSubscription,
  setLoading,
  setError,
  cancelSubscription,
  clearSubscription,
} = subscriptionSlice.actions;

export default subscriptionSlice.reducer;

// ============================================
// THUNK ACTIONS (Async operations)
// ============================================

/**
 * Subscribe user to a plan
 * Saves subscription data to Firestore
 */

export const subscribeToPlan =
  (userId: string, plan: SubscriptionPlan) => async (dispatch: any) => {
    dispatch(setLoading(true));

    try {
      // Calculate expiration date
      const expiresAt = new Date();
      if (plan === 'monthly') {
        expiresAt.setMonth(expiresAt.getMonth() + 1);
      } else if (plan === 'yearly') {
        expiresAt.setFullYear(expiresAt.getFullYear() + 1);
      }

      // Save to Firestore
      await firebaseDb()
        .collection('subscriptions')
        .doc(userId)
        .set({
          plan,
          isActive: plan !== 'free',
          expiresAt: plan !== 'free' ? expiresAt : null,
          updatedAt: firebaseDb.FieldValue.serverTimestamp(),
        });

      // Update Redux state
      dispatch(
        setSubscription({
          plan,
          expiresAt: plan !== 'free' ? expiresAt : undefined,
        }),
      );
    } catch (error: any) {
      dispatch(setError(error.message));
      throw error;
    }
  };

/**
 * Fetch user's subscription status
 * Called when app starts or user logs in
 */
export const fetchSubscription = (userId: string) => async (dispatch: any) => {
  dispatch(setLoading(true));
  try {
    const subscriptionDoc = await firebaseDb()
      .collection('subscriptions')
      .doc(userId)
      .get();

    if (subscriptionDoc.exists()) {
      const data = subscriptionDoc.data();
      dispatch(
        setSubscription({
          plan: data?.plan || 'free',
          expiresAt: data?.expiresAt?.toDate(),
        }),
      );
    } else {
      // No subscription found, set to free
      dispatch(
        setSubscription({
          plan: 'free',
        }),
      );
    }
  } catch (error: any) {
    dispatch(setError(error.message));
  }
};
