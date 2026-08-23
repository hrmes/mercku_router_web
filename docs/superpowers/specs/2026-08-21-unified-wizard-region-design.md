# Unified 向导地区设置设计

## 目标

在 unified 初始化向导中增加地区设置项，使用户可以在首次配置 Wi-Fi 时同时选择地区，并将地区代码随 `mesh.config.update` 一起提交。

## 已确认范围

- 所有使用 unified 向导的设备都显示地区设置项，不复制旧工程的型号分支。
- 地区候选显示当前本地化地区 JSON 中的完整列表，不调用后端支持列表过滤。
- 地区名称文件支持 fallback：当前界面语言 → 客户默认语言 → `en-US`。
- 当前地区通过 `mesh.region.get` 获取并回填。
- 地区代码放入初始化请求的 `config.region_id`。
- 初始化成功后的重连、倒计时及跳转逻辑保持现状。

## 交互与页面结构

向导第一步的表单顺序调整为：

1. 地区下拉框
2. Smart Connect
3. Wi-Fi 名称
4. Wi-Fi 密码

地区控件复用现有 `m-select`、翻译 key 和地区静态资源：

- 标题：`trans0639`
- 提示：`trans0646`
- 选项：`base/src/assets/regions/*.json`
- 选项格式：`{ text: r.name, value: parseInt(r.code, 10) }`

## 数据流

页面挂载后仍先执行 `isinitial`。设备未初始化时，并行加载：

- `getMeshMeta()`：回填 Wi-Fi 表单
- `getRegion()`：回填当前地区
- 地区本地化列表：按 fallback 顺序加载地区名称

地区文件选择规则：

1. 尝试当前 `this.$i18n.locale` 对应的 JSON；
2. 当前文件不存在时，尝试客户默认语言对应的 JSON；
3. 仍不存在时，使用 `en-US.json`。

候选列表使用最终成功加载的完整地区列表。当前地区值转换为数字；如果当前接口没有返回有效值，则选中列表首项，确保提交时不会产生空的 `region_id`。

## 提交与校验

`wifiForm` 增加 `region_id` 字段，地区表单项使用同一个模型字段，避免旧页面中 `prop="region"` 与实际绑定状态不一致的问题。

提交前除 Wi-Fi 规则外增加地区校验：

- `region_id` 必须有值；
- `region_id` 必须存在于当前 `regionsList`；
- 地区列表加载完成前不允许提交。

请求结构增加：

```js
config: {
  wifi: { /* 现有 Wi-Fi 配置 */ },
  admin: { password: this.wifiForm.password24g },
  region_id: this.wifiForm.region_id
}
```

地区与 Wi-Fi、管理员密码一次提交，不单独调用 `mesh.region.update`。提交成功后的重连流程不变。

## 错误与回退

- 当前语言地区文件缺失：回退到客户默认语言，再回退到 `en-US`。
- `getRegion()` 请求失败：不阻断 Wi-Fi 元数据加载；地区使用地区列表首项。
- 地区静态资源全部缺失：视为开发/打包错误，不新增空列表或隐藏地区项。
- `mesh.config.update` 失败：维持现有行为，关闭 loading，停留在第一步。

## 影响文件

主要修改：

- `unified/src/pages/wlan/index.vue`

预计不修改：

- `base/src/http/index.js`，因为 `getRegion` 已存在；
- `base/src/assets/regions/`，因为现有语言文件已覆盖 fallback 资源；
- 普通地区设置页及路由，因为本次只调整初始化向导。

## 验证标准

- 向导第一步显示地区下拉框。
- 当前语言存在对应 JSON 时显示该语言的地区名称。
- 当前语言不存在时依次回退客户默认语言和 `en-US`。
- 地区列表为完整静态列表，不受 `mesh.region.supported.get` 影响。
- 当前地区能正确回填；接口没有有效值时使用列表首项。
- 提交请求包含数字类型的 `config.region_id`。
- 地区无效或列表未加载完成时，表单不能提交。
- 既有 Wi-Fi 配置、倒计时、重连和错误跳转行为不变。
