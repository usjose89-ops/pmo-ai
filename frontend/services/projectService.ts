import axios from 'axios';
import { Project } from '@/types/project';
import { supabaseProjectService } from './supabaseProjectService';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export const projectService = {
  getProjects: async (): Promise<Project[]> => {
    return await supabaseProjectService.getProjects();
  },

  getProject: async (id: number | string): Promise<Project> => {
    const project = await supabaseProjectService.getProject(id);
    if (!project) throw new Error("Project not found");
    return project;
  },

  getProjectTasksSummary: async (id: number | string) => {
    const response = await axios.get(`${API_BASE_URL}/projects/${id}/tasks-summary`);
    return response.data;
  }
};
