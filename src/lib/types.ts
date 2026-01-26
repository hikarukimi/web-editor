export interface FileItem {
    id: string;
    name: string;
    content: string;
    type?: 'file' | 'folder';
    isOpen?: boolean;
    children?: FileItem[];
}
