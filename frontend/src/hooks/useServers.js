import { useQuery } from '@tanstack/react-query'
import api from '../api'

export function useServers(params) {
  return useQuery({
    queryKey: ['servers', params],
    queryFn: async () => {
      const { data } = await api.get('/servers', { params })
      return data
    },
    keepPreviousData: true
  })
}
