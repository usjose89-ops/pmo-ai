export const saveProjectData = (projectId: number | string, moduleName: string, data: any) => {
    if (typeof window === 'undefined') return; // Server-side guard
    const key = `constructia_${projectId}_${moduleName}`;
    localStorage.setItem(key, JSON.stringify(data));
    console.log(`Saved ${moduleName} for Project ${projectId}`);
};

export const loadProjectData = (projectId: number | string, moduleName: string, defaultData: any) => {
    if (typeof window === 'undefined') return defaultData;
    const key = `constructia_${projectId}_${moduleName}`;
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : defaultData;
};

export const clearProjectData = (projectId: number | string, moduleName: string) => {
    if (typeof window === 'undefined') return;
    const key = `constructia_${projectId}_${moduleName}`;
    localStorage.removeItem(key);
};
