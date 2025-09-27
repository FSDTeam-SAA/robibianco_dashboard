// This is useAllUsers.ts hooks


// useAllUsers.ts
import { useQuery } from '@tanstack/react-query';
import { getAllUsers } from '../api';
 

// API function
interface UserQuery {
  filter?: string;
  page?: number;
  limit?: number;
}
 
export const useAllUsers = (queryParams: UserQuery) => {
  return useQuery({
    queryKey: ['users', queryParams],
    queryFn: () => getAllUsers(queryParams),
  });
};
