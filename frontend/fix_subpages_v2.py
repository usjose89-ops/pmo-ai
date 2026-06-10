import os
import glob
import re

base_dir = r"c:\ConstructIA_MVP\frontend\app\projects\[id]"
files_to_fix = glob.glob(os.path.join(base_dir, "*", "page.tsx"))

new_effect = """    useEffect(() => {
        if (params.id) {
            projectService.getProject(Number(params.id))
                .then(setProject)
                .catch(err => console.error("Error loading project data:", err));
        }
    }, [params.id]);"""

for file_path in files_to_fix:
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Normalize newlines
    content = content.replace('\r\n', '\n')

    # Remove MOCK_PROJECTS import if present
    content = re.sub(r"import\s*\{\s*MOCK_PROJECTS\s*\}\s*from\s*['\"]@\/data\/mockData['\"];?\n?", "", content)
    
    # Ensure projectService is imported
    if "projectService" not in content and "setProject" in content:
        # Find first import
        content = re.sub(r"(import .*?from .*?\n)", r"\1import { projectService } from '@/services/projectService';\n", content, count=1)

    # Extract the useEffect block using a simpler regex and purely replace it
    # We find "useEffect(() => {" and "}, [params.id]);"
    content = re.sub(r"    useEffect\(\(\) => \{.+?\}, \[params\.id\]\);", new_effect, content, flags=re.DOTALL)
    
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)

print("Done fixing all subpages with DOTALL!")
