# Unified / Base 旁路改造审查结论

审查范围：提交 `cf95d08d` 及其后的当前工作区改动，重点评估 Unified 代码必要性和 Base 旧工程兼容性。

## 总体结论

方向基本合理：Unified 作为运行时配置驱动的新入口，复用 Base 和各型号现有页面；旧型号仍从各自目录独立构建，没有被强制切换到 Unified。当前 Unified、M6、M6s、Nano、GA630 均能完成生产构建，因此暂未发现 Base 改动导致旧工程直接编译失败。

但当前状态还不建议合并：全量单元测试为 **410 passing / 15 failing**，并且启动错误页存在 HTML 注入风险。Base 改动总体有必要，但夹杂了少量与 Unified 复用无关、应撤回或单独处理的行为修改。

## 必须处理

### P1：启动错误页直接拼接未经转义的错误文本

位置：`unified/src/main.js:30`

`descriptor.message` 和 diagnostics 被直接插入 `innerHTML`。这些文本可能包含运行时 identity、profile 加载错误或后端返回内容，包含 HTML 时会被浏览器解析。

建议：对所有动态文本做 HTML escaping，或者使用 DOM API 设置 `textContent`；只保留固定模板为 HTML。

### P1：Profile schema 已新增必填字段，但测试 fixture 没有同步

位置：`unified/src/app/profiles/model-profile.schema.json:35`

`behavior.meshRadioStatus` 已成为必填字段，但以下测试中的 `VALID_MODEL_PROFILE` 仍缺少该字段：

- `tests/unit/branding/validate-profiles.spec.js:146`
- `tests/unit/identity/bootstrap.spec.js:28`
- 其他 model-profile 测试 fixture

结果是全量测试 15 项失败，其中 bootstrap 成功路径、Neutral fallback、capability compose 等关键保障均未运行到目标断言。

建议：统一更新所有 model profile fixture，并重新运行全量单测；不要把这些失败视为无关测试噪声。

### P1：Base 中存在与旁路复用无关的排序行为修改

位置：`base/src/pages/bussiness/upgrade/offline.vue:207`

`sort((a, b) => ...)` 被改成了 `sort(a => ...)`。该修改既不是运行时配置适配所需，也使 comparator 不满足完整排序契约，可能改变旧工程节点顺序。

建议：恢复旧实现；如果原排序本身需要修复，应独立提交并增加排序测试。

## Unified 必要性与精简空间

### 建议保留

以下层次都有明确职责和实际调用，不属于无效代码：

- `bootstrap`、identity/schema 校验、profile loader/compose：负责运行时身份加载和 fail-closed 边界。
- model/customer registry：提供 webpack 可静态分析的异步 profile chunk。
- router/menu definitions 与过滤器：将型号能力、客户策略、角色和模式转成可见页面。
- `create-app`、store、HTTP、i18n、reconnect controller：为复用旧页面补齐其依赖的 Vue 运行环境。
- `register-components.js`、`base-page-formatters.js`：复用 Base/型号页面时确实需要，兼容测试已有覆盖。
- `offline-api-middleware.js`：仅用于本地预览和 E2E，但用途明确，不会进入生产 bundle。
- 删除 Unified 自己复制的 dashboard/login，改为复用 Base/M6s 页面，是正确的收敛方向。

### 可以精简

位置：`unified/src/app/profiles/model-profile.schema.json:60`、`unified/src/app/profiles/compose.js:110`

`pageVariants` 在 v1 schema 中被强制为 `{}`，业务代码没有消费者，却在每个 model profile、compose 结果、测试中持续传递。这是当前最明确的死配置。

建议二选一：

1. v1 完全删除 `pageVariants`；以后出现真实页面变体时再通过 schema 版本引入。
2. 如果设计文档要求保留扩展点，至少不要把它作为必填运行时字段，也不要为每个 profile 重复空对象。

另外，`Makefile:48` 和 `Makefile:50` 重复计算 `MODEL`，属于可直接去掉的冗余，不影响架构。

## Base 改动评估

### 基本必要

以下修改是复用 Base 页面所需，且保留了 `process.env.CUSTOMER_CONFIG` / `MODEL_CONFIG` 的 legacy 分支：

- Header/Footer 的运行时 branding、语言、Logo、QR 和 App 链接适配。
- loading color 在无编译期客户配置时读取 CSS variable。
- dashboard/mesh/router-model 对运行时 branding、behavior、capability 的适配。
- encrypt/wifi rules 在 Unified 无 `MODEL_CONFIG` 时提供安全默认值。
- `base/src/runtime/ui-context.js` 集中处理 runtime/legacy branding，避免每个组件自行判断。
- `base/src/layouts/app-shell.vue` 抽取旧工程外壳供 Unified 使用；旧型号入口没有被改为使用它。

### 风险与建议

Base 当前通过检查 `store.getters.runtimeContext` 判断 Unified 环境，旧工程 getter 不存在时保持 legacy 路径。该方式能够工作，但 Base 已开始理解 Unified store 结构，旁路隔离并不完全纯粹。

短期可以接受；后续如果继续增加分支，建议由 Unified 注入统一 adapter/getter，而不是继续在 Base 页面散布 `runtimeContext`、`branding`、`effectiveCapabilities` 判断。

除上述排序修改外，当前 Base 改动未发现确定的旧工程编译回归。构建成功不能完全证明 UI 行为无回归，Header、Footer、Dashboard、Offline Upgrade 仍应保留至少一组 legacy 浏览器冒烟测试。

## 验证结果

已通过：

- Unified production build
- M6 legacy production build
- M6s legacy production build
- Nano legacy production build
- GA630 legacy production build
- Profile validator
- Unified concrete-ID boundary check
- 兼容性、layout、i18n、Unified build-config 定向测试：51 passing

未通过：

- 全量 unit tests：410 passing / 15 failing
- 失败主要由 `meshRadioStatus` schema 与测试 fixture 不同步引起，但必须修复后重新验证

## 合并建议

合并前至少完成：

1. 修复启动错误页动态文本转义。
2. 同步 model-profile 测试 fixture，使全量单测通过。
3. 撤回 Offline Upgrade 的无关排序修改。
4. 删除或明确保留 `pageVariants` 空扩展点的理由。
5. 对至少一个 legacy 型号执行 Header、Dashboard、Offline Upgrade 浏览器冒烟测试。
