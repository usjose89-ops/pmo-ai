import re
import os

files_to_fix = [
    r'c:\ConstructIA_MVP\frontend\app\projects\[id]\page.tsx',
    r'c:\ConstructIA_MVP\frontend\app\projects\[id]\hr\page.tsx'
]

for file_path in files_to_fix:
    if not os.path.exists(file_path):
        continue
        
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Normalize newlines
    content = content.replace('\r\n', '\n')

    # Replace import
    content = content.replace("import { MOCK_PROJECTS } from '@/data/mockData';", "import { projectService } from '@/services/projectService';")

    # Replace useEffect in page.tsx
    old_effect = """    useEffect(() => {
        if (params.id) {
            const foundProject = MOCK_PROJECTS.find(p => String(p.id) === params.id);
            if (foundProject) {
                const richProject = {
                    ...foundProject,
                    financials: (foundProject as any).financials || {
                        total_revenue: 0,
                        total_cost: 0,
                        gross_margin: 0,
                        gross_margin_percent: 0,
                        currency: 'CLP',
                        monthly_data: []
                    }
                };
                setProject(richProject);
            }
        }
    }, [params.id]);"""

    new_effect = """    useEffect(() => {
        if (params.id) {
            projectService.getProject(Number(params.id))
                .then(foundProject => {
                    const richProject = {
                        ...foundProject,
                        financials: foundProject.financials || {
                            total_revenue: 0,
                            total_cost: 0,
                            gross_margin: 0,
                            gross_margin_percent: 0,
                            currency: 'CLP',
                            monthly_data: []
                        }
                    };
                    setProject(richProject);
                })
                .catch(err => console.error("Error loading project data:", err));
        }
    }, [params.id]);"""
    
    content = content.replace(old_effect, new_effect)
    
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)

print("Done!")
