# Router Web 单一产物与内置 Profile 适配 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 建立一份独立构建的 Router Web dist；mercku-suite 只提供运行时设备身份和少量可探测硬件信息，Web 从同一产物内置的 Model/Customer Profiles 中按需加载功能、行为和品牌配置。

**Architecture:** 新应用在 `unified/` 中旁路开发，旧六套构建在切流前保持可用。启动时先读取 suite 原子生成的身份 JSON，再通过静态 Profile Registry 异步加载对应型号与客户 Profile，合并出 capabilities、behavior、branding、policy 和必要的 pageVariants，最后创建 Store、HTTP、菜单、Router 与 Vue；具体 ID 只允许出现在集中 registry/profile 中。

**Tech Stack:** 保持仓库当前版本：Vue 2.7.14、Vue CLI 3.1、webpack 4、Vue Router 3.0、Vuex 3.6、Axios 0.21、Vue I18n 8.28、Mocha/Chai、Playwright。迁移期间不升级或替换框架、构建器、路由、状态管理和测试体系。

---

## 1. 最终状态与硬约束

### 1.1 单一 Web 产物

- 最终只构建一次，只发布一份 Web dist。
- 所有设备安装的 `index.html`、JS、CSS、字体、图片、Logo、favicon、背景和 Profile chunks 完全相同。
- suite 生成的身份文件 `runtime-config.v1.json` 不属于 Web dist，不参与 dist hash 比较。
- 构建命令不接收 `MODEL_ID` 或 `CUSTOMER_ID`，不按型号或客户裁剪模块。
- 新增型号或客户需要发布一版包含新 Profile 的统一 dist，但仍不产生型号版/客户版分支产物。
- 浏览器通过异步 chunk 只加载当前型号和客户 Profile；设备存储中仍包含全部 Profile 和资源。

### 1.2 真正旁路开发

```text
unified/
  vue.config.js
  index.ejs
  src/main.js
```

- 根 `package.json` 与 `package-lock.json` 是唯一依赖和锁文件来源；CI 只在根目录执行一次 `npm ci`。
- `unified/` 不放 `package.json`，不是独立 npm package；根 scripts 通过 `cd unified && ../node_modules/.bin/vue-cli-service ...` 驱动构建和开发。
- `unified/` 通过 alias 只读复用现有 `base/src` 页面、组件和工具。
- 旁路阶段输出到仓库根部 `dist-unified/`。
- Tasks 1–9 只能 Copy/Adapt 旧实现，不得 Move、删除或改写旧六套入口、源码和构建配置；原文件继续服务旧构建。
- 现有 base 组件若需要不兼容的运行时改造，先在 `unified/src` 建适配版本；不得为了旁路版本破坏旧构建。
- 验证完成后可直接让固件打包 `dist-unified/`；是否把 `unified/` 提升为根入口不影响目标完成。

### 1.3 允许和禁止出现具体 ID 的位置

允许：

```text
unified/src/profiles/models/registry.js
unified/src/profiles/models/<MODEL_ID>/**
unified/src/profiles/customers/registry.js
unified/src/profiles/customers/<CUSTOMER_ID>/**
tests/fixtures/**
```

禁止：

- 页面组件直接判断 MODEL_ID/CUSTOMER_ID。
- menu/router/store/http/reconnect 根据具体 ID switch/if。
- 业务 mixin、工具函数或 API 调用根据 backend/model/customer 分支。
- 使用用户输入拼接动态 import 路径。

`backend` 是纯诊断信息，不参与 capability、behavior、API、页面、菜单或路由选择。Model Profile 可声明 `expectedBackends` 供开发、CI 和诊断日志检查；生产环境不因工程重命名直接阻止启动。若 backend 真正代表 API 不兼容，必须由 suite 统一；无法统一时回到跨仓库评审。

### 1.4 职责边界

mercku-suite 负责：

- 返回 `modelId/customerId/backend`。
- 返回它能够可靠探测的少量硬件存在性信息。
- 统一不同平台的 API 名称、参数、返回结构和错误语义。
- 在服务端执行真实的能力、角色和权限校验。

Router Web 负责：

- 内置 Model Profile：baseline capabilities、业务 behavior、诊断用 expectedBackends、必要 pageVariants。
- 内置 Customer Profile：Logo、favicon、产品名、主题、登录背景、语言和少量客户策略。
- 通过 registry 选择 Profile，校验并合并为最终运行时上下文。
- 根据最终上下文创建页面、菜单、路由和应用。

### 1.5 页面差异原则

按以下顺序处理：

1. suite 统一 API。
2. 页面共用，通过 capability 控制局部硬件区域。
3. 用普通 Profile 字段表达小型展示差异。
4. 前三项都不可行且有记录证据时，才在 Model Profile 增加语义化 pageVariant。

Page Variant 必须使用 `default/compact/multiWan` 等业务语义，禁止使用型号、平台或客户名称。首版默认所有 `pageVariants` 为空，不提前建立无需求的页面分支。

### 1.6 已接受风险：客户资源可见

单一 dist 会把所有 Customer Profiles、品牌名称、网站、Logo、favicon、背景、客户 CSS 和客户文案安装到每台设备。异步 chunk 只减少浏览器首屏请求，不能减少设备文件，也不能提供保密性。

当前阶段接受所有 Customer Profile 和品牌资源随统一 dist 发布，不将资源保密纳入本轮重构范围。后续若出现明确保密需求，再单独设计品牌资源交付方案，不在本计划中增加发布 Gate。Profile chunk 使用普通 webpack chunk ID/content hash，不显式包含型号或客户 ID；这只能降低显眼程度，不能作为安全措施。

---

## 2. Runtime Identity 合同

### 2.1 静态身份文件

mercku-suite 在设备启动、客户切换或硬件探测结果变化时原子生成：

```text
/www/runtime-config.v1.json
```

示例：

```json
{
  "schemaVersion": 1,
  "revision": "2026-07-21T10:00:00Z-1",
  "modelId": "M11R4",
  "customerId": "0007",
  "backend": "mercku_mtk7621",
  "detectedCapabilities": {
    "sfp": false
  }
}
```

约束：

- `detectedCapabilities` 可选，只包含 suite 能可靠探测的硬件存在性；不能包含品牌、菜单或前端状态机配置。
- suite 使用“临时文件 + fsync（平台支持时）+ 原子 rename”更新正式文件。
- HTTP 返回 `Cache-Control: no-store`。
- 文件登录前可读且不包含序列号、密码、密钥、管理 token 或内部调试地址。
- 加载不依赖 AppHttp、登录态或 `/app` RPC。
- 工作模式变化需要重新计算身份时，首版整页 reload，不实现热更新。

### 2.2 版本兼容

Task 2 开始前必须确认实际发布模型，不能长期作为 Open Question：

- 若 Web、suite 和 identity 文件总是随同一固件原子升级/回滚：首版只读取 `/runtime-config.v1.json` 并只接受 `schemaVersion: 1`，不实现 N/N-1 双文件；整体固件负责兼容和回滚。
- 若 Web 或 suite 可以独立升级：必须先扩展本计划，采用版本化文件和 N/N-1 生成；先发布能同时生成 v1/v2 的 suite，再发布读取 v2 的 Web。

两种模型共同遵守：

- v1 可增加有安全默认值的可选字段，禁止改变已有字段类型或语义。
- 删除字段、改变类型或语义必须升级 schemaVersion。
- 不兼容、缺失、非法或超时时，Web 显示内置中性错误页并允许重试，不创建管理 UI。

---

## 3. Profile 合同与合并规则

### 3.1 Model Profile

```json
{
  "profileVersion": 1,
  "expectedBackends": ["mercku_mtk7621"],
  "capabilities": {
    "sfp": false,
    "poeControl": true,
    "fanControl": false,
    "frozenConfig": false
  },
  "behavior": {
    "upgradeProbeStartDelayMs": 20000,
    "modeSwitchProbeStartDelayMs": 30000,
    "reconnectProbeTimeoutMs": 600000
  },
  "pageVariants": {}
}
```

规则：

- capabilities 只登记真实硬件或后端能力差异。
- v1 capability key 固定为 `sfp`、`poeControl`、`fanControl`、`frozenConfig`；同一个 key 必须贯穿 Model Profile、detectedCapabilities、Customer disabledCapabilities、menu/router 和页面局部显示。
- capability 使用前端产品能力语义，禁止使用 `*Api`、平台名或后端工程名；是否存在相应 API 由 suite 保证。
- Schedule、WPS、WAN Ping、Device Limit、LED 等 suite 计划统一支持的功能是公共功能，不进入 Model Profile。
- behavior 只表达设备流程事实，不暴露 `upgrading`、Promise finally、跳错误页等前端内部实现。
- `expectedBackends` 仅用于开发、CI 和生产诊断 warning，不参与功能选择，也不因不匹配直接阻止 UI。
- `pageVariants` 默认 `{}`；新增键必须经过附录 A 的差异决策门。

### 3.2 Customer Profile

Customer Profile 分成 Node 可校验的数据层和 webpack 资源装配层：

```text
customers/0007/
  profile.json
  index.js
  assets/
    logo.svg
    favicon.ico
    login-background.webp
```

```json
{
  "profileVersion": 1,
  "branding": {
    "productName": "Router",
    "wifiName": "Router Wi-Fi",
    "website": { "text": "Support", "url": "https://example.invalid" },
    "policyUrl": "",
    "appDownloadUrl": "",
    "languages": ["en-US", "zh-CN"],
    "defaultLanguage": "en-US",
    "theme": {
      "--brand-primary": "#d6001c",
      "--brand-loading": "#d6001c"
    }
  },
  "policy": {
    "disabledCapabilities": [],
    "allow2LevelAdmin": false,
    "allowTelnet": false
  }
}
```

```javascript
import profile from './profile.json';
import logoUrl from './assets/logo.svg';
import faviconUrl from './assets/favicon.ico';
import loginBackgroundUrl from './assets/login-background.webp';

export default {
  ...profile,
  branding: {
    ...profile.branding,
    logoUrl,
    faviconUrl,
    loginBackgroundUrl
  }
};
```

规则：

- Node CLI 只解析 `profile.json`，按固定约定检查 `assets/` 文件存在及 registry/目录对应，不直接 import SVG/ICO/WebP。
- webpack 构建和单元测试负责验证 `index.js` 能真正 import 资源；所有资源由 webpack 发射到统一 dist。
- 主题优先表达为白名单 CSS Variables，不保留按 CUSTOMER_ID 编译选择的 Sass 入口。
- 首版不设计任意 `hiddenMenus`、任意 `roleRestrictions` 或通用策略 DSL。
- v1 客户可关闭能力白名单 `customerDisableableCapabilities` 固定为 `sfp`、`poeControl`、`fanControl`、`frozenConfig`；扩展白名单必须单独评审，不能由 Customer Profile 自行声明。
- `disabledCapabilities` 只能引用已知 capability 且必须属于 `customerDisableableCapabilities`；只能关闭 Model Profile 已有能力，不能开启缺失能力。
- 客户语言差异优先收敛为公共语言包 + branding token；确需客户文案时随 Customer Profile chunk 打包。

### 3.3 静态 Registry 与异步 chunk

```javascript
// unified/src/profiles/models/registry.js
export const modelProfileLoaders = Object.freeze({
  M11R4: () => import('./M11R4/profile.json')
});

// unified/src/profiles/customers/registry.js
export const customerProfileLoaders = Object.freeze({
  '0007': () => import('./0007')
});
```

- Registry 必须是显式静态映射，确保 webpack 能发现所有 chunks，并避免路径注入。
- Loader 统一兼容 JSON/ES module 的 `module.default || module` 返回形态，并用单元测试锁定 webpack 4 行为。
- 未知 modelId 不使用 fallback，不启动管理 UI，因为能力和行为无法安全确定。
- 未知 customerId 加载内置 `neutral` Customer Profile，使用中性品牌和最保守策略，并显示/上报诊断警告；基础管理 UI 继续启动。
- Neutral Profile 至少设置 `allow2LevelAdmin:false`、`allowTelnet:false`，并通过 `disabledCapabilities` 关闭 `customerDisableableCapabilities` 白名单中的全部能力。
- Registry 不声明包含 ID 的 webpackChunkName，使用默认 chunk ID/content hash；业务代码不依赖 chunk 名。
- 所有 chunks 都属于统一 dist。异步 import 只降低浏览器首屏下载，不减少设备安装包体积。
- Registry/Profile 是具体 ID 唯一允许出现的生产代码区域。

### 3.4 合并顺序

```text
identity
  -> load Model Profile
  -> load Customer Profile
  -> validate profile schemas
  -> backend 与 expectedBackends 不一致时记录诊断 warning
  -> detectedCapabilities 只能关闭 baseline capability
  -> Customer disabledCapabilities 再关闭 capability
  -> compose behavior + branding + policy + pageVariants
  -> freeze AppRuntimeContext
```

有效能力：

```text
effectiveCapability[key] =
  modelProfile.capabilities[key] === true
  AND identity.detectedCapabilities[key] !== false
  AND key 不在 customerProfile.policy.disabledCapabilities
```

`detectedCapabilities=true` 不能把 Model Profile 的 false 改成 true。若同一硬件家族存在能力不同的产品，应使用不同 modelId/Profile，或经架构评审扩展探测规则。

`customerDisableableCapabilities` 是 Web 合同中的集中常量，不是 identity 或 Customer Profile 的可配置字段。validator 必须拒绝白名单外的 `disabledCapabilities`，防止 Customer Profile 演变成第二套型号能力配置。

### 3.5 校验与安全降级

- Identity、Model Profile、Customer Profile 分别有 schema/validator。
- 未知字段、未知 capability、非法 behavior、非法 URL/CSS Variable 全部 fail-closed；backend 不匹配只记录诊断 warning。
- 延时必须是有限、非负、处于上限内的整数。
- 主题只允许白名单 CSS Variables 与合法颜色，禁止注入任意 CSS/HTML/JavaScript。
- Profile 加载 chunk 404、schema 非法或资源加载失败必须可诊断。
- 构建时声明的资源文件不存在必须构建失败；文件已进入 dist 但浏览器加载失败时使用中性资源。
- Model Profile/identity 失败不能进入管理 UI；Customer Profile 未知或加载失败时进入 Neutral Profile，但必须产生诊断 warning。

---

## 4. 文件与模块边界

```text
unified/
  vue.config.js
  index.ejs
  src/
    main.js
    app/
      bootstrap.js
      bootstrap-error.js
      create-app.js
      App.vue
      identity/{load,validate}.js
      profiles/{capabilities,load,validate,compose}.js
      branding/apply-branding.js
      menu/{definitions,create-menu}.js
      router/{definitions,create-router,guards}.js
      reconnect/create-controller.js
      http/index.js
      store/index.js
    profiles/
      models/
        registry.js
        M6R0/profile.json
        M11R4/profile.json
        ...
      customers/
        registry.js
        neutral/
          profile.json
          index.js
        0001/
          profile.json
          index.js
          assets/{logo.svg,favicon.ico,login-background.webp}
        0007/
          profile.json
          index.js
          assets/{logo.svg,favicon.ico,login-background.webp}
    pages/                              # 迁移后的统一/必要 variant 页面
    assets/branding/default/            # 中性加载与错误页资源
  dev/runtime-config-middleware.js

tests/fixtures/runtime-config/*.v1.json
tests/unit/{identity,profiles,branding,menu,router,reconnect,build}/
e2e/fixtures/runtime-config.ts
e2e/specs/runtime-*.spec.ts
scripts/{validate-runtime-config,validate-profiles,check-unified-id-boundaries,hash-web-dist}.mjs
```

`base/src` 在旁路阶段作为可复用的旧公共库。需要不兼容改造的实现只能 Copy/Adapt 到 `unified/src`；正式切流稳定后才能删除旧副本或清理 base，避免新旧构建互相影响。

根 `package.json` 增加统一入口脚本，依赖和 lockfile 不下沉到 `unified/`：

```json
{
  "scripts": {
    "build:unified": "cd unified && ../node_modules/.bin/vue-cli-service build --dest ../dist-unified",
    "dev:unified": "cd unified && ../node_modules/.bin/vue-cli-service serve",
    "check:unified-ids": "node scripts/check-unified-id-boundaries.mjs"
  }
}
```

---

## 5. 实施任务

### Task 1: 盘点型号、客户、页面、API 和资源差异

**Files:**
- Inspect: `{m6,m6a,m6s,m6s_poe,nano,ga630}/src/**`
- Inspect: `{m6,m6a,m6s,m6s_poe,nano,ga630}/vue.config.js`
- Inspect: `base/customer-conf/**`
- Modify: 本文档“附录 A：迁移决策表”

- [ ] 列出 menu/router/store/http/main 差异，区分硬件能力、后端 API、品牌、历史遗留。
- [ ] 为每个差异页面记录组件来源、API action、参数/响应、资源和文案差异。
- [ ] 盘点所有 `process.env.MODEL_CONFIG/CUSTOMER_CONFIG` 命中并指定迁移到 Model Profile、Customer Profile、suite API 或公共实现。
- [ ] 盘点客户 Logo、favicon、背景、主题、语言和链接，登记资源所有权与版权来源。
- [ ] 核实 Makefile 中 8 个 MODEL_ID 到目录的真实映射，不从目录名猜测产品能力。
- [ ] 更新附录 A；未完成盘点的页面不得提前增加 pageVariant。
- [ ] Commit: `docs: inventory model customer and API differences`

### Task 2: 固化 Identity/Profile 合同与 validators

**Files:**
- Create: `unified/src/app/identity/contract.schema.json`
- Create: `unified/src/app/profiles/model-profile.schema.json`
- Create: `unified/src/app/profiles/customer-profile.schema.json`
- Create: `unified/src/app/profiles/capabilities.js`
- Create: `tests/fixtures/runtime-config/*.v1.json`
- Create: `scripts/validate-runtime-config.mjs`
- Create: `scripts/validate-profiles.mjs`
- Modify: `package.json`、`package-lock.json`
- Test: `tests/unit/identity/contract.spec.js`
- Test: `tests/unit/profiles/contract.spec.js`

- [ ] 先写失败测试：缺 ID、未知字段、非法 detected capability、backend 字段非法、非法 policy/behavior/branding 必须失败；合法但与 expectedBackends 不一致只产生 warning。
- [ ] Identity schema 只包含版本、revision、modelId、customerId、backend 和可选 detectedCapabilities。
- [ ] Profile schemas 固化 §3，禁止通用 hiddenMenus/roleRestrictions。
- [ ] 在开始编码前确认发布模型：若 Web/suite 随固件原子发布，首版锁定 schemaVersion 1；只有确认存在独立升级才扩展 N/N-1。
- [ ] 在 capabilities.js 集中定义 v1 capability keys 与 customerDisableableCapabilities；schema、compose、menu/router 和页面不得另建别名。
- [ ] 校验 disabledCapabilities 不能引用未知或客户不可控 capability；detected true 不能开启 baseline false。
- [ ] CLI 只解析 profile.json，校验所有 Registry key/目录一一对应，并检查约定资源文件存在；不得让 Node 直接 import 图片。
- [ ] 如引入校验依赖，锁定兼容当前 webpack/浏览器的版本，不升级其他技术栈。
- [ ] Run: `npm run test:unit`；Expected: 合同测试通过。
- [ ] Commit: `test: define runtime identity and profile contracts`

### Task 3: 在 unified/ 建立旁路构建骨架和 Profile Bootstrap

**Files:**
- Create: `unified/vue.config.js`
- Create: `unified/index.ejs`
- Create: `unified/dev/runtime-config-middleware.js`
- Create: `unified/src/app/identity/{load,validate}.js`
- Create: `unified/src/app/profiles/{load,validate,compose}.js`
- Create: `unified/src/app/{bootstrap,bootstrap-error}.js`
- Create: `unified/src/profiles/{models,customers}/registry.js`
- Create: `scripts/check-unified-id-boundaries.mjs`
- Modify: `package.json`
- Test: `tests/unit/identity/bootstrap.spec.js`
- Test: `tests/unit/profiles/compose.spec.js`
- Test: `tests/unit/build/id-boundaries.spec.js`

- [ ] 定义 `bootstrap({ createApp })`：依次加载并校验 identity/Profiles、compose runtimeContext，最后只调用传入的 `createApp(runtimeContext)`。
- [ ] 写失败测试：identity 与两个 Profile chunks 全部完成前不得调用 mock createApp；成功后只调用一次并传入冻结的 runtimeContext。
- [ ] 写失败测试：identity 404/超时/非法、未知 modelId、Model chunk 失败均进入可重试错误页。
- [ ] 写失败测试：未知/失败 Customer Profile 使用 Neutral Profile 并产生诊断 warning；backend 不匹配只 warning、不影响功能选择。
- [ ] 实现静态 Registry loader，禁止动态路径拼接。
- [ ] 实现 compose 与 effective capability 规则，输出冻结的 AppRuntimeContext。
- [ ] Task 3 只在测试中注入 mock createApp，不创建临时 Vue、Router、Store 或 mount 逻辑；真实 main/createApp 留到 Task 7。
- [ ] 实现静态检查脚本：扫描 unified/src，排除 profiles/models、profiles/customers 后，禁止 MODEL_ID、CUSTOMER_ID 和 Registry 中已知具体 ID；测试必须证明 `if (modelId === 'M11R4')` 会失败。
- [ ] 根 package.json 增加 build:unified/dev:unified；配置 unified alias 复用 base，输出到 `../dist-unified`，不创建 unified/package.json，不读取构建期 MODEL_ID/CUSTOMER_ID。
- [ ] dev middleware 只在开发环境返回选定 identity fixture；生产 bundle 无 fixture 选择逻辑。
- [ ] 保持旧六套入口/配置不动；共享代码改动必须同时验证旧构建。
- [ ] Run: `npm ci && npm run test:unit -- tests/unit/identity tests/unit/profiles tests/unit/build/id-boundaries.spec.js`；Expected: bootstrap、compose 和 ID 边界检查通过；本 Task 不为构建成功编写临时 main。
- [ ] Run: `make build CUSTOMER_ID=0001 MODEL_ID=GA630`；Expected: 旧构建仍通过。
- [ ] Commit: `build: add isolated profile-driven unified app`

### Task 4: 迁移 Customer Profiles 与内置品牌资源

**Files:**
- Create: `unified/src/profiles/customers/<CUSTOMER_ID>/profile.json`
- Create: `unified/src/profiles/customers/<CUSTOMER_ID>/index.js`
- Create: `unified/src/profiles/customers/neutral/{profile.json,index.js}`
- Copy/Adapt: `base/customer-conf/<CUSTOMER_ID>/**` 到对应 Profile/assets；保留原文件服务旧构建
- Create: `unified/src/app/branding/apply-branding.js`
- Create: `unified/src/assets/branding/default/**`
- Test: `tests/unit/branding/*.spec.js`

- [ ] 架构验证阶段只建立 `neutral` 和一个普通真实客户的显式 registry entry/异步 import；不得先批量迁移全部客户。
- [ ] profile.json 只保存可由 Node 校验的数据；index.js 显式 import Logo/favicon/登录背景并与 JSON 装配，由 webpack 单测确认资源可 import。
- [ ] 把客户 Sass 中可变颜色迁为白名单 CSS Variables；不能运行时表达的样式进入该客户异步 chunk。
- [ ] 合并语言包 key，冲突人工选择公共文案或客户 Profile 文案，不按 CUSTOMER_ID 分支。
- [ ] 写测试验证 title/favicon/logo/背景/语言/theme 和中性 fallback。
- [ ] 写测试验证非法 URL/CSS Variable/颜色失败；资源文件本身缺失时构建失败，已打包文件在浏览器加载失败时使用中性 fallback。
- [ ] 实现 Neutral Profile：未知客户继续启动基础管理 UI，使用中性品牌、关闭 Telnet/二级管理员和所有客户可控可选能力，并上报诊断 warning。
- [ ] Run: `node scripts/validate-profiles.mjs && npm run test:unit -- tests/unit/branding`；Expected: Neutral 与样本客户 JSON/资源/Registry 合法，资源 import 测试通过。
- [ ] Commit: `feat: prove customer profile and branding path`

### Task 5: 建立 Model Profiles 并推动 suite 统一 API

**Files:**
- Create: `unified/src/profiles/models/<MODEL_ID>/profile.json`
- Modify: `unified/src/profiles/models/registry.js`
- Modify: 本文档附录 A

- [ ] 架构验证阶段只选择一个普通型号和一个有已证实硬件差异的型号（优先从 M11R4/M13R0 中按 Task 1 证据选择）；不得先批量迁移全部型号。
- [ ] 只登记 `sfp`、`poeControl`、`fanControl`、`frozenConfig` 等已证实产品能力及业务 behavior，不创建 capability 别名。
- [ ] Model Profile 可声明 expectedBackends 用于 CI/诊断；不匹配只 warning，不参与能力、API、页面或行为选择。
- [ ] 按附录 A 推动 suite 统一 wan/wifi/mesh add/mode/log/vpn/device API。
- [ ] Web 页面不得根据 backend/model 选择 API；必要兼容层优先留在 suite。
- [ ] 对前三种统一方式均失败的页面记录证据，再决定是否增加语义 pageVariant。
- [ ] Run: `node scripts/validate-profiles.mjs`；Expected: Registry/Profile/capability 合法；backend 预期差异输出可诊断 warning。
- [ ] Commit: `feat: prove model profiles for baseline and hardware variants`

### Task 6: 运行时菜单与路由

**Files:**
- Create: `unified/src/app/menu/{definitions,create-menu}.js`
- Create: `unified/src/app/router/{definitions,create-router,guards}.js`
- Test: `tests/unit/menu/*.spec.js`
- Test: `tests/unit/router/*.spec.js`

- [ ] 建立公共菜单/路由定义；Schedule/WPS/WAN Ping/Device Limit/LED 不挂型号 capability。
- [ ] SFP/PoE/风扇/frozen config 分别只使用 `sfp`、`poeControl`、`fanControl`、`frozenConfig` effective capability 过滤。
- [ ] Telnet 根据 Customer Profile `allowTelnet` 过滤；现有角色规则保留为公共代码，不引入通用 DSL。
- [ ] 配置和 Profiles 加载完成后一次性创建 Router。
- [ ] 守卫重新检查 capability、角色和 mode，防止直接 URL 绕过菜单。
- [ ] 保留 `/web` 前缀并使用命名路由跳转。
- [ ] 写表驱动测试覆盖不同 Model/Customer Profile 合并、客户禁用、角色和 mode。
- [ ] Run: `npm run test:unit -- tests/unit/menu tests/unit/router`；Expected: 通过。
- [ ] Commit: `feat: create routes from composed profiles`

### Task 7: 迁移页面、Store、HTTP、main 与 createApp

**Files:**
- Create: `unified/src/main.js`
- Create: `unified/src/app/create-app.js`
- Create: `unified/src/app/App.vue`
- Create: `unified/src/app/store/index.js`
- Create: `unified/src/app/http/index.js`
- Create: `unified/src/app/reconnect/create-controller.js`
- Create/Copy/Adapt: `unified/src/pages/**`；保留原页面服务旧构建
- Test: `tests/unit/reconnect/*.spec.js`

- [ ] 将样本链路所需且确认可统一的页面 Copy/Adapt 到 unified，共享旧 base 页面可先直接 import；不得 Move 原页面。
- [ ] 删除新页面中的型号、客户和 backend 判断；局部硬件 UI 只读 effectiveCapabilities。
- [ ] 合并 Store，保存只读 identity/modelProfile/customerProfile/runtimeContext。
- [ ] 合并 HTTP 方法；后端能力与权限由 suite 执行，前端只做体验层 gating。
- [ ] 用 Model Profile 的业务 behavior 实现统一 reconnect 状态机。
- [ ] 写 fake scheduler 测试覆盖升级探测延时、模式切换延时、探测超时和恢复。
- [ ] createApp 显式接收 runtimeContext 以及 Task 6 已完成的 menu/router factories，避免临时实现后返工。
- [ ] main.js 将真实 createApp 注入 `bootstrap({ createApp })`；bootstrap 不直接 import 或构造 Vue 应用。
- [ ] 用 `neutral + 一个普通客户 + 一个普通型号 + 一个硬件差异型号` 跑通 `identity → registry → profile compose → branding → menu/router → createApp` 完整链路；此 Gate 通过前不得批量迁移剩余 Profile。
- [ ] 用首次统一构建的网络面板/构建报告确认输出 hashed assets/chunks，且浏览器只请求当前 Customer Profile chunk 和实际展示资源。
- [ ] 模块 import 时不得读取隐式全局身份；迁移 wifi-rules/router-model/mesh-edit/encrypt-methods/ipv6/internet/mesh 等具体判断。
- [ ] Run: `npm run check:unified-ids && npm run test:unit && npm run build:unified`；Expected: ID 边界、完整样本链路和首次统一构建通过。
- [ ] Commit: `refactor: assemble profile-driven router app`

### Task 8: mercku-suite 生成身份文件并联调

**Repository:** mercku-suite（不在当前 workspace；具体文件由其仓库计划指定）。

- [ ] suite 原子生成 `/www/runtime-config.v1.json`，不生成或托管客户图片/主题资源。
- [ ] suite 提供真实 modelId/customerId/backend 和可证明的 detectedCapabilities。
- [ ] 按 Task 2 已确认的发布模型实施：原子固件首版只生成 v1；只有独立升级场景才实现 N/N-1。
- [ ] suite 统一平台 API 并做服务端能力/权限校验。
- [ ] Run: `node scripts/validate-runtime-config.mjs /tmp/runtime-config.v1.json`；Expected: 至少两类真实设备身份通过。
- [ ] Gate: 未知 modelId 必须显示安全错误页；未知 customerId 使用 Neutral Profile；backend 不匹配产生诊断 warning。

### Task 9: 批量迁移剩余 Profiles 并执行同一 dist 多身份测试

**Files:**
- Modify: `playwright.config.ts`
- Create: `e2e/fixtures/runtime-config.ts`
- Create: `e2e/specs/runtime-identity.spec.ts`
- Create: `e2e/specs/runtime-branding.spec.ts`
- Create: `e2e/specs/runtime-capabilities.spec.ts`
- Create: `scripts/hash-web-dist.mjs`

- [ ] 仅在 Task 7 样本链路 Gate 通过后，分批 Copy/Adapt 剩余 Customer Profiles、品牌资源和 Model Profiles；原文件继续服务旧构建。
- [ ] 每批更新显式 Registry，运行 Profile validator、ID 边界检查和相关单测；若合同需修改，先回归四组样本再继续下一批。
- [ ] 只构建一次 dist-unified，生成包括全部 HTML/JS/CSS/Profile chunks/assets 的 hash manifest。
- [ ] Playwright 对 identity JSON 返回不同 modelId/customerId/backend，不重启构建。
- [ ] 验证 Model Profile 能力、Customer Profile Logo/favicon/主题/语言/策略和直接 URL 守卫。
- [ ] 验证 detected false、customer disabledCapabilities、未知 modelId 阻断、未知 customerId 中性降级、backend mismatch warning 和 chunk 失败。
- [ ] 切换 identity 文件后重新计算完整 Web dist hash，必须完全不变。
- [ ] 验证浏览器只加载当前 Model/Customer Profile chunks；未选 Profile chunks 不发起网络请求。
- [ ] 至少使用两类真实硬件和两个客户 Profile 做 suite + Web smoke。
- [ ] Run: `node scripts/validate-profiles.mjs && npm run check:unified-ids && npm run test:unit && npm run build:unified && npm run test:e2e`；Expected: 全部 Profiles 与 ID 边界合法，全部测试通过且只构建一次。
- [ ] Commit per profile group: `feat: migrate remaining runtime profiles`
- [ ] Commit: `test: verify one dist across profile identities`

### Task 10: 切换固件打包并清理旧入口

**Files:**
- Modify: 固件/mercku-suite 打包配置（所属仓库）
- Modify: `Makefile`（仅确认旧构建不再需要后）
- Delete after cutover: 六个型号目录入口、构建配置和已迁移副本

- [ ] 固件统一携带完整 dist-unified；suite 只额外生成 identity JSON。
- [ ] 比较不同设备/客户固件中的完整 Web dist hash，必须一致。
- [ ] 验证 Profile chunks 和全部客户资源都随每台设备安装。
- [ ] 验证 Task 2 选定的发布模型：原子固件整体回滚，或独立升级场景的 schema 双版本兼容。
- [ ] 保留一个发布周期回退能力；P0 时回退固件引用，不在业务代码恢复 ID 分支。
- [ ] 稳定后删除旧入口；是否提升 unified 到根目录单独决策。
- [ ] Commit: `build: cut firmware packaging to profile-driven dist`

---

## 6. 验收标准

1. 根目录 `npm ci && npm run build:unified` 不需要 MODEL_ID/CUSTOMER_ID，只安装依赖一次、构建一次；`unified/` 没有 package.json/lockfile。
2. 所有设备/客户安装的完整 Web dist 文件和 hash 完全一致，包括全部 Profile chunks 与品牌资源。
3. suite 只提供 identity JSON，不生成或托管客户 Logo、favicon、主题和背景。
4. 修改 identity 中已登记的 modelId/customerId 后无需重建即可切换功能和品牌。
5. 浏览器只请求当前 Model/Customer Profile chunks，但设备安装包包含全部 chunks。
6. 页面、menu、router、store、http 和业务工具中没有具体 ID/backend 分支；backend 只用于诊断 warning。
7. 具体 ID 只存在于 registry/profile 和测试 fixtures，`npm run check:unified-ids` 在 CI 中持续通过。
8. capability 全程使用 `sfp/poeControl/fanControl/frozenConfig` 统一命名；effective capability 同时受 Model baseline、suite detected false 和 Customer disabledCapabilities 限制，任何一层都不能越权开启能力。
9. Customer disabledCapabilities 只能引用 customerDisableableCapabilities 白名单，Customer Profile 不能定义或扩展该白名单。
10. Schedule/WPS/WAN Ping/Device Limit/LED 等公共功能不维护型号矩阵。
11. Behavior 只包含业务流程事实，不包含前端变量或 Promise 生命周期。
12. Customer Profile 内置 Logo、favicon、名称、主题、背景、语言和少量明确策略。
13. pageVariants 默认为空；任何非空 variant 都有附录 A 证据与独立评审记录。
14. 未知 modelId 和非法 identity/Profile/schema fail-closed；未知 customerId 使用最保守 Neutral Profile 并产生诊断 warning。
15. suite/后端独立执行能力、角色和权限校验。
16. unit、多 Profile Playwright 和真实设备 smoke 全部通过。

---

## 7. 风险与停止条件

| 风险 | 应对 |
|------|------|
| 全部客户资源增加固件体积 | 异步 chunk 只优化网络；测量完整 dist，必要时优化图片，不退回客户独立构建 |
| 其他客户资源可被查看 | 已接受风险，本轮不处理保密；未来出现明确需求时单独设计资源交付方案 |
| 新客户/型号 Profile 未随 dist 发布 | Registry/Profile CI 校验；未知型号 fail-closed、未知客户 Neutral 降级；suite 与 Web 原子发布 |
| Registry 动态路径注入 | 只使用显式静态 loader map，不拼接 import 路径 |
| suite identity 与 Profile backend 不一致 | expectedBackends 只输出诊断 warning；功能不按 backend 选择 |
| detectedCapabilities 误开启能力 | detected true 不得开启 baseline false；后端仍独立校验 |
| 统一 API 工作量被低估 | 先盘点、suite adapter 优先；无证据不增加 pageVariant |
| Customer Profile 变成通用策略系统 | 限定 disabledCapabilities/allow2LevelAdmin/allowTelnet；新增字段单独评审 |
| 旧构建被共享改动影响 | 不兼容代码先放 unified；每个相关 PR 同时运行旧代表构建 |
| Web/suite 版本错配 | Task 2 先确认发布模型；原子固件首版只支持 v1，独立升级才增加 N/N-1 |

停止条件：

- suite 无法稳定提供可信 modelId/customerId/backend。
- 关键页面只能在业务代码中判断 backend/model，suite 拒绝统一 API 或提供 adapter。
- 新增客户/型号无法与统一 dist 原子发布且没有兼容窗口。
- 完整客户资源体积超过固件预算且无法通过资源优化解决。

出现停止条件时回到跨仓库架构评审，不得恢复按型号/客户编译。

---

## 8. PR 与切流边界

前九项不删除旧生产入口：

1. 差异盘点与附录 A。
2. Identity/Model Profile/Customer Profile contracts 和 validators。
3. unified 旁路构建骨架、Profile Registries、bootstrap。
4. Neutral + 一个普通客户样本与内置品牌资源。
5. 一个普通型号 + 一个硬件差异型号样本与 suite API 统一。
6. Runtime Menu/Router。
7. 页面/Store/HTTP/main/reconnect/createApp 迁移。
8. suite identity 文件与真实设备联调。
9. 批量迁移剩余 Profiles + 单 dist 多 Profile 测试。
10. 固件打包切流；稳定后清理旧入口。

每个 PR 必须包含测试、Migration Notes、包体变化和回退说明。只有第 9 项通过且至少两类设备、两个客户 Profile 验证后才能切流。

---

## 9. Open Questions

最终决策必须更新回本文件：

1. suite 与 Web 是否总随同一固件原子升级？必须在 Task 2 前关闭；若答案为是，首版不实现 N/N-1。
2. 新增 Customer/Model Profile 的发布流程如何保证 suite 不会先返回未知 ID？
3. 完整 Profile/品牌资源 dist 的固件空间预算是多少？CI 的上限值是多少？
4. detectedCapabilities 当前到底能可靠探测哪些字段？无法可靠探测的字段必须删除。
5. 客户语言差异是品牌词替换还是实质翻译差异？是否需要客户专属语言 chunk？
6. 附录 A 中哪些页面确实需要 pageVariant？默认答案应为“无”。

---

## 附录 A：迁移决策表

Task 1 必须补齐本表；它是 capability、API、Profile 和页面归属的唯一决策依据。下方表 A.1 是逐区域决策汇总，A.2–A.7 是支撑证据（文件:行号引用基于 2026-07-21 盘点）。

### A.1 决策汇总表

| 区域 | 当前差异（证据见 A.2–A.7） | 目标处理 | suite/API 前置 | 状态 |
|------|----------|----------|----------------|------|
| identity | 编译期 `process.env.MODEL_CONFIG.id`/`CUSTOMER_CONFIG` 经 DefinePlugin 注入（6 份 vue.config.js） | suite 静态 identity v1 | 真实 ID/backend | 已盘点 |
| main/reconnect | 2 个变体：simple（m6/m6a）、delayed（m6s/m6s_poe/nano/ga630，20s 升级探测延迟 + delayTime/changeMode） | Model behavior `{upgradeProbeStartDelayMs:20000, modeSwitchProbeStartDelayMs, reconnectProbeTimeoutMs}` + 统一状态机 | 探测语义由 suite 确认 | 已盘点 |
| menu | 5 份 menu.js，菜单项矩阵见 A.3；m6s/ga630 用 `model:[Models.M6s_SFP]` 门控 SFP | compose Profiles 后创建；SFP/PoE/fan 用 effective capability；telnet→Customer `allowTelnet`；super→Customer `allow2LevelAdmin`；wirelessBridge mode→Model behavior | Profile contracts | 已盘点 |
| router | 6 份 router/index.js，base 提供 + 型号覆盖 | compose Profiles 后一次性创建，守卫复查 capability/role/mode | Profile contracts | 已盘点 |
| store | 6 份 store/index.js，`process.env.MODEL_CONFIG.id.toLowerCase()` 设置路由器型号标识 | 合并为只读 identity/modelProfile/customerProfile/runtimeContext | 无 | 已盘点 |
| http | 4 个变体（A.4）；frozenConfig 仅 m6/m6a；PoE 仅 m6s_poe；fan 仅 nano；mesh wps/apclient/logs/wanIntf/enabled 仅 m6s 家族 | suite 统一 API；Web 按 capability gating；不按 backend 分支 | suite 统一 mesh/frozen/PoE/fan/SFP API | 已盘点 |
| branding | conf.json + base/src/style/customer/<id>/theme.scss + 各型号 i18n/<id>/ 覆盖 | Customer Profile + 内置 assets（favicon）；主题迁为白名单 CSS Variables | 无 suite 资源依赖 | 已盘点 |
| i18n | 每型号 `src/i18n/<customerId>/*.json` 客户覆盖 + `extra.json`/`code-map.json` 公共 | 公共语言包 + Customer Profile chunk 文案 | 文案冲突人工确认 | 已盘点 |
| wan | base + m6/m6s/nano/ga630 各有 setting/wan.vue | 优先统一页面/API；mesh.wan.intf.get/update 仅 m6s/ga630 | suite 统一 mesh wan intf API | 已盘点 |
| wifi | base 共享，无型号覆盖 | 公共页面，suite 统一 API | suite 统一 mesh.wps/apclient API | 已盘点 |
| mesh add | base/pages/.../mesh/add.vue + 各型号 `process.env.CUSTOMER_CONFIG.routers[MODEL_ID]` 判断 | suite 统一展示/API 数据；router-model.js 图片映射迁为 Model/Customer Profile 资源 | suite 提供 node 型号元数据 | 已盘点 |
| mode | base/pages/.../advance/mode.vue 共享；m6s 家族有 `updateMeshApclient`/`updateMeshEnabled` API | 统一 API + Model behavior（delayTime/changeMode） | suite 统一 mode API | 已盘点 |
| log | base 共享；m6s 家族有 `getMeshLogsSetting`/`updateMeshLogsSetting` | 优先统一页面/API | suite 统一 mesh.logs.setting API | 已盘点 |
| vpn | base 共享，无型号覆盖 | 公共页面 | 无 | 已盘点 |
| device | base 共享，无型号覆盖 | 公共页面 | 无 | 已盘点 |
| SFP | 菜单 m6s/ga630 用 `model:[M6s_SFP]` 门控；页面 m6s/sfp.vue + ga630/sfp.vue；http 层无 SFP API（页面内直接调用或走 base/http） | Model capability `sfp` + detected false；suite 统一 SFP API | suite 统一 SFP API（待 sfp.vue 内部 API 确认） | 已盘点 |
| PoE | 菜单仅 m6s_poe（powersupply，无 model 门控）；页面 m6s_poe/powersupply.vue；API `mesh.poe.mode.get/update` 仅 m6s_poe | Model capability `poeControl`；suite 统一 PoE API | suite 统一 PoE API | 已盘点 |
| fan | 菜单仅 nano（fan）；页面 nano/fan.vue；API `mesh.fan.mode.get/update` 仅 nano | Model capability `fanControl`；suite 统一 fan API | suite 统一 fan API | 已盘点 |
| frozen config | 菜单无入口；页面仅 m6a/frozen-config/；API `router.config.frozen.get/update` 仅 m6/m6a | Model capability `frozenConfig`；suite 统一配置接口 | suite 统一 frozen config API | 已盘点 |
| router-model.js | 9 处 `process.env.CUSTOMER_CONFIG.routers.*` + `MODEL_CONFIG.id` 做产品图片/名称映射 | 迁为 Model/Customer Profile 资源映射；不读 process.env | 无 | 已盘点 |
| wanping | 菜单仅 m6s/ga630 | 公共功能（计划 §3.1），suite 统一 API 后无 capability 门控 | suite 统一 wanping API | 已盘点 |
| wps | 菜单 m6s/m6s_poe/nano/ga630；API `mesh.wps.get/update` 同范围 | 公共功能，suite 统一 API 后无 capability 门控 | suite 统一 mesh.wps API | 已盘点 |
| led | 菜单仅 m6 | 公共功能，suite 统一 API 后无 capability 门控 | suite 统一 led API | 已盘点 |
| schedule | 菜单仅 m6 | 公共功能，suite 统一 API 后无 capability 门控 | suite 统一 schedule API | 已盘点 |
| wirelessBridge mode | m6 config.mode 仅 router/bridge；其余 +wirelessBridge | Model behavior 字段或 capability；首版可放 Model Profile `behavior.supportedModes`（需 §3.1 schema 评审） | 无 | 待评审 |
| telnet | 菜单全部 `show:false` + `auth:[super]` | Customer Profile `allowTelnet` | 无 | 已盘点 |
| super / 二级管理员 | 菜单 `show:false` for mercku(0001)；`CUSTOMER_CONFIG.allow2LevelAdmin` 控制 auth 过滤 | Customer Profile `allow2LevelAdmin` | 无 | 已盘点 |
| backup | 菜单全型号 `config`（router+bridge） | 公共功能 | 无 | 已盘点 |

### A.2 Makefile MODEL_ID → 目录映射（已核实）

`Makefile:12`：

```text
MODEL_LIST = M6R0=m6 M8=m6a M11R1=m6s M11R2=m6s M11R4=m6s M13R0=nano M16R0=m6s_poe GA630=ga630
CUSTOMER_LIST = 0001
```

- 8 个 MODEL_ID → 6 个目录（m6s 服务 M11R1/M11R2/M11R4）。
- `base/src/util/constant.js:54-68`：`Models.M6s_SFP='M11R2'`，`ModelIds.M11R4='M6s'`（注释：“M11R4 reuses the existing M6s frontend and customer config”）。
- M11R2 = M6s_SFP（有 SFP），M11R1/M11R4 = M6s（无 SFP）。
- `CUSTOMER_LIST = 0001`：Makefile 只允许 0001，但 `base/customer-conf/0029/` 存在且各型号 `i18n/0029/` 有覆盖；0029 通过直接传 `CUSTOMER_ID=0029 make` 之外的方式构建（Open Question Q7：0029 构建路径需确认）。

### A.3 菜单矩阵（基于各型号 src/menu.js）

| 菜单项 | m6 | m6a | m6s | m6s_poe | nano | ga630 | 迁移目标 |
|--------|----|-----|-----|---------|------|-------|----------|
| dashboard | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 公共 |
| setting.wifi | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 公共 |
| setting.wan | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 公共（suite 统一 mesh wan intf） |
| setting.wanping | - | - | ✓ | - | - | ✓ | 公共（suite 统一） |
| setting.ipv6 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 公共 |
| setting.safe | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 公共 |
| setting.super | ✓(hidden mercku) | ✓ | ✓ | ✓ | ✓ | ✓ | Customer `allow2LevelAdmin` |
| setting.blacklist | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 公共 |
| setting.timezone | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 公共 |
| setting.region | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 公共 |
| setting.guest | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 公共 |
| setting.upnp | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 公共 |
| setting.led | ✓ | - | - | - | - | - | 公共（suite 统一） |
| setting.schedule | ✓ | - | - | (注释掉) | - | - | 公共（suite 统一） |
| setting.wps | - | - | ✓ | ✓ | ✓ | ✓ | 公共（suite 统一） |
| setting.sfp | - | - | model:[M6s_SFP] | - | - | model:[M6s_SFP]¹ | capability `sfp` |
| setting.powersupply | - | - | - | ✓ | - | - | capability `poeControl` |
| setting.fan | - | - | - | - | ✓ | - | capability `fanControl` |
| advance.portforwarding..backup | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 公共 |
| advance.telnet | hidden | hidden | hidden | hidden | hidden | hidden | Customer `allowTelnet` |
| advance.backup | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 公共 |
| upgrade.* | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 公共 |
| config.mode wirelessBridge | - | - | ✓ | ✓ | ✓ | ✓ | Model behavior `supportedModes`（待评审） |

¹ ga630 menu.js 的 SFP 门控 `model:[Models.M6s_SFP]` 对 GA630 永不命中，疑似复制残留（死代码）。

### A.4 HTTP API 矩阵（基于各型号 src/http/index.js）

| API method（action） | m6 | m6a | m6s | m6s_poe | nano | ga630 | 迁移目标 |
|----------------------|----|-----|-----|---------|------|-------|----------|
| updateSuper (`mesh.config.super.update`) | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 公共 |
| getNewMeshNodeInfo (`mesh.node.new.info`) | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 公共 |
| getMeshAutoUpgrade/setMeshAutoUpgrade | ✓ | ✓ | - | - | - | - | 公共（suite 统一） |
| getRouterFrozenConfig/updateRouterFrozenConfig | ✓ | ✓ | - | - | - | - | capability `frozenConfig`（suite 统一） |
| getMeshWps/updateMeshWps (`mesh.wps.*`) | - | - | ✓ | ✓ | ✓ | ✓ | 公共（suite 统一） |
| startMeshApclientScan/getMeshApclientScanList | - | - | ✓ | ✓ | ✓ | ✓ | 公共（suite 统一） |
| updateMeshApclient (`mesh.mode.update`) | - | - | ✓ | ✓ | ✓ | ✓ | 公共（suite 统一） |
| getMeshLogsSetting/updateMeshLogsSetting | - | - | ✓ | ✓ | ✓ | ✓ | 公共（suite 统一） |
| getMeshWanIntf/updateMeshWanIntf (`mesh.wan.intf.*`) | - | - | ✓ | - | - | ✓ | 公共（suite 统一） |
| updateMeshEnabled (`mesh_mode_cfg`) | - | - | ✓ | ✓ | ✓ | ✓ | 公共（suite 统一） |
| getMeshPowerSupplyMode/updateMeshPowerSupplyMode (`mesh.poe.mode.*`) | - | - | - | ✓ | - | - | capability `poeControl`（suite 统一） |
| getMeshFanMode/updateMeshFanMode (`mesh.fan.mode.*`) | - | - | - | - | ✓ | - | capability `fanControl`（suite 统一） |
| SFP API | - | - | - | - | - | - | 待查 sfp.vue 内部调用；capability `sfp`（suite 统一） |

注：`base/src/http/index.js` 被所有型号继承（`import Http, { createMethod } from 'base/http'`），提供 getRouter/getHomePage/getWifi 等公共方法。

### A.5 页面差异清单

| 页面 | base | m6 | m6a | m6s | m6s_poe | nano | ga630 | 迁移目标 |
|------|------|----|-----|-----|---------|------|-------|----------|
| setting/sfp.vue | - | - | - | ✓ | - | - | ✓ | Copy/Adapt to unified，capability `sfp` |
| setting/powersupply.vue | - | - | - | - | ✓ | - | - | Copy/Adapt，capability `poeControl` |
| setting/fan.vue | - | - | - | - | - | ✓ | - | Copy/Adapt，capability `fanControl` |
| advance/frozen-config/{index.vue,router-configs.js} | - | - | ✓ | - | - | - | - | Copy/Adapt，capability `frozenConfig` |
| setting/wan.vue | ✓ | ✓ | - | ✓ | - | ✓ | ✓ | 优先统一页面/API |
| 其他 setting/advance/upgrade/dashboard | ✓ | - | - | - | - | - | - | 直接复用 base |

### A.6 客户品牌资源清单

| 资源/字段 | 0001 (Mercku) | 0029 (JUNET) | 迁移目标 |
|-----------|---------------|--------------|----------|
| conf.json 路径 | base/customer-conf/0001/conf.json | base/customer-conf/0029/conf.json | → profile.json |
| favicon.ico | base/customer-conf/0001/favicon.ico | base/customer-conf/0029/favicon.ico | → assets/favicon.ico |
| logo.svg | **不存在** | **不存在** | 需补或允许缺失 |
| login-background.webp | **不存在** | **不存在** | 需补或允许缺失 |
| theme.scss | base/src/style/customer/0001/theme.scss | base/src/style/customer/0029/theme.scss | → branding.theme（白名单 CSS Variables） |
| loading.color | #d6001c | #00b4e4 | → branding.theme `--brand-loading` |
| title / productName | Mercku | JUNET | → branding.productName |
| wifi | Mercku Wi-Fi | JUNET-WIFI | → branding.wifiName |
| website | mercku.com | junet.se | → branding.website |
| policy | "" | junet.se/integritet | → branding.policyUrl |
| appDownloadUrl | onelink.to/mn4tgv | onelink.to/bjy4dw | → branding.appDownloadUrl |
| languages | zh-CN,en-US,de-DE,fi-FI,bg-BG,fr-FR | en-US,sv-SE | → branding.languages |
| defaultLanguage | （未定义，i18n fallback） | en-US | → branding.defaultLanguage |
| allow2LevelAdmin | false | true | → policy.allow2LevelAdmin |
| accept / host / deviceID / routers / deviceColors | 存在 | 存在 | 待评估：routers→Model Profile 元数据？host/accept→suite？ |
| 语言包覆盖 | 各型号 src/i18n/0001/*.json | 各型号 src/i18n/0029/*.json | 公共语言包 + Customer Profile chunk |

### A.7 process.env 命中汇总

编译期注入点（DefinePlugin）：6 份 `vue.config.js`（m6/m6a/m6s/m6s_poe/nano/ga630）均注入 `MODEL_CONFIG.id` 和整个 `CUSTOMER_CONFIG`。

运行时命中（需迁移）：

| 文件 | 命中 | 迁移目标 |
|------|------|----------|
| `<model>/src/main.js:25` | `CUSTOMER_CONFIG.id`（require 客户 scss） | Customer Profile branding.themeUrl |
| `<model>/src/main.js:180/191` | `CUSTOMER_CONFIG.loading.color` | Customer Profile branding.theme |
| `<model>/src/menu.js:3-4` | `CUSTOMER_CONFIG.id` + `MODEL_CONFIG.id` | runtime identity + Customer Profile |
| `<model>/src/menu.js`（多处） | `CUSTOMER_CONFIG.allow2LevelAdmin` | Customer Profile policy.allow2LevelAdmin |
| `<model>/src/store/index.js:5` | `MODEL_CONFIG.id.toLowerCase()` | runtime identity modelId |
| `<model>/src/i18n/index.js:11` | `CUSTOMER_CONFIG.id`（require.context 路径） | Customer Profile chunk 语言加载 |
| `<model>/src/i18n/index.js`（base/i18n/index.js:17） | `CUSTOMER_CONFIG.defaultLanguage` | Customer Profile branding.defaultLanguage |
| `<model>/src/pages/login/index.vue:133-137` | `CUSTOMER_CONFIG.website/appDownloadUrl` | Customer Profile branding |
| `<model>/src/pages/bussiness/mesh/add.vue:294-338` | `CUSTOMER_CONFIG.routers[MODEL_ID]` | Model/Customer Profile 路由器元数据 |
| `base/src/mixins/router-model.js:75-132`（9 处） | `CUSTOMER_CONFIG.routers.*` + `MODEL_CONFIG.id` | Model/Customer Profile 资源映射 |
| `base/src/pages/bussiness/dashboard/mesh.vue:371,380,389` | `MODEL_CONFIG.id` + `CUSTOMER_CONFIG.routers` | 同上 |
| `base/src/pages/bussiness/dashboard/index.vue` | MODEL/CUSTOMER_CONFIG | Model/Customer Profile |
| `base/src/pages/bussiness/dashboard/internet.vue` | MODEL/CUSTOMER_CONFIG | Model/Customer Profile |
| `base/src/pages/bussiness/upgrade/offline.vue` | MODEL/CUSTOMER_CONFIG | Model Profile 资源 |
| `base/src/pages/bussiness/setting/ipv6.vue` | CUSTOMER_CONFIG | Customer Profile |
| `base/src/pages/login/index.vue` | CUSTOMER_CONFIG | Customer Profile |
| `base/src/pages/error/unconnect/index.vue` | CUSTOMER_CONFIG | Customer Profile |
| `base/src/component/header/header.vue` | CUSTOMER_CONFIG | Customer Profile |
| `base/src/component/footer/index.vue` | CUSTOMER_CONFIG | Customer Profile |
| `base/src/component/loading/loading-canvas.vue` | CUSTOMER_CONFIG.loading.color | Customer Profile branding.theme |
| `base/src/mixins/{language,color-gradient,encrypt-methods,mesh-edit,wifi-rules}.js` | CUSTOMER/MODEL_CONFIG | Profile/identity |
| `base/src/menu.js`（旧版，型号 menu.js 已覆盖） | CUSTOMER_CONFIG | 删除或保留为参考 |

### A.8 待确认 Open Questions（Task 1 新增）

- **Q7**：0029 客户构建路径（Makefile `CUSTOMER_LIST=0001` 不含 0029）。
- **Q8**：`setting/sfp.vue` 内部调用的 API（http 层无 SFP API，需读页面确认是走 base/http 还是其它路径）。
- **Q9**：`routers` 字段（产品名/shortName/deviceColors）归属：Model Profile 元数据 vs Customer Profile vs suite 运行时返回。
- **Q10**：`wirelessBridge` 模式是否进 Model Profile `behavior.supportedModes`（需 §3.1 schema 评审）还是单独 capability。
- **Q11**：ga630 menu.js 的 SFP 门控（`model:[M6s_SFP]` 对 GA630 永不命中）是否为死代码，迁移时直接删除。
- **Q12**：`base/src/menu.js` 旧菜单引用 `Customers.realnett/cik/startca/altima/skymesh/pentanet` 但 `constant.js` 只定义 `mercku:0001`；这些客户是否真实存在还是历史遗留。

### A.9 Task 5 Model Profile 证据（M11R4 / M13R0）

Task 5 架构验证阶段建立两个 Model Profile，证据如下。

#### 选型

| MODEL_ID | 目录 | 型号 | 角色 | 证据 |
|----------|------|------|------|------|
| M11R4 | m6s | M6s（无 SFP） | baseline（全部 capability false） | `Makefile:12` `M11R4=m6s`；`base/src/util/constant.js:68` `ModelIds.M11R4='M6s'`；A.2 注明 M11R1/M11R4=M6s 无 SFP |
| M13R0 | nano | M6s_Nano | 硬件差异变体（fanControl） | `Makefile:12` `M13R0=nano`；`base/src/util/constant.js:59` `Models.M6s_Nano='M13R0'`；A.3/A.4/A.5 注明 fan 菜单/页面/API 仅 nano |

未先批量迁移其余型号（M6R0/M8/M11R1/M11R2/M16R0/GA630），待该 baseline+variant 路径端到端验证后再迁移。

#### behavior 值（从 m6s/nano 源码逐项核实）

m6s/src/main.js 与 nano/src/main.js 逐字节相同，因此两者 behavior 完全一致，均为 delayed 变体。

| behavior 字段 | 值 (ms) | 证据 |
|---------------|---------|------|
| `upgradeProbeStartDelayMs` | 20000 | m6s/src/main.js:137 与 nano/src/main.js:137 `upgrade()` 内 `setTimeout(() => { reconnect(...) }, 20000)` |
| `modeSwitchProbeStartDelayMs` | 30000 | m6s/src/pages/bussiness/advance/mode.vue:257 与 nano/.../mode.vue:263 `confirmUpdateMeshMode` 内 `this.$reconnect({ timeout: 120, delayTime: 30 })` —— `delayTime` 单位为秒（reconnect 计时器每 1000ms 递减），30s = 30000ms |
| `reconnectProbeTimeoutMs` | 600000 | m6s/src/main.js:119 与 nano/src/main.js:119 `upgrade()` 默认 `timeout: 600`（秒），即升级流程 reconnect 探测总时长 600s = 600000ms |

三个值均落在 schema 区间 `[0, 3600000]` 内，与 §3.1 示例一致；非占位符，已逐项核实。behavior 未暴露 `upgrading`/Promise finally/错误页跳转等前端内部状态（符合 §3.1 约束）。

#### capabilities

M11R4：`sfp/poeControl/fanControl/frozenConfig` 全 false（baseline）。
M13R0：仅 `fanControl: true`，其余三项 false（A.4 `mesh.fan.mode.*` API 仅 nano；A.5 `fan.vue` 仅 nano）。
两个 Profile 的 capability 键名严格等于 `CAPABILITY_KEYS`，未引入 `*Api`/平台/backend 工程名别名。`expectedBackends: ["mercku_mtk7621"]` 仅用于 CI/诊断，不参与能力/API/页面选择（§1.3、§3.1）。

#### pageVariants 决策（§1.5 顺序核对）

v1 schema 锁定 `pageVariants.maxProperties: 0`。对 M11R4/M13R0 逐项核对 §1.5 四步顺序，确认无需引入语义 pageVariant：

| 差异点 | §1.5 处理方式 | 证据 |
|--------|--------------|------|
| fan 菜单/页面/API（M13R0 独有） | 方式 2：capability `fanControl` 局部门控 | A.3 fan 行仅 nano；A.5 fan.vue 仅 nano；A.4 `mesh.fan.mode.*` 仅 nano |
| SFP/PoE/frozenConfig 页面差异 | 方式 2：对应 capability 门控 | A.5 各页面迁移目标均为 `capability <X>`；M11R4/M13R0 这三项 capability 均 false，本阶段不触发 |
| setting/wan.vue 差异 | 方式 1：suite 统一 mesh wan intf API | A.1 wan 行、A.4 `mesh.wan.intf.*` 行 |
| mode/reconnect 流程差异 | Model behavior 字段（delayTime/changeMode） | A.1 main/reconnect 行；本任务 behavior 已承载 |
| 其余 setting/advance/upgrade/dashboard | 直接复用 base | A.5 行「直接复用 base」 |

M11R4 与 M13R0 的所有当前差异均可由方式 1（suite 统一）或方式 2（capability 门控）覆盖，未出现前三方式均失败的页面。因此两个 Profile 的 `pageVariants` 保持 `{}`，不增加语义键；如后续迁移中遇到方式 1-3 均失败的页面，再按 §1.5 第 4 步记录证据并触发 schema 评审。

#### suite 统一 API 责任（跨仓库，Task 8 落地）

Router Web 仓库本任务不修改 mercku-suite，仅在 A.4 记录待统一的 API 方法。Web 侧不按 backend/model 分支选择 API（§1.3 硬约束）；必要兼容层优先留在 suite（§1.4）。Task 7 迁移页面时再强制复查。
