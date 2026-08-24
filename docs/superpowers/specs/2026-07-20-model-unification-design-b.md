# 多型号路由器 Web 页面合并设计（方案 B：Feature Flags）

> 修订说明（v2）：根据评审意见完成以下修正——①main.js 行为差异拆分为独立的 behavior 参数组；②菜单可见性与路由可达性拆为两层 flag；③补齐页面 overlay 解析机制设计；④路由差异矩阵改为脚本生成并补齐遗漏项；⑤路由守卫改用命名路由；⑥i18n 引用改用 `@/i18n`；⑦features.js 增加构建期 schema 校验。
>
> 修订说明（v3）：①修正 overlay 模块根配置（v2 配置无法解析）；②修正 SFP 路由矩阵（m6s 路由实为启用）并改用 AST 脚本；③菜单示例恢复 mode 的 disabled 语义；④`upgrading` 复位改为第四个行为参数，不做主动行为变更；⑤新增「简化优先」总原则与核心功能清单策略。

## Summary

将 `mercku_router_web` 下 6 个型号目录（`m6` / `m6a` / `m6s` / `m6s_poe` / `nano` / `ga630`）中重复的入口代码（`main.js` / `App.vue` / `menu.js` / `router` / `store` / `http`）合并为 `base/src/app/` 下的一份**功能超集**实现。

核心机制是 **feature flags + 页面 overlay 解析**：

- **feature flags**：base 实现全部功能，通过开关暴露「关闭功能」的能力；base 代码不出现任何型号标识，开关值由各型号目录的 `features.js` 声明、经本型号 `vue.config.js` 的 `webpack.DefinePlugin` 注入为编译期常量（含构建期 schema 校验）
- **页面 overlay**：统一路由表用 `pages/...` 路径静态 import，通过 `resolve.modules` 配置「型号 `src/pages` 优先、base `pages` 回退」，使同一路由声明在不同型号自动解析到不同组件

依赖方向彻底反转——base 不知道型号存在，型号决定关掉哪些功能、覆盖哪些页面。

## 总原则：简化优先，不要求逐项复刻历史行为

本次重构以**简化架构和保留核心功能**为优先，不要求 100% 行为兼容：

- 发现冲突、废弃或未完成的功能（注释掉的路由、永久隐藏的菜单、疑似半成品），**默认删除，不纳入超集**
- main.js 选择一套统一行为（以 delayed 为准），不为 legacy 保留无必要的参数分支；仅当某参数涉及「可能重新触发升级流程」等真实风险时才保留开关
- 迁移前先列一张**「明确保留的核心功能清单」**，测试只围绕这张清单
- 每处删减记录在 Migration Notes，避免日后被误判为回归
- 涉及当前正式菜单入口和核心管理流程的删减，需在清单中显式标注并经确认

## Project Context

仓库是 Vue 2 + Vue CLI 3 多型号路由器 UI monorepo。每个型号一个目录，公共代码在 [base/src](file:///home/vincent-openclaw/mercku/mercku_router_web/base/src)，通过 `base` webpack 别名引用。

已有基础：

- [vue.config.js](file:///home/vincent-openclaw/mercku/mercku_router_web/ga630/vue.config.js#L105-L114) 通过 `webpack.DefinePlugin` 注入 `process.env.MODEL_CONFIG.id` 和 `process.env.CUSTOMER_CONFIG.*`（编译期常量）——flags 复用同一机制
- 同一文件 [L153-L160](file:///home/vincent-openclaw/mercku/mercku_router_web/ga630/vue.config.js#L153-L160) 的 `resolve.alias` 含 `pages → src/pages`——overlay 机制在此基础上扩展
- [Makefile](file:///home/vincent-openclaw/mercku/mercku_router_web/Makefile) 的 `MODEL_LIST` 把 8 个 MODEL_ID 映射到 6 个目录：`M6R0=m6`、`M8=m6a`、`M11R1=m6s`、`M11R2=m6s`、`M11R4=m6s`、`M13R0=nano`、`M16R0=m6s_poe`、`GA630=ga630`
- `base/src/http` 提供 `Http` 基类和 `createMethod(action)`，100+ 公共方法内置
- ga630/m6s 的 `menu.js` 已有内联 `config.model` 过滤（其余 4 个型号没有）——统一后改为 feature 过滤
- 路由系统特性：所有路由经 `recursive` 加 `/web` 前缀；`router.push`/`router.replace` 被覆写自动补前缀；catch-all 是 `path:'*' → redirect: '/web/wlan'`——**裸路径跳转（如 `next('/dashboard')`）不经覆写、会命中 wildcard 跳错页面，守卫内必须用命名路由**
- Vue CLI 默认提供 `@ → src` 别名；**6 套 vue.config.js 均无 `src` 字符串别名**

### 真实差异清单（经代码核实，矩阵由脚本生成）

**1. main.js 行为差异：4 个独立行为点**

对比 [ga630/src/main.js L75-L81](file:///home/vincent-openclaw/mercku/mercku_router_web/ga630/src/main.js#L75-L81) 与 [m6/src/main.js L70-L74](file:///home/vincent-openclaw/mercku/mercku_router_web/m6/src/main.js#L70-L74)：

| 行为点 | delayed（m6s/m6s_poe/nano/ga630） | legacy（m6/m6a） | 统一策略 |
|--------|----------------------------------|------------------|----------|
| reconnect 探测请求 | `getRouter(undefined, { isReconnect: true })` | `getRouter()` 无参 | 参数化（`suppressDisconnectRedirectOnReconnect`） |
| 网络错误时 | `isReconnect` 时不跳 `/unconnect` | 无条件跳 `/unconnect` | 同上（与上一行为耦合，共用一个参数） |
| `changeMode` 检查 | `isDelay && store.state.changeMode === false` 时跳过探测 | 无 | 参数化（`reconnectUseChangeMode`） |
| 升级后 reconnect 时机 | 延迟 20s | 立即 | 参数化（`upgradeReconnectDelayMs`） |
| `upgrading` 复位时机 | reconnect `onfinally` 中复位 | 不复位 | **参数化（`releaseUpgradingOnReconnectFinally`）** |

> **`upgrading` 复位不能统一为「总是复位」**：`upgrading` 阻止错误码 600402 再次触发升级流程，legacy 型号改为复位后可能在升级过程中重新进入 `upgrade()`，是主动的行为变更。保留第四个行为参数，待未来确认 legacy 原行为是 bug 后再单独统一。
>
> 前两点耦合：`isReconnect` 标记同时决定「请求带标记」和「exHandler 跳过 /unconnect 跳转」，合并为一个参数 `suppressDisconnectRedirectOnReconnect`，避免两处配置不一致。

**2. http 差异只是方法集合，挂全量零成本**

所有型号都是 `class XxxHttp extends Http {}` + `createMethod` 挂载（类名存在复制粘贴错位：ga630 导出 `M6sHttp`、m6 导出 `M6aHttp`，类本身无逻辑）。`createMethod` 只生成 `{url, action}` 描述符，**不调用的方法永远不发请求**。http 无需开关，直接挂超集：

| 方法组 | m6 | m6a | m6s | m6s_poe | nano | ga630 |
|--------|----|----|-----|---------|------|-------|
| `mesh.config.super.update` / `mesh.node.new.info` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| `mesh.auto_upgrade.*` / `router.config.frozen.*` | ✓ | ✓ | | | | |
| `mesh.apclient.*` / `mesh.logs.setting.*` / `mesh_mode_cfg` / `mesh.mode.update` / `mesh.wps.*` | | | ✓ | ✓ | ✓ | ✓ |
| `mesh.wan.intf.*` | | | ✓ | | | ✓ |
| `mesh.poe.mode.*` | | | | ✓ | | |
| `mesh.fan.mode.*` | | | | | ✓ | |

**3. store 差异仅 3 个可选字段，超集零副作用**

`changeMode`（m6s/m6s_poe/nano/ga630）、`meshId`（m6）、`modelVersion`（m6a）。全部并入超集，**store 无需开关**。

**4. 路由差异矩阵（AST 脚本生成，含子路由）**

| 路由 | m6 | m6a | m6s | m6s_poe | nano | ga630 | 组件来源 |
|------|----|----|-----|---------|------|-------|----------|
| `/advance/telnet` | | ✓ | ✓ | ✓ | ✓ | ✓ | base `advance/telnet.vue` |
| `/setting/wps` | | | ✓ | ✓ | ✓ | ✓ | base `setting/wps.vue` |
| `/setting/sfp`（路由） | | | ✓ | | | ✓ | 型号内 `setting/sfp.vue`（m6s 与 ga630 各自启用，见 [m6s/src/router/index.js L290](file:///home/vincent-openclaw/mercku/mercku_router_web/m6s/src/router/index.js#L290)） |
| `/setting/sfp`（菜单） | | | M11R2 only | | | | 菜单 `model:[M6s_SFP]`；ga630 菜单 `show:false` |
| `/setting/wanping` | | | ✓ | | | ✓ | base `advance/diagnosis.vue`（meta `diagnosisMode:'wanping'`） |
| `/setting/schedule` | ✓ | ✓ | | | | | base `setting/wifi-schedule.vue` |
| `/setting/led` | ✓ | ✓ | | | | | base `setting/led.vue` / `led-switch.vue` |
| `/setting/powersupply` | | | | ✓ | | | 型号内 |
| `/setting/fan` | | | | | ✓ | | 型号内 |
| `/advance/frozenCofig`（原文拼写） | | ✓ | | | | | 型号内 `frozen-config/` 目录 |
| `/limit/:mac/time` + `/limit/:mac/url` | ✗注释 | ✓ | ✓ | ✓ | ✓ | ✓ | base `dashboard/limit/time.vue` / `blacklist.vue` |

> 注 1：m6s 和 ga630 的 sfp 路由均有一段被注释的**旧副本**（L281-L289），其后是启用的有效路由。按总原则，注释副本默认删除不纳入超集。m6s 三个 MODEL_ID 中仅 M11R2 的菜单显示 SFP 项，路由对三者都启用。
>
> 注 2：矩阵生成不能用 grep——`path:` 会同时命中注释行，且 `uniq -c` 丢失型号维度。实施时使用 AST 解析脚本（`scripts/route-matrix.mjs`，基于 `@babel/parser` 解析 router/index.js，提取未注释的 path 与所属型号），纳入 Phase 1 验证工具。

**5. 页面归属现状**（修正 v1 的错误清单）

- 已在 base：`led.vue`、`led-switch.vue`、`wifi-schedule.vue`、`wps.vue`、`advance/telnet.vue`、`advance/diagnosis.vue`（wanping 复用）
- 仍在型号目录：`sfp.vue`（ga630）、`powersupply`、`fan`、`frozen-config/`（m6a，是目录非单文件）
- **组件来源差异**（同名路由指向不同组件）：`wan`（m6/ga630 用型号内，nano 用 base）、`device`（m6 型号内，ga630 base）、`vpn`（m6/m6a 型号内，ga630/nano base）等——由 overlay 机制解决

**6. 菜单差异** = 路由矩阵对应项的可见性，叠加 ga630 sfp 的「路由开、菜单关」特例。

**7. App.vue 差异很小**：`data-e2e` 属性、样式块顺序、菜单名解析逻辑。

**8. i18n 各型号独立持有语言包**，本方案不动。

## Goals

- 消除 6 份入口文件副本，合并为 `base/src/app/` 下的一份功能超集实现
- base 代码零型号知识；型号差异由型号目录的 `features.js` + `src/pages` overlay 声明
- 保持构建流程不变：`make build CUSTOMER_ID=0001 MODEL_ID=GA630` 产出该型号独立产物
- 每个阶段可独立验证、独立发版
- 新增型号**无需修改 base 的型号枚举和核心入口代码**（仍需新增型号构建配置、i18n、features.js、入口模板等）

## Non-Goals

- **不**合并业务页面内容（`wan.vue` 等页面级差异留待后续独立 spec）
- **不**走向运行时合并
- **不**重构 i18n（已知语言包重复度 >80%，留待独立 spec）
- **不**改动 [Makefile](file:///home/vincent-openclaw/mercku/mercku_router_web/Makefile)、[base/customer-conf](file:///home/vincent-openclaw/mercku/mercku_router_web/base/customer-conf)、`constant.js` 的 `ModelIds.M11R4` 补丁
- **不**删除型号目录的 `vue.config.js` / `package.json` / `index.ejs`

## Recommended Approach

### 1. Features 声明与校验

开关分两组：**features**（功能开关，布尔）与 **behavior**（main.js 行为参数）。

```javascript
// base/src/app/features.js
// base 定义 schema（键集合 + 类型 + 默认值），不认识任何型号。
// 实际值由型号 vue.config.js 经 DefinePlugin 注入，构建期已校验完整性。
export const FEATURES = process.env.FEATURES;
export const BEHAVIOR = process.env.BEHAVIOR;
```

```javascript
// base/src/app/feature-schema.js —— 被各型号 vue.config.js require，构建期校验
// （Node 模块，不进浏览器包）
const schema = {
  features: {
    telnet: 'boolean',
    wps: 'boolean',
    sfpRoute: 'boolean',
    sfpMenu: 'boolean',
    wanping: 'boolean',
    schedule: 'boolean',
    led: 'boolean',
    powersupply: 'boolean',
    fan: 'boolean',
    frozenConfig: 'boolean',
    deviceLimit: 'boolean' // 控制 /limit/:mac/time 与 /limit/:mac/url 子路由
  },
  behavior: {
    upgradeReconnectDelayMs: 'number',
    reconnectUseChangeMode: 'boolean',
    suppressDisconnectRedirectOnReconnect: 'boolean',
    releaseUpgradingOnReconnectFinally: 'boolean'
  }
};

module.exports = function validate(config) {
  for (const [group, keys] of Object.entries(schema)) {
    const actual = config[group] || {};
    for (const [key, type] of Object.entries(keys)) {
      if (!(key in actual)) throw new Error(`features.js 缺少 ${group}.${key}`);
      if (typeof actual[key] !== type)
        throw new Error(`features.js 的 ${group}.${key} 应为 ${type}，实为 ${typeof actual[key]}`);
    }
    for (const key of Object.keys(actual)) {
      if (!(key in keys)) throw new Error(`features.js 存在未知项 ${group}.${key}`);
    }
  }
  return config;
};
```

> 缺项/未知项/类型错误直接终止构建，避免「拼写错误导致功能自动开启」。

```javascript
// m6/features.js —— 型号自我描述
module.exports = {
  features: {
    telnet: false, wps: false, sfpRoute: false, sfpMenu: false,
    wanping: false, schedule: true, led: true,
    powersupply: false, fan: false, frozenConfig: false,
    deviceLimit: false // /limit/:mac/time、/limit/:mac/url 子路由关闭
  },
  behavior: {
    upgradeReconnectDelayMs: 0,
    reconnectUseChangeMode: false,
    suppressDisconnectRedirectOnReconnect: false,
    releaseUpgradingOnReconnectFinally: false // legacy 既有行为：不复位
  }
};
```

```javascript
// ga630/features.js
module.exports = {
  features: {
    telnet: true, wps: true, sfpRoute: true, sfpMenu: false, // 路由开、菜单关
    wanping: true, schedule: false, led: false,
    powersupply: false, fan: false, frozenConfig: false,
    deviceLimit: true
  },
  behavior: {
    upgradeReconnectDelayMs: 20000,
    reconnectUseChangeMode: true,
    suppressDisconnectRedirectOnReconnect: true,
    releaseUpgradingOnReconnectFinally: true
  }
};
```

```javascript
// m6s/features.js —— 一个目录服务 M11R1/M11R2/M11R4，构建期按 MODEL_ID 微调
module.exports = {
  features: {
    telnet: true, wps: true,
    sfpRoute: true,                                       // 路由对三者都启用
    sfpMenu: process.env.MODEL_ID === 'M11R2',            // 菜单仅 SFP 变体显示
    wanping: true, schedule: false, led: false,
    powersupply: false, fan: false, frozenConfig: false,
    deviceLimit: true
  },
  behavior: {
    upgradeReconnectDelayMs: 20000,
    reconnectUseChangeMode: true,
    suppressDisconnectRedirectOnReconnect: true,
    releaseUpgradingOnReconnectFinally: true
  }
};
```

```javascript
// 型号 vue.config.js（在现有 DefinePlugin 块中追加）
const validate = require('../base/src/app/feature-schema.js');
const features = validate(require('./features.js')); // 校验失败即构建失败

new webpack.DefinePlugin({
  'process.env': {
    MODEL_CONFIG: { id: JSON.stringify(process.env.MODEL_ID) },
    FEATURES: JSON.stringify(features.features),
    BEHAVIOR: JSON.stringify(features.behavior)
    // CUSTOMER_CONFIG ... 保持不变
  }
});
```

**约束（写进代码评审标准）：**

1. 开关按**功能**命名（`wanping`、`sfpRoute`），禁止按型号命名（`isGa630`）
2. 菜单可见性与路由可达性用独立开关（`sfpMenu` / `sfpRoute`），不共用
3. 新增开关必须先在 `feature-schema.js` 登记

### 2. 页面 overlay 解析机制

统一路由表只写 `pages/...` 路径，解析优先级「型号覆盖 base」。**模块根必须配到 `src` 层级，不能配到 `src/pages`**——否则 webpack 会查找 `src/pages/pages/bussiness/...` 导致解析失败（已用 enhanced-resolve 4.5.0 实测）：

```javascript
// 型号 vue.config.js chainWebpack 内
const path = require('path');
const modelSrc = path.resolve(__dirname, 'src');        // 模块根 = src
const baseSrc = path.resolve(__dirname, '../base/src'); // 回退 = base/src

config.resolve.alias
  .delete('pages')                 // 移除现有 pages → src/pages 别名（避免与 modules 冲突）
  .set('base', baseSrc);
// resolve.modules：'pages/...' 先在 modelSrc/pages 找，找不到回退 baseSrc/pages
config.resolve.modules
  .prepend(modelSrc)
  .add(baseSrc);
```

统一路由表中的 import 保持裸路径：

```javascript
// base/src/app/router/index.js
// 'pages/bussiness/setting/wan.vue' 经 resolve.modules：
// 先在 {model}/src/pages/bussiness/setting/wan.vue 找（m6/ga630 命中），
// 找不到回退 base/src/pages/bussiness/setting/wan.vue（nano 命中）
import Wan from 'pages/bussiness/setting/wan.vue';
```

**意外遮蔽（shadow）审计——Phase 4 前置任务**：「文件存在 ≠ 应该覆盖 base」。实例：[nano/src/pages/bussiness/setting/wan.vue](file:///home/vincent-openclaw/mercku/mercku_router_web/nano/src/pages/bussiness/setting/wan.vue) 存在，但 [nano/src/router/index.js L21](file:///home/vincent-openclaw/mercku/mercku_router_web/nano/src/router/index.js#L21) 明确 import base 版本——启用型号优先 overlay 后会静默改成 nano 版本（当前两者仅格式差异，但语义已变）。

完整 shadow 清单（型号 `src/pages` 与 base `pages` 的文件交集，实施时需逐一决定「删除型号副本」或「保留为显式覆盖」）：

| 文件 | m6 | m6a | m6s | m6s_poe | nano | ga630 |
|------|----|----|-----|---------|------|-------|
| `setting/wan.vue` | ✓ | ✓ | ✓ | | ✓shadow | ✓ |
| `setting/wifi.vue` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| `wlan/index.vue` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| `login/index.vue` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| `advance/log.vue` | | | ✓ | ✓ | ✓ | ✓ |
| `advance/mode.vue` | | | ✓ | ✓ | ✓ | ✓ |
| `advance/vpn/index.vue` + `form.vue` | ✓ | ✓ | | | | |
| `dashboard/device.vue` | ✓ | | | | | |

> 每个 ✓ 都需确认「当前路由指向型号内还是 base」；指向 base 但文件存在（如 nano 的 wan.vue）即为 shadow，优先删除型号副本让 overlay 自然回退。

**型号专属页面归位**：overlay 生效后，ga630 的 `sfp.vue`、m6s_poe 的 `powersupply`、nano 的 `fan`、m6a 的 `frozen-config/` 可**留在各自型号目录**——统一路由表 import `pages/bussiness/setting/sfp.vue`，只有提供该文件的型号能解析成功；被关闭型号的构建中该 import 仍然存在，需要配合下面的「关闭功能的组件占位」处理。

**关闭功能的组件占位**：路由静态注册要求组件可解析。对被关闭型号，在 `base/src/pages/` 放一个通用占位组件，目录结构保证回退生效：

```text
base/src/pages/
  bussiness/setting/sfp.vue        # 占位（{ render: h => h('div') }）？——不行，会挡住 ga630 吗？
```

不会挡住：overlay 顺序是「型号优先」，ga630 提供真组件，其他型号回退到 base 占位。占位组件配 `meta.feature` 守卫永远不会被渲染。这样**型号专属页面无需迁入 base**，v1 的 Phase 4 页面迁移取消，改为「base 补占位组件」。

### 3. 目录结构

```text
base/src/
  app/                      # 共享入口实现（新增）
    main.js                 # 超集 main，行为差异由 BEHAVIOR 参数驱动
    App.vue                 # 超集 App
    features.js             # FEATURES/BEHAVIOR 导出
    feature-schema.js       # 构建期 schema 校验（Node 模块）
    menu.js                 # 菜单超集 + feature 过滤
    router/
      index.js              # 路由超集 + meta.feature 守卫（命名路由跳转）
    http/index.js           # AppHttp 挂全量方法超集（无开关）
    store/index.js          # state 超集（无开关）
  pages/bussiness/setting/  # 已有 led/wps/wifi-schedule 等；补 sfp.vue 等占位
    sfp.vue                 # 新增：占位组件（真组件在 ga630 src/pages）

m6/
  features.js               # 新增
  vue.config.js             # 保留（追加 FEATURES/BEHAVIOR 注入 + overlay resolve）
  src/
    main.js                 # 薄壳：import 'base/app/main'
    pages/                  # 保留（型号覆盖页面 + 型号专属页面）
    assets/  i18n/          # 保留
    # 删除：App.vue / menu.js / router/ / store/ / http/
```

### 4. 开关消费点

**菜单**（`base/src/app/menu.js`）：feature 条件追加到现有**显示**过滤链（`show`/角色/`customers`），不替换现有逻辑；`mode` 不参与可见性过滤——当前实现中 mode 只把菜单置为 disabled，该行为保持在后续 disabled 阶段不变：

```javascript
// 显示过滤：现有条件 && feature
const featureOk = !menu.config.feature || FEATURES[menu.config.feature] !== false;
const visible = menu.config.show && roleOk(menu) && customerOk(menu) && featureOk;
// （modeOk 不在此处；之后仍按 mode 设置 menu.disabled，与现状一致）
// 菜单项示例：
// { text: 'SFP', name: 'sfp', url: '/setting/sfp',
//   config: { ...config, feature: 'sfpMenu' } }
```

**路由守卫**（`base/src/app/router/index.js`）：用**命名路由**跳转，避免裸路径命中 `/web` wildcard：

```javascript
router.beforeEach((to, from, next) => {
  store.commit('clearToken');
  const { feature } = to.meta || {};
  if (feature && FEATURES[feature] === false) {
    next({ name: 'dashboard' }); // 不用 next('/dashboard')
    return;
  }
  next();
});
```

**main.js**：行为差异由 `BEHAVIOR` 四个参数驱动：

```javascript
import { BEHAVIOR } from './features';
// reconnect 探测：
//   const reconnectOpts = BEHAVIOR.suppressDisconnectRedirectOnReconnect
//     ? { isReconnect: true } : undefined;
//   http.getRouter(undefined, reconnectOpts)
// changeMode 检查：
//   if (BEHAVIOR.reconnectUseChangeMode && isDelay && store.state.changeMode === false) return;
// upgrade：
//   BEHAVIOR.upgradeReconnectDelayMs > 0
//     ? setTimeout(doReconnect, BEHAVIOR.upgradeReconnectDelayMs)
//     : doReconnect();   // 保留同步路径，避免 setTimeout(fn,0) 宏任务时序差异
// upgrading 复位（不复位是 legacy 的既有行为，统一复位会改变 600402 重入语义）：
//   onfinally: () => {
//     if (BEHAVIOR.releaseUpgradingOnReconnectFinally) upgrading = false;
//   }
```

**http / store**：无开关，直接超集。

### 5. 关于死代码

被关闭功能的路由组件仍在产物中（静态注册需要）。占位组件机制使包体增量仅限「型号未提供的专属页面」的占位壳（约几十字节）。组件真实代码只进「提供了它」的型号产物——这是 overlay 相对 v1「页面迁入 base」的直接收益。`NormalModuleReplacementPlugin` 优化不再需要。

## Phased Rollout

### Phase 1: flags 基础设施 + 差异矩阵工具

- 新建 `base/src/app/features.js`、`feature-schema.js`
- 每个型号新建 `features.js` 并通过 schema 校验（值取自本文档差异矩阵）
- 各型号 `vue.config.js` 追加 `FEATURES`/`BEHAVIOR` 注入
- 用 AST 解析实现 `scripts/route-matrix.mjs`（排除注释、保留型号维度），重新生成基线路由矩阵
- 产出**「明确保留的核心功能清单」**与首版 Migration Notes（记录默认删除项：注释路由、永久隐藏菜单等）
- **验证**：8 个 MODEL_ID 构建通过；故意在 features.js 写错键名验证构建失败

### Phase 2: 统一 store + http

- `base/src/app/store/index.js` 超集 state；`base/src/app/http/index.js` 挂全量方法、修正类名
- 各型号 `src/store/`、`src/http/` 删除，引用改向 base
- **验证**：构建通过；手动验证 `router.config.frozen`（M6）、`mesh.wps`（GA630）、`mesh.poe.mode`（M16R0）、`mesh.fan.mode`（M13R0）

### Phase 3: 统一 menu

- 合并菜单超集，`config.feature` 标注受控项（`sfpMenu` 独立控制 ga630 特例）
- feature 条件与现有过滤链做 AND
- **验证**：8 个 MODEL_ID 菜单快照对比（见 Testing Strategy）

### Phase 4: overlay 解析机制

- 先做**最小构建实验**：只改 ga630 一个型号的 `vue.config.js`（`resolve.modules`  prepend `src`、add `base/src`，删除 `pages` 别名），验证裸 `pages/...` import 可解析后再铺开到其余型号
- **shadow 审计**：按「意外遮蔽」清单逐一处理交集文件——当前路由指向 base 的（如 nano 的 `wan.vue`）删除型号副本；指向型号内的保留为显式覆盖，记入 Migration Notes
- **验证**：同一 import 路径在 m6（型号内 wan.vue）与 nano（base wan.vue，删除 shadow 后）产物中解析到预期文件

### Phase 5: 统一 router

- 合并路由超集；组件 import 用裸 `pages/...` 路径走 overlay
- base 补型号专属页面的占位组件（sfp/powersupply/fan/frozen-config）
- `meta.feature` 标注 + 命名路由守卫
- 处理 limit 子路由：`deviceLimit: false` 时不注册 `/limit/:mac/time`、`/limit/:mac/url` 两个 children（子路由过滤在路由表构建期做，不走守卫）
- **验证**：路由矩阵逐条验证「开型号可达、关型号跳 `{name:'dashboard'}`」；8 个 MODEL_ID 路由快照对比

### Phase 6: 统一 main.js + App.vue

- 合并 main.js，`BEHAVIOR` 四参数驱动（含 `releaseUpgradingOnReconnectFinally`）
- 合并 App.vue（以 ga630 为基线）
- 各型号 `src/main.js` 改为 `import 'base/app/main'`
- i18n 引用：`import i18nInstance from '@/i18n'`（Vue CLI 默认 `@ → src` 别名，6 套配置均具备；不用 `src/i18n`——该别名不存在）
- **验证**：升级流程双代表验证（GA630 的 20s 延迟/changeMode 判断、M6 的立即重连）；reconnect fake timer 单测

### Phase 7（可选，未来）: 运行时合并

flags 改为运行时获取，overlay 改为按 model 动态 import。留待独立 spec。

## Risk Analysis

### 风险 1：overlay 解析在 webpack 4 上的行为不确定

**影响**：`resolve.modules` prepend/add 与既有 alias 的交互、子路径解析可能有坑，是整个方案的落地前提。

**缓解**：Phase 4 第一任务就是用最小用例（wan.vue：m6 命中型号内、nano 回退 base）验证；备好自定义 resolver plugin 的备选方案。验证不通过则不进入 Phase 5，及时止损。

### 风险 2：占位组件被错误渲染

**影响**：若 `meta.feature` 漏标或守卫逻辑错误，用户能看到空占位页。

**缓解**：占位组件渲染一行「功能不可用」文案而非完全空白；Phase 5 路由快照测试覆盖每条受控路由。

### 风险 3：main.js 参数化的边界情况

**影响**：`upgrading` 复位由 `releaseUpgradingOnReconnectFinally` 控制，legacy 保持不复位，无主动行为变更；`isReconnect` 标记与 exHandler 的耦合需整体迁移，不可只迁一半。

**缓解**：`suppressDisconnectRedirectOnReconnect` 一个参数同时控制「请求带标记」和「exHandler 跳过跳转」，避免两处配置不一致；reconnect/upgrade 写 fake timer 单测覆盖两代参数组合（含复位/不复位两分支）。

### 风险 4：菜单过滤链回归

**影响**：feature 条件若误替换现有 `show`/`customers`/角色判断，或误把 `mode` 移入可见性过滤（现状是 disabled），菜单项会错误显示/隐藏或丢失禁用态。

**缓解**：feature 只在显示过滤链 AND 追加，`mode` 保持在 disabled 阶段不动；8 个 MODEL_ID 菜单快照测试。

### 风险 5：m6s 目录服务 3 个 MODEL_ID

**影响**：M11R2 与其他两个 ID 的 sfp 配置不同。

**缓解**：`features.js` 是 Node 模块，构建期可读 `process.env.MODEL_ID` 条件赋值（`sfpMenu: process.env.MODEL_ID === 'M11R2'`），base 不加逻辑。

### 风险 6：回归覆盖不足

**影响**：仅 GA630 有正式 E2E。

**缓解**：菜单/路由快照测试 + reconnect 单测补足结构性回归；每 Phase 后 GA630（E2E）+ M6（手动 smoke）。

## Testing Strategy

- **每阶段基线**：`make build CUSTOMER_ID=0001 MODEL_ID={MODEL}` 对全部 8 个 MODEL_ID 通过
- **菜单快照测试（新增）**：对 8 个 MODEL_ID 分别构建，用脚本提取产物中菜单结构（或直接单测 `getMenu()` 的输出）与合并前基线快照 diff
- **路由快照测试（新增）**：对 8 个 MODEL_ID 提取注册路由表（path + name）与基线 diff，覆盖 limit 子路由等易被人工遗漏的项
- **reconnect/upgrade 单测（新增）**：fake timer 驱动，参数化覆盖 legacy（delay=0/无 changeMode/无 isReconnect）与 delayed（delay=20000/有 changeMode/有 isReconnect）两组行为
- **GA630 E2E**：现有 Playwright 套件每阶段跑一遍
- **双代表 smoke**：M6 + GA630 手动验证登录、菜单、关键页面、升级流程
- **overlay 解析验证（Phase 4）**：确认同一 import 在不同型号解析到不同文件

## Migration Checklist

每 Phase 完成时确认：

- [ ] 全部 8 个 MODEL_ID 构建通过
- [ ] GA630 Playwright E2E 通过
- [ ] M6 + GA630 手动 smoke 通过
- [ ] 菜单/路由快照与基线一致
- [ ] 该 Phase 涉及的型号目录文件已删除或改薄壳
- [ ] base 代码中无型号标识（grep `M6R0|M11R1|GA630` 应只命中 `constant.js` 既有映射）

## Open Questions

1. **overlay 最小实验结果**：Phase 4 第一步仅改 ga630 验证 `resolve.modules`（prepend `src` / add `base/src`）后裸 `pages/...` 可解析，再铺开；备选自写 resolver plugin。
2. **shadow 文件的处置清单**：「意外遮蔽」表中的交集文件逐一确认「删除型号副本」或「保留为显式覆盖」，结果记入 Migration Notes（nano 的 `wan.vue` 是已确认的 shadow 实例）。
3. **App.vue 差异收敛**：以 ga630 为基线，需确认 `data-e2e` 属性对其他型号 E2E 无影响。
4. **`/advance/frozenCofig` 拼写**：保留原文（避免后端/书签依赖断裂）还是顺手修正？倾向保留，列为实施时确认项。
