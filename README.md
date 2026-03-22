# Mercku Router Webpages

Mercku 路由器 Web 管理界面项目，基于 Vue 2 + Vue CLI 3。

## 项目结构

```
mercku_router_web/
├── base/                    # 公共代码和资源
├── m6/                      # M6 型号源码
├── m6a/                     # M6a/M6c 型号源码
├── m6s/                     # M6s 型号源码
├── m6s_poe/                 # M6s PoE 型号源码
├── nano/                    # M6s Nano 型号源码
├── ga630/                   # GA630 型号源码
├── base/customer-conf/      # 客户配置文件
└── Makefile                 # 构建脚本
```

---

## 快速开始

### 开发环境

```bash
# 安装根目录依赖
npm install

# 启动开发服务器（指定客户和型号）
make dev CUSTOMER_ID=0001 MODEL_ID=M6R0
```

### 生产构建

```bash
# 使用 Makefile 构建
make build CUSTOMER_ID=0001 MODEL_ID=M6R0

# 产物位置：m6/dist/ 或 output/webui-xxx.tar
```

---

## 脱离 Makefile 编译

如果不想使用 Makefile，可以直接在型号目录下执行：

### 1. 安装依赖

```bash
cd m6  # 或其他型号目录
npm install
```

### 2. 开发模式

```bash
# 设置环境变量
export CUSTOMER_ID=0001
export MODEL_ID=M6R0

# 启动开发服务器
npm run dev
```

### 3. 生产构建

```bash
# 设置环境变量
export CUSTOMER_ID=0001
export MODEL_ID=M6R0

# 执行构建
npm run build
```

### 4. 一键命令（推荐）

```bash
# 开发
CUSTOMER_ID=0001 MODEL_ID=M6R0 npm run dev

# 构建
CUSTOMER_ID=0001 MODEL_ID=M6R0 npm run build
```

### 5. 手动指定 OpenSSL 兼容模式（Node.js 17+）

```bash
NODE_OPTIONS=--openssl-legacy-provider CUSTOMER_ID=0001 MODEL_ID=M6R0 npm run build
```

---

## Playwright E2E

当前仓库已在根目录接入 Playwright，首批只正式维护 `GA630`。

### 运行前提

- 本地会自动启动 `GA630` 前端开发服务器
- 默认将前端代理到 `http://192.168.127.40:55555`
- 如需覆盖代理目标，可设置 `DEV_PROXY_HOST`
- 如需执行登录后的用例，需设置 `PLAYWRIGHT_PASSWORD`

### 安装浏览器

```bash
npx playwright install chromium
```

### 常用命令

```bash
# 查看当前已注册的 E2E 用例
npx playwright test --config=playwright.config.ts --list

# 跑全部 GA630 用例
npm run test:e2e:ga630

# 跑完整 E2E 套件
npm run test:e2e

# 打开 Playwright UI
npm run test:e2e:ui
```

### 环境变量示例

```bash
# 仅验证登录页与基础渲染
DEV_PROXY_HOST=http://192.168.127.40:55555 npm run test:e2e:ga630

# 执行需要登录的 GA630 用例
DEV_PROXY_HOST=http://192.168.127.40:55555 PLAYWRIGHT_PASSWORD=your-router-password npm run test:e2e:ga630
```

### 当前覆盖范围

- 登录页可达
- `GA630` 顶层导航与功能显隐测试骨架
- 关键路由可达测试骨架

未提供 `PLAYWRIGHT_PASSWORD` 时，依赖登录的用例会被自动跳过。

---

## 新增硬件型号指南

### 步骤 1: 复制型号目录

```bash
# 以 M6s 为模板创建 GA630
cd /home/vincent-openclaw/mercku/mercku_router_web
cp -r m6s ga630

# 清理构建产物
cd ga630
rm -rf dist node_modules *.tar
```

### 步骤 2: 修改 package.json

编辑 `ga630/package.json`：

```json
{
  "name": "mercku_ga630_webpage",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "build": "NODE_OPTIONS=--openssl-legacy-provider ../node_modules/.bin/vue-cli-service build",
    "dev": "NODE_OPTIONS=--openssl-legacy-provider ../node_modules/.bin/vue-cli-service serve"
  },
  "devDependencies": {
    "@vue/cli-plugin-babel": "^3.1.1"
  }
}
```

### 步骤 3: 修改根目录 Makefile

编辑 `Makefile`，在 `MODEL_LIST` 中添加映射：

```makefile
MODEL_LIST = M6R0=m6 M8=m6a M11R1=m6s M11R2=m6s M13R0=nano M16R0=m6s_poe GA630=ga630
```

### 步骤 4: 修改型号常量配置

编辑 `base/src/util/constant.js`，添加以下配置：

```javascript
// 1. RouterSnAB2Model - SN 前缀（AB 码）映射
export const RouterSnAB2Model = {
  // ... 其他型号
  GA630: '63'  // SN 前两位
};

// 2. Models - 型号 ID 映射
export const Models = {
  // ... 其他型号
  GA630: 'GA630'
};

// 3. SnABJMapName - SN AB+J 码到显示名称
export const SnABJMapName = {
  // ... 其他型号
  63: { 0: 'GA630' }  // J 码 0
};

// 4. ModelIdJMapName - 型号 ID+J 码到显示名称
export const ModelIdJMapName = {
  // ... 其他型号
  GA630: { 0: 'GA630' }
};

// 5. RouterHasModelDistinctionMap - 子型号区分
export const RouterHasModelDistinctionMap = {
  // ... 其他型号
  GA630: '0'
};
```

### 步骤 5: 修改拓扑图配置

编辑 `base/src/util/topo.js`，添加设备图片映射：

```javascript
// 如果复用 M6s 图片
[RouterSnAB2Model.GA630]: {
  [RouterHasModelDistinctionMap.GA630]: {
    gw: picM6sGateway,
    [Color.good]: picM6sGood,
    [Color.bad]: picM6sBad,
    [Color.offline]: picM6sOffline
  }
}
```

如需使用独立图片：

1. 将图片放入 `base/src/assets/images/topo/`
2. 在 topo.js 顶部 import 图片
3. 在 `picModelColorMap` 中引用

### 步骤 6: 添加客户配置

编辑 `base/customer-conf/0001/conf.json`，在 `routers` 中添加：

```json
{
  "routers": {
    // ... 其他型号
    "GA630": {
      "name": "GA630 Wi-Fi6 Router",
      "shortName": "GA630",
      "deviceColors": ["black", "white"]
    }
  }
}
```

`deviceColors` 定义该型号支持的设备颜色选项（用于 Mesh 编辑）。

### 步骤 7: 验证构建

```bash
# 使用 Makefile 构建
make build CUSTOMER_ID=0001 MODEL_ID=GA630

# 或脱离 Makefile 构建
cd ga630
CUSTOMER_ID=0001 MODEL_ID=GA630 npm run build
```

---

## 配置项说明

### MODEL_ID 列表

| MODEL_ID | 型号 | 目录 | SN 前缀 | J 码 |
|----------|------|------|--------|------|
| M6R0 | M6 | m6 | 06 | 0 |
| M8 | M6a/M6c | m6a | 08 | 0/1/2 |
| M11R1 | M6s | m6s | 11 | 0/1 |
| M11R2 | M6s SFP | m6s | 11 | 2 |
| M13R0 | M6s Nano | nano | 13 | 0 |
| M16R0 | M6s PoE++ | m6s_poe | 16 | 0 |
| GA630 | GA630 | ga630 | 63 | 0 |

### CUSTOMER_ID 列表

| CUSTOMER_ID | 客户 |
|-------------|------|
| 0001 | Mercku |

### SN 编码规则

https://merckutech.feishu.cn/wiki/wikcnYxwRQ5Eq3CC7SRsC8CCSac

---

## 本地调试开发（推荐）🚀

**原工程已预留本地调试流程**，无需反复烧录固件！

利用 `vue.config.js` 中预配置的 `devServer.proxy`，将 API 请求代理到真实路由器。

### 步骤

**1. 连接路由器到同一网络**

确保路由器已连接并可以访问（如 `192.168.127.1`）。

**2. 修改 vue.config.js**

编辑型号目录下的 `vue.config.js`（如 `ga630/vue.config.js`），找到 `devServer.proxy` 配置：

```javascript
// 修改前（默认指向官方测试服务器）
const host = CUSTOMER_CONFIG.host || 'http://mywifi.mercku.tech';

// 修改为路由器 IP
const host = 'http://192.168.127.1'; // 或你的路由器 IP
```

**3. 启动开发服务器**

```bash
cd ga630
CUSTOMER_ID=0001 MODEL_ID=GA630 npm run dev
```

**4. 访问本地地址**

浏览器打开 `http://localhost:8080`，即可看到 Web 界面。

### 优势

- ✅ **热重载**：修改代码后自动刷新，无需手动刷新
- ✅ **完整 DevTools**：支持 Chrome DevTools 调试 Vue 组件
- ✅ **真实 API**：直接调用路由器 API，数据真实
- ✅ **快速迭代**：修改 → 保存 → 立即生效

### 注意事项

1. **CORS 问题**：如果浏览器报 CORS 错误，需要确保路由器允许跨域请求
2. **登录状态**：可能需要在真实路由器上先登录一次
3. **代理配置**：`vue.config.js` 已配置所有 API 路径的代理：
   - `/app` → 路由器 API
   - `/firmware_upload` → 固件上传
   - `/log.log` → 系统日志
   - 等...

---

## 常见问题

### 1. Node.js 版本问题

如果遇到 `Error: error:0308010C:digital envelope routines::unsupported`，使用 OpenSSL 兼容模式：

```bash
NODE_OPTIONS=--openssl-legacy-provider npm run build
```

### 2. 菜单高亮错误

如果访问 `/setting/wanping` 时 `/setting/wan` 也被高亮，检查 `base/src/component/header/header.vue` 的 `getList()` 方法，确保使用正则精确匹配：

```javascript
const regex = new RegExp(`^${mm.url}(/|\\?|$)`);
if (regex.test(this.$route.path)) {
  selected = true;
}
```

### 3. 设备颜色未定义

如果报错 `Cannot read properties of undefined (reading 'deviceColors')`，检查 `base/customer-conf/0001/conf.json` 中是否添加了对应型号的配置。

---

## 其他客户配置

如需支持其他客户，复制 `base/customer-conf/0001/` 目录并修改：

```bash
cp -r base/customer-conf/0001 base/customer-conf/0002
```

然后在 `Makefile` 的 `CUSTOMER_LIST` 中添加客户 ID。
