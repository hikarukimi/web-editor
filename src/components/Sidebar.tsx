import React, { useState, useEffect } from 'react';
import { Folder, FileCode, FileJson, FileType, ChevronRight, ChevronDown, Plus, FolderPlus } from 'lucide-react';
import { cn } from '../lib/utils';
import { FileItem } from '../lib/types';
import { useFileStore } from '../store/fileStore';

interface SidebarProps {
    language?: string;
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
const FileTreeItem: React.FC<{ item: FileItem; depth?: number }> = ({ item, depth = 0 }) => {
    const { activeFileId, selectedFolderId, setActiveFile, setSelectedFolder } = useFileStore();
    const [isOpen, setIsOpen] = useState(item.isOpen || false);

    const handleClick = () => {
        if (item.type === 'folder') {
            setIsOpen(!isOpen);
            setSelectedFolder(item.id);
        } else {
            setActiveFile(item.id);
        }
    };

    const isSelected = selectedFolderId === item.id;

    return (
        <div>
            <div
                className={cn(
                    "flex items-center gap-1 py-1 px-2 cursor-pointer text-sm select-none transition-colors",
                    item.type === 'file' && activeFileId === item.id
                        ? "bg-blue-600 text-white"
                        : item.type === 'folder' && isSelected
                        ? "bg-gray-700 text-white"
                        : "text-gray-300 hover:bg-gray-800"
                )}
                // 根据深度动态计算左内边距
                style={{ paddingLeft: `${depth * 12 + 8}px` }}
                // 点击文件夹切换展开状态，点击文件激活文件
                onClick={handleClick}
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
                    {item.children.map((child: FileItem, idx: number) => (
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
const Sidebar: React.FC<SidebarProps> = () => {
    const { files, activeFileId, selectedFolderId, errorMessage, addFile, addFolder, setActiveFile, clearError } = useFileStore();
    const [showNewFileInput, setShowNewFileInput] = useState(false);
    const [inputType, setInputType] = useState<'file' | 'folder'>('file');
    const [newFileName, setNewFileName] = useState('');
    const inputRef = React.useRef<HTMLInputElement>(null);

    // 当输入框显示时自动聚焦
    useEffect(() => {
        if (showNewFileInput) {
            inputRef.current?.focus();
        }
    }, [showNewFileInput]);

    const handleNewFile = () => {
        setInputType('file');
        setShowNewFileInput(true);
        setNewFileName('');
    };

    const handleNewFolder = () => {
        setInputType('folder');
        setShowNewFileInput(true);
        setNewFileName('');
    };

    const handleCreate = () => {
        if (newFileName.trim()) {
            clearError();
            if (inputType === 'file') {
                addFile(newFileName.trim(), selectedFolderId || undefined);
            } else {
                addFolder(newFileName.trim(), selectedFolderId || undefined);
            }
        }
    };

    // 当创建成功时（errorMessage 为 null），自动关闭输入框
    useEffect(() => {
        if (showNewFileInput && errorMessage === null && newFileName.trim() !== '') {
            setShowNewFileInput(false);
            setNewFileName('');
        }
    }, [errorMessage]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleCreate();
        } else if (e.key === 'Escape') {
            setShowNewFileInput(false);
            setNewFileName('');
        }
    };

    const handleCancel = () => {
        setShowNewFileInput(false);
        setNewFileName('');
    };

    return (
        <div className="w-64 bg-[#18181b] border-r border-gray-800 h-full flex flex-col">
            {/* 侧边栏标题和操作 */}
            <div className="border-b border-gray-800">
                <div className="p-3 font-bold text-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className="text-blue-500">Hikarukimi</span> Editor
                    </div>
                </div>
                {/* 新增文件/文件夹按钮 */}
                {!showNewFileInput && (
                    <div className="px-3 pb-3 flex gap-2">
                        <button
                            onClick={handleNewFile}
                            className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm transition-colors"
                            title="新增文件"
                        >
                            <Plus className="h-4 w-4" />
                            <span>新增文件</span>
                        </button>
                        <button
                            onClick={handleNewFolder}
                            className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 bg-gray-700 hover:bg-gray-600 text-white rounded text-sm transition-colors"
                            title="新增文件夹"
                        >
                            <FolderPlus className="h-4 w-4" />
                            <span>新增文件夹</span>
                        </button>
                    </div>
                )}
                {/* 新增文件/文件夹输入框 */}
                {showNewFileInput && (
                    <div className="px-3 pb-3">
                        <input
                            ref={inputRef}
                            type="text"
                            value={newFileName}
                            onChange={(e) => setNewFileName(e.target.value)}
                            onKeyDown={handleKeyDown}
                            onBlur={handleCancel}
                            placeholder={inputType === 'file' ? '输入文件名（如: index.js）' : '输入文件夹名称'}
                            className={cn(
                                "w-full px-2 py-1 bg-gray-700 border rounded text-sm text-white placeholder-gray-400 focus:outline-none",
                                errorMessage ? "border-red-500 focus:border-red-500" : "border-gray-600 focus:border-blue-500"
                            )}
                        />
                        {errorMessage && (
                            <div className="mt-1 px-2 py-1 bg-red-900 border border-red-700 rounded text-xs text-red-200">
                                {errorMessage}
                            </div>
                        )}
                    </div>
                )}
            </div>
            {/* 文件列表区域 */}
            <div className="flex-1 overflow-y-auto py-2">
                {files.length === 0 ? (
                    <div className="text-gray-500 text-sm px-4 py-4">暂无文件或文件夹</div>
                ) : (
                    files.map((file: FileItem) => (
                        file.type === 'folder' ? (
                            <FileTreeItem key={file.id} item={file} depth={0} />
                        ) : (
                            <div
                                key={file.id}
                                onClick={() => setActiveFile(file.id)}
                                className={cn(
                                    "flex items-center gap-2 py-1 px-2 mx-2 rounded cursor-pointer text-sm select-none transition-colors",
                                    activeFileId === file.id
                                        ? "bg-blue-600 text-white"
                                        : "text-gray-300 hover:bg-gray-800"
                                )}
                            >
                                <FileIcon name={file.name} />
                                <span className="truncate">{file.name}</span>
                            </div>
                        )
                    ))
                )}
            </div>
        </div>
    );
};

export default Sidebar;
