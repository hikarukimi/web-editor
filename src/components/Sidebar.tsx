import React, { useState } from 'react';
import { Folder, FileCode, FileJson, FileType, ChevronRight, ChevronDown } from 'lucide-react';
import { cn } from '../lib/utils';

interface FileTreeItemData {
    name: string;
    type: 'file' | 'folder';
    isOpen?: boolean;
    children?: FileTreeItemData[];
}

/**
 * 根据不同文件格式返回不同的图标 
 */
const FileIcon: React.FC<{ name: string }> = ({ name }) => {
    if (name.endsWith('.js') || name.endsWith('.ts'))
        return <FileCode className="h-4 w-4 text-blue-400" />;
    if (name.endsWith('.json')) return <FileJson className="h-4 w-4 text-yellow-400" />;
    return <FileType className="h-4 w-4 text-gray-400" />;
};

/**
 * 递归渲染文件树项
 */
const FileTreeItem: React.FC<{ item: FileTreeItemData; depth?: number }> = ({ item, depth = 0 }) => {
    const [isOpen, setIsOpen] = useState(item.isOpen || false);

    return (
        <div>
            <div
                className={cn(
                    "flex items-center gap-1 py-1 px-2 cursor-pointer hover:bg-gray-800 text-sm text-gray-300 select-none",
                    depth > 0 && "pl-4"
                )}
                // 根据深度动态计算左内边距
                style={{ paddingLeft: `${depth * 12 + 8}px` }}
                // 点击文件夹时切换展开状态
                onClick={() => item.type === 'folder' && setIsOpen(!isOpen)}
            >
                {/* 渲染文件夹图标（根据展开状态显示不同箭头） */}
                {item.type === 'folder' && (
                    isOpen ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />
                )}
                {item.type === 'folder' ? (
                    <Folder className="h-4 w-4 text-yellow-500 mr-1" />
                ) : (
                    <div className="ml-3"><FileIcon name={item.name} /></div>
                )}

                <span className={cn(item.type === 'folder' && "font-semibold")}>{item.name}</span>
            </div>
            {/* 递归渲染子项 */}
            {item.type === 'folder' && isOpen && item.children && (
                <div>
                    {item.children.map((child, idx) => (
                        <FileTreeItem key={idx} item={child} depth={depth + 1} />
                    ))}
                </div>
            )}
        </div>
    );
};

/**
 * 侧边栏组件 - 显示文件资源管理器
 */
const Sidebar: React.FC = () => {
    // 模拟文件树数据
    const files: FileTreeItemData[] = [];

    return (
        <div className="w-64 bg-[#18181b] border-r border-gray-800 h-full flex flex-col">
            {/* 侧边栏标题 */}
            <div className="p-3 border-b border-gray-800 font-bold text-gray-100 flex items-center gap-2">
                <span className="text-blue-500">Hikarukimi</span> Editor
            </div>
            {/* 文件列表区域 */}
            <div className="flex-1 overflow-y-auto py-2">
                {files.map((file, idx) => (
                    <FileTreeItem key={idx} item={file} />
                ))}
            </div>
        </div>
    );
};

export default Sidebar;
