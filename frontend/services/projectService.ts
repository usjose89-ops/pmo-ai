import axios from 'axios';
import { Project } from '@/types/project';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export const projectService = {
  getProjects: async (): Promise<Project[]> => {
    const response = await axios.get<Project[]>(`${API_BASE_URL}/projects/`);
    return response.data;
  },

  getProject: async (id: number): Promise<Project> => {
    const response = await axios.get<Project>(`${API_BASE_URL}/projects/${id}`);
    return response.data;
  },

  getProjectTasksSummary: async (id: number) => {
    const response = await axios.get(`${API_BASE_URL}/projects/${id}/tasks-summary`);
    return response.data;
  }
};
