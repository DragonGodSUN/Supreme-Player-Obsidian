const { Notice } = require("obsidian");

function translate(plugin, key, variables) {
  return plugin.t ? plugin.t(key, variables) : key;
}

function getLocalDateString(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function buildWishLines(plugin, activeWishes) {
  if (!activeWishes.length) {
    return ["> " + translate(plugin, "core.noActiveWishes")];
  }

  return activeWishes.map(wish => {
    const filledBlocks = Math.floor(wish.progress / 10);
    const emptyBlocks = 10 - filledBlocks;
    const bar = "■".repeat(filledBlocks) + "□".repeat(emptyBlocks);
    const statusIcon = wish.progress >= 100 ? "✅" : "🌟";
    return `> ${statusIcon} **${wish.name}** ${bar} ${wish.progress}%`;
  });
}

function buildAccountSection(plugin) {
  const stats = plugin.dataStore.getStats();
  const activeWishes = (stats.wishes || []).filter(wish => wish.status === "active");
  const levelInfo = plugin.dataStore.getLevelTitle(stats.level);
  const today = getLocalDateString();
  const wishLines = buildWishLines(plugin, activeWishes);

  return [
    "<!-- supreme-player:start -->",
    `### ${translate(plugin, "core.accountTitle")}`,
    `> **${stats.playerName || translate(plugin, "settings.defaultPlayerName")}** | Lv.${stats.level} ${levelInfo.title}`,
    `> ${levelInfo.abilityIcon || "✨"} ${levelInfo.ability} | ${levelInfo.phaseIcon || "🌟"} ${levelInfo.phase}`,
    ">",
    `> 📊 **${translate(plugin, "core.todayPointsLabel")}**: ${stats.todayPoints || 0}`,
    `> ⚡ **${translate(plugin, "core.currentPointsLabel")}**: ${stats.totalPoints || 0}`,
    `> ⭐ **${translate(plugin, "core.wishStarsLabel")}**: ${stats.wishStars || 0}`,
    `> 🎴 **${translate(plugin, "core.rareCardsLabel")}**: ${stats.rareItemCards || 0}`,
    `> 🌠 **${translate(plugin, "core.legendaryCardsLabel")}**: ${stats.legendaryItemCards || 0}`,
    ">",
    `> ⛲ **${translate(plugin, "core.wishPoolLabel")}**`,
    ...wishLines,
    ">",
    `> *${translate(plugin, "core.syncedAtLabel")}: ${today}*`,
    "<!-- supreme-player:end -->",
  ].join("\n");
}

function buildStatusHover(plugin) {
  const stats = plugin.dataStore.getStats();
  const levelInfo = plugin.dataStore.getLevelTitle(stats.level);
  const playerName = stats.playerName || translate(plugin, "settings.defaultPlayerName");
  const activeBuffs = plugin.dataStore.getActiveBuffs ? plugin.dataStore.getActiveBuffs() : [];
  const nextLevel = stats.level + 1;
  const pointsToNext = nextLevel * 5000 - stats.totalPoints;
  const currencies = plugin.dataStore.getCurrencies ? plugin.dataStore.getCurrencies() : [];
  const currencyHtml = currencies.map(currency => {
    const value = stats[currency.id] || 0;
    return `
      <div style="display: flex; justify-content: space-between; padding: 4px 0; border-bottom: 1px solid var(--background-modifier-border);">
        <span>${currency.icon} ${currency.name}</span>
        <span style="font-weight: 700; color: ${currency.color};">${value}</span>
      </div>
    `;
  }).join("");
  const buffIcons = activeBuffs.length
    ? Array.from(new Set(activeBuffs.map(buff => buff.icon || "✨"))).join(" ")
    : translate(plugin, "core.status.none");

  return `
    <div style="font-weight: 700; font-size: 16px; margin-bottom: 10px; color: ${levelInfo.color};">
      👤 ${playerName} | ⭐ Lv.${stats.level} ${levelInfo.title}
    </div>
    <div style="color: var(--text-muted); font-size: 13px; margin-bottom: 10px;">
      ${levelInfo.abilityIcon || "✨"} ${levelInfo.ability} | ${levelInfo.phaseIcon || "🌟"} ${levelInfo.phase}
    </div>
    <div style="margin-bottom: 10px; font-size: 13px;">
      <div style="display: flex; justify-content: space-between; padding: 4px 0;">
        <span>📊 ${translate(plugin, "core.status.totalPoints")}</span>
        <span style="font-weight: 700;">${stats.totalPoints || 0}</span>
      </div>
      <div style="display: flex; justify-content: space-between; padding: 4px 0;">
        <span>📈 ${translate(plugin, "ui.stat.nextLevel")}</span>
        <span style="font-weight: 700;">${pointsToNext}</span>
      </div>
    </div>
    <div style="font-weight: 700; margin-top: 10px;">🪙 ${translate(plugin, "settings.currencies")}</div>
    <div style="font-size: 13px;">
      ${currencyHtml}
    </div>
    <div style="margin-top: 10px; font-weight: 700;">✨ ${translate(plugin, "core.status.activeBuffs")}</div>
    <div style="padding: 4px 0; font-size: 13px;">${buffIcons}</div>
    <div style="margin-top: 14px; display: flex; gap: 8px;">
      <button class="sp-hover-btn sp-hover-wish" style="flex: 1; padding: 6px; border-radius: 4px; cursor: pointer;">✨ ${translate(plugin, "ui.goWishPool")}</button>
      <button class="sp-hover-btn sp-hover-shop" style="flex: 1; padding: 6px; border-radius: 4px; cursor: pointer;">🎴 ${translate(plugin, "ui.goShop")}</button>
      <button class="sp-hover-btn sp-hover-inventory" style="flex: 1; padding: 6px; border-radius: 4px; cursor: pointer;">🎒 ${translate(plugin, "ui.openInventory")}</button>
    </div>
  `;
}

function removeStatusHover(plugin) {
  if (plugin.statusHoverEl) {
    plugin.statusHoverEl.remove();
    plugin.statusHoverEl = null;
  }
}

function showStatusHover(plugin) {
  if (!plugin.statusBar) return;
  removeStatusHover(plugin);

  const hoverEl = document.createElement("div");
  hoverEl.style.cssText = `
    position: fixed;
    z-index: 9999;
    min-width: 252px;
    max-width: 292px;
    padding: 12px;
    border-radius: 8px;
    background: var(--background-primary);
    border: 1px solid var(--background-modifier-border);
    box-shadow: 0 8px 24px rgba(0,0,0,0.25);
    font-size: 14px;
  `;
  hoverEl.innerHTML = buildStatusHover(plugin);

  const rect = plugin.statusBar.getBoundingClientRect();
  hoverEl.style.bottom = `${window.innerHeight - rect.top + 8}px`;

  hoverEl.onmouseenter = () => {
    if (plugin.statusHoverTimer) {
      clearTimeout(plugin.statusHoverTimer);
      plugin.statusHoverTimer = null;
    }
  };
  hoverEl.onmouseleave = () => {
    removeStatusHover(plugin);
  };

  document.body.appendChild(hoverEl);
  const wishBtn = hoverEl.querySelector(".sp-hover-wish");
  const shopBtn = hoverEl.querySelector(".sp-hover-shop");
  const inventoryBtn = hoverEl.querySelector(".sp-hover-inventory");

  if (wishBtn) {
    wishBtn.onclick = event => {
      event.stopPropagation();
      removeStatusHover(plugin);
      plugin.showWishPool();
    };
  }
  if (shopBtn) {
    shopBtn.onclick = event => {
      event.stopPropagation();
      removeStatusHover(plugin);
      plugin.showShop();
    };
  }
  if (inventoryBtn) {
    inventoryBtn.onclick = event => {
      event.stopPropagation();
      removeStatusHover(plugin);
      plugin.showInventory();
    };
  }

  const hoverWidth = hoverEl.offsetWidth || 320;
  const left = Math.min(
    window.innerWidth - hoverWidth - 8,
    Math.max(8, rect.left - 24)
  );
  hoverEl.style.left = `${left}px`;
  plugin.statusHoverEl = hoverEl;
}

function scheduleHideStatusHover(plugin) {
  if (plugin.statusHoverTimer) {
    clearTimeout(plugin.statusHoverTimer);
  }
  plugin.statusHoverTimer = setTimeout(() => {
    removeStatusHover(plugin);
    plugin.statusHoverTimer = null;
  }, 120);
}

const Core = {
  getDailyNotesSettings(app) {
    const dailyNotesPlugin = app.internalPlugins?.plugins?.["daily-notes"];
    if (dailyNotesPlugin?.enabled && dailyNotesPlugin?.instance?.options) {
      return dailyNotesPlugin.instance.options;
    }

    const periodicNotesPlugin = app.plugins?.plugins?.["periodic-notes"];
    if (periodicNotesPlugin?.settings?.daily) {
      return periodicNotesPlugin.settings.daily;
    }

    return null;
  },

  buildDailyNotePath(folder, format) {
    const moment = window.moment;
    const dateStr = moment().format(format || "YYYY-MM-DD");
    const normalizedFolder = (folder || "").trim().replace(/\/+$/g, "");
    const normalizedName = dateStr.endsWith(".md") ? dateStr : `${dateStr}.md`;
    return normalizedFolder ? `${normalizedFolder}/${normalizedName}` : normalizedName;
  },

  getDailyNotePath(app) {
    const settings = this.getDailyNotesSettings(app);
    const folder = settings?.folder || "Notes/DailyNotes";
    const format = settings?.format || "YYYY-MM-DD";
    return this.buildDailyNotePath(folder, format);
  },

  async findTodayNoteFile(app) {
    const settings = this.getDailyNotesSettings(app);
    const folder = settings?.folder || "Notes/DailyNotes";
    const format = settings?.format || "YYYY-MM-DD";
    const candidates = [];

    candidates.push(this.buildDailyNotePath(folder, format));
    candidates.push(this.buildDailyNotePath(folder, "YYYY-MM-DD"));

    const activeFile = app.workspace.getActiveFile?.();
    if (activeFile?.path) {
      const todayKey = window.moment().format(format || "YYYY-MM-DD");
      const activeBaseName = activeFile.basename || activeFile.name?.replace(/\.md$/, "");
      if (activeBaseName === todayKey || activeBaseName === window.moment().format("YYYY-MM-DD")) {
        return activeFile;
      }
    }

    for (const path of [...new Set(candidates)]) {
      const file = app.vault.getAbstractFileByPath(path);
      if (file) {
        return file;
      }
    }

    return null;
  },

  async processTodayNote(plugin, forceReprocess = false) {
    try {
      const file = await this.findTodayNoteFile(plugin.app);
      if (!file) {
        new Notice(translate(plugin, "core.todayNoteMissing"));
        return;
      }

      const content = await plugin.app.vault.read(file);
      const today = getLocalDateString();
      const record = plugin.parser.parseDailyNote(content, today);
      const alreadyProcessed = /今日积分|Today points/.test(content);

      if (!forceReprocess && alreadyProcessed) {
        new Notice(translate(plugin, "core.todayAlreadyProcessed"));
        return;
      }

      const points = plugin.parser.calculatePoints(record);
      const result = await plugin.dataStore.addCheckInPoints(points);
      await this.updateDailyNote(plugin, file.path, content, result.awardedPoints);
      this.updateStatusBar(plugin);

      let message = translate(plugin, "core.checkinComplete", { points: result.awardedPoints });
      if (result.multiplier > 1) {
        message += ` ${translate(plugin, "core.checkinBonusApplied", {
          streak: result.streak,
          percent: result.bonusPercent,
          base: result.basePoints,
          total: result.awardedPoints
        })}`;
      }
      if (result.levelUp) {
        message += ` ${translate(plugin, "core.levelUp", { level: result.newLevel })}`;
      }
      for (const reward of result.rewards) {
        message += ` ${reward}`;
      }
      new Notice(message);
    } catch (error) {
      console.error("Error processing daily note:", error);
      new Notice(translate(plugin, "core.processFailed", { message: error.message }));
    }
  },

  async syncAccountInfo(plugin) {
    try {
      const file = plugin.app.workspace.getActiveFile();

      if (!file) {
        new Notice(translate(plugin, "core.openFileFirst"));
        return;
      }

      if (!file.path.endsWith(".md")) {
        new Notice(translate(plugin, "core.markdownOnly"));
        return;
      }

      const content = await plugin.app.vault.read(file);
      const accountSection = buildAccountSection(plugin);
      const startMarker = "<!-- supreme-player:start -->";
      const endMarker = "<!-- supreme-player:end -->";

      let nextContent;
      if (content.includes(startMarker) && content.includes(endMarker)) {
        nextContent = content.replace(
          /<!-- supreme-player:start -->[\s\S]*?<!-- supreme-player:end -->/m,
          accountSection
        );
      } else {
        nextContent = `${content.trimEnd()}\n\n---\n\n${accountSection}\n`;
      }

      await plugin.app.vault.modify(file, nextContent);
      this.updateStatusBar(plugin);
      new Notice(content === nextContent
        ? translate(plugin, "core.nothingToUpdate")
        : translate(plugin, "core.accountSynced"));
    } catch (error) {
      console.error("[Sync] Error:", error);
      new Notice(translate(plugin, "core.syncFailed", { message: error.message }));
    }
  },

  async updateDailyNote(plugin, path, originalContent, points) {
    const stats = plugin.dataStore.getStats();
    const activeWishes = (stats.wishes || []).filter(wish => wish.status === "active");
    const wishPoolLines = buildWishLines(plugin, activeWishes).join("\n");
    const today = getLocalDateString();

    let newContent = originalContent;
    const accountBlock = [
      "",
      `### ${translate(plugin, "core.dailySummaryTitle")}`,
      `> 📊 **${translate(plugin, "core.todayPointsLabel")}**: ${points}`,
      `> 💯 **${translate(plugin, "core.currentPointsLabel")}**: ${stats.totalPoints}`,
      `> ⭐ **${translate(plugin, "core.wishStarsLabel")}**: ${stats.wishStars}`,
      `> 🎴 **${translate(plugin, "core.rareCardsLabel")}**: ${stats.rareItemCards}`,
      `> 🌠 **${translate(plugin, "core.legendaryCardsLabel")}**: ${stats.legendaryItemCards}`,
      ">",
      `> ⛲ **${translate(plugin, "core.wishPoolLabel")}**`,
      ...wishPoolLines.split("\n").map(line => line.startsWith(">") ? line : `> ${line}`),
      ">",
      `> *${translate(plugin, "core.syncedAtLabel")}: ${today}*`,
      "",
      `- ${today} - ${points}`,
      ""
    ].join("\n");

    const summaryPattern = /### (Supreme Player Daily Summary|Supreme Player 每日总结)[\s\S]*$/m;
    if (summaryPattern.test(newContent)) {
      newContent = newContent.replace(summaryPattern, accountBlock.trimStart());
    } else {
      newContent = `${newContent.trimEnd()}\n${accountBlock}`;
    }

    const file = await plugin.app.vault.getAbstractFileByPath(path);
    if (file) {
      await plugin.app.vault.modify(file, newContent);
    }
  },

  updateStatusBar(plugin) {
    if (!plugin.statusBar) {
      return;
    }

    const stats = plugin.dataStore.getStats();
    const levelInfo = plugin.dataStore.getLevelTitle(stats.level);

    plugin.statusBar.innerHTML = `
      <span class="sp-level-btn" style="color: ${levelInfo.color}; cursor: pointer;" title="${levelInfo.title} | ${levelInfo.ability}">Lv.${stats.level} ${levelInfo.title}</span>
      <span> | </span>
      <span class="sp-stats-btn" style="cursor: pointer;" title="${translate(plugin, "core.status.totalPoints")}">📊 ${stats.totalPoints}</span>
      <span> | </span>
      <span class="sp-stats-btn" style="cursor: pointer;" title="${translate(plugin, "core.status.wishStars")}">⭐ ${stats.wishStars}</span>
    `;

    const levelButton = plugin.statusBar.querySelector(".sp-level-btn");
    if (levelButton) {
      levelButton.onclick = event => {
        event.stopPropagation();
        plugin.showLevelSystem();
      };
    }

    plugin.statusBar.querySelectorAll(".sp-stats-btn").forEach(button => {
      button.onclick = () => plugin.showStats();
    });

    plugin.statusBar.onmouseenter = () => showStatusHover(plugin);
    plugin.statusBar.onmouseleave = () => scheduleHideStatusHover(plugin);
  },
};

module.exports = Core;
