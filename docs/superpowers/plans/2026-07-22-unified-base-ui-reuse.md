# Unified 复用 Base UI 外壳 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 让 Unified 直接复用 Base 的 Header、Footer、Layout、Dashboard 和公共样式，删除 Unified 临时 UI 副本，同时保持旧型号构建与单一运行时产物都可用。

**Architecture:** 新增一个位于 `base/src/runtime/` 的兼容读取层：Unified 优先从 Vuex runtime context 读取 branding/capabilities，旧入口则在同一个文件内安全回退到编译期配置。Base Header、Footer、Language、Dashboard 不再散落读取 `process.env`。App Shell 作为 Base 公共组件维护，Unified 只负责生成运行时菜单并传入，不再复制 M6s 的整套模板和样式。

**Tech Stack:** Vue 2.7.14、Vuex 3.6、Vue Router 3.0、Vue CLI 3.1、webpack 4、Sass、Mocha/Chai、Playwright。

---

## 一、必须保持的边界

1. Unified 继续只构建一份 dist，不能重新引入 `MODEL_ID`、`CUSTOMER_ID` 编译分支。
2. 旧 M6、M6a、M6s、M6s PoE、Nano、GA630 构建在迁移期间必须保持可用。
3. Base 组件不得依赖 `unified/`。公共兼容逻辑必须位于 `base/src/runtime/`。
4. Unified 的 Model/Customer Profile、runtime menu/router/store/http 和离线预览继续保留。
5. Runtime menu 是冻结对象。所有消费组件必须只读，不能给菜单项追加 `key`、`index`、`selected` 等字段。
6. Header Logo、Footer QR、Dashboard App Icon 必须使用 webpack import 后的运行时 URL；不能根据客户名称拼目录。
7. 不修改六套旧 Store 来伪造 runtime getters。旧入口兼容统一收敛在 Base resolver，减少影响面。

## 二、最终文件结构

```text
base/src/runtime/ui-context.js              # runtime/legacy UI 数据兼容读取
base/src/layouts/app-shell.vue              # 共用 App Shell
base/src/component/header/header.vue        # runtime branding + 只读菜单
base/src/component/footer/index.vue         # runtime branding + runtime QR
base/src/mixins/language.js                  # runtime languages
base/src/pages/bussiness/dashboard/index.vue# runtime Dashboard

unified/src/app/App.vue                     # 只生成 menu，渲染 BaseAppShell
unified/src/app/register-components.js      # 注册 Base Header/Footer
unified/src/app/router/definitions.js       # Dashboard 指向 base
unified/src/profiles/customers/*/index.js   # webpack 导入品牌资源

删除：
unified/src/app/components/AppHeader.vue
unified/src/app/components/AppFooter.vue
unified/src/app/components/AppAside.vue
unified/src/app/layouts/PrimaryLayout.vue
unified/src/pages/dashboard/index.vue
```

---

## Task 1：建立 Base UI Runtime 兼容读取层

**Files:**
- Create: `base/src/runtime/ui-context.js`
- Create: `tests/unit/compatibility/base-ui-context.spec.js`

该层是 Base UI 唯一允许读取旧编译期 Customer Config 的位置。Base 组件后续只调用这里的函数。

- [ ] **Step 1：先写失败测试**

覆盖以下行为：

```javascript
const runtimeStore = {
  getters: {
    branding: {
      productName: 'Runtime Router',
      website: { text: 'Support', url: 'https://example.com' },
      languages: ['en-US'],
      defaultLanguage: 'en-US',
      logoUrl: '/logo.svg',
      qrCodeUrl: '/qr.png',
      appIconUrl: '/app.png',
    },
  },
};

expect(resolveUiBranding(runtimeStore).productName).to.equal('Runtime Router');
expect(resolveUiBranding({}).productName).to.be.a('string').and.not.empty;
```

还要验证：runtime getter 优先；没有 runtime context 时不抛错；返回对象包含完整安全默认值。

- [ ] **Step 2：运行测试，确认因模块不存在而失败**

```bash
NODE_OPTIONS=--openssl-legacy-provider \
  ./node_modules/.bin/vue-cli-service test:unit \
  tests/unit/compatibility/base-ui-context.spec.js
```

Expected: FAIL，提示 `base/runtime/ui-context` 不存在。

- [ ] **Step 3：实现 `resolveUiBranding(store)`**

接口固定返回：

```javascript
{
  productName,
  website,
  policyUrl,
  appDownloadUrl,
  languages,
  defaultLanguage,
  logoUrl,
  qrCodeUrl,
  appIconUrl,
  legacyAssetFolder,
}
```

规则：

- `store.getters.branding` 是非空对象时直接作为主要数据源；
- 否则安全读取 `process.env.CUSTOMER_CONFIG || {}`；
- `legacyAssetFolder` 只供旧 Footer/Dashboard 回退，Unified 不使用；
- 默认产品名为 `Router`，默认语言为 `en-US`，URL 默认为空字符串；
- 不返回函数形式的 branding，不修改 Store。

- [ ] **Step 4：运行测试，确认通过**

Run: Task 1 Step 2 的命令。

Expected: PASS。

- [ ] **Step 5：提交**

```bash
git add base/src/runtime/ui-context.js tests/unit/compatibility/base-ui-context.spec.js
git commit -m "refactor(base): centralize runtime UI branding access"
```

---

## Task 2：补齐运行时品牌资源合同

**Files:**
- Modify: `unified/src/app/profiles/customer-profile.schema.json`
- Modify: `unified/src/profiles/customers/0001/index.js`
- Modify: `unified/src/profiles/customers/0029/index.js`
- Modify: `unified/src/profiles/customers/neutral/index.js`
- Add: `unified/src/profiles/customers/0001/assets/qr.png`
- Add: `unified/src/profiles/customers/0001/assets/app-icon.png`
- Add: `unified/src/profiles/customers/0029/assets/qr.png`
- Add: `unified/src/profiles/customers/0029/assets/app-icon.png`
- Modify: `tests/unit/branding/customer-profile-index.spec.js`
- Modify: `tests/unit/profiles/contract.spec.js`

Profile JSON 仍只保存可由 Node 校验的数据；二进制资源 URL 继续由每个 Customer `index.js` 通过 webpack import 后附加。

- [ ] **Step 1：先增加失败测试**

断言 0001、0029 webpack 组装后的 `branding` 包含非空 `qrCodeUrl` 和 `appIconUrl`，并且组装后的对象仍通过 Customer Profile schema。

Neutral Profile 允许两个字段缺失；缺失时 Footer/Dashboard 隐藏对应入口，不使用其他客户资源兜底。

- [ ] **Step 2：运行测试，确认字段缺失**

```bash
NODE_OPTIONS=--openssl-legacy-provider \
  ./node_modules/.bin/vue-cli-service test:unit \
  tests/unit/branding/customer-profile-index.spec.js \
  tests/unit/profiles/contract.spec.js
```

Expected: FAIL，提示 `qrCodeUrl`/`appIconUrl` 缺失或 schema 不允许。

- [ ] **Step 3：扩展 schema 和 webpack 组装层**

在 branding schema 中增加两个可选的 webpack URL：

```json
"qrCodeUrl": { "type": "string", "minLength": 1 },
"appIconUrl": { "type": "string", "minLength": 1 }
```

从现有 Base 客户资源复制对应文件到 Customer Profile assets，并在 `index.js` 中静态 import：

```javascript
import qrCodeUrl from './assets/qr.png';
import appIconUrl from './assets/app-icon.png';

branding: { ...profile.branding, logoUrl, faviconUrl, qrCodeUrl, appIconUrl }
```

Chunk 名继续使用 webpack hash，不显式包含客户 ID。

- [ ] **Step 4：运行 Profile 校验和测试**

```bash
node scripts/validate-profiles.mjs
NODE_OPTIONS=--openssl-legacy-provider \
  ./node_modules/.bin/vue-cli-service test:unit \
  tests/unit/branding/customer-profile-index.spec.js \
  tests/unit/profiles/contract.spec.js
```

Expected: 全部 PASS。

- [ ] **Step 5：提交**

```bash
git add unified/src/app/profiles unified/src/profiles/customers tests/unit/branding tests/unit/profiles
git commit -m "feat(profiles): add runtime QR and app icon assets"
```

---

## Task 3：改造 Base Language 和 Header

**Files:**
- Modify: `base/src/mixins/language.js`
- Modify: `base/src/component/header/header.vue`
- Create: `tests/unit/layout/base-header-runtime.spec.js`

- [ ] **Step 1：先写 Header 回归测试**

至少覆盖：

1. `getList()` 接收 `Object.freeze()` 的菜单树时不抛错；
2. 调用前后输入菜单深度相等，且没有新增 `key`/`index`；
3. 返回的新菜单包含 UI 所需的 key、index、selected；
4. `/setting/wan` 不会错误选中 `/setting/wanping`；
5. website、logo 和 languages 优先读取 runtime branding；
6. branding 缺失时旧入口不会崩溃。

- [ ] **Step 2：运行测试，确认冻结菜单失败**

```bash
NODE_OPTIONS=--openssl-legacy-provider \
  ./node_modules/.bin/vue-cli-service test:unit \
  tests/unit/layout/base-header-runtime.spec.js
```

Expected: FAIL；当前 Header 会给冻结菜单写入 `key/index`，并引用未初始化的 `children`。

- [ ] **Step 3：把 Language 改为组件期计算**

- 保留一份不可变的完整语言常量；
- `Languages` 改为 computed，通过 `resolveUiBranding(this.$store).languages` 过滤；
- 配置为空时兼容旧客户，显示完整列表；
- 配置全部无效时至少回退 English，不能返回空数组；
- 删除模块加载阶段直接访问 `process.env.CUSTOMER_CONFIG.languages` 的代码。

- [ ] **Step 4：把 Header 品牌数据改为 runtime resolver**

- `website` 使用 `resolveUiBranding(this.$store).website`；
- 增加 `branding` computed；
- `branding.logoUrl` 存在时在 `.logo-wrap__logo` 内渲染 `<img>`；
- URL 缺失时保留原 CSS background，保证旧构建不变；
- 图片使用 `object-fit: contain`，不要在 Unified 再写一套 Header Logo 样式。

- [ ] **Step 5：把 `getList()` 改成纯函数**

禁止：

```javascript
m.key = index;
mm.index = ii;
return { ...mm, children };
```

改成只创建新对象：

```javascript
const children = (m.children || []).map((child, childIndex) => ({
  ...child,
  index: childIndex,
}));
return { ...m, key: index, children, selected, showChild: false };
```

同时把错误的 `menus` watcher 改为 deep watch `navs`。不得取消 `createMenu()` 的冻结保护。

- [ ] **Step 6：运行测试和相关旧测试**

```bash
NODE_OPTIONS=--openssl-legacy-provider \
  ./node_modules/.bin/vue-cli-service test:unit \
  tests/unit/layout/base-header-runtime.spec.js \
  tests/unit/i18n
```

Expected: PASS。

- [ ] **Step 7：提交**

```bash
git add base/src/mixins/language.js base/src/component/header/header.vue tests/unit/layout/base-header-runtime.spec.js
git commit -m "refactor(base): make header runtime-driven and menu-immutable"
```

---

## Task 4：改造 Base Footer

**Files:**
- Modify: `base/src/component/footer/index.vue`
- Create: `tests/unit/layout/base-footer-runtime.spec.js`

- [ ] **Step 1：先写失败测试**

覆盖 productName、policyUrl、qrCodeUrl 的 runtime 读取，以及没有 QR 时不生成错误 URL。

- [ ] **Step 2：运行测试确认失败**

```bash
NODE_OPTIONS=--openssl-legacy-provider \
  ./node_modules/.bin/vue-cli-service test:unit \
  tests/unit/layout/base-footer-runtime.spec.js
```

- [ ] **Step 3：实现 runtime Footer**

- productName/policyUrl 使用 `resolveUiBranding(this.$store)`；
- Unified 使用 `branding.qrCodeUrl`；
- 旧入口没有 qrCodeUrl 时，才允许通过 `legacyAssetFolder` 使用原 webpack context require；
- 二者都没有时隐藏 QR 区域；
- 不再在 Footer 内执行 `title.toLowerCase()`；
- 版权和 App 文案继续使用现有 i18n。

- [ ] **Step 4：运行测试确认通过**

Run: Task 4 Step 2 的命令。

- [ ] **Step 5：提交**

```bash
git add base/src/component/footer/index.vue tests/unit/layout/base-footer-runtime.spec.js
git commit -m "refactor(base): make footer consume runtime branding assets"
```

---

## Task 5：在 Base 建立共享 App Shell

**Files:**
- Create: `base/src/layouts/app-shell.vue`
- Modify: `unified/src/app/App.vue`
- Modify: `unified/src/app/register-components.js`
- Replace/Delete: `tests/unit/layout/primary-layout.spec.js`
- Create: `tests/unit/layout/base-app-shell.spec.js`

不要把 M6s `App.vue` 的全部模板和样式复制到 Unified。把成熟结构整理成一个 Base 组件，Unified 只传菜单。

- [ ] **Step 1：先写 App Shell 失败测试**

覆盖：

- `/setting/wifi` 返回 setting children；
- `/advance/dhcp` 返回 advance children；
- `/upgrade/offline` 返回 upgrade children；
- `/dashboard` 不显示 aside；
- 路径判断通过匹配 menu child URL 完成，不使用 `split('/')[2]`；
- 组件使用 Base `default.vue`、`primary.vue`、`m-header`、`m-footer`。

- [ ] **Step 2：运行测试，确认组件尚不存在**

```bash
NODE_OPTIONS=--openssl-legacy-provider \
  ./node_modules/.bin/vue-cli-service test:unit \
  tests/unit/layout/base-app-shell.spec.js
```

- [ ] **Step 3：实现 `base/src/layouts/app-shell.vue`**

以 M6s App Shell 的 DOM、样式和交互为基准，但修正以下旧问题：

- `asideInfo` 根据当前 path 匹配传入菜单的 children；
- resize listener 使用稳定方法引用，例如 `this.onResize`，确保能 remove；
- scroll listener 在移动端状态变化时正确注册/注销；
- 不修改 `menus` prop；
- `isMobile` 和 `hasTransition` 可以继续更新所有旧 Store 都已有的 state，不要求旧 Store新增 mutation；
- Layout 内继续使用原生 `router-view`，保留路由 meta 的 default/primary 切换。

- [ ] **Step 4：让 Unified App 只负责生成菜单**

Unified App 的目标结构：

```vue
<template>
  <BaseAppShell :menus="menus" />
</template>
```

`menus` 继续由 `createMenu(runtimeContext, role, mode)` 生成。不要解冻或复制后再写回 Store。

在 `unified/src/app/register-components.js` 注册 Base Header/Footer 所需的现有全局组件。

- [ ] **Step 5：运行测试、lint 和构建**

```bash
NODE_OPTIONS=--openssl-legacy-provider \
  ./node_modules/.bin/vue-cli-service test:unit \
  tests/unit/layout/base-app-shell.spec.js \
  tests/unit/layout/base-header-runtime.spec.js \
  tests/unit/layout/base-footer-runtime.spec.js

NODE_OPTIONS=--openssl-legacy-provider \
  ./node_modules/.bin/vue-cli-service lint \
  base/src/layouts/app-shell.vue unified/src/app/App.vue

NODE_OPTIONS=--openssl-legacy-provider npm run build:unified
```

Expected: 全部通过；设置、高级、升级的 aside 测试均有数据。

- [ ] **Step 6：提交**

```bash
git add base/src/layouts/app-shell.vue unified/src/app/App.vue unified/src/app/register-components.js tests/unit/layout
git commit -m "feat(base): add shared runtime-compatible app shell"
```

---

## Task 6：让 Base Dashboard 支持 Runtime Context

**Files:**
- Modify: `base/src/pages/bussiness/dashboard/index.vue`
- Modify: `base/src/mixins/mesh-edit.js`
- Modify: `base/src/mixins/router-model.js`（仅补统一 runtime fallback，不改旧逻辑）
- Modify: `unified/src/app/router/definitions.js`
- Delete: `unified/src/pages/dashboard/index.vue`
- Modify/Create: `tests/unit/layout/dashboard-artwork.spec.js`
- Modify: `tests/unit/compatibility/runtime-env-fallbacks.spec.js`

当前 Unified 仍加载自己的 Dashboard 副本。本任务完成后才算真正复用 Base Dashboard。

- [ ] **Step 1：先写失败测试**

在完全没有 `MODEL_CONFIG/CUSTOMER_CONFIG` 的测试环境中验证 Base Dashboard：

- productName 来自 `store.getters.branding.productName`；
- App 下载地址和图标来自 runtime branding；
- 路由器图片使用语义化 capability class；
- fanControl → Nano 图；frozenConfig → M6 图；默认 → M6s 图；
- mesh-edit 在 runtime 模式下至少提供 black/white，不访问具体型号 ID；
- legacy 分支仍保留现有型号颜色和产品信息。

- [ ] **Step 2：运行测试，确认 Base Dashboard 因 env 访问失败**

```bash
NODE_OPTIONS=--openssl-legacy-provider \
  ./node_modules/.bin/vue-cli-service test:unit \
  tests/unit/layout/dashboard-artwork.spec.js \
  tests/unit/compatibility/runtime-env-fallbacks.spec.js
```

- [ ] **Step 3：把已验证的 Unified Runtime 适配合并回 Base Dashboard**

- productName 使用 runtime branding，旧入口继续使用原 product mapping；
- appDownloadUrl/appIconUrl 使用 runtime branding；
- router artwork 使用现有 `router-image--m6s/m6/nano` 语义 class；
- `mesh-edit.js` 检测到 runtimeContext 时使用安全通用颜色和普通 `deviceColor` 存储键；
- runtime 分支不得访问具体 MODEL_ID/CUSTOMER_ID；
- 旧入口分支保持现有功能。

允许的首版删减：Neutral Profile 没有 App Icon/下载地址时隐藏 App 下载入口；Unified 的 mesh 颜色首版只提供 black/white。不能因为缺少这些资源阻止 Dashboard 启动。

- [ ] **Step 4：切换 Dashboard 路由并删除副本**

```javascript
const DashboardPage = () => import('base/pages/bussiness/dashboard/index.vue');
```

确认没有引用后删除 `unified/src/pages/dashboard/index.vue`。

- [ ] **Step 5：运行测试和 Unified 构建**

```bash
NODE_OPTIONS=--openssl-legacy-provider \
  ./node_modules/.bin/vue-cli-service test:unit \
  tests/unit/layout/dashboard-artwork.spec.js \
  tests/unit/compatibility/runtime-env-fallbacks.spec.js \
  tests/unit/router/create-router.spec.js

NODE_OPTIONS=--openssl-legacy-provider npm run build:unified
```

Expected: PASS，构建中不再包含 Unified Dashboard 源文件。

- [ ] **Step 6：提交**

```bash
git add base/src/pages/bussiness/dashboard base/src/mixins unified/src/app/router unified/src/pages tests/unit
git commit -m "refactor(unified): reuse runtime-compatible base dashboard"
```

---

## Task 7：删除 Unified 临时 UI

**Files:**
- Delete: `unified/src/app/components/AppHeader.vue`
- Delete: `unified/src/app/components/AppFooter.vue`
- Delete: `unified/src/app/components/AppAside.vue`
- Delete: `unified/src/app/layouts/PrimaryLayout.vue`
- Delete/Modify: 只针对这些临时组件的单元测试

- [ ] **Step 1：确认生产代码无引用**

```bash
rg -n 'AppHeader|AppFooter|AppAside|PrimaryLayout' unified/src
```

Expected: 仅剩待删除文件自身，或完全无结果。

- [ ] **Step 2：使用 `git rm` 删除临时组件**

```bash
git rm unified/src/app/components/AppHeader.vue \
       unified/src/app/components/AppFooter.vue \
       unified/src/app/components/AppAside.vue \
       unified/src/app/layouts/PrimaryLayout.vue
```

- [ ] **Step 3：运行完整单元测试和边界检查**

```bash
NODE_OPTIONS=--openssl-legacy-provider npm run test:unit
npm run check:unified-ids
git diff --check
```

Expected: 全部通过，且没有 concrete ID 泄漏到 Unified 非 Profile 代码。

- [ ] **Step 4：提交**

```bash
git add -A
git commit -m "chore(unified): remove temporary UI shell copies"
```

---

## Task 8：旧构建、Unified E2E 与生产构建验证

**Files:**
- Modify: `e2e/specs/runtime-branding.spec.ts`
- Modify: `e2e/specs/navigation.spec.ts` 或新建 `e2e/specs/runtime-shell.spec.ts`
- Modify: `playwright.config.ts`（仅当离线环境变量未正确传给 webServer）

- [ ] **Step 1：增加 Runtime Shell E2E**

至少验证：

- 在浏览器 `colorScheme: dark` 下首次启动仍为 `html.light`；
- 登录后 Dashboard 使用 Base DOM 且正常显示；
- Header Logo URL 对应当前 Customer Profile；
- 设置显示二级菜单并可进入 WAN；
- 高级和升级显示各自二级菜单；
- language、theme modal、logout 可操作；
- console/pageerror 为空；
- 0001 与 0029 切换 identity 后无需重新构建，Logo、主题色、QR 随 Profile 切换。

- [ ] **Step 2：运行 Unified Runtime E2E**

先确认 8080 没有遗留旧 dev server，然后执行：

```bash
RUNTIME_E2E=1 \
MERCKU_OFFLINE_PREVIEW=1 \
VUE_APP_OFFLINE_PREVIEW=1 \
NODE_OPTIONS=--openssl-legacy-provider \
npm run test:e2e
```

Expected: runtime-identity 项目全部 PASS。不能直接运行缺少 `RUNTIME_E2E=1` 的 `npm run test:e2e`，当前 Playwright 配置会主动报错。

- [ ] **Step 3：验证两个代表性旧构建**

```bash
NODE_OPTIONS=--openssl-legacy-provider \
  make build CUSTOMER_ID=0001 MODEL_ID=M11R4

NODE_OPTIONS=--openssl-legacy-provider \
  make build CUSTOMER_ID=0001 MODEL_ID=GA630
```

Expected: 两个旧构建都成功。M11R4 覆盖 M6s 共用壳层，GA630 覆盖独立入口差异。

- [ ] **Step 4：验证 Unified 生产构建**

```bash
NODE_OPTIONS=--openssl-legacy-provider npm run build:unified
node scripts/hash-web-dist.mjs dist-unified
git diff --check
```

Expected: 构建成功并输出 dist hash。已有 Base lint/体积 warning 可以记录，但不能出现新的编译错误。

- [ ] **Step 5：最终结构检查**

```bash
test -f base/src/layouts/app-shell.vue
test ! -e unified/src/app/layouts/PrimaryLayout.vue
test ! -e unified/src/app/components/AppHeader.vue
test ! -e unified/src/pages/dashboard/index.vue
rg -n "DashboardPage.*base/pages/bussiness/dashboard" unified/src/app/router/definitions.js
npm run check:unified-ids
```

Expected: 全部退出 0。

- [ ] **Step 6：提交**

```bash
git add e2e playwright.config.ts
git commit -m "test: verify shared base UI shell across runtime profiles"
```

---

## 三、任务顺序

```text
Task 1  Base runtime resolver
  → Task 2  Runtime Logo/QR/App Icon assets
  → Task 3  Language + Header（先解决冻结菜单）
  → Task 4  Footer
  → Task 5  Base App Shell + Unified 接入
  → Task 6  Base Dashboard + 删除 Dashboard 副本
  → Task 7  删除临时 UI
  → Task 8  E2E + 旧构建 + 生产构建
```

Task 3 必须早于 Task 5，否则 Base Header 接收冻结 runtime menu 时会立即报错。临时 UI 只能在 Base App Shell、Header、Footer、Dashboard 均验证通过后删除。

## 四、最终验收标准

- Unified Header、Footer、一级菜单、二级菜单、主题、语言和响应式行为来自 Base 实现；
- Unified 不再维护 AppHeader/AppFooter/AppAside/PrimaryLayout/Dashboard 副本；
- Base Header 不修改冻结菜单，不再出现 object is not extensible；
- `/setting/*`、`/advance/*`、`/upgrade/*` 二级菜单正确；
- Logo、favicon、QR、App Icon 来自当前 Customer Profile 的 webpack URL；
- 首次启动默认浅色，已有主题选择可恢复；
- M11R4、GA630 旧构建通过，Unified 生产构建通过；
- 同一份 Unified dist 在 0001、0029 和 Neutral Profile 下表现正确；
- `npm run test:unit`、runtime E2E、Profile 校验和 ID 边界检查通过；
- Unified 非 Profile 代码中没有具体型号、客户或 backend 分支。

## 五、明确不在本计划中解决

- suite 后端 API 的最终统一；
- SFP、PoE、Fan、Frozen Config、Mesh Add 的完整 page variant；
- 删除六套旧型号入口；
- Vue/Vue CLI/webpack 升级；
- 将所有旧型号 App.vue 立即替换为 `base/layouts/app-shell.vue`。

