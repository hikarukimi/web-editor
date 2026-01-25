import React from 'react';
import { Play, Settings, Share2 } from 'lucide-react';

/**
 * 编辑器支持的编程语言列表。
 * 这些语言用于填充语言选择器下拉菜单。
 */
const languages: string[] = [
    'javascript',
    'typescript',
    'json'
];

interface ToolbarProps {
    language: string;
    setLanguage: (language: string) => void;
    onRun: () => void;
}

/**
 * 代码编辑器的工具栏组件。
 * 提供语言选择、代码运行及其他操作的控制功能。
 */
const Toolbar: React.FC<ToolbarProps> = ({ language, setLanguage, onRun }) => {
    return (
        <div className="h-14 bg-[#18181b] border-b border-gray-800 flex items-center justify-between px-4">
            <div className="flex items-center gap-4">
                {/* 语言选择器 */}
                <div className="relative group">
                    <select
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        className="appearance-none bg-gray-800 text-gray-200 pl-3 pr-8 py-1.5 rounded-md border border-gray-700 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer hover:bg-gray-750"
                    >
                        {languages.map(lang => (
                            <option key={lang} value={lang}>{lang.toUpperCase()}</option>
                        ))}
                    </select>
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                        <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-3">
                {/* 运行按钮：执行当前代码 */}
                <button
                    onClick={onRun}
                    className="flex items-center gap-2 px-4 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm font-medium transition-colors"
                >
                    <Play className="h-4 w-4" />
                    运行
                </button>

                <div className="h-6 w-px bg-gray-700 mx-1"></div>

                {/* 设置操作 */}
                <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-md transition-colors" title="设置">
                    <Settings className="h-5 w-5" />
                </button>

                {/* 分享操作 */}
                <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-md transition-colors" title="分享">
                    <Share2 className="h-5 w-5" />
                </button>
            </div>
        </div>
    );
};

export default Toolbar;
