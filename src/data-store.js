const { CONFIG_FILE, SHOP_CONFIG_FILE } = require('./utils');

class DataStore {
  constructor(app) {
    this.app = app;
    this.stats = null;
    this.shopConfig = null;
    this.config = null;
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
    const dailyNotesSettings = this.getDailyNotesSettings();
    if (dailyNotesSettings) {
      const folder = dailyNotesSettings.folder || '';
      const template = dailyNotesSettings.template || '';
      if (template) return template;
      if (folder) return `${folder}/Template.md`;
    }
    return 'Temps/DailyTracker.md';
  }

  autoDetectDataPath() {
    const dailyNotesSettings = this.getDailyNotesSettings();
    if (dailyNotesSettings) {
      const folder = dailyNotesSettings.folder || '';
      if (folder) return `${folder}/supreme-player-data.json`;
    }
    return 'supreme-player-data.json';
  }

  async loadConfig() {
    try {
      const adapter = this.app.vault.adapter;
      if (await adapter.exists(CONFIG_FILE)) {
        const content = await adapter.read(CONFIG_FILE);
        return JSON.parse(content);
      }
    } catch (e) {
      console.error('Failed to load config:', e);
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
        { minLevel: 0, maxLevel: 5, title: '星语者', ability: '扭曲现实', phase: '术士', color: '#9966ff', abilityIcon: '🌟', phaseIcon: '🪄' },
        { minLevel: 6, maxLevel: 10, title: '织梦师', ability: '覆写真实', phase: '人神', color: '#00aaff', abilityIcon: '🔮', phaseIcon: '🫧' },
        { minLevel: 11, maxLevel: 15, title: '创造主', ability: '造物创生', phase: '伪神', color: '#00ffaa', abilityIcon: '⚛️', phaseIcon: '👑' },
        { minLevel: 16, maxLevel: 20, title: '掌界者', ability: '掌控世界', phase: '真神', color: '#ffaa00', abilityIcon: '🌏', phaseIcon: '🧿' },
        { minLevel: 21, maxLevel: 25, title: '元星神', ability: '指尖寰宇', phase: '星神', color: '#ff6666', abilityIcon: '🌌', phaseIcon: '👾' },
        { minLevel: 26, maxLevel: 999, title: '无极尊', ability: '无穷界限', phase: '■■■■', color: '#ffd700', abilityIcon: '♾️', phaseIcon: 'ↂ' }
      ],
      currencies: [
        { id: 'wishStars', name: '愿星', icon: '⭐', description: '用于许愿和扰动世界线', earnRate: 100, earnAmount: 1, color: '#ffd700', editable: true },
        { id: 'rareItemCards', name: '稀有道具卡', icon: '🎴', description: '用于购买稀有品质商品', earnRate: 500, earnAmount: 1, color: '#9966ff', editable: true },
        { id: 'legendaryItemCards', name: '传奇道具卡', icon: '🌠', description: '用于购买传奇品质商品', earnRate: 2000, earnAmount: 1, color: '#ffaa00', editable: true }
      ],
      customCurrencies: [],
      dailyTasks: {
        mainTasks: { count: 3, pointsPerTask: 100 },
        habits: { items: [
          { name: '早起', points: 50 },
          { name: '运动', points: 50 },
          { name: '阅读', points: 50 }
        ]},
        extraTasks: { count: 2, pointsPerTask: 50 },
        pomodoro: { count: 6, pointsPerPomodoro: 50 }
      },
      perfectCheckInReward: {
        enabled: true,
        rewardType: 'exclusive',
        shopItemId: null,
        exclusiveItem: {
          name: '超级大钻石',
          icon: '💎',
          description: '完美打卡奖励，使用后随机获得愿星和超好运Buff',
          rarity: 'legendary',
          category: 'system',
          effect: { type: 'super_diamond' }
        },
        blessingTitle: '太棒了！今日任务全部完成！',
        blessingMessage: '每一次完美打卡，都是对自己最好的投资！'
      }
    };
  }

  async saveConfig() {
    if (!this.config) return;
    const adapter = this.app.vault.adapter;
    await adapter.write(CONFIG_FILE, JSON.stringify(this.config, null, 2));
  }

  getCurrencies() {
    if (!this.config) return [];
    return [...this.config.currencies, ...(this.config.customCurrencies || [])];
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
    if (this.stats.playerName === undefined) this.stats.playerName = '玩家';
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
      playerName: '玩家',
      totalPoints: 0,
      currentPoints: 0,
      level: 0,
      todayPoints: 0,
      wishStars: 0,
      rareItemCards: 0,
      legendaryItemCards: 0,
      lastUpdated: new Date().toISOString(),
      lastCheckInDate: null,
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
      rewards.push('🎉 等级提升到 ' + newLevel + '!');
    }

    const currencies = this.getCurrencies();
    for (const currency of currencies) {
      const oldAmount = Math.floor(oldTotal / currency.earnRate);
      const newAmount = Math.floor(stats.totalPoints / currency.earnRate);
      if (newAmount > oldAmount) {
        stats[currency.id] = (stats[currency.id] || 0) + (newAmount - oldAmount);
        rewards.push(currency.icon + ' ' + currency.name + ' +' + (newAmount - oldAmount) + '!');
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
      name: name,
      description: description || '',
      starCost: 0,
      progress: 0,
      createdAt: new Date().toISOString(),
      lastBoost: new Date().toISOString(),
      status: 'active'
    };

    stats.wishes.push(wish);
    await this.save();
    return { success: true, wish: wish, message: '✨ 愿望已创建！投入愿星来扰动世界线吧～' };
  }

  async boostWish(wishId, starCost) {
    const stats = this.getStats();
    if (stats.wishStars < starCost) {
      return { success: false, message: '❌ 愿星不足！' };
    }

    const wish = stats.wishes.find(w => w.id === wishId);
    if (!wish) return { success: false, message: '❌ 愿望不存在！' };
    if (wish.status !== 'active') return { success: false, message: '❌ 愿望已完成或已失败，无法强化' };

    const hasLuckCharm = this.getActiveBuffs().some(b => b.id === 'luck-charm');
    let boostAmount = starCost * 10;
    if (hasLuckCharm) {
      boostAmount *= 2;
      stats.buffs = stats.buffs.filter(b => b.id !== 'luck-charm');
    }

    stats.wishStars -= starCost;
    wish.progress = Math.min(wish.progress + boostAmount, 100);
    wish.lastBoost = new Date().toISOString();

    if (wish.progress >= 100) {
      const result = await this.completeWish(wishId);
      return { success: true, wish: wish, message: result.message, completed: true, blessings: result.blessings, bonusPoints: result.bonusPoints };
    }

    await this.save();
    return { success: true, wish: wish, message: '🌌 世界线扰动！进度 +' + boostAmount + '%', completed: false };
  }

  async completeWish(wishId) {
    const stats = this.getStats();
    const wishIndex = stats.wishes.findIndex(w => w.id === wishId);

    if (wishIndex === -1) return { success: false, message: '❌ 愿望不存在' };

    const wish = stats.wishes[wishIndex];
    if (wish.progress < 100) return { success: false, message: '❌ 许愿池未填满' };

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

    await this.addBuff('luck-boost', '好运气', '🍀', '世界线已为你偏移，美好的事物正在靠近', 24);
    await this.save();

    const blessings = this.getRandomBlessings();

    return {
      success: true,
      message: '🌟 许愿池已满！世界线成功扰动！',
      bonusPoints: 500,
      blessings: blessings
    };
  }

  getRandomBlessings() {
    const blessings = [
      '愿星光照亮你前行的道路。',
      '世界线已为你偏移，美好的事物正在靠近。',
      '命运的齿轮开始转动，期待奇迹的发生。',
      '你的愿望已被世界听见，静待花开。',
      '愿好运与你相伴，心想事成。'
    ];
    return blessings.sort(() => Math.random() - 0.5).slice(0, 3);
  }

  getLevelTitle(level) {
    if (!this.config?.levels) {
      return this.getFallbackLevelTitle(level);
    }

    for (const levelConfig of this.config.levels) {
      if (level >= levelConfig.minLevel && level <= levelConfig.maxLevel) {
        return {
          title: levelConfig.title,
          ability: levelConfig.ability,
          phase: levelConfig.phase,
          color: levelConfig.color || '#ffffff',
          abilityIcon: levelConfig.abilityIcon || '⚔️',
          phaseIcon: levelConfig.phaseIcon || '👑'
        };
      }
    }

    const lastLevel = this.config.levels[this.config.levels.length - 1];
    return {
      title: lastLevel.title,
      ability: lastLevel.ability,
      phase: lastLevel.phase,
      color: lastLevel.color || '#ffffff',
      abilityIcon: lastLevel.abilityIcon || '⚔️',
      phaseIcon: lastLevel.phaseIcon || '👑'
    };
  }

  getFallbackLevelTitle(level) {
    const levels = [
      { max: 5, title: '星语者', ability: '扭曲现实', phase: '术士', color: '#9966ff' },
      { max: 10, title: '织梦师', ability: '覆写真实', phase: '人神', color: '#00aaff' },
      { max: 15, title: '创造主', ability: '造物创生', phase: '伪神', color: '#00ffaa' },
      { max: 20, title: '掌界者', ability: '掌控世界', phase: '真神', color: '#ffaa00' },
      { max: 25, title: '元星神', ability: '指尖寰宇', phase: '星神', color: '#ff6666' },
    ];
    for (const l of levels) {
      if (level <= l.max) return { ...l, abilityIcon: '⚔️', phaseIcon: '👑' };
    }
    return { title: '无极尊', ability: '无穷界限', phase: '■■■■', color: '#ffd700', abilityIcon: '⚔️', phaseIcon: '👑' };
  }

  getShopItems() {
    if (!this.shopConfig) this.shopConfig = { items: this.getDefaultShopItems() };
    if (!this.shopConfig.items) this.shopConfig.items = this.getDefaultShopItems();
    return this.shopConfig.items;
  }

  getDefaultShopItems() {
    return [
      {
        id: "wish-star-boost",
        name: "愿星充能器",
        description: "立即获得5颗愿星",
        category: "system",
        type: "consumable",
        rarity: "rare",
        price: 1,
        icon: "✨",
        effect: { type: "add_wish_stars", value: 5 },
        editable: false
      },
      {
        id: "level-skip",
        name: "等级跃迁符",
        description: "立即提升1级",
        category: "system",
        type: "consumable",
        rarity: "legendary",
        price: 1,
        icon: "💫",
        effect: { type: "add_level", value: 1 },
        editable: false
      },
      {
        id: "mystery-box",
        name: "神秘福袋",
        description: "随机获得1-10颗愿星",
        category: "system",
        type: "consumable",
        rarity: "rare",
        price: 1,
        icon: "🎁",
        effect: { type: "random_wish_stars", min: 1, max: 10 },
        editable: true
      },
      {
        id: "milk",
        name: "牛奶",
        description: "清除身上所有Buff效果",
        category: "system",
        type: "consumable",
        rarity: "rare",
        price: 1,
        icon: "🥛",
        effect: { type: "clear_all_buffs" },
        editable: false
      }
    ];
  }

  async purchaseItem(itemId) {
    const stats = this.getStats();
    const items = this.getShopItems();
    const item = items.find(i => i.id === itemId);

    if (!item) return { success: false, message: '❌ 商品不存在！' };

    if (item.rarity === 'rare' && stats.rareItemCards < item.price) {
      return { success: false, message: '❌ 稀有道具卡不足！' };
    }
    if (item.rarity === 'legendary' && stats.legendaryItemCards < item.price) {
      return { success: false, message: '❌ 传奇道具卡不足！' };
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

    return { success: true, message: '🎴 购买成功！商品已加入背包' };
  }

  async useItem(instanceId) {
    const stats = this.getStats();
    const itemIndex = stats.inventory.findIndex(i => i.instanceId === instanceId);

    if (itemIndex === -1) return { success: false, message: '❌ 物品不存在！' };

    const item = stats.inventory[itemIndex];

    if (item.category === 'system' || item.category === 'exclusive') {
      const effect = item.effect;
      let effectMessage = '';

      if (effect) {
        switch (effect.type) {
          case 'add_wish_stars':
            stats.wishStars += effect.value || 1;
            effectMessage = `获得 ${effect.value} 颗愿星`;
            break;
          case 'add_level':
            stats.level += effect.value || 1;
            stats.totalPoints = Math.max(stats.totalPoints, stats.level * 5000);
            effectMessage = `等级提升 ${effect.value} 级`;
            break;
          case 'add_points':
            stats.totalPoints += effect.value || 100;
            stats.currentPoints += effect.value || 100;
            effectMessage = `获得 ${effect.value} 积分`;
            break;
          case 'random_wish_stars': {
            const min = effect.min || 1;
            const max = effect.max || 5;
            const amount = Math.floor(Math.random() * (max - min + 1)) + min;
            stats.wishStars += amount;
            effectMessage = `随机获得 ${amount} 颗愿星`;
            break;
          }
          case 'buff': {
            const buffId = 'custom-' + Date.now().toString();
            const duration = effect.duration || effect.buffDuration || 24;
            await this.addBuff(buffId, effect.buffName, effect.buffIcon || item.icon, effect.buffDesc || item.description, duration);
            effectMessage = `获得Buff：${effect.buffName}`;
            break;
          }
          case 'super_diamond': {
            const baseAmount = Math.floor(Math.random() * 5) + 1;
            let totalStars = baseAmount;
            effectMessage = `获得 ${baseAmount} 颗愿星`;

            if (Math.random() < 0.2) {
              totalStars += 5;
              effectMessage += ' + 额外5颗';
            }
            if (Math.random() < 0.01) {
              totalStars += 100;
              effectMessage += ' + 超级爆发100颗！';
            }

            stats.wishStars += totalStars;
            await this.addBuff('super-luck', '超好运', '🌟', '星光闪耀，好运降临！特殊祝福中...', 1);
            effectMessage = `✨ 获得 ${totalStars} 颗愿星 + 超好运Buff！`;
            break;
          }
          case 'clear_all_buffs': {
            stats.buffs = [];
            effectMessage = '已清除所有Buff效果';
            break;
          }
        }
      }

      stats.inventory.splice(itemIndex, 1);
      await this.save();

      return { success: true, message: `✅ 使用成功！${item.name} 已生效${effectMessage ? ' - ' + effectMessage : ''}`, external: false };
    } else if (item.category === 'external') {
      stats.inventory.splice(itemIndex, 1);
      if (!stats.usedExternalItems) stats.usedExternalItems = [];
      stats.usedExternalItems.push({ ...item, usedAt: new Date().toISOString() });
      await this.save();

      return { success: true, message: '✅ 已使用 ' + item.name + '！请记得兑现承诺哦～', external: true, item: item };
    }

    return { success: false, message: '❌ 使用失败' };
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
      return { success: true, message: '✅ 数据导入成功！' };
    } catch (e) {
      return { success: false, message: '❌ 数据导入失败：' + e.message };
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
      name: name,
      description: description || '',
      category: category || 'system',
      type: type || 'consumable',
      price: price || 1,
      rarity: rarity || 'rare',
      icon: icon || '📦',
      effect: effect
    };

    this.shopConfig.items.push(newItem);
    await this.saveShopConfig();
    return { success: true, message: '✅ 商品添加成功！', item: newItem };
  }

  async updateShopItem(itemId, updates) {
    if (!this.shopConfig?.items) {
      return { success: false, message: '❌ 商品配置不存在' };
    }

    const item = this.shopConfig.items.find(i => i.id === itemId);
    if (!item) return { success: false, message: '❌ 商品不存在' };

    const fields = ['name', 'description', 'icon', 'price', 'rarity', 'category', 'effect'];
    for (const field of fields) {
      if (updates[field] !== undefined) item[field] = updates[field];
    }

    await this.saveShopConfig();
    return { success: true, message: '✅ 商品更新成功！' };
  }

  async deleteShopItem(itemId) {
    if (!this.shopConfig?.items) {
      return { success: false, message: '❌ 商品配置不存在' };
    }

    const itemIndex = this.shopConfig.items.findIndex(i => i.id === itemId);
    if (itemIndex === -1) return { success: false, message: '❌ 商品不存在' };

    this.shopConfig.items.splice(itemIndex, 1);
    await this.saveShopConfig();
    return { success: true, message: '✅ 商品已删除！' };
  }

  async updateLevelConfig(index, updates) {
    if (!this.config?.levels) return { success: false, message: '❌ 等级配置不存在' };
    if (!this.config.levels[index]) return { success: false, message: '❌ 等级不存在' };

    const level = this.config.levels[index];
    const fields = ['title', 'ability', 'abilityIcon', 'phase', 'phaseIcon', 'color', 'minLevel', 'maxLevel'];
    for (const field of fields) {
      if (updates[field] !== undefined) level[field] = updates[field];
    }

    await this.saveConfig();
    return { success: true, message: '✅ 等级更新成功！' };
  }

  async addLevelConfig(levelData) {
    if (!this.config) this.config = this.getDefaultConfig();
    if (!this.config.levels) this.config.levels = [];

    const newLevel = {
      minLevel: levelData.minLevel || 0,
      maxLevel: levelData.maxLevel || 999,
      title: levelData.title || '新等级',
      ability: levelData.ability || '无',
      abilityIcon: levelData.abilityIcon || '⚔️',
      phase: levelData.phase || '凡人',
      phaseIcon: levelData.phaseIcon || '👑',
      color: levelData.color || '#ffffff'
    };

    this.config.levels.push(newLevel);
    this.config.levels.sort((a, b) => a.minLevel - b.minLevel);
    await this.saveConfig();
    return { success: true, message: '✅ 等级添加成功！' };
  }

  async deleteLevelConfig(index) {
    if (!this.config?.levels) return { success: false, message: '❌ 等级配置不存在' };
    if (!this.config.levels[index]) return { success: false, message: '❌ 等级不存在' };

    this.config.levels.splice(index, 1);
    await this.saveConfig();
    return { success: true, message: '✅ 等级已删除！' };
  }

  async addCurrency(name, icon, description, earnRate, color) {
    if (!this.config) this.config = this.getDefaultConfig();
    if (!this.config.customCurrencies) this.config.customCurrencies = [];

    const id = 'custom-' + name.toLowerCase().replace(/\s+/g, '-');
    const newCurrency = {
      id: id,
      name: name,
      icon: icon || '💎',
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
    return { success: true, message: '✅ 货币添加成功！', currency: newCurrency };
  }

  async updateCurrency(currencyId, updates) {
    if (!this.config) return { success: false, message: '❌ 配置不存在' };

    let currency = this.config.customCurrencies?.find(c => c.id === currencyId);
    if (!currency) currency = this.config.currencies?.find(c => c.id === currencyId);
    if (!currency) return { success: false, message: '❌ 货币不存在' };

    if (!currency.editable) return { success: false, message: '❌ 系统货币不可编辑' };

    const fields = ['name', 'icon', 'description', 'earnRate', 'color'];
    for (const field of fields) {
      if (updates[field] !== undefined) currency[field] = updates[field];
    }

    await this.saveConfig();
    return { success: true, message: '✅ 货币更新成功！' };
  }

  async deleteCurrency(currencyId) {
    if (!this.config?.customCurrencies) return { success: false, message: '❌ 自定义货币不存在' };

    const index = this.config.customCurrencies.findIndex(c => c.id === currencyId);
    if (index === -1) return { success: false, message: '❌ 货币不存在' };

    this.config.customCurrencies.splice(index, 1);
    await this.saveConfig();
    return { success: true, message: '✅ 货币已删除！' };
  }
}

module.exports = DataStore;
