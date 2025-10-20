import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import subscriptionReducer from './slices/subscriptionSlice';

export const store = configureStore({
  reducer: { auth: authReducer, subscription: subscriptionReducer },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore Firebase timestamp serialization warnings
        ignoredActions: ['subscription/setSubscription'],
        ignoredPaths: ['subscription.expiresAt'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
