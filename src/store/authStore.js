import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const EMPLOYEE_TOKEN_KEY = 'employee_token';

export const useAuthStore = create(
  persist(
    (set) => ({
      token: null,
      user: null,   // { name, email, plan }

      setSession: (token, user) => {
        sessionStorage.setItem(EMPLOYEE_TOKEN_KEY, token);
        set({ token, user });
      },

      updateUser: (user) => set({ user }),

      logout: () => {
        sessionStorage.removeItem(EMPLOYEE_TOKEN_KEY);
        set({ token: null, user: null });
      },
    }),
    {
      name: 'mpf-employee-auth',
      // Only persist token + user — anything else is transient
      partialize: (state) => ({ token: state.token, user: state.user }),
    }
  )
);
