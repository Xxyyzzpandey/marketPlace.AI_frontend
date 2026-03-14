import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface User {
  id: string;
  businessName:string;
  firstName: string;
  lastName:string;
  role: 'buyer' | 'seller';
  whatsappNumber: string;
  location: {
    country: String,
    city: String
  }
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      // Call this when signin/signup is successful
      setAuth: (user, token) => set({ 
        user, 
        token, 
        isAuthenticated: true 
      }),
       
      // Call this to clear session
      logout: () => set({ 
        user: null, 
        token: null, 
        isAuthenticated: false 
      }),
    }),
    {
      name: 'market-supply-auth', // unique name for localStorage key
      storage: createJSONStorage(() => localStorage),
    }
  )
);