import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint' // 引入 TS 插件
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  // 1. 全局忽略目录
  globalIgnores(['dist']),

  // 2. 基础 JS 配置 (作为底色)
  js.configs.recommended,

  // 3. 核心：TypeScript 配置
  // tseslint.configs.recommended 会自动处理匹配 .ts 和 .tsx 文件
  ...tseslint.configs.recommended,

  {
    // 4. 针对 TS 和 TSX 文件的特定设置
    files: ['**/*.{ts,tsx}'],
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    languageOptions: {
      ecmaVersion: 2020,
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      // 使用 TS 解析器替代默认的 JS 解析器
      parser: tseslint.parser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: { jsx: true },
      },
    },
    rules: {
      // 继承插件的推荐规则
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ]
    },
  },
])