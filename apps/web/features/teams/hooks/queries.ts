import { useQuery } from '@tanstack/react-query';
import { fetchTeams } from '../api';
export const useTeams = () => {
    return useQuery({
        queryKey: ['teams'],
        queryFn: () => fetchTeams()
    })
}