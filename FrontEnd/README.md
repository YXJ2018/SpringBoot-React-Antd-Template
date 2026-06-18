# 技术栈说明

    这是一个基础React框架，主要引入了eslint+prettier插件，保证代码提交的一致性。

## 框架与运行时

| 技术       | 版本 | 说明                       |
| ---------- | ---- | -------------------------- |
| React      | 19.x | UI 框架，使用 JSX 语法     |
| TypeScript | 6.x  | 类型系统，target 为 ES2023 |

## 构建工具

| 技术                        | 版本  | 说明                            |
| --------------------------- | ----- | ------------------------------- |
| Vite                        | 8.x   | 开发服务器与生产构建工具        |
| @rolldown/plugin-babel      | 0.2.x | Babel 插件，集成 React Compiler |
| babel-plugin-react-compiler | 1.x   | React 编译器，自动优化组件渲染  |

## 样式方案

| 技术         | 版本 | 说明                                               |
| ------------ | ---- | -------------------------------------------------- |
| Tailwind CSS | 4.x  | 原子化 CSS 框架，通过 `@tailwindcss/vite` 插件集成 |
| CSS Modules  | -    | 组件级样式隔离，使用 `*.module.css` 文件命名约定   |

**样式分层策略：**

- `index.css` — 全局样式（CSS 变量、基础排版、ID 选择器布局）
- `tailwind.css` — Tailwind 入口，通过 `@import "tailwindcss"` 引入
- `*.module.css` — 组件局部样式，类名自动哈希隔离

## 代码规范

| 技术                        | 版本  | 说明                        |
| --------------------------- | ----- | --------------------------- |
| ESLint                      | 10.x  | 代码检查工具                |
| eslint-plugin-react-hooks   | 5.x   | React Hooks 规则检查        |
| eslint-plugin-react-refresh | 0.5.x | React Fast Refresh 规则检查 |
| typescript-eslint           | 8.x   | TypeScript ESLint 集成      |

## 包管理

| 工具 | 说明     |
| ---- | -------- |
| pnpm | 包管理器 |

## 路径别名

| 别名  | 映射目标  | 配置位置                               |
| ----- | --------- | -------------------------------------- |
| `@/*` | `./src/*` | `vite.config.ts` + `tsconfig.app.json` |

## 目录结构

```
src/
├── main.tsx          # 应用入口，引入全局 CSS 和 Tailwind
├── App.tsx           # 根组件
├── App.module.css    # 组件局部样式（CSS Modules）
├── index.css         # 全局样式与 CSS 变量
├── tailwind.css      # Tailwind CSS 入口
└── assets/           # 静态资源
```

## 开发命令

```bash
pnpm dev        # 启动开发服务器（端口 3000，自动打开浏览器）
pnpm build      # TypeScript 类型检查 + 生产构建
pnpm preview    # 预览生产构建产物
pnpm lint       # ESLint 代码检查
pnpm lint:fix   # ESLint 自动修复
```
