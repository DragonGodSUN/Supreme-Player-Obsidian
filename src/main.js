const { Plugin } = require("obsidian");
const DataStore = require("./data-store");
const DailyNoteParser = require("./daily-note-parser");
const Core = require("./core");
const UI = require("./ui");
const Wish = require("./wish");
const Shop = require("./shop");
const Inventory = require("./inventory");
const SupremePlayerSettingTab = require("./settings");
const { createI18n } = require("./i18n");

module.exports = class SupremePlayer extends Plugin {
  constructor(app, manifest) {
    super(app, manifest);
    this.dataStore = null;
    this.parser = null;
    this.statusBar = null;
    this.i18n = null;
    this.lockState = {
      unlocked: false,
      unlockTime: null,
      clickCount: 0,
      autoLockTimer: null,
      lockConfirmCount: 0,
      lastLockAttempt: null,
    };
  }

  async onload() {
    this.dataStore = new DataStore(this.app);
    this.i18n = createI18n(this.app, () => this.dataStore?.config?.language || 'auto');
    this.t = (key, variables) => this.i18n.t(key, variables);

    this.parser = new DailyNoteParser(this.dataStore);

    try {
      await this.dataStore.load();
    } catch (error) {
      console.error("Failed to load data store:", error);
    }

    this.addCommand({
      id: "process-daily-note",
      name: this.t("command.processDailyNote"),
      callback: () => UI.showCheckInPanel(this).catch(error => console.error("Check-in error:", error)),
    });

    this.addCommand({
      id: "show-stats",
      name: this.t("command.showStats"),
      callback: () => UI.showStats(this),
    });

    this.addCommand({
      id: "reset-daily",
      name: this.t("command.syncAccountInfo"),
      callback: () => Core.syncAccountInfo(this),
    });

    this.addCommand({
      id: "make-wish",
      name: this.t("command.makeWish"),
      callback: () => Wish.showWishModal(this),
    });

    this.addCommand({
      id: "show-wish-pool",
      name: this.t("command.showWishPool"),
      callback: () => Wish.showWishPool(this),
    });

    this.addCommand({
      id: "open-shop",
      name: this.t("command.openShop"),
      callback: () => Shop.showShop(this),
    });

    this.addCommand({
      id: "open-inventory",
      name: this.t("command.openInventory"),
      callback: () => Inventory.showInventory(this),
    });

    this.addSettingTab(new SupremePlayerSettingTab(this.app, this));

    this.statusBar = this.addStatusBarItem();
    Core.updateStatusBar(this);

    console.log("Supreme Player loaded.");
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
    if (this.statusHoverTimer) {
      clearTimeout(this.statusHoverTimer);
      this.statusHoverTimer = null;
    }
    if (this.statusHoverEl) {
      this.statusHoverEl.remove();
      this.statusHoverEl = null;
    }
  }
};
