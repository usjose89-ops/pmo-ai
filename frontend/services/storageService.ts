const STORAGE_KEY = 'CONSTRUCT_IA_DATA';

export const storageService = {
    // Guarda todo el estado (Proyectos, Clientes, Lecciones)
    save: (data: any) => {
        if (typeof window !== 'undefined') {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        }
    },

    // Carga los datos al iniciar
    load: () => {
        if (typeof window !== 'undefined') {
            const data = localStorage.getItem(STORAGE_KEY);
            return data ? JSON.parse(data) : null;
        }
        return null;
    },

    // Agrega un nuevo proyecto manteniendo lo anterior
    addProject: (newProject: any) => {
        const current = storageService.load() || { projects: [], clients: [], history: [] };
        const updated = {
            ...current,
            projects: [...(current.projects || []).filter((p: any) => p.id !== newProject.id), newProject]
        };
        storageService.save(updated);
        return updated;
    }
};
