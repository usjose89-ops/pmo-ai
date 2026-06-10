import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export const taskService = {
    /**
     * Assigns a new task via the backend.
     */
    assignTask: async (data: {
        title: string;
        priority: 'HIGH' | 'MEDIUM' | 'LOW';
        deadline: string;
        assignee_email: string;
        project_id: number;
    }) => {
        try {
            const response = await axios.post(`${API_URL}/tasks/assign`, {
                title: data.title,
                priority: data.priority,
                deadline: data.deadline,
                assignee_email: data.assignee_email,
                project_id: data.project_id
            });
            return response.data;
        } catch (error) {
            console.error("Error assigning task:", error);
            throw error;
        }
    },

    /**
     * Updates a task date, providing a reason if it's a delay.
     */
    updateTaskDate: async (taskId: string, newDate: string, reason?: string) => {
        try {
            const response = await axios.put(`${API_URL}/tasks/${taskId}/update-date`, {
                new_date: newDate,
                reason: reason
            });
            return response.data;
        } catch (error) {
            console.error("Error updating task date:", error);
            throw error;
        }
    }
};
