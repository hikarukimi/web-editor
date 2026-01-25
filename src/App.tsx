import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Toolbar from './components/Toolbar';
import Editor from './components/Editor';

function App() {
    const [language, setLanguage] = useState<string>('javascript');
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
                    />
                </div>
            </div>
        </div>
    );
}

export default App;
