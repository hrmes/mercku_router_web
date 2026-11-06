# P6-WEB-WAN-VLAN-C1 交付记录

## 实现与边界

- base WAN 页恢复 GA630 Internet VLAN 组件/i18n/data-e2e；2–4094、priority 0–7、Tagged。
- 单页 internetIndex 识别及合并，无新增通用框架；普通保存不改原表。具名目标优先；无名称必须唯一 NAT 单 WAN4；重复名称、多个候选或异常端口形状拒绝编辑。隐藏编辑卡片不影响原样保存合法全表。
- 新建按现有 runtimeContext.identity.modelId 选择 Gen1 NAT/name 规则，不参考 expectedBackends；M8/M6R0/M11R1/M11R4/M16R0/GA630 且 router 模式开放。未知型号、M13R0、M11R2 不开放编辑。
- 关闭删除目标行；其他条目不变，MT7621 有剩余条目仍采用 1400 MTU。PPPoE 原 GET 有嵌套表时提交同步副本。
- canPreserveVlans 的异常/嵌套不一致保护保留；GET pending/失败不能写入。没有新增异步机制、修改 Suite/Store/Executor/Profile schema。
- 保留工作树已有 operation-aware reconnect 改动，本轮提交不包含该改动。现有 WAN save 确认框后等待 reconnect，没有添加“VLAN 已生效”提示。请求 accepted 与实际联网必须分开验收。

## 验证

PASS：mounted WAN/VPN 邻域 web-compat-f1 92 项；新增单行编辑、多行保留、空表新增、关闭、IPQ 无名称、重复/歧义、未知型号、M11R2、bridge、ID 越界等用例；原 GET 异常和普通 WAN 三协议测试保留。

PASS：三个实际 Suite 工作树分别执行 tests/hal/platform/<platform>/unit.wan.mjs、tests/sal/network/unit.wan-config.mjs、tests/biz/network/unit.wan-update.mjs：MT7621 53、IPQ60xx 46、MT7981 48；unit.usecase + unit.wan-configuration 各 19。

PASS：实际各工作树 projectWanNetForApp → normalizeWanUpdatePayload，三协议 × 空/单/多行，共 27 次，ID/priority/ports/tagged/isBridged 保持。脚本及日志在 /tmp/wan-vlan-c1。

PASS：单文件 ESLint、git diff --check；NODE_OPTIONS=--openssl-legacy-provider npm run build:unified，生成 group-setting.634677a4.js 含 wan-vlan-card/wan-vlan-id-input。本地 /tmp/wan-vlan-c1/www.tar.gz 92 条目均以 dist-unified 为顶层且包含 index.html，未覆盖固件工作树包。

SKIP：真实设备 E2E、DUT、MQTT、刷机、部署，遵循本轮禁止项。构建使用当前共享工作树，包含其他任务未提交内容，包仅供本地核查，不能视为独立发布包。

## 平台状态与待验收

- MT7621：Host-only。Suite f21ffe4577201f0468c68a24ef6e83c867afa4a8。vlan/token 与当前 overlay switch_vlan consumer 一致；DUT 检查实际安装消费者、关闭/剩余行时 MTU 1500/1400、DHCP/static/PPPoE、重启后持久化。
- IPQ60xx：Host-only。Suite 83862596da390c19a7ceab5d74afcba2c2d2026e。numeric 4t=20、缺 name；DUT 检查 eth3.<vid>、旧接口清理、tagged/untagged 与多个 NAT 行的消费者行为。
- MT7981（非 M11R2）：Host-only。Suite f21ffe4577201f0468c68a24ef6e83c867afa4a8。mercku_vlan/token/gw；DUT 检查实际固件 consumer、network.vlan、eth1.<vid>、三协议及关闭恢复。
- M11R2：BLOCKED。RJ45 lan4/SFP eth1 与消费者硬编码冲突；需后续后端/固件口选择修复及独立合同验证，本轮不声称可验收。
- M6a IP-Phone/IPTV：旧版确实实现 M6a/Plus/M6c 的 UI、校验、端口组合与提交。Suite 可结构性往返；业务端口隔离和旧 NAT 默认语义尚无证明，因此编辑 UI 单列后续任务，现有条目完整保留。详见修正后的 gap report。

## 独立自审

实现结束后重新核对 GET→submit→Suite normalize→HAL/consumer：普通保存无整表重造；编辑仅变更目标 enabled/id/priority/tagged；关闭 splice 目标；未知/歧义不猜测；嵌套表一致。未新增后端业务重复实现或扩展冻结合同。新增默认条目使用现有 WAN4 编码，M11R2 不参与。

剩余风险：前端无法识别旧后端静默省略行，也无 GET/UPDATE CAS；其他管理员并发修改可能被旧快照覆盖。实际 DUT 固件消费者版本、联网成功和电话/IPTV 业务均未验证，不能将 Host 测试当作运行时通过。既有全表替换合同及这些未决项未被本轮重新设计。
