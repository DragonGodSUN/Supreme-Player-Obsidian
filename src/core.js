const { Notice } = require("obsidian");

const Core = {
  getDailyNotePath(app) {
    let folder = 'Notes/DailyNotes';
    let format = 'YYYY-MM-DD';

    const dailyNotesPlugin = app.internalPlugins?.plugins?.['daily-notes'];
    if (dailyNotesPlugin?.enabled && dailyNotesPlugin?.instance?.options) {
      folder = dailyNotesPlugin.instance.options.folder || folder;
      format = dailyNotesPlugin.instance.options.format || format;
    }

    if (!format) format = 'YYYY-MM-DD';

    const moment = window.moment;
    const dateStr = moment().format(format);
    const path = `${folder}/${dateStr}.md`;
    console.log('[Core] Daily note path:', path);
    return path;
  },

  async processTodayNote(plugin, forceReprocess = false) {
    const dailyNotePath = this.getDailyNotePath(plugin.app);

    try {
      const file = await plugin.app.vault.getAbstractFileByPath(dailyNotePath);
      if (!file) {
        new Notice('❌ 今日笔记不存在，请先创建日记');
        return;
      }

      const content = await plugin.app.vault.read(file);
      const today = new Date().toISOString().split('T')[0];
      const record = plugin.parser.parseDailyNote(content, today);

      if (!forceReprocess && content.includes('📊 今日积分：')) {
        new Notice('📋 今日笔记已处理，无需重复打卡');
        return;
      }

      const points = plugin.parser.calculatePoints(record);
      const result = await plugin.dataStore.addPoints(points);
      await this.updateDailyNote(plugin, dailyNotePath, content, points);
      this.updateStatusBar(plugin);

      let message = '✅ 打卡完成！+' + points + '积分';
      if (result.levelUp) message += ' 🎉 等级提升到 Lv.' + result.newLevel + '！';
      for (const r of result.rewards) message += ' ' + r;
      new Notice(message);
    } catch (e) {
      console.error('Error processing daily note:', e);
      new Notice('❌ 处理失败: ' + e.message);
    }
  },

  async syncAccountInfo(plugin) {
    try {
      const file = plugin.app.workspace.getActiveFile();
      
      if (!file) {
        new Notice('❌ 请先打开一个文件');
        return;
      }

      if (!file.path.endsWith('.md')) {
        new Notice('❌ 当前文件不是 Markdown 文件');
        return;
      }

      let content = await plugin.app.vault.read(file);
      const stats = plugin.dataStore.getStats();
      const activeWishes = (stats.wishes || []).filter(w => w.status === 'active');
      const today = new Date().toISOString().split('T')[0];

      const hasSyncSection = content.includes('📊 今日积分：');

      if (hasSyncSection) {
        let lines = content.split('\n');
        let modified = false;

        for (let i = 0; i < lines.length; i++) {
          if (lines[i].includes('📊 今日积分：')) {
            lines[i] = `📊 今日积分：${stats.todayPoints || 0}`;
            modified = true;
          }
          if (lines[i].includes('💰 当前积分：')) {
            lines[i] = `💰 当前积分：${stats.totalPoints || 0}`;
            modified = true;
          }
          if (lines[i].includes('※愿星')) {
            lines[i] = `※愿星 * ${stats.wishStars || 0}`;
            modified = true;
          }
          if (lines[i].includes('※稀有道具卡')) {
            lines[i] = `※稀有道具卡 * ${stats.rareItemCards || 0}`;
            modified = true;
          }
          if (lines[i].includes('※传奇道具卡')) {
            lines[i] = `※传奇道具卡 * ${stats.legendaryItemCards || 0}`;
            modified = true;
          }
        }

        const wishPoolIndex = lines.findIndex(l => l.includes('⛲**许愿池**'));
        
        if (wishPoolIndex !== -1) {
          const beforeLines = lines.slice(0, wishPoolIndex + 1);
          const afterIndex = lines.findIndex((l, i) => i > wishPoolIndex && l.includes('---'));

          let wishLines = [];
          if (activeWishes.length > 0) {
            for (const wish of activeWishes) {
              const filledBlocks = Math.floor(wish.progress / 10);
              const emptyBlocks = 10 - filledBlocks;
              const bar = '◉'.repeat(filledBlocks) + '◎'.repeat(emptyBlocks);
              const statusIcon = wish.progress >= 100 ? '✨' : '📈';
              wishLines.push(`> ${statusIcon} **${wish.name}** ${bar} ${wish.progress}%`);
            }
          } else {
            wishLines.push('> 暂无进行中的愿望');
          }

          const afterLines = afterIndex !== -1 ? lines.slice(afterIndex) : [];
          lines = [...beforeLines, ...wishLines, ...afterLines];
          modified = true;
        }

        if (modified) {
          content = lines.join('\n');
          await plugin.app.vault.modify(file, content);
          new Notice('✅ 账户信息已同步！');
        } else {
          new Notice('⚠️ 未检测到需要更新的内容');
        }
      } else {
        let wishSection = '';
        if (activeWishes.length > 0) {
          for (const wish of activeWishes) {
            const filledBlocks = Math.floor(wish.progress / 10);
            const emptyBlocks = 10 - filledBlocks;
            const bar = '◉'.repeat(filledBlocks) + '◎'.repeat(emptyBlocks);
            wishSection += `> 📈 **${wish.name}** ${bar} ${wish.progress}%\n`;
          }
        } else {
          wishSection = '> 暂无进行中的愿望\n';
        }

        const levelInfo = plugin.dataStore.getLevelTitle(stats.level);
        const syncSection = `
---

### 📊 账户信息

> 👤 ${stats.playerName || '玩家'} | ⭐ Lv.${stats.level} ${levelInfo.title}

📊 今日积分：${stats.todayPoints || 0}
💰 当前积分：${stats.totalPoints || 0}
⭐ 愿星：${stats.wishStars || 0}
🎴 稀有道具卡：${stats.rareItemCards || 0}
🌠 传奇道具卡：${stats.legendaryItemCards || 0}

⛲ **许愿池**

${wishSection}

---

*同步时间：${today}*
`;

        content += syncSection;
        await plugin.app.vault.modify(file, content);
        new Notice('✅ 账户信息已插入到文件末尾！');
      }
      
      this.updateStatusBar(plugin);
    } catch (e) {
      console.error('[Sync] Error:', e);
      new Notice('❌ 同步失败：' + e.message);
    }
  },

  async updateDailyNote(plugin, path, originalContent, points) {
    const stats = plugin.dataStore.getStats();
    const activeWishes = (stats.wishes || []).filter(w => w.status === 'active');

    let wishPoolSection = '\n**当前愿望：** 暂无进行中的愿望\n';
    if (activeWishes.length > 0) {
      wishPoolSection = '\n**当前愿望：**\n';
      for (const wish of activeWishes) {
        const filledBlocks = Math.floor(wish.progress / 10);
        const emptyBlocks = 10 - filledBlocks;
        const bar = '█'.repeat(filledBlocks) + '░'.repeat(emptyBlocks);
        const statusIcon = wish.progress >= 100 ? '✨' : '📈';
        wishPoolSection += `> ${statusIcon} **${wish.name}** ${bar} ${wish.progress}%\n`;
      }
    }

    let newContent = originalContent.replace('⛲**许愿池**\n\n当前愿望：', '⛲**许愿池**\n' + wishPoolSection);

    const statsSection = '\n📊 今日积分：' + points + '\n\n💰 当前积分：' + stats.totalPoints + '\n※愿星 * ' + stats.wishStars + '\n※稀有道具卡 * ' + stats.rareItemCards + '\n※传奇道具卡 * ' + stats.legendaryItemCards + '\n\n- ' + new Date().toISOString().split('T')[0] + ' - ' + points + '\n';

    const lines = newContent.split('\n');
    let insertIndex = lines.length;
    for (let i = lines.length - 1; i >= 0; i--) {
      if (lines[i].includes('* 2026') || lines[i].includes('* 2025') || lines[i].includes('* 2024')) {
        insertIndex = i;
        break;
      }
    }

    lines.splice(insertIndex, 0, statsSection);
    newContent = lines.join('\n');

    const file = await plugin.app.vault.getAbstractFileByPath(path);
    if (file) await plugin.app.vault.modify(file, newContent);
  },

  updateStatusBar(plugin) {
    if (!plugin.statusBar) return;
    const stats = plugin.dataStore.getStats();
    const levelInfo = plugin.dataStore.getLevelTitle(stats.level);
    const nextLevel = stats.level + 1;
    const pointsToNext = nextLevel * 5000 - stats.totalPoints;
    const activeBuffs = plugin.dataStore.getActiveBuffs();
    const playerName = stats.playerName || '玩家';

    plugin.statusBar.innerHTML = `<span class="sp-level-btn" style="color: ${levelInfo.color}; cursor: pointer;" title="${levelInfo.title} | ${levelInfo.ability} - 点击查看等级系统">⭐ Lv.${stats.level} ${levelInfo.title}</span> | <span class="sp-stats-btn" style="cursor: pointer;" title="点击查看状态面板">📊 ${stats.totalPoints}</span> | <span class="sp-stats-btn" style="cursor: pointer;" title="用于许愿和扰动世界线">🌟 ${stats.wishStars}</span>`;

    plugin.statusBar.querySelector('.sp-level-btn').onclick = (e) => {
      e.stopPropagation();
      plugin.showLevelSystem();
    };

    plugin.statusBar.querySelectorAll('.sp-stats-btn').forEach(btn => {
      btn.onclick = () => plugin.showStats();
    });

    this.setupHoverPanel(plugin, stats, levelInfo, pointsToNext, activeBuffs, playerName);
  },

  setupHoverPanel(plugin, stats, levelInfo, pointsToNext, activeBuffs, playerName) {
    let hoverPanel = null;
    let hoverTimeout = null;

    const showHoverPanel = () => {
      if (hoverPanel) return;
      
      hoverPanel = document.createElement('div');
      hoverPanel.className = 'supreme-player-hover-panel';
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
      let currencyHtml = '';
      for (const currency of currencies) {
        const value = stats[currency.id] || 0;
        currencyHtml += `<div style="display: flex; justify-content: space-between; padding: 4px 0; border-bottom: 1px solid var(--background-modifier-border);">
          <span>${currency.icon} ${currency.name}</span>
          <span style="font-weight: bold; color: ${currency.color};">${value}</span>
        </div>`;
      }

      let buffHtml = '';
      if (activeBuffs.length > 0) {
        buffHtml = '<div style="margin-top: 10px; font-weight: bold;">🔮 当前 Buff</div>';
        for (const buff of activeBuffs) {
          buffHtml += `<div style="padding: 4px 0; font-size: 12px;">
            <span>${buff.icon} ${buff.name}</span>
            <span style="color: #888; margin-left: 5px;">${buff.description}</span>
          </div>`;
        }
      }

      hoverPanel.innerHTML = `
        <div style="font-weight: bold; font-size: 15px; margin-bottom: 10px; color: ${levelInfo.color};">
          👤 ${playerName} | ⭐ Lv.${stats.level} ${levelInfo.title}
        </div>
        <div style="color: #888; font-size: 12px; margin-bottom: 10px;">
          ${levelInfo.ability} | ${levelInfo.phase}
        </div>
        <div style="margin-bottom: 10px;">
          <div style="display: flex; justify-content: space-between; padding: 4px 0;">
            <span>📊 积分</span>
            <span style="font-weight: bold;">${stats.totalPoints}</span>
          </div>
          <div style="display: flex; justify-content: space-between; padding: 4px 0;">
            <span>📈 距下一级</span>
            <span style="font-weight: bold;">${pointsToNext}</span>
          </div>
        </div>
        <div style="font-weight: bold; margin-top: 10px;">💰 货币</div>
        ${currencyHtml}
        ${buffHtml}
        <div style="margin-top: 15px; display: flex; gap: 8px;">
          <button class="sp-hover-btn" style="flex: 1; padding: 6px; border-radius: 4px; cursor: pointer;">⛲ 许愿</button>
          <button class="sp-hover-btn" style="flex: 1; padding: 6px; border-radius: 4px; cursor: pointer;">🎴 商城</button>
          <button class="sp-hover-btn" style="flex: 1; padding: 6px; border-radius: 4px; cursor: pointer;">📦 背包</button>
        </div>
      `;

      document.body.appendChild(hoverPanel);

      hoverPanel.querySelector('.sp-hover-btn:nth-child(1)').onclick = (e) => {
        e.stopPropagation();
        hideHoverPanel();
        plugin.showWishPool();
      };
      hoverPanel.querySelector('.sp-hover-btn:nth-child(2)').onclick = (e) => {
        e.stopPropagation();
        hideHoverPanel();
        plugin.showShop();
      };
      hoverPanel.querySelector('.sp-hover-btn:nth-child(3)').onclick = (e) => {
        e.stopPropagation();
        hideHoverPanel();
        plugin.showInventory();
      };

      hoverPanel.onmouseenter = () => {
        if (hoverTimeout) clearTimeout(hoverTimeout);
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
      if (hoverTimeout) clearTimeout(hoverTimeout);
      hoverTimeout = setTimeout(showHoverPanel, 500);
    };

    plugin.statusBar.onmouseleave = () => {
      hoverTimeout = setTimeout(hideHoverPanel, 300);
    };
  }
};

module.exports = Core;
