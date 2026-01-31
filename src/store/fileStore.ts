import { create, StateCreator } from 'zustand';
import { FileItem } from '../lib/types';

/**
 * 递归查找并将项添加到指定文件夹中
 */
function addItemToFolder(files: FileItem[], parentId: string, newItem: FileItem): FileItem[] {
    return files.map((file: FileItem) => {
        if (file.id === parentId && file.type === 'folder') {
            return {
                ...file,
                children: [...(file.children || []), newItem]
            };
        }
        if (file.children && file.children.length > 0) {
            return {
                ...file,
                children: addItemToFolder(file.children, parentId, newItem)
            };
        }
        return file;
    });
}

/**
 * 检查指定路径下是否存在同名文件/文件夹
 */
function isNameDuplicate(files: FileItem[], parentId: string | undefined, name: string): boolean {
    if (!parentId) {
        // 在根目录检查
        return files.some((file: FileItem) => file.name === name);
    }

    // 在指定文件夹中递归检查
    for (const file of files) {
        if (file.id === parentId && file.type === 'folder') {
            return (file.children || []).some((child: FileItem) => child.name === name);
        }
        if (file.children && file.children.length > 0) {
            if (isNameDuplicate(file.children, parentId, name)) {
                return true;
            }
        }
    }
    return false;
}

export interface FileState {
    files: FileItem[];
    activeFileId: string;
    selectedFolderId: string | null;
    fileCounter: number;
    errorMessage: string | null;
    addFile: (fileName: string, parentId?: string) => void;
    addFolder: (folderName: string, parentId?: string) => void;
    updateFileContent: (content: string) => void;
    setActiveFile: (fileId: string) => void;
    setSelectedFolder: (folderId: string | null) => void;
    clearError: () => void;
}

const fileStoreCreator: StateCreator<FileState> = (set) => ({
    files: [
        {
            id: '1',
            name: 'untitled-1.js',
            content: `// talk is cheap show me the code

function greet(name) {
    console.log("Hello, " + name + "!");
}

greet("Developer");
`,
            type: 'file'
        }
    ],
    activeFileId: '1',
    selectedFolderId: null,
    fileCounter: 2,
    errorMessage: null,

    addFile: (fileName: string, parentId?: string) => {
        set((state: FileState) => {
            // 检查重名
            if (isNameDuplicate(state.files, parentId, fileName)) {
                return {
                    errorMessage: `文件"${fileName}"已存在`
                };
            }

            const newFile: FileItem = {
                id: Date.now().toString(),
                name: fileName,
                content: '',
                type: 'file'
            };

            let updatedFiles = state.files;
            if (parentId) {
                // 添加到指定文件夹的子项中
                updatedFiles = addItemToFolder(state.files, parentId, newFile);
            } else {
                // 添加到根目录
                updatedFiles = [...state.files, newFile];
            }

            return {
                files: updatedFiles,
                activeFileId: newFile.id,
                fileCounter: state.fileCounter + 1,
                errorMessage: null
            };
        });
    },

    addFolder: (folderName: string, parentId?: string) => {
        set((state: FileState) => {
            // 检查重名
            if (isNameDuplicate(state.files, parentId, folderName)) {
                return {
                    errorMessage: `文件夹"${folderName}"已存在`
                };
            }

            const newFolder: FileItem = {
                id: Date.now().toString(),
                name: folderName,
                type: 'folder',
                isOpen: false,
                children: []
            };

            let updatedFiles = state.files;
            if (parentId) {
                // 添加到指定文件夹的子项中
                updatedFiles = addItemToFolder(state.files, parentId, newFolder);
            } else {
                // 添加到根目录
                updatedFiles = [...state.files, newFolder];
            }

            return {
                files: updatedFiles,
                fileCounter: state.fileCounter + 1,
                errorMessage: null
            };
        });
    },

    updateFileContent: (content: string) => {
        set((state: FileState) => {
            const updateRecursive = (files: FileItem[]): FileItem[] => {
                return files.map((f) => {
                    if (f.id === state.activeFileId && f.type === 'file') {
                        return { ...f, content };
                    }
                    if (f.type === 'folder' && f.children) {
                        return { ...f, children: updateRecursive(f.children) };
                    }
                    return f;
                });
            };
            return { files: updateRecursive(state.files) };
        });
    },

    setActiveFile: (fileId: string) => {
        set({ activeFileId: fileId });
    },

    setSelectedFolder: (folderId: string | null) => {
        set({ selectedFolderId: folderId });
    },

    clearError: () => {
        set({ errorMessage: null });
    }
});

export const useFileStore = create<FileState>(fileStoreCreator);
