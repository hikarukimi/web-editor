import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

/**
 * 根据文件名后缀返回对应的语言类型
 */
export function getLanguageFromFileName(fileName: string): string {
    const ext = fileName.split('.').pop()?.toLowerCase() || '';
    
    const languageMap: Record<string, string> = {
        // Web
        'js': 'javascript',
        'jsx': 'javascript',
        'ts': 'typescript',
        'tsx': 'typescript',
        'html': 'html',
        'css': 'css',
        
        // Data
        'json': 'json',
        'yaml': 'yaml',
        'yml': 'yml',
        
        // Backend
        'py': 'python',
        'java': 'java',
        'php': 'php',
        'go': 'go',
        'rs': 'rust',
        
        // Others
        'sql': 'sql',
        'sh': 'shell',
        'bash': 'shell',
        'md': 'markdown',
    };
    
    return languageMap[ext] || 'plaintext';
}
