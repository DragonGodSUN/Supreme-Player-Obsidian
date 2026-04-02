const { Modal, Notice } = require("obsidian");
const Core = require("./core");

function translate(plugin, key, variables) {
  return plugin.t ? plugin.t(key, variables) : key;
}

function createButton(label, onClick, className) {
  const button = document.createElement("button");
  button.textContent = label;
  if (className) {
    button.className = className;
  }
  button.onclick = onClick;
  return button;
}

function getTodayString() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function ensureCheckInHistory(stats) {
  if (!stats.checkInHistory) {
    stats.checkInHistory = [];
  }
  return stats.checkInHistory;
}

function recordTodayCheckIn(stats) {
  const today = getTodayString();
  const history = ensureCheckInHistory(stats);
  if (!history.includes(today)) {
    history.push(today);
    history.sort();
  }
  stats.lastCheckInDate = today;
}

function buildFrequencyDataset(stats, days = 30) {
  const history = new Set(ensureCheckInHistory(stats));
  const today = new Date();
  const result = [];

  for (let offset = days - 1; offset >= 0; offset -= 1) {
    const current = new Date(today);
    current.setDate(today.getDate() - offset);
    const date = `${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, "0")}-${String(current.getDate()).padStart(2, "0")}`;
    result.push({
      date,
      label: `${current.getMonth() + 1}/${current.getDate()}`,
      checked: history.has(date),
    });
  }

  return result;
}

function buildCurrentMonthDataset(stats) {
  const history = new Set(ensureCheckInHistory(stats));
  const today = new Date();
  const start = new Date(today.getFullYear(), today.getMonth(), 1);
  const end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  const result = [];

  for (let day = 1; day <= end.getDate(); day += 1) {
    const current = new Date(today.getFullYear(), today.getMonth(), day);
    const date = `${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, "0")}-${String(current.getDate()).padStart(2, "0")}`;
    result.push({
      date,
      label: `${current.getMonth() + 1}/${current.getDate()}`,
      checked: history.has(date),
    });
  }

  return {
    dataset: result,
    monthKey: `${start.getFullYear()}-${String(start.getMonth() + 1).padStart(2, "0")}`,
  };
}

function getLongestStreak(stats) {
  const history = Array.from(new Set(ensureCheckInHistory(stats))).sort();
  if (!history.length) {
    return 0;
  }

  let longest = 1;
  let current = 1;

  for (let index = 1; index < history.length; index += 1) {
    const previous = new Date(history[index - 1]);
    const currentDate = new Date(history[index]);
    const diffDays = Math.round((currentDate - previous) / 86400000);

    if (diffDays === 1) {
      current += 1;
      longest = Math.max(longest, current);
    } else if (diffDays > 1) {
      current = 1;
    }
  }

  return longest;
}

function buildFrequencyWeeks(dataset) {
  const weeks = [];
  if (!dataset.length) {
    return weeks;
  }

  const firstDate = new Date(`${dataset[0].date}T00:00:00`);
  const leadingEmptyCount = (firstDate.getDay() + 6) % 7;
  const cells = Array.from({ length: leadingEmptyCount }, () => null).concat(dataset);

  while (cells.length % 7 !== 0) {
    cells.push(null);
  }

  for (let index = 0; index < cells.length; index += 7) {
    weeks.push(cells.slice(index, index + 7));
  }

  return weeks;
}

function getLastSevenRecords(dataset) {
  return dataset.slice(-7).reverse();
}

function getCurrentStreak(stats) {
  const history = new Set(ensureCheckInHistory(stats));
  let streak = 0;
  const cursor = new Date();

  while (true) {
    const date = `${cursor.getFullYear()}-${String(cursor.getMonth() + 1).padStart(2, "0")}-${String(cursor.getDate()).padStart(2, "0")}`;
    if (!history.has(date)) {
      if (streak === 0 && date === getTodayString()) {
        cursor.setDate(cursor.getDate() - 1);
        continue;
      }
      break;
    }
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  return streak;
}

function rewardMessage(plugin, result, points, perfect = false) {
  const baseKey = perfect ? "ui.perfectTitle" : "core.checkinComplete";
  let message = perfect
    ? `${translate(plugin, baseKey)} +${points}`
    : translate(plugin, baseKey, { points });
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
  return message;
}

const UI = {
  showCheckInFrequency(plugin, options = {}) {
    const stats = plugin.dataStore.getStats();
    const mode = options.mode || "recent";
    const recentDays = options.days || 7;
    const buffInfo = plugin.dataStore.getCurrentCheckInBuffInfo
      ? plugin.dataStore.getCurrentCheckInBuffInfo()
      : {
          actualStreak: getCurrentStreak(stats),
          warmupStacks: 0,
          effectiveStreak: getCurrentStreak(stats),
          multiplier: 1,
          bonusPercent: 0,
          activeBuff: null,
          nextTarget: 3,
          remainingDays: 3,
          isBuffActive: false
        };
    const monthData = buildCurrentMonthDataset(stats);
    const dataset = mode === "month" ? monthData.dataset : buildFrequencyDataset(stats, recentDays);
    const labelDays = mode === "month" ? dataset.length : recentDays;
    const checkedCount = dataset.filter(item => item.checked).length;
    const missedCount = dataset.length - checkedCount;
    const completionRate = dataset.length ? Math.round((checkedCount / dataset.length) * 100) : 0;
    const streak = buffInfo.actualStreak;
    const longestStreak = getLongestStreak(stats);
    const weeks = buildFrequencyWeeks(dataset);
    const recentRecords = getLastSevenRecords(dataset);
    const todayDone = stats.lastCheckInDate === getTodayString();

    const modal = new Modal(plugin.app);
    modal.titleEl.setText(translate(plugin, "ui.frequencyTitle"));

    const content = document.createElement("div");
    content.style.cssText = "padding: 20px; max-width: 720px;";

    const statusCard = document.createElement("div");
    statusCard.style.cssText = `
      padding: 16px 18px;
      border-radius: 14px;
      margin-bottom: 20px;
      background: ${todayDone ? "linear-gradient(135deg, rgba(0, 170, 85, 0.2), rgba(0, 170, 170, 0.12))" : "var(--background-secondary)"};
      border: 1px solid ${todayDone ? "rgba(0, 170, 85, 0.28)" : "var(--background-modifier-border)"};
    `;
    statusCard.innerHTML = `
      <div style="display: flex; justify-content: space-between; gap: 12px; align-items: flex-start;">
        <div style="min-width: 0;">
          <div style="font-size: 16px; font-weight: 700; margin-bottom: 6px;">${translate(plugin, "ui.frequency")}</div>
          <div style="font-size: 13px; line-height: 1.6; color: ${todayDone ? "#00aa55" : "var(--text-muted)"};">
            ${todayDone ? translate(plugin, "ui.frequencyTodayDone") : translate(plugin, "ui.frequencyTodayPending")}
          </div>
        </div>
        <div style="flex-shrink: 0; padding: 6px 10px; border-radius: 999px; font-size: 12px; font-weight: 700; background: ${todayDone ? "rgba(0, 170, 85, 0.14)" : "rgba(255, 170, 0, 0.14)"}; color: ${todayDone ? "#00aa55" : "#cc8800"};">
          ${todayDone ? translate(plugin, "ui.frequencyChecked") : translate(plugin, "ui.frequencyMissed")}
        </div>
      </div>
    `;
    content.appendChild(statusCard);

    const summaryGrid = document.createElement("div");
    summaryGrid.style.cssText = "display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 10px; margin-bottom: 20px;";
    summaryGrid.innerHTML = `
      <div style="background: var(--background-secondary); padding: 12px; border-radius: 8px; text-align: center;">
        <div style="font-size: 12px; color: #888;">${translate(plugin, "ui.frequencyTotal")}</div>
        <div style="font-size: 20px; font-weight: bold;">${checkedCount}</div>
      </div>
      <div style="background: var(--background-secondary); padding: 12px; border-radius: 8px; text-align: center;">
        <div style="font-size: 12px; color: #888;">${translate(plugin, "ui.frequencyRate")}</div>
        <div style="font-size: 20px; font-weight: bold;">${completionRate}%</div>
      </div>
      <div style="background: var(--background-secondary); padding: 12px; border-radius: 8px; text-align: center;">
        <div style="font-size: 12px; color: #888;">${translate(plugin, "ui.frequencyCurrentStreak")}</div>
        <div style="font-size: 20px; font-weight: bold;">${streak}</div>
      </div>
      <div style="background: var(--background-secondary); padding: 12px; border-radius: 8px; text-align: center;">
        <div style="font-size: 12px; color: #888;">${translate(plugin, "ui.frequencyLongestStreak")}</div>
        <div style="font-size: 20px; font-weight: bold;">${longestStreak}</div>
      </div>
    `;
    content.appendChild(summaryGrid);

    const buffCard = document.createElement("div");
    buffCard.style.cssText = `
      background: var(--background-secondary);
      border-radius: 12px;
      padding: 14px 16px;
      margin-bottom: 18px;
      border: 1px solid ${buffInfo.isBuffActive ? "rgba(255, 170, 0, 0.28)" : "var(--background-modifier-border)"};
    `;
    const activeBuffLabel = buffInfo.activeBuff
      ? translate(plugin, "ui.frequencyBuffActive", {
          icon: buffInfo.activeBuff.icon || "✨",
          name: buffInfo.activeBuff.name,
          percent: buffInfo.bonusPercent
        })
      : translate(plugin, "ui.frequencyBuffInactive");
    const nextBuffLabel = buffInfo.nextTarget
      ? `${buffInfo.nextTarget} ${translate(plugin, "ui.frequencyRemainingDays", { count: buffInfo.remainingDays })}`
      : translate(plugin, "ui.frequencyReadyNow");
    buffCard.innerHTML = `
      <div style="display:flex;justify-content:space-between;gap:12px;align-items:flex-start;flex-wrap:wrap;">
        <div style="min-width:0;">
          <div style="font-size:12px;color:var(--text-muted);margin-bottom:6px;">${translate(plugin, "ui.frequencyBuffTitle")}</div>
          <div style="font-size:18px;font-weight:700;color:${buffInfo.isBuffActive ? "#ffaa00" : "var(--text-normal)"};">${activeBuffLabel}</div>
        </div>
        <div style="display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px;min-width:min(100%,340px);flex:1;">
          <div style="background:var(--background-primary);border-radius:10px;padding:10px;text-align:center;">
            <div style="font-size:11px;color:var(--text-muted);">${translate(plugin, "ui.frequencyWarmup")}</div>
            <div style="font-size:18px;font-weight:700;">${buffInfo.warmupStacks}</div>
          </div>
          <div style="background:var(--background-primary);border-radius:10px;padding:10px;text-align:center;">
            <div style="font-size:11px;color:var(--text-muted);">${translate(plugin, "ui.frequencyEffectiveStreak")}</div>
            <div style="font-size:18px;font-weight:700;">${buffInfo.effectiveStreak}</div>
          </div>
          <div style="background:var(--background-primary);border-radius:10px;padding:10px;text-align:center;">
            <div style="font-size:11px;color:var(--text-muted);">${translate(plugin, "ui.frequencyNextBuff")}</div>
            <div style="font-size:13px;font-weight:700;line-height:1.35;">${nextBuffLabel}</div>
          </div>
        </div>
      </div>
    `;
    content.appendChild(buffCard);

    if (!checkedCount) {
      const empty = document.createElement("div");
      empty.style.cssText = "background: var(--background-secondary); border-radius: 8px; padding: 16px; color: var(--text-muted); margin-bottom: 15px;";
      empty.textContent = translate(plugin, "ui.frequencyNoData");
      content.appendChild(empty);
    } else {
      const insightGrid = document.createElement("div");
      insightGrid.style.cssText = "display: grid; grid-template-columns: 1.5fr 1fr; gap: 14px; margin-bottom: 18px;";
      insightGrid.innerHTML = `
        <div style="background: var(--background-secondary); border-radius: 12px; padding: 14px;">
          <div style="font-size: 12px; color: var(--text-muted); margin-bottom: 6px;">${mode === "month" ? translate(plugin, "ui.frequencyCurrentMonth") : translate(plugin, "ui.frequencyRecentDays", { days: labelDays })}</div>
          <div style="font-size: 18px; font-weight: 700; margin-bottom: 4px;">${mode === "month" ? translate(plugin, "ui.frequencyMonthTitle") : translate(plugin, "ui.frequencyRecentWeekTitle")}</div>
          <div style="font-size: 12px; color: var(--text-muted); line-height: 1.6;">
            ${mode === "month" ? translate(plugin, "ui.frequencyMonthHint") : translate(plugin, "ui.frequencyRecentWeekHint")}
          </div>
        </div>
        <div style="background: var(--background-secondary); border-radius: 12px; padding: 14px;">
          <div style="font-size: 12px; color: var(--text-muted); margin-bottom: 6px;">${translate(plugin, "ui.frequencyInsights")}</div>
          <div style="display: grid; gap: 6px; font-size: 13px; line-height: 1.5;">
            <div>✅ ${translate(plugin, "ui.frequencyDoneDays", { count: checkedCount })}</div>
            <div>🕳️ ${translate(plugin, "ui.frequencyMissedDays", { count: missedCount })}</div>
            <div>🔥 ${translate(plugin, "ui.frequencyLongestStreakText", { count: longestStreak })}</div>
          </div>
        </div>
      `;
      content.appendChild(insightGrid);

      const calendarWrap = document.createElement("div");
      calendarWrap.style.cssText = "background: var(--background-secondary); border-radius: 12px; padding: 16px; margin-bottom: 16px;";

      if (mode === "recent") {
        const recentStrip = document.createElement("div");
        recentStrip.style.cssText = "display: grid; grid-template-columns: repeat(7, minmax(0, 1fr)); gap: 8px; margin-bottom: 14px;";

        dataset.forEach(item => {
          const cell = document.createElement("div");
          const isToday = item.date === getTodayString();
          cell.style.cssText = `
            min-height: 68px;
            border-radius: 10px;
            padding: 8px 6px;
            border: 1px solid ${isToday ? "#00aaff" : "var(--background-modifier-border)"};
            background: ${item.checked ? "linear-gradient(180deg, rgba(0, 170, 255, 0.16), rgba(0, 221, 136, 0.2))" : "var(--background-primary)"};
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            gap: 6px;
          `;
          cell.title = `${item.date} - ${item.checked ? translate(plugin, "ui.frequencyChecked") : translate(plugin, "ui.frequencyMissed")}`;
          cell.innerHTML = `
            <div style="display:flex;justify-content:space-between;gap:4px;align-items:flex-start;">
              <div style="font-size:12px;font-weight:700;">${item.date.split("-")[2]}</div>
              ${isToday ? `<div style="font-size:10px;font-weight:700;color:#00aaff;">${translate(plugin, "ui.frequencyTodayTag")}</div>` : ""}
            </div>
            <div style="display:flex;justify-content:space-between;align-items:flex-end;gap:8px;color:${item.checked ? "#00aa77" : "var(--text-faint)"};">
              <span style="font-size:18px;line-height:1;">${item.checked ? "✔" : "·"}</span>
              <span style="font-size:10px;color:var(--text-muted);">${item.label}</span>
            </div>
          `;
          recentStrip.appendChild(cell);
        });

        calendarWrap.appendChild(recentStrip);

        const expandBtn = createButton(`🗓 ${translate(plugin, "ui.frequencyExpandCalendar")}`, () => {
          modal.close();
          this.showCheckInFrequency(plugin, { ...options, mode: "month" });
        });
        expandBtn.style.width = "100%";
        expandBtn.style.marginBottom = "4px";
        calendarWrap.appendChild(expandBtn);
        content.appendChild(calendarWrap);
      } else {

        const weekdayHeader = document.createElement("div");
        weekdayHeader.style.cssText = "display: grid; grid-template-columns: repeat(7, minmax(0, 1fr)); gap: 8px; margin-bottom: 10px;";
        [
          "ui.frequencyWeekMon",
          "ui.frequencyWeekTue",
          "ui.frequencyWeekWed",
          "ui.frequencyWeekThu",
          "ui.frequencyWeekFri",
          "ui.frequencyWeekSat",
          "ui.frequencyWeekSun",
        ].forEach(key => {
          const headerItem = document.createElement("div");
          headerItem.style.cssText = "font-size: 11px; color: var(--text-muted); text-align: center; font-weight: 600;";
          headerItem.textContent = translate(plugin, key);
          weekdayHeader.appendChild(headerItem);
        });
        calendarWrap.appendChild(weekdayHeader);

        const calendarGrid = document.createElement("div");
        calendarGrid.style.cssText = "display: grid; gap: 8px;";

        weeks.forEach(week => {
          const weekRow = document.createElement("div");
          weekRow.style.cssText = "display: grid; grid-template-columns: repeat(7, minmax(0, 1fr)); gap: 8px;";

          week.forEach(item => {
            if (!item) {
              const emptyCell = document.createElement("div");
              emptyCell.style.cssText = "min-height: 70px; border-radius: 10px; background: transparent;";
              weekRow.appendChild(emptyCell);
              return;
            }

            const cell = document.createElement("div");
            const isToday = item.date === getTodayString();
            cell.style.cssText = `
              min-height: 70px;
              border-radius: 10px;
              padding: 8px 6px;
              border: 1px solid ${isToday ? "#00aaff" : "var(--background-modifier-border)"};
              background: ${item.checked ? "linear-gradient(180deg, rgba(0, 170, 255, 0.16), rgba(0, 221, 136, 0.2))" : "var(--background-primary)"};
              display: flex;
              flex-direction: column;
              justify-content: space-between;
              gap: 6px;
            `;
            cell.title = `${item.date} - ${item.checked ? translate(plugin, "ui.frequencyChecked") : translate(plugin, "ui.frequencyMissed")}`;

            const top = document.createElement("div");
            top.style.cssText = "display: flex; justify-content: space-between; align-items: flex-start; gap: 4px;";

            const label = document.createElement("div");
            label.style.cssText = "font-size: 12px; font-weight: 700;";
            label.textContent = item.date.split("-")[2];
            top.appendChild(label);

            const monthLabel = document.createElement("div");
            monthLabel.style.cssText = "font-size: 10px; color: var(--text-muted);";
            monthLabel.textContent = item.label;

            if (isToday) {
              const todayTag = document.createElement("div");
              todayTag.style.cssText = "font-size: 10px; font-weight: 700; color: #00aaff;";
              todayTag.textContent = translate(plugin, "ui.frequencyTodayTag");
              top.appendChild(todayTag);
            }

            const status = document.createElement("div");
            status.style.cssText = `display: flex; justify-content: space-between; align-items: flex-end; gap: 8px; font-size: 18px; line-height: 1; color: ${item.checked ? "#00aa77" : "var(--text-faint)"};`;
            status.innerHTML = `
              <span>${item.checked ? "✔" : "·"}</span>
              <span style="font-size: 10px; color: var(--text-muted);">${monthLabel.textContent}</span>
            `;

            cell.appendChild(top);
            cell.appendChild(status);
            weekRow.appendChild(cell);
          });

          calendarGrid.appendChild(weekRow);
        });

        calendarWrap.appendChild(calendarGrid);
        content.appendChild(calendarWrap);
      }

      const recentSection = document.createElement("div");
      recentSection.style.cssText = "background: var(--background-secondary); border-radius: 12px; padding: 16px; margin-bottom: 15px;";

      const recentTitle = document.createElement("div");
      recentTitle.style.cssText = "font-size: 14px; font-weight: 700; margin-bottom: 12px;";
      recentTitle.textContent = translate(plugin, "ui.frequencyRecentStatus");
      recentSection.appendChild(recentTitle);

      const recentList = document.createElement("div");
      recentList.style.cssText = "display: grid; gap: 8px;";

      for (const item of recentRecords) {
        const row = document.createElement("div");
        row.style.cssText = "display: flex; justify-content: space-between; align-items: center; gap: 12px; padding: 10px 12px; border-radius: 10px; background: var(--background-primary);";

        const left = document.createElement("div");
        left.style.cssText = "display: flex; flex-direction: column; gap: 3px; min-width: 0;";
        left.innerHTML = `
          <div style="font-weight: 600;">${item.date}</div>
          <div style="font-size: 12px; color: var(--text-muted);">${item.label}</div>
        `;

        const badge = document.createElement("div");
        badge.style.cssText = `
          flex-shrink: 0;
          padding: 5px 10px;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 700;
          background: ${item.checked ? "rgba(0, 170, 85, 0.14)" : "rgba(136, 136, 136, 0.14)"};
          color: ${item.checked ? "#00aa55" : "var(--text-muted)"};
        `;
        badge.textContent = item.checked ? translate(plugin, "ui.frequencyChecked") : translate(plugin, "ui.frequencyMissed");

        row.appendChild(left);
        row.appendChild(badge);
        recentList.appendChild(row);
      }
      recentSection.appendChild(recentList);
      content.appendChild(recentSection);

      const legend = document.createElement("div");
      legend.style.cssText = "display: flex; gap: 15px; font-size: 12px; color: #888; margin-bottom: 15px;";
      legend.innerHTML = `
        <div><span style="display:inline-block;width:12px;height:12px;background:linear-gradient(180deg, #00aaff, #00dd88);border-radius:3px;margin-right:6px;"></span>${translate(plugin, "ui.frequencyChecked")}</div>
        <div><span style="display:inline-block;width:12px;height:12px;background:var(--background-modifier-border);border-radius:3px;margin-right:6px;"></span>${translate(plugin, "ui.frequencyMissed")}</div>
      `;
      content.appendChild(legend);
    }

    const buttonRow = document.createElement("div");
    buttonRow.style.cssText = "display: flex; gap: 10px;";

    if (options.fromCheckIn) {
      const backButton = createButton(`↩ ${translate(plugin, "ui.checkInTitle")}`, () => {
        modal.close();
        this.showCheckInPanel(plugin);
      });
      backButton.style.flex = "1";
      buttonRow.appendChild(backButton);
    }

    const closeBtn = createButton(`✖ ${translate(plugin, "common.close")}`, () => modal.close(), options.todayCompleted ? "mod-cta" : "");
    closeBtn.style.flex = "1";
    buttonRow.appendChild(closeBtn);

    content.appendChild(buttonRow);
    modal.contentEl.appendChild(content);
    modal.open();
  },

  showLevelSystem(plugin) {
    const stats = plugin.dataStore.getStats();
    const levels = (plugin.dataStore.config?.levels || []).map((level, index) =>
      plugin.dataStore.getLocalizedLevelConfig(level, index)
    );
    const currentLevelInfo = plugin.dataStore.getLevelTitle(stats.level);

    const modal = new Modal(plugin.app);
    modal.titleEl.setText(translate(plugin, "ui.levelSystemTitle"));

    const content = document.createElement("div");
    content.style.padding = "20px";
    content.style.maxWidth = "500px";

    const currentDiv = document.createElement("div");
    currentDiv.style.cssText = "background: var(--background-secondary); padding: 15px; border-radius: 8px; margin-bottom: 20px; text-align: center;";
    currentDiv.innerHTML = `
      <div style="font-size: 14px; color: #888; margin-bottom: 5px;">${translate(plugin, "ui.currentLevel")}</div>
      <div style="font-size: 28px; font-weight: bold; color: ${currentLevelInfo.color};">Lv.${stats.level} ${currentLevelInfo.title}</div>
      <div style="font-size: 14px; color: #888; margin-top: 5px;">${currentLevelInfo.abilityIcon || "✨"} ${currentLevelInfo.ability} | ${currentLevelInfo.phaseIcon || "🌱"} ${currentLevelInfo.phase}</div>
      <div style="margin-top: 10px; font-size: 12px; color: #888;">${translate(plugin, "ui.totalPoints")} ${stats.totalPoints}</div>
    `;
    content.appendChild(currentDiv);

    const levelListTitle = document.createElement("div");
    levelListTitle.style.cssText = "font-weight: bold; margin-bottom: 10px;";
    levelListTitle.textContent = translate(plugin, "ui.levelStages");
    content.appendChild(levelListTitle);

    const levelList = document.createElement("div");
    levelList.style.cssText = "max-height: 350px; overflow-y: auto;";

    for (const level of levels) {
      const isCurrentLevel = stats.level >= level.minLevel && stats.level <= level.maxLevel;
      const minPoints = level.minLevel * 5000;
      const maxPoints = level.maxLevel * 5000;

      const levelDiv = document.createElement("div");
      levelDiv.style.cssText = `
        padding: 12px;
        margin-bottom: 8px;
        border: 1px solid ${isCurrentLevel ? level.color : "var(--border-color)"};
        border-radius: 6px;
        background: ${isCurrentLevel ? `${level.color}15` : "transparent"};
      `;

      levelDiv.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div>
            <span style="font-weight: bold; color: ${level.color};">${level.title}</span>
            <span style="color: #888; font-size: 12px; margin-left: 8px;">Lv.${level.minLevel}-${level.maxLevel}</span>
            ${isCurrentLevel ? `<span style="background: ${level.color}; color: white; padding: 2px 6px; border-radius: 3px; font-size: 10px; margin-left: 8px;">${translate(plugin, "ui.currentTag")}</span>` : ""}
          </div>
          <div style="font-size: 12px; color: #888;">${minPoints.toLocaleString()} - ${maxPoints.toLocaleString()} ${translate(plugin, "ui.pointsUnit")}</div>
        </div>
        <div style="margin-top: 8px; font-size: 13px;">
          <span style="color: #00aaff;">${level.abilityIcon || "✨"} ${level.ability}</span>
          <span style="color: #888; margin: 0 8px;">|</span>
          <span style="color: #ffd700;">${level.phaseIcon || "🌱"} ${level.phase}</span>
        </div>
      `;

      levelList.appendChild(levelDiv);
    }

    content.appendChild(levelList);

    const closeBtn = createButton(translate(plugin, "common.close"), () => modal.close());
    closeBtn.style.cssText = "width: 100%; margin-top: 15px;";
    content.appendChild(closeBtn);

    modal.contentEl.appendChild(content);
    modal.open();
  },

  showStats(plugin) {
    const stats = plugin.dataStore.getStats();
    const levelInfo = plugin.dataStore.getLevelTitle(stats.level);
    const activeBuffs = plugin.dataStore.getActiveBuffs();
    const playerName = stats.playerName || translate(plugin, "settings.defaultPlayerName");

    const modal = new Modal(plugin.app);
    modal.titleEl.setText(translate(plugin, "ui.playerPanel", { name: playerName }));

    const content = document.createElement("div");
    content.style.padding = "20px";

    const topGrid = document.createElement("div");
    topGrid.style.display = "grid";
    topGrid.style.gridTemplateColumns = "1fr 1fr";
    topGrid.style.gap = "20px";
    topGrid.innerHTML = `
      <div style="background: var(--background-secondary); padding: 15px; border-radius: 8px;"><div style="color: #888; font-size: 12px;">📊 ${translate(plugin, "ui.stat.points")}</div><div style="font-size: 24px; font-weight: bold;">${stats.totalPoints}</div></div>
      <div style="background: var(--background-secondary); padding: 15px; border-radius: 8px;"><div style="color: #888; font-size: 12px;">⭐ ${translate(plugin, "ui.stat.level")}</div><div style="font-size: 24px; font-weight: bold; color: ${levelInfo.color};">Lv.${stats.level} ${levelInfo.title}</div></div>
      <div style="background: var(--background-secondary); padding: 15px; border-radius: 8px;"><div style="color: #888; font-size: 12px;">✨ ${translate(plugin, "ui.stat.wishStars")}</div><div style="font-size: 24px; font-weight: bold;">${stats.wishStars}</div></div>
      <div style="background: var(--background-secondary); padding: 15px; border-radius: 8px;"><div style="color: #888; font-size: 12px;">🎒 ${translate(plugin, "ui.stat.inventory")}</div><div style="font-size: 24px; font-weight: bold;">${stats.inventory.length}</div></div>
    `;
    content.appendChild(topGrid);

    const bottomGrid = document.createElement("div");
    bottomGrid.style.marginTop = "20px";
    bottomGrid.style.display = "grid";
    bottomGrid.style.gridTemplateColumns = "1fr 1fr 1fr";
    bottomGrid.style.gap = "10px";
    const rareCardName = plugin.dataStore.getCurrencies().find(currency => currency.id === "rareItemCards")?.name || "Rare Item Card";
    const legendaryCardName = plugin.dataStore.getCurrencies().find(currency => currency.id === "legendaryItemCards")?.name || "Legendary Item Card";
    bottomGrid.innerHTML = `
      <div style="background: #9966ff20; padding: 10px; border-radius: 5px; text-align: center;"><div style="font-size: 20px;">🎴</div><div>${rareCardName}</div><div style="font-weight: bold;">${stats.rareItemCards}</div></div>
      <div style="background: #ffd70020; padding: 10px; border-radius: 5px; text-align: center;"><div style="font-size: 20px;">🌠</div><div>${legendaryCardName}</div><div style="font-weight: bold;">${stats.legendaryItemCards}</div></div>
      <div style="background: #00ff0020; padding: 10px; border-radius: 5px; text-align: center;"><div style="font-size: 20px;">📈</div><div>${translate(plugin, "ui.stat.nextLevel")}</div><div style="font-weight: bold;">${5000 - (stats.totalPoints % 5000)}</div></div>
    `;
    content.appendChild(bottomGrid);

    if (activeBuffs.length > 0) {
      const buffSection = document.createElement("div");
      buffSection.style.marginTop = "20px";
      buffSection.innerHTML = `<div style="font-weight: bold; margin-bottom: 10px;">${translate(plugin, "ui.activeBuffs")}</div>`;
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

    const checkInBtn = createButton(`📝 ${translate(plugin, "ui.dailyCheckIn")}`, () => {
      modal.close();
      this.showCheckInPanel(plugin);
    }, "mod-cta");
    checkInBtn.style.gridColumn = "1 / -1";
    buttonSection.appendChild(checkInBtn);

    const wishBtn = createButton(`✨ ${translate(plugin, "ui.goWishPool")}`, () => {
      modal.close();
      plugin.showWishPool();
    });
    buttonSection.appendChild(wishBtn);

    const shopBtn = createButton(`🎴 ${translate(plugin, "ui.goShop")}`, () => {
      modal.close();
      plugin.showShop();
    });
    buttonSection.appendChild(shopBtn);

    const inventoryBtn = createButton(`🎒 ${translate(plugin, "ui.openInventory")}`, () => {
      modal.close();
      plugin.showInventory();
    });
    inventoryBtn.style.gridColumn = "1 / -1";
    buttonSection.appendChild(inventoryBtn);
    content.appendChild(buttonSection);

    const closeBtn = createButton(translate(plugin, "common.close"), () => modal.close());
    closeBtn.style.width = "100%";
    closeBtn.style.marginTop = "10px";
    content.appendChild(closeBtn);

    modal.contentEl.appendChild(content);
    modal.open();
  },

  async showCheckInPanel(plugin) {
    const config = plugin.dataStore.config || plugin.dataStore.getDefaultConfig();
    const stats = plugin.dataStore.getStats();
    const today = getTodayString();

    const dailyTasks = config.dailyTasks || {
      mainTasks: { count: 3, pointsPerTask: 100 },
      habits: { items: [] },
      extraTasks: { count: 2, pointsPerTask: 50 },
      pomodoro: { count: 6, pointsPerPomodoro: 50 },
    };

    const mainTasks = dailyTasks.mainTasks || { count: 3, pointsPerTask: 100 };
    const habits = dailyTasks.habits?.items || [];
    const habitsPoints = habits.reduce((sum, item) => sum + (item.points || 0), 0);
    const maxBasePoints = mainTasks.count * mainTasks.pointsPerTask + habitsPoints;

    let currentPoints = 0;
    let record = null;

    try {
      const file = await Core.findTodayNoteFile(plugin.app);
      if (file) {
        const noteContent = await plugin.app.vault.read(file);
        record = plugin.parser.parseDailyNote(noteContent, today);
        currentPoints = plugin.parser.calculatePoints(record);
      }
    } catch (error) {
      console.log("No daily note found", error);
    }

    const alreadyCheckedIn = stats.lastCheckInDate === today;
    if (config.debugMode) {
      console.log('[CheckIn] dataFilePath:', plugin.dataStore.config?.dataFilePath);
      console.log('[CheckIn] stats.lastCheckInDate:', stats.lastCheckInDate, 'today:', today, 'alreadyCheckedIn:', alreadyCheckedIn);
      console.log('[CheckIn] full stats:', JSON.stringify(stats, null, 2).substring(0, 500));
    }

    const modal = new Modal(plugin.app);
    modal.titleEl.setText(translate(plugin, "ui.checkInTitle"));

    const content = document.createElement("div");
    content.style.padding = "20px";

    if (alreadyCheckedIn) {
      content.innerHTML = `
        <div style="text-align: center; margin-bottom: 20px;">
          <div style="font-size: 64px; margin-bottom: 15px;">✅</div>
          <div style="font-size: 18px; font-weight: bold; margin-bottom: 10px; color: #00aaff;">${translate(plugin, "ui.todayDone")}</div>
          <div style="color: #888; font-size: 13px;">${translate(plugin, "ui.comeTomorrow")}</div>
        </div>
      `;

      const chartBtn = createButton(`📅 ${translate(plugin, "ui.frequencyOpen")}`, () => {
        modal.close();
        this.showCheckInFrequency(plugin, { fromCheckIn: true, todayCompleted: true });
      }, "mod-cta");
      chartBtn.style.width = "100%";
      chartBtn.style.marginBottom = "10px";
      content.appendChild(chartBtn);

      const closeBtn = createButton(`✖ ${translate(plugin, "common.close")}`, () => modal.close());
      closeBtn.style.width = "100%";
      content.appendChild(closeBtn);
      modal.contentEl.appendChild(content);
      modal.open();
      return;
    }

    const progressPercent = Math.min(100, Math.round((currentPoints / maxBasePoints) * 100));
    const isPerfect = currentPoints >= maxBasePoints;
    const completedMain = record ? record.mainTasks.filter(task => task.completed).length : 0;
    const completedHabits = record ? record.habits.filter(task => task.completed).length : 0;

    content.innerHTML = `
      <div style="text-align: center; margin-bottom: 20px;">
        <div style="font-size: 14px; color: #888; margin-bottom: 10px;">${translate(plugin, "ui.todayPoints")}</div>
        <div style="font-size: 36px; font-weight: bold; color: ${isPerfect ? "#ffd700" : "#00aaff"};">${currentPoints}</div>
        <div style="font-size: 12px; color: #888;">/ ${maxBasePoints} ${translate(plugin, "ui.basePoints")}</div>
      </div>

      <div style="margin-bottom: 20px;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
          <span style="font-size: 12px; color: #888;">${translate(plugin, "ui.progress")}</span>
          <span style="font-size: 12px; color: ${isPerfect ? "#ffd700" : "#00aaff"};">${progressPercent}%</span>
        </div>
        <div style="background: var(--background-secondary); height: 20px; border-radius: 10px; overflow: hidden;">
          <div style="background: ${isPerfect ? "linear-gradient(90deg, #ffd700, #ffaa00)" : "linear-gradient(90deg, #00aaff, #0066ff)"}; height: 100%; width: ${progressPercent}%; transition: width 0.3s; display: flex; align-items: center; justify-content: center;">
            ${progressPercent >= 30 ? `<span style="color: white; font-size: 11px; font-weight: bold;">${progressPercent}%</span>` : ""}
          </div>
        </div>
      </div>

      <div style="background: var(--background-secondary); padding: 15px; border-radius: 8px; margin-bottom: 20px;">
        <div style="font-weight: bold; margin-bottom: 10px;">${translate(plugin, "ui.taskSummary")}</div>
        <div style="font-size: 13px; color: #888;">
          <div>• ${translate(plugin, "ui.mainTasks")}: ${completedMain}/${mainTasks.count}</div>
          <div>• ${translate(plugin, "ui.habits")}: ${completedHabits}/${habits.length}</div>
        </div>
      </div>

      <div style="text-align: center; color: #888; font-size: 12px; margin-bottom: 15px;">
        ${isPerfect ? translate(plugin, "ui.perfectHint") : translate(plugin, "ui.keepGoingHint")}
      </div>
    `;

    const checkInBtn = createButton(
      isPerfect ? `🌟 ${translate(plugin, "ui.perfectCheckIn")}` : `✅ ${translate(plugin, "ui.confirmCheckIn")}`,
      async () => {
        modal.close();
        if (isPerfect) {
          await this.showPerfectCheckIn(plugin, currentPoints);
        } else {
          await this.showCheckInConfirm(plugin, currentPoints, maxBasePoints);
        }
      },
      "mod-cta"
    );
    checkInBtn.style.width = "100%";
    checkInBtn.style.marginBottom = "10px";
    content.appendChild(checkInBtn);

    const frequencyBtn = createButton(`📅 ${translate(plugin, "ui.frequencyOpen")}`, () => {
      modal.close();
      this.showCheckInFrequency(plugin, { fromCheckIn: true, todayCompleted: false });
    });
    frequencyBtn.style.width = "100%";
    frequencyBtn.style.marginBottom = "10px";
    content.appendChild(frequencyBtn);

    const buttonContainer = document.createElement("div");
    buttonContainer.style.display = "flex";
    buttonContainer.style.gap = "10px";

    const backBtn = createButton(`↩ ${translate(plugin, "common.backToPanel")}`, () => {
      modal.close();
      plugin.showStats();
    });
    backBtn.style.flex = "1";

    const closeBtn = createButton(`✖ ${translate(plugin, "common.close")}`, () => modal.close());
    closeBtn.style.flex = "1";

    buttonContainer.appendChild(backBtn);
    buttonContainer.appendChild(closeBtn);
    content.appendChild(buttonContainer);

    modal.contentEl.appendChild(content);
    modal.open();
  },

  async showCheckInConfirm(plugin, currentPoints, maxBasePoints) {
    const modal = new Modal(plugin.app);
    modal.titleEl.setText(translate(plugin, "ui.checkInConfirmTitle"));

    const content = document.createElement("div");
    content.style.padding = "20px";
    content.style.textAlign = "center";

    content.innerHTML = `
      <div style="font-size: 48px; margin-bottom: 15px;">📝</div>
      <div style="font-size: 18px; font-weight: bold; margin-bottom: 10px;">${translate(plugin, "ui.checkInConfirmHeadline")}</div>
      <div style="color: #888; margin-bottom: 15px;">
        ${translate(plugin, "ui.pointsEarned")}: <strong style="color: #00aaff;">${currentPoints}</strong><br>
        ${translate(plugin, "ui.pointsToPerfect")}: <strong style="color: #ffd700;">${maxBasePoints - currentPoints}</strong>
      </div>
      <div style="background: #ffaa0020; padding: 10px; border-radius: 5px; margin-bottom: 15px; color: #ffaa00; font-size: 13px;">
        ${translate(plugin, "ui.perfectRewardHint")}
      </div>
    `;

    const buttonContainer = document.createElement("div");
    buttonContainer.style.display = "flex";
    buttonContainer.style.gap = "10px";

    const confirmBtn = createButton(`✅ ${translate(plugin, "ui.confirmCheckIn")}`, async () => {
      modal.close();
      const result = await plugin.dataStore.addCheckInPoints(currentPoints);
      const file = await Core.findTodayNoteFile(plugin.app);
      if (file) {
        const noteContent = await plugin.app.vault.read(file);
        await Core.updateDailyNote(plugin, file.path, noteContent, result.awardedPoints);
      }
      new Notice(rewardMessage(plugin, result, result.awardedPoints));
      plugin.updateStatusBar();
      this.showCheckInFrequency(plugin, { todayCompleted: true });
    }, "mod-cta");
    confirmBtn.style.flex = "1";

    const cancelBtn = createButton(`💪 ${translate(plugin, "ui.keepWorking")}`, () => modal.close());
    cancelBtn.style.flex = "1";

    buttonContainer.appendChild(confirmBtn);
    buttonContainer.appendChild(cancelBtn);
    content.appendChild(buttonContainer);

    modal.contentEl.appendChild(content);
    modal.open();
  },

  async showPerfectCheckIn(plugin, points) {
    const config = plugin.dataStore.config || plugin.dataStore.getDefaultConfig();
    const perfectReward = plugin.dataStore.getLocalizedPerfectReward(config.perfectCheckInReward) || {
      enabled: true,
      rewardType: "exclusive",
      exclusiveItem: {
        name: "Super Diamond",
        icon: "💎",
        description: "Perfect check-in reward",
        rarity: "legendary",
        category: "system",
      },
      blessingTitle: translate(plugin, "ui.perfectTitle"),
      blessingMessage: translate(plugin, "ui.perfectHint"),
    };

    const modal = new Modal(plugin.app);
    modal.titleEl.setText(translate(plugin, "ui.perfectTitle"));

    const content = document.createElement("div");
    content.style.padding = "20px";
    content.style.textAlign = "center";

    let rewardInfo = "";
    let rewardItem = null;

    if (perfectReward.enabled) {
      if (perfectReward.rewardType === "shop" && perfectReward.shopItemId) {
        const shopItems = plugin.dataStore.getShopItems() || [];
        rewardItem = shopItems.find(item => item.id === perfectReward.shopItemId);
        if (rewardItem) {
          rewardInfo = translate(plugin, "ui.rewardAdded", { icon: rewardItem.icon, name: rewardItem.name });
        }
      } else if (perfectReward.rewardType === "exclusive" && perfectReward.exclusiveItem) {
        const reward = perfectReward.exclusiveItem;
        rewardItem = {
          id: `exclusive-${Date.now()}`,
          instanceId: `exclusive-instance-${Date.now()}`,
          name: reward.name,
          description: reward.description,
          icon: reward.icon,
          category: reward.category || "system",
          rarity: reward.rarity || "rare",
          effect: reward.effect,
          obtainedAt: new Date().toISOString(),
        };
        rewardInfo = translate(plugin, "ui.rewardAdded", { icon: reward.icon, name: reward.name });
      }
    }

    content.innerHTML = `
      <div style="font-size: 64px; margin-bottom: 20px;">🏆</div>
      <div style="font-size: 20px; font-weight: bold; margin-bottom: 15px; color: #ffd700;">${perfectReward.blessingTitle || translate(plugin, "ui.perfectTitle")}</div>
      <div style="background: var(--background-secondary); padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <div style="color: #00aaff; font-size: 16px; margin-bottom: 10px;">${translate(plugin, "ui.todayPoints")}: ${points}</div>
        ${rewardInfo ? `<div style="color: #ffd700; font-size: 14px;">${rewardInfo}</div>` : ""}
      </div>
      <div style="color: #888; font-size: 12px; margin-bottom: 15px;">
        ${perfectReward.blessingMessage || translate(plugin, "ui.perfectHint")}
      </div>
    `;

    if (perfectReward.enabled && rewardItem) {
      const stats = plugin.dataStore.getStats();
      if (!stats.inventory) {
        stats.inventory = [];
      }
      stats.inventory.push(rewardItem);
    }

    const result = await plugin.dataStore.addCheckInPoints(points);
    const file = await Core.findTodayNoteFile(plugin.app);
    if (file) {
      const noteContent = await plugin.app.vault.read(file);
      await Core.updateDailyNote(plugin, file.path, noteContent, result.awardedPoints);
    }
    plugin.updateStatusBar();

    new Notice(rewardMessage(plugin, result, result.awardedPoints, true));

    const closeBtn = createButton(`💖 ${translate(plugin, "ui.perfectThanks")}`, () => { modal.close(); this.showCheckInFrequency(plugin, { todayCompleted: true }); }, "mod-cta");
    closeBtn.style.width = "100%";
    content.appendChild(closeBtn);

    modal.contentEl.appendChild(content);
    modal.open();
    setTimeout(() => this.showCheckInFrequency(plugin, { todayCompleted: true }), 0);
  },
};

module.exports = UI;
