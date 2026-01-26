import { create, StateCreator } from 'zustand';
import { FileItem } from '../lib/types';

export interface FileState {
    files: FileItem[];
    activeFileId: string;
    fileCounter: number;
    addFile: (fileName: string) => void;
    updateFileContent: (content: string) => void;
    setActiveFile: (fileId: string) => void;
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
`
        }
    ],
    activeFileId: '1',
    fileCounter: 2,

    addFile: (fileName: string) => {
        set((state: FileState) => {
            const newFile: FileItem = {
                id: Date.now().toString(),
                name: fileName,
                content: ''
            };
            return {
                files: [...state.files, newFile],
                activeFileId: newFile.id,
                fileCounter: state.fileCounter + 1
            };
        });
    },

    updateFileContent: (content: string) => {
        set((state: FileState) => ({
            files: state.files.map((f: FileItem) =>
                f.id === state.activeFileId
                    ? { ...f, content }
                    : f
            )
        }));
    },

    setActiveFile: (fileId: string) => {
        set({ activeFileId: fileId });
    }
});

export const useFileStore = create<FileState>(fileStoreCreator);
