import { useState, useEffect } from 'react'
import { useAuthStore } from "../store/authstore"

export const useAuth = () => {
  const [isHydrated, setIsHydrated] = useState(false)
  const auth = useAuthStore()

  // Wait until the client-side hydration is finished
  useEffect(() => {
    setIsHydrated(true)
  }, [])

  return isHydrated ? auth : { user: null, token: null, isAuthenticated: false, logout: auth.logout, setAuth: auth.setAuth }
}