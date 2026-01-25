import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Toolbar from './components/Toolbar';
import Editor from './components/Editor';

function App() {
    const [language, setLanguage] = useState<string>('javascript');
    const [cursorPos, setCursorPos] = useState({ line: 1, col: 1 });
    const [code, setCode] = useState<string>(`// talk is cheap show me the code

function greet(name) {
    console.log("Hello, " + name + "!");
}

greet("Developer");
`);

    const handleRun = () => {
        alert(`Running ${language} code:\n\n${code}`);
    };

    return (
        <div className="flex h-screen w-screen bg-[#09090b] text-white overflow-hidden font-sans">
            <Sidebar />
            <div className="flex-1 flex flex-col h-full bg-[#1e1e1e]">
                <Toolbar language={language} setLanguage={setLanguage} onRun={handleRun} />
                <div className="flex-1 relative">
                    <Editor
                        language={language}
                        theme="vs-dark"
                        value={code}
                        onChange={(val: string | undefined) => setCode(val || '')}
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
