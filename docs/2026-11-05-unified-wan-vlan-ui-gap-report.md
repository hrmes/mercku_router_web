# unified 前端 WAN VLAN 设置缺失 —— 缺陷调研交接报告

| 项 | 内容 |
|---|---|
| 日期 | 2026-11-05 |
| 工程 | `mercku_router_web`（`unified/` 与 `base/`） |
| 状态 | **仅调研，未修改任何产品代码**；按 `AGENTS.md` 迁移流程，方案需 review 后方可编码 |
| 交付对象 | 负责 unified WAN 页面修复的同事 |
| 结论一句话 | 旧版 VLAN 设置位于「设置 → 上网设置」页内的「Internet 高级设置」卡片；unified 复用 `base` 版 WAN 页时该卡片被整体去掉，且**不是**被 profile/capability 隐藏。后端三平台均支持 VLAN，可直接复用 `mercku-behavior-index` 既有取证。 |

---

## 1. 现象与影响

- 在 unified Web 的「设置 → 上网设置」(`trans0142`, `/setting/wan`) 里，看不到旧路由器有的 VLAN 设置（Internet VLAN ID / Tagged / 优先级）。
- 实际影响：
  1. **无法新增、修改、关闭** VLAN 配置，需要 ISP VLAN（常见于 IPTV / 运营商宽带）的客户无法在 Web 上完成配置。
  2. 设备上**已有**的 VLAN 表不会丢：`base` 页保存 WAN 时会把 GET 读到的 `netInfo.vlan` 原样回传。
  3. 但若读回的 VLAN 表不满足 `canPreserveVlans()` 校验（字段缺失/类型不符/PPPoE 嵌套表与顶层不一致），**整个 WAN 保存被拒**，弹 `trans0688`「操作失败，该配置已经不存在」——容易被误报成 WAN 页故障。
- 仓库内**未找到**「下线 VLAN 编辑」的决策文档，因此无法判定是有意下线还是统一化迁移遗漏，需负责人/产品确认（见 §7）。

## 2. 静态确认（已执行，可复跑）

```bash
cd mercku_router_web
# 各型号 WAN 页是否有 VLAN 卡片
for d in base ga630 m6 m6a m6s nano; do
  printf "%-6s form__vlan=%s trans0683=%s\n" "$d" \
    "$(grep -c 'form__vlan' $d/src/pages/bussiness/setting/wan.vue)" \
    "$(grep -c 'trans0683' $d/src/pages/bussiness/setting/wan.vue)"; done
# base      form__vlan=0 trans0683=0
# ga630/m6/m6a/m6s 均为 1；nano 为 0

# 已构建产物（dist-unified, 11/3 构建）里是否有 VLAN UI
grep -c 'form__vlan\|trans0683\|wan-vlan' dist-unified/static/js/group-setting.34171b10.js   # 0
```

`trans0683` 在 `dist-unified` 中只出现在 `group-profiles.*.js`（i18n 语言包），没有渲染引用；说明**线上产物与源码一致，确实没有 VLAN UI**，不是缓存/构建陈旧问题。

## 3. 根因定位

| 环节 | 事实 |
|---|---|
| 路由 | `unified/src/app/router/definitions.js:62-63, 213`：`/setting/wan` → `'base/pages/bussiness/setting/wan.vue'` |
| 菜单 | `unified/src/app/menu/definitions.js:86`：`trans0142` 项，无 capability 门控 |
| 别名 | `unified/vue.config.js` `chainWebpack`：`base` 无条件 alias 到 `../base/src`，**没有按型号替换页面** |
| 页面 | `base/src/pages/bussiness/setting/wan.vue`（673 行）：模板 1–176 行只有上网类型 / DNS / 静态 IP，**无 `form__vlan` 区块** |
| 残留 | 同文件 352–391 行仍有 `vlanIdRules` / `ipPhoneVlanIdRules` / `iptvVlanIdRules` 三条**无引用**的校验规则（搬运残留死代码） |
| 兼容逻辑 | 198–224 `canPreserveVlans()`；509–556 `getWanNetInfo()`（516 行校验）；579–587 `submit()`，注释明确 `This page does not edit VLANs`，把整张 VLAN 表原样回传 |
| 能力开关 | `unified/src/app/profiles/capabilities.js:7-12` 的 `CAPABILITY_KEYS` 只有 `sfp / poeControl / fanControl / frozenConfig`；路由表和菜单表中**没有任何 vlan 项** |

即：**不是隐藏，是共用页里没有这段代码**。

## 4. 旧版应有行为（修复参照）

| 项 | 内容 |
|---|---|
| 位置 | 「设置 → 上网设置」页下方卡片 `form__vlan`，标题开关 `trans0683`「Internet 高级设置 / Advanced Settings」 |
| 字段 | `trans0684` Internet VLAN ID（2–4094）、`trans0686` 优先级、`trans0685` Tagged（WAN 口），提示 `trans0682`「请输入宽带运营商提供的 VLAN ID」 |
| i18n | `m6s/src/i18n/0001/{en-US,zh-CN}.json:677-687`（`trans0682`–`trans0689`）—— **文案在 unified 语言包里仍在，无需新增翻译** |
| 源码 | `m6s/.../setting/wan.vue:181-214`（`VlanName` / `VlanDefault` 见 308 行起）；`ga630/.../wan.vue:195-235`（带 `data-e2e="wan-vlan-*"` 钩子）；`m6/.../wan.vue:168` 起；`m6a` 同结构 |
| 未启用 | 纠正：M6a 存在实际 IP-Phone/IPTV UI、校验与提交逻辑；M6s/GA630 对应区块被注释，不能推广为所有旧版从未实现 |
| 无 UI 的型号 | `nano`（624 行，无 `form__vlan`，但 `submit()` 仍以 `vlan: []` 提交）；`m6s_poe` 没有自己的 `wan.vue`（只有 `powersupply.vue` / `wifi.vue`） |
| 测试 | `e2e/specs/wan-content.spec.ts:15, 42-60` 断言 `wan-vlan-card` / `wan-vlan-form` / `wan-vlan-toggle`，**针对 GA630 旧页**；`docs/superpowers/plans/2026-03-22-ga630-phase2-coverage.md:38` 记录了加钩子这一步 |

## 5. 后端三平台能力（`mercku-behavior-index` 已调研，直接复用，勿重扫）

`mesh.config.wan.net.update` 的 `vlan` 字段三平台都有完整读写链；`reviews/2026-11-03-p6-unified-routerweb-legacy-implementation-coverage.json` 已把该方法在三平台标为 **IMPLEMENTATION_TRACED**，并把下列 VLAN claims 列为证据，unified 前端入口记为 `base/.../wan.vue:526`。

| 平台 / 代 | UCI 存储 | 运行时生效 | 独有差异 |
|---|---|---|---|
| MT7621 Gen1（C，M6a） | `vlan` | `mercku_vlan restart` + `mercku_reload network` | 与 IPQ60xx **逐行等价**；整表替换，payload 不带 `vlan` 键＝删光全部 section；无 VLAN→MTU 副作用 |
| MT7621 Gen2（MerckuOS） | `vlan` → `switch_vlan` | 只重建 `network.@switch_vlan[*]`，WAN 恒 `eth1`，**无 `eth1.<vid>` 子接口** | 额外 MTU 1400（无 VLAN 恢复 1500）+ 延迟 3s `ReloadNetwork`；PPPoE 路径的 `m_set_wan_vlan` 被注释 |
| IPQ60xx Gen1（M6） | `vlan`（端口 numeric 编码） | tagged → `network.wan.ifname=eth3.<vid>`，vconfig 清旧子接口 | **读回序列化缺 `name` 字段**；PPPoE+VLAN 栈 `eth3 → eth3.<vid> → pppoe-wan` |
| MT7981 / CH（M6s） | **`mercku_vlan`**（名字不同） | `network.vlan` 8021q section + `network.wan.device=eth1.<vid>` | 消费者 `mercku_vlan` **仅 gw 模式**运行、update 注册为 `ROUTE_ONLY`；`mercku_sal_vlan_set` 返回值不检查（写失败静默）；空表也输出 `vlan: []`、`is_bridged` 恒 false；只有 PPPoE 的 vlan 解析失败是致命的，dhcp/static 忽略 |

> 存储名纠错已记录在 `records/2026-09-16-shared-wan-review-01.json`：Gen1 是 `vlan`，`mercku_vlan` 属于 CH 平台。

**取证入口**：`capabilities/wan.md`（§"WAN device / VLAN physical resolution（三平台）" 79–85 行；93 行明确「统一前端未按平台 capability 判断 DHCP/PPPoE/Static/VLAN 的细粒度支持」）、`cases/wan-config-runtime-read-sources.md`、`records/2026-09-16-shared-wan-index-01.json`、`records/2026-09-17-shared-wan-stats-index-03.json` / `-04.json`。
索引校验：Windows `records check` OK（11 domains / 974 claims）；Ubuntu `node tools/index.mjs check` 全绿（0 failure、usability 68 passed、adversarial 0 failure）。Windows 直接跑 `check` 会因无 `.git` 失败，属已说明的环境边界。

## 6. 修复约束（硬坑，务必先读）

1. **禁止直接把旧版 `form__vlan` 拷回 `base`**：旧版 `submit()` 以 `{ type, vlan: [] }` 开头**重造整张 VLAN 表**（只保留 UI 配的那一行，其余 VLAN 行被丢弃），与 base 现在「原样回传」的保护语义直接冲突。两套语义必须先择一或明确分层。
2. **保留或显式替代 `canPreserveVlans()`**：它是防止普通 WAN 保存清空旧固件 VLAN 表的唯一保护。其 CH 分支要求每行有 `name`（string）且 `port.name/type` 均为 `wan`；Gen1 分支要求 `type ∈ {NAT, BRIDGE}`、`ports` 非空、类型与 `is_bridged` 一致。改 UI 时不要放宽成"解析失败就提交空表"。
3. **无单条 CRUD**：Gen1/CH 都没有 per-entry enable/disable/delete 接口，任何 WAN 更新都是全表替换；Gen1 PPPoE payload 还可能带一份嵌入式 `vlan` 表（setter 先写、顶层写跳过），GET 会读两次，`canPreserveVlans` 对两份表不一致直接 fail-closed。
4. **平台判定不能拍脑袋**：`CAPABILITY_KEYS` 是 **v1 冻结**列表，加 `vlan` 需同步 bump `schemaVersion` 并贯穿 Identity / Model Profile / detectedCapabilities / compose / menu / router / page display。`unified/src/app/profiles/compose.js:85-92` 的 `expectedBackends` **只是诊断 warning**（见 `docs/superpowers/plans/2026-07-21-model-unification-b-v4.md:60`），不参与页面/路由/capability 选择，**不可当作平台判定依据**；且各 profile 里的取值与 index 的型号-平台归属并不一致，需先确认语义。
5. **MT7621 Gen2 不建子接口**：VLAN 只落在 switch 表并附带 MTU 1400，验收时不能拿 `eth1.<vid>` 当判据。
6. **M11R2（M6s-SFP）**：RJ45 模式物理 WAN 口是 `lan4`，但 `mercku_vlan` 脚本硬编码 `WAN_INTF=eth1`，会覆盖 `lan4` 选择；量产固件是否含修补版未验证。
7. **CH 的模式门控**：update 是 `ROUTE_ONLY`、VLAN 消费者仅 gw 模式；bridge / repeater 下开放 UI 会写出不生效的配置。
8. **构建链路**：`dist-unified/` 为 11/3 构建、`base/.../wan.vue` 11/4 有改动。修复后需在 Ubuntu 重新 `NODE_OPTIONS=--openssl-legacy-provider npm run build:unified`，并按要求重新打 `www.tar.gz`（保留 `dist-unified/` 顶层目录）。

## 7. 待裁决项（不要由执行者自行决定）

| # | 问题 | 建议方向 |
|---|---|---|
| P1 | 这是**有意下线**还是迁移遗漏？仓库无决策记录 | 先找产品/负责人确认；若确认应恢复再进入 plan |
| P2 | 恢复成**共用页全量开放**，还是按 capability / 客户策略开放？ | 倾向新增 capability（但需走 §6.4 的 schema 全链变更），避免给 nano 等旧版本来就无 UI 的型号凭空加功能 |
| P3 | 开放范围是否包含 bridge / repeater 等非 router 模式？ | CH 侧 ROUTE_ONLY，建议与路由菜单 `bothRouterOnly()` 保持一致 |
| P4 | 是否同时恢复 IP-Phone / IPTV VLAN？ | 纠正：M6a 已实现，按型号端口及当前 Suite 消费者安全性决定恢复范围 |
| P5 | 已有 VLAN 表（尤其 Gen1 PPPoE 嵌入式表）的兼容与失败提示 | 保留 fail-closed，但需产品确认 `trans0688` 是否足够可理解 |
| P6 | 保存语义选「全表重造」还是「原样回传 + 仅编辑 UI 行」 | 需与 index 记录的三平台全表替换行为一起评审，不能只改前端 |

## 8. 建议验收清单

**静态 / 单测**
- [ ] `mesh.config.wan.net.update` 的 `vlan` payload 在三平台 wire 下往返一致；空表、多行、PPPoE 嵌套表均覆盖（可复用 `tests/unit/pages/web-compat-f1.spec.js` 与 `fixtures/legacy-wan-vlan.js` 的已有边界用例）。
- [ ] `canPreserveVlans()` 的拒绝分支不导致"静默清空 VLAN 表"。
- [ ] 复用 GA630 的 `data-e2e="wan-vlan-*"` 钩子，把 `e2e/specs/wan-content.spec.ts` 的 VLAN 用例扩展到 unified 页面。
- [ ] 新增 capability 时，`customer-profile.schema.json` / `model-profile.schema.json` / compose / menu / router 一致性校验通过。

**真机（每平台各一台，index 结论只到 implementation-traced，未 runtime-verified）**
- [ ] 开启 VLAN ID 后落盘：Gen1 `uci show vlan`、CH `uci show mercku_vlan`；运行时 IPQ `eth3.<vid>`、CH `eth1.<vid>`、MT7621 Gen2 `switch_vlan` 表 + MTU 1400。
- [ ] PPPoE + VLAN 拨号成功；关闭 VLAN 后逻辑设备恢复物理口；改 VID 后旧子接口被清理。
- [ ] 修改普通 WAN 参数（DNS / 静态 IP）后，已有 VLAN 表与其中其它行**不丢失**。
- [ ] 非 router 模式下菜单/页面表现符合 P3 裁决；M11R2 RJ45 模式单独验证。
- [ ] 重新构建部署后，设备上的 hash 文件名与 `dist-unified` 新产物一致（确认不是旧包）。

## 9. 未验证项 / 边界

- index 只记录**旧实现**（固定 commit），不覆盖三代 `mercku-suite`，也不产出设计建议；当前固件 suite 侧是否仍暴露同样的 `vlan` wire，需要另立任务核查后才能写进方案。
- MT7981 的 `eth1.<vid>` 由 netifd 依 `network.vlan` section 创建，**未真机观察**；M11R2 量产固件是否带修补版、出厂默认 `wan_intf` 未知。
- 三平台旧实现都是「响应先返回、network apply 延迟执行且结果不回报」，Web 上的"保存成功"不等于 VLAN 已生效。
- 《11/3 覆盖复核》把 WAN update 标为 `IMPLEMENTATION_TRACED` 而非 `runtime-verified`，不能据此宣称真机复现过 VLAN。

---

### 附：本次调研产出文件

- 本报告：`mercku_router_web/docs/2026-11-05-unified-wan-vlan-ui-gap-report.md`
- 工作日志：`.workbuddy/memory/2026-11-05.md`（含 index 取证入口速查）
- 产品代码：**未改动**


## 2026-11-06 C1 定向核查修正

本轮以 Suite 实际代码为准，不把 §5 的旧代事实当作当前 Suite 合同。
- MT7621 Suite f21ffe4577201f0468c68a24ef6e83c867afa4a8；IPQ60xx 83862596da390c19a7ceab5d74afcba2c2d2026e；MT7981 f21ffe4577201f0468c68a24ef6e83c867afa4a8。
- `biz/network/usecase.mjs` RouterWeb GET 复用 wan-net-app 投影；wan-update 归一化顶层全表，SAL 有序事务和现有 merckud 执行器承接。Suite 与旧 C 不同：保留 NAT/BRIDGE，持久化失败显式回滚；MT7621 当前采用 Gen2 MTU 策略。
- MT7621 当前写 vlan/token，固件 `mercku_base_files/files/usr/bin/mercku_vlan` 读取 name/ports 并生成 network switch_vlan，Internet 物理接口保持 eth1；非空表 MTU 1400，空表 1500。关闭 Internet 删除目标行，其他行仍存在时继续 1400。
- IPQ60xx 写 vlan/numeric（4 tagged=20），GET 无 name；消费者 WAN=eth3，解码 tagged 后设置 eth3.<vid>。UI 仅识别唯一单 port 4 的 NAT 候选，不能选择第一行。
- MT7981 写 mercku_vlan/vlan_name/token，消费者只处理 internet、仅 gw，4t 决定 tagged。M11R2 的 RJ45 lan4 与脚本 eth1 冲突仍 BLOCKED，禁止该型号新增/编辑 VLAN；M11R1/M11R4/M16R0/GA630 按已知 identity 开放，仍需 DUT 验证实际固件版本。
- M6a（M8 的 M6a / M6a Plus / M6c 变体）IP-Phone/IPTV 是真实 UI。旧 checkPortNums 对 M6a 使用 WAN4+LAN0/1，对 Plus/M6c 使用 WAN4+LAN0/1/2/3；旧默认 is_bridged=false。Suite 能结构性读写其名称/端口，但当前 consumer 对非 internet 创建 switch_vlan，业务隔离和 NAT/BRIDGE 语义没有端到端证明。单独后续任务恢复编辑 UI；本轮不重造这些行，普通保存及 Internet 编辑均完整保留。
- 当前 GET 无 wire 快照版本/并发冲突检测；旧固件若静默省略行，前端无法证明完整性。异常 wire 拒绝保存，不回落空表。并发管理员修改仍需 DUT 验收与后续合同决策。
