<template>
  <div class="page repeater-mode-page">
    <div v-if="$store.state.isMobile" class="page-header">
      {{ $t('trans0539') }}
    </div>

    <div class="page-content">
      <div class="page-content__main">
        <div class="mode-grid" :class="{ connected: isCurrentRepeater }">
          <section class="card mode-card" data-e2e="mode-form-card">
            <div class="card-title">
              <strong>{{ text('workMode') }}</strong>
              <span class="status-pill">{{ currentModeLabel }}</span>
            </div>

            <m-radio-group
              v-model="mode"
              data-e2e="mode-options"
              :options="modes"
              bold
              direction="vertical">
            </m-radio-group>

            <p v-if="isWirelessBridge && !isCurrentRepeater" class="mode-tip">
              {{ text('meshWillPause') }}
            </p>
          </section>

          <section v-if="isCurrentRepeater" class="card uplink-card">
            <div class="card-title">
              <strong>{{ text('uplinkWifi') }}</strong>
              <span class="status-pill online">{{ text('connected') }}</span>
            </div>
            <div class="info-list">
              <div>
                <span>{{ text('networkName') }}</span>
                <strong>{{ currentAp.ssid || '-' }}</strong>
              </div>
              <div>
                <span>{{ $t('trans0111') }}</span>
                <strong>{{ formatBand(currentAp.band) }}</strong>
              </div>
              <div>
                <span>{{ $t('trans0728') }}</span>
                <strong class="uplink-signal" :class="signalLevel(currentAp.rssi)">
                  {{ formatRssi(currentAp.rssi) }} · {{ signalQuality(currentAp.rssi) }}
                </strong>
              </div>
              <div v-if="currentAp.ip"><span>IP</span><strong>{{ currentAp.ip }}</strong></div>
            </div>
          </section>
        </div>
      </div>

      <div
        v-if="!isCurrentRepeater || mode !== currentMode"
        class="page-content__bottom">
        <div class="form-button__wrapper">
          <button
            v-if="isWirelessBridge"
            class="btn primary"
            data-e2e="repeater-configure"
            type="button"
            @click="openRepeaterConfig">
            {{ text('selectUplink') }}
          </button>
          <button
            v-else
            class="btn primary"
            data-e2e="mode-submit"
            type="button"
            @click="confirmRegularMode">
            {{ $t('trans0081') }}
          </button>
        </div>
      </div>
      <div v-else class="page-content__bottom">
        <div class="form-button__wrapper repeater-actions">
          <button class="btn btn-default" type="button" @click="openRepeaterConfig">
            {{ text('changeUplink') }}
          </button>
          <button class="btn btn-default danger" type="button" @click="confirmDisableRepeater">
            {{ text('disableRepeater') }}
          </button>
        </div>
      </div>
    </div>

    <m-modal
      class="repeater-modal"
      type="confirm"
      :visible="showRepeaterConfig"
      @update:visible="cancelRepeaterConfig">
      <m-modal-header>
        <div class="modal-title-row">
          <strong>{{ text('selectUplink') }}</strong>
          <button class="modal-close" type="button" @click="cancelRepeaterConfig">×</button>
        </div>
      </m-modal-header>
      <m-modal-body>
        <div class="scan-toolbar">
          <span>{{ text('selectUplinkHint') }}</span>
          <button
            class="text-button"
            type="button"
            :disabled="scanLoading || detaching"
            @click="scanNetworks">
            {{ text('rescan') }}
          </button>
        </div>

        <div v-if="detaching" class="scan-state">
          <m-loading :size="56"></m-loading>
          <span>{{ text('detaching') }}</span>
        </div>
        <div v-else-if="scanLoading" class="scan-state">
          <m-loading :size="56"></m-loading>
          <span>{{ $t('trans1181') }}</span>
        </div>
        <button
          v-else-if="scanFailed"
          class="scan-state failed"
          type="button"
          @click="scanNetworks">
          {{ $t('trans1183') }}
        </button>
        <div v-else-if="accessPoints.length" class="network-list">
          <button
            v-for="ap in accessPoints"
            :key="`${ap.bssid}-${ap.band}`"
            class="network-row"
            :class="{
              selected: selectedAp
                && selectedAp.bssid === ap.bssid
                && selectedAp.band === ap.band
            }"
            type="button"
            @click="selectAccessPoint(ap)">
            <strong class="network-name">{{ ap.ssid }}</strong>
            <span class="network-meta">
              <small>{{ formatBand(ap.band) }}</small>
              <img
                v-if="isSecured(ap)"
                class="network-lock"
                :src="require('base/assets/images/icon/ic_wifi_lock.svg')"
                :alt="text('securedNetwork')" />
              <span class="signal-bars" :class="signalLevel(ap.rssi)">
                <i></i><i></i><i></i><i></i>
              </span>
            </span>
          </button>
        </div>
        <div v-else class="scan-state">{{ text('noNetworks') }}</div>

        <m-form
          v-if="selectedAp && requiresPassword"
          ref="apForm"
          :model="apForm"
          :rules="apRules"
          class="ap-form">
          <m-form-item prop="password">
            <m-input
              v-model="apForm.password"
              type="password"
              :label="text('wifiPassword')"
              :placeholder="text('passwordPlaceholder')">
            </m-input>
          </m-form-item>
        </m-form>

        <p v-if="selectedAp" class="switch-warning">
          {{ text('connectionWarning') }}
        </p>
      </m-modal-body>
      <m-modal-footer>
        <div class="modal-actions">
          <button class="btn btn-default" type="button" @click="cancelRepeaterConfig">
            {{ text('cancel') }}
          </button>
          <button
            class="btn"
            type="button"
            :disabled="!canConnect"
            @click="confirmRepeaterConnection">
            {{ isCurrentRepeater ? text('switchNetwork') : text('connect') }}
          </button>
        </div>
      </m-modal-footer>
    </m-modal>
  </div>
</template>

<script>
import { EncryptMethod, RouterMode } from 'base/util/constant';
import { isValidPassword } from 'base/util/util';

const COPY = {
  'zh-CN': {
    workMode: '工作模式',
    routerDesc: '通过 WAN 口接入互联网。',
    bridgeDesc: '通过网线接入上级网络。',
    repeaterDesc: '连接其他 Wi-Fi，扩展当前网络覆盖。',
    uplinkWifi: '上级 Wi-Fi',
    connected: '已连接',
    networkName: '网络名称',
    changeUplink: '更换上级 Wi-Fi',
    disableRepeater: '关闭无线中继',
    selectUplink: '选择上级 Wi-Fi',
    selectUplinkHint: '选择要连接的上级 Wi-Fi',
    rescan: '重新扫描',
    hiddenNetwork: '隐藏网络',
    noNetworks: '未发现可用的 Wi-Fi，请重新扫描。',
    wifiPassword: 'Wi-Fi 密码',
    passwordPlaceholder: '请输入 8–64 位密码',
    connectionWarning: '切换期间网络会短暂中断。连接成功后 Mesh 将自动关闭，但已保存的节点不会被删除。',
    detachForScan: '扫描上级 Wi-Fi 需先断开当前无线中继，断开期间网络会短暂中断，是否继续？',
    detaching: '正在断开当前无线中继，可能需要 1–2 分钟…',
    meshWillPause: '连接成功后 Mesh 将自动关闭。',
    cancel: '取消',
    connect: '连接',
    switchNetwork: '切换到此网络',
    connecting: '正在连接上级 Wi-Fi…',
    switching: '正在切换工作模式…',
    changeConfirm: '无线中继将断开，切换期间网络会短暂中断，是否继续？',
    connectConfirm: '连接后 Mesh 将自动关闭，当前节点会暂时离线，是否继续？',
    disableConfirm: '关闭后将返回路由器模式，Mesh 不会自动开启，是否继续？',
    operationFailed: '操作失败，请检查上级 Wi-Fi 密码后重试。',
    signalGood: '良好',
    signalMedium: '一般',
    signalWeak: '较弱',
    securedNetwork: '加密网络',
  },
  'en-US': {
    workMode: 'Working mode',
    routerDesc: 'Connect to the internet through the WAN port.',
    bridgeDesc: 'Connect to the uplink network through Ethernet.',
    repeaterDesc: 'Connect to another Wi-Fi network to extend coverage.',
    uplinkWifi: 'Uplink Wi-Fi',
    connected: 'Connected',
    networkName: 'Network name',
    changeUplink: 'Change uplink Wi-Fi',
    disableRepeater: 'Disable wireless repeater',
    selectUplink: 'Select uplink Wi-Fi',
    selectUplinkHint: 'Select the uplink Wi-Fi to connect to',
    rescan: 'Rescan',
    hiddenNetwork: 'Hidden network',
    noNetworks: 'No Wi-Fi networks found. Please rescan.',
    wifiPassword: 'Wi-Fi password',
    passwordPlaceholder: 'Enter an 8–64 character password',
    connectionWarning: 'The network will be interrupted briefly. Mesh will be disabled after a successful connection; saved nodes will not be deleted.',
    detachForScan: 'Scanning requires disconnecting the current wireless repeater first. The network will be interrupted briefly. Continue?',
    detaching: 'Disconnecting the current repeater, this may take 1–2 minutes…',
    meshWillPause: 'Mesh will be disabled after the connection succeeds.',
    cancel: 'Cancel',
    connect: 'Connect',
    switchNetwork: 'Switch to this network',
    connecting: 'Connecting to uplink Wi-Fi…',
    switching: 'Switching working mode…',
    changeConfirm: 'The repeater will disconnect and the network will be interrupted briefly. Continue?',
    connectConfirm: 'Mesh will be disabled and its nodes will temporarily go offline. Continue?',
    disableConfirm: 'The device will return to router mode and Mesh will remain disabled. Continue?',
    operationFailed: 'Operation failed. Check the uplink Wi-Fi password and try again.',
    signalGood: 'Good',
    signalMedium: 'Fair',
    signalWeak: 'Weak',
    securedNetwork: 'Secured network',
  },
};

export default {
  data() {
    return {
      RouterMode,
      mode: RouterMode.router,
      currentMode: RouterMode.router,
      currentAp: {},
      showRepeaterConfig: false,
      detaching: false,
      scanLoading: false,
      scanFailed: false,
      scanGeneration: 0,
      scanTimer: null,
      scanReject: null,
      accessPoints: [],
      selectedAp: null,
      apForm: { password: '' },
      apRules: {
        password: [
          { rule: value => value, message: this.$t('trans0232') },
          { rule: value => isValidPassword(value, 8, 64), message: this.$t('trans1220').replace('%s', 8) },
          { rule: value => value.trim() === value, message: this.$t('trans1226') },
        ],
      },
    };
  },
  computed: {
    modes() {
      return [
        {
          text: this.$t('trans0541'),
          value: RouterMode.router,
          description: this.text('routerDesc'),
        },
        {
          text: this.$t('trans1131'),
          value: RouterMode.bridge,
          description: this.text('bridgeDesc'),
        },
        {
          text: this.$t('trans1130'),
          value: RouterMode.wirelessBridge,
          description: this.isCurrentRepeater
            ? `${this.text('connected')} ${this.currentAp.ssid || '-'} · ${this.formatBand(this.currentAp.band)}`
            : this.text('repeaterDesc'),
        },
      ];
    },
    isWirelessBridge() {
      return this.mode === RouterMode.wirelessBridge;
    },
    isCurrentRepeater() {
      return this.currentMode === RouterMode.wirelessBridge;
    },
    requiresPassword() {
      if (!this.selectedAp) return false;
      const security = String(this.selectedAp.security || '').toLowerCase();
      return security !== EncryptMethod.open;
    },
    canConnect() {
      if (!this.selectedAp) return false;
      if (!this.requiresPassword) return true;
      const { password } = this.apForm;
      return isValidPassword(password, 8, 64) && password.trim() === password;
    },
    currentModeLabel() {
      const option = this.modes.find(item => item.value === this.currentMode);
      return option ? option.text : this.currentMode;
    },
  },
  mounted() {
    this.getMode();
  },
  beforeDestroy() {
    this.cancelPendingScan();
  },
  methods: {
    text(key) {
      const locale = COPY[this.$i18n.locale] ? this.$i18n.locale : 'en-US';
      return COPY[locale][key];
    },
    getMode() {
      this.$loading.open();
      return this.$http.getMeshMode()
        .then((res) => {
          const result = res.data.result || {};
          this.mode = result.mode || RouterMode.router;
          this.currentMode = this.mode;
          this.currentAp = {
            ...(result.apclient || {}),
            rssi: result.rssi !== undefined ? result.rssi : (result.apclient || {}).rssi,
          };
          this.$store.commit('setMode', this.currentMode);
          // 上次中继切换失败（后台 enable 失败自动回滚）由此透出：
          // 弹回登录页不代表切换成功，必须在进入页面时把真实结果告知用户
          if (result.repeater_error && result.repeater_error.code) {
            const detail = `${this.text('operationFailed')} [${result.repeater_error.code}]`;
            this.$toast(detail, 4000, 'error');
          }
        })
        .finally(() => this.$loading.close());
    },
    openRepeaterConfig() {
      // 中继在线时 vendor 禁止扫描（站点扫描会打断关联，mesh.apclient.scan
      // 会被后端显式拒绝），必须先退出中继再扫描
      if (this.isCurrentRepeater) {
        this.$dialog.confirm({
          okText: this.$t('trans0024'),
          cancelText: this.$t('trans0025'),
          message: this.text('detachForScan'),
          callback: { ok: () => this.detachThenScan() },
        });
        return;
      }
      this.mode = RouterMode.wirelessBridge;
      this.showRepeaterConfig = true;
      this.selectedAp = null;
      this.apForm.password = '';
      this.scanNetworks();
    },
    cancelRepeaterConfig() {
      this.cancelPendingScan();
      this.detaching = false;
      this.showRepeaterConfig = false;
      this.mode = this.currentMode;
      this.selectedAp = null;
      this.apForm.password = '';
    },
    scanNetworks() {
      if (this.scanLoading || this.detaching) return;
      // 中继在线（含 detach 失败重试）：先退中继再扫描
      if (this.isCurrentRepeater) {
        this.detachThenScan();
        return;
      }
      this.cancelPendingScan();
      this.scanGeneration += 1;
      const generation = this.scanGeneration;
      this.scanLoading = true;
      this.scanFailed = false;
      this.accessPoints = [];
      this.$http.startMeshApclientScan()
        .then(() => {
          if (generation !== this.scanGeneration) {
            throw new Error('scan-cancelled');
          }
          return this.waitForScan(15000, generation);
        })
        .then(() => this.readScanResults(0, generation))
        .catch(() => {
          if (generation !== this.scanGeneration) return;
          this.scanFailed = true;
          this.scanLoading = false;
        });
    },
    // 退出中继后再扫描（vendor 约束：事务未关闭时 scan/enable 均被拒绝）。
    // detach 由后端 nohup 后台回滚（实测 40–90s），期间 WiFi/防火墙重启会
    // 造成链路闪断——轮询单次失败不视为成功也不终止，静默继续，直到
    // work_mode 离开 wireless_bridge；120 次 × 2s = 240s 总窗口。
    detachThenScan() {
      this.cancelPendingScan();
      this.scanGeneration += 1;
      const generation = this.scanGeneration;
      this.detaching = true;
      this.scanFailed = false;
      this.scanLoading = false;
      this.accessPoints = [];
      this.showRepeaterConfig = true;
      this.selectedAp = null;
      this.apForm.password = '';
      this.$http.updateMeshMode({ mode: RouterMode.router, mesh_enabled: false })
        .then(() => this.waitForDetached(generation, 0))
        .then(() => {
          if (generation !== this.scanGeneration) return;
          this.detaching = false;
          // 本地同步为 router，避免 isCurrentRepeater 仍为 true 导致
          // Rescan 再次触发 detach
          this.currentMode = RouterMode.router;
          this.$store.commit('setMode', this.currentMode);
          this.scanNetworks();
        })
        .catch(() => {
          if (generation !== this.scanGeneration) return;
          this.detaching = false;
          this.scanFailed = true;
        });
    },
    waitForDetached(generation, attempt) {
      // isReconnect+hideToast：回滚期间链路闪断是预期现象，必须静默继续轮询；
      // 否则全局 exHandler 会把单次失败当成设备失联跳转 /unconnect（历史事故）
      return this.$http.getMeshMode(undefined, { isReconnect: true, hideToast: true })
        .catch(() => null)
        .then((res) => {
          if (generation !== this.scanGeneration) {
            throw new Error('scan-cancelled');
          }
          const result = (res && res.data && res.data.result) || {};
          // work_mode 先于回滚翻转为 router（实测 ~3s），但回滚（wifi/防火墙
          // 重启）持续 40–90s；期间发起扫描请求会挂起 30s 超时（真机事故：
          // "Failed to scan"）。必须等 repeater_status 收敛：enabled=false、
          // 事务关闭、phase 归于 disabled/空，才能开始扫描。
          const rs = result.repeater_status;
          if (!rs) {
            // 老后端/无 wisp 状态时没有 repeater_status，退回仅判 mode
            if (result.mode === RouterMode.router) return undefined;
          } else {
            const phase = String(rs.phase || '');
            const settled = result.mode === RouterMode.router
              && rs.enabled === false
              && rs.transaction_open === false
              && (phase === '' || phase === 'disabled');
            if (settled) return undefined;
          }
          if (attempt >= 120) throw new Error('detach-timeout');
          return this.waitForScan(2000, generation)
            .then(() => this.waitForDetached(generation, attempt + 1));
        });
    },
    waitForScan(delay, generation) {
      return new Promise((resolve, reject) => {
        this.scanReject = reject;
        this.scanTimer = setTimeout(() => {
          this.scanTimer = null;
          this.scanReject = null;
          if (generation !== this.scanGeneration) {
            reject(new Error('scan-cancelled'));
            return;
          }
          resolve();
        }, delay);
      });
    },
    cancelPendingScan() {
      this.scanGeneration += 1;
      if (this.scanTimer) {
        clearTimeout(this.scanTimer);
        this.scanTimer = null;
      }
      if (this.scanReject) {
        this.scanReject(new Error('scan-cancelled'));
        this.scanReject = null;
      }
      this.scanLoading = false;
    },
    readScanResults(attempt, generation) {
      return this.$http.getMeshApclientScanList()
        .then((res) => {
          if (generation !== this.scanGeneration) return undefined;
          const result = Array.isArray(res.data.result) ? res.data.result : [];
          if (!result.length && attempt < 2) {
            return this.waitForScan(5000, generation)
              .then(() => this.readScanResults(attempt + 1, generation));
          }
          this.accessPoints = this.normalizeAccessPoints(result);
          this.scanLoading = false;
          return undefined;
        });
    },
    normalizeAccessPoints(items) {
      const seen = {};
      return items
        .filter(item => item && item.bssid && String(item.ssid || '').trim())
        .filter((item) => {
          const key = `${String(item.bssid).toLowerCase()}-${item.band}`;
          if (seen[key]) return false;
          seen[key] = true;
          return true;
        })
        .sort((a, b) => Number(b.rssi || -100) - Number(a.rssi || -100));
    },
    selectAccessPoint(ap) {
      this.selectedAp = ap;
      this.apForm.password = '';
    },
    isSecured(ap) {
      return String(ap.security || '').toLowerCase() !== EncryptMethod.open;
    },
    confirmRepeaterConnection() {
      if (!this.selectedAp) return;
      if (this.requiresPassword && (!this.$refs.apForm || !this.$refs.apForm.validate())) return;
      this.$dialog.confirm({
        okText: this.$t('trans0024'),
        cancelText: this.$t('trans0025'),
        message: this.text('connectConfirm'),
        callback: { ok: () => this.connectRepeater() },
      });
    },
    connectRepeater() {
      const apclient = { ...this.selectedAp, password: this.requiresPassword ? this.apForm.password : '' };
      this.submitMode({ mode: RouterMode.wirelessBridge, mesh_enabled: false, apclient });
    },
    confirmDisableRepeater() {
      this.$dialog.confirm({
        okText: this.$t('trans0024'),
        cancelText: this.$t('trans0025'),
        message: this.text('disableConfirm'),
        callback: { ok: () => this.submitMode({ mode: RouterMode.router, mesh_enabled: false }) },
      });
    },
    confirmRegularMode() {
      if (this.mode === this.currentMode) return;
      this.$dialog.confirm({
        okText: this.$t('trans0024'),
        cancelText: this.$t('trans0025'),
        message: this.isCurrentRepeater ? this.text('changeConfirm') : this.$t('trans0229'),
        callback: {
          ok: () => this.submitMode({
            mode: this.mode,
            mesh_enabled: this.mode === RouterMode.router,
          }),
        },
      });
    },
    submitMode(params) {
      // 全屏加载页：模式切换期间（含 $reconnect 探测）持续展示动画+文案
      this.$loading.open({ title: this.text('switching') });
      this.$http.updateMeshMode(params)
        .then((res) => {
          this.showRepeaterConfig = false;
          const isOfflinePreview = process.env.VUE_APP_OFFLINE_PREVIEW === '1' &&
            res.headers['x-mercku-offline-preview'] === '1';
          if (isOfflinePreview) {
            this.$store.state.changeMode = false;
            this.$loading.close();
            return this.getMode().then(() => {
              this.$toast(this.$t('trans0040'), 2000, 'success');
            });
          }
          this.$store.state.changeMode = true;
          this.$reconnect({
            timeout: Math.ceil(this.$store.getters.behavior.reconnectProbeTimeoutMs / 1000) || 600,
            delayMs: this.$store.getters.behavior.modeSwitchProbeStartDelayMs || 0,
            onsuccess: () => {
              this.$loading.close();
              this.$router.push({ path: '/login' });
            },
            ontimeout: () => {
              this.$loading.close();
              this.$router.push({ path: '/unconnect' });
            },
          });
          return undefined;
        })
        .catch(() => {
          this.$store.state.changeMode = false;
          this.$loading.close();
          this.$toast(this.text('operationFailed'), 3000, 'error');
          this.getMode();
        });
    },
    formatBand(band) {
      return String(band || '-').replace('2.4G', '2.4 GHz').replace('5G', '5 GHz');
    },
    formatSecurity(security) {
      const value = String(security || '').toLowerCase();
      return value === EncryptMethod.open ? 'Open' : value.toUpperCase();
    },
    formatRssi(rssi) {
      return rssi === undefined || rssi === null || rssi === '' ? '-' : `${rssi} dBm`;
    },
    signalLevel(rssi) {
      if (Number(rssi) > -60) return 'good';
      if (Number(rssi) > -75) return 'medium';
      return 'weak';
    },
    signalQuality(rssi) {
      const level = this.signalLevel(rssi);
      if (level === 'good') return this.text('signalGood');
      if (level === 'medium') return this.text('signalMedium');
      return this.text('signalWeak');
    },
  },
};
</script>

<style lang="scss" scoped>
.mode-grid { display: grid; gap: 16px; }
.mode-grid.connected {
  grid-template-columns: minmax(320px, 360px) minmax(320px, 360px);
  align-items: stretch;
}
.card { padding: 22px; }
.card-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 18px;
  font-size: 16px;
}
.status-pill {
  padding: 4px 10px;
  border-radius: 12px;
  color: var(--text_default-color);
  background: var(--common_sub_card-bgc);
  font-size: 12px;
  font-weight: normal;
}
.status-pill.online { color: #00a94f; background: rgba(0, 208, 97, .12); }
.mode-tip,
.switch-warning {
  margin: 14px 0 0 25px;
  color: #ff8a00;
  font-size: 12px;
  line-height: 1.6;
}
.info-list > div {
  display: flex;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid var(--common_sub_card-bgc);
}
.info-list span { color: var(--text_subtitle-color); }
.uplink-signal.good { color: #00a94f; }
.uplink-signal.medium { color: #ff8a00; }
.uplink-signal.weak { color: #d6001c; }
.repeater-actions { display: flex; justify-content: center; gap: 12px; }
.btn.danger { color: #d6001c; border-color: #d6001c; background: transparent; }
.text-button { border: 0; color: var(--primary-color); background: transparent; cursor: pointer; }
.text-button:disabled { opacity: .45; cursor: not-allowed; }
.modal-title-row,
.scan-toolbar,
.network-meta,
.modal-actions {
  display: flex;
  align-items: center;
}
.modal-title-row,
.scan-toolbar { justify-content: space-between; }
.modal-close {
  width: 30px;
  height: 30px;
  padding: 0;
  border: 0;
  border-radius: 50%;
  color: var(--text_subtitle-color);
  background: var(--common_sub_card-bgc);
  cursor: pointer;
  font-size: 18px;
}
.scan-toolbar {
  margin-bottom: 18px;
  color: var(--text_subtitle-color);
  font-size: 13px;
}
.scan-state {
  min-height: 160px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: 100%;
  border: 1px solid var(--common_sub_card-bgc);
  border-radius: 5px;
  color: var(--text_subtitle-color);
  background: transparent;
}
.scan-state.failed { cursor: pointer; }
.network-list {
  max-height: 300px;
  overflow: auto;
  border: 1px solid var(--common_sub_card-bgc);
  border-radius: 5px;
}
.network-row {
  width: 100%;
  min-height: 62px;
  padding: 10px 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 0;
  border-bottom: 1px solid var(--common_sub_card-bgc);
  color: var(--text_default-color);
  background: transparent;
  cursor: pointer;
  text-align: left;
}
.network-row:last-child { border-bottom: 0; }
.network-row:hover, .network-row.selected { background: var(--select_item_hover-bgc); }
.network-row.selected { box-shadow: inset 3px 0 var(--primary-color); }
.network-name { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.network-meta { gap: 10px; }
.network-meta small {
  padding: 3px 8px;
  border-radius: 3px;
  color: var(--text_subtitle-color);
  background: var(--common_sub_card-bgc);
}
.network-lock { width: 11px; height: 14px; object-fit: contain; }
.signal-bars {
  display: flex;
  height: 15px;
  align-items: flex-end;
  gap: 2px;
  color: var(--text_subtitle-color);
}
.signal-bars i {
  width: 3px;
  border-radius: 2px;
  background: currentColor;
}
.signal-bars i:nth-child(1) { height: 4px; }
.signal-bars i:nth-child(2) { height: 7px; }
.signal-bars i:nth-child(3) { height: 10px; }
.signal-bars i:nth-child(4) { height: 14px; }
.signal-bars.medium i:nth-child(4),
.signal-bars.weak i:nth-child(n+3) { opacity: .2; }
.ap-form { margin-top: 18px; }
.switch-warning { margin-left: 0; }
.modal-actions { justify-content: center; gap: 12px; width: 100%; }
.modal-actions .btn { min-width: 150px; }
@media screen and (max-width: 768px) {
  .mode-grid.connected { grid-template-columns: 1fr; }
  .card { padding: 18px 14px; }
  .repeater-actions,
  .modal-actions { flex-direction: column; }
  .repeater-actions .btn,
  .modal-actions .btn { width: 100%; }
}
</style>

<style lang="scss">
.repeater-modal {
  .modal-content { width: 680px; max-width: calc(100vw - 40px); }
  .modal-footer { padding-top: 22px; padding-bottom: 0; }
}
</style>
