# WAN VLAN C1 Implementation Plan

按已批准任务书执行，不扩展 Profile schema。

1. 修改 base WAN 页面：复用 GA630 Internet 卡片；小型纯函数负责目标识别及整表合并；保留 canPreserveVlans 与 reconnect。
2. 可靠名称精确匹配 internet；无名称只接受唯一 NAT、非桥接、单 port 4 候选；其他形状拒绝编辑。普通保存原样保留；开启更新目标四个字段；新增按已知 identity.modelId 选择 wire；关闭删除目标，不留下禁用行。未知型号、M11R2 禁止编辑。
3. MT7621 vlan/token + switch_vlan 消费者，表非空 MTU 1400；IPQ vlan/numeric、无 name；MT7981 mercku_vlan/token、仅 gw。M11R2 eth1/lan4 冲突 BLOCKED，不改 backend/Executor/Store。M6a 电话/IPTV 型号相关端口策略后续单独恢复。
4. 先添加失败用例，再实现；定向 mounted WAN 邻域测试及三平台 Suite WAN 测试；Unified build、产物钩子及临时 www.tar.gz 顶层结构检查。无 DUT/E2E 连接，无全量测试。
5. 更新差距报告和交付记录；独立自审补丁，只提交本任务文件与 WAN 局部补丁，不 Push。
