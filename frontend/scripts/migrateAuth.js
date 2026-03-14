const fs = require('fs');
const path = require('path');

function processDir(dir) {
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
        if (file === 'node_modules' || file === '.next') continue;
        
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
            processDir(fullPath);
        } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let modified = false;

            // Handle useAuth imports regardless of quotes
            const useAuthRegex = /import\s+{\s*useAuth\s*}\s+from\s+['"]@\/context\/AuthContext['"]/g;
            if (useAuthRegex.test(content)) {
                content = content.replace(
                    useAuthRegex,
                    "import { useAuthStore as useAuth } from '@/store/useAuthStore'"
                );
                modified = true;
            } 
            
            const authProviderRegex = /import\s+{\s*AuthProvider\s*}\s+from\s+['"]@\/context\/AuthContext['"]/g;
            if (authProviderRegex.test(content)) {
                content = content.replace(
                    authProviderRegex,
                    'import { AuthProvider } from "@/components/Providers/AuthProvider"'
                );
                modified = true;
            }

            if (modified) {
                fs.writeFileSync(fullPath, content, 'utf8');
                console.log('Updated', fullPath);
            }
        }
    }
}

processDir(path.join(__dirname, '..'));
