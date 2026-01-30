import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Toolbar from './components/Toolbar';
import Editor from './components/Editor';
import { useFileStore } from './store/fileStore';
import { getLanguageFromFileName } from './lib/utils';

function App() {
    const [language, setLanguage] = useState<string>('javascript');
    const [cursorPos, setCursorPos] = useState({ line: 1, col: 1 });
    const { files, activeFileId } = useFileStore();

    // 当活跃文件改变时，自动更新编辑器语言
    useEffect(() => {
        const activeFile = files.find((f) => f.id === activeFileId);
        if (activeFile && activeFile.type === 'file') {
            const detectedLanguage = getLanguageFromFileName(activeFile.name);
            setLanguage(detectedLanguage);
        }
    }, [activeFileId, files]);

    return (
        <div className="flex h-screen w-screen bg-[#09090b] text-white overflow-hidden font-sans">
            <Sidebar language={language} />
            <div className="flex-1 flex flex-col h-full bg-[#1e1e1e]">
                <Toolbar language={language} setLanguage={setLanguage} />
                <div className="flex-1 relative">
                    <Editor
                        language={language}
                        theme="vs-dark"
                        onPositionChange={(line, col) => setCursorPos({ line, col })}
                    />
                </div>
                {/* 状态栏：显示当前光标位置 */}
                <div className="h-6 bg-[#18181b] border-t border-gray-800 flex items-center justify-end px-4 text-[11px] text-gray-500 font-medium select-none">
                    <div className="flex items-center gap-4">
                        <div className="hover:text-gray-300 cursor-default transition-colors">
                            行 {cursorPos.line}, 列 {cursorPos.col}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;
