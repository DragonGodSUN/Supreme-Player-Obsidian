const { Plugin } = require("obsidian");
const DataStore = require('./data-store');
const DailyNoteParser = require('./daily-note-parser');
const Core = require('./core');
const UI = require('./ui');
const Wish = require('./wish');
const Shop = require('./shop');
const Inventory = require('./inventory');
const SupremePlayerSettingTab = require('./settings');

module.exports = class SupremePlayer extends Plugin {
  constructor(app, manifest) {
    super(app, manifest);
    this.dataStore = null;
    this.parser = null;
    this.statusBar = null;
    this.lockState = {
      unlocked: false,
      unlockTime: null,
      clickCount: 0,
      autoLockTimer: null,
      lockConfirmCount: 0,
      lastLockAttempt: null
    };
  }

  async onload() {
    this.dataStore = new DataStore(this.app);
    this.parser = new DailyNoteParser(this.dataStore);

    try {
      await this.dataStore.load();
    } catch (e) {
      console.error('Failed to load data store:', e);
    }

    this.addCommand({
      id: 'process-daily-note',
      name: '每日打卡',
      callback: () => UI.showCheckInPanel(this).catch(e => console.error('CheckIn error:', e))
    });

    this.addCommand({
      id: 'show-stats',
      name: '查看当前状态',
      callback: () => UI.showStats(this)
    });

    this.addCommand({
      id: 'reset-daily',
      name: '同步账户信息',
      callback: () => Core.syncAccountInfo(this)
    });

    this.addCommand({
      id: 'make-wish',
      name: '许下愿望',
      callback: () => Wish.showWishModal(this)
    });

    this.addCommand({
      id: 'show-wish-pool',
      name: '查看许愿池',
      callback: () => Wish.showWishPool(this)
    });

    this.addCommand({
      id: 'open-shop',
      name: '打开商城',
      callback: () => Shop.showShop(this)
    });

    this.addCommand({
      id: 'open-inventory',
      name: '查看背包',
      callback: () => Inventory.showInventory(this)
    });

    this.addSettingTab(new SupremePlayerSettingTab(this.app, this));

    this.statusBar = this.addStatusBarItem();
    Core.updateStatusBar(this);

    console.log('Supreme Player loaded!');
  }

  showStats() {
    UI.showStats(this);
  }

  showLevelSystem() {
    UI.showLevelSystem(this);
  }

  showWishModal() {
    Wish.showWishModal(this);
  }

  showWishPool() {
    Wish.showWishPool(this);
  }

  showShop() {
    Shop.showShop(this);
  }

  showInventory() {
    Inventory.showInventory(this);
  }

  updateStatusBar() {
    Core.updateStatusBar(this);
  }

  onunload() {
    if (this.lockState.autoLockTimer) {
      clearTimeout(this.lockState.autoLockTimer);
    }
  }
};
