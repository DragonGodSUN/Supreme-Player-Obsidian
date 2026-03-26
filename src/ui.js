const { Modal, Notice } = require("obsidian");
const Core = require('./core');

const UI = {
  showLevelSystem(plugin) {
    const stats = plugin.dataStore.getStats();
    const levels = plugin.dataStore.config?.levels || [];
    const currentLevelInfo = plugin.dataStore.getLevelTitle(stats.level);

    const modal = new Modal(plugin.app);
    modal.titleEl.setText('⭐ 等级与称号系统');

    const content = document.createElement('div');
    content.style.padding = '20px';
    content.style.maxWidth = '500px';

    const currentDiv = document.createElement('div');
    currentDiv.style.cssText = 'background: var(--background-secondary); padding: 15px; border-radius: 8px; margin-bottom: 20px; text-align: center;';
    currentDiv.innerHTML = `
      <div style="font-size: 14px; color: #888; margin-bottom: 5px;">当前等级</div>
      <div style="font-size: 28px; font-weight: bold; color: ${currentLevelInfo.color};">Lv.${stats.level} ${currentLevelInfo.title}</div>
      <div style="font-size: 14px; color: #888; margin-top: 5px;">${currentLevelInfo.abilityIcon || '⚔️'} ${currentLevelInfo.ability} | ${currentLevelInfo.phaseIcon || '👑'} ${currentLevelInfo.phase}</div>
      <div style="margin-top: 10px; font-size: 12px; color: #888;">总积分: ${stats.totalPoints}</div>
    `;
    content.appendChild(currentDiv);

    const levelListTitle = document.createElement('div');
    levelListTitle.style.cssText = 'font-weight: bold; margin-bottom: 10px;';
    levelListTitle.textContent = '📋 等级阶段';
    content.appendChild(levelListTitle);

    const levelList = document.createElement('div');
    levelList.style.cssText = 'max-height: 350px; overflow-y: auto;';

    for (const level of levels) {
      const isCurrentLevel = stats.level >= level.minLevel && stats.level <= level.maxLevel;
      const minPoints = level.minLevel * 5000;
      const maxPoints = level.maxLevel * 5000;
      const abilityIcon = level.abilityIcon || '⚔️';
      const phaseIcon = level.phaseIcon || '👑';

      const levelDiv = document.createElement('div');
      levelDiv.style.cssText = `
        padding: 12px;
        margin-bottom: 8px;
        border: 1px solid ${isCurrentLevel ? level.color : 'var(--border-color)'};
        border-radius: 6px;
        background: ${isCurrentLevel ? level.color + '15' : 'transparent'};
      `;

      levelDiv.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div>
            <span style="font-weight: bold; color: ${level.color};">${level.title}</span>
            <span style="color: #888; font-size: 12px; margin-left: 8px;">Lv.${level.minLevel}-${level.maxLevel}</span>
            ${isCurrentLevel ? '<span style="background: ' + level.color + '; color: white; padding: 2px 6px; border-radius: 3px; font-size: 10px; margin-left: 8px;">当前</span>' : ''}
          </div>
          <div style="font-size: 12px; color: #888;">${minPoints.toLocaleString()} - ${maxPoints.toLocaleString()} 积分</div>
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

    const closeBtn = document.createElement('button');
    closeBtn.textContent = '关闭';
    closeBtn.style.cssText = 'width: 100%; margin-top: 15px;';
    closeBtn.onclick = () => modal.close();
    content.appendChild(closeBtn);

    modal.contentEl.appendChild(content);
    modal.open();
  },

  showStats(plugin) {
    const stats = plugin.dataStore.getStats();
    const levelInfo = plugin.dataStore.getLevelTitle(stats.level);
    const activeBuffs = plugin.dataStore.getActiveBuffs();
    const playerName = stats.playerName || '玩家';

    const modal = new Modal(plugin.app);
    modal.titleEl.setText(`🌟 ${playerName} 的玩家面板`);

    const content = document.createElement('div');
    content.style.padding = '20px';

    const topGrid = document.createElement('div');
    topGrid.style.display = 'grid';
    topGrid.style.gridTemplateColumns = '1fr 1fr';
    topGrid.style.gap = '20px';

    topGrid.innerHTML = `
      <div style="background: var(--background-secondary); padding: 15px; border-radius: 8px;"><div style="color: #888; font-size: 12px;">⚡ 积分</div><div style="font-size: 24px; font-weight: bold;">${stats.totalPoints}</div></div>
      <div style="background: var(--background-secondary); padding: 15px; border-radius: 8px;"><div style="color: #888; font-size: 12px;">📊 等级</div><div style="font-size: 24px; font-weight: bold; color: ${levelInfo.color};">Lv.${stats.level} ${levelInfo.title}</div></div>
      <div style="background: var(--background-secondary); padding: 15px; border-radius: 8px;"><div style="color: #888; font-size: 12px;">⭐ 愿星</div><div style="font-size: 24px; font-weight: bold;">${stats.wishStars}</div></div>
      <div style="background: var(--background-secondary); padding: 15px; border-radius: 8px;"><div style="color: #888; font-size: 12px;">📦 背包物品</div><div style="font-size: 24px; font-weight: bold;">${stats.inventory.length}</div></div>
    `;

    content.appendChild(topGrid);

    const bottomGrid = document.createElement('div');
    bottomGrid.style.marginTop = '20px';
    bottomGrid.style.display = 'grid';
    bottomGrid.style.gridTemplateColumns = '1fr 1fr 1fr';
    bottomGrid.style.gap = '10px';

    bottomGrid.innerHTML = `
      <div style="background: #9966ff20; padding: 10px; border-radius: 5px; text-align: center;"><div style="font-size: 20px;">🎴</div><div>稀有道具卡</div><div style="font-weight: bold;">${stats.rareItemCards}</div></div>
      <div style="background: #ffd70020; padding: 10px; border-radius: 5px; text-align: center;"><div style="font-size: 20px;">🌠</div><div>传奇道具卡</div><div style="font-weight: bold;">${stats.legendaryItemCards}</div></div>
      <div style="background: #00ff0020; padding: 10px; border-radius: 5px; text-align: center;"><div style="font-size: 20px;">📈</div><div>距下一级</div><div style="font-weight: bold;">${5000 - (stats.totalPoints % 5000)}</div></div>
    `;

    content.appendChild(bottomGrid);

    if (activeBuffs.length > 0) {
      const buffSection = document.createElement('div');
      buffSection.style.marginTop = '20px';
      buffSection.innerHTML = '<div style="font-weight: bold; margin-bottom: 10px;">🔮 当前 Buff</div>';
      content.appendChild(buffSection);

      const buffList = document.createElement('div');
      buffList.style.display = 'flex';
      buffList.style.gap = '10px';
      buffList.style.flexWrap = 'wrap';

      for (const buff of activeBuffs) {
        const buffDiv = document.createElement('div');
        buffDiv.style.cssText = 'padding: 8px 12px; background: var(--background-secondary); border-radius: 5px; cursor: help;';
        buffDiv.innerHTML = `<span style="font-size: 16px;">${buff.icon}</span>`;
        buffDiv.title = `${buff.name}: ${buff.description}`;
        buffList.appendChild(buffDiv);
      }
      content.appendChild(buffList);
    }

    const buttonSection = document.createElement('div');
    buttonSection.style.marginTop = '20px';
    buttonSection.style.display = 'grid';
    buttonSection.style.gridTemplateColumns = '1fr 1fr';
    buttonSection.style.gap = '10px';

    const checkInBtn = document.createElement('button');
    checkInBtn.textContent = '📅 每日打卡';
    checkInBtn.className = 'mod-cta';
    checkInBtn.style.gridColumn = '1 / -1';
    checkInBtn.onclick = () => { modal.close(); this.showCheckInPanel(plugin); };
    buttonSection.appendChild(checkInBtn);

    const wishBtn = document.createElement('button');
    wishBtn.textContent = '⛲ 前往许愿';
    wishBtn.style.flex = '1';
    wishBtn.onclick = () => { modal.close(); plugin.showWishPool(); };
    buttonSection.appendChild(wishBtn);

    const shopBtn = document.createElement('button');
    shopBtn.textContent = '🎴 前往商城';
    shopBtn.style.flex = '1';
    shopBtn.onclick = () => { modal.close(); plugin.showShop(); };
    buttonSection.appendChild(shopBtn);

    const inventoryBtn = document.createElement('button');
    inventoryBtn.textContent = '🎒 打开背包';
    inventoryBtn.style.gridColumn = '1 / -1';
    inventoryBtn.onclick = () => { modal.close(); plugin.showInventory(); };
    buttonSection.appendChild(inventoryBtn);

    content.appendChild(buttonSection);

    const closeBtn = document.createElement('button');
    closeBtn.textContent = '关闭';
    closeBtn.style.width = '100%';
    closeBtn.style.marginTop = '10px';
    closeBtn.onclick = () => modal.close();
    content.appendChild(closeBtn);

    modal.contentEl.appendChild(content);
    modal.open();
  },

  async showCheckInPanel(plugin) {
    const config = plugin.dataStore.config || plugin.dataStore.getDefaultConfig();
    const stats = plugin.dataStore.getStats();
    const today = new Date().toISOString().split('T')[0];
    const alreadyCheckedIn = stats.lastCheckInDate === today;

    const dailyTasks = config.dailyTasks || {
      mainTasks: { count: 3, pointsPerTask: 100 },
      habits: { items: [] },
      extraTasks: { count: 2, pointsPerTask: 50 },
      pomodoro: { count: 6, pointsPerPomodoro: 50 }
    };

    const mainTasks = dailyTasks.mainTasks || { count: 3, pointsPerTask: 100 };
    const habits = dailyTasks.habits?.items || [];
    const habitsPoints = habits.reduce((sum, h) => sum + (h.points || 0), 0);

    const maxBasePoints = mainTasks.count * mainTasks.pointsPerTask + habitsPoints;

    const modal = new Modal(plugin.app);
    modal.titleEl.setText('📅 每日打卡');

    const content = document.createElement('div');
    content.style.padding = '20px';

    if (alreadyCheckedIn) {
      content.innerHTML = `
        <div style="text-align: center; margin-bottom: 20px;">
          <div style="font-size: 64px; margin-bottom: 15px;">✅</div>
          <div style="font-size: 18px; font-weight: bold; margin-bottom: 10px; color: #00aaff;">今日已完成打卡</div>
          <div style="color: #888; font-size: 13px;">明天再来吧！</div>
        </div>
      `;

      const closeBtn = document.createElement('button');
      closeBtn.textContent = '关闭';
      closeBtn.style.width = '100%';
      closeBtn.onclick = () => modal.close();
      content.appendChild(closeBtn);

      modal.contentEl.appendChild(content);
      modal.open();
      return;
    }

    const dailyNotePath = Core.getDailyNotePath(plugin.app);
    let currentPoints = 0;
    let record = null;

    try {
      const file = await plugin.app.vault.getAbstractFileByPath(dailyNotePath);
      if (file) {
        const noteContent = await plugin.app.vault.read(file);
        const recordDate = new Date().toISOString().split('T')[0];
        record = plugin.parser.parseDailyNote(noteContent, recordDate);
        currentPoints = plugin.parser.calculatePoints(record);
      }
    } catch (e) {
      console.log('No daily note found');
    }

    const progressPercent = Math.min(100, Math.round((currentPoints / maxBasePoints) * 100));
    const isPerfect = currentPoints >= maxBasePoints;

    content.innerHTML = `
      <div style="text-align: center; margin-bottom: 20px;">
        <div style="font-size: 14px; color: #888; margin-bottom: 10px;">今日获得积分</div>
        <div style="font-size: 36px; font-weight: bold; color: ${isPerfect ? '#ffd700' : '#00aaff'};">${currentPoints}</div>
        <div style="font-size: 12px; color: #888;">/ ${maxBasePoints} 基础积分</div>
      </div>

      <div style="margin-bottom: 20px;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
          <span style="font-size: 12px; color: #888;">完成进度</span>
          <span style="font-size: 12px; color: ${isPerfect ? '#ffd700' : '#00aaff'};">${progressPercent}%</span>
        </div>
        <div style="background: var(--background-secondary); height: 20px; border-radius: 10px; overflow: hidden;">
          <div style="background: ${isPerfect ? 'linear-gradient(90deg, #ffd700, #ffaa00)' : 'linear-gradient(90deg, #00aaff, #0066ff)'}; height: 100%; width: ${Math.min(100, progressPercent)}%; transition: width 0.3s; display: flex; align-items: center; justify-content: center;">
            ${progressPercent >= 30 ? `<span style="color: white; font-size: 11px; font-weight: bold;">${progressPercent}%</span>` : ''}
          </div>
        </div>
        ${progressPercent > 100 ? `<div style="text-align: center; margin-top: 5px; font-size: 12px; color: #ffd700;">✨ 超额完成！实际进度 ${progressPercent}%</div>` : ''}
      </div>

      <div style="background: var(--background-secondary); padding: 15px; border-radius: 8px; margin-bottom: 20px;">
        <div style="font-weight: bold; margin-bottom: 10px;">📊 任务完成情况</div>
        <div style="font-size: 13px; color: #888;">
          <div>● 每日三件事：${record ? record.mainTasks.filter(t => t.completed).length : 0}/${mainTasks.count}</div>
          <div>● 习惯打卡：${record ? record.habits.filter(h => h.completed).length : 0}/${habits.length}</div>
        </div>
      </div>

      <div style="text-align: center; color: #888; font-size: 12px; margin-bottom: 15px;">
        ${isPerfect ? '🌟 完美打卡！今日任务全部完成！' : '💪 继续努力，完成所有基础任务即可完美打卡！'}
      </div>
    `;

    const checkInBtn = document.createElement('button');
    checkInBtn.textContent = isPerfect ? '🌟 完美打卡' : '✅ 确认打卡';
    checkInBtn.className = 'mod-cta';
    checkInBtn.style.width = '100%';
    checkInBtn.style.marginBottom = '10px';

    checkInBtn.onclick = async () => {
      modal.close();
      if (isPerfect) {
        await this.showPerfectCheckIn(plugin, currentPoints);
      } else {
        await this.showCheckInConfirm(plugin, currentPoints, maxBasePoints);
      }
    };
    content.appendChild(checkInBtn);

    const buttonContainer = document.createElement('div');
    buttonContainer.style.display = 'flex';
    buttonContainer.style.gap = '10px';

    const backBtn = document.createElement('button');
    backBtn.textContent = '🏠 返回面板';
    backBtn.style.flex = '1';
    backBtn.onclick = () => { modal.close(); plugin.showStats(); };

    const closeBtn = document.createElement('button');
    closeBtn.textContent = '关闭';
    closeBtn.style.flex = '1';
    closeBtn.onclick = () => modal.close();

    buttonContainer.appendChild(backBtn);
    buttonContainer.appendChild(closeBtn);
    content.appendChild(buttonContainer);

    modal.contentEl.appendChild(content);
    modal.open();
  },

  async showCheckInConfirm(plugin, currentPoints, maxBasePoints) {
    const modal = new Modal(plugin.app);
    modal.titleEl.setText('⚠️ 确认打卡');

    const content = document.createElement('div');
    content.style.padding = '20px';
    content.style.textAlign = 'center';

    content.innerHTML = `
      <div style="font-size: 48px; margin-bottom: 15px;">📝</div>
      <div style="font-size: 18px; font-weight: bold; margin-bottom: 10px;">确认今日打卡？</div>
      <div style="color: #888; margin-bottom: 15px;">
        今日获得积分：<strong style="color: #00aaff;">${currentPoints}</strong><br>
        距离完美打卡还需：<strong style="color: #ffd700;">${maxBasePoints - currentPoints}</strong> 积分
      </div>
      <div style="background: #ffaa0020; padding: 10px; border-radius: 5px; margin-bottom: 15px; color: #ffaa00; font-size: 13px;">
        💡 完成所有基础任务可获得完美打卡奖励！
      </div>
    `;

    const buttonContainer = document.createElement('div');
    buttonContainer.style.display = 'flex';
    buttonContainer.style.gap = '10px';

    const confirmBtn = document.createElement('button');
    confirmBtn.textContent = '✅ 确认打卡';
    confirmBtn.className = 'mod-cta';
    confirmBtn.style.flex = '1';
    confirmBtn.onclick = async () => {
      modal.close();
      const result = await plugin.dataStore.addPoints(currentPoints);
      
      const stats = plugin.dataStore.getStats();
      stats.lastCheckInDate = new Date().toISOString().split('T')[0];
      await plugin.dataStore.save();
      
      let message = '✅ 打卡完成！+' + currentPoints + '积分';
      if (result.levelUp) message += ' 🎉 等级提升到 Lv.' + result.newLevel + '！';
      for (const r of result.rewards) message += ' ' + r;
      new Notice(message);
      
      plugin.updateStatusBar();
    };

    const cancelBtn = document.createElement('button');
    cancelBtn.textContent = '继续努力';
    cancelBtn.style.flex = '1';
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
      rewardType: 'exclusive',
      exclusiveItem: {
        name: '超级大钻石',
        icon: '💎',
        description: '完美打卡奖励',
        rarity: 'legendary'
      },
      blessingTitle: '太棒了！今日任务全部完成！',
      blessingMessage: '每一次完美打卡，都是对自己最好的投资！'
    };

    const modal = new Modal(plugin.app);
    modal.titleEl.setText('🌟 完美打卡！');

    const content = document.createElement('div');
    content.style.padding = '20px';
    content.style.textAlign = 'center';

    let rewardInfo = '';
    let rewardItem = null;

    if (perfectReward.enabled) {
      if (perfectReward.rewardType === 'shop' && perfectReward.shopItemId) {
        const shopItems = plugin.dataStore.getShopItems() || [];
        rewardItem = shopItems.find(i => i.id === perfectReward.shopItemId);
        if (rewardItem) {
          rewardInfo = `${rewardItem.icon} ${rewardItem.name}已添加到背包！`;
        }
      } else if (perfectReward.rewardType === 'exclusive' && perfectReward.exclusiveItem) {
        const ex = perfectReward.exclusiveItem;
        rewardItem = {
          id: 'exclusive-' + Date.now(),
          instanceId: 'exclusive-instance-' + Date.now(),
          name: ex.name,
          description: ex.description,
          icon: ex.icon,
          category: 'exclusive',
          rarity: ex.rarity || 'rare',
          effect: ex.effect,
          obtainedAt: new Date().toISOString()
        };
        rewardInfo = `${ex.icon} ${ex.name}已添加到背包！`;
      }
    }

    content.innerHTML = `
      <div style="font-size: 64px; margin-bottom: 20px;">🎉</div>
      <div style="font-size: 20px; font-weight: bold; margin-bottom: 15px; color: #ffd700;">${perfectReward.blessingTitle || '太棒了！今日任务全部完成！'}</div>
      <div style="background: var(--background-secondary); padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <div style="color: #00aaff; font-size: 16px; margin-bottom: 10px;">📊 今日积分：+${points}</div>
        ${rewardInfo ? `<div style="color: #ffd700; font-size: 14px;">${rewardInfo}</div>` : ''}
      </div>
      <div style="color: #888; font-size: 12px; margin-bottom: 15px;">
        ✨ ${perfectReward.blessingMessage || '每一次完美打卡，都是对自己最好的投资！'}
      </div>
    `;

    if (perfectReward.enabled && rewardItem) {
      const stats = plugin.dataStore.getStats();
      if (!stats.inventory) stats.inventory = [];
      stats.inventory.push(rewardItem);
    }

    const addResult = await plugin.dataStore.addPoints(points);
    
    const statsForDate = plugin.dataStore.getStats();
    statsForDate.lastCheckInDate = new Date().toISOString().split('T')[0];
    await plugin.dataStore.save();

    plugin.updateStatusBar();

    let message = '✅ 完美打卡！+' + points + '积分';
    if (addResult.levelUp) message += ' 🎉 等级提升到 Lv.' + addResult.newLevel + '！';
    for (const r of addResult.rewards) message += ' ' + r;
    new Notice(message);

    const closeBtn = document.createElement('button');
    closeBtn.textContent = '🙏 感谢祝福';
    closeBtn.className = 'mod-cta';
    closeBtn.style.width = '100%';
    closeBtn.onclick = () => modal.close();
    content.appendChild(closeBtn);

    modal.contentEl.appendChild(content);
    modal.open();
  }
};

module.exports = UI;
