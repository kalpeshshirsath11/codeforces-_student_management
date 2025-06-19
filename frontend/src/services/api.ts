import axios from 'axios';
import { Student, Contest, ProblemStats } from '../types';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const studentApi = {
  getAll: () => api.get<Student[]>('/students'),
  getById: (id: string) => api.get<Student>(`/students/${id}`),
  create: (data: Omit<Student, '_id'>) => api.post<Student>('/students', data),
  update: (id: string, data: Partial<Student>) => api.put<Student>(`/students/${id}`, data),
  delete: (id: string) => api.delete(`/students/${id}`),
  getContestHistory: (id: string, days?: number) => 
    api.get<Contest[]>(`/students/${id}/contests${days ? `?days=${days}` : ''}`),
  getProblemStats: (id: string, days?: number) => 
    api.get<ProblemStats>(`/students/${id}/problems${days ? `?days=${days}` : ''}`),
  toggleNotifications: (id: string, enabled: boolean) => 
    api.put<Student>(`/students/${id}/notifications`, { enabled }),
};

export default api; 