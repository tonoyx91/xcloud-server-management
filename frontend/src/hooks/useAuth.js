import { useEffect, useState } from 'react'
import api from '../api'

export function useAuth() {
  const [user, setUser] = useState(null)
  const token = localStorage.getItem('token')

  useEffect(() => {
    if (!token) return
    api.get('/auth/me')
      .then(r => setUser(r.data.user))
      .catch(() => {
        localStorage.removeItem('token')
        setUser(null)
      })
  }, [token])

  return { user, setUser }
}
