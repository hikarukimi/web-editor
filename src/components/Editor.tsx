import React from 'react';
import { Editor as MonacoEditor, OnChange, OnMount } from '@monaco-editor/react';

interface EditorProps {
    language?: string;
    theme?: string;
    value?: string;
    onChange: (value: string | undefined) => void;
    onPositionChange?: (line: number, column: number) => void;
}

/**
 * 代码编辑器组件 (封装 Monaco Editor)
 */
const Editor: React.FC<EditorProps> = ({
    language = 'javascript',
    theme = 'vs-dark',
    value,
    onChange,
    onPositionChange
}) => {
    // 处理编辑器内容变化，调用父组件传递的 onChange
    const handleEditorChange: OnChange = (value) => {
        onChange(value);
    };

    // 处理编辑器挂载，设置光标位置监听器
    const handleEditorMount: OnMount = (editor) => {
        if (onPositionChange) {
            editor.onDidChangeCursorPosition((e) => {
                onPositionChange(e.position.lineNumber, e.position.column);
            });

            // 初始化位置
            const position = editor.getPosition();
            if (position) {
                onPositionChange(position.lineNumber, position.column);
            }
        }
    };

    return (
        <div className="h-full w-full overflow-hidden bg-[#1e1e1e]">
            <MonacoEditor
                height="100%"
                language={language}
                theme={theme}
                value={value}
                onChange={handleEditorChange}
                onMount={handleEditorMount}
                // Monaco 编辑器的高级配置选项
                options={{
                    fontSize: 14, // 字体大小
                    scrollBeyondLastLine: false, // 滚动是否可以超过最后一行
                    padding: { top: 16 }, // 顶部内边距
                    fontFamily: "'JetBrains Mono', 'Fira Code', monospace", // 字体设置
                    fontLigatures: true, // 启用连字 (如 => 变成箭头)
                    smoothScrolling: true, // 平滑滚动
                    cursorBlinking: "smooth", // 光标闪烁样式
                    cursorSmoothCaretAnimation: "on", // 光标平滑动画
                    renderLineHighlight: "all", // 高亮当前行
                }}
            />
        </div>
    );
};

export default Editor;
