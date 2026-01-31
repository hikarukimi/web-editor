import React, { useState, useEffect } from 'react';
import { Folder, FolderOpen, FileCode, FileJson, FileType, ChevronRight, ChevronDown, Plus, FolderPlus, Search, X, FolderTree, SearchCode, FileTerminal, FileText, Settings } from 'lucide-react';
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
                    <div className="w-4 h-4 flex items-center justify-center">
                        {isOpen ? <ChevronDown className="h-2.5 w-2.5 text-gray-400" /> : <ChevronRight className="h-2.5 w-2.5 text-gray-500" />}
                    </div>
                )}
                {item.type === 'folder' ? (
                    isOpen ? <FolderOpen className="h-4 w-4 text-blue-400/80 mr-1.5" /> : <Folder className="h-4 w-4 text-blue-400/60 mr-1.5" />
                ) : (
                    <div className="ml-4 flex items-center justify-center w-4 h-4"><FileIcon name={item.name} /></div>
                )}

                <span className={cn(item.type === 'folder' ? "font-medium text-gray-200" : "text-gray-300")}>{item.name}</span>
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
    const [view, setView] = useState<'explorer' | 'search'>('explorer');
    const [showNewFileInput, setShowNewFileInput] = useState(false);
    const [inputType, setInputType] = useState<'file' | 'folder'>('file');
    const [newFileName, setNewFileName] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const inputRef = React.useRef<HTMLInputElement>(null);
    const searchInputRef = React.useRef<HTMLInputElement>(null);

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

    // 搜索逻辑
    const searchFiles = (query: string) => {
        if (!query.trim()) return [];
        const results: { file: FileItem; path: string }[] = [];
        const lowerQuery = query.toLowerCase();

        const traverse = (items: FileItem[], path: string = '') => {
            for (const item of items) {
                const currentPath = path ? `${path}/${item.name}` : item.name;
                if (item.type === 'file') {
                    if (
                        item.name.toLowerCase().includes(lowerQuery) ||
                        (item.content && item.content.toLowerCase().includes(lowerQuery))
                    ) {
                        results.push({ file: item, path: currentPath });
                    }
                } else if (item.type === 'folder' && item.children) {
                    traverse(item.children, currentPath);
                }
            }
        };

        traverse(files);
        return results;
    };

    const searchResults = searchFiles(searchQuery);

    return (
        <div className="w-64 bg-[#18181b] border-r border-gray-800 h-full flex flex-col">
            {/* 顶栏：Tab 切换 */}
            <div className="flex items-center gap-1 px-2 border-b border-gray-800/50 bg-[#121214]/50 h-10">
                <button
                    onClick={() => setView('explorer')}
                    title="Explorer"
                    className={cn(
                        "p-2 transition-all rounded-md flex items-center justify-center",
                        view === 'explorer'
                            ? "text-blue-400 bg-blue-400/10"
                            : "text-gray-500 hover:text-gray-300 hover:bg-white/5"
                    )}
                >
                    <FolderTree className="h-4 w-4" />
                </button>
                <button
                    onClick={() => setView('search')}
                    title="Search"
                    className={cn(
                        "p-2 transition-all rounded-md flex items-center justify-center",
                        view === 'search'
                            ? "text-blue-400 bg-blue-400/10"
                            : "text-gray-500 hover:text-gray-300 hover:bg-white/5"
                    )}
                >
                    <SearchCode className="h-4 w-4" />
                </button>
            </div>

            {view === 'explorer' ? (
                <>
                    {/* 侧边栏标题和操作 */}
                    <div className="border-b border-gray-800/30 group/header">
                        <div className="p-3 pr-2 flex items-center justify-between">
                            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest truncate">Project Explorer</span>

                            {/* 新增文件/文件夹按钮 */}
                            {!showNewFileInput && (
                                <div className="flex items-center gap-0.5 opacity-0 group-hover/header:opacity-100 transition-opacity">
                                    <button
                                        onClick={handleNewFile}
                                        className="p-1 hover:bg-gray-700/50 text-gray-500 hover:text-blue-400 rounded transition-colors"
                                        title="New File"
                                    >
                                        <Plus className="h-3.5 w-3.5" />
                                    </button>
                                    <button
                                        onClick={handleNewFolder}
                                        className="p-1 hover:bg-gray-700/50 text-gray-500 hover:text-amber-400 rounded transition-colors"
                                        title="New Folder"
                                    >
                                        <FolderPlus className="h-3.5 w-3.5" />
                                    </button>
                                </div>
                            )}
                        </div>
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
                                    placeholder={inputType === 'file' ? '文件名...' : '文件夹名...'}
                                    className={cn(
                                        "w-full px-2 py-1 bg-gray-700 border rounded text-xs text-white placeholder-gray-400 focus:outline-none",
                                        errorMessage ? "border-red-500 focus:border-red-500" : "border-gray-600 focus:border-blue-500"
                                    )}
                                />
                            </div>
                        )}
                    </div>
                    {/* 文件列表区域 */}
                    <div className="flex-1 overflow-y-auto py-2">
                        {files.length === 0 ? (
                            <div className="text-gray-500 text-xs px-4 py-4">暂无文件</div>
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
                </>
            ) : (
                <div className="flex-1 flex flex-col">
                    <div className="p-3 border-b border-gray-800">
                        <div className="relative">
                            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-500" />
                            <input
                                ref={searchInputRef}
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="全局搜索..."
                                className="w-full pl-8 pr-9 py-2 bg-gray-800 border border-gray-700 rounded-md text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all font-medium"
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery('')}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:text-gray-300 hover:bg-white/5 rounded-md transition-all"
                                >
                                    <X className="h-3.5 w-3.5" />
                                </button>
                            )}
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto py-2">
                        {searchQuery.trim() === '' ? (
                            <div className="text-gray-500 text-xs px-4 py-4 text-center">输入内容开始搜索</div>
                        ) : searchResults.length === 0 ? (
                            <div className="text-gray-500 text-xs px-4 py-4 text-center">未找到匹配项</div>
                        ) : (
                            <div>
                                <div className="px-4 py-1 text-[10px] font-bold text-gray-500 uppercase">
                                    找到 {searchResults.length} 个结果
                                </div>
                                {searchResults.map((result, idx) => (
                                    <div
                                        key={idx}
                                        onClick={() => setActiveFile(result.file.id)}
                                        className={cn(
                                            "flex flex-col gap-1 py-2.5 px-4 cursor-pointer hover:bg-white/5 transition-colors border-b border-gray-800/30 group",
                                            activeFileId === result.file.id ? "bg-blue-500/10 border-l-2 border-l-blue-500" : "border-l-2 border-l-transparent"
                                        )}
                                    >
                                        <div className="flex items-center gap-2.5">
                                            <div className="p-1 rounded-sm bg-gray-800/50 group-hover:bg-gray-700/50 transition-colors">
                                                <FileIcon name={result.file.name} />
                                            </div>
                                            <span className="text-xs font-medium text-gray-200 truncate group-hover:text-blue-400 transition-colors">{result.file.name}</span>
                                        </div>
                                        <span className="text-[9px] text-gray-500 font-mono truncate ml-8 bg-gray-900/40 px-1 py-0.5 rounded border border-gray-800/50">{result.path}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Sidebar;
