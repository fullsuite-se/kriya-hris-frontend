import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set) => ({
      hydrated: false, 
      systemUserId: null,
      systemUserEmail: null,
      systemCompanyId: null,
      servicePermissions: [],
      accessPermissions: [],
      isLoggedIn: false,
      user: null, 

      setAuth: ({ systemUserId, systemUserEmail, systemCompanyId, servicePermissions, accessPermissions, user }) =>
        set({
          systemUserId,
          systemUserEmail,
          systemCompanyId,
          servicePermissions,
          accessPermissions,
          user: user || null,
          isLoggedIn: Boolean(systemUserId),
        }),

      logout: () => {
        localStorage.removeItem("accessToken");
        set({
          systemUserId: null,
          systemUserEmail: null,
          systemCompanyId: null,
          servicePermissions: [],
          accessPermissions: [],
           user: null, 
          isLoggedIn: false,
        });
      },
    }),
    {
      name: 'auth-storage',
      onRehydrateStorage: () => (state) => {
        state.hydrated = true; 
      },
    }
  )
);
