const { CONFIG_FILE, SHOP_CONFIG_FILE } = require('./utils');
const { createI18n } = require('./i18n');

class DataStore {
  constructor(app) {
    this.app = app;
    this.stats = null;
    this.shopConfig = null;
    this.config = null;
    this.i18n = createI18n(app, () => this.config?.language || 'auto');
    this.t = (key, variables) => this.i18n.t(key, variables);
  }

  getLocalDateString(date = new Date()) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  getDailyNotesSettings() {
    const dailyNotesPlugin = this.app.internalPlugins?.plugins?.['daily-notes'];
    if (dailyNotesPlugin?.instance?.options) {
      return dailyNotesPlugin.instance.options;
    }
    const periodicNotesPlugin = this.app.plugins?.plugins?.['periodic-notes'];
    if (periodicNotesPlugin?.settings?.daily) {
      return periodicNotesPlugin.settings.daily;
    }
    return null;
  }

  autoDetectTemplatePath() {
    let folder = 'Notes/DailyNotes';
    let template = '';

    const dailyNotesPlugin = this.app.internalPlugins?.plugins?.['daily-notes'];
    if (dailyNotesPlugin?.enabled && dailyNotesPlugin?.instance?.options) {
      folder = dailyNotesPlugin.instance.options.folder || folder;
      template = dailyNotesPlugin.instance.options.template || '';
    }

    if (template) return template;
    return `${folder}/Template`;
  }

  autoDetectDataPath() {
    let folder = 'Notes/DailyNotes';
    
    const dailyNotesPlugin = this.app.internalPlugins?.plugins?.['daily-notes'];
    if (dailyNotesPlugin?.enabled && dailyNotesPlugin?.instance?.options) {
      folder = dailyNotesPlugin.instance.options.folder || folder;
    }
    
    return `${folder}/supreme-player-data.json`;
  }

  getDefaultCurrenciesDefinition() {
    return [
      {
        id: 'wishStars',
        name: this.makeBilingualFromKey('datastore.currency.wishStars.name'),
        icon: '⭐',
        description: this.makeBilingualFromKey('datastore.currency.wishStars.desc'),
        earnRate: 100,
        earnAmount: 1,
        color: '#ffd700',
        editable: true
      },
      {
        id: 'rareItemCards',
        name: this.makeBilingualFromKey('datastore.currency.rareItemCards.name'),
        icon: '🎴',
        description: this.makeBilingualFromKey('datastore.currency.rareItemCards.desc'),
        earnRate: 500,
        earnAmount: 1,
        color: '#9966ff',
        editable: true
      },
      {
        id: 'legendaryItemCards',
        name: this.makeBilingualFromKey('datastore.currency.legendaryItemCards.name'),
        icon: '🌠',
        description: this.makeBilingualFromKey('datastore.currency.legendaryItemCards.desc'),
        earnRate: 2000,
        earnAmount: 1,
        color: '#ffaa00',
        editable: true
      }
    ];
  }

  getTranslation(language, key, variables) {
    return this.i18n.translate(language, key, variables);
  }

  makeBilingualValue(zh, en) {
    return {
      lang: {
        zh,
        en
      }
    };
  }

  makeBilingualFromKey(key) {
    return this.makeBilingualValue(
      this.getTranslation('zh', key),
      this.getTranslation('en', key)
    );
  }

  isBilingualValue(value) {
    return Boolean(
      value
      && typeof value === 'object'
      && !Array.isArray(value)
      && value.lang
      && typeof value.lang === 'object'
    );
  }

  getLocalizedText(value, fallback = '') {
    if (this.isBilingualValue(value)) {
      const language = this.i18n.getLanguage();
      return value.lang[language] || value.lang.zh || value.lang.en || fallback;
    }
    return value ?? fallback;
  }

  updateLocalizedValue(existingValue, nextValue) {
    if (this.isBilingualValue(existingValue)) {
      const language = this.i18n.getLanguage();
      return {
        ...existingValue,
        lang: {
          ...existingValue.lang,
          [language]: nextValue
        }
      };
    }
    return nextValue;
  }

  getBuiltinLevelDefinitions() {
    return [
      { minLevel: 0, maxLevel: 19, color: '#9966ff', abilityIcon: '✨', phaseIcon: '🪄' },
      { minLevel: 20, maxLevel: 39, color: '#00aaff', abilityIcon: '🔮', phaseIcon: '🫧' },
      { minLevel: 40, maxLevel: 59, color: '#00ffaa', abilityIcon: '🛠️', phaseIcon: '👑' },
      { minLevel: 60, maxLevel: 79, color: '#ffaa00', abilityIcon: '🌍', phaseIcon: '🧿' },
      { minLevel: 80, maxLevel: 99, color: '#ff6666', abilityIcon: '🌌', phaseIcon: '👾' },
      { minLevel: 100, maxLevel: 999, color: '#ffd700', abilityIcon: '♾️', phaseIcon: 'ↂ' }
    ];
  }

  getLocalizedBuiltinLevel(index) {
    const base = this.getBuiltinLevelDefinitions()[index];
    if (!base) return null;
    return {
      ...base,
      title: this.makeBilingualFromKey(`datastore.level.${index}.title`),
      ability: this.makeBilingualFromKey(`datastore.level.${index}.ability`),
      phase: this.makeBilingualFromKey(`datastore.level.${index}.phase`)
    };
  }

  getBuiltinShopDefinitions() {
    return [
      { id: 'wish-star-boost', category: 'system', type: 'consumable', rarity: 'rare', price: 1, icon: '⭐', effect: { type: 'add_wish_stars', value: 5 }, editable: false },
      { id: 'level-skip', category: 'system', type: 'consumable', rarity: 'legendary', price: 2, icon: '⏫', effect: { type: 'add_points', value: 5000 }, editable: false },
      { id: 'warmup-card', category: 'system', type: 'consumable', rarity: 'rare', price: 3, icon: '🔥', effect: { type: 'checkin_warmup', value: 1 }, editable: false },
      { id: 'mystery-box', category: 'system', type: 'consumable', rarity: 'rare', price: 1, icon: '🎁', effect: { type: 'random_wish_stars', min: 1, max: 10 }, editable: true },
      { id: 'double-points-potion', category: 'system', type: 'consumable', rarity: 'rare', price: 5, icon: '💫', effect: { type: 'buff', buffName: this.t('datastore.shop.double-points-potion.name'), buffIcon: '💫', buffDesc: this.t('datastore.shop.double-points-potion.desc'), duration: 24 }, editable: false },
      { id: 'streak-shield', category: 'system', type: 'consumable', rarity: 'legendary', price: 3, icon: '🛡️', effect: { type: 'streak_shield', value: 1 }, editable: false },
      { id: 'mystery-box-plus', category: 'system', type: 'consumable', rarity: 'rare', price: 3, icon: '🎁', effect: { type: 'random_wish_stars_plus', min: 1, max: 20, bonusChance: 0.1, bonusAmount: 50 }, editable: false },
      { id: 'wheel-of-fortune', category: 'system', type: 'consumable', rarity: 'legendary', price: 1, icon: '🃏', effect: { type: 'random_rare_item' }, editable: false },
      { id: 'legendary-chest', category: 'system', type: 'consumable', rarity: 'legendary', price: 3, icon: '📦', effect: { type: 'legendary_chest' }, editable: false },
      { id: 'treat-coupon', category: 'external', type: 'consumable', rarity: 'rare', price: 3, icon: '🍰', effect: null, editable: true },
      { id: 'game-time-coupon', category: 'external', type: 'consumable', rarity: 'rare', price: 5, icon: '🎮', effect: null, editable: true },
      { id: 'movie-night', category: 'external', type: 'consumable', rarity: 'rare', price: 8, icon: '🎬', effect: null, editable: true },
      { id: 'small-wish-coupon', category: 'external', type: 'consumable', rarity: 'legendary', price: 2, icon: '🛒', effect: null, editable: true },
      { id: 'rest-day-pass', category: 'external', type: 'consumable', rarity: 'legendary', price: 5, icon: '🏖️', effect: null, editable: true },
      { id: 'big-wish-coupon', category: 'external', type: 'consumable', rarity: 'legendary', price: 10, icon: '🎁', effect: null, editable: true }
    ];
  }

  getLocalizedBuiltinShopItem(id) {
    const base = this.getBuiltinShopDefinitions().find(item => item.id === id);
    if (!base) return null;
    return {
      ...base,
      name: this.makeBilingualFromKey(`datastore.shop.${id}.name`),
      description: this.makeBilingualFromKey(`datastore.shop.${id}.desc`)
    };
  }

  getLocalizedPerfectRewardDefaults() {
    return {
      name: this.makeBilingualFromKey('datastore.reward.superDiamond.name'),
      description: this.makeBilingualFromKey('datastore.reward.superDiamond.desc'),
      blessingTitle: this.makeBilingualFromKey('datastore.reward.defaultBlessingTitle'),
      blessingMessage: this.makeBilingualFromKey('datastore.reward.defaultBlessingMessage')
    };
  }

  getLocalizedCurrency(currency) {
    const keysById = {
      wishStars: ['datastore.currency.wishStars.name', 'datastore.currency.wishStars.desc'],
      rareItemCards: ['datastore.currency.rareItemCards.name', 'datastore.currency.rareItemCards.desc'],
      legendaryItemCards: ['datastore.currency.legendaryItemCards.name', 'datastore.currency.legendaryItemCards.desc']
    };

    const keys = keysById[currency.id];
    if (!keys) return currency;

    const [nameKey, descKey] = keys;
    const englishName = this.getTranslation('en', nameKey);
    const englishDesc = this.getTranslation('en', descKey);
    const localizedName = this.t(nameKey);
    const localizedDesc = this.t(descKey);

    const resolvedName = this.getLocalizedText(currency.name);
    const resolvedDescription = this.getLocalizedText(currency.description);
    return {
      ...currency,
      name: this.isBilingualValue(currency.name) || !currency.name || currency.name === englishName || currency.name === localizedName ? (resolvedName || localizedName) : currency.name,
      description: this.isBilingualValue(currency.description) || !currency.description || currency.description === englishDesc || currency.description === localizedDesc ? (resolvedDescription || localizedDesc) : currency.description
    };
  }

  getLocalizedLevelConfig(levelConfig, index) {
    const localized = this.getLocalizedBuiltinLevel(index);
    if (!localized) return levelConfig;

    const englishTitle = this.getTranslation('en', `datastore.level.${index}.title`);
    const englishAbility = this.getTranslation('en', `datastore.level.${index}.ability`);
    const englishPhase = this.getTranslation('en', `datastore.level.${index}.phase`);
    const localizedTitle = this.getLocalizedText(localized.title);
    const localizedAbility = this.getLocalizedText(localized.ability);
    const localizedPhase = this.getLocalizedText(localized.phase);
    const currentTitle = this.getLocalizedText(levelConfig.title, levelConfig.title);
    const currentAbility = this.getLocalizedText(levelConfig.ability, levelConfig.ability);
    const currentPhase = this.getLocalizedText(levelConfig.phase, levelConfig.phase);

    const sameRange = levelConfig.minLevel === localized.minLevel && levelConfig.maxLevel === localized.maxLevel;
    const canTranslate = sameRange
      && [englishTitle, localizedTitle].includes(currentTitle)
      && [englishAbility, localizedAbility].includes(currentAbility)
      && [englishPhase, localizedPhase].includes(currentPhase);

    if (!canTranslate) {
      return {
        ...levelConfig,
        title: this.getLocalizedText(levelConfig.title, ''),
        ability: this.getLocalizedText(levelConfig.ability, ''),
        phase: this.getLocalizedText(levelConfig.phase, '')
      };
    }

    return {
      ...levelConfig,
      title: localizedTitle,
      ability: localizedAbility,
      phase: localizedPhase
    };
  }

  getLocalizedShopItem(item) {
    const localized = this.getLocalizedBuiltinShopItem(item.id);
    if (!localized) {
      return {
        ...item,
        name: this.getLocalizedText(item.name, item.name),
        description: this.getLocalizedText(item.description, item.description)
      };
    }

    const englishName = this.getTranslation('en', `datastore.shop.${item.id}.name`);
    const englishDesc = this.getTranslation('en', `datastore.shop.${item.id}.desc`);
    const localizedName = this.getLocalizedText(localized.name);
    const localizedDesc = this.getLocalizedText(localized.description);
    const currentName = this.getLocalizedText(item.name, item.name);
    const currentDesc = this.getLocalizedText(item.description, item.description);

    return {
      ...item,
      name: this.isBilingualValue(item.name) || !item.name || currentName === englishName || currentName === localizedName ? localizedName : item.name,
      description: this.isBilingualValue(item.description) || !item.description || currentDesc === englishDesc || currentDesc === localizedDesc ? localizedDesc : item.description
    };
  }

  getLocalizedPerfectReward(reward) {
    if (!reward) return reward;
    return {
      ...reward,
      blessingTitle: this.getLocalizedText(reward.blessingTitle, ''),
      blessingMessage: this.getLocalizedText(reward.blessingMessage, ''),
      exclusiveItem: reward.exclusiveItem
        ? {
            ...reward.exclusiveItem,
            name: this.getLocalizedText(reward.exclusiveItem.name, ''),
            description: this.getLocalizedText(reward.exclusiveItem.description, '')
          }
        : reward.exclusiveItem
    };
  }

  getDefaultLevelsDefinition() {
    return this.getBuiltinLevelDefinitions().map((level, index) => ({
      ...level,
      title: this.makeBilingualFromKey(`datastore.level.${index}.title`),
      ability: this.makeBilingualFromKey(`datastore.level.${index}.ability`),
      phase: this.makeBilingualFromKey(`datastore.level.${index}.phase`)
    }));
  }

  getDefaultDailyTasksDefinition() {
    return {
      mainTasks: { count: 3, pointsPerTask: 100 },
      habits: {
        items: [
          { name: this.t('datastore.habit.wakeUp'), points: 50 },
          { name: this.t('datastore.habit.exercise'), points: 50 },
          { name: this.t('datastore.habit.read'), points: 50 }
        ]
      },
      extraTasks: { count: 2, pointsPerTask: 50 },
      pomodoro: { count: 6, pointsPerPomodoro: 50 }
    };
  }

  async loadConfig() {
    try {
      const adapter = this.app.vault.adapter;
      if (await adapter.exists(CONFIG_FILE)) {
        const content = await adapter.read(CONFIG_FILE);
        const config = JSON.parse(content);
        let changed = false;

        if (!config.currencies) {
          config.currencies = this.getDefaultCurrenciesDefinition();
          changed = true;
        }

        if (!config.language) {
          config.language = 'auto';
          changed = true;
        }

        if (!config.perfectCheckInReward) {
          config.perfectCheckInReward = this.getDefaultConfig().perfectCheckInReward;
          changed = true;
        }

        if (changed) {
          await adapter.write(CONFIG_FILE, JSON.stringify(config, null, 2));
        }

        return config;
      }
    } catch (e) {
      console.error('Failed to load config:', e);
    }
    const defaultConfig = this.getDefaultConfig();
    const adapter = this.app.vault.adapter;
    await adapter.write(CONFIG_FILE, JSON.stringify(defaultConfig, null, 2));
    return defaultConfig;
  }

  getDefaultConfig() {
    const detectedDataPath = this.autoDetectDataPath();
    const detectedTemplatePath = this.autoDetectTemplatePath();
    return {
      language: 'auto',
      debugMode: false,
      dataFilePath: detectedDataPath,
      templatePath: detectedTemplatePath,
      levels: this.getDefaultLevelsDefinition(),
      currencies: this.getDefaultCurrenciesDefinition(),
      customCurrencies: [],
      dailyTasks: this.getDefaultDailyTasksDefinition(),
      perfectCheckInReward: {
        enabled: true,
        rewardType: 'exclusive',
        shopItemId: null,
        exclusiveItem: {
          name: this.makeBilingualFromKey('datastore.reward.superDiamond.name'),
          icon: '💎',
          description: this.makeBilingualFromKey('datastore.reward.superDiamond.desc'),
          rarity: 'legendary',
          category: 'system',
          effect: { type: 'super_diamond' }
        },
        blessingTitle: this.makeBilingualFromKey('datastore.reward.defaultBlessingTitle'),
        blessingMessage: this.makeBilingualFromKey('datastore.reward.defaultBlessingMessage')
      }
    };
  }

  async saveConfig() {
    if (!this.config) return;
    const adapter = this.app.vault.adapter;
    await adapter.write(CONFIG_FILE, JSON.stringify(this.config, null, 2));
  }

  getCurrencies() {
    const defaultCurrencies = this.getDefaultCurrenciesDefinition();

    if (!this.config) return defaultCurrencies;
    const currencies = this.config.currencies || defaultCurrencies;
    return [...currencies.map(currency => this.getLocalizedCurrency(currency)), ...(this.config.customCurrencies || [])];
  }

  async searchDataFile() {
    const dataFileName = 'supreme-player-data.json';
    const dailyNotesSettings = this.getDailyNotesSettings();
    
    if (dailyNotesSettings?.folder) {
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
          if (searched) dataFile = searched;
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
      console.error('Failed to load data:', e);
    }
    this.stats = this.getDefaultStats();
    this.shopConfig = await this.loadShopConfig();
    await this.save();
    return this.stats;
  }

  initStatsDefaults() {
    if (!this.stats) return;
    if (!this.stats.wishes) this.stats.wishes = [];
    if (!this.stats.inventory) this.stats.inventory = [];
    if (!this.stats.usedExternalItems) this.stats.usedExternalItems = [];
    if (!this.stats.checkInHistory) this.stats.checkInHistory = [];
    if (this.stats.checkInWarmupStacks === undefined) this.stats.checkInWarmupStacks = 0;
    if (this.stats.checkInWarmupAnchorDate === undefined) this.stats.checkInWarmupAnchorDate = null;
    if (this.stats.streakShieldCount === undefined) this.stats.streakShieldCount = 0;
    if (this.stats.playerName === undefined) this.stats.playerName = this.t('settings.defaultPlayerName');
    if (this.stats.todayPoints === undefined) this.stats.todayPoints = 0;

    const currencies = this.getCurrencies();
    for (const currency of currencies) {
      if (this.stats[currency.id] === undefined) {
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
        const builtinItems = this.getDefaultShopItems();
        if (!config.items || config.items.length === 0) {
          config.items = builtinItems;
          await adapter.write(SHOP_CONFIG_FILE, JSON.stringify(config, null, 2));
        } else {
          const existingIds = new Set(config.items.map(item => item.id));
          const missingBuiltinItems = builtinItems.filter(item => !existingIds.has(item.id));
          if (missingBuiltinItems.length) {
            config.items.push(...missingBuiltinItems);
            await adapter.write(SHOP_CONFIG_FILE, JSON.stringify(config, null, 2));
          }
        }
        return config;
      } else {
        const defaultConfig = { items: this.getDefaultShopItems() };
        await adapter.write(SHOP_CONFIG_FILE, JSON.stringify(defaultConfig, null, 2));
        return defaultConfig;
      }
    } catch (e) {
      console.error('Failed to load shop config:', e);
      return { items: this.getDefaultShopItems() };
    }
  }

  async save() {
    if (!this.stats) return;
    this.stats.lastUpdated = new Date().toISOString();
    const adapter = this.app.vault.adapter;
    const dataFile = this.config?.dataFilePath || this.autoDetectDataPath();
    await adapter.write(dataFile, JSON.stringify(this.stats, null, 2));
  }

  getDefaultStats() {
    const stats = {
      playerName: this.t('settings.defaultPlayerName'),
      totalPoints: 0,
      currentPoints: 0,
      level: 0,
      todayPoints: 0,
      wishStars: 0,
      rareItemCards: 0,
      legendaryItemCards: 0,
      lastUpdated: new Date().toISOString(),
      lastCheckInDate: null,
      checkInHistory: [],
      checkInWarmupStacks: 0,
      checkInWarmupAnchorDate: null,
      streakShieldCount: 0,
      wishes: [],
      inventory: [],
      usedExternalItems: [],
      buffs: [],
      completedWishes: 0
    };

    if (this.config?.customCurrencies) {
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
    if (!stats.buffs) stats.buffs = [];

    const buff = {
      id: buffId,
      name: name,
      icon: icon,
      description: description,
      durationHours: durationHours,
      appliedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + durationHours * 60 * 60 * 1000).toISOString()
    };

    stats.buffs = stats.buffs.filter(existing => existing.id !== buffId);
    stats.buffs.push(buff);
    await this.save();
    return { success: true, buff: buff };
  }

  getActiveBuffs() {
    const stats = this.getStats();
    if (!stats.buffs) return [];

    const now = new Date();
    return stats.buffs.filter(buff => new Date(buff.expiresAt) > now);
  }

  ensureCheckInHistory() {
    const stats = this.getStats();
    if (!stats.checkInHistory) {
      stats.checkInHistory = [];
    }
    return stats.checkInHistory;
  }

  recordCheckInDate(dateString) {
    const stats = this.getStats();
    const history = this.ensureCheckInHistory();
    if (!history.includes(dateString)) {
      history.push(dateString);
      history.sort();
    }
    stats.lastCheckInDate = dateString;
  }

  getCheckInStreak(referenceDate = new Date()) {
    const history = new Set(this.ensureCheckInHistory());
    let streak = 0;
    const cursor = new Date(referenceDate);

    while (true) {
      const date = this.getLocalDateString(cursor);
      if (!history.has(date)) {
        break;
      }
      streak += 1;
      cursor.setDate(cursor.getDate() - 1);
    }

    return streak;
  }

  getYesterdayString(referenceDate = new Date()) {
    const yesterday = new Date(referenceDate);
    yesterday.setDate(yesterday.getDate() - 1);
    return this.getLocalDateString(yesterday);
  }

  isCheckInChainActive(referenceDate = new Date()) {
    const stats = this.getStats();
    const actualStreak = this.getCheckInStreak(referenceDate);
    if (actualStreak > 0) {
      return true;
    }

    const today = this.getLocalDateString(referenceDate);
    const yesterday = this.getYesterdayString(referenceDate);
    if (stats.lastCheckInDate === today || stats.lastCheckInDate === yesterday) {
      return true;
    }

    if (!stats.lastCheckInDate && (!stats.checkInHistory || stats.checkInHistory.length === 0)) {
      return true;
    }

    if (stats.checkInWarmupAnchorDate === today || stats.checkInWarmupAnchorDate === yesterday) {
      return true;
    }

    if (stats.streakShieldCount > 0) {
      stats.streakShieldCount -= 1;
      stats.lastCheckInDate = yesterday;
      return true;
    }

    return false;
  }

  normalizeCheckInWarmupState(referenceDate = new Date()) {
    const stats = this.getStats();
    if (!this.isCheckInChainActive(referenceDate)) {
      stats.checkInWarmupStacks = 0;
      stats.checkInWarmupAnchorDate = null;
    }
  }

  getCheckInWarmupStacks(referenceDate = new Date()) {
    this.normalizeCheckInWarmupState(referenceDate);
    const stats = this.getStats();
    return Math.max(0, Number(stats.checkInWarmupStacks || 0));
  }

  getEffectiveCheckInStreak(referenceDate = new Date()) {
    const actualStreak = this.getCheckInStreak(referenceDate);
    const warmupStacks = this.getCheckInWarmupStacks(referenceDate);
    return {
      actualStreak,
      warmupStacks,
      effectiveStreak: actualStreak + warmupStacks
    };
  }

  getCheckInBonusMultiplier(streak) {
    if (streak >= 7) return 1.5;
    if (streak >= 3) return 1.2;
    return 1;
  }

  getCurrentCheckInBuffInfo(referenceDate = new Date()) {
    const stats = this.getStats();
    this.normalizeCheckInWarmupState(referenceDate);
    const { actualStreak, warmupStacks, effectiveStreak } = this.getEffectiveCheckInStreak(referenceDate);
    const activeBuffs = this.getActiveBuffs();
    const activeBuff = activeBuffs.find(buff => ['checkin-enhance', 'checkin-transcendent'].includes(buff.id)) || null;
    const multiplier = this.getCheckInBonusMultiplier(effectiveStreak);
    const nextTarget = effectiveStreak >= 7 ? null : (effectiveStreak >= 3 ? 7 : 3);
    const remainingDays = nextTarget === null ? 0 : Math.max(0, nextTarget - effectiveStreak);

    return {
      actualStreak,
      warmupStacks,
      effectiveStreak,
      multiplier,
      bonusPercent: Math.round((multiplier - 1) * 100),
      activeBuff,
      nextTarget,
      remainingDays,
      isBuffActive: Boolean(activeBuff)
    };
  }

  async refreshCheckInStreakBuff(streak) {
    const stats = this.getStats();
    if (!stats.buffs) stats.buffs = [];

    stats.buffs = stats.buffs.filter(buff => !['checkin-enhance', 'checkin-transcendent'].includes(buff.id));

    if (streak >= 7) {
      await this.addBuff(
        'checkin-transcendent',
        this.t('inventory.buff.checkInTranscendentName'),
        '🌠',
        this.t('inventory.buff.checkInTranscendentDesc'),
        24
      );
      return 'checkin-transcendent';
    }

    if (streak >= 3) {
      await this.addBuff(
        'checkin-enhance',
        this.t('inventory.buff.checkInEnhanceName'),
        '⚡',
        this.t('inventory.buff.checkInEnhanceDesc'),
        24
      );
      return 'checkin-enhance';
    }

    await this.save();
    return null;
  }

  async addCheckInPoints(basePoints) {
    this.normalizeCheckInWarmupState();
    const today = this.getLocalDateString();
    this.recordCheckInDate(today);

    const { actualStreak, warmupStacks, effectiveStreak } = this.getEffectiveCheckInStreak();
    const multiplier = this.getCheckInBonusMultiplier(effectiveStreak);
    const awardedPoints = Math.round(basePoints * multiplier);

    await this.refreshCheckInStreakBuff(effectiveStreak);
    const result = await this.addPoints(awardedPoints);

    return {
      ...result,
      basePoints,
      awardedPoints,
      streak: effectiveStreak,
      actualStreak,
      warmupStacks,
      multiplier,
      bonusPercent: Math.round((multiplier - 1) * 100)
    };
  }

  async addPoints(points) {
    const stats = this.getStats();
    const oldTotal = stats.totalPoints;
    stats.totalPoints += points;
    stats.currentPoints += points;
    stats.todayPoints = (stats.todayPoints || 0) + points;

    const oldLevel = stats.level;
    const newLevel = Math.floor(stats.totalPoints / 5000);
    const rewards = [];

    if (newLevel > oldLevel) {
      stats.level = newLevel;
      rewards.push(this.t('datastore.reward.levelUp', { level: newLevel }));
    }

    const currencies = this.getCurrencies();
    for (const currency of currencies) {
      const oldAmount = Math.floor(oldTotal / currency.earnRate);
      const newAmount = Math.floor(stats.totalPoints / currency.earnRate);
      if (newAmount > oldAmount) {
        stats[currency.id] = (stats[currency.id] || 0) + (newAmount - oldAmount);
        rewards.push(this.t('datastore.reward.currencyGain', { icon: currency.icon, name: currency.name, amount: newAmount - oldAmount }));
      }
    }

    await this.save();
    return {
      levelUp: newLevel > oldLevel,
      newLevel: stats.level,
      rewards: rewards
    };
  }

  async makeWish(name, description) {
    const stats = this.getStats();

    const wish = {
      id: Date.now().toString(),
      name,
      description: description || '',
      starCost: 0,
      progress: 0,
      createdAt: new Date().toISOString(),
      lastBoost: new Date().toISOString(),
      status: 'active'
    };

    stats.wishes.push(wish);
    await this.save();
    return { success: true, wish, message: this.t('wish.message.created') };
  }

  async boostWish(wishId, starCost) {
    const stats = this.getStats();
    if (stats.wishStars < starCost) {
      return { success: false, message: this.t('wish.message.notEnoughStars') };
    }

    const wish = stats.wishes.find(w => w.id === wishId);
    if (!wish) return { success: false, message: this.t('wish.message.notFound') };
    if (wish.status !== 'active') return { success: false, message: this.t('wish.message.inactive') };

    const hasLuckCharm = this.getActiveBuffs().some(buff => buff.id === 'luck-charm');
    let boostAmount = starCost * 10;
    if (hasLuckCharm) {
      boostAmount *= 2;
      stats.buffs = stats.buffs.filter(buff => buff.id !== 'luck-charm');
    }

    stats.wishStars -= starCost;
    wish.progress = Math.min(wish.progress + boostAmount, 100);
    wish.lastBoost = new Date().toISOString();

    if (wish.progress >= 100) {
      const result = await this.completeWish(wishId);
      return { success: true, wish, message: result.message, completed: true, blessings: result.blessings, bonusPoints: result.bonusPoints };
    }

    await this.save();
    return { success: true, wish, message: this.t('wish.message.progress', { amount: boostAmount }), completed: false };
  }

  async completeWish(wishId) {
    const stats = this.getStats();
    const wishIndex = stats.wishes.findIndex(w => w.id === wishId);

    if (wishIndex === -1) return { success: false, message: this.t('wish.message.notFound') };

    const wish = stats.wishes[wishIndex];
    if (wish.progress < 100) return { success: false, message: this.t('wish.message.progressNotFull') };

    wish.status = 'completed';
    stats.completedWishes = (stats.completedWishes || 0) + 1;
    stats.totalPoints += 500;
    stats.currentPoints += 500;

    const completedRecord = {
      id: Date.now().toString(),
      name: wish.name,
      description: wish.description,
      completedAt: new Date().toISOString(),
      bonusPoints: 500
    };

    if (!stats.completedWishRecords) stats.completedWishRecords = [];
    stats.completedWishRecords.push(completedRecord);
    stats.wishes.splice(wishIndex, 1);

    await this.addBuff('luck-boost', this.t('inventory.buff.superLuckName'), '🍀', this.t('inventory.buff.superLuckDesc'), 24);
    await this.save();

    return {
      success: true,
      message: this.t('wish.message.completed'),
      bonusPoints: 500,
      blessings: this.getRandomBlessings()
    };
  }

  getRandomBlessings() {
    const blessings = [
      this.t('wish.blessing.0'),
      this.t('wish.blessing.1'),
      this.t('wish.blessing.2'),
      this.t('wish.blessing.3'),
      this.t('wish.blessing.4')
    ];
    return blessings.sort(() => Math.random() - 0.5).slice(0, 3);
  }

  getLevelTitle(level) {
    if (!this.config?.levels) {
      return this.getFallbackLevelTitle(level);
    }

    for (let index = 0; index < this.config.levels.length; index += 1) {
      const levelConfig = this.getLocalizedLevelConfig(this.config.levels[index], index);
      if (level >= levelConfig.minLevel && level <= levelConfig.maxLevel) {
        return {
          title: levelConfig.title,
          ability: levelConfig.ability,
          phase: levelConfig.phase,
          color: levelConfig.color || '#ffffff',
          abilityIcon: levelConfig.abilityIcon || '✨',
          phaseIcon: levelConfig.phaseIcon || '🌟'
        };
      }
    }

    const lastIndex = this.config.levels.length - 1;
    const lastLevel = this.getLocalizedLevelConfig(this.config.levels[lastIndex], lastIndex);
    return {
      title: lastLevel.title,
      ability: lastLevel.ability,
      phase: lastLevel.phase,
      color: lastLevel.color || '#ffffff',
      abilityIcon: lastLevel.abilityIcon || '✨',
      phaseIcon: lastLevel.phaseIcon || '🌟'
    };
  }

  getFallbackLevelTitle(level) {
    const levels = this.getDefaultLevelsDefinition();
    for (const entry of levels) {
      if (level <= entry.maxLevel) return { ...entry, abilityIcon: entry.abilityIcon || '✨', phaseIcon: entry.phaseIcon || '🌟' };
    }
    const finalLevel = levels[levels.length - 1];
    return { ...finalLevel, abilityIcon: finalLevel.abilityIcon || '✨', phaseIcon: finalLevel.phaseIcon || '🌟' };
  }

  getShopItems() {
    if (!this.shopConfig) this.shopConfig = { items: this.getDefaultShopItems() };
    if (!this.shopConfig.items) this.shopConfig.items = this.getDefaultShopItems();
    return this.shopConfig.items
      .filter(item => item.id !== 'milk')
      .map(item => this.getLocalizedShopItem(item));
  }

  getDefaultShopItems() {
    return this.getBuiltinShopDefinitions().map(item => this.getLocalizedBuiltinShopItem(item.id));
  }

  async purchaseItem(itemId) {
    const stats = this.getStats();
    const items = this.getShopItems();
    const item = items.find(entry => entry.id === itemId);

    if (!item) return { success: false, message: this.t('inventory.message.itemNotFound') };
    if (item.rarity === 'rare' && stats.rareItemCards < item.price) {
      return { success: false, message: this.t('shop.message.notEnoughRareCards') };
    }
    if (item.rarity === 'legendary' && stats.legendaryItemCards < item.price) {
      return { success: false, message: this.t('shop.message.notEnoughLegendaryCards') };
    }

    if (item.rarity === 'rare') {
      stats.rareItemCards -= item.price;
    } else if (item.rarity === 'legendary') {
      stats.legendaryItemCards -= item.price;
    }

    const inventoryItem = {
      instanceId: 'inv-' + Date.now().toString(),
      itemId: item.id,
      name: item.name,
      description: item.description,
      icon: item.icon,
      category: item.category || 'system',
      rarity: item.rarity,
      effect: item.effect,
      purchasedAt: new Date().toISOString()
    };

    stats.inventory.push(inventoryItem);
    await this.save();

    return { success: true, message: this.t('inventory.message.purchaseSuccess') };
  }

  async useItem(instanceId) {
    const stats = this.getStats();
    const itemIndex = stats.inventory.findIndex(item => item.instanceId === instanceId);

    if (itemIndex === -1) return { success: false, message: this.t('inventory.message.itemNotFound') };

    const item = stats.inventory[itemIndex];

    if (item.category === 'system' || item.category === 'exclusive') {
      const effect = item.effect;
      let effectMessage = '';

      if (effect) {
        switch (effect.type) {
          case 'add_wish_stars':
            stats.wishStars += effect.value || 1;
            effectMessage = this.t('inventory.effect.addWishStars', { value: effect.value || 1 });
            break;
          case 'add_level':
            stats.level += effect.value || 1;
            stats.totalPoints = Math.max(stats.totalPoints, stats.level * 5000);
            effectMessage = this.t('inventory.effect.addLevel', { value: effect.value || 1 });
            break;
          case 'add_points':
            stats.totalPoints += effect.value || 100;
            stats.currentPoints += effect.value || 100;
            stats.level = Math.floor(stats.totalPoints / 5000);
            effectMessage = this.t('inventory.effect.addPoints', { value: effect.value || 100 });
            break;
          case 'random_wish_stars': {
            const min = effect.min || 1;
            const max = effect.max || 5;
            const amount = Math.floor(Math.random() * (max - min + 1)) + min;
            stats.wishStars += amount;
            effectMessage = this.t('inventory.effect.randomWishStars', { value: amount });
            break;
          }
          case 'checkin_warmup': {
            this.normalizeCheckInWarmupState();
            stats.checkInWarmupStacks = Math.max(0, Number(stats.checkInWarmupStacks || 0)) + (effect.value || 1);
            stats.checkInWarmupAnchorDate = this.getLocalDateString();
            const refreshedInfo = this.getCurrentCheckInBuffInfo();
            if (this.isCheckInChainActive() && refreshedInfo.effectiveStreak >= 3) {
              await this.refreshCheckInStreakBuff(refreshedInfo.effectiveStreak);
            }
            const info = this.getCurrentCheckInBuffInfo();
            effectMessage = this.t('inventory.effect.checkInWarmup', {
              value: effect.value || 1,
              total: stats.checkInWarmupStacks,
              target: info.nextTarget || 7,
              remaining: info.remainingDays
            });
            break;
          }
          case 'buff': {
            const buffId = 'custom-' + Date.now().toString();
            const duration = effect.duration || effect.buffDuration || 24;
            await this.addBuff(buffId, effect.buffName, effect.buffIcon || item.icon, effect.buffDesc || item.description, duration);
            effectMessage = this.t('inventory.effect.buff', { name: effect.buffName });
            break;
          }
          case 'super_diamond': {
            const baseAmount = Math.floor(Math.random() * 5) + 1;
            let totalStars = baseAmount;
            if (Math.random() < 0.2) totalStars += 5;
            if (Math.random() < 0.01) totalStars += 100;
            stats.wishStars += totalStars;
            await this.addBuff('super-luck', this.t('inventory.buff.superLuckName'), '💫', this.t('inventory.buff.superLuckDesc'), 1);
            effectMessage = this.t('inventory.effect.superDiamond', { value: totalStars });
            break;
          }
          case 'clear_all_buffs':
            stats.buffs = [];
            effectMessage = this.t('inventory.effect.clearAllBuffs');
            break;
          case 'streak_shield': {
            stats.streakShieldCount = (stats.streakShieldCount || 0) + (effect.value || 1);
            effectMessage = this.t('inventory.effect.streakShield', { value: stats.streakShieldCount });
            break;
          }
          case 'random_wish_stars_plus': {
            const plusMin = effect.min || 1;
            const plusMax = effect.max || 20;
            let plusAmount = Math.floor(Math.random() * (plusMax - plusMin + 1)) + plusMin;
            const bonusChance = effect.bonusChance || 0.1;
            const bonusAmount = effect.bonusAmount || 50;
            if (Math.random() < bonusChance) {
              plusAmount = bonusAmount;
              effectMessage = this.t('inventory.effect.randomWishStarsPlus', { value: plusAmount });
            } else {
              effectMessage = this.t('inventory.effect.randomWishStars', { value: plusAmount });
            }
            stats.wishStars += plusAmount;
            break;
          }
          case 'random_rare_item': {
            const allShopItems = this.getShopItems().filter(si => si.rarity === 'rare' && si.category === 'system');
            if (allShopItems.length > 0) {
              const randomItem = allShopItems[Math.floor(Math.random() * allShopItems.length)];
              const rewardItem = {
                instanceId: 'inv-' + Date.now().toString(),
                itemId: randomItem.id,
                name: randomItem.name,
                description: randomItem.description,
                icon: randomItem.icon,
                category: randomItem.category || 'system',
                rarity: randomItem.rarity,
                effect: randomItem.effect,
                purchasedAt: new Date().toISOString()
              };
              stats.inventory.push(rewardItem);
              effectMessage = this.t('inventory.effect.randomRareItem', { name: randomItem.name });
            } else {
              stats.wishStars += 5;
              effectMessage = this.t('inventory.effect.addWishStars', { value: 5 });
            }
            break;
          }
          case 'legendary_chest': {
            const rarePool = this.getShopItems().filter(si => si.rarity === 'rare' && si.category === 'system');
            const legendaryPool = this.getShopItems().filter(si => si.rarity === 'legendary' && si.category === 'system');
            const rareCount = Math.floor(Math.random() * 3) + 1;
            let chestCount = 0;
            for (let i = 0; i < rareCount && rarePool.length > 0; i++) {
              const pick = rarePool[Math.floor(Math.random() * rarePool.length)];
              stats.inventory.push({
                instanceId: 'inv-' + (Date.now() + i).toString(),
                itemId: pick.id,
                name: pick.name,
                description: pick.description,
                icon: pick.icon,
                category: pick.category || 'system',
                rarity: pick.rarity,
                effect: pick.effect,
                purchasedAt: new Date().toISOString()
              });
              chestCount++;
            }
            if (Math.random() < 0.1 && legendaryPool.length > 0) {
              const legendaryPick = legendaryPool[Math.floor(Math.random() * legendaryPool.length)];
              stats.inventory.push({
                instanceId: 'inv-' + (Date.now() + 99).toString(),
                itemId: legendaryPick.id,
                name: legendaryPick.name,
                description: legendaryPick.description,
                icon: legendaryPick.icon,
                category: legendaryPick.category || 'system',
                rarity: legendaryPick.rarity,
                effect: legendaryPick.effect,
                purchasedAt: new Date().toISOString()
              });
              chestCount++;
            }
            effectMessage = this.t('inventory.effect.legendaryChest', { count: chestCount });
            break;
          }
        }
      }

      stats.inventory.splice(itemIndex, 1);
      await this.save();
      return {
        success: true,
        message: effectMessage
          ? this.t('inventory.message.usedSuccessWithEffect', { name: item.name, effect: effectMessage })
          : this.t('inventory.message.usedSuccess', { name: item.name }),
        external: false
      };
    }

    if (item.category === 'external') {
      stats.inventory.splice(itemIndex, 1);
      if (!stats.usedExternalItems) stats.usedExternalItems = [];
      stats.usedExternalItems.push({ ...item, usedAt: new Date().toISOString() });
      await this.save();
      return { success: true, message: this.t('inventory.message.externalUsed', { name: item.name }), external: true, item };
    }

    return { success: false, message: this.t('inventory.message.useFailed') };
  }

  async exportData() {
    const data = {
      stats: this.stats,
      config: this.config,
      shopConfig: this.shopConfig,
      exportedAt: new Date().toISOString()
    };
    return JSON.stringify(data, null, 2);
  }

  async importData(jsonString) {
    try {
      const data = JSON.parse(jsonString);
      if (data.stats) {
        this.stats = data.stats;
        if (Array.isArray(this.stats.inventory)) {
          for (const item of this.stats.inventory) {
            if (item?.category === 'exclusive') {
              item.category = 'system';
            }
          }
        }
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
      return { success: true, message: this.t('datastore.message.importSuccess') };
    } catch (e) {
      return { success: false, message: this.t('datastore.message.importFailed', { message: e.message }) };
    }
  }

  async saveShopConfig() {
    if (!this.shopConfig) return;
    const adapter = this.app.vault.adapter;
    await adapter.write(SHOP_CONFIG_FILE, JSON.stringify(this.shopConfig, null, 2));
  }

  async addShopItem(name, description, category, type, price, rarity, icon, effect) {
    if (!this.shopConfig) this.shopConfig = { items: this.getDefaultShopItems() };
    if (!this.shopConfig.items) this.shopConfig.items = this.getDefaultShopItems();

    const newItem = {
      id: 'item-' + Date.now().toString(),
      name,
      description: description || '',
      category: category || 'system',
      type: type || 'consumable',
      price: price || 1,
      rarity: rarity || 'rare',
      icon: icon || '🎁',
      effect
    };

    this.shopConfig.items.push(newItem);
    await this.saveShopConfig();
    return { success: true, message: this.t('datastore.message.itemAdded'), item: newItem };
  }

  async updateShopItem(itemId, updates) {
    if (!this.shopConfig?.items) {
      return { success: false, message: this.t('datastore.message.shopConfigMissing') };
    }

    const item = this.shopConfig.items.find(entry => entry.id === itemId);
    if (!item) return { success: false, message: this.t('inventory.message.itemNotFound') };

    if (updates.name !== undefined) item.name = this.updateLocalizedValue(item.name, updates.name);
    if (updates.description !== undefined) item.description = this.updateLocalizedValue(item.description, updates.description);
    const fields = ['icon', 'price', 'rarity', 'category', 'effect'];
    for (const field of fields) {
      if (updates[field] !== undefined) item[field] = updates[field];
    }

    await this.saveShopConfig();
    return { success: true, message: this.t('datastore.message.itemUpdated') };
  }

  async deleteShopItem(itemId) {
    if (!this.shopConfig?.items) {
      return { success: false, message: this.t('datastore.message.shopConfigMissing') };
    }

    const itemIndex = this.shopConfig.items.findIndex(entry => entry.id === itemId);
    if (itemIndex === -1) return { success: false, message: this.t('inventory.message.itemNotFound') };

    this.shopConfig.items.splice(itemIndex, 1);
    await this.saveShopConfig();
    return { success: true, message: this.t('datastore.message.itemDeleted') };
  }

  async updateLevelConfig(index, updates) {
    if (!this.config?.levels) return { success: false, message: this.t('datastore.message.levelConfigMissing') };
    if (!this.config.levels[index]) return { success: false, message: this.t('datastore.message.levelNotFound') };

    const level = this.config.levels[index];
    if (updates.title !== undefined) level.title = this.updateLocalizedValue(level.title, updates.title);
    if (updates.ability !== undefined) level.ability = this.updateLocalizedValue(level.ability, updates.ability);
    if (updates.phase !== undefined) level.phase = this.updateLocalizedValue(level.phase, updates.phase);
    const fields = ['abilityIcon', 'phaseIcon', 'color', 'minLevel', 'maxLevel'];
    for (const field of fields) {
      if (updates[field] !== undefined) level[field] = updates[field];
    }

    await this.saveConfig();
    return { success: true, message: this.t('datastore.message.levelUpdated') };
  }

  async addLevelConfig(levelData) {
    if (!this.config) this.config = this.getDefaultConfig();
    if (!this.config.levels) this.config.levels = [];

    const newLevel = {
      minLevel: levelData.minLevel || 0,
      maxLevel: levelData.maxLevel || 999,
      title: levelData.title || 'New Level',
      ability: levelData.ability || '',
      abilityIcon: levelData.abilityIcon || '✨',
      phase: levelData.phase || 'Mortal',
      phaseIcon: levelData.phaseIcon || '🌟',
      color: levelData.color || '#ffffff'
    };

    this.config.levels.push(newLevel);
    this.config.levels.sort((a, b) => a.minLevel - b.minLevel);
    await this.saveConfig();
    return { success: true, message: this.t('datastore.message.levelAdded') };
  }

  async deleteLevelConfig(index) {
    if (!this.config?.levels) return { success: false, message: this.t('datastore.message.levelConfigMissing') };
    if (!this.config.levels[index]) return { success: false, message: this.t('datastore.message.levelNotFound') };

    this.config.levels.splice(index, 1);
    await this.saveConfig();
    return { success: true, message: this.t('datastore.message.levelDeleted') };
  }

  async addCurrency(name, icon, description, earnRate, color) {
    if (!this.config) this.config = this.getDefaultConfig();
    if (!this.config.customCurrencies) this.config.customCurrencies = [];

    const id = 'custom-' + name.toLowerCase().replace(/\s+/g, '-');
    const newCurrency = {
      id,
      name,
      icon: icon || '🪙',
      description: description || '',
      earnRate: earnRate || 1000,
      earnAmount: 1,
      color: color || '#00ff00',
      editable: true
    };

    this.config.customCurrencies.push(newCurrency);

    const stats = this.getStats();
    if (stats[id] === undefined) stats[id] = 0;

    await this.saveConfig();
    await this.save();
    return { success: true, message: this.t('datastore.message.currencyAdded'), currency: newCurrency };
  }

  async updateCurrency(currencyId, updates) {
    if (!this.config) return { success: false, message: this.t('datastore.message.configMissing') };

    let currency = this.config.customCurrencies?.find(entry => entry.id === currencyId);
    if (!currency) currency = this.config.currencies?.find(entry => entry.id === currencyId);
    if (!currency) return { success: false, message: this.t('datastore.message.currencyNotFound') };
    if (!currency.editable) return { success: false, message: this.t('datastore.message.systemCurrencyLocked') };

    if (updates.name !== undefined) currency.name = this.updateLocalizedValue(currency.name, updates.name);
    if (updates.description !== undefined) currency.description = this.updateLocalizedValue(currency.description, updates.description);
    const fields = ['icon', 'earnRate', 'color'];
    for (const field of fields) {
      if (updates[field] !== undefined) currency[field] = updates[field];
    }

    await this.saveConfig();
    return { success: true, message: this.t('datastore.message.currencyUpdated') };
  }

  async deleteCurrency(currencyId) {
    if (!this.config?.customCurrencies) return { success: false, message: this.t('datastore.message.customCurrencyListMissing') };

    const index = this.config.customCurrencies.findIndex(entry => entry.id === currencyId);
    if (index === -1) return { success: false, message: this.t('datastore.message.currencyNotFound') };

    this.config.customCurrencies.splice(index, 1);
    await this.saveConfig();
    return { success: true, message: this.t('datastore.message.currencyDeleted') };
  }
}

module.exports = DataStore;
