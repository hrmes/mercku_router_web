# P6-WEB-ASYNC-F1 交付报告

日期：2026-11-06。状态：**READY FOR COORDINATOR REVIEW**。

依据：Suite `docs/reviews/2026-11-06-p6-web-async-c1-coordinator-review.md` 的 UI F1 阻断、C1 交付报告和本轮用户要求。Unified 开工 HEAD 为 `ed9e9e4c`，沿用原有 develop 分支。Suite 保持 `e6c7125`，没有修改后端、已有未提交文档或 C1 协议。

## 最终行为

| 已观察到的事实 | 公共出口 | 页面行为 |
|---|---|---|
| 截止前 HTTP probe 从未成功 | `onTimeout` → 旧 `ontimeout` | 保留原有网络断连导航，可到 `/unconnect`；不另弹操作未知对话框 |
| HTTP 已恢复，操作明确失败 | `onError` → 可选页面 `onerror` 清理，再由公共错误入口显示真实 reason | 停止 Loading，留在当前页；不调用 `ontimeout` |
| HTTP 已恢复，结果未知或观察截止 | `onError`，保留原 ID，沿用 `outcome-unknown` 提示 | 留在当前页，允许用户只读检查同一 ID；不提交、不自动跳成功或 `/unconnect` |
| HTTP 已恢复且同一 ID 确认 `settled/completed` | `onSuccess` → 旧 `onsuccess` | 仅执行原成功回调 |

`create-controller.js` 使用现有 `confirming` 阶段区分网络预算与操作观察预算的截止，不增加状态仓库或第二套轮询。清理先推进现有 generation，再取消浏览器观察和 timer；deadline、delay、interval 均核对所属轮次，迟到的 probe/操作结果不能影响新一轮。

`create-app.js` 删除业务 `onError` 对网络 `ontimeout` 的调用，也删除纯网络超时后附加的操作未知弹窗。新增的 lower-case `onerror` 只用于页面本地清理；公共层仍独占错误原因映射及 Toast/Dialog。继续复用原文案和同 ID 只读重新查询。

Firstboot 是唯一需要页面清理钩子的调用处：记录并清理 countdown timer；业务错误时停止倒计时及动画，不写成功标记、不导航；成功、网络超时和页面销毁也清理 timer。视觉倒计时不拥有导航截止。WiFi/Guest/Region/WAN 原本由公共 Loading 和成功回调维护页面状态，本轮不逐页复制错误处理。

没有修改 Suite envelope/query、请求 Facade、HTTP method 分类、翻译、普通 mutation 完成等待或专用升级/重启/恢复流程。手动状态检查仍只查询原 ID，不调用原 mutation，也不会自动重放原成功导航。

## Host 验证

先补回归并观察失败，再修改产品代码：

- 控制器：HTTP 已恢复后的截止误走网络 timeout，新增测试复现失败。
- 公共装配：确定失败、unknown、观察截止错误跳 `/unconnect`；完全离线又额外弹未知对话框，4 项集成断言复现失败。
- Firstboot：缺少 `onerror` 和销毁清理，2 项断言复现失败。

修复后：

| 验证 | 结果 |
|---|---|
| 控制器、公共结果分流、Firstboot、既有重复重连 Loading 定向测试 | 46 PASS / 0 FAIL |
| 最终 Node 18 邻域（10 个测试文件） | **69 PASS / 0 FAIL** |
| 三个产品文件 + 新公共集成测试 ESLint | PASS |
| `git diff --check` | PASS |

公共集成回归运行真实 `createApp`、公共 `$reconnect` 和实际错误提示入口，以可控 HTTP/操作观察模拟后端边界，验证导航、通知次数、Loading 和原 ID。覆盖确定失败、未知后手动检查、HTTP 恢复后的截止、网络完全不可达、确认成功、页面切换。控制器另覆盖被替换的 probe、取消观察、迟到完成、重复/被替换的截止回调和 timer 清理。既有 upgrade/mode-switch、HTTP 观察取消、错误翻译、登录计数及 Backup 专用提示均在邻域内通过。

最终命令（在 `mercku_router_web` 执行）：

```sh
PATH=/usr/bin:/bin \
NODE_OPTIONS="--openssl-legacy-provider --require=$PWD/node_modules/sass/sass.dart.js" \
npm run test:unit -- \
  tests/unit/reconnect/create-controller.spec.js \
  tests/unit/compatibility/reconnect-loading.spec.js \
  tests/unit/compatibility/reconnect-outcomes.spec.js \
  tests/unit/compatibility/async-operation.spec.js \
  tests/unit/compatibility/operation-errors.spec.js \
  tests/unit/compatibility/unified-capability-http.spec.js \
  tests/unit/pages/unified-wlan-region.spec.js \
  tests/unit/pages/backup-errors.spec.js \
  tests/unit/layout/m6s-login-runtime.spec.js \
  tests/unit/i18n/unified-i18n.spec.js
```

预载 Sass 沿用 C1 的 Host 环境处理，防止旧 Sass 在 jsdom 建立 window 后初始化为浏览器模式；未改产品配置或依赖。日志：`/tmp/p6-web-f1-{controller-red,public-red,firstboot-red,targeted,neighborhood-final,lint}.log`。未运行 Suite 小时级全量、前端全量或 DUT；C1 已披露的其他基线失败不在本次 69 项邻域内，也未重新宣称其通过。

## 文件与交付边界

- `unified/src/app/create-app.js`：公共操作错误与网络超时回调解耦。
- `unified/src/app/reconnect/create-controller.js`：确认阶段截止分流与轮次保护。
- `unified/src/pages/wlan/index.vue`：Firstboot countdown/动画及销毁清理。
- `tests/unit/compatibility/reconnect-outcomes.spec.js`：新增公共集成回归。
- `tests/unit/reconnect/create-controller.spec.js`：截止、取消、替换与迟到回调合同。
- `tests/unit/pages/unified-wlan-region.spec.js`：Firstboot 清理与截止回归。
- 本报告。

本地 Commit，不 Push，不操作 DUT、不部署。Suite 的 invalid-input 分类和 no-cache/no-store 两项非阻断提醒未扩入本轮；保持 C1 合同。独立 Coordinator Review 与之后的真实网络/首次初始化登录验证仍待执行，不将 Host 结果当成设备通过。
