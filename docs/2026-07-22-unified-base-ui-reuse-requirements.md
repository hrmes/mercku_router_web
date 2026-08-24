# Unified 复用 Base UI 外壳需求

## 背景

现有 M6、M6a、M6s、M6s PoE、Nano、GA630 并不是分别维护一整套界面。
各型号虽然有自己的 `main.js`、`App.vue`、router、menu、store 和少量差异页面，
但实际共同复用了 `base` 中的 Header、Footer、Layout、公共组件、样式和大部分业务页面。

其中：

- M6 与 M6a 的 `App.vue` 相同；
- M6s、M6s PoE 与 Nano 的 `App.vue` 相同；
- 不同型号的 App Shell 只有少量实现差异；
- 各型号通常只保留 7～9 个确有差异的页面，其余页面来自 `base/pages`。

当前 `unified/` 为了尽快跑通启动链路，另外实现了 `AppHeader`、`AppFooter`、
`AppAside` 和 `PrimaryLayout`。这些临时实现已经出现主题、二级菜单和样式细节与
原界面不一致的问题。继续逐项调整样式会形成第二套 UI，后续维护成本较高。

## 目标

`unified/` 应复用现有成熟的 Base UI 外壳，界面和交互以现有 M6s 系列为基准。

统一版本只新增运行时适配能力，不重新实现已有 UI：

- `unified` 负责 identity、Profile、runtime context、动态菜单、动态路由、Store、
  HTTP 和离线调试适配；
- `base` 继续负责 Header、Footer、Layout、公共组件、公共样式和公共业务页面；
- 型号和客户差异通过 runtime context/Profile 注入，不在公共 UI 中直接判断具体 ID。

## 改造要求

### 1. 复用 Base UI

统一入口优先直接复用：

```text
base/src/component/header/header.vue
base/src/component/footer/index.vue
base/src/layouts/default.vue
base/src/layouts/primary.vue
base/src/pages/bussiness/dashboard/index.vue
base/src/pages/**
base/src/style/**
```

`unified/src/app/components/AppHeader.vue`、`AppFooter.vue`、`AppAside.vue` 和
`unified/src/app/layouts/PrimaryLayout.vue` 只视为过渡代码。Base UI 接入完成后应删除，
不要继续在这些组件中补齐旧界面的样式和功能。

### 2. App Shell 沿用现有结构

统一入口的 App Shell 应沿用现有型号 App 的工作方式：

- 根据 route meta 选择 `default` 或 `primary` layout；
- 根据当前一级菜单生成 `asideInfo`；
- Header 接收运行时生成的菜单；
- Layout 内直接承载 `router-view`；
- 保留原有桌面端二级菜单、移动端菜单、Footer、页面过渡和滚动行为。

不要求直接复制某个型号的全部 `App.vue`，但最终 DOM 结构和行为应与成熟实现一致。

### 3. 将 Base 的编译期依赖改为可注入数据

Base UI 中现有的以下编译期依赖需要逐步改造成运行时数据：

```text
process.env.MODEL_CONFIG
process.env.CUSTOMER_CONFIG
```

运行时数据来源为 unified 的 runtime context，包括：

- `branding`：Logo、产品名、网站、主题色、语言、背景等；
- `effectiveCapabilities`：最终可用设备能力；
- `behavior`：设备行为参数；
- `policy`：少量客户策略；
- 运行时生成的菜单、当前 role 和 mode。

建议优先通过 props、Store getter 或小型兼容适配层注入，不要让 Base Header/Layout
直接依赖 unified 目录，也不要在组件内新增具体型号或客户 ID 判断。

### 4. 保持旧构建可用

本阶段仍是旁路迁移，M6、M6a、M6s、M6s PoE、Nano、GA630 的旧构建不能被破坏。

修改 Base 公共组件时，应同时兼容：

- 旧入口提供的编译期配置；
- unified 提供的 runtime context。

可以增加明确的兼容读取函数，但不要把新的 `process.env` 判断散落到更多页面。
完成统一版验证和正式切流后，再单独删除旧入口兼容逻辑。

### 5. 保留 Unified 已完成的运行时架构

以下能力继续保留，不因复用 Base UI 而退回编译期方案：

- Web 只构建一次；
- suite 只提供 model/customer/backend identity；
- Model/Customer Profile 和品牌资源内置于同一份 dist；
- 菜单和路由根据 capability、policy、role、mode 在运行时生成；
- 页面和业务代码不直接判断具体 MODEL_ID/CUSTOMER_ID；
- `npm run dev:unified` 的离线登录和 API fixture 继续可用。

### 6. 页面复用原则

- Base 已有且各型号一致的页面：直接复用 Base；
- 型号目录中的页面只是轻微差异：优先把差异收敛为 capability、Profile 数据或统一 API；
- 确实依赖不同硬件/API 且暂时无法统一的页面：再使用语义化 page variant；
- 不要为了 unified 再复制一份完整页面后逐项改样式。

## 验收标准

- Unified 的 Header、Footer、一级菜单、二级菜单、主题和响应式行为与现有 M6s 界面一致；
- 默认首次打开使用浅色主题，已有明确主题选择时可正确恢复；
- 设置、高级和升级页面显示正确的左侧二级菜单，选中、禁用和跳转状态正确；
- 登录、登出、语言切换、主题切换和移动端菜单可用；
- Dashboard 和公共业务页面直接复用 Base，不再维护 unified 副本；
- 修改 Base 后，旧型号构建和 unified 构建均能通过；
- 同一份 unified dist 在不同 Model/Customer Profile 下展示正确品牌和能力；
- `unified` 业务代码中没有具体型号、客户或 backend 分支。

## 非本次重点

本次先解决公共 UI 外壳复用，不要求同时完成所有型号专属页面和后端 API 的统一。
SFP、PoE、风扇、Frozen Config、Mesh Add 等页面可按后续页面/API 盘点结果逐步迁移。

