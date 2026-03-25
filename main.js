var __getOwnPropNames = Object.getOwnPropertyNames;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};

// src/utils.js
var require_utils = __commonJS({
  "src/utils.js"(exports2, module2) {
    var { Notice } = require("obsidian");
    var DATA_FILE = "supreme-player-data.json";
    var SHOP_CONFIG_FILE = ".obsidian/plugins/supreme-player/shop-config.json";
    var CONFIG_FILE = ".obsidian/plugins/supreme-player/config.json";
    function showNotice(message) {
      new Notice(message);
    }
    function createElement(tag, styles, innerHTML) {
      const el = document.createElement(tag);
      if (styles)
        el.style.cssText = styles;
      if (innerHTML)
        el.innerHTML = innerHTML;
      return el;
    }
    function createButton(text, className, onClick) {
      const btn = document.createElement("button");
      btn.textContent = text;
      if (className)
        btn.className = className;
      if (onClick)
        btn.onclick = onClick;
      return btn;
    }
    function createFlexContainer(gap = "10px") {
      const container = document.createElement("div");
      container.style.display = "flex";
      container.style.gap = gap;
      return container;
    }
    function renderEffectParams(type, effectParams) {
      effectParams.innerHTML = "";
      switch (type) {
        case "add_wish_stars":
          effectParams.innerHTML = `<div style="margin-bottom: 5px;">\u83B7\u5F97\u613F\u661F\u6570\u91CF\uFF1A</div><input type="number" id="effect-value" value="1" min="1" style="width: 100%;">`;
          break;
        case "add_level":
          effectParams.innerHTML = `<div style="margin-bottom: 5px;">\u83B7\u5F97\u7B49\u7EA7\u6570\u91CF\uFF1A</div><input type="number" id="effect-value" value="1" min="1" style="width: 100%;">`;
          break;
        case "buff":
          effectParams.innerHTML = `
        <div style="margin-bottom: 5px;">Buff\u540D\u79F0\uFF1A</div>
        <input type="text" id="buff-name" placeholder="\u4F8B\u5982\uFF1A\u597D\u8FD0\u6C14" style="width: 100%; margin-bottom: 10px;">
        <div style="margin-bottom: 5px;">Buff\u56FE\u6807\uFF1A</div>
        <input type="text" id="buff-icon" placeholder="\u4F8B\u5982\uFF1A\u{1F340}" style="width: 100%; margin-bottom: 10px;">
        <div style="margin-bottom: 5px;">\u6548\u679C\u8BF4\u660E\uFF1A</div>
        <input type="text" id="buff-desc" placeholder="\u4F8B\u5982\uFF1A\u4E16\u754C\u7EBF\u5DF2\u4E3A\u4F60\u504F\u79FB" style="width: 100%; margin-bottom: 10px;">
        <div style="margin-bottom: 5px;">\u6301\u7EED\u65F6\u95F4\uFF08\u5C0F\u65F6\uFF09\uFF1A</div>
        <input type="number" id="buff-duration" value="24" min="1" style="width: 100%;">
      `;
          break;
        case "random_wish_stars":
          effectParams.innerHTML = `
        <div style="display: flex; gap: 10px;">
          <div style="flex: 1;"><div style="margin-bottom: 5px;">\u6700\u5C0F\u6570\u91CF\uFF1A</div><input type="number" id="effect-min" value="1" min="1" style="width: 100%;"></div>
          <div style="flex: 1;"><div style="margin-bottom: 5px;">\u6700\u5927\u6570\u91CF\uFF1A</div><input type="number" id="effect-max" value="5" min="1" style="width: 100%;"></div>
        </div>
      `;
          break;
        case "add_points":
          effectParams.innerHTML = `<div style="margin-bottom: 5px;">\u83B7\u5F97\u79EF\u5206\u6570\u91CF\uFF1A</div><input type="number" id="effect-value" value="100" min="1" style="width: 100%;">`;
          break;
      }
    }
    function buildEffectFromForm(category, effectType) {
      var _a, _b, _c, _d, _e, _f, _g;
      if (category !== "system")
        return null;
      switch (effectType) {
        case "add_wish_stars":
        case "add_level":
        case "add_points":
          return { type: effectType, value: parseInt((_a = document.getElementById("effect-value")) == null ? void 0 : _a.value) || 1 };
        case "buff": {
          const buffName = (_b = document.getElementById("buff-name")) == null ? void 0 : _b.value.trim();
          if (!buffName) {
            showNotice("\u274C \u8BF7\u8F93\u5165Buff\u540D\u79F0");
            return null;
          }
          return {
            type: "buff",
            buffName,
            buffIcon: ((_c = document.getElementById("buff-icon")) == null ? void 0 : _c.value.trim()) || "\u{1F52E}",
            buffDesc: ((_d = document.getElementById("buff-desc")) == null ? void 0 : _d.value.trim()) || "",
            duration: parseInt((_e = document.getElementById("buff-duration")) == null ? void 0 : _e.value) || 24
          };
        }
        case "random_wish_stars":
          return {
            type: effectType,
            min: parseInt((_f = document.getElementById("effect-min")) == null ? void 0 : _f.value) || 1,
            max: parseInt((_g = document.getElementById("effect-max")) == null ? void 0 : _g.value) || 5
          };
        default:
          return null;
      }
    }
    module2.exports = {
      DATA_FILE,
      SHOP_CONFIG_FILE,
      CONFIG_FILE,
      showNotice,
      createElement,
      createButton,
      createFlexContainer,
      renderEffectParams,
      buildEffectFromForm
    };
  }
});

// src/data-store.js
var require_data_store = __commonJS({
  "src/data-store.js"(exports2, module2) {
    var { CONFIG_FILE, SHOP_CONFIG_FILE } = require_utils();
    var DataStore2 = class {
      constructor(app) {
        this.app = app;
        this.stats = null;
        this.shopConfig = null;
        this.config = null;
      }
      getDailyNotesSettings() {
        var _a, _b, _c, _d, _e, _f;
        const dailyNotesPlugin = (_b = (_a = this.app.internalPlugins) == null ? void 0 : _a.plugins) == null ? void 0 : _b["daily-notes"];
        if ((_c = dailyNotesPlugin == null ? void 0 : dailyNotesPlugin.instance) == null ? void 0 : _c.options) {
          return dailyNotesPlugin.instance.options;
        }
        const periodicNotesPlugin = (_e = (_d = this.app.plugins) == null ? void 0 : _d.plugins) == null ? void 0 : _e["periodic-notes"];
        if ((_f = periodicNotesPlugin == null ? void 0 : periodicNotesPlugin.settings) == null ? void 0 : _f.daily) {
          return periodicNotesPlugin.settings.daily;
        }
        return null;
      }
      autoDetectTemplatePath() {
        const dailyNotesSettings = this.getDailyNotesSettings();
        if (dailyNotesSettings) {
          const folder = dailyNotesSettings.folder || "";
          const template = dailyNotesSettings.template || "";
          if (template)
            return template;
          if (folder)
            return `${folder}/Template.md`;
        }
        return "Temps/DailyTracker.md";
      }
      autoDetectDataPath() {
        const dailyNotesSettings = this.getDailyNotesSettings();
        if (dailyNotesSettings) {
          const folder = dailyNotesSettings.folder || "";
          if (folder)
            return `${folder}/supreme-player-data.json`;
        }
        return "supreme-player-data.json";
      }
      async loadConfig() {
        try {
          const adapter = this.app.vault.adapter;
          if (await adapter.exists(CONFIG_FILE)) {
            const content = await adapter.read(CONFIG_FILE);
            return JSON.parse(content);
          }
        } catch (e) {
          console.error("Failed to load config:", e);
        }
        return this.getDefaultConfig();
      }
      getDefaultConfig() {
        const detectedDataPath = this.autoDetectDataPath();
        const detectedTemplatePath = this.autoDetectTemplatePath();
        return {
          dataFilePath: detectedDataPath,
          templatePath: detectedTemplatePath,
          levels: [
            { minLevel: 0, maxLevel: 5, title: "\u661F\u8BED\u8005", ability: "\u626D\u66F2\u73B0\u5B9E", phase: "\u672F\u58EB", color: "#9966ff", abilityIcon: "\u{1F31F}", phaseIcon: "\u{1FA84}" },
            { minLevel: 6, maxLevel: 10, title: "\u7EC7\u68A6\u5E08", ability: "\u8986\u5199\u771F\u5B9E", phase: "\u4EBA\u795E", color: "#00aaff", abilityIcon: "\u{1F52E}", phaseIcon: "\u{1FAE7}" },
            { minLevel: 11, maxLevel: 15, title: "\u521B\u9020\u4E3B", ability: "\u9020\u7269\u521B\u751F", phase: "\u4F2A\u795E", color: "#00ffaa", abilityIcon: "\u269B\uFE0F", phaseIcon: "\u{1F451}" },
            { minLevel: 16, maxLevel: 20, title: "\u638C\u754C\u8005", ability: "\u638C\u63A7\u4E16\u754C", phase: "\u771F\u795E", color: "#ffaa00", abilityIcon: "\u{1F30F}", phaseIcon: "\u{1F9FF}" },
            { minLevel: 21, maxLevel: 25, title: "\u5143\u661F\u795E", ability: "\u6307\u5C16\u5BF0\u5B87", phase: "\u661F\u795E", color: "#ff6666", abilityIcon: "\u{1F30C}", phaseIcon: "\u{1F47E}" },
            { minLevel: 26, maxLevel: 999, title: "\u65E0\u6781\u5C0A", ability: "\u65E0\u7A77\u754C\u9650", phase: "\u25A0\u25A0\u25A0\u25A0", color: "#ffd700", abilityIcon: "\u267E\uFE0F", phaseIcon: "\u2182" }
          ],
          currencies: [
            { id: "wishStars", name: "\u613F\u661F", icon: "\u2B50", description: "\u7528\u4E8E\u8BB8\u613F\u548C\u6270\u52A8\u4E16\u754C\u7EBF", earnRate: 100, earnAmount: 1, color: "#ffd700", editable: true },
            { id: "rareItemCards", name: "\u7A00\u6709\u9053\u5177\u5361", icon: "\u{1F3B4}", description: "\u7528\u4E8E\u8D2D\u4E70\u7A00\u6709\u54C1\u8D28\u5546\u54C1", earnRate: 500, earnAmount: 1, color: "#9966ff", editable: true },
            { id: "legendaryItemCards", name: "\u4F20\u5947\u9053\u5177\u5361", icon: "\u{1F320}", description: "\u7528\u4E8E\u8D2D\u4E70\u4F20\u5947\u54C1\u8D28\u5546\u54C1", earnRate: 2e3, earnAmount: 1, color: "#ffaa00", editable: true }
          ],
          customCurrencies: [],
          dailyTasks: {
            mainTasks: { count: 3, pointsPerTask: 100 },
            habits: { items: [
              { name: "\u65E9\u8D77", points: 50 },
              { name: "\u8FD0\u52A8", points: 50 },
              { name: "\u9605\u8BFB", points: 50 }
            ] },
            extraTasks: { count: 2, pointsPerTask: 50 },
            pomodoro: { count: 6, pointsPerPomodoro: 50 }
          },
          perfectCheckInReward: {
            enabled: true,
            rewardType: "exclusive",
            shopItemId: null,
            exclusiveItem: {
              name: "\u8D85\u7EA7\u5927\u94BB\u77F3",
              icon: "\u{1F48E}",
              description: "\u5B8C\u7F8E\u6253\u5361\u5956\u52B1\uFF0C\u4F7F\u7528\u540E\u968F\u673A\u83B7\u5F97\u613F\u661F\u548C\u8D85\u597D\u8FD0Buff",
              rarity: "legendary",
              category: "system",
              effect: { type: "super_diamond" }
            },
            blessingTitle: "\u592A\u68D2\u4E86\uFF01\u4ECA\u65E5\u4EFB\u52A1\u5168\u90E8\u5B8C\u6210\uFF01",
            blessingMessage: "\u6BCF\u4E00\u6B21\u5B8C\u7F8E\u6253\u5361\uFF0C\u90FD\u662F\u5BF9\u81EA\u5DF1\u6700\u597D\u7684\u6295\u8D44\uFF01"
          }
        };
      }
      async saveConfig() {
        if (!this.config)
          return;
        const adapter = this.app.vault.adapter;
        await adapter.write(CONFIG_FILE, JSON.stringify(this.config, null, 2));
      }
      getCurrencies() {
        if (!this.config)
          return [];
        return [...this.config.currencies, ...this.config.customCurrencies || []];
      }
      async searchDataFile() {
        const dataFileName = "supreme-player-data.json";
        const dailyNotesSettings = this.getDailyNotesSettings();
        if (dailyNotesSettings == null ? void 0 : dailyNotesSettings.folder) {
          const directPath = `${dailyNotesSettings.folder}/${dataFileName}`;
          if (await this.app.vault.adapter.exists(directPath)) {
            return directPath;
          }
        }
        const allFiles = this.app.vault.getFiles();
        for (const file of allFiles) {
          if (file.name === dataFileName || file.path.endsWith(dataFileName)) {
            return file.path;
          }
        }
        return null;
      }
      async load() {
        try {
          const adapter = this.app.vault.adapter;
          this.config = await this.loadConfig();
          let dataFile = this.config.dataFilePath;
          if (!dataFile) {
            const detected = this.autoDetectDataPath();
            if (await adapter.exists(detected)) {
              dataFile = detected;
            } else {
              const searched = await this.searchDataFile();
              if (searched)
                dataFile = searched;
            }
            if (dataFile) {
              this.config.dataFilePath = dataFile;
              await this.saveConfig();
            }
          }
          if (dataFile && await adapter.exists(dataFile)) {
            const content = await adapter.read(dataFile);
            this.stats = JSON.parse(content);
            this.initStatsDefaults();
            this.shopConfig = await this.loadShopConfig();
            return this.stats;
          }
        } catch (e) {
          console.error("Failed to load data:", e);
        }
        this.stats = this.getDefaultStats();
        this.shopConfig = await this.loadShopConfig();
        await this.save();
        return this.stats;
      }
      initStatsDefaults() {
        if (!this.stats)
          return;
        if (!this.stats.wishes)
          this.stats.wishes = [];
        if (!this.stats.inventory)
          this.stats.inventory = [];
        if (!this.stats.usedExternalItems)
          this.stats.usedExternalItems = [];
        if (this.stats.playerName === void 0)
          this.stats.playerName = "\u73A9\u5BB6";
        if (this.stats.todayPoints === void 0)
          this.stats.todayPoints = 0;
        const currencies = this.getCurrencies();
        for (const currency of currencies) {
          if (this.stats[currency.id] === void 0) {
            this.stats[currency.id] = 0;
          }
        }
      }
      async loadShopConfig() {
        try {
          const adapter = this.app.vault.adapter;
          if (await adapter.exists(SHOP_CONFIG_FILE)) {
            const content = await adapter.read(SHOP_CONFIG_FILE);
            const config = JSON.parse(content);
            if (!config.items || config.items.length === 0) {
              config.items = this.getDefaultShopItems();
              await this.saveShopConfig();
            }
            return config;
          } else {
            const defaultConfig = { items: this.getDefaultShopItems() };
            await adapter.write(SHOP_CONFIG_FILE, JSON.stringify(defaultConfig, null, 2));
            return defaultConfig;
          }
        } catch (e) {
          console.error("Failed to load shop config:", e);
          return { items: this.getDefaultShopItems() };
        }
      }
      async save() {
        var _a;
        if (!this.stats)
          return;
        this.stats.lastUpdated = (/* @__PURE__ */ new Date()).toISOString();
        const adapter = this.app.vault.adapter;
        const dataFile = ((_a = this.config) == null ? void 0 : _a.dataFilePath) || this.autoDetectDataPath();
        await adapter.write(dataFile, JSON.stringify(this.stats, null, 2));
      }
      getDefaultStats() {
        var _a;
        const stats = {
          playerName: "\u73A9\u5BB6",
          totalPoints: 0,
          currentPoints: 0,
          level: 0,
          todayPoints: 0,
          wishStars: 0,
          rareItemCards: 0,
          legendaryItemCards: 0,
          lastUpdated: (/* @__PURE__ */ new Date()).toISOString(),
          lastCheckInDate: null,
          wishes: [],
          inventory: [],
          usedExternalItems: [],
          buffs: [],
          completedWishes: 0
        };
        if ((_a = this.config) == null ? void 0 : _a.customCurrencies) {
          for (const currency of this.config.customCurrencies) {
            stats[currency.id] = 0;
          }
        }
        return stats;
      }
      getStats() {
        return this.stats || this.getDefaultStats();
      }
      async addBuff(buffId, name, icon, description, durationHours) {
        const stats = this.getStats();
        if (!stats.buffs)
          stats.buffs = [];
        const buff = {
          id: buffId,
          name,
          icon,
          description,
          durationHours,
          appliedAt: (/* @__PURE__ */ new Date()).toISOString(),
          expiresAt: new Date(Date.now() + durationHours * 60 * 60 * 1e3).toISOString()
        };
        stats.buffs.push(buff);
        await this.save();
        return { success: true, buff };
      }
      getActiveBuffs() {
        const stats = this.getStats();
        if (!stats.buffs)
          return [];
        const now = /* @__PURE__ */ new Date();
        return stats.buffs.filter((buff) => new Date(buff.expiresAt) > now);
      }
      async addPoints(points) {
        const stats = this.getStats();
        const oldTotal = stats.totalPoints;
        stats.totalPoints += points;
        stats.currentPoints += points;
        stats.todayPoints = (stats.todayPoints || 0) + points;
        const oldLevel = stats.level;
        const newLevel = Math.floor(stats.totalPoints / 5e3);
        const rewards = [];
        if (newLevel > oldLevel) {
          stats.level = newLevel;
          rewards.push("\u{1F389} \u7B49\u7EA7\u63D0\u5347\u5230 " + newLevel + "!");
        }
        const currencies = this.getCurrencies();
        for (const currency of currencies) {
          const oldAmount = Math.floor(oldTotal / currency.earnRate);
          const newAmount = Math.floor(stats.totalPoints / currency.earnRate);
          if (newAmount > oldAmount) {
            stats[currency.id] = (stats[currency.id] || 0) + (newAmount - oldAmount);
            rewards.push(currency.icon + " " + currency.name + " +" + (newAmount - oldAmount) + "!");
          }
        }
        await this.save();
        return {
          levelUp: newLevel > oldLevel,
          newLevel: stats.level,
          rewards
        };
      }
      async makeWish(name, description) {
        const stats = this.getStats();
        const wish = {
          id: Date.now().toString(),
          name,
          description: description || "",
          starCost: 0,
          progress: 0,
          createdAt: (/* @__PURE__ */ new Date()).toISOString(),
          lastBoost: (/* @__PURE__ */ new Date()).toISOString(),
          status: "active"
        };
        stats.wishes.push(wish);
        await this.save();
        return { success: true, wish, message: "\u2728 \u613F\u671B\u5DF2\u521B\u5EFA\uFF01\u6295\u5165\u613F\u661F\u6765\u6270\u52A8\u4E16\u754C\u7EBF\u5427\uFF5E" };
      }
      async boostWish(wishId, starCost) {
        const stats = this.getStats();
        if (stats.wishStars < starCost) {
          return { success: false, message: "\u274C \u613F\u661F\u4E0D\u8DB3\uFF01" };
        }
        const wish = stats.wishes.find((w) => w.id === wishId);
        if (!wish)
          return { success: false, message: "\u274C \u613F\u671B\u4E0D\u5B58\u5728\uFF01" };
        if (wish.status !== "active")
          return { success: false, message: "\u274C \u613F\u671B\u5DF2\u5B8C\u6210\u6216\u5DF2\u5931\u8D25\uFF0C\u65E0\u6CD5\u5F3A\u5316" };
        const hasLuckCharm = this.getActiveBuffs().some((b) => b.id === "luck-charm");
        let boostAmount = starCost * 10;
        if (hasLuckCharm) {
          boostAmount *= 2;
          stats.buffs = stats.buffs.filter((b) => b.id !== "luck-charm");
        }
        stats.wishStars -= starCost;
        wish.progress = Math.min(wish.progress + boostAmount, 100);
        wish.lastBoost = (/* @__PURE__ */ new Date()).toISOString();
        if (wish.progress >= 100) {
          const result = await this.completeWish(wishId);
          return { success: true, wish, message: result.message, completed: true, blessings: result.blessings, bonusPoints: result.bonusPoints };
        }
        await this.save();
        return { success: true, wish, message: "\u{1F30C} \u4E16\u754C\u7EBF\u6270\u52A8\uFF01\u8FDB\u5EA6 +" + boostAmount + "%", completed: false };
      }
      async completeWish(wishId) {
        const stats = this.getStats();
        const wishIndex = stats.wishes.findIndex((w) => w.id === wishId);
        if (wishIndex === -1)
          return { success: false, message: "\u274C \u613F\u671B\u4E0D\u5B58\u5728" };
        const wish = stats.wishes[wishIndex];
        if (wish.progress < 100)
          return { success: false, message: "\u274C \u8BB8\u613F\u6C60\u672A\u586B\u6EE1" };
        wish.status = "completed";
        stats.completedWishes = (stats.completedWishes || 0) + 1;
        stats.totalPoints += 500;
        stats.currentPoints += 500;
        const completedRecord = {
          id: Date.now().toString(),
          name: wish.name,
          description: wish.description,
          completedAt: (/* @__PURE__ */ new Date()).toISOString(),
          bonusPoints: 500
        };
        if (!stats.completedWishRecords)
          stats.completedWishRecords = [];
        stats.completedWishRecords.push(completedRecord);
        stats.wishes.splice(wishIndex, 1);
        await this.addBuff("luck-boost", "\u597D\u8FD0\u6C14", "\u{1F340}", "\u4E16\u754C\u7EBF\u5DF2\u4E3A\u4F60\u504F\u79FB\uFF0C\u7F8E\u597D\u7684\u4E8B\u7269\u6B63\u5728\u9760\u8FD1", 24);
        await this.save();
        const blessings = this.getRandomBlessings();
        return {
          success: true,
          message: "\u{1F31F} \u8BB8\u613F\u6C60\u5DF2\u6EE1\uFF01\u4E16\u754C\u7EBF\u6210\u529F\u6270\u52A8\uFF01",
          bonusPoints: 500,
          blessings
        };
      }
      getRandomBlessings() {
        const blessings = [
          "\u613F\u661F\u5149\u7167\u4EAE\u4F60\u524D\u884C\u7684\u9053\u8DEF\u3002",
          "\u4E16\u754C\u7EBF\u5DF2\u4E3A\u4F60\u504F\u79FB\uFF0C\u7F8E\u597D\u7684\u4E8B\u7269\u6B63\u5728\u9760\u8FD1\u3002",
          "\u547D\u8FD0\u7684\u9F7F\u8F6E\u5F00\u59CB\u8F6C\u52A8\uFF0C\u671F\u5F85\u5947\u8FF9\u7684\u53D1\u751F\u3002",
          "\u4F60\u7684\u613F\u671B\u5DF2\u88AB\u4E16\u754C\u542C\u89C1\uFF0C\u9759\u5F85\u82B1\u5F00\u3002",
          "\u613F\u597D\u8FD0\u4E0E\u4F60\u76F8\u4F34\uFF0C\u5FC3\u60F3\u4E8B\u6210\u3002"
        ];
        return blessings.sort(() => Math.random() - 0.5).slice(0, 3);
      }
      getLevelTitle(level) {
        var _a;
        if (!((_a = this.config) == null ? void 0 : _a.levels)) {
          return this.getFallbackLevelTitle(level);
        }
        for (const levelConfig of this.config.levels) {
          if (level >= levelConfig.minLevel && level <= levelConfig.maxLevel) {
            return {
              title: levelConfig.title,
              ability: levelConfig.ability,
              phase: levelConfig.phase,
              color: levelConfig.color || "#ffffff",
              abilityIcon: levelConfig.abilityIcon || "\u2694\uFE0F",
              phaseIcon: levelConfig.phaseIcon || "\u{1F451}"
            };
          }
        }
        const lastLevel = this.config.levels[this.config.levels.length - 1];
        return {
          title: lastLevel.title,
          ability: lastLevel.ability,
          phase: lastLevel.phase,
          color: lastLevel.color || "#ffffff",
          abilityIcon: lastLevel.abilityIcon || "\u2694\uFE0F",
          phaseIcon: lastLevel.phaseIcon || "\u{1F451}"
        };
      }
      getFallbackLevelTitle(level) {
        const levels = [
          { max: 5, title: "\u661F\u8BED\u8005", ability: "\u626D\u66F2\u73B0\u5B9E", phase: "\u672F\u58EB", color: "#9966ff" },
          { max: 10, title: "\u7EC7\u68A6\u5E08", ability: "\u8986\u5199\u771F\u5B9E", phase: "\u4EBA\u795E", color: "#00aaff" },
          { max: 15, title: "\u521B\u9020\u4E3B", ability: "\u9020\u7269\u521B\u751F", phase: "\u4F2A\u795E", color: "#00ffaa" },
          { max: 20, title: "\u638C\u754C\u8005", ability: "\u638C\u63A7\u4E16\u754C", phase: "\u771F\u795E", color: "#ffaa00" },
          { max: 25, title: "\u5143\u661F\u795E", ability: "\u6307\u5C16\u5BF0\u5B87", phase: "\u661F\u795E", color: "#ff6666" }
        ];
        for (const l of levels) {
          if (level <= l.max)
            return { ...l, abilityIcon: "\u2694\uFE0F", phaseIcon: "\u{1F451}" };
        }
        return { title: "\u65E0\u6781\u5C0A", ability: "\u65E0\u7A77\u754C\u9650", phase: "\u25A0\u25A0\u25A0\u25A0", color: "#ffd700", abilityIcon: "\u2694\uFE0F", phaseIcon: "\u{1F451}" };
      }
      getShopItems() {
        if (!this.shopConfig)
          this.shopConfig = { items: this.getDefaultShopItems() };
        if (!this.shopConfig.items)
          this.shopConfig.items = this.getDefaultShopItems();
        return this.shopConfig.items;
      }
      getDefaultShopItems() {
        return [
          {
            id: "wish-star-boost",
            name: "\u613F\u661F\u5145\u80FD\u5668",
            description: "\u7ACB\u5373\u83B7\u5F975\u9897\u613F\u661F",
            category: "system",
            type: "consumable",
            rarity: "rare",
            price: 1,
            icon: "\u2728",
            effect: { type: "add_wish_stars", value: 5 },
            editable: false
          },
          {
            id: "level-skip",
            name: "\u7B49\u7EA7\u8DC3\u8FC1\u7B26",
            description: "\u7ACB\u5373\u63D0\u53471\u7EA7",
            category: "system",
            type: "consumable",
            rarity: "legendary",
            price: 1,
            icon: "\u{1F4AB}",
            effect: { type: "add_level", value: 1 },
            editable: false
          },
          {
            id: "mystery-box",
            name: "\u795E\u79D8\u798F\u888B",
            description: "\u968F\u673A\u83B7\u5F971-10\u9897\u613F\u661F",
            category: "system",
            type: "consumable",
            rarity: "rare",
            price: 1,
            icon: "\u{1F381}",
            effect: { type: "random_wish_stars", min: 1, max: 10 },
            editable: true
          },
          {
            id: "milk",
            name: "\u725B\u5976",
            description: "\u6E05\u9664\u8EAB\u4E0A\u6240\u6709Buff\u6548\u679C",
            category: "system",
            type: "consumable",
            rarity: "rare",
            price: 1,
            icon: "\u{1F95B}",
            effect: { type: "clear_all_buffs" },
            editable: false
          }
        ];
      }
      async purchaseItem(itemId) {
        const stats = this.getStats();
        const items = this.getShopItems();
        const item = items.find((i) => i.id === itemId);
        if (!item)
          return { success: false, message: "\u274C \u5546\u54C1\u4E0D\u5B58\u5728\uFF01" };
        if (item.rarity === "rare" && stats.rareItemCards < item.price) {
          return { success: false, message: "\u274C \u7A00\u6709\u9053\u5177\u5361\u4E0D\u8DB3\uFF01" };
        }
        if (item.rarity === "legendary" && stats.legendaryItemCards < item.price) {
          return { success: false, message: "\u274C \u4F20\u5947\u9053\u5177\u5361\u4E0D\u8DB3\uFF01" };
        }
        if (item.rarity === "rare") {
          stats.rareItemCards -= item.price;
        } else if (item.rarity === "legendary") {
          stats.legendaryItemCards -= item.price;
        }
        const inventoryItem = {
          instanceId: "inv-" + Date.now().toString(),
          itemId: item.id,
          name: item.name,
          description: item.description,
          icon: item.icon,
          category: item.category || "system",
          rarity: item.rarity,
          effect: item.effect,
          purchasedAt: (/* @__PURE__ */ new Date()).toISOString()
        };
        stats.inventory.push(inventoryItem);
        await this.save();
        return { success: true, message: "\u{1F3B4} \u8D2D\u4E70\u6210\u529F\uFF01\u5546\u54C1\u5DF2\u52A0\u5165\u80CC\u5305" };
      }
      async useItem(instanceId) {
        const stats = this.getStats();
        const itemIndex = stats.inventory.findIndex((i) => i.instanceId === instanceId);
        if (itemIndex === -1)
          return { success: false, message: "\u274C \u7269\u54C1\u4E0D\u5B58\u5728\uFF01" };
        const item = stats.inventory[itemIndex];
        if (item.category === "system" || item.category === "exclusive") {
          const effect = item.effect;
          let effectMessage = "";
          if (effect) {
            switch (effect.type) {
              case "add_wish_stars":
                stats.wishStars += effect.value || 1;
                effectMessage = `\u83B7\u5F97 ${effect.value} \u9897\u613F\u661F`;
                break;
              case "add_level":
                stats.level += effect.value || 1;
                stats.totalPoints = Math.max(stats.totalPoints, stats.level * 5e3);
                effectMessage = `\u7B49\u7EA7\u63D0\u5347 ${effect.value} \u7EA7`;
                break;
              case "add_points":
                stats.totalPoints += effect.value || 100;
                stats.currentPoints += effect.value || 100;
                effectMessage = `\u83B7\u5F97 ${effect.value} \u79EF\u5206`;
                break;
              case "random_wish_stars": {
                const min = effect.min || 1;
                const max = effect.max || 5;
                const amount = Math.floor(Math.random() * (max - min + 1)) + min;
                stats.wishStars += amount;
                effectMessage = `\u968F\u673A\u83B7\u5F97 ${amount} \u9897\u613F\u661F`;
                break;
              }
              case "buff": {
                const buffId = "custom-" + Date.now().toString();
                const duration = effect.duration || effect.buffDuration || 24;
                await this.addBuff(buffId, effect.buffName, effect.buffIcon || item.icon, effect.buffDesc || item.description, duration);
                effectMessage = `\u83B7\u5F97Buff\uFF1A${effect.buffName}`;
                break;
              }
              case "super_diamond": {
                const baseAmount = Math.floor(Math.random() * 5) + 1;
                let totalStars = baseAmount;
                effectMessage = `\u83B7\u5F97 ${baseAmount} \u9897\u613F\u661F`;
                if (Math.random() < 0.2) {
                  totalStars += 5;
                  effectMessage += " + \u989D\u59165\u9897";
                }
                if (Math.random() < 0.01) {
                  totalStars += 100;
                  effectMessage += " + \u8D85\u7EA7\u7206\u53D1100\u9897\uFF01";
                }
                stats.wishStars += totalStars;
                await this.addBuff("super-luck", "\u8D85\u597D\u8FD0", "\u{1F31F}", "\u661F\u5149\u95EA\u8000\uFF0C\u597D\u8FD0\u964D\u4E34\uFF01\u7279\u6B8A\u795D\u798F\u4E2D...", 1);
                effectMessage = `\u2728 \u83B7\u5F97 ${totalStars} \u9897\u613F\u661F + \u8D85\u597D\u8FD0Buff\uFF01`;
                break;
              }
              case "clear_all_buffs": {
                stats.buffs = [];
                effectMessage = "\u5DF2\u6E05\u9664\u6240\u6709Buff\u6548\u679C";
                break;
              }
            }
          }
          stats.inventory.splice(itemIndex, 1);
          await this.save();
          return { success: true, message: `\u2705 \u4F7F\u7528\u6210\u529F\uFF01${item.name} \u5DF2\u751F\u6548${effectMessage ? " - " + effectMessage : ""}`, external: false };
        } else if (item.category === "external") {
          stats.inventory.splice(itemIndex, 1);
          if (!stats.usedExternalItems)
            stats.usedExternalItems = [];
          stats.usedExternalItems.push({ ...item, usedAt: (/* @__PURE__ */ new Date()).toISOString() });
          await this.save();
          return { success: true, message: "\u2705 \u5DF2\u4F7F\u7528 " + item.name + "\uFF01\u8BF7\u8BB0\u5F97\u5151\u73B0\u627F\u8BFA\u54E6\uFF5E", external: true, item };
        }
        return { success: false, message: "\u274C \u4F7F\u7528\u5931\u8D25" };
      }
      async exportData() {
        const data = {
          stats: this.stats,
          config: this.config,
          shopConfig: this.shopConfig,
          exportedAt: (/* @__PURE__ */ new Date()).toISOString()
        };
        return JSON.stringify(data, null, 2);
      }
      async importData(jsonString) {
        try {
          const data = JSON.parse(jsonString);
          if (data.stats) {
            this.stats = data.stats;
            await this.save();
          }
          if (data.config) {
            this.config = data.config;
            await this.saveConfig();
          }
          if (data.shopConfig) {
            this.shopConfig = data.shopConfig;
            await this.saveShopConfig();
          }
          return { success: true, message: "\u2705 \u6570\u636E\u5BFC\u5165\u6210\u529F\uFF01" };
        } catch (e) {
          return { success: false, message: "\u274C \u6570\u636E\u5BFC\u5165\u5931\u8D25\uFF1A" + e.message };
        }
      }
      async saveShopConfig() {
        if (!this.shopConfig)
          return;
        const adapter = this.app.vault.adapter;
        await adapter.write(SHOP_CONFIG_FILE, JSON.stringify(this.shopConfig, null, 2));
      }
      async addShopItem(name, description, category, type, price, rarity, icon, effect) {
        if (!this.shopConfig)
          this.shopConfig = { items: this.getDefaultShopItems() };
        if (!this.shopConfig.items)
          this.shopConfig.items = this.getDefaultShopItems();
        const newItem = {
          id: "item-" + Date.now().toString(),
          name,
          description: description || "",
          category: category || "system",
          type: type || "consumable",
          price: price || 1,
          rarity: rarity || "rare",
          icon: icon || "\u{1F4E6}",
          effect
        };
        this.shopConfig.items.push(newItem);
        await this.saveShopConfig();
        return { success: true, message: "\u2705 \u5546\u54C1\u6DFB\u52A0\u6210\u529F\uFF01", item: newItem };
      }
      async updateShopItem(itemId, updates) {
        var _a;
        if (!((_a = this.shopConfig) == null ? void 0 : _a.items)) {
          return { success: false, message: "\u274C \u5546\u54C1\u914D\u7F6E\u4E0D\u5B58\u5728" };
        }
        const item = this.shopConfig.items.find((i) => i.id === itemId);
        if (!item)
          return { success: false, message: "\u274C \u5546\u54C1\u4E0D\u5B58\u5728" };
        const fields = ["name", "description", "icon", "price", "rarity", "category", "effect"];
        for (const field of fields) {
          if (updates[field] !== void 0)
            item[field] = updates[field];
        }
        await this.saveShopConfig();
        return { success: true, message: "\u2705 \u5546\u54C1\u66F4\u65B0\u6210\u529F\uFF01" };
      }
      async deleteShopItem(itemId) {
        var _a;
        if (!((_a = this.shopConfig) == null ? void 0 : _a.items)) {
          return { success: false, message: "\u274C \u5546\u54C1\u914D\u7F6E\u4E0D\u5B58\u5728" };
        }
        const itemIndex = this.shopConfig.items.findIndex((i) => i.id === itemId);
        if (itemIndex === -1)
          return { success: false, message: "\u274C \u5546\u54C1\u4E0D\u5B58\u5728" };
        this.shopConfig.items.splice(itemIndex, 1);
        await this.saveShopConfig();
        return { success: true, message: "\u2705 \u5546\u54C1\u5DF2\u5220\u9664\uFF01" };
      }
      async updateLevelConfig(index, updates) {
        var _a;
        if (!((_a = this.config) == null ? void 0 : _a.levels))
          return { success: false, message: "\u274C \u7B49\u7EA7\u914D\u7F6E\u4E0D\u5B58\u5728" };
        if (!this.config.levels[index])
          return { success: false, message: "\u274C \u7B49\u7EA7\u4E0D\u5B58\u5728" };
        const level = this.config.levels[index];
        const fields = ["title", "ability", "abilityIcon", "phase", "phaseIcon", "color", "minLevel", "maxLevel"];
        for (const field of fields) {
          if (updates[field] !== void 0)
            level[field] = updates[field];
        }
        await this.saveConfig();
        return { success: true, message: "\u2705 \u7B49\u7EA7\u66F4\u65B0\u6210\u529F\uFF01" };
      }
      async addLevelConfig(levelData) {
        if (!this.config)
          this.config = this.getDefaultConfig();
        if (!this.config.levels)
          this.config.levels = [];
        const newLevel = {
          minLevel: levelData.minLevel || 0,
          maxLevel: levelData.maxLevel || 999,
          title: levelData.title || "\u65B0\u7B49\u7EA7",
          ability: levelData.ability || "\u65E0",
          abilityIcon: levelData.abilityIcon || "\u2694\uFE0F",
          phase: levelData.phase || "\u51E1\u4EBA",
          phaseIcon: levelData.phaseIcon || "\u{1F451}",
          color: levelData.color || "#ffffff"
        };
        this.config.levels.push(newLevel);
        this.config.levels.sort((a, b) => a.minLevel - b.minLevel);
        await this.saveConfig();
        return { success: true, message: "\u2705 \u7B49\u7EA7\u6DFB\u52A0\u6210\u529F\uFF01" };
      }
      async deleteLevelConfig(index) {
        var _a;
        if (!((_a = this.config) == null ? void 0 : _a.levels))
          return { success: false, message: "\u274C \u7B49\u7EA7\u914D\u7F6E\u4E0D\u5B58\u5728" };
        if (!this.config.levels[index])
          return { success: false, message: "\u274C \u7B49\u7EA7\u4E0D\u5B58\u5728" };
        this.config.levels.splice(index, 1);
        await this.saveConfig();
        return { success: true, message: "\u2705 \u7B49\u7EA7\u5DF2\u5220\u9664\uFF01" };
      }
      async addCurrency(name, icon, description, earnRate, color) {
        if (!this.config)
          this.config = this.getDefaultConfig();
        if (!this.config.customCurrencies)
          this.config.customCurrencies = [];
        const id = "custom-" + name.toLowerCase().replace(/\s+/g, "-");
        const newCurrency = {
          id,
          name,
          icon: icon || "\u{1F48E}",
          description: description || "",
          earnRate: earnRate || 1e3,
          earnAmount: 1,
          color: color || "#00ff00",
          editable: true
        };
        this.config.customCurrencies.push(newCurrency);
        const stats = this.getStats();
        if (stats[id] === void 0)
          stats[id] = 0;
        await this.saveConfig();
        await this.save();
        return { success: true, message: "\u2705 \u8D27\u5E01\u6DFB\u52A0\u6210\u529F\uFF01", currency: newCurrency };
      }
      async updateCurrency(currencyId, updates) {
        var _a, _b;
        if (!this.config)
          return { success: false, message: "\u274C \u914D\u7F6E\u4E0D\u5B58\u5728" };
        let currency = (_a = this.config.customCurrencies) == null ? void 0 : _a.find((c) => c.id === currencyId);
        if (!currency)
          currency = (_b = this.config.currencies) == null ? void 0 : _b.find((c) => c.id === currencyId);
        if (!currency)
          return { success: false, message: "\u274C \u8D27\u5E01\u4E0D\u5B58\u5728" };
        if (!currency.editable)
          return { success: false, message: "\u274C \u7CFB\u7EDF\u8D27\u5E01\u4E0D\u53EF\u7F16\u8F91" };
        const fields = ["name", "icon", "description", "earnRate", "color"];
        for (const field of fields) {
          if (updates[field] !== void 0)
            currency[field] = updates[field];
        }
        await this.saveConfig();
        return { success: true, message: "\u2705 \u8D27\u5E01\u66F4\u65B0\u6210\u529F\uFF01" };
      }
      async deleteCurrency(currencyId) {
        var _a;
        if (!((_a = this.config) == null ? void 0 : _a.customCurrencies))
          return { success: false, message: "\u274C \u81EA\u5B9A\u4E49\u8D27\u5E01\u4E0D\u5B58\u5728" };
        const index = this.config.customCurrencies.findIndex((c) => c.id === currencyId);
        if (index === -1)
          return { success: false, message: "\u274C \u8D27\u5E01\u4E0D\u5B58\u5728" };
        this.config.customCurrencies.splice(index, 1);
        await this.saveConfig();
        return { success: true, message: "\u2705 \u8D27\u5E01\u5DF2\u5220\u9664\uFF01" };
      }
    };
    module2.exports = DataStore2;
  }
});

// src/daily-note-parser.js
var require_daily_note_parser = __commonJS({
  "src/daily-note-parser.js"(exports2, module2) {
    var DailyNoteParser2 = class {
      constructor(dataStore) {
        this.dataStore = dataStore;
      }
      parseDailyNote(content, date) {
        const record = { date, mainTasks: [], habits: [], extraTasks: [], pomodoros: [], totalPoints: 0 };
        const mainTaskRegex = /★.*?三件事.*?\n([\s\S]*?)(?=●|📊|⏰|$)/gi;
        const mainMatch = mainTaskRegex.exec(content);
        if (mainMatch)
          record.mainTasks = this.parseMainTasks(mainMatch[1]);
        const habitRegex = /●.*?习惯.*?\n([\s\S]*?)(?=●|📊|⏰|$)/gi;
        const habitMatch = habitRegex.exec(content);
        if (habitMatch)
          record.habits = this.parseHabits(habitMatch[1]);
        const extraTaskRegex = /●.*?额外.*?\n([\s\S]*?)(?=●|特殊|📊|⏰|$)/gi;
        const extraMatch = extraTaskRegex.exec(content);
        if (extraMatch)
          record.extraTasks = this.parseExtraTasks(extraMatch[1]);
        const pomodoroRegex = /⏰.*?番茄钟.*?\n([\s\S]*?)(?=●|⛲|📊|$)/gi;
        const pomodoroMatch = pomodoroRegex.exec(content);
        if (pomodoroMatch)
          record.pomodoros = this.parsePomodoros(pomodoroMatch[1]);
        return record;
      }
      parseTaskLine(text) {
        const tasks = [];
        const lines = text.split("\n").filter((line) => line.trim());
        for (const line of lines) {
          const match = line.match(/\[([ x])\]\s*(.+?)\s*-\s*(\d+)/);
          if (match) {
            tasks.push({
              name: match[2].trim(),
              points: parseInt(match[3], 10),
              completed: match[1].toLowerCase() === "x"
            });
          }
        }
        return tasks;
      }
      parseMainTasks(text) {
        return this.parseTaskLine(text);
      }
      parseHabits(text) {
        return this.parseTaskLine(text);
      }
      parseExtraTasks(text) {
        return this.parseTaskLine(text);
      }
      parsePomodoros(text) {
        const pomodoros = [];
        const lines = text.split("\n").filter((line) => line.trim());
        for (const line of lines) {
          const match = line.match(/\[([ x])\].*?⏱️/i);
          if (match) {
            pomodoros.push({ completed: match[1].toLowerCase() === "x" });
          }
        }
        return pomodoros;
      }
      calculatePoints(record) {
        const config = this.dataStore.config || this.dataStore.getDefaultConfig();
        const dailyTasks = config.dailyTasks || {
          mainTasks: { count: 3, pointsPerTask: 50 },
          habits: { items: [] },
          extraTasks: { count: 2, pointsPerTask: 50 },
          pomodoro: { count: 6, pointsPerPomodoro: 50 }
        };
        let points = 0;
        for (const task of record.mainTasks) {
          if (task.completed)
            points += task.points;
        }
        for (const habit of record.habits) {
          if (habit.completed)
            points += habit.points;
        }
        const extraConfig = dailyTasks.extraTasks || { count: 2, pointsPerTask: 50 };
        const completedExtraTasks = record.extraTasks.filter((t) => t.completed);
        const extraCount = Math.min(completedExtraTasks.length, extraConfig.count || 2);
        for (let i = 0; i < extraCount; i++) {
          points += completedExtraTasks[i].points;
        }
        const pomodoroConfig = dailyTasks.pomodoro || { count: 6, pointsPerPomodoro: 50 };
        const completedPomodoros = record.pomodoros.filter((p) => p.completed).length;
        const pomodoroCount = Math.min(completedPomodoros, pomodoroConfig.count || 6);
        points += pomodoroCount * (pomodoroConfig.pointsPerPomodoro || 50);
        return points;
      }
    };
    module2.exports = DailyNoteParser2;
  }
});

// src/core.js
var require_core = __commonJS({
  "src/core.js"(exports2, module2) {
    var { Notice } = require("obsidian");
    var Core3 = {
      getDailyNotePath(app) {
        var _a, _b, _c, _d;
        const dailyNotePlugin = (_b = (_a = app.internalPlugins) == null ? void 0 : _a.plugins) == null ? void 0 : _b["daily-notes"];
        if (dailyNotePlugin == null ? void 0 : dailyNotePlugin.instance) {
          const moment = window.moment;
          const folder = ((_c = dailyNotePlugin.instance.options) == null ? void 0 : _c.folder) || "Notes/DailyNotes";
          const format = ((_d = dailyNotePlugin.instance.options) == null ? void 0 : _d.format) || "yyyy-MM-dd";
          const dateStr = moment().format(format);
          return folder + "/" + dateStr + ".md";
        }
        return "Notes/DailyNotes/" + (/* @__PURE__ */ new Date()).toISOString().split("T")[0] + ".md";
      },
      async processTodayNote(plugin, forceReprocess = false) {
        const dailyNotePath = this.getDailyNotePath(plugin.app);
        try {
          const file = await plugin.app.vault.getAbstractFileByPath(dailyNotePath);
          if (!file) {
            new Notice("\u274C \u4ECA\u65E5\u7B14\u8BB0\u4E0D\u5B58\u5728\uFF0C\u8BF7\u5148\u521B\u5EFA\u65E5\u8BB0");
            return;
          }
          const content = await plugin.app.vault.read(file);
          const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
          const record = plugin.parser.parseDailyNote(content, today);
          if (!forceReprocess && content.includes("\u{1F4CA} \u4ECA\u65E5\u79EF\u5206\uFF1A")) {
            new Notice("\u{1F4CB} \u4ECA\u65E5\u7B14\u8BB0\u5DF2\u5904\u7406\uFF0C\u65E0\u9700\u91CD\u590D\u6253\u5361");
            return;
          }
          const points = plugin.parser.calculatePoints(record);
          const result = await plugin.dataStore.addPoints(points);
          await this.updateDailyNote(plugin, dailyNotePath, content, points);
          this.updateStatusBar(plugin);
          let message = "\u2705 \u6253\u5361\u5B8C\u6210\uFF01+" + points + "\u79EF\u5206";
          if (result.levelUp)
            message += " \u{1F389} \u7B49\u7EA7\u63D0\u5347\u5230 Lv." + result.newLevel + "\uFF01";
          for (const r of result.rewards)
            message += " " + r;
          new Notice(message);
        } catch (e) {
          console.error("Error processing daily note:", e);
          new Notice("\u274C \u5904\u7406\u5931\u8D25: " + e.message);
        }
      },
      async syncAccountInfo(plugin) {
        try {
          const file = plugin.app.workspace.getActiveFile();
          if (!file) {
            new Notice("\u274C \u8BF7\u5148\u6253\u5F00\u4E00\u4E2A\u6587\u4EF6");
            return;
          }
          if (!file.path.endsWith(".md")) {
            new Notice("\u274C \u5F53\u524D\u6587\u4EF6\u4E0D\u662F Markdown \u6587\u4EF6");
            return;
          }
          let content = await plugin.app.vault.read(file);
          const stats = plugin.dataStore.getStats();
          const activeWishes = (stats.wishes || []).filter((w) => w.status === "active");
          const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
          const hasSyncSection = content.includes("\u{1F4CA} \u4ECA\u65E5\u79EF\u5206\uFF1A");
          if (hasSyncSection) {
            let lines = content.split("\n");
            let modified = false;
            for (let i = 0; i < lines.length; i++) {
              if (lines[i].includes("\u{1F4CA} \u4ECA\u65E5\u79EF\u5206\uFF1A")) {
                lines[i] = `\u{1F4CA} \u4ECA\u65E5\u79EF\u5206\uFF1A${stats.todayPoints || 0}`;
                modified = true;
              }
              if (lines[i].includes("\u{1F4B0} \u5F53\u524D\u79EF\u5206\uFF1A")) {
                lines[i] = `\u{1F4B0} \u5F53\u524D\u79EF\u5206\uFF1A${stats.totalPoints || 0}`;
                modified = true;
              }
              if (lines[i].includes("\u203B\u613F\u661F")) {
                lines[i] = `\u203B\u613F\u661F * ${stats.wishStars || 0}`;
                modified = true;
              }
              if (lines[i].includes("\u203B\u7A00\u6709\u9053\u5177\u5361")) {
                lines[i] = `\u203B\u7A00\u6709\u9053\u5177\u5361 * ${stats.rareItemCards || 0}`;
                modified = true;
              }
              if (lines[i].includes("\u203B\u4F20\u5947\u9053\u5177\u5361")) {
                lines[i] = `\u203B\u4F20\u5947\u9053\u5177\u5361 * ${stats.legendaryItemCards || 0}`;
                modified = true;
              }
            }
            const wishPoolIndex = lines.findIndex((l) => l.includes("\u26F2**\u8BB8\u613F\u6C60**"));
            if (wishPoolIndex !== -1) {
              const beforeLines = lines.slice(0, wishPoolIndex + 1);
              const afterIndex = lines.findIndex((l, i) => i > wishPoolIndex && l.includes("---"));
              let wishLines = [];
              if (activeWishes.length > 0) {
                for (const wish of activeWishes) {
                  const filledBlocks = Math.floor(wish.progress / 10);
                  const emptyBlocks = 10 - filledBlocks;
                  const bar = "\u25C9".repeat(filledBlocks) + "\u25CE".repeat(emptyBlocks);
                  const statusIcon = wish.progress >= 100 ? "\u2728" : "\u{1F4C8}";
                  wishLines.push(`> ${statusIcon} **${wish.name}** ${bar} ${wish.progress}%`);
                }
              } else {
                wishLines.push("> \u6682\u65E0\u8FDB\u884C\u4E2D\u7684\u613F\u671B");
              }
              const afterLines = afterIndex !== -1 ? lines.slice(afterIndex) : [];
              lines = [...beforeLines, ...wishLines, ...afterLines];
              modified = true;
            }
            if (modified) {
              content = lines.join("\n");
              await plugin.app.vault.modify(file, content);
              new Notice("\u2705 \u8D26\u6237\u4FE1\u606F\u5DF2\u540C\u6B65\uFF01");
            } else {
              new Notice("\u26A0\uFE0F \u672A\u68C0\u6D4B\u5230\u9700\u8981\u66F4\u65B0\u7684\u5185\u5BB9");
            }
          } else {
            let wishSection = "";
            if (activeWishes.length > 0) {
              for (const wish of activeWishes) {
                const filledBlocks = Math.floor(wish.progress / 10);
                const emptyBlocks = 10 - filledBlocks;
                const bar = "\u25C9".repeat(filledBlocks) + "\u25CE".repeat(emptyBlocks);
                wishSection += `> \u{1F4C8} **${wish.name}** ${bar} ${wish.progress}%
`;
              }
            } else {
              wishSection = "> \u6682\u65E0\u8FDB\u884C\u4E2D\u7684\u613F\u671B\n";
            }
            const levelInfo = plugin.dataStore.getLevelTitle(stats.level);
            const syncSection = `
---

### \u{1F4CA} \u8D26\u6237\u4FE1\u606F

> \u{1F464} ${stats.playerName || "\u73A9\u5BB6"} | \u2B50 Lv.${stats.level} ${levelInfo.title}

\u{1F4CA} \u4ECA\u65E5\u79EF\u5206\uFF1A${stats.todayPoints || 0}
\u{1F4B0} \u5F53\u524D\u79EF\u5206\uFF1A${stats.totalPoints || 0}
\u2B50 \u613F\u661F\uFF1A${stats.wishStars || 0}
\u{1F3B4} \u7A00\u6709\u9053\u5177\u5361\uFF1A${stats.rareItemCards || 0}
\u{1F320} \u4F20\u5947\u9053\u5177\u5361\uFF1A${stats.legendaryItemCards || 0}

\u26F2 **\u8BB8\u613F\u6C60**

${wishSection}

---

*\u540C\u6B65\u65F6\u95F4\uFF1A${today}*
`;
            content += syncSection;
            await plugin.app.vault.modify(file, content);
            new Notice("\u2705 \u8D26\u6237\u4FE1\u606F\u5DF2\u63D2\u5165\u5230\u6587\u4EF6\u672B\u5C3E\uFF01");
          }
          this.updateStatusBar(plugin);
        } catch (e) {
          console.error("[Sync] Error:", e);
          new Notice("\u274C \u540C\u6B65\u5931\u8D25\uFF1A" + e.message);
        }
      },
      async updateDailyNote(plugin, path, originalContent, points) {
        const stats = plugin.dataStore.getStats();
        const activeWishes = (stats.wishes || []).filter((w) => w.status === "active");
        let wishPoolSection = "\n**\u5F53\u524D\u613F\u671B\uFF1A** \u6682\u65E0\u8FDB\u884C\u4E2D\u7684\u613F\u671B\n";
        if (activeWishes.length > 0) {
          wishPoolSection = "\n**\u5F53\u524D\u613F\u671B\uFF1A**\n";
          for (const wish of activeWishes) {
            const filledBlocks = Math.floor(wish.progress / 10);
            const emptyBlocks = 10 - filledBlocks;
            const bar = "\u2588".repeat(filledBlocks) + "\u2591".repeat(emptyBlocks);
            const statusIcon = wish.progress >= 100 ? "\u2728" : "\u{1F4C8}";
            wishPoolSection += `> ${statusIcon} **${wish.name}** ${bar} ${wish.progress}%
`;
          }
        }
        let newContent = originalContent.replace("\u26F2**\u8BB8\u613F\u6C60**\n\n\u5F53\u524D\u613F\u671B\uFF1A", "\u26F2**\u8BB8\u613F\u6C60**\n" + wishPoolSection);
        const statsSection = "\n\u{1F4CA} \u4ECA\u65E5\u79EF\u5206\uFF1A" + points + "\n\n\u{1F4B0} \u5F53\u524D\u79EF\u5206\uFF1A" + stats.totalPoints + "\n\u203B\u613F\u661F * " + stats.wishStars + "\n\u203B\u7A00\u6709\u9053\u5177\u5361 * " + stats.rareItemCards + "\n\u203B\u4F20\u5947\u9053\u5177\u5361 * " + stats.legendaryItemCards + "\n\n- " + (/* @__PURE__ */ new Date()).toISOString().split("T")[0] + " - " + points + "\n";
        const lines = newContent.split("\n");
        let insertIndex = lines.length;
        for (let i = lines.length - 1; i >= 0; i--) {
          if (lines[i].includes("* 2026") || lines[i].includes("* 2025") || lines[i].includes("* 2024")) {
            insertIndex = i;
            break;
          }
        }
        lines.splice(insertIndex, 0, statsSection);
        newContent = lines.join("\n");
        const file = await plugin.app.vault.getAbstractFileByPath(path);
        if (file)
          await plugin.app.vault.modify(file, newContent);
      },
      updateStatusBar(plugin) {
        if (!plugin.statusBar)
          return;
        const stats = plugin.dataStore.getStats();
        const levelInfo = plugin.dataStore.getLevelTitle(stats.level);
        const nextLevel = stats.level + 1;
        const pointsToNext = nextLevel * 5e3 - stats.totalPoints;
        const activeBuffs = plugin.dataStore.getActiveBuffs();
        const playerName = stats.playerName || "\u73A9\u5BB6";
        plugin.statusBar.innerHTML = `<span class="sp-level-btn" style="color: ${levelInfo.color}; cursor: pointer;" title="${levelInfo.title} | ${levelInfo.ability} - \u70B9\u51FB\u67E5\u770B\u7B49\u7EA7\u7CFB\u7EDF">\u2B50 Lv.${stats.level} ${levelInfo.title}</span> | <span class="sp-stats-btn" style="cursor: pointer;" title="\u70B9\u51FB\u67E5\u770B\u72B6\u6001\u9762\u677F">\u{1F4CA} ${stats.totalPoints}</span> | <span class="sp-stats-btn" style="cursor: pointer;" title="\u7528\u4E8E\u8BB8\u613F\u548C\u6270\u52A8\u4E16\u754C\u7EBF">\u{1F31F} ${stats.wishStars}</span>`;
        plugin.statusBar.querySelector(".sp-level-btn").onclick = (e) => {
          e.stopPropagation();
          plugin.showLevelSystem();
        };
        plugin.statusBar.querySelectorAll(".sp-stats-btn").forEach((btn) => {
          btn.onclick = () => plugin.showStats();
        });
        this.setupHoverPanel(plugin, stats, levelInfo, pointsToNext, activeBuffs, playerName);
      },
      setupHoverPanel(plugin, stats, levelInfo, pointsToNext, activeBuffs, playerName) {
        let hoverPanel = null;
        let hoverTimeout = null;
        const showHoverPanel = () => {
          if (hoverPanel)
            return;
          hoverPanel = document.createElement("div");
          hoverPanel.className = "supreme-player-hover-panel";
          hoverPanel.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 10px;
        background: var(--background-primary);
        border: 1px solid var(--background-modifier-border);
        border-radius: 8px;
        padding: 15px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        z-index: 10000;
        min-width: 280px;
        font-size: 13px;
      `;
          const currencies = plugin.dataStore.getCurrencies();
          let currencyHtml = "";
          for (const currency of currencies) {
            const value = stats[currency.id] || 0;
            currencyHtml += `<div style="display: flex; justify-content: space-between; padding: 4px 0; border-bottom: 1px solid var(--background-modifier-border);">
          <span>${currency.icon} ${currency.name}</span>
          <span style="font-weight: bold; color: ${currency.color};">${value}</span>
        </div>`;
          }
          let buffHtml = "";
          if (activeBuffs.length > 0) {
            buffHtml = '<div style="margin-top: 10px; font-weight: bold;">\u{1F52E} \u5F53\u524D Buff</div>';
            for (const buff of activeBuffs) {
              buffHtml += `<div style="padding: 4px 0; font-size: 12px;">
            <span>${buff.icon} ${buff.name}</span>
            <span style="color: #888; margin-left: 5px;">${buff.description}</span>
          </div>`;
            }
          }
          hoverPanel.innerHTML = `
        <div style="font-weight: bold; font-size: 15px; margin-bottom: 10px; color: ${levelInfo.color};">
          \u{1F464} ${playerName} | \u2B50 Lv.${stats.level} ${levelInfo.title}
        </div>
        <div style="color: #888; font-size: 12px; margin-bottom: 10px;">
          ${levelInfo.ability} | ${levelInfo.phase}
        </div>
        <div style="margin-bottom: 10px;">
          <div style="display: flex; justify-content: space-between; padding: 4px 0;">
            <span>\u{1F4CA} \u79EF\u5206</span>
            <span style="font-weight: bold;">${stats.totalPoints}</span>
          </div>
          <div style="display: flex; justify-content: space-between; padding: 4px 0;">
            <span>\u{1F4C8} \u8DDD\u4E0B\u4E00\u7EA7</span>
            <span style="font-weight: bold;">${pointsToNext}</span>
          </div>
        </div>
        <div style="font-weight: bold; margin-top: 10px;">\u{1F4B0} \u8D27\u5E01</div>
        ${currencyHtml}
        ${buffHtml}
        <div style="margin-top: 15px; display: flex; gap: 8px;">
          <button class="sp-hover-btn" style="flex: 1; padding: 6px; border-radius: 4px; cursor: pointer;">\u26F2 \u8BB8\u613F</button>
          <button class="sp-hover-btn" style="flex: 1; padding: 6px; border-radius: 4px; cursor: pointer;">\u{1F3B4} \u5546\u57CE</button>
          <button class="sp-hover-btn" style="flex: 1; padding: 6px; border-radius: 4px; cursor: pointer;">\u{1F4E6} \u80CC\u5305</button>
        </div>
      `;
          document.body.appendChild(hoverPanel);
          hoverPanel.querySelector(".sp-hover-btn:nth-child(1)").onclick = (e) => {
            e.stopPropagation();
            hideHoverPanel();
            plugin.showWishPool();
          };
          hoverPanel.querySelector(".sp-hover-btn:nth-child(2)").onclick = (e) => {
            e.stopPropagation();
            hideHoverPanel();
            plugin.showShop();
          };
          hoverPanel.querySelector(".sp-hover-btn:nth-child(3)").onclick = (e) => {
            e.stopPropagation();
            hideHoverPanel();
            plugin.showInventory();
          };
          hoverPanel.onmouseenter = () => {
            if (hoverTimeout)
              clearTimeout(hoverTimeout);
          };
          hoverPanel.onmouseleave = () => {
            hoverTimeout = setTimeout(hideHoverPanel, 300);
          };
        };
        const hideHoverPanel = () => {
          if (hoverPanel) {
            hoverPanel.remove();
            hoverPanel = null;
          }
        };
        plugin.statusBar.onmouseenter = () => {
          if (hoverTimeout)
            clearTimeout(hoverTimeout);
          hoverTimeout = setTimeout(showHoverPanel, 500);
        };
        plugin.statusBar.onmouseleave = () => {
          hoverTimeout = setTimeout(hideHoverPanel, 300);
        };
      }
    };
    module2.exports = Core3;
  }
});

// src/ui.js
var require_ui = __commonJS({
  "src/ui.js"(exports2, module2) {
    var { Modal, Notice } = require("obsidian");
    var Core3 = require_core();
    var UI2 = {
      showLevelSystem(plugin) {
        var _a;
        const stats = plugin.dataStore.getStats();
        const levels = ((_a = plugin.dataStore.config) == null ? void 0 : _a.levels) || [];
        const currentLevelInfo = plugin.dataStore.getLevelTitle(stats.level);
        const modal = new Modal(plugin.app);
        modal.titleEl.setText("\u2B50 \u7B49\u7EA7\u4E0E\u79F0\u53F7\u7CFB\u7EDF");
        const content = document.createElement("div");
        content.style.padding = "20px";
        content.style.maxWidth = "500px";
        const currentDiv = document.createElement("div");
        currentDiv.style.cssText = "background: var(--background-secondary); padding: 15px; border-radius: 8px; margin-bottom: 20px; text-align: center;";
        currentDiv.innerHTML = `
      <div style="font-size: 14px; color: #888; margin-bottom: 5px;">\u5F53\u524D\u7B49\u7EA7</div>
      <div style="font-size: 28px; font-weight: bold; color: ${currentLevelInfo.color};">Lv.${stats.level} ${currentLevelInfo.title}</div>
      <div style="font-size: 14px; color: #888; margin-top: 5px;">${currentLevelInfo.abilityIcon || "\u2694\uFE0F"} ${currentLevelInfo.ability} | ${currentLevelInfo.phaseIcon || "\u{1F451}"} ${currentLevelInfo.phase}</div>
      <div style="margin-top: 10px; font-size: 12px; color: #888;">\u603B\u79EF\u5206: ${stats.totalPoints}</div>
    `;
        content.appendChild(currentDiv);
        const levelListTitle = document.createElement("div");
        levelListTitle.style.cssText = "font-weight: bold; margin-bottom: 10px;";
        levelListTitle.textContent = "\u{1F4CB} \u7B49\u7EA7\u9636\u6BB5";
        content.appendChild(levelListTitle);
        const levelList = document.createElement("div");
        levelList.style.cssText = "max-height: 350px; overflow-y: auto;";
        for (const level of levels) {
          const isCurrentLevel = stats.level >= level.minLevel && stats.level <= level.maxLevel;
          const minPoints = level.minLevel * 5e3;
          const maxPoints = level.maxLevel * 5e3;
          const abilityIcon = level.abilityIcon || "\u2694\uFE0F";
          const phaseIcon = level.phaseIcon || "\u{1F451}";
          const levelDiv = document.createElement("div");
          levelDiv.style.cssText = `
        padding: 12px;
        margin-bottom: 8px;
        border: 1px solid ${isCurrentLevel ? level.color : "var(--border-color)"};
        border-radius: 6px;
        background: ${isCurrentLevel ? level.color + "15" : "transparent"};
      `;
          levelDiv.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div>
            <span style="font-weight: bold; color: ${level.color};">${level.title}</span>
            <span style="color: #888; font-size: 12px; margin-left: 8px;">Lv.${level.minLevel}-${level.maxLevel}</span>
            ${isCurrentLevel ? '<span style="background: ' + level.color + '; color: white; padding: 2px 6px; border-radius: 3px; font-size: 10px; margin-left: 8px;">\u5F53\u524D</span>' : ""}
          </div>
          <div style="font-size: 12px; color: #888;">${minPoints.toLocaleString()} - ${maxPoints.toLocaleString()} \u79EF\u5206</div>
        </div>
        <div style="margin-top: 8px; font-size: 13px;">
          <span style="color: #00aaff;">${abilityIcon} ${level.ability}</span>
          <span style="color: #888; margin: 0 8px;">|</span>
          <span style="color: #ffd700;">${phaseIcon} ${level.phase}</span>
        </div>
      `;
          levelList.appendChild(levelDiv);
        }
        content.appendChild(levelList);
        const closeBtn = document.createElement("button");
        closeBtn.textContent = "\u5173\u95ED";
        closeBtn.style.cssText = "width: 100%; margin-top: 15px;";
        closeBtn.onclick = () => modal.close();
        content.appendChild(closeBtn);
        modal.contentEl.appendChild(content);
        modal.open();
      },
      showStats(plugin) {
        const stats = plugin.dataStore.getStats();
        const levelInfo = plugin.dataStore.getLevelTitle(stats.level);
        const activeBuffs = plugin.dataStore.getActiveBuffs();
        const playerName = stats.playerName || "\u73A9\u5BB6";
        const modal = new Modal(plugin.app);
        modal.titleEl.setText(`\u{1F31F} ${playerName} \u7684\u73A9\u5BB6\u9762\u677F`);
        const content = document.createElement("div");
        content.style.padding = "20px";
        const topGrid = document.createElement("div");
        topGrid.style.display = "grid";
        topGrid.style.gridTemplateColumns = "1fr 1fr";
        topGrid.style.gap = "20px";
        topGrid.innerHTML = `
      <div style="background: var(--background-secondary); padding: 15px; border-radius: 8px;"><div style="color: #888; font-size: 12px;">\u26A1 \u79EF\u5206</div><div style="font-size: 24px; font-weight: bold;">${stats.totalPoints}</div></div>
      <div style="background: var(--background-secondary); padding: 15px; border-radius: 8px;"><div style="color: #888; font-size: 12px;">\u{1F4CA} \u7B49\u7EA7</div><div style="font-size: 24px; font-weight: bold; color: ${levelInfo.color};">Lv.${stats.level} ${levelInfo.title}</div></div>
      <div style="background: var(--background-secondary); padding: 15px; border-radius: 8px;"><div style="color: #888; font-size: 12px;">\u2B50 \u613F\u661F</div><div style="font-size: 24px; font-weight: bold;">${stats.wishStars}</div></div>
      <div style="background: var(--background-secondary); padding: 15px; border-radius: 8px;"><div style="color: #888; font-size: 12px;">\u{1F4E6} \u80CC\u5305\u7269\u54C1</div><div style="font-size: 24px; font-weight: bold;">${stats.inventory.length}</div></div>
    `;
        content.appendChild(topGrid);
        const bottomGrid = document.createElement("div");
        bottomGrid.style.marginTop = "20px";
        bottomGrid.style.display = "grid";
        bottomGrid.style.gridTemplateColumns = "1fr 1fr 1fr";
        bottomGrid.style.gap = "10px";
        bottomGrid.innerHTML = `
      <div style="background: #9966ff20; padding: 10px; border-radius: 5px; text-align: center;"><div style="font-size: 20px;">\u{1F3B4}</div><div>\u7A00\u6709\u9053\u5177\u5361</div><div style="font-weight: bold;">${stats.rareItemCards}</div></div>
      <div style="background: #ffd70020; padding: 10px; border-radius: 5px; text-align: center;"><div style="font-size: 20px;">\u{1F320}</div><div>\u4F20\u5947\u9053\u5177\u5361</div><div style="font-weight: bold;">${stats.legendaryItemCards}</div></div>
      <div style="background: #00ff0020; padding: 10px; border-radius: 5px; text-align: center;"><div style="font-size: 20px;">\u{1F4C8}</div><div>\u8DDD\u4E0B\u4E00\u7EA7</div><div style="font-weight: bold;">${5e3 - stats.totalPoints % 5e3}</div></div>
    `;
        content.appendChild(bottomGrid);
        if (activeBuffs.length > 0) {
          const buffSection = document.createElement("div");
          buffSection.style.marginTop = "20px";
          buffSection.innerHTML = '<div style="font-weight: bold; margin-bottom: 10px;">\u{1F52E} \u5F53\u524D Buff</div>';
          content.appendChild(buffSection);
          const buffList = document.createElement("div");
          buffList.style.display = "flex";
          buffList.style.gap = "10px";
          buffList.style.flexWrap = "wrap";
          for (const buff of activeBuffs) {
            const buffDiv = document.createElement("div");
            buffDiv.style.cssText = "padding: 8px 12px; background: var(--background-secondary); border-radius: 5px; cursor: help;";
            buffDiv.innerHTML = `<span style="font-size: 16px;">${buff.icon}</span>`;
            buffDiv.title = `${buff.name}: ${buff.description}`;
            buffList.appendChild(buffDiv);
          }
          content.appendChild(buffList);
        }
        const buttonSection = document.createElement("div");
        buttonSection.style.marginTop = "20px";
        buttonSection.style.display = "grid";
        buttonSection.style.gridTemplateColumns = "1fr 1fr";
        buttonSection.style.gap = "10px";
        const checkInBtn = document.createElement("button");
        checkInBtn.textContent = "\u{1F4C5} \u6BCF\u65E5\u6253\u5361";
        checkInBtn.className = "mod-cta";
        checkInBtn.style.gridColumn = "1 / -1";
        checkInBtn.onclick = () => {
          modal.close();
          this.showCheckInPanel(plugin);
        };
        buttonSection.appendChild(checkInBtn);
        const wishBtn = document.createElement("button");
        wishBtn.textContent = "\u26F2 \u524D\u5F80\u8BB8\u613F";
        wishBtn.style.flex = "1";
        wishBtn.onclick = () => {
          modal.close();
          plugin.showWishPool();
        };
        buttonSection.appendChild(wishBtn);
        const shopBtn = document.createElement("button");
        shopBtn.textContent = "\u{1F3B4} \u524D\u5F80\u5546\u57CE";
        shopBtn.style.flex = "1";
        shopBtn.onclick = () => {
          modal.close();
          plugin.showShop();
        };
        buttonSection.appendChild(shopBtn);
        const inventoryBtn = document.createElement("button");
        inventoryBtn.textContent = "\u{1F392} \u6253\u5F00\u80CC\u5305";
        inventoryBtn.style.gridColumn = "1 / -1";
        inventoryBtn.onclick = () => {
          modal.close();
          plugin.showInventory();
        };
        buttonSection.appendChild(inventoryBtn);
        content.appendChild(buttonSection);
        const closeBtn = document.createElement("button");
        closeBtn.textContent = "\u5173\u95ED";
        closeBtn.style.width = "100%";
        closeBtn.style.marginTop = "10px";
        closeBtn.onclick = () => modal.close();
        content.appendChild(closeBtn);
        modal.contentEl.appendChild(content);
        modal.open();
      },
      async showCheckInPanel(plugin) {
        var _a;
        const config = plugin.dataStore.config || plugin.dataStore.getDefaultConfig();
        const stats = plugin.dataStore.getStats();
        const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
        const alreadyCheckedIn = stats.lastCheckInDate === today;
        const dailyTasks = config.dailyTasks || {
          mainTasks: { count: 3, pointsPerTask: 100 },
          habits: { items: [] },
          extraTasks: { count: 2, pointsPerTask: 50 },
          pomodoro: { count: 6, pointsPerPomodoro: 50 }
        };
        const mainTasks = dailyTasks.mainTasks || { count: 3, pointsPerTask: 100 };
        const habits = ((_a = dailyTasks.habits) == null ? void 0 : _a.items) || [];
        const habitsPoints = habits.reduce((sum, h) => sum + (h.points || 0), 0);
        const maxBasePoints = mainTasks.count * mainTasks.pointsPerTask + habitsPoints;
        const modal = new Modal(plugin.app);
        modal.titleEl.setText("\u{1F4C5} \u6BCF\u65E5\u6253\u5361");
        const content = document.createElement("div");
        content.style.padding = "20px";
        if (alreadyCheckedIn) {
          content.innerHTML = `
        <div style="text-align: center; margin-bottom: 20px;">
          <div style="font-size: 64px; margin-bottom: 15px;">\u2705</div>
          <div style="font-size: 18px; font-weight: bold; margin-bottom: 10px; color: #00aaff;">\u4ECA\u65E5\u5DF2\u5B8C\u6210\u6253\u5361</div>
          <div style="color: #888; font-size: 13px;">\u660E\u5929\u518D\u6765\u5427\uFF01</div>
        </div>
      `;
          const closeBtn2 = document.createElement("button");
          closeBtn2.textContent = "\u5173\u95ED";
          closeBtn2.style.width = "100%";
          closeBtn2.onclick = () => modal.close();
          content.appendChild(closeBtn2);
          modal.contentEl.appendChild(content);
          modal.open();
          return;
        }
        const dailyNotePath = Core3.getDailyNotePath(plugin.app);
        let currentPoints = 0;
        let record = null;
        try {
          const file = await plugin.app.vault.getAbstractFileByPath(dailyNotePath);
          if (file) {
            const noteContent = await plugin.app.vault.read(file);
            const recordDate = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
            record = plugin.parser.parseDailyNote(noteContent, recordDate);
            currentPoints = plugin.parser.calculatePoints(record);
          }
        } catch (e) {
          console.log("No daily note found");
        }
        const progressPercent = Math.min(100, Math.round(currentPoints / maxBasePoints * 100));
        const isPerfect = currentPoints >= maxBasePoints;
        content.innerHTML = `
      <div style="text-align: center; margin-bottom: 20px;">
        <div style="font-size: 14px; color: #888; margin-bottom: 10px;">\u4ECA\u65E5\u83B7\u5F97\u79EF\u5206</div>
        <div style="font-size: 36px; font-weight: bold; color: ${isPerfect ? "#ffd700" : "#00aaff"};">${currentPoints}</div>
        <div style="font-size: 12px; color: #888;">/ ${maxBasePoints} \u57FA\u7840\u79EF\u5206</div>
      </div>

      <div style="margin-bottom: 20px;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
          <span style="font-size: 12px; color: #888;">\u5B8C\u6210\u8FDB\u5EA6</span>
          <span style="font-size: 12px; color: ${isPerfect ? "#ffd700" : "#00aaff"};">${progressPercent}%</span>
        </div>
        <div style="background: var(--background-secondary); height: 20px; border-radius: 10px; overflow: hidden;">
          <div style="background: ${isPerfect ? "linear-gradient(90deg, #ffd700, #ffaa00)" : "linear-gradient(90deg, #00aaff, #0066ff)"}; height: 100%; width: ${Math.min(100, progressPercent)}%; transition: width 0.3s; display: flex; align-items: center; justify-content: center;">
            ${progressPercent >= 30 ? `<span style="color: white; font-size: 11px; font-weight: bold;">${progressPercent}%</span>` : ""}
          </div>
        </div>
        ${progressPercent > 100 ? `<div style="text-align: center; margin-top: 5px; font-size: 12px; color: #ffd700;">\u2728 \u8D85\u989D\u5B8C\u6210\uFF01\u5B9E\u9645\u8FDB\u5EA6 ${progressPercent}%</div>` : ""}
      </div>

      <div style="background: var(--background-secondary); padding: 15px; border-radius: 8px; margin-bottom: 20px;">
        <div style="font-weight: bold; margin-bottom: 10px;">\u{1F4CA} \u4EFB\u52A1\u5B8C\u6210\u60C5\u51B5</div>
        <div style="font-size: 13px; color: #888;">
          <div>\u25CF \u6BCF\u65E5\u4E09\u4EF6\u4E8B\uFF1A${record ? record.mainTasks.filter((t) => t.completed).length : 0}/${mainTasks.count}</div>
          <div>\u25CF \u4E60\u60EF\u6253\u5361\uFF1A${record ? record.habits.filter((h) => h.completed).length : 0}/${habits.length}</div>
        </div>
      </div>

      <div style="text-align: center; color: #888; font-size: 12px; margin-bottom: 15px;">
        ${isPerfect ? "\u{1F31F} \u5B8C\u7F8E\u6253\u5361\uFF01\u4ECA\u65E5\u4EFB\u52A1\u5168\u90E8\u5B8C\u6210\uFF01" : "\u{1F4AA} \u7EE7\u7EED\u52AA\u529B\uFF0C\u5B8C\u6210\u6240\u6709\u57FA\u7840\u4EFB\u52A1\u5373\u53EF\u5B8C\u7F8E\u6253\u5361\uFF01"}
      </div>
    `;
        const checkInBtn = document.createElement("button");
        checkInBtn.textContent = isPerfect ? "\u{1F31F} \u5B8C\u7F8E\u6253\u5361" : "\u2705 \u786E\u8BA4\u6253\u5361";
        checkInBtn.className = "mod-cta";
        checkInBtn.style.width = "100%";
        checkInBtn.style.marginBottom = "10px";
        checkInBtn.onclick = async () => {
          modal.close();
          if (isPerfect) {
            await this.showPerfectCheckIn(plugin, currentPoints);
          } else {
            await this.showCheckInConfirm(plugin, currentPoints, maxBasePoints);
          }
        };
        content.appendChild(checkInBtn);
        const buttonContainer = document.createElement("div");
        buttonContainer.style.display = "flex";
        buttonContainer.style.gap = "10px";
        const backBtn = document.createElement("button");
        backBtn.textContent = "\u{1F3E0} \u8FD4\u56DE\u9762\u677F";
        backBtn.style.flex = "1";
        backBtn.onclick = () => {
          modal.close();
          plugin.showStats();
        };
        const closeBtn = document.createElement("button");
        closeBtn.textContent = "\u5173\u95ED";
        closeBtn.style.flex = "1";
        closeBtn.onclick = () => modal.close();
        buttonContainer.appendChild(backBtn);
        buttonContainer.appendChild(closeBtn);
        content.appendChild(buttonContainer);
        modal.contentEl.appendChild(content);
        modal.open();
      },
      async showCheckInConfirm(plugin, currentPoints, maxBasePoints) {
        const modal = new Modal(plugin.app);
        modal.titleEl.setText("\u26A0\uFE0F \u786E\u8BA4\u6253\u5361");
        const content = document.createElement("div");
        content.style.padding = "20px";
        content.style.textAlign = "center";
        content.innerHTML = `
      <div style="font-size: 48px; margin-bottom: 15px;">\u{1F4DD}</div>
      <div style="font-size: 18px; font-weight: bold; margin-bottom: 10px;">\u786E\u8BA4\u4ECA\u65E5\u6253\u5361\uFF1F</div>
      <div style="color: #888; margin-bottom: 15px;">
        \u4ECA\u65E5\u83B7\u5F97\u79EF\u5206\uFF1A<strong style="color: #00aaff;">${currentPoints}</strong><br>
        \u8DDD\u79BB\u5B8C\u7F8E\u6253\u5361\u8FD8\u9700\uFF1A<strong style="color: #ffd700;">${maxBasePoints - currentPoints}</strong> \u79EF\u5206
      </div>
      <div style="background: #ffaa0020; padding: 10px; border-radius: 5px; margin-bottom: 15px; color: #ffaa00; font-size: 13px;">
        \u{1F4A1} \u5B8C\u6210\u6240\u6709\u57FA\u7840\u4EFB\u52A1\u53EF\u83B7\u5F97\u5B8C\u7F8E\u6253\u5361\u5956\u52B1\uFF01
      </div>
    `;
        const buttonContainer = document.createElement("div");
        buttonContainer.style.display = "flex";
        buttonContainer.style.gap = "10px";
        const confirmBtn = document.createElement("button");
        confirmBtn.textContent = "\u2705 \u786E\u8BA4\u6253\u5361";
        confirmBtn.className = "mod-cta";
        confirmBtn.style.flex = "1";
        confirmBtn.onclick = async () => {
          modal.close();
          const stats = plugin.dataStore.getStats();
          stats.lastCheckInDate = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
          await plugin.dataStore.save();
          await Core3.processTodayNote(plugin);
        };
        const cancelBtn = document.createElement("button");
        cancelBtn.textContent = "\u7EE7\u7EED\u52AA\u529B";
        cancelBtn.style.flex = "1";
        cancelBtn.onclick = () => modal.close();
        buttonContainer.appendChild(confirmBtn);
        buttonContainer.appendChild(cancelBtn);
        content.appendChild(buttonContainer);
        modal.contentEl.appendChild(content);
        modal.open();
      },
      async showPerfectCheckIn(plugin, points) {
        const config = plugin.dataStore.config || plugin.dataStore.getDefaultConfig();
        const perfectReward = config.perfectCheckInReward || {
          enabled: true,
          rewardType: "exclusive",
          exclusiveItem: {
            name: "\u8D85\u7EA7\u5927\u94BB\u77F3",
            icon: "\u{1F48E}",
            description: "\u5B8C\u7F8E\u6253\u5361\u5956\u52B1",
            rarity: "legendary"
          },
          blessingTitle: "\u592A\u68D2\u4E86\uFF01\u4ECA\u65E5\u4EFB\u52A1\u5168\u90E8\u5B8C\u6210\uFF01",
          blessingMessage: "\u6BCF\u4E00\u6B21\u5B8C\u7F8E\u6253\u5361\uFF0C\u90FD\u662F\u5BF9\u81EA\u5DF1\u6700\u597D\u7684\u6295\u8D44\uFF01"
        };
        const modal = new Modal(plugin.app);
        modal.titleEl.setText("\u{1F31F} \u5B8C\u7F8E\u6253\u5361\uFF01");
        const content = document.createElement("div");
        content.style.padding = "20px";
        content.style.textAlign = "center";
        let rewardInfo = "";
        let rewardItem = null;
        if (perfectReward.enabled) {
          if (perfectReward.rewardType === "shop" && perfectReward.shopItemId) {
            const shopItems = plugin.dataStore.getShopItems() || [];
            rewardItem = shopItems.find((i) => i.id === perfectReward.shopItemId);
            if (rewardItem) {
              rewardInfo = `${rewardItem.icon} ${rewardItem.name}\u5DF2\u6DFB\u52A0\u5230\u80CC\u5305\uFF01`;
            }
          } else if (perfectReward.rewardType === "exclusive" && perfectReward.exclusiveItem) {
            const ex = perfectReward.exclusiveItem;
            rewardItem = {
              id: "exclusive-" + Date.now(),
              instanceId: "exclusive-instance-" + Date.now(),
              name: ex.name,
              description: ex.description,
              icon: ex.icon,
              category: "exclusive",
              rarity: ex.rarity || "rare",
              effect: ex.effect,
              obtainedAt: (/* @__PURE__ */ new Date()).toISOString()
            };
            rewardInfo = `${ex.icon} ${ex.name}\u5DF2\u6DFB\u52A0\u5230\u80CC\u5305\uFF01`;
          }
        }
        content.innerHTML = `
      <div style="font-size: 64px; margin-bottom: 20px;">\u{1F389}</div>
      <div style="font-size: 20px; font-weight: bold; margin-bottom: 15px; color: #ffd700;">${perfectReward.blessingTitle || "\u592A\u68D2\u4E86\uFF01\u4ECA\u65E5\u4EFB\u52A1\u5168\u90E8\u5B8C\u6210\uFF01"}</div>
      <div style="background: var(--background-secondary); padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <div style="color: #00aaff; font-size: 16px; margin-bottom: 10px;">\u{1F4CA} \u4ECA\u65E5\u79EF\u5206\uFF1A+${points}</div>
        ${rewardInfo ? `<div style="color: #ffd700; font-size: 14px;">${rewardInfo}</div>` : ""}
      </div>
      <div style="color: #888; font-size: 12px; margin-bottom: 15px;">
        \u2728 ${perfectReward.blessingMessage || "\u6BCF\u4E00\u6B21\u5B8C\u7F8E\u6253\u5361\uFF0C\u90FD\u662F\u5BF9\u81EA\u5DF1\u6700\u597D\u7684\u6295\u8D44\uFF01"}
      </div>
    `;
        if (perfectReward.enabled && rewardItem) {
          const stats = plugin.dataStore.getStats();
          if (!stats.inventory)
            stats.inventory = [];
          stats.inventory.push(rewardItem);
          await plugin.dataStore.save();
        }
        const statsForDate = plugin.dataStore.getStats();
        statsForDate.lastCheckInDate = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
        await plugin.dataStore.save();
        await Core3.processTodayNote(plugin);
        const closeBtn = document.createElement("button");
        closeBtn.textContent = "\u{1F64F} \u611F\u8C22\u795D\u798F";
        closeBtn.className = "mod-cta";
        closeBtn.style.width = "100%";
        closeBtn.onclick = () => modal.close();
        content.appendChild(closeBtn);
        modal.contentEl.appendChild(content);
        modal.open();
      }
    };
    module2.exports = UI2;
  }
});

// src/wish.js
var require_wish = __commonJS({
  "src/wish.js"(exports2, module2) {
    var { Modal, Notice } = require("obsidian");
    var Core3 = require_core();
    var Wish2 = {
      showWishModal(plugin) {
        const modal = new Modal(plugin.app);
        modal.titleEl.setText("\u{1F31F} \u8BB8\u4E0B\u613F\u671B");
        const content = document.createElement("div");
        content.style.padding = "20px";
        content.innerHTML = `
      <div style="margin-bottom: 5px;">\u613F\u671B\u540D\u79F0\uFF1A</div>
      <input type="text" id="wish-name" placeholder="\u4F8B\u5982\uFF1A\u987A\u5229\u901A\u8FC7\u8003\u8BD5" style="width: 100%; margin-bottom: 15px;">
      <div style="margin-bottom: 5px;">\u613F\u671B\u63CF\u8FF0\uFF08\u53EF\u9009\uFF09\uFF1A</div>
      <textarea id="wish-desc" placeholder="\u8BE6\u7EC6\u63CF\u8FF0\u4F60\u7684\u613F\u671B..." style="width: 100%; height: 80px; margin-bottom: 15px;"></textarea>
      <div style="color: #666; font-size: 12px; margin-bottom: 15px; padding: 10px; background: var(--background-secondary); border-radius: 5px;">
        \u{1F4A1} \u521B\u5EFA\u613F\u671B\u540E\uFF0C\u5728\u8BB8\u613F\u6C60\u4E2D\u70B9\u51FB"\u6295\u5165"\u6309\u94AE\u6D88\u8017\u613F\u661F\u6765\u6270\u52A8\u4E16\u754C\u7EBF<br>\u6BCF\u9897\u613F\u661F\u589E\u52A010%\u8FDB\u5EA6\uFF0C\u586B\u6EE1100%\u5373\u53EF\u5B8C\u6210\u8BB8\u613F
      </div>
    `;
        const buttonContainer = document.createElement("div");
        buttonContainer.style.display = "flex";
        buttonContainer.style.gap = "10px";
        const confirmBtn = document.createElement("button");
        confirmBtn.textContent = "\u2728 \u521B\u5EFA\u613F\u671B";
        confirmBtn.className = "mod-cta";
        confirmBtn.style.flex = "1";
        confirmBtn.onclick = async () => {
          const name = document.getElementById("wish-name").value.trim();
          if (!name) {
            new Notice("\u274C \u8BF7\u8F93\u5165\u613F\u671B\u540D\u79F0");
            return;
          }
          const result = await plugin.dataStore.makeWish(name, document.getElementById("wish-desc").value.trim());
          if (result.success) {
            Core3.updateStatusBar(plugin);
            modal.close();
            new Notice(result.message);
          }
        };
        const cancelBtn = document.createElement("button");
        cancelBtn.textContent = "\u53D6\u6D88";
        cancelBtn.style.flex = "1";
        cancelBtn.onclick = () => modal.close();
        buttonContainer.appendChild(confirmBtn);
        buttonContainer.appendChild(cancelBtn);
        content.appendChild(buttonContainer);
        modal.contentEl.appendChild(content);
        modal.open();
      },
      showWishPool(plugin) {
        const stats = plugin.dataStore.getStats();
        const wishes = stats.wishes || [];
        const activeWishes = wishes.filter((w) => w.status === "active");
        const completedWishes = wishes.filter((w) => w.status === "completed");
        const modal = new Modal(plugin.app);
        modal.titleEl.setText("\u26F2 \u8BB8\u613F\u6C60");
        const content = document.createElement("div");
        content.style.padding = "20px";
        const starInfo = document.createElement("div");
        starInfo.style.cssText = "margin-bottom: 20px; padding: 10px; background-color: var(--background-secondary); border-radius: 5px;";
        starInfo.innerHTML = "\u2B50 \u5F53\u524D\u613F\u661F\uFF1A" + stats.wishStars + " &nbsp;&nbsp; \u2728 \u5DF2\u5B8C\u6210\u613F\u671B\uFF1A" + completedWishes.length;
        content.appendChild(starInfo);
        if (activeWishes.length > 0) {
          const activeLabel = document.createElement("div");
          activeLabel.style.cssText = "font-weight: bold; margin-bottom: 10px;";
          activeLabel.textContent = "\u{1F4E8} \u8FDB\u884C\u4E2D\u7684\u613F\u671B";
          content.appendChild(activeLabel);
          for (const wish of activeWishes) {
            const wishDiv = document.createElement("div");
            wishDiv.style.cssText = "padding: 15px; margin-bottom: 10px; border: 1px solid var(--border-color); border-radius: 8px;";
            wishDiv.id = "wish-" + wish.id;
            wishDiv.innerHTML = `
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
            <span style="font-weight: bold;">${wish.name}</span>
            <span id="progress-text-${wish.id}" style="color: #ffd700; font-weight: bold;">${wish.progress}%</span>
          </div>
          <div style="background: var(--background-secondary); height: 12px; border-radius: 6px; overflow: hidden; margin-bottom: 10px;">
            <div id="progress-bar-${wish.id}" style="background: linear-gradient(90deg, #ffd700, #ffaa00); height: 100%; width: ${wish.progress}%; transition: width 0.3s;"></div>
          </div>
        `;
            if (wish.progress >= 100) {
              const completeBtn = document.createElement("button");
              completeBtn.textContent = "\u{1F31F} \u5B8C\u6210\u8BB8\u613F";
              completeBtn.className = "mod-cta";
              completeBtn.style.width = "100%";
              completeBtn.onclick = async () => {
                const result = await plugin.dataStore.completeWish(wish.id);
                if (result.success) {
                  Core3.updateStatusBar(plugin);
                  modal.close();
                  this.showWishCompletedModal(plugin, result);
                }
              };
              wishDiv.appendChild(completeBtn);
            } else {
              const investBtn = document.createElement("button");
              investBtn.textContent = "\u2728 \u6295\u5165 (\u6D88\u80171\u613F\u661F)";
              investBtn.className = "mod-cta";
              investBtn.style.width = "100%";
              investBtn.disabled = stats.wishStars < 1;
              if (stats.wishStars < 1)
                investBtn.style.opacity = "0.5";
              investBtn.onclick = async () => {
                if (stats.wishStars < 1) {
                  new Notice("\u274C \u613F\u661F\u4E0D\u8DB3\uFF01");
                  return;
                }
                const result = await plugin.dataStore.boostWish(wish.id, 1);
                if (result.success) {
                  Core3.updateStatusBar(plugin);
                  if (result.completed) {
                    modal.close();
                    this.showWishCompletedModal(plugin, result);
                  } else {
                    document.getElementById("progress-bar-" + wish.id).style.width = result.wish.progress + "%";
                    document.getElementById("progress-text-" + wish.id).textContent = result.wish.progress + "%";
                    if (result.wish.progress >= 100) {
                      investBtn.disabled = true;
                      investBtn.style.opacity = "0.5";
                      investBtn.textContent = "\u2705 \u5DF2\u5B8C\u6210";
                    }
                    const newStats = plugin.dataStore.getStats();
                    starInfo.innerHTML = "\u2B50 \u5F53\u524D\u613F\u661F\uFF1A" + newStats.wishStars + " &nbsp;&nbsp; \u2728 \u5DF2\u5B8C\u6210\u613F\u671B\uFF1A" + completedWishes.length;
                    new Notice("\u2728 \u6295\u5165\u6210\u529F\uFF01\u8FDB\u5EA6 +10%");
                  }
                }
              };
              wishDiv.appendChild(investBtn);
            }
            content.appendChild(wishDiv);
          }
        } else {
          const emptyDiv = document.createElement("div");
          emptyDiv.style.cssText = "text-align: center; color: #888; padding: 20px;";
          emptyDiv.textContent = "\u{1F4ED} \u6682\u65E0\u8FDB\u884C\u4E2D\u7684\u613F\u671B";
          content.appendChild(emptyDiv);
        }
        const newWishBtn = document.createElement("button");
        newWishBtn.textContent = "\u{1F31F} \u8BB8\u4E0B\u65B0\u613F\u671B";
        newWishBtn.style.width = "100%";
        newWishBtn.style.marginTop = "10px";
        newWishBtn.onclick = () => {
          modal.close();
          this.showWishModal(plugin);
        };
        content.appendChild(newWishBtn);
        const buttonContainer = document.createElement("div");
        buttonContainer.style.display = "flex";
        buttonContainer.style.gap = "10px";
        buttonContainer.style.marginTop = "10px";
        const backBtn = document.createElement("button");
        backBtn.textContent = "\u{1F3E0} \u8FD4\u56DE\u9762\u677F";
        backBtn.style.flex = "1";
        backBtn.onclick = () => {
          modal.close();
          plugin.showStats();
        };
        const closeBtn = document.createElement("button");
        closeBtn.textContent = "\u5173\u95ED";
        closeBtn.style.flex = "1";
        closeBtn.onclick = () => modal.close();
        buttonContainer.appendChild(backBtn);
        buttonContainer.appendChild(closeBtn);
        content.appendChild(buttonContainer);
        modal.contentEl.appendChild(content);
        modal.open();
      },
      showWishCompletedModal(plugin, result) {
        const modal = new Modal(plugin.app);
        modal.titleEl.setText("\u{1F31F} \u4E16\u754C\u7EBF\u6270\u52A8\u6210\u529F\uFF01");
        const content = document.createElement("div");
        content.style.padding = "20px";
        content.style.textAlign = "center";
        content.innerHTML = `
      <div style="font-size: 64px; margin-bottom: 20px;">\u2728</div>
      <div style="font-size: 18px; font-weight: bold; margin-bottom: 15px;">\u613F\u671B\u5DF2\u8BB0\u5F55\u4E8E\u4E16\u754C\u7EBF\u4E4B\u4E2D</div>
      <div style="background: var(--background-secondary); padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <div style="color: #ffd700; font-size: 14px; margin-bottom: 10px;">\u{1F340} \u597D\u8FD0\u6C14\u52A0\u6210\u5DF2\u751F\u6548\uFF08\u6301\u7EED24\u5C0F\u65F6\uFF09</div>
        ${result.bonusPoints ? '<div style="color: #00ff00; font-size: 14px;">\u26A1 \u5956\u52B1\u79EF\u5206 +' + result.bonusPoints + "</div>" : ""}
      </div>
      <div style="color: #888; font-size: 12px; margin-bottom: 15px;">
        ${result.blessings ? result.blessings.map((b) => "\u2728 " + b).join("<br>") : ""}
      </div>
    `;
        const closeBtn = document.createElement("button");
        closeBtn.textContent = "\u{1F64F} \u611F\u8C22\u661F\u4E4B\u795D\u798F";
        closeBtn.className = "mod-cta";
        closeBtn.style.width = "100%";
        closeBtn.onclick = () => modal.close();
        content.appendChild(closeBtn);
        modal.contentEl.appendChild(content);
        modal.open();
      }
    };
    module2.exports = Wish2;
  }
});

// src/shop.js
var require_shop = __commonJS({
  "src/shop.js"(exports2, module2) {
    var { Modal, Notice } = require("obsidian");
    var Core3 = require_core();
    var Shop2 = {
      showShop(plugin) {
        var _a;
        const stats = plugin.dataStore.getStats();
        const items = plugin.dataStore.getShopItems();
        const modal = new Modal(plugin.app);
        modal.titleEl.setText(((_a = plugin.dataStore.shopConfig) == null ? void 0 : _a.shopName) || "\u{1F3B4} \u9053\u5177\u5546\u57CE");
        const content = document.createElement("div");
        content.style.padding = "20px";
        const infoDiv = document.createElement("div");
        infoDiv.style.cssText = "margin-bottom: 20px; padding: 10px; background-color: var(--background-secondary); border-radius: 5px;";
        infoDiv.innerHTML = "\u{1F3B4} \u7A00\u6709\u9053\u5177\u5361\uFF1A" + stats.rareItemCards + " &nbsp;&nbsp; \u{1F320} \u4F20\u5947\u9053\u5177\u5361\uFF1A" + stats.legendaryItemCards;
        content.appendChild(infoDiv);
        const itemList = document.createElement("div");
        itemList.style.cssText = "max-height: 300px; overflow-y: auto;";
        for (const item of items) {
          const canAfford = item.rarity === "rare" && stats.rareItemCards >= item.price || item.rarity === "legendary" && stats.legendaryItemCards >= item.price;
          const itemDiv = document.createElement("div");
          itemDiv.style.cssText = "padding: 12px; margin-bottom: 10px; border: 1px solid var(--border-color); border-radius: 5px; opacity: " + (canAfford ? "1" : "0.6") + ";";
          const categoryTag = item.category === "system" ? '<span style="background: #00aaff20; color: #00aaff; padding: 2px 6px; border-radius: 3px; font-size: 10px; margin-left: 5px;">\u7CFB\u7EDF</span>' : '<span style="background: #ffaa0020; color: #ffaa00; padding: 2px 6px; border-radius: 3px; font-size: 10px; margin-left: 5px;">\u5916\u90E8</span>';
          itemDiv.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div><span style="font-size: 20px; margin-right: 10px;">${item.icon}</span><strong>${item.name}</strong>${categoryTag}${item.rarity === "legendary" ? '<span style="color: #ffd700; margin-left: 5px;">\u{1F320}</span>' : '<span style="color: #9966ff; margin-left: 5px;">\u{1F3B4}</span>'}</div>
          <div>${item.rarity === "legendary" ? "\u{1F320}" : "\u{1F3B4}"} \xD7${item.price}</div>
        </div>
        <div style="color: #888; font-size: 12px; margin-top: 5px;">${item.description}</div>
      `;
          if (canAfford) {
            itemDiv.style.cursor = "pointer";
            itemDiv.onclick = () => this.showPurchaseConfirm(plugin, item, modal);
          }
          itemList.appendChild(itemDiv);
        }
        content.appendChild(itemList);
        const buttonContainer = document.createElement("div");
        buttonContainer.style.display = "flex";
        buttonContainer.style.gap = "10px";
        buttonContainer.style.marginTop = "10px";
        const backBtn = document.createElement("button");
        backBtn.textContent = "\u{1F3E0} \u8FD4\u56DE\u9762\u677F";
        backBtn.style.flex = "1";
        backBtn.onclick = () => {
          modal.close();
          plugin.showStats();
        };
        const closeBtn = document.createElement("button");
        closeBtn.textContent = "\u5173\u95ED";
        closeBtn.style.flex = "1";
        closeBtn.onclick = () => modal.close();
        buttonContainer.appendChild(backBtn);
        buttonContainer.appendChild(closeBtn);
        content.appendChild(buttonContainer);
        modal.contentEl.appendChild(content);
        modal.open();
      },
      showPurchaseConfirm(plugin, item, shopModal) {
        const modal = new Modal(plugin.app);
        modal.titleEl.setText("\u26A0\uFE0F \u786E\u8BA4\u8D2D\u4E70");
        const content = document.createElement("div");
        content.style.padding = "20px";
        content.style.textAlign = "center";
        content.innerHTML = `
      <div style="font-size: 48px; margin-bottom: 15px;">${item.icon}</div>
      <div style="font-size: 18px; font-weight: bold; margin-bottom: 10px;">${item.name}</div>
      <div style="color: #888; margin-bottom: 15px;">${item.description}</div>
      <div style="background: var(--background-secondary); padding: 10px; border-radius: 5px; margin-bottom: 15px;">
        \u786E\u5B9A\u8981\u8D2D\u4E70\u6B64\u5546\u54C1\u5417\uFF1F<br>\u5C06\u6D88\u8017 <strong>${item.rarity === "legendary" ? "\u{1F320}" : "\u{1F3B4}"} ${item.price}</strong> \u5F20${item.rarity === "legendary" ? "\u4F20\u5947" : "\u7A00\u6709"}\u9053\u5177\u5361
      </div>
    `;
        const buttonContainer = document.createElement("div");
        buttonContainer.style.display = "flex";
        buttonContainer.style.gap = "10px";
        buttonContainer.style.marginTop = "20px";
        const confirmBtn = document.createElement("button");
        confirmBtn.textContent = "\u2705 \u786E\u8BA4\u8D2D\u4E70";
        confirmBtn.className = "mod-cta";
        confirmBtn.style.flex = "1";
        confirmBtn.onclick = async () => {
          const result = await plugin.dataStore.purchaseItem(item.id);
          new Notice(result.message);
          if (result.success) {
            Core3.updateStatusBar(plugin);
            modal.close();
            shopModal.close();
            this.showShop(plugin);
          }
        };
        const cancelBtn = document.createElement("button");
        cancelBtn.textContent = "\u53D6\u6D88";
        cancelBtn.style.flex = "1";
        cancelBtn.onclick = () => modal.close();
        buttonContainer.appendChild(confirmBtn);
        buttonContainer.appendChild(cancelBtn);
        content.appendChild(buttonContainer);
        modal.contentEl.appendChild(content);
        modal.open();
      }
    };
    module2.exports = Shop2;
  }
});

// src/inventory.js
var require_inventory = __commonJS({
  "src/inventory.js"(exports2, module2) {
    var { Modal, Notice } = require("obsidian");
    var Core3 = require_core();
    var Inventory2 = {
      showInventory(plugin) {
        const stats = plugin.dataStore.getStats();
        const inventory = stats.inventory || [];
        const modal = new Modal(plugin.app);
        modal.titleEl.setText("\u{1F392} \u80CC\u5305");
        const content = document.createElement("div");
        content.style.padding = "20px";
        if (inventory.length === 0) {
          content.innerHTML = '<div style="text-align: center; color: #888; padding: 40px;">\u80CC\u5305\u7A7A\u7A7A\u5982\u4E5F\uFF5E<br>\u53BB\u5546\u57CE\u8D2D\u4E70\u4E9B\u5546\u54C1\u5427\uFF01</div>';
        } else {
          const itemCounts = {};
          for (const item of inventory) {
            const key = item.name + "|" + item.icon;
            if (!itemCounts[key]) {
              itemCounts[key] = { ...item, count: 0, instanceIds: [] };
            }
            itemCounts[key].count++;
            if (item.instanceId) {
              itemCounts[key].instanceIds.push(item.instanceId);
            }
          }
          const itemList = document.createElement("div");
          itemList.style.cssText = "max-height: 400px; overflow-y: auto;";
          for (const key in itemCounts) {
            const item = itemCounts[key];
            const itemDiv = document.createElement("div");
            itemDiv.style.cssText = "padding: 12px; margin-bottom: 10px; border: 1px solid var(--border-color); border-radius: 5px; cursor: pointer;";
            const categoryTag = item.category === "system" ? '<span style="background: #00aaff20; color: #00aaff; padding: 2px 6px; border-radius: 3px; font-size: 10px;">\u7CFB\u7EDF</span>' : '<span style="background: #ffaa0020; color: #ffaa00; padding: 2px 6px; border-radius: 3px; font-size: 10px;">\u5916\u90E8</span>';
            const rarityTag = item.rarity === "legendary" ? '<span style="color: #ffd700; margin-left: 5px;">\u{1F320}</span>' : '<span style="color: #9966ff; margin-left: 5px;">\u{1F3B4}</span>';
            itemDiv.innerHTML = `
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <div><span style="font-size: 24px; margin-right: 10px;">${item.icon}</span><strong>${item.name}</strong>${categoryTag}${rarityTag}</div>
            <div style="display: flex; align-items: center; gap: 10px;">
              <span style="background: var(--background-secondary); padding: 4px 10px; border-radius: 12px; font-size: 12px; font-weight: bold;">x${item.count}</span>
              <span style="color: #888; font-size: 12px;">\u70B9\u51FB\u4F7F\u7528</span>
            </div>
          </div>
          <div style="color: #666; font-size: 12px; margin-top: 5px;">${item.description}</div>
        `;
            itemDiv.onclick = () => {
              if (item.instanceIds.length > 0) {
                this.showUseConfirm(plugin, { ...item, instanceId: item.instanceIds[0] }, modal);
              }
            };
            itemDiv.onmouseenter = () => {
              itemDiv.style.background = "var(--background-secondary)";
            };
            itemDiv.onmouseleave = () => {
              itemDiv.style.background = "transparent";
            };
            itemList.appendChild(itemDiv);
          }
          content.appendChild(itemList);
        }
        const buttonContainer = document.createElement("div");
        buttonContainer.style.display = "flex";
        buttonContainer.style.gap = "10px";
        buttonContainer.style.marginTop = "10px";
        const backBtn = document.createElement("button");
        backBtn.textContent = "\u{1F3E0} \u8FD4\u56DE\u9762\u677F";
        backBtn.style.flex = "1";
        backBtn.onclick = () => {
          modal.close();
          plugin.showStats();
        };
        const closeBtn = document.createElement("button");
        closeBtn.textContent = "\u5173\u95ED";
        closeBtn.style.flex = "1";
        closeBtn.onclick = () => modal.close();
        buttonContainer.appendChild(backBtn);
        buttonContainer.appendChild(closeBtn);
        content.appendChild(buttonContainer);
        modal.contentEl.appendChild(content);
        modal.open();
      },
      showUseConfirm(plugin, item, inventoryModal) {
        const modal = new Modal(plugin.app);
        modal.titleEl.setText("\u{1F3AF} \u4F7F\u7528\u7269\u54C1");
        const content = document.createElement("div");
        content.style.padding = "20px";
        content.style.textAlign = "center";
        content.innerHTML = `
      <div style="font-size: 48px; margin-bottom: 15px;">${item.icon}</div>
      <div style="font-size: 18px; font-weight: bold; margin-bottom: 10px;">${item.name}</div>
      <div style="color: #888; margin-bottom: 15px;">${item.description}</div>
      ${item.category === "external" ? '<div style="background: #ffaa0020; padding: 10px; border-radius: 5px; margin-bottom: 15px; color: #ffaa00; font-size: 14px;">\u26A0\uFE0F \u8FD9\u662F\u5916\u90E8\u5546\u54C1<br>\u4F7F\u7528\u540E\u8BF7\u8BB0\u5F97\u81EA\u884C\u5151\u73B0\u627F\u8BFA\u54E6\uFF01</div>' : ""}
    `;
        const buttonContainer = document.createElement("div");
        buttonContainer.style.display = "flex";
        buttonContainer.style.gap = "10px";
        buttonContainer.style.marginTop = "20px";
        const confirmBtn = document.createElement("button");
        confirmBtn.textContent = item.category === "system" ? "\u2705 \u4F7F\u7528" : "\u26A0\uFE0F \u4F7F\u7528\u5E76\u627F\u8BFA";
        confirmBtn.className = "mod-cta";
        confirmBtn.style.flex = "1";
        confirmBtn.onclick = async () => {
          const result = await plugin.dataStore.useItem(item.instanceId);
          new Notice(result.message);
          if (result.success) {
            Core3.updateStatusBar(plugin);
            modal.close();
            if (inventoryModal)
              inventoryModal.close();
            this.showInventory(plugin);
          }
        };
        const cancelBtn = document.createElement("button");
        cancelBtn.textContent = "\u53D6\u6D88";
        cancelBtn.style.flex = "1";
        cancelBtn.onclick = () => modal.close();
        buttonContainer.appendChild(confirmBtn);
        buttonContainer.appendChild(cancelBtn);
        content.appendChild(buttonContainer);
        modal.contentEl.appendChild(content);
        modal.open();
      }
    };
    module2.exports = Inventory2;
  }
});

// src/settings.js
var require_settings = __commonJS({
  "src/settings.js"(exports2, module2) {
    var { PluginSettingTab, Setting, Notice, Modal } = require("obsidian");
    var { renderEffectParams, buildEffectFromForm } = require_utils();
    var SupremePlayerSettingTab2 = class extends PluginSettingTab {
      constructor(app, plugin) {
        super(app, plugin);
        this.plugin = plugin;
      }
      setupPathAutocomplete(inputEl, fileExtension) {
        let suggestionEl = null;
        let currentSuggestions = [];
        const showSuggestions = (suggestions) => {
          hideSuggestions();
          if (suggestions.length === 0)
            return;
          suggestionEl = document.createElement("div");
          suggestionEl.className = "suggestion-container";
          suggestionEl.style.cssText = `
        position: absolute;
        background: var(--background-primary);
        border: 1px solid var(--background-modifier-border);
        border-radius: 4px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        max-height: 200px;
        overflow-y: auto;
        z-index: 10000;
        min-width: 300px;
      `;
          const inputRect = inputEl.getBoundingClientRect();
          suggestionEl.style.top = `${inputRect.bottom + window.scrollY}px`;
          suggestionEl.style.left = `${inputRect.left + window.scrollX}px`;
          suggestions.forEach((path) => {
            const item = document.createElement("div");
            item.className = "suggestion-item";
            item.style.cssText = `
          padding: 8px 12px;
          cursor: pointer;
          border-bottom: 1px solid var(--background-modifier-border);
          font-size: 13px;
        `;
            item.textContent = path;
            item.onmouseenter = () => {
              item.style.background = "var(--background-secondary)";
            };
            item.onmouseleave = () => {
              item.style.background = "transparent";
            };
            item.onclick = () => {
              inputEl.value = path;
              inputEl.dispatchEvent(new Event("input", { bubbles: true }));
              hideSuggestions();
            };
            suggestionEl.appendChild(item);
          });
          document.body.appendChild(suggestionEl);
          currentSuggestions = suggestions;
        };
        const hideSuggestions = () => {
          if (suggestionEl) {
            suggestionEl.remove();
            suggestionEl = null;
          }
          currentSuggestions = [];
        };
        const searchFiles = (query) => {
          if (!query || query.length < 1) {
            hideSuggestions();
            return;
          }
          const files = this.app.vault.getFiles();
          const suggestions = [];
          const queryLower = query.toLowerCase();
          for (const file of files) {
            if (fileExtension && !file.path.endsWith(fileExtension))
              continue;
            if (file.path.toLowerCase().includes(queryLower)) {
              suggestions.push(file.path);
              if (suggestions.length >= 10)
                break;
            }
          }
          showSuggestions(suggestions);
        };
        inputEl.addEventListener("input", (e) => searchFiles(e.target.value));
        inputEl.addEventListener("focus", (e) => {
          if (e.target.value)
            searchFiles(e.target.value);
        });
        inputEl.addEventListener("blur", () => setTimeout(hideSuggestions, 200));
        inputEl.addEventListener("keydown", (e) => {
          if (e.key === "Escape")
            hideSuggestions();
        });
      }
      display() {
        const { containerEl } = this;
        containerEl.empty();
        containerEl.createEl("h2", { text: "\u{1F31F} \u8D85\u8D8A\u73A9\u5BB6\u7CFB\u7EDF\u8BBE\u7F6E" });
        containerEl.createEl("h3", { text: "\u{1F464} \u7528\u6237\u4FE1\u606F" });
        new Setting(containerEl).setName("\u73A9\u5BB6\u540D\u79F0").setDesc("\u8BBE\u7F6E\u4F60\u7684\u6E38\u620F\u540D\u79F0\uFF0C\u5C06\u663E\u793A\u5728\u72B6\u6001\u9762\u677F\u4E2D").addText((text) => {
          const stats = this.plugin.dataStore.getStats();
          text.setPlaceholder("\u73A9\u5BB6").setValue(stats.playerName || "\u73A9\u5BB6").onChange(async (value) => {
            const stats2 = this.plugin.dataStore.getStats();
            stats2.playerName = value || "\u73A9\u5BB6";
            await this.plugin.dataStore.save();
          });
          text.inputEl.style.width = "200px";
        });
        containerEl.createEl("h3", { text: "\u2699\uFE0F \u6570\u636E\u5B58\u50A8" });
        new Setting(containerEl).setName("\u6570\u636E\u5B58\u50A8\u4F4D\u7F6E").setDesc("\u8D26\u6237\u4FE1\u606F\u5B58\u50A8\u6587\u4EF6\u8DEF\u5F84\uFF08\u7559\u7A7A\u5219\u81EA\u52A8\u68C0\u6D4B\u65E5\u8BB0\u6587\u4EF6\u5939\uFF09").addText((text) => {
          var _a;
          text.setPlaceholder(this.plugin.dataStore.autoDetectDataPath()).setValue(((_a = this.plugin.dataStore.config) == null ? void 0 : _a.dataFilePath) || "").onChange(async (value) => {
            if (this.plugin.dataStore.config) {
              this.plugin.dataStore.config.dataFilePath = value;
              await this.plugin.dataStore.saveConfig();
            }
          });
          this.setupPathAutocomplete(text.inputEl, ".json");
        }).addButton((button) => button.setButtonText("\u{1F50D} \u81EA\u52A8\u68C0\u6D4B").onClick(async () => {
          const detected = this.plugin.dataStore.autoDetectDataPath();
          if (this.plugin.dataStore.config) {
            this.plugin.dataStore.config.dataFilePath = detected;
            await this.plugin.dataStore.saveConfig();
          }
          new Notice(`\u2705 \u5DF2\u68C0\u6D4B\u5230: ${detected}`);
          this.display();
        }));
        containerEl.createEl("h3", { text: "\u{1F4DD} \u65E5\u8BB0\u6A21\u677F" });
        new Setting(containerEl).setName("\u6A21\u677F\u6587\u4EF6\u4F4D\u7F6E").setDesc("\u65E5\u8BB0\u6A21\u677F\u6587\u4EF6\u7684\u8DEF\u5F84\uFF08\u7559\u7A7A\u5219\u81EA\u52A8\u68C0\u6D4B\u65E5\u8BB0\u6A21\u677F\uFF09").addText((text) => {
          var _a;
          text.setPlaceholder(this.plugin.dataStore.autoDetectTemplatePath()).setValue(((_a = this.plugin.dataStore.config) == null ? void 0 : _a.templatePath) || "").onChange(async (value) => {
            if (this.plugin.dataStore.config) {
              this.plugin.dataStore.config.templatePath = value;
              await this.plugin.dataStore.saveConfig();
            }
          });
          this.setupPathAutocomplete(text.inputEl, ".md");
        }).addButton((button) => button.setButtonText("\u{1F50D} \u81EA\u52A8\u68C0\u6D4B").onClick(async () => {
          const detected = this.plugin.dataStore.autoDetectTemplatePath();
          if (this.plugin.dataStore.config) {
            this.plugin.dataStore.config.templatePath = detected;
            await this.plugin.dataStore.saveConfig();
          }
          new Notice(`\u2705 \u5DF2\u68C0\u6D4B\u5230: ${detected}`);
          this.display();
        }));
        new Setting(containerEl).setName("\u66F4\u65B0\u65E5\u8BB0\u6A21\u677F").setDesc("\u6839\u636E\u5F53\u524D\u6BCF\u65E5\u4EFB\u52A1\u914D\u7F6E\u66F4\u65B0\u65E5\u8BB0\u6A21\u677F\u6587\u4EF6").addButton((button) => button.setButtonText("\u{1F4DD} \u66F4\u65B0\u6A21\u677F").onClick(() => this.updateDailyTemplate()));
        new Setting(containerEl).setName("\u{1F513} \u89E3\u9501\u7F16\u8F91\u529F\u80FD").setDesc("\u9700\u8981\u8FDE\u7EED\u70B9\u51FB42\u6B21\u6309\u94AE\u624D\u80FD\u89E3\u9501\u7F16\u8F91\u529F\u80FD\uFF0C\u89E3\u9501\u540E30\u5206\u949F\u81EA\u52A8\u4E0A\u9501").addButton((button) => {
          button.setButtonText(this.plugin.lockState.unlocked ? "\u{1F513} \u5DF2\u89E3\u9501" : "\u{1F512} \u70B9\u51FB\u89E3\u9501");
          button.onClick(() => this.handleUnlockClick(button));
        });
        if (this.plugin.lockState.unlocked) {
          this.addUnlockedSettings(containerEl);
        }
      }
      handleUnlockClick(button) {
        if (this.plugin.lockState.unlocked) {
          const now = Date.now();
          const unlockTime = this.plugin.lockState.unlockTime || 0;
          const timeSinceUnlock = now - unlockTime;
          if (timeSinceUnlock < 15e3) {
            const remainingSeconds = Math.ceil((15e3 - timeSinceUnlock) / 1e3);
            new Notice(`\u23F3 \u8BF7\u7B49\u5F85 ${remainingSeconds} \u79D2\u540E\u624D\u80FD\u4E0A\u9501`);
            return;
          }
          if (this.plugin.lockState.lastLockAttempt && now - this.plugin.lockState.lastLockAttempt < 15e3) {
            this.plugin.lockState.lockConfirmCount = (this.plugin.lockState.lockConfirmCount || 0) + 1;
            const remaining2 = 3 - this.plugin.lockState.lockConfirmCount;
            if (remaining2 > 0) {
              button.setButtonText(`\u{1F512} \u786E\u8BA4\u4E0A\u9501? (${remaining2}\u6B21)`);
              return;
            }
          } else {
            this.plugin.lockState.lockConfirmCount = 1;
            this.plugin.lockState.lastLockAttempt = now;
            button.setButtonText("\u{1F512} \u786E\u8BA4\u4E0A\u9501? (2\u6B21)");
            return;
          }
          this.plugin.lockState.unlocked = false;
          this.plugin.lockState.clickCount = 0;
          this.plugin.lockState.lockConfirmCount = 0;
          this.plugin.lockState.lastLockAttempt = null;
          if (this.plugin.lockState.autoLockTimer) {
            clearTimeout(this.plugin.lockState.autoLockTimer);
            this.plugin.lockState.autoLockTimer = null;
          }
          button.setButtonText("\u{1F512} \u70B9\u51FB\u89E3\u9501");
          new Notice("\u{1F512} \u7F16\u8F91\u529F\u80FD\u5DF2\u4E0A\u9501");
          this.display();
          return;
        }
        this.plugin.lockState.clickCount++;
        const remaining = 42 - this.plugin.lockState.clickCount;
        if (remaining <= 0) {
          this.plugin.lockState.unlocked = true;
          this.plugin.lockState.unlockTime = Date.now();
          this.plugin.lockState.lockConfirmCount = 0;
          button.setButtonText("\u{1F513} \u5DF2\u89E3\u9501");
          new Notice("\u{1F513} \u7F16\u8F91\u529F\u80FD\u5DF2\u89E3\u9501\uFF0130\u5206\u949F\u540E\u81EA\u52A8\u4E0A\u9501");
          this.plugin.lockState.autoLockTimer = setTimeout(() => {
            this.plugin.lockState.unlocked = false;
            this.plugin.lockState.clickCount = 0;
            new Notice("\u{1F512} \u7F16\u8F91\u529F\u80FD\u5DF2\u81EA\u52A8\u4E0A\u9501");
            this.display();
          }, 30 * 60 * 1e3);
          this.display();
        } else {
          button.setButtonText(`\u{1F512} \u8FD8\u9700\u70B9\u51FB ${remaining} \u6B21`);
        }
      }
      addUnlockedSettings(containerEl) {
        containerEl.createEl("h3", { text: "\u2699 \u6BCF\u65E5\u4EFB\u52A1\u914D\u7F6E" });
        new Setting(containerEl).setName("\u914D\u7F6E\u6BCF\u65E5\u4EFB\u52A1").setDesc("\u914D\u7F6E\u6BCF\u65E5\u4EFB\u52A1\u3001\u4E60\u60EF\u3001\u989D\u5916\u4EFB\u52A1\u548C\u756A\u8304\u949F\u7684\u6570\u91CF\u4E0E\u79EF\u5206").addButton((button) => button.setButtonText("\u2699\uFE0F \u914D\u7F6E").onClick(() => this.showDailyTasksConfigModal()));
        containerEl.createEl("h3", { text: "\u{1F31F} \u5B8C\u7F8E\u6253\u5361\u914D\u7F6E" });
        new Setting(containerEl).setName("\u914D\u7F6E\u5B8C\u7F8E\u6253\u5361\u5956\u52B1").setDesc("\u8BBE\u7F6E\u5B8C\u7F8E\u6253\u5361\u7684\u5956\u52B1\u7269\u54C1\u548C\u795D\u798F\u8BED").addButton((button) => button.setButtonText("\u2699\uFE0F \u914D\u7F6E").onClick(() => this.showPerfectCheckInConfigModal()));
        containerEl.createEl("h3", { text: "\u{1F4E6} \u5546\u54C1\u7BA1\u7406" });
        new Setting(containerEl).setName("\u6DFB\u52A0\u5546\u54C1").setDesc("\u6DFB\u52A0\u65B0\u7684\u81EA\u5B9A\u4E49\u5546\u54C1\u5230\u5546\u57CE").addButton((button) => button.setButtonText("\u2795 \u6DFB\u52A0").onClick(() => this.showAddItemModal()));
        new Setting(containerEl).setName("\u7F16\u8F91\u5546\u54C1").setDesc("\u7F16\u8F91\u5DF2\u6709\u7684\u81EA\u5B9A\u4E49\u5546\u54C1").addButton((button) => button.setButtonText("\u270F\uFE0F \u7F16\u8F91").onClick(() => this.showEditItemModal()));
        new Setting(containerEl).setName("\u5220\u9664\u5546\u54C1").setDesc("\u5220\u9664\u81EA\u5B9A\u4E49\u5546\u54C1").addButton((button) => button.setButtonText("\u{1F5D1}\uFE0F \u5220\u9664").onClick(() => this.showDeleteItemModal()));
        new Setting(containerEl).setName("\u5BFC\u51FA\u5546\u54C1\u914D\u7F6E").setDesc("\u5BFC\u51FA\u81EA\u5B9A\u4E49\u5546\u54C1\u914D\u7F6E\u4E3AJSON\u6587\u4EF6").addButton((button) => button.setButtonText("\u{1F4E4} \u5BFC\u51FA").onClick(() => this.exportShopConfig()));
        new Setting(containerEl).setName("\u5BFC\u5165\u5546\u54C1\u914D\u7F6E").setDesc("\u4ECEJSON\u6587\u4EF6\u5BFC\u5165\u5546\u54C1\u914D\u7F6E").addButton((button) => button.setButtonText("\u{1F4E5} \u5BFC\u5165").onClick(() => this.importShopConfig()));
        containerEl.createEl("h3", { text: "\u{1F4CA} \u7B49\u7EA7\u7BA1\u7406" });
        new Setting(containerEl).setName("\u7F16\u8F91\u7B49\u7EA7\u79F0\u53F7").setDesc("\u7F16\u8F91\u5404\u7B49\u7EA7\u7684\u79F0\u53F7\u3001\u80FD\u529B\u548C\u9636\u6BB5").addButton((button) => button.setButtonText("\u270F\uFE0F \u7F16\u8F91").onClick(() => this.showEditLevelsModal()));
        new Setting(containerEl).setName("\u6DFB\u52A0\u65B0\u7B49\u7EA7").setDesc("\u6DFB\u52A0\u65B0\u7684\u7B49\u7EA7\u914D\u7F6E").addButton((button) => button.setButtonText("\u2795 \u6DFB\u52A0").onClick(() => this.showAddLevelModal()));
        containerEl.createEl("h3", { text: "\u{1F4B0} \u8D27\u5E01\u7BA1\u7406" });
        new Setting(containerEl).setName("\u7BA1\u7406\u8D27\u5E01").setDesc("\u67E5\u770B\u548C\u7BA1\u7406\u6240\u6709\u8D27\u5E01\u7C7B\u578B").addButton((button) => button.setButtonText("\u{1F4B0} \u7BA1\u7406").onClick(() => this.showManageCurrenciesModal()));
        containerEl.createEl("h3", { text: "\u{1F4E4} \u6570\u636E\u5BFC\u5165\u5BFC\u51FA" });
        new Setting(containerEl).setName("\u5BFC\u51FA\u6570\u636E").setDesc("\u5BFC\u51FA\u6240\u6709\u8D26\u6237\u6570\u636E\u4E3AJSON\u6587\u4EF6").addButton((button) => button.setButtonText("\u{1F4E4} \u5BFC\u51FA").onClick(async () => {
          const data = await this.plugin.dataStore.exportData();
          const blob = new Blob([data], { type: "application/json" });
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = "supreme-player-backup-" + (/* @__PURE__ */ new Date()).toISOString().split("T")[0] + ".json";
          a.click();
          URL.revokeObjectURL(url);
          new Notice("\u2705 \u6570\u636E\u5DF2\u5BFC\u51FA\uFF01");
        }));
        new Setting(containerEl).setName("\u5BFC\u5165\u6570\u636E").setDesc("\u4ECEJSON\u6587\u4EF6\u5BFC\u5165\u8D26\u6237\u6570\u636E").addButton((button) => button.setButtonText("\u{1F4E5} \u5BFC\u5165").onClick(() => {
          const input = document.createElement("input");
          input.type = "file";
          input.accept = ".json";
          input.onchange = async (e) => {
            const file = e.target.files[0];
            if (file) {
              const reader = new FileReader();
              reader.onload = async (e2) => {
                const result = await this.plugin.dataStore.importData(e2.target.result);
                new Notice(result.message);
                if (result.success) {
                  Core.updateStatusBar(this.plugin);
                  this.display();
                }
              };
              reader.readAsText(file);
            }
          };
          input.click();
        }));
      }
      showDailyTasksConfigModal() {
        var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k;
        const config = this.plugin.dataStore.config || this.plugin.dataStore.getDefaultConfig();
        const dailyTasks = config.dailyTasks || {
          mainTasks: { count: 3, pointsPerTask: 100 },
          habits: { items: [] },
          extraTasks: { count: 2, pointsPerTask: 50 },
          pomodoro: { count: 6, pointsPerPomodoro: 50 }
        };
        const modal = new Modal(this.app);
        modal.titleEl.setText("\u{1F4CB} \u6BCF\u65E5\u4EFB\u52A1\u914D\u7F6E");
        const content = document.createElement("div");
        content.style.padding = "20px";
        content.style.maxHeight = "70vh";
        content.style.overflowY = "auto";
        content.innerHTML = `
      <div style="background: var(--background-secondary); padding: 15px; border-radius: 8px; margin-bottom: 20px;">
        <div style="font-weight: bold; margin-bottom: 10px; color: #ffaa00;">\u2605 \u6BCF\u65E5\u4E09\u4EF6\u4E8B</div>
        <div style="display: flex; gap: 10px; margin-bottom: 10px;">
          <div style="flex: 1;">
            <div style="font-size: 12px; color: #888; margin-bottom: 5px;">\u4EFB\u52A1\u6570\u91CF</div>
            <input type="number" id="main-count" value="${((_a = dailyTasks.mainTasks) == null ? void 0 : _a.count) || 3}" min="1" max="10" style="width: 100%;">
          </div>
          <div style="flex: 1;">
            <div style="font-size: 12px; color: #888; margin-bottom: 5px;">\u6BCF\u4EFB\u52A1\u79EF\u5206</div>
            <input type="number" id="main-points" value="${((_b = dailyTasks.mainTasks) == null ? void 0 : _b.pointsPerTask) || 100}" min="1" style="width: 100%;">
          </div>
        </div>
      </div>

      <div style="background: var(--background-secondary); padding: 15px; border-radius: 8px; margin-bottom: 20px;">
        <div style="font-weight: bold; margin-bottom: 10px; color: #00aaff;">\u25CF \u4E60\u60EF\u6253\u5361</div>
        <div id="habits-container" style="margin-bottom: 10px;"></div>
        <button id="add-habit-btn" style="width: 100%; padding: 8px; background: var(--interactive-accent); color: white; border: none; border-radius: 5px; cursor: pointer;">\u2795 \u6DFB\u52A0\u4E60\u60EF</button>
      </div>

      <div style="background: var(--background-secondary); padding: 15px; border-radius: 8px; margin-bottom: 20px;">
        <div style="font-weight: bold; margin-bottom: 10px; color: #9966ff;">\u25CF \u989D\u5916\u4EFB\u52A1</div>
        <div style="display: flex; gap: 10px; margin-bottom: 10px;">
          <div style="flex: 1;">
            <div style="font-size: 12px; color: #888; margin-bottom: 5px;">\u8BA1\u5206\u6570\u91CF</div>
            <input type="number" id="extra-count" value="${((_c = dailyTasks.extraTasks) == null ? void 0 : _c.count) || 2}" min="1" max="10" style="width: 100%;">
          </div>
          <div style="flex: 1;">
            <div style="font-size: 12px; color: #888; margin-bottom: 5px;">\u6BCF\u4EFB\u52A1\u79EF\u5206</div>
            <input type="number" id="extra-points" value="${((_d = dailyTasks.extraTasks) == null ? void 0 : _d.pointsPerTask) || 50}" min="1" style="width: 100%;">
          </div>
        </div>
        <div id="extra-max-display" style="font-size: 12px; color: #888;">\u6700\u5927\u79EF\u5206\uFF1A<span id="extra-max-value">${(((_e = dailyTasks.extraTasks) == null ? void 0 : _e.count) || 2) * (((_f = dailyTasks.extraTasks) == null ? void 0 : _f.pointsPerTask) || 50)}</span></div>
      </div>

      <div style="background: var(--background-secondary); padding: 15px; border-radius: 8px; margin-bottom: 20px;">
        <div style="font-weight: bold; margin-bottom: 10px; color: #ff6666;">\u23F0 \u4E13\u6CE8\u756A\u8304\u949F</div>
        <div style="display: flex; gap: 10px; margin-bottom: 10px;">
          <div style="flex: 1;">
            <div style="font-size: 12px; color: #888; margin-bottom: 5px;">\u756A\u8304\u949F\u6570\u91CF</div>
            <input type="number" id="pomodoro-count" value="${((_g = dailyTasks.pomodoro) == null ? void 0 : _g.count) || 6}" min="1" max="12" style="width: 100%;">
          </div>
          <div style="flex: 1;">
            <div style="font-size: 12px; color: #888; margin-bottom: 5px;">\u6BCF\u4E2A\u79EF\u5206</div>
            <input type="number" id="pomodoro-points" value="${((_h = dailyTasks.pomodoro) == null ? void 0 : _h.pointsPerPomodoro) || 50}" min="1" style="width: 100%;">
          </div>
        </div>
        <div id="pomodoro-max-display" style="font-size: 12px; color: #888;">\u6700\u5927\u79EF\u5206\uFF1A<span id="pomodoro-max-value">${(((_i = dailyTasks.pomodoro) == null ? void 0 : _i.count) || 6) * (((_j = dailyTasks.pomodoro) == null ? void 0 : _j.pointsPerPomodoro) || 50)}</span></div>
      </div>
    `;
        const habitsContainer = content.querySelector("#habits-container");
        const habits = ((_k = dailyTasks.habits) == null ? void 0 : _k.items) || [];
        const renderHabits = () => {
          habitsContainer.innerHTML = "";
          habits.forEach((habit, index) => {
            const habitDiv = document.createElement("div");
            habitDiv.style.cssText = "display: flex; gap: 10px; margin-bottom: 8px; align-items: center;";
            habitDiv.innerHTML = `
          <input type="text" value="${habit.name}" placeholder="\u4E60\u60EF\u540D\u79F0" class="habit-name" data-index="${index}" style="flex: 1;">
          <input type="number" value="${habit.points}" placeholder="\u79EF\u5206" class="habit-points" data-index="${index}" style="width: 80px;">
          <button class="remove-habit-btn" data-index="${index}" style="background: #ff6666; color: white; border: none; border-radius: 3px; padding: 5px 10px; cursor: pointer;">\u2715</button>
        `;
            habitsContainer.appendChild(habitDiv);
          });
          habitsContainer.querySelectorAll(".remove-habit-btn").forEach((btn) => {
            btn.onclick = (e) => {
              const idx = parseInt(e.target.dataset.index);
              habits.splice(idx, 1);
              renderHabits();
            };
          });
          habitsContainer.querySelectorAll(".habit-name").forEach((input) => {
            input.onchange = (e) => {
              habits[parseInt(e.target.dataset.index)].name = e.target.value;
            };
          });
          habitsContainer.querySelectorAll(".habit-points").forEach((input) => {
            input.onchange = (e) => {
              habits[parseInt(e.target.dataset.index)].points = parseInt(e.target.value) || 10;
            };
          });
        };
        renderHabits();
        content.querySelector("#add-habit-btn").onclick = () => {
          habits.push({ name: "\u65B0\u4E60\u60EF", points: 10 });
          renderHabits();
        };
        const extraCountInput = content.querySelector("#extra-count");
        const extraPointsInput = content.querySelector("#extra-points");
        const extraMaxValue = content.querySelector("#extra-max-value");
        const updateExtraMax = () => {
          const count = parseInt(extraCountInput.value) || 2;
          const points = parseInt(extraPointsInput.value) || 20;
          extraMaxValue.textContent = count * points;
        };
        extraCountInput.oninput = updateExtraMax;
        extraPointsInput.oninput = updateExtraMax;
        const pomodoroCountInput = content.querySelector("#pomodoro-count");
        const pomodoroPointsInput = content.querySelector("#pomodoro-points");
        const pomodoroMaxValue = content.querySelector("#pomodoro-max-value");
        const updatePomodoroMax = () => {
          const count = parseInt(pomodoroCountInput.value) || 6;
          const points = parseInt(pomodoroPointsInput.value) || 50;
          pomodoroMaxValue.textContent = count * points;
        };
        pomodoroCountInput.oninput = updatePomodoroMax;
        pomodoroPointsInput.oninput = updatePomodoroMax;
        const buttonContainer = document.createElement("div");
        buttonContainer.style.display = "flex";
        buttonContainer.style.gap = "10px";
        buttonContainer.style.marginTop = "20px";
        const confirmBtn = document.createElement("button");
        confirmBtn.textContent = "\u{1F4BE} \u4FDD\u5B58\u914D\u7F6E";
        confirmBtn.className = "mod-cta";
        confirmBtn.style.flex = "1";
        confirmBtn.onclick = async () => {
          if (!this.plugin.dataStore.config)
            this.plugin.dataStore.config = this.plugin.dataStore.getDefaultConfig();
          const extraCount = parseInt(extraCountInput.value) || 2;
          const extraPoints = parseInt(extraPointsInput.value) || 20;
          const pomodoroCount = parseInt(pomodoroCountInput.value) || 6;
          const pomodoroPoints = parseInt(pomodoroPointsInput.value) || 50;
          this.plugin.dataStore.config.dailyTasks = {
            mainTasks: {
              count: parseInt(content.querySelector("#main-count").value) || 3,
              pointsPerTask: parseInt(content.querySelector("#main-points").value) || 50
            },
            habits: { items: habits },
            extraTasks: {
              count: extraCount,
              pointsPerTask: extraPoints
            },
            pomodoro: {
              count: pomodoroCount,
              pointsPerPomodoro: pomodoroPoints
            }
          };
          await this.plugin.dataStore.saveConfig();
          new Notice("\u2705 \u6BCF\u65E5\u4EFB\u52A1\u914D\u7F6E\u5DF2\u4FDD\u5B58\uFF01");
          modal.close();
        };
        const cancelBtn = document.createElement("button");
        cancelBtn.textContent = "\u53D6\u6D88";
        cancelBtn.style.flex = "1";
        cancelBtn.onclick = () => modal.close();
        buttonContainer.appendChild(confirmBtn);
        buttonContainer.appendChild(cancelBtn);
        content.appendChild(buttonContainer);
        modal.contentEl.appendChild(content);
        modal.open();
      }
      showPerfectCheckInConfigModal() {
        var _a, _b, _c, _d, _e;
        const config = this.plugin.dataStore.config || this.plugin.dataStore.getDefaultConfig();
        const perfectReward = config.perfectCheckInReward || {
          enabled: true,
          rewardType: "shop",
          shopItemId: null,
          exclusiveItem: {
            name: "\u8D85\u7EA7\u5927\u94BB\u77F3",
            icon: "\u{1F48E}",
            description: "\u5B8C\u7F8E\u6253\u5361\u5956\u52B1\uFF0C\u4F7F\u7528\u540E\u83B7\u5F97\u597D\u8FD0Buff",
            rarity: "legendary",
            effect: { type: "buff", buffName: "\u597D\u8FD0", buffDuration: 12 }
          },
          blessingTitle: "\u592A\u68D2\u4E86\uFF01\u4ECA\u65E5\u4EFB\u52A1\u5168\u90E8\u5B8C\u6210\uFF01",
          blessingMessage: "\u6BCF\u4E00\u6B21\u5B8C\u7F8E\u6253\u5361\uFF0C\u90FD\u662F\u5BF9\u81EA\u5DF1\u6700\u597D\u7684\u6295\u8D44\uFF01"
        };
        const shopItems = this.plugin.dataStore.getShopItems() || [];
        const shopOptions = shopItems.map(
          (item) => `<option value="${item.id}" ${perfectReward.shopItemId === item.id ? "selected" : ""}>${item.icon} ${item.name}</option>`
        ).join("");
        const modal = new Modal(this.app);
        modal.titleEl.setText("\u{1F31F} \u5B8C\u7F8E\u6253\u5361\u914D\u7F6E");
        const content = document.createElement("div");
        content.style.padding = "20px";
        content.style.maxHeight = "500px";
        content.style.overflowY = "auto";
        content.innerHTML = `
      <div style="margin-bottom: 15px;">
        <div style="font-size: 12px; color: #888; margin-bottom: 5px;">\u5956\u52B1\u7C7B\u578B</div>
        <select id="reward-type" style="width: 100%;">
          <option value="shop" ${perfectReward.rewardType === "shop" ? "selected" : ""}>\u{1F381} \u5546\u57CE\u5546\u54C1</option>
          <option value="exclusive" ${perfectReward.rewardType === "exclusive" ? "selected" : ""}>\u2B50 \u7279\u6B8A\u5546\u54C1\uFF08\u4EC5\u5B8C\u7F8E\u6253\u5361\u53EF\u83B7\u5F97\uFF09</option>
        </select>
      </div>

      <div id="shop-reward-section" style="${perfectReward.rewardType === "shop" ? "" : "display: none;"}">
        <div style="font-size: 12px; color: #888; margin-bottom: 5px;">\u9009\u62E9\u5546\u57CE\u5546\u54C1</div>
        <select id="shop-item-select" style="width: 100%;">
          <option value="">-- \u8BF7\u9009\u62E9\u5546\u54C1 --</option>
          ${shopOptions}
        </select>
      </div>

      <div id="exclusive-reward-section" style="${perfectReward.rewardType === "exclusive" ? "" : "display: none;"}">
        <div style="background: var(--background-secondary); padding: 15px; border-radius: 8px; margin-bottom: 15px;">
          <div style="font-weight: bold; margin-bottom: 10px; color: #ffd700;">\u2B50 \u7279\u6B8A\u5546\u54C1\u914D\u7F6E</div>
          <div style="font-size: 11px; color: #888; margin-bottom: 10px;">\u6B64\u7C7B\u5546\u54C1\u53EA\u80FD\u5728\u5B8C\u7F8E\u6253\u5361\u65F6\u83B7\u5F97\uFF0C\u65E0\u6CD5\u5728\u5546\u57CE\u8D2D\u4E70</div>
          <div style="margin-bottom: 10px;">
            <div style="font-size: 12px; color: #888; margin-bottom: 5px;">\u5546\u54C1\u540D\u79F0</div>
            <input type="text" id="exclusive-name" value="${((_a = perfectReward.exclusiveItem) == null ? void 0 : _a.name) || "\u8D85\u7EA7\u5927\u94BB\u77F3"}" style="width: 100%;">
          </div>
          <div style="margin-bottom: 10px;">
            <div style="font-size: 12px; color: #888; margin-bottom: 5px;">\u5546\u54C1\u56FE\u6807</div>
            <input type="text" id="exclusive-icon" value="${((_b = perfectReward.exclusiveItem) == null ? void 0 : _b.icon) || "\u{1F48E}"}" style="width: 100%;">
          </div>
          <div style="margin-bottom: 10px;">
            <div style="font-size: 12px; color: #888; margin-bottom: 5px;">\u5546\u54C1\u63CF\u8FF0</div>
            <input type="text" id="exclusive-desc" value="${((_c = perfectReward.exclusiveItem) == null ? void 0 : _c.description) || "\u5B8C\u7F8E\u6253\u5361\u5956\u52B1"}" style="width: 100%;">
          </div>
          <div style="margin-bottom: 10px;">
            <div style="font-size: 12px; color: #888; margin-bottom: 5px;">\u7A00\u6709\u5EA6</div>
            <select id="exclusive-rarity" style="width: 100%;">
              <option value="rare" ${((_d = perfectReward.exclusiveItem) == null ? void 0 : _d.rarity) === "rare" ? "selected" : ""}>\u{1F3B4} \u7A00\u6709</option>
              <option value="legendary" ${((_e = perfectReward.exclusiveItem) == null ? void 0 : _e.rarity) === "legendary" ? "selected" : ""}>\u{1F320} \u4F20\u5947</option>
            </select>
          </div>
        </div>
      </div>

      <div style="background: var(--background-secondary); padding: 15px; border-radius: 8px; margin-bottom: 20px;">
        <div style="font-weight: bold; margin-bottom: 15px;">\u2728 \u795D\u798F\u8BED\u914D\u7F6E</div>
        <div style="margin-bottom: 10px;">
          <div style="font-size: 12px; color: #888; margin-bottom: 5px;">\u795D\u798F\u6807\u9898</div>
          <input type="text" id="blessing-title" value="${perfectReward.blessingTitle || "\u592A\u68D2\u4E86\uFF01\u4ECA\u65E5\u4EFB\u52A1\u5168\u90E8\u5B8C\u6210\uFF01"}" style="width: 100%;">
        </div>
        <div style="margin-bottom: 10px;">
          <div style="font-size: 12px; color: #888; margin-bottom: 5px;">\u795D\u798F\u8BED</div>
          <textarea id="blessing-message" style="width: 100%; height: 60px;">${perfectReward.blessingMessage || "\u6BCF\u4E00\u6B21\u5B8C\u7F8E\u6253\u5361\uFF0C\u90FD\u662F\u5BF9\u81EA\u5DF1\u6700\u597D\u7684\u6295\u8D44\uFF01"}</textarea>
        </div>
      </div>

      <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 20px;">
        <input type="checkbox" id="reward-enabled" ${perfectReward.enabled !== false ? "checked" : ""}>
        <label for="reward-enabled" style="font-size: 13px;">\u542F\u7528\u5B8C\u7F8E\u6253\u5361\u5956\u52B1</label>
      </div>
    `;
        const rewardTypeSelect = content.querySelector("#reward-type");
        const shopRewardSection = content.querySelector("#shop-reward-section");
        const exclusiveRewardSection = content.querySelector("#exclusive-reward-section");
        rewardTypeSelect.onchange = () => {
          if (rewardTypeSelect.value === "shop") {
            shopRewardSection.style.display = "";
            exclusiveRewardSection.style.display = "none";
          } else {
            shopRewardSection.style.display = "none";
            exclusiveRewardSection.style.display = "";
          }
        };
        const buttonContainer = document.createElement("div");
        buttonContainer.style.display = "flex";
        buttonContainer.style.gap = "10px";
        const confirmBtn = document.createElement("button");
        confirmBtn.textContent = "\u{1F4BE} \u4FDD\u5B58\u914D\u7F6E";
        confirmBtn.className = "mod-cta";
        confirmBtn.style.flex = "1";
        confirmBtn.onclick = async () => {
          if (!this.plugin.dataStore.config) {
            this.plugin.dataStore.config = this.plugin.dataStore.getDefaultConfig();
          }
          const rewardType = content.querySelector("#reward-type").value;
          const exclusiveItem = {
            name: content.querySelector("#exclusive-name").value.trim() || "\u8D85\u7EA7\u5927\u94BB\u77F3",
            icon: content.querySelector("#exclusive-icon").value.trim() || "\u{1F48E}",
            description: content.querySelector("#exclusive-desc").value.trim() || "\u5B8C\u7F8E\u6253\u5361\u5956\u52B1",
            rarity: content.querySelector("#exclusive-rarity").value,
            effect: { type: "buff", buffName: "\u597D\u8FD0", buffDuration: 12 }
          };
          this.plugin.dataStore.config.perfectCheckInReward = {
            enabled: content.querySelector("#reward-enabled").checked,
            rewardType,
            shopItemId: rewardType === "shop" ? content.querySelector("#shop-item-select").value : null,
            exclusiveItem: rewardType === "exclusive" ? exclusiveItem : null,
            blessingTitle: content.querySelector("#blessing-title").value.trim() || "\u592A\u68D2\u4E86\uFF01",
            blessingMessage: content.querySelector("#blessing-message").value.trim() || "\u5B8C\u7F8E\u6253\u5361\uFF01"
          };
          await this.plugin.dataStore.saveConfig();
          new Notice("\u2705 \u5B8C\u7F8E\u6253\u5361\u914D\u7F6E\u5DF2\u4FDD\u5B58\uFF01");
          modal.close();
        };
        const cancelBtn = document.createElement("button");
        cancelBtn.textContent = "\u53D6\u6D88";
        cancelBtn.style.flex = "1";
        cancelBtn.onclick = () => modal.close();
        buttonContainer.appendChild(confirmBtn);
        buttonContainer.appendChild(cancelBtn);
        content.appendChild(buttonContainer);
        modal.contentEl.appendChild(content);
        modal.open();
      }
      showAddItemModal() {
        const modal = new Modal(this.app);
        modal.titleEl.setText("\u2795 \u6DFB\u52A0\u5546\u54C1");
        const content = document.createElement("div");
        content.style.padding = "20px";
        content.style.maxHeight = "70vh";
        content.style.overflowY = "auto";
        content.innerHTML = `
      <div style="margin-bottom: 5px;">\u5546\u54C1\u540D\u79F0\uFF1A</div>
      <input type="text" id="item-name" placeholder="\u4F8B\u5982\uFF1A\u795E\u79D8\u798F\u888B" style="width: 100%; margin-bottom: 15px;">
      <div style="margin-bottom: 5px;">\u5546\u54C1\u63CF\u8FF0\uFF1A</div>
      <input type="text" id="item-desc" placeholder="\u5546\u54C1\u6548\u679C\u6216\u627F\u8BFA\u63CF\u8FF0" style="width: 100%; margin-bottom: 15px;">
      <div style="margin-bottom: 5px;">\u56FE\u6807\uFF08emoji\uFF09\uFF1A</div>
      <input type="text" id="item-icon" placeholder="\u4F8B\u5982\uFF1A\u{1F381}" style="width: 100%; margin-bottom: 15px;">
      <div style="display: flex; gap: 10px; margin-bottom: 15px;">
        <div style="flex: 1;">
          <div style="margin-bottom: 5px;">\u4EF7\u683C\uFF1A</div>
          <input type="number" id="item-price" placeholder="1" min="1" style="width: 100%;">
        </div>
        <div style="flex: 1;">
          <div style="margin-bottom: 5px;">\u54C1\u8D28\uFF1A</div>
          <select id="item-rarity" style="width: 100%;">
            <option value="rare">\u{1F3B4} \u7A00\u6709</option>
            <option value="legendary">\u{1F320} \u4F20\u5947</option>
          </select>
        </div>
      </div>
      <div style="margin-bottom: 5px;">\u5546\u54C1\u5206\u7C7B\uFF1A</div>
      <select id="item-category" style="width: 100%; margin-bottom: 15px;">
        <option value="system">\u2699\uFE0F \u7CFB\u7EDF\u5546\u54C1\uFF08\u81EA\u52A8\u751F\u6548\uFF09</option>
        <option value="external">\u{1F4DD} \u5916\u90E8\u5546\u54C1\uFF08\u9700\u81EA\u884C\u5151\u73B0\uFF09</option>
      </select>
      <div id="effect-config" style="background: var(--background-secondary); padding: 15px; border-radius: 8px; margin-bottom: 15px;">
        <div style="font-weight: bold; margin-bottom: 10px;">\u{1F381} \u5956\u52B1\u6548\u679C\u914D\u7F6E</div>
        <div style="margin-bottom: 5px;">\u6548\u679C\u7C7B\u578B\uFF1A</div>
        <select id="effect-type" style="width: 100%; margin-bottom: 15px;">
          <option value="add_wish_stars">\u2B50 \u83B7\u5F97\u613F\u661F</option>
          <option value="add_level">\u{1F31F} \u83B7\u5F97\u7B49\u7EA7</option>
          <option value="buff">\u{1F52E} \u83B7\u5F97Buff\u6548\u679C</option>
          <option value="random_wish_stars">\u{1F381} \u968F\u673A\u613F\u661F</option>
          <option value="add_points">\u26A1 \u83B7\u5F97\u79EF\u5206</option>
        </select>
        <div id="effect-params"></div>
      </div>
    `;
        const effectParams = content.querySelector("#effect-params");
        const effectTypeSelect = content.querySelector("#effect-type");
        const categorySelect = content.querySelector("#item-category");
        const effectConfig = content.querySelector("#effect-config");
        const renderEffectParamsFn = () => renderEffectParams(effectTypeSelect.value, effectParams);
        const toggleEffectConfig = () => {
          const isExternal = categorySelect.value === "external";
          effectConfig.style.display = isExternal ? "none" : "block";
        };
        effectTypeSelect.onchange = renderEffectParamsFn;
        categorySelect.onchange = toggleEffectConfig;
        renderEffectParamsFn();
        toggleEffectConfig();
        const buttonContainer = document.createElement("div");
        buttonContainer.style.display = "flex";
        buttonContainer.style.gap = "10px";
        const confirmBtn = document.createElement("button");
        confirmBtn.textContent = "\u2705 \u6DFB\u52A0";
        confirmBtn.className = "mod-cta";
        confirmBtn.style.flex = "1";
        confirmBtn.onclick = async () => {
          const name = document.getElementById("item-name").value.trim();
          if (!name) {
            new Notice("\u274C \u8BF7\u8F93\u5165\u5546\u54C1\u540D\u79F0");
            return;
          }
          const category = document.getElementById("item-category").value;
          const effect = buildEffectFromForm(category, document.getElementById("effect-type").value);
          if (category === "system" && effect === null && document.getElementById("effect-type").value === "buff")
            return;
          const result = await this.plugin.dataStore.addShopItem(
            name,
            document.getElementById("item-desc").value.trim(),
            category,
            "consumable",
            parseInt(document.getElementById("item-price").value) || 1,
            document.getElementById("item-rarity").value,
            document.getElementById("item-icon").value.trim() || "\u{1F4E6}",
            effect
          );
          new Notice(result.message);
          if (result.success)
            modal.close();
        };
        const cancelBtn = document.createElement("button");
        cancelBtn.textContent = "\u53D6\u6D88";
        cancelBtn.style.flex = "1";
        cancelBtn.onclick = () => modal.close();
        buttonContainer.appendChild(confirmBtn);
        buttonContainer.appendChild(cancelBtn);
        content.appendChild(buttonContainer);
        modal.contentEl.appendChild(content);
        modal.open();
      }
      showEditItemModal() {
        const allItems = this.plugin.dataStore.getShopItems();
        if (allItems.length === 0) {
          new Notice("\u{1F4ED} \u6682\u65E0\u5546\u54C1\u53EF\u7F16\u8F91");
          return;
        }
        const modal = new Modal(this.app);
        modal.titleEl.setText("\u270F\uFE0F \u7F16\u8F91\u5546\u54C1");
        const content = document.createElement("div");
        content.style.padding = "20px";
        content.style.maxHeight = "500px";
        content.style.overflowY = "auto";
        content.innerHTML = `
      <div style="margin-bottom: 5px;">\u9009\u62E9\u5546\u54C1\uFF1A</div>
      <select id="item-select" style="width: 100%; margin-bottom: 15px;">
        ${allItems.map((item) => `<option value="${item.id}">${item.icon} ${item.name}</option>`).join("")}
      </select>
      <div style="margin-bottom: 5px;">\u5546\u54C1\u540D\u79F0\uFF1A</div>
      <input type="text" id="item-name" style="width: 100%; margin-bottom: 15px;">
      <div style="margin-bottom: 5px;">\u5546\u54C1\u63CF\u8FF0\uFF1A</div>
      <input type="text" id="item-desc" style="width: 100%; margin-bottom: 15px;">
      <div style="margin-bottom: 5px;">\u56FE\u6807\uFF1A</div>
      <input type="text" id="item-icon" style="width: 100%; margin-bottom: 15px;">
      <div style="margin-bottom: 5px;">\u4EF7\u683C\uFF1A</div>
      <input type="number" id="item-price" style="width: 100%; margin-bottom: 15px;">
      <div style="margin-bottom: 5px;">\u7A00\u6709\u5EA6\uFF1A</div>
      <select id="item-rarity" style="width: 100%; margin-bottom: 15px;">
        <option value="rare">\u{1F3B4} \u7A00\u6709</option>
        <option value="legendary">\u{1F320} \u4F20\u5947</option>
      </select>
      <div style="margin-bottom: 5px;">\u5546\u54C1\u7C7B\u578B\uFF1A</div>
      <select id="item-category" style="width: 100%; margin-bottom: 20px;">
        <option value="system">\u7CFB\u7EDF\u5546\u54C1\uFF08\u81EA\u52A8\u751F\u6548\uFF09</option>
        <option value="external">\u5916\u90E8\u5546\u54C1\uFF08\u624B\u52A8\u5151\u73B0\uFF09</option>
      </select>
      <div id="effect-section">
        <div style="font-weight: bold; margin-bottom: 10px;">\u{1F381} \u5956\u52B1\u6548\u679C\u914D\u7F6E</div>
        <div style="margin-bottom: 5px;">\u6548\u679C\u7C7B\u578B\uFF1A</div>
        <select id="effect-type" style="width: 100%; margin-bottom: 15px;">
          <option value="add_wish_stars">\u2B50 \u83B7\u5F97\u613F\u661F</option>
          <option value="add_level">\u{1F31F} \u83B7\u5F97\u7B49\u7EA7</option>
          <option value="buff">\u{1F52E} \u83B7\u5F97Buff\u6548\u679C</option>
          <option value="random_wish_stars">\u{1F381} \u968F\u673A\u613F\u661F</option>
          <option value="add_points">\u26A1 \u83B7\u5F97\u79EF\u5206</option>
        </select>
        <div id="effect-params"></div>
      </div>
    `;
        modal.contentEl.appendChild(content);
        const itemSelect = content.querySelector("#item-select");
        const itemName = content.querySelector("#item-name");
        const itemDesc = content.querySelector("#item-desc");
        const itemIcon = content.querySelector("#item-icon");
        const itemPrice = content.querySelector("#item-price");
        const itemRarity = content.querySelector("#item-rarity");
        const itemCategory = content.querySelector("#item-category");
        const effectTypeSelect = content.querySelector("#effect-type");
        const effectSection = content.querySelector("#effect-section");
        const effectParams = content.querySelector("#effect-params");
        const renderEffectParamsFn = () => renderEffectParams(effectTypeSelect.value, effectParams);
        const loadItem = () => {
          const item = allItems.find((i) => i.id === itemSelect.value);
          if (item) {
            itemName.value = item.name;
            itemDesc.value = item.description || "";
            itemIcon.value = item.icon;
            itemPrice.value = item.price;
            itemRarity.value = item.rarity || "rare";
            itemCategory.value = item.category || "system";
            const category = item.category || "system";
            effectSection.style.display = category === "external" ? "none" : "block";
            if (item.effect) {
              effectTypeSelect.value = item.effect.type;
              renderEffectParamsFn();
              if (item.effect.type === "add_wish_stars" || item.effect.type === "add_level" || item.effect.type === "add_points") {
                const valueInput = effectParams.querySelector("#effect-value");
                if (valueInput)
                  valueInput.value = item.effect.value || 1;
              } else if (item.effect.type === "buff") {
                const buffName = effectParams.querySelector("#buff-name");
                const buffIcon = effectParams.querySelector("#buff-icon");
                const buffDesc = effectParams.querySelector("#buff-desc");
                const buffDuration = effectParams.querySelector("#buff-duration");
                if (buffName)
                  buffName.value = item.effect.buffName || "";
                if (buffIcon)
                  buffIcon.value = item.effect.buffIcon || "";
                if (buffDesc)
                  buffDesc.value = item.effect.buffDesc || "";
                if (buffDuration)
                  buffDuration.value = item.effect.duration || 24;
              } else if (item.effect.type === "random_wish_stars") {
                const minInput = effectParams.querySelector("#effect-min");
                const maxInput = effectParams.querySelector("#effect-max");
                if (minInput)
                  minInput.value = item.effect.min || 1;
                if (maxInput)
                  maxInput.value = item.effect.max || 5;
              }
            }
          }
        };
        const toggleEffectConfig = () => {
          const isExternal = itemCategory.value === "external";
          effectSection.style.display = isExternal ? "none" : "block";
        };
        effectTypeSelect.onchange = renderEffectParamsFn;
        itemCategory.onchange = toggleEffectConfig;
        itemSelect.onchange = loadItem;
        loadItem();
        const buttonContainer = document.createElement("div");
        buttonContainer.style.display = "flex";
        buttonContainer.style.gap = "10px";
        const confirmBtn = document.createElement("button");
        confirmBtn.textContent = "\u{1F4BE} \u4FDD\u5B58";
        confirmBtn.className = "mod-cta";
        confirmBtn.style.flex = "1";
        confirmBtn.onclick = async () => {
          const category = itemCategory.value;
          const effect = buildEffectFromForm(category, effectTypeSelect.value);
          const result = await this.plugin.dataStore.updateShopItem(itemSelect.value, {
            name: itemName.value.trim(),
            description: itemDesc.value.trim(),
            icon: itemIcon.value.trim() || "\u{1F4E6}",
            price: parseInt(itemPrice.value) || 1,
            rarity: itemRarity.value,
            category,
            effect
          });
          new Notice(result.message);
          if (result.success)
            modal.close();
        };
        const cancelBtn = document.createElement("button");
        cancelBtn.textContent = "\u53D6\u6D88";
        cancelBtn.style.flex = "1";
        cancelBtn.onclick = () => modal.close();
        buttonContainer.appendChild(confirmBtn);
        buttonContainer.appendChild(cancelBtn);
        content.appendChild(buttonContainer);
        modal.open();
      }
      showDeleteItemModal() {
        const allItems = this.plugin.dataStore.getShopItems();
        if (allItems.length === 0) {
          new Notice("\u{1F4ED} \u6682\u65E0\u5546\u54C1\u53EF\u5220\u9664");
          return;
        }
        const modal = new Modal(this.app);
        modal.titleEl.setText("\u{1F5D1}\uFE0F \u5220\u9664\u5546\u54C1");
        const content = document.createElement("div");
        content.style.padding = "20px";
        content.innerHTML = `
      <div style="margin-bottom: 5px;">\u9009\u62E9\u8981\u5220\u9664\u7684\u5546\u54C1\uFF1A</div>
      <select id="item-select" style="width: 100%; margin-bottom: 20px;">
        ${allItems.map((item) => `<option value="${item.id}">${item.icon} ${item.name}</option>`).join("")}
      </select>
      <div style="color: #ff6666; font-size: 12px; margin-bottom: 15px;">\u26A0\uFE0F \u5220\u9664\u540E\u65E0\u6CD5\u6062\u590D\uFF0C\u8BF7\u8C28\u614E\u64CD\u4F5C</div>
    `;
        const buttonContainer = document.createElement("div");
        buttonContainer.style.display = "flex";
        buttonContainer.style.gap = "10px";
        const confirmBtn = document.createElement("button");
        confirmBtn.textContent = "\u{1F5D1}\uFE0F \u5220\u9664";
        confirmBtn.style.cssText = "background-color: #ff6666; color: white; flex: 1;";
        confirmBtn.onclick = async () => {
          const result = await this.plugin.dataStore.deleteShopItem(document.getElementById("item-select").value);
          new Notice(result.message);
          if (result.success)
            modal.close();
        };
        const cancelBtn = document.createElement("button");
        cancelBtn.textContent = "\u53D6\u6D88";
        cancelBtn.style.flex = "1";
        cancelBtn.onclick = () => modal.close();
        buttonContainer.appendChild(confirmBtn);
        buttonContainer.appendChild(cancelBtn);
        content.appendChild(buttonContainer);
        modal.contentEl.appendChild(content);
        modal.open();
      }
      showEditLevelsModal() {
        const config = this.plugin.dataStore.config || this.plugin.dataStore.getDefaultConfig();
        const levels = config.levels || [];
        const modal = new Modal(this.app);
        modal.titleEl.setText("\u{1F4CA} \u7F16\u8F91\u7B49\u7EA7\u79F0\u53F7");
        const content = document.createElement("div");
        content.style.padding = "20px";
        const levelList = document.createElement("div");
        levelList.style.cssText = "max-height: 400px; overflow-y: auto;";
        levels.forEach((levelConfig, index) => {
          const levelDiv = document.createElement("div");
          levelDiv.style.cssText = `padding: 15px; margin-bottom: 10px; border: 1px solid var(--border-color); border-radius: 8px; border-left: 4px solid ${levelConfig.color || "#ffffff"}; cursor: pointer;`;
          levelDiv.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
          <div style="font-weight: bold; font-size: 16px;">${levelConfig.title}</div>
          <div style="color: #888; font-size: 12px;">Lv.${levelConfig.minLevel} - ${levelConfig.maxLevel === 999 ? "\u221E" : levelConfig.maxLevel}</div>
        </div>
        <div style="color: #666; font-size: 12px;">\u80FD\u529B\uFF1A${levelConfig.ability}</div>
        <div style="color: #666; font-size: 12px;">\u9636\u6BB5\uFF1A${levelConfig.phase}</div>
      `;
          levelDiv.onclick = () => this.showEditLevelDetailModal(index, levelConfig);
          levelList.appendChild(levelDiv);
        });
        content.appendChild(levelList);
        const closeBtn = document.createElement("button");
        closeBtn.textContent = "\u5173\u95ED";
        closeBtn.style.width = "100%";
        closeBtn.style.marginTop = "10px";
        closeBtn.onclick = () => modal.close();
        content.appendChild(closeBtn);
        modal.contentEl.appendChild(content);
        modal.open();
      }
      showEditLevelDetailModal(index, levelConfig) {
        const modal = new Modal(this.app);
        modal.titleEl.setText("\u270F\uFE0F \u7F16\u8F91\u7B49\u7EA7\uFF1A" + levelConfig.title);
        const content = document.createElement("div");
        content.style.padding = "20px";
        content.innerHTML = `
      <div style="margin-bottom: 5px;">\u79F0\u53F7\uFF1A</div>
      <input type="text" id="level-title" value="${levelConfig.title}" style="width: 100%; margin-bottom: 15px;">
      <div style="margin-bottom: 5px;">\u80FD\u529B\uFF1A</div>
      <input type="text" id="level-ability" value="${levelConfig.ability}" style="width: 100%; margin-bottom: 15px;">
      <div style="margin-bottom: 5px;">\u80FD\u529B\u56FE\u6807\uFF1A</div>
      <input type="text" id="level-ability-icon" value="${levelConfig.abilityIcon || "\u2694\uFE0F"}" style="width: 100%; margin-bottom: 15px;" placeholder="\u2694\uFE0F">
      <div style="margin-bottom: 5px;">\u9636\u6BB5\uFF1A</div>
      <input type="text" id="level-phase" value="${levelConfig.phase}" style="width: 100%; margin-bottom: 15px;">
      <div style="margin-bottom: 5px;">\u9636\u6BB5\u56FE\u6807\uFF1A</div>
      <input type="text" id="level-phase-icon" value="${levelConfig.phaseIcon || "\u{1F451}"}" style="width: 100%; margin-bottom: 15px;" placeholder="\u{1F451}">
      <div style="margin-bottom: 5px;">\u989C\u8272\uFF08\u5341\u516D\u8FDB\u5236\uFF09\uFF1A</div>
      <input type="text" id="level-color" value="${levelConfig.color || "#ffffff"}" style="width: 100%; margin-bottom: 15px;">
      <div style="margin-bottom: 5px;">\u6700\u5C0F\u7B49\u7EA7\uFF1A</div>
      <input type="number" id="level-min" value="${levelConfig.minLevel}" style="width: 100%; margin-bottom: 15px;">
      <div style="margin-bottom: 5px;">\u6700\u5927\u7B49\u7EA7\uFF1A</div>
      <input type="number" id="level-max" value="${levelConfig.maxLevel}" style="width: 100%; margin-bottom: 20px;">
      <div id="delete-section" style="margin-top: 20px; padding-top: 15px; border-top: 1px solid var(--background-modifier-border);"></div>
    `;
        modal.contentEl.appendChild(content);
        const titleInput = content.querySelector("#level-title");
        const abilityInput = content.querySelector("#level-ability");
        const abilityIconInput = content.querySelector("#level-ability-icon");
        const phaseInput = content.querySelector("#level-phase");
        const phaseIconInput = content.querySelector("#level-phase-icon");
        const colorInput = content.querySelector("#level-color");
        const minInput = content.querySelector("#level-min");
        const maxInput = content.querySelector("#level-max");
        const deleteSection = content.querySelector("#delete-section");
        let deleteConfirmCount = 0;
        let deleteConfirmTimer = null;
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "\u{1F5D1}\uFE0F \u5220\u9664\u6B64\u7B49\u7EA7";
        deleteBtn.style.width = "100%";
        deleteBtn.style.background = "#ff6666";
        deleteBtn.style.color = "white";
        deleteBtn.style.border = "none";
        deleteBtn.style.padding = "10px";
        deleteBtn.style.borderRadius = "5px";
        deleteBtn.style.cursor = "pointer";
        const resetDeleteButton = () => {
          deleteConfirmCount = 0;
          deleteBtn.textContent = "\u{1F5D1}\uFE0F \u5220\u9664\u6B64\u7B49\u7EA7";
          deleteBtn.style.background = "#ff6666";
        };
        deleteBtn.onclick = () => {
          deleteConfirmCount++;
          if (deleteConfirmCount === 1) {
            deleteBtn.textContent = "\u26A0\uFE0F \u786E\u5B9A\u5220\u9664\uFF1F\u518D\u70B92\u6B21";
            deleteBtn.style.background = "#ff4444";
            deleteConfirmTimer = setTimeout(resetDeleteButton, 3e3);
          } else if (deleteConfirmCount === 2) {
            if (deleteConfirmTimer)
              clearTimeout(deleteConfirmTimer);
            deleteBtn.textContent = "\u26A0\uFE0F \u518D\u6B21\u786E\u8BA4\uFF01\u518D\u70B91\u6B21";
            deleteBtn.style.background = "#cc0000";
            deleteConfirmTimer = setTimeout(resetDeleteButton, 3e3);
          } else if (deleteConfirmCount >= 3) {
            if (deleteConfirmTimer)
              clearTimeout(deleteConfirmTimer);
            this.plugin.dataStore.deleteLevelConfig(index).then((result) => {
              new Notice(result.message);
              if (result.success) {
                modal.close();
                this.showEditLevelsModal();
              }
            });
          }
        };
        deleteSection.appendChild(deleteBtn);
        const buttonContainer = document.createElement("div");
        buttonContainer.style.display = "flex";
        buttonContainer.style.gap = "10px";
        buttonContainer.style.marginTop = "15px";
        const confirmBtn = document.createElement("button");
        confirmBtn.textContent = "\u{1F4BE} \u4FDD\u5B58";
        confirmBtn.className = "mod-cta";
        confirmBtn.style.flex = "1";
        confirmBtn.onclick = async () => {
          const result = await this.plugin.dataStore.updateLevelConfig(index, {
            title: titleInput.value.trim(),
            ability: abilityInput.value.trim(),
            abilityIcon: abilityIconInput.value.trim() || "\u2694\uFE0F",
            phase: phaseInput.value.trim(),
            phaseIcon: phaseIconInput.value.trim() || "\u{1F451}",
            color: colorInput.value.trim(),
            minLevel: parseInt(minInput.value) || 0,
            maxLevel: parseInt(maxInput.value) || 999
          });
          new Notice(result.message);
          if (result.success)
            modal.close();
        };
        const cancelBtn = document.createElement("button");
        cancelBtn.textContent = "\u53D6\u6D88";
        cancelBtn.style.flex = "1";
        cancelBtn.onclick = () => modal.close();
        buttonContainer.appendChild(confirmBtn);
        buttonContainer.appendChild(cancelBtn);
        content.appendChild(buttonContainer);
        modal.open();
      }
      showAddLevelModal() {
        const modal = new Modal(this.app);
        modal.titleEl.setText("\u2795 \u6DFB\u52A0\u65B0\u7B49\u7EA7");
        const content = document.createElement("div");
        content.style.padding = "20px";
        content.innerHTML = `
      <div style="margin-bottom: 5px;">\u79F0\u53F7\uFF1A</div>
      <input type="text" id="level-title" placeholder="\u4F8B\u5982\uFF1A\u661F\u8FB0\u4F7F\u8005" style="width: 100%; margin-bottom: 15px;">
      <div style="margin-bottom: 5px;">\u80FD\u529B\uFF1A</div>
      <input type="text" id="level-ability" placeholder="\u4F8B\u5982\uFF1A\u661F\u6CB3\u6307\u5F15-\u5BFC\u822A" style="width: 100%; margin-bottom: 15px;">
      <div style="margin-bottom: 5px;">\u80FD\u529B\u56FE\u6807\uFF1A</div>
      <input type="text" id="level-ability-icon" placeholder="\u2694\uFE0F" style="width: 100%; margin-bottom: 15px;">
      <div style="margin-bottom: 5px;">\u9636\u6BB5\uFF1A</div>
      <input type="text" id="level-phase" placeholder="\u4F8B\u5982\uFF1A\u661F\u4F7F" style="width: 100%; margin-bottom: 15px;">
      <div style="margin-bottom: 5px;">\u9636\u6BB5\u56FE\u6807\uFF1A</div>
      <input type="text" id="level-phase-icon" placeholder="\u{1F451}" style="width: 100%; margin-bottom: 15px;">
      <div style="margin-bottom: 5px;">\u989C\u8272\uFF1A</div>
      <input type="text" id="level-color" placeholder="#ffffff" style="width: 100%; margin-bottom: 15px;">
      <div style="margin-bottom: 5px;">\u6700\u5C0F\u7B49\u7EA7\uFF1A</div>
      <input type="number" id="level-min" placeholder="0" style="width: 100%; margin-bottom: 15px;">
      <div style="margin-bottom: 5px;">\u6700\u5927\u7B49\u7EA7\uFF1A</div>
      <input type="number" id="level-max" placeholder="999" style="width: 100%; margin-bottom: 20px;">
    `;
        modal.contentEl.appendChild(content);
        const buttonContainer = document.createElement("div");
        buttonContainer.style.display = "flex";
        buttonContainer.style.gap = "10px";
        const confirmBtn = document.createElement("button");
        confirmBtn.textContent = "\u2705 \u6DFB\u52A0";
        confirmBtn.className = "mod-cta";
        confirmBtn.style.flex = "1";
        confirmBtn.onclick = async () => {
          const title = content.querySelector("#level-title").value.trim();
          if (!title) {
            new Notice("\u274C \u8BF7\u8F93\u5165\u79F0\u53F7");
            return;
          }
          const result = await this.plugin.dataStore.addLevelConfig({
            minLevel: parseInt(content.querySelector("#level-min").value) || 0,
            maxLevel: parseInt(content.querySelector("#level-max").value) || 999,
            title,
            ability: content.querySelector("#level-ability").value.trim(),
            abilityIcon: content.querySelector("#level-ability-icon").value.trim() || "\u2694\uFE0F",
            phase: content.querySelector("#level-phase").value.trim(),
            phaseIcon: content.querySelector("#level-phase-icon").value.trim() || "\u{1F451}",
            color: content.querySelector("#level-color").value.trim() || "#ffffff"
          });
          new Notice(result.message);
          if (result.success)
            modal.close();
        };
        const cancelBtn = document.createElement("button");
        cancelBtn.textContent = "\u53D6\u6D88";
        cancelBtn.style.flex = "1";
        cancelBtn.onclick = () => modal.close();
        buttonContainer.appendChild(confirmBtn);
        buttonContainer.appendChild(cancelBtn);
        content.appendChild(buttonContainer);
        modal.contentEl.appendChild(content);
        modal.open();
      }
      showManageCurrenciesModal() {
        const currencies = this.plugin.dataStore.getCurrencies();
        const modal = new Modal(this.app);
        modal.titleEl.setText("\u{1F4B0} \u7BA1\u7406\u8D27\u5E01");
        const content = document.createElement("div");
        content.style.padding = "20px";
        const currencyList = document.createElement("div");
        currencyList.style.cssText = "max-height: 400px; overflow-y: auto;";
        currencies.forEach((currency) => {
          const stats = this.plugin.dataStore.getStats();
          const currentAmount = stats[currency.id] || 0;
          const currencyDiv = document.createElement("div");
          currencyDiv.style.cssText = `padding: 15px; margin-bottom: 10px; border: 1px solid var(--border-color); border-radius: 8px; border-left: 4px solid ${currency.color || "#ffffff"};`;
          if (currency.editable)
            currencyDiv.style.cursor = "pointer";
          currencyDiv.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div><span style="font-size: 20px; margin-right: 10px;">${currency.icon}</span><strong>${currency.name}</strong>${currency.editable ? '<span style="color: #888; font-size: 10px; margin-left: 5px;">\u53EF\u7F16\u8F91</span>' : ""}</div>
          <div style="text-align: right;"><div style="font-weight: bold;">${currentAmount}</div><div style="color: #888; font-size: 10px;">\u6BCF${currency.earnRate}\u79EF\u5206+${currency.earnAmount}</div></div>
        </div>
        <div style="color: #666; font-size: 12px; margin-top: 5px;">${currency.description}</div>
      `;
          if (currency.editable)
            currencyDiv.onclick = () => this.showEditCurrencyModal(currency);
          currencyList.appendChild(currencyDiv);
        });
        content.appendChild(currencyList);
        const addBtn = document.createElement("button");
        addBtn.textContent = "\u2795 \u6DFB\u52A0\u65B0\u8D27\u5E01";
        addBtn.style.width = "100%";
        addBtn.style.marginTop = "10px";
        addBtn.onclick = () => this.showAddCurrencyModal();
        content.appendChild(addBtn);
        const closeBtn = document.createElement("button");
        closeBtn.textContent = "\u5173\u95ED";
        closeBtn.style.width = "100%";
        closeBtn.style.marginTop = "10px";
        closeBtn.onclick = () => modal.close();
        content.appendChild(closeBtn);
        modal.contentEl.appendChild(content);
        modal.open();
      }
      showEditCurrencyModal(currency) {
        const modal = new Modal(this.app);
        modal.titleEl.setText("\u270F\uFE0F \u7F16\u8F91\u8D27\u5E01\uFF1A" + currency.name);
        const content = document.createElement("div");
        content.style.padding = "20px";
        content.innerHTML = `
      <div style="margin-bottom: 5px;">\u540D\u79F0\uFF1A</div>
      <input type="text" id="currency-name" value="${currency.name}" style="width: 100%; margin-bottom: 15px;">
      <div style="margin-bottom: 5px;">\u56FE\u6807\uFF1A</div>
      <input type="text" id="currency-icon" value="${currency.icon}" style="width: 100%; margin-bottom: 15px;">
      <div style="margin-bottom: 5px;">\u63CF\u8FF0\uFF1A</div>
      <input type="text" id="currency-desc" value="${currency.description}" style="width: 100%; margin-bottom: 15px;">
      <div style="margin-bottom: 5px;">\u83B7\u53D6\u95F4\u9694\uFF08\u79EF\u5206\uFF09\uFF1A</div>
      <input type="number" id="currency-rate" value="${currency.earnRate}" style="width: 100%; margin-bottom: 15px;">
      <div style="margin-bottom: 5px;">\u989C\u8272\uFF1A</div>
      <input type="text" id="currency-color" value="${currency.color || "#ffffff"}" style="width: 100%; margin-bottom: 20px;">
    `;
        const buttonContainer = document.createElement("div");
        buttonContainer.style.display = "flex";
        buttonContainer.style.gap = "10px";
        const confirmBtn = document.createElement("button");
        confirmBtn.textContent = "\u{1F4BE} \u4FDD\u5B58";
        confirmBtn.className = "mod-cta";
        confirmBtn.style.flex = "1";
        confirmBtn.onclick = async () => {
          const result = await this.plugin.dataStore.updateCurrency(currency.id, {
            name: document.getElementById("currency-name").value.trim(),
            icon: document.getElementById("currency-icon").value.trim(),
            description: document.getElementById("currency-desc").value.trim(),
            earnRate: parseInt(document.getElementById("currency-rate").value) || 1e3,
            color: document.getElementById("currency-color").value.trim()
          });
          new Notice(result.message);
          if (result.success)
            modal.close();
        };
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "\u{1F5D1}\uFE0F \u5220\u9664";
        deleteBtn.style.cssText = "background-color: #ff6666; color: white; flex: 1;";
        deleteBtn.onclick = async () => {
          const result = await this.plugin.dataStore.deleteCurrency(currency.id);
          new Notice(result.message);
          if (result.success)
            modal.close();
        };
        const cancelBtn = document.createElement("button");
        cancelBtn.textContent = "\u53D6\u6D88";
        cancelBtn.style.flex = "1";
        cancelBtn.onclick = () => modal.close();
        buttonContainer.appendChild(confirmBtn);
        buttonContainer.appendChild(deleteBtn);
        buttonContainer.appendChild(cancelBtn);
        content.appendChild(buttonContainer);
        modal.contentEl.appendChild(content);
        modal.open();
      }
      showAddCurrencyModal() {
        const modal = new Modal(this.app);
        modal.titleEl.setText("\u2795 \u6DFB\u52A0\u65B0\u8D27\u5E01");
        const content = document.createElement("div");
        content.style.padding = "20px";
        content.innerHTML = `
      <div style="margin-bottom: 5px;">\u540D\u79F0\uFF1A</div>
      <input type="text" id="currency-name" placeholder="\u4F8B\u5982\uFF1A\u91D1\u5E01" style="width: 100%; margin-bottom: 15px;">
      <div style="margin-bottom: 5px;">\u56FE\u6807\uFF1A</div>
      <input type="text" id="currency-icon" placeholder="\u4F8B\u5982\uFF1A\u{1FA99}" style="width: 100%; margin-bottom: 15px;">
      <div style="margin-bottom: 5px;">\u63CF\u8FF0\uFF1A</div>
      <input type="text" id="currency-desc" placeholder="\u8D27\u5E01\u7528\u9014\u8BF4\u660E" style="width: 100%; margin-bottom: 15px;">
      <div style="margin-bottom: 5px;">\u83B7\u53D6\u95F4\u9694\uFF08\u6BCF\u591A\u5C11\u79EF\u5206\u83B7\u5F97\uFF09\uFF1A</div>
      <input type="number" id="currency-rate" placeholder="1000" style="width: 100%; margin-bottom: 15px;">
      <div style="margin-bottom: 5px;">\u989C\u8272\uFF1A</div>
      <input type="text" id="currency-color" placeholder="#00ff00" style="width: 100%; margin-bottom: 20px;">
      <div style="color: #666; font-size: 12px; margin-bottom: 15px;">\u{1F4A1} \u65B0\u8D27\u5E01\u4F1A\u81EA\u52A8\u52A0\u5165\u7CFB\u7EDF\uFF0C\u6253\u5361\u65F6\u6839\u636E\u79EF\u5206\u81EA\u52A8\u83B7\u53D6</div>
    `;
        const buttonContainer = document.createElement("div");
        buttonContainer.style.display = "flex";
        buttonContainer.style.gap = "10px";
        const confirmBtn = document.createElement("button");
        confirmBtn.textContent = "\u2705 \u6DFB\u52A0";
        confirmBtn.className = "mod-cta";
        confirmBtn.style.flex = "1";
        confirmBtn.onclick = async () => {
          const name = document.getElementById("currency-name").value.trim();
          if (!name) {
            new Notice("\u274C \u8BF7\u8F93\u5165\u8D27\u5E01\u540D\u79F0");
            return;
          }
          const result = await this.plugin.dataStore.addCurrency(
            name,
            document.getElementById("currency-icon").value.trim() || "\u{1F48E}",
            document.getElementById("currency-desc").value.trim(),
            parseInt(document.getElementById("currency-rate").value) || 1e3,
            document.getElementById("currency-color").value.trim() || "#00ff00"
          );
          new Notice(result.message);
          if (result.success)
            modal.close();
        };
        const cancelBtn = document.createElement("button");
        cancelBtn.textContent = "\u53D6\u6D88";
        cancelBtn.style.flex = "1";
        cancelBtn.onclick = () => modal.close();
        buttonContainer.appendChild(confirmBtn);
        buttonContainer.appendChild(cancelBtn);
        content.appendChild(buttonContainer);
        modal.contentEl.appendChild(content);
        modal.open();
      }
      exportShopConfig() {
        const items = this.plugin.dataStore.getShopItems();
        if (items.length === 0) {
          new Notice("\u{1F4ED} \u6682\u65E0\u5546\u54C1\u53EF\u5BFC\u51FA");
          return;
        }
        const exportData = {
          exportVersion: "1.0",
          exportedAt: (/* @__PURE__ */ new Date()).toISOString(),
          items
        };
        const data = JSON.stringify(exportData, null, 2);
        const blob = new Blob([data], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "shop-config-" + (/* @__PURE__ */ new Date()).toISOString().split("T")[0] + ".json";
        a.click();
        URL.revokeObjectURL(url);
        new Notice("\u2705 \u5546\u54C1\u914D\u7F6E\u5DF2\u5BFC\u51FA\uFF01");
      }
      importShopConfig() {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = ".json";
        input.onchange = async (e) => {
          const file = e.target.files[0];
          if (file) {
            const reader = new FileReader();
            reader.onload = async (e2) => {
              try {
                const data = JSON.parse(e2.target.result);
                const items = data.items || data.customItems;
                if (!items || !Array.isArray(items)) {
                  new Notice("\u274C \u65E0\u6548\u7684\u5546\u54C1\u914D\u7F6E\u6587\u4EF6");
                  return;
                }
                if (!this.plugin.dataStore.shopConfig) {
                  this.plugin.dataStore.shopConfig = { items: this.plugin.dataStore.getDefaultShopItems() };
                }
                if (!this.plugin.dataStore.shopConfig.items) {
                  this.plugin.dataStore.shopConfig.items = this.plugin.dataStore.getDefaultShopItems();
                }
                let importCount = 0;
                for (const item of items) {
                  if (item.name && item.category) {
                    const newItem = {
                      ...item,
                      id: "imported-" + Date.now().toString() + "-" + importCount
                    };
                    this.plugin.dataStore.shopConfig.items.push(newItem);
                    importCount++;
                  }
                }
                await this.plugin.dataStore.saveShopConfig();
                new Notice(`\u2705 \u6210\u529F\u5BFC\u5165 ${importCount} \u4E2A\u5546\u54C1\uFF01`);
              } catch (err) {
                new Notice("\u274C \u5BFC\u5165\u5931\u8D25\uFF1A" + err.message);
              }
            };
            reader.readAsText(file);
          }
        };
        input.click();
      }
      async updateDailyTemplate() {
        var _a;
        if (!this.plugin.dataStore.config) {
          this.plugin.dataStore.config = this.plugin.dataStore.getDefaultConfig();
          await this.plugin.dataStore.saveConfig();
        }
        const config = this.plugin.dataStore.config;
        const dailyTasks = config.dailyTasks || {
          mainTasks: { count: 3, pointsPerTask: 100 },
          habits: { items: [{ name: "\u65E9\u8D77", points: 50 }, { name: "\u8FD0\u52A8", points: 50 }, { name: "\u9605\u8BFB", points: 50 }] },
          extraTasks: { count: 2, pointsPerTask: 50 },
          pomodoro: { count: 6, pointsPerPomodoro: 50 }
        };
        const mainTasks = dailyTasks.mainTasks || { count: 3, pointsPerTask: 100 };
        const habits = ((_a = dailyTasks.habits) == null ? void 0 : _a.items) || [];
        const extraTasks = dailyTasks.extraTasks || { count: 2, pointsPerTask: 50 };
        const pomodoro = dailyTasks.pomodoro || { count: 6, pointsPerPomodoro: 50 };
        let mainTasksSection = "";
        for (let i = 1; i <= mainTasks.count; i++) {
          mainTasksSection += `- [ ] \u4EFB\u52A1${i} - ${mainTasks.pointsPerTask}
`;
        }
        let habitsSection = "";
        for (const habit of habits) {
          const habitPoints = habit.points || 10;
          habitsSection += `- [ ] ${habit.name} - ${habitPoints}
`;
        }
        let extraTasksSection = "";
        const extraCount = extraTasks.count || 2;
        for (let i = 1; i <= extraCount; i++) {
          extraTasksSection += `- [ ] \u989D\u5916\u4EFB\u52A1${String.fromCharCode(64 + i)} - ${extraTasks.pointsPerTask || 50}
`;
        }
        let pomodoroSection = "";
        for (let i = 0; i < pomodoro.count; i++) {
          pomodoroSection += `- [ ] \u5B8C\u6210 \u23F1\uFE0F
`;
        }
        const templateContent = `---
date: {{date}}
weather:
mood:
---

> **\u{1F4C5} \u81EA\u5F8B\u8BB0\u5F55** | \u6267\u884C\u6253\u5361\u547D\u4EE4\u81EA\u52A8\u66F4\u65B0\u4E0B\u65B9\u6570\u636E

---

\u2605 **\u4ECA\u65E5\u4E09\u4EF6\u4E8B**\uFF08\u4F18\u5148\u5B8C\u6210\uFF0C\u4E0A\u9650${mainTasks.count * mainTasks.pointsPerTask}\uFF09

${mainTasksSection}
---

\u25CF **\u4E60\u60EF\u6253\u5361**

${habitsSection}
---

\u25CF **\u989D\u5916\u4EFB\u52A1**\uFF08\u5B8C\u6210\u6700\u591A${extraTasks.count}\u9879\uFF0C\u4E0A\u9650${extraTasks.count * extraTasks.pointsPerTask}\uFF09

${extraTasksSection}
---

\u23F0 **\u4E13\u6CE8\u756A\u8304\u949F**\uFF08\u6BCF\u4E2A${pomodoro.pointsPerPomodoro}\u79EF\u5206\uFF0C\u6700\u591A${pomodoro.count * pomodoro.pointsPerPomodoro}\uFF09

${pomodoroSection}
---



> \u26A0\uFE0F \u5B8C\u6210\u4EFB\u52A1\u540E\uFF0C\u6309 \`Ctrl+P\` \u6267\u884C **\u300C\u6BCF\u65E5\u6253\u5361\u300D**

---

### \u{1F4CA} \u6253\u5361\u8BB0\u5F55\uFF08\u81EA\u52A8\u751F\u6210\uFF09

<!-- \u4EE5\u4E0B\u5185\u5BB9\u7531\u63D2\u4EF6\u81EA\u52A8\u586B\u5145\uFF0C\u8BF7\u52FF\u624B\u52A8\u4FEE\u6539 -->

\u{1F4CA} \u4ECA\u65E5\u79EF\u5206\uFF1A

\u{1F4B0} \u5F53\u524D\u79EF\u5206\uFF1A
\u203B\u613F\u661F \\*
\u203B\u7A00\u6709\u9053\u5177\u5361 \\*
\u203B\u4F20\u5947\u9053\u5177\u5361 \\*

\u26F2**\u8BB8\u613F\u6C60**

\u5F53\u524D\u613F\u671B\uFF1A

---

- {{date}} -
`;
        const adapter = this.app.vault.adapter;
        let templatePath = config.templatePath || this.plugin.dataStore.autoDetectTemplatePath();
        if (!templatePath.endsWith(".md")) {
          templatePath += ".md";
        }
        try {
          await adapter.write(templatePath, templateContent);
          new Notice("\u2705 \u6BCF\u65E5\u8BB0\u5F55\u6A21\u677F\u5DF2\u66F4\u65B0\uFF01");
        } catch (e) {
          console.error("[Template] Error:", e);
          new Notice("\u274C \u66F4\u65B0\u6A21\u677F\u5931\u8D25\uFF1A" + e.message);
        }
      }
    };
    module2.exports = SupremePlayerSettingTab2;
  }
});

// src/main.js
var { Plugin } = require("obsidian");
var DataStore = require_data_store();
var DailyNoteParser = require_daily_note_parser();
var Core2 = require_core();
var UI = require_ui();
var Wish = require_wish();
var Shop = require_shop();
var Inventory = require_inventory();
var SupremePlayerSettingTab = require_settings();
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
      console.error("Failed to load data store:", e);
    }
    this.addCommand({
      id: "process-daily-note",
      name: "\u6BCF\u65E5\u6253\u5361",
      callback: () => UI.showCheckInPanel(this).catch((e) => console.error("CheckIn error:", e))
    });
    this.addCommand({
      id: "show-stats",
      name: "\u67E5\u770B\u5F53\u524D\u72B6\u6001",
      callback: () => UI.showStats(this)
    });
    this.addCommand({
      id: "reset-daily",
      name: "\u540C\u6B65\u8D26\u6237\u4FE1\u606F",
      callback: () => Core2.syncAccountInfo(this)
    });
    this.addCommand({
      id: "make-wish",
      name: "\u8BB8\u4E0B\u613F\u671B",
      callback: () => Wish.showWishModal(this)
    });
    this.addCommand({
      id: "show-wish-pool",
      name: "\u67E5\u770B\u8BB8\u613F\u6C60",
      callback: () => Wish.showWishPool(this)
    });
    this.addCommand({
      id: "open-shop",
      name: "\u6253\u5F00\u5546\u57CE",
      callback: () => Shop.showShop(this)
    });
    this.addCommand({
      id: "open-inventory",
      name: "\u67E5\u770B\u80CC\u5305",
      callback: () => Inventory.showInventory(this)
    });
    this.addSettingTab(new SupremePlayerSettingTab(this.app, this));
    this.statusBar = this.addStatusBarItem();
    Core2.updateStatusBar(this);
    console.log("Supreme Player loaded!");
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
    Core2.updateStatusBar(this);
  }
  onunload() {
    if (this.lockState.autoLockTimer) {
      clearTimeout(this.lockState.autoLockTimer);
    }
  }
};
