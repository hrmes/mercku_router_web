# Unified 向导地区设置实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在 unified 首次配置向导中显示完整地区列表，支持地区名称资源回退，并将所选地区随初始化配置一起提交。

**Architecture:** 地区选择继续放在现有 `unified/src/pages/wlan/index.vue` 中，复用公共 `m-select`、`mesh.region.get` 和 `base/assets/regions`。从页面导出一个可单测的地区资源解析函数，按当前语言、客户默认语言、`en-US` 顺序尝试加载；页面把地区代码纳入 `wifiForm`，与 Wi-Fi 和管理员密码通过一次 `mesh.config.update` 提交。

**Tech Stack:** Vue 2.7、Vue I18n 8、Vue CLI 3、Mocha、Chai、Webpack 4

---

## 文件结构

- 修改 `unified/src/pages/wlan/index.vue`：地区资源解析、地区表单 UI、初始化回填、校验和提交。
- 新建 `tests/unit/pages/unified-wlan-region.spec.js`：覆盖资源 fallback、完整列表转换、地区校验和请求参数回归。
- 不修改 `base/src/http/index.js`：`getRegion()` 已映射到 `mesh.region.get`。
- 不修改 `base/src/assets/regions/*.json`：现有静态资源作为完整候选列表和 fallback 数据源。

### Task 1: 为地区资源 fallback 建立回归测试

**Files:**
- Create: `tests/unit/pages/unified-wlan-region.spec.js`
- Modify: `unified/src/pages/wlan/index.vue:122-125`

- [ ] **Step 1: 新建失败测试，定义 fallback 行为**

创建 `tests/unit/pages/unified-wlan-region.spec.js`：

```js
/* eslint-env mocha */
const { expect } = require('chai');

const {
  resolveRegionCatalogue,
  toRegionOptions,
} = require('../../../unified/src/pages/wlan/index.vue');

describe('unified WLAN region catalogue', () => {
  it('loads the current locale first', () => {
    const calls = [];
    const catalogue = [{ name: '中国', code: '156' }];
    const result = resolveRegionCatalogue('zh-CN', 'en-US', (locale) => {
      calls.push(locale);
      if (locale === 'zh-CN') return catalogue;
      throw new Error('missing locale');
    });

    expect(result).to.equal(catalogue);
    expect(calls).to.deep.equal(['zh-CN']);
  });

  it('falls back to the customer default locale and then en-US', () => {
    const calls = [];
    const catalogue = [{ name: 'China', code: '156' }];
    const result = resolveRegionCatalogue('es-MX', 'fr-FR', (locale) => {
      calls.push(locale);
      if (locale === 'en-US') return catalogue;
      throw new Error('missing locale');
    });

    expect(result).to.equal(catalogue);
    expect(calls).to.deep.equal(['es-MX', 'fr-FR', 'en-US']);
  });

  it('does not load the same fallback locale twice', () => {
    const calls = [];
    const catalogue = [{ name: 'China', code: '156' }];
    const result = resolveRegionCatalogue('en-US', 'en-US', (locale) => {
      calls.push(locale);
      return catalogue;
    });

    expect(result).to.equal(catalogue);
    expect(calls).to.deep.equal(['en-US']);
  });

  it('converts the complete catalogue to numeric select options', () => {
    const catalogue = [
      { name: 'Canada', code: '124' },
      { name: 'China', code: '156' },
    ];

    expect(toRegionOptions(catalogue)).to.deep.equal([
      { text: 'Canada', value: 124 },
      { text: 'China', value: 156 },
    ]);
  });
});
```

- [ ] **Step 2: 在页面脚本中先导出空实现，使失败指向行为而不是缺少导出**

在 `<script>` 的 import 之后加入：

```js
export function resolveRegionCatalogue() {
  return [];
}

export function toRegionOptions() {
  return [];
}
```

- [ ] **Step 3: 运行测试并确认失败**

运行：

```bash
npm run test:unit -- tests/unit/pages/unified-wlan-region.spec.js
```

预期：4 个用例失败，实际值为空数组。

- [ ] **Step 4: 实现最小资源解析逻辑**

将空实现替换为：

```js
export function resolveRegionCatalogue(locale, defaultLocale, loadCatalogue) {
  const locales = [locale, defaultLocale, 'en-US']
    .filter((item, index, list) => item && list.indexOf(item) === index);
  let lastError;

  for (let index = 0; index < locales.length; index += 1) {
    try {
      return loadCatalogue(locales[index]);
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError;
}

export function toRegionOptions(catalogue) {
  return catalogue.map(region => ({
    text: region.name,
    value: parseInt(region.code, 10),
  }));
}
```

- [ ] **Step 5: 运行测试并确认通过**

运行：

```bash
npm run test:unit -- tests/unit/pages/unified-wlan-region.spec.js
```

预期：4 passing。

- [ ] **Step 6: 提交本任务（仅在用户明确要求提交时执行）**

```bash
git add tests/unit/pages/unified-wlan-region.spec.js unified/src/pages/wlan/index.vue
git commit -m "test: cover unified wizard region fallback"
```

### Task 2: 将地区完整列表接入向导表单

**Files:**
- Modify: `unified/src/pages/wlan/index.vue:9-67`
- Modify: `unified/src/pages/wlan/index.vue:127-199`
- Modify: `tests/unit/pages/unified-wlan-region.spec.js`

- [ ] **Step 1: 增加地区有效性测试**

在测试文件的 import 中增加 `isValidRegion`，并在 describe 内加入：

```js
it('accepts only region IDs present in the complete option list', () => {
  const options = [
    { text: 'Canada', value: 124 },
    { text: 'China', value: 156 },
  ];

  expect(isValidRegion(156, options)).to.equal(true);
  expect(isValidRegion('', options)).to.equal(false);
  expect(isValidRegion(840, options)).to.equal(false);
  expect(isValidRegion(156, [])).to.equal(false);
});
```

- [ ] **Step 2: 运行测试并确认缺少导出**

运行：

```bash
npm run test:unit -- tests/unit/pages/unified-wlan-region.spec.js
```

预期：FAIL，`isValidRegion is not a function`。

- [ ] **Step 3: 实现地区有效性函数**

在两个地区 helper 后加入：

```js
export function isValidRegion(regionId, options) {
  return options.some(option => option.value === regionId);
}
```

- [ ] **Step 4: 把地区字段纳入表单模型和规则**

在 `data()` 返回值中增加列表状态，并把字段放入 `wifiForm`：

```js
regionsList: [],
wifiForm: {
  region_id: '',
  smart_connect: true,
  ssid24g: '',
  password24g: '',
  ssid5g: '',
  password5g: ''
},
```

在 `wifiFormRules` 首部增加：

```js
region_id: [
  {
    rule: value => isValidRegion(value, this.regionsList),
    message: this.$t('trans0237')
  }
],
```

这里沿用现有必填错误文案 `trans0237`，不增加新翻译 key。

- [ ] **Step 5: 在第一步顶部增加地区选择 UI**

在提示项之后、Smart Connect 表单项之前插入：

```vue
<m-form-item class="form-item"
             prop="region_id">
  <m-select :label="$t('trans0639')"
            v-model="wifiForm.region_id"
            :options="regionsList" />
  <div class="tip-label">{{$t('trans0646')}}</div>
</m-form-item>
```

- [ ] **Step 6: 运行目标测试与 lint**

运行：

```bash
npm run test:unit -- tests/unit/pages/unified-wlan-region.spec.js
npm run lint -- --no-fix unified/src/pages/wlan/index.vue tests/unit/pages/unified-wlan-region.spec.js
```

预期：地区测试 5 passing；lint 无 error。

- [ ] **Step 7: 提交本任务（仅在用户明确要求提交时执行）**

```bash
git add tests/unit/pages/unified-wlan-region.spec.js unified/src/pages/wlan/index.vue
git commit -m "feat: add region field to unified wizard"
```

### Task 3: 初始化地区列表并回填当前地区

**Files:**
- Modify: `unified/src/pages/wlan/index.vue:210-233`
- Modify: `unified/src/pages/wlan/index.vue:235-316`

- [ ] **Step 1: 增加页面方法 `loadRegionCatalogue`**

在 `methods` 中加入：

```js
loadRegionCatalogue() {
  const branding = this.$store.getters.branding || {};
  const catalogue = resolveRegionCatalogue(
    this.$i18n.locale,
    branding.defaultLanguage,
    locale => require(`base/assets/regions/${locale}.json`)
  );
  this.regionsList = toRegionOptions(catalogue);
  return this.regionsList;
},
```

Webpack 会为 `base/assets/regions` 下可匹配的 JSON 建立 context；运行时找不到当前 locale 时，`require` 抛错并由 helper 尝试下一种语言。

- [ ] **Step 2: 增加当前地区加载方法并提供首项回退**

在 `methods` 中加入：

```js
loadRegion() {
  const options = this.loadRegionCatalogue();

  return this.$http.getRegion()
    .then((res) => {
      const region = res.data.result || {};
      const currentId = parseInt(region.ip_country_id || region.id, 10);
      this.wifiForm.region_id = isValidRegion(currentId, options)
        ? currentId
        : options[0].value;
    })
    .catch(() => {
      this.wifiForm.region_id = options[0].value;
    });
},
```

- [ ] **Step 3: 将未初始化分支改为并行加载 Wi-Fi 和地区**

保留 `isinitial()` 判断，把当前 `getMeshMeta()` 调用替换为：

```js
const wifiPromise = this.$http.getMeshMeta().then((metaRes) => {
  const wifi = metaRes.data.result;
  const b24g = wifi.bands[Bands.b24g];
  const b5g = wifi.bands[Bands.b5g];
  this.wifiForm.ssid24g = b24g.ssid;
  this.wifiForm.password24g = b24g.password;
  this.wifiForm.ssid5g = b5g.ssid;
  this.wifiForm.password5g = b5g.password;
});

return Promise.all([wifiPromise, this.loadRegion()]);
```

这样 `getRegion()` 失败会在 `loadRegion()` 内回退首项，不会触发外层 `/login`；`getMeshMeta()` 失败仍保持现有跳转行为。

- [ ] **Step 4: 运行单测**

运行：

```bash
npm run test:unit -- tests/unit/pages/unified-wlan-region.spec.js
```

预期：5 passing。

- [ ] **Step 5: 提交本任务（仅在用户明确要求提交时执行）**

```bash
git add unified/src/pages/wlan/index.vue
git commit -m "feat: initialize unified wizard region"
```

### Task 4: 将地区加入初始化提交并验证构建

**Files:**
- Modify: `unified/src/pages/wlan/index.vue:262-313`
- Modify: `tests/unit/pages/unified-wlan-region.spec.js`

- [ ] **Step 1: 增加请求参数 helper 的失败测试**

从页面额外导入 `buildInitialConfig`，并加入：

```js
it('includes a numeric region ID in the initial mesh config', () => {
  const config = buildInitialConfig({
    region_id: 156,
    smart_connect: true,
    ssid24g: 'Mercku',
    password24g: 'password123',
    ssid5g: 'Mercku',
    password5g: 'password123',
  });

  expect(config.region_id).to.equal(156);
  expect(config.admin.password).to.equal('password123');
  expect(config.wifi.bands['2.4G'].ssid).to.equal('Mercku');
});
```

- [ ] **Step 2: 运行测试并确认缺少导出**

运行：

```bash
npm run test:unit -- tests/unit/pages/unified-wlan-region.spec.js
```

预期：FAIL，`buildInitialConfig is not a function`。

- [ ] **Step 3: 提取并实现初始化配置构造函数**

在页面 helper 区域加入：

```js
export function buildInitialConfig(wifiForm) {
  return {
    wifi: {
      bands: {
        '2.4G': {
          ssid: wifiForm.ssid24g,
          password: wifiForm.password24g
        },
        '5G': {
          ssid: wifiForm.ssid5g,
          password: wifiForm.password5g
        }
      },
      smart_connect: wifiForm.smart_connect
    },
    admin: { password: wifiForm.password24g },
    region_id: wifiForm.region_id
  };
}
```

- [ ] **Step 4: 替换提交参数中的内联配置**

把 `step1()` 中的 `updateMeshConfig` 参数替换为：

```js
this.$http.updateMeshConfig({
  config: buildInitialConfig(this.wifiForm)
})
```

保留 Smart Connect 开启时同步 `password5g`、loading、倒计时和重连的现有逻辑。

- [ ] **Step 5: 运行完整验证**

在 Ubuntu 工程目录运行：

```bash
npm run test:unit -- tests/unit/pages/unified-wlan-region.spec.js
npm run lint -- --no-fix unified/src/pages/wlan/index.vue tests/unit/pages/unified-wlan-region.spec.js
NODE_OPTIONS=--openssl-legacy-provider npm run build:unified
```

预期：

- 地区目标测试 6 passing；
- lint 无 error；
- unified 构建成功，产物写入 `dist-unified/`；
- 构建日志中没有找不到 `base/assets/regions/*.json` 的错误。

- [ ] **Step 6: 手工核对关键行为**

在 unified 开发预览或设备上检查：

1. `/web/wlan` 第一屏显示地区下拉框；
2. 下拉项数量与所加载的地区 JSON 条目数一致；
3. `zh-CN` 和 `en-US` 显示对应语言的地区名称；
4. 将测试 profile 的当前语言临时设为没有地区 JSON 的 locale 时，地区名称回退到默认语言或 `en-US`；
5. 提交 `/app` 请求体包含数字类型 `params.config.region_id`；
6. 提交后仍进入 60 秒倒计时，并按原逻辑跳转 `/login` 或 `/unconnect`。

- [ ] **Step 7: 提交本任务（仅在用户明确要求提交时执行）**

```bash
git add tests/unit/pages/unified-wlan-region.spec.js unified/src/pages/wlan/index.vue
git commit -m "feat: submit region in unified setup wizard"
```
