# Supreme Player 构建与打包 Skill

> 用于构建和打包 Supreme Player 插件的标准化流程

---

## 概述

本 Skill 提供 Supreme Player 插件的构建和打包指引，确保每次发布的一致性。

---

## 前置条件

- Node.js >= 16
- npm
- 已安装 esbuild（通过 npm install）

---

## 构建流程

### 1. 安装依赖

```bash
cd .obsidian/plugins/supreme-player
npm install
```

### 2. 开发模式

```bash
npm run dev
```

功能：
- 监听 src/ 目录下的文件变化
- 自动重新构建 main.js
- 生成 source map 便于调试

### 3. 生产构建

```bash
npm run build
```

功能：
- 单次构建
- 输出压缩后的 main.js
- 不生成 source map

---

## 打包流程

### 1. 更新版本号

编辑 `manifest.json`：

```json
{
  "version": "x.y.z-suffix"
}
```

版本号格式：
- beta：测试版本，如 `0.1.0-beta`
- test：内部测试，如 `0.1.1-test`
- release：正式版本，如 `1.0.0`

### 2. 执行构建

```bash
npm run build
```

### 3. 创建发布目录

```bash
mkdir -p Projects/supreme-player-<version>
```

### 4. 复制文件

需复制的文件：
- `main.js` - 构建产物
- `manifest.json` - 插件清单
- `styles.css` - 样式文件

```bash
cp main.js Projects/supreme-player-<version>/
cp manifest.json Projects/supreme-player-<version>/
cp styles.css Projects/supreme-player-<version>/
```

### 5. 验证发布包

检查文件：
- main.js 大小应在 150-200KB 之间
- manifest.json 版本号正确
- styles.css 不为空

---

## 检查清单

### 发布前检查

- [ ] 版本号已更新
- [ ] 无敏感个人信息（如个人路径、邮箱等）
- [ ] 默认配置完整（牛奶、超级大钻石等）
- [ ] 日记同步功能正常
- [ ] 所有弹窗可正常打开

### 安全检查

使用 grep 搜索敏感信息：

```bash
grep -r "LH_Lshen\|email\|password\|token\|E:\\|C:\\|Users" .
```

---

## 目录结构

```
Projects/
├── supreme-player-beta-0.1/      # Beta 版本
│   ├── main.js
│   ├── manifest.json
│   └── styles.css
├── supreme-player-test/          # Test 版本
│   ├── main.js
│   ├── manifest.json
│   └── styles.css
└── supreme-player-release/       # Release 版本
    ├── main.js
    ├── manifest.json
    └── styles.css
```

---

## 安装方式

### 用户安装

1. 下载发布包
2. 解压到 `<vault>/.obsidian/plugins/supreme-player/`
3. 在 Obsidian 设置中启用插件

### 开发者安装

1. 克隆源码到 `<vault>/.obsidian/plugins/supreme-player/`
2. 执行 `npm install`
3. 执行 `npm run build`
4. 在 Obsidian 设置中启用插件

---

## 常见问题

### Q: 构建失败

检查 Node.js 版本：
```bash
node --version
```

重新安装依赖：
```bash
rm -rf node_modules
npm install
```

### Q: 插件无法加载

检查 manifest.json 格式：
- id 必须与目录名一致
- version 必须为有效版本号
- minAppVersion 必须与 Obsidian 版本兼容

### Q: main.js 太大

检查是否有不必要的依赖被打包：
- obsidian 应标记为 external
- 不应打包运行时不需要的库

---

## 版本号规范

格式：`major.minor.patch-suffix`

- **major**：主版本号，重大变更
- **minor**：次版本号，新功能
- **patch**：修订号，Bug 修复
- **suffix**：后缀，可选

后缀说明：
- `-alpha`：内部测试
- `-beta`：公开测试
- `-test`：临时测试
- `-rc`：候选版本
- 无后缀：正式版本

---

## 自动化脚本

### Windows 批处理

```batch
@echo off
cd /d "F:\PythonSpace\Github\Super-Player\ProjectManager\.obsidian\plugins\supreme-player"
call npm run build
mkdir "F:\PythonSpace\Github\Super-Player\ProjectManager\Projects\supreme-player-%1"
copy main.js "F:\PythonSpace\Github\Super-Player\ProjectManager\Projects\supreme-player-%1\"
copy manifest.json "F:\PythonSpace\Github\Super-Player\ProjectManager\Projects\supreme-player-%1\"
copy styles.css "F:\PythonSpace\Github\Super-Player\ProjectManager\Projects\supreme-player-%1\"
echo Package created: supreme-player-%1
```

使用方式：
```batch
build.bat test
```
