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

export interface FileState {
    files: FileItem[];
    activeFileId: string;
    selectedFolderId: string | null;
    fileCounter: number;
    addFile: (fileName: string, parentId?: string) => void;
    addFolder: (folderName: string, parentId?: string) => void;
    updateFileContent: (content: string) => void;
    setActiveFile: (fileId: string) => void;
    setSelectedFolder: (folderId: string | null) => void;
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

    addFile: (fileName: string, parentId?: string) => {
        set((state: FileState) => {
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
                fileCounter: state.fileCounter + 1
            };
        });
    },

    addFolder: (folderName: string, parentId?: string) => {
        set((state: FileState) => {
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
                fileCounter: state.fileCounter + 1
            };
        });
    },

    updateFileContent: (content: string) => {
        set((state: FileState) => ({
            files: state.files.map((f: FileItem) =>
                f.id === state.activeFileId && f.type !== 'folder'
                    ? { ...f, content }
                    : f
            )
        }));
    },

    setActiveFile: (fileId: string) => {
        set({ activeFileId: fileId });
    },

    setSelectedFolder: (folderId: string | null) => {
        set({ selectedFolderId: folderId });
    }
});

export const useFileStore = create<FileState>(fileStoreCreator);
