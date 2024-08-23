import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { useAuth } from '@/contexts/AuthContext'

export const useRedirectIfAuthenticated = () => {
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user) {
      router.push('/')
    }
  }, [user, router])
}
