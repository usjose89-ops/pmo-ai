import re
import os
import glob

base_dir = r"c:\ConstructIA_MVP\frontend\app\projects\[id]"
files_to_fix = glob.glob(os.path.join(base_dir, "*", "page.tsx"))

old_effect_pattern1 = re.compile(
r"    useEffect\(\(\) => \{\n"
r"        if \(params\.id\) \{\n"
r"            const p = MOCK_PROJECTS\.find\(p => String\(p\.id\) === params\.id\);\n"
r"            if \(p\) setProject\(p\);\n"
r"        \}\n"
r"    \}, \[params\.id\]\);",
re.MULTILINE)

old_effect_pattern2 = re.compile(
r"    useEffect\(\(\) => \{\n"
r"        if \(params\.id\) \{\n"
r"            const foundProject = MOCK_PROJECTS\.find\(p => String\(p\.id\) === params\.id\);\n"
r"            if \(foundProject\) \{\n"
r"                setProject\(foundProject\);\n"
r"            \}\n"
r"        \}\n"
r"    \}, \[params\.id\]\);",
re.MULTILINE)

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

    # Replace useEffect
    content = old_effect_pattern1.sub(new_effect, content)
    content = old_effect_pattern2.sub(new_effect, content)
    
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)

print("Done fixing all subpages!")
