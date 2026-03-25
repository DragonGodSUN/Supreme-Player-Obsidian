const { PluginSettingTab, Setting, Notice, Modal } = require("obsidian");
const { renderEffectParams, buildEffectFromForm } = require('./utils');

class SupremePlayerSettingTab extends PluginSettingTab {
  constructor(app, plugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  setupPathAutocomplete(inputEl, fileExtension) {
    let suggestionEl = null;
    let currentSuggestions = [];

    const showSuggestions = (suggestions) => {
      hideSuggestions();
      if (suggestions.length === 0) return;

      suggestionEl = document.createElement('div');
      suggestionEl.className = 'suggestion-container';
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
        const item = document.createElement('div');
        item.className = 'suggestion-item';
        item.style.cssText = `
          padding: 8px 12px;
          cursor: pointer;
          border-bottom: 1px solid var(--background-modifier-border);
          font-size: 13px;
        `;
        item.textContent = path;
        item.onmouseenter = () => { item.style.background = 'var(--background-secondary)'; };
        item.onmouseleave = () => { item.style.background = 'transparent'; };
        item.onclick = () => {
          inputEl.value = path;
          inputEl.dispatchEvent(new Event('input', { bubbles: true }));
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
        if (fileExtension && !file.path.endsWith(fileExtension)) continue;
        if (file.path.toLowerCase().includes(queryLower)) {
          suggestions.push(file.path);
          if (suggestions.length >= 10) break;
        }
      }

      showSuggestions(suggestions);
    };

    inputEl.addEventListener('input', (e) => searchFiles(e.target.value));
    inputEl.addEventListener('focus', (e) => { if (e.target.value) searchFiles(e.target.value); });
    inputEl.addEventListener('blur', () => setTimeout(hideSuggestions, 200));
    inputEl.addEventListener('keydown', (e) => { if (e.key === 'Escape') hideSuggestions(); });
  }

  display() {
    const { containerEl } = this;
    containerEl.empty();

    containerEl.createEl('h2', { text: '🌟 超越玩家系统设置' });

    containerEl.createEl('h3', { text: '👤 用户信息' });
    new Setting(containerEl)
      .setName('玩家名称')
      .setDesc('设置你的游戏名称，将显示在状态面板中')
      .addText(text => {
        const stats = this.plugin.dataStore.getStats();
        text.setPlaceholder('玩家')
          .setValue(stats.playerName || '玩家')
          .onChange(async (value) => {
            const stats = this.plugin.dataStore.getStats();
            stats.playerName = value || '玩家';
            await this.plugin.dataStore.save();
          });
        text.inputEl.style.width = '200px';
      });

    containerEl.createEl('h3', { text: '⚙️ 数据存储' });
    new Setting(containerEl)
      .setName('数据存储位置')
      .setDesc('账户信息存储文件路径（留空则自动检测日记文件夹）')
      .addText(text => {
        text.setPlaceholder(this.plugin.dataStore.autoDetectDataPath())
          .setValue(this.plugin.dataStore.config?.dataFilePath || '')
          .onChange(async (value) => {
            if (this.plugin.dataStore.config) {
              this.plugin.dataStore.config.dataFilePath = value;
              await this.plugin.dataStore.saveConfig();
            }
          });
        this.setupPathAutocomplete(text.inputEl, '.json');
      })
      .addButton(button => button
        .setButtonText('🔍 自动检测')
        .onClick(async () => {
          const detected = this.plugin.dataStore.autoDetectDataPath();
          if (this.plugin.dataStore.config) {
            this.plugin.dataStore.config.dataFilePath = detected;
            await this.plugin.dataStore.saveConfig();
          }
          new Notice(`✅ 已检测到: ${detected}`);
          this.display();
        }));

    containerEl.createEl('h3', { text: '📝 日记模板' });
    new Setting(containerEl)
      .setName('模板文件位置')
      .setDesc('日记模板文件的路径（留空则自动检测日记模板）')
      .addText(text => {
        text.setPlaceholder(this.plugin.dataStore.autoDetectTemplatePath())
          .setValue(this.plugin.dataStore.config?.templatePath || '')
          .onChange(async (value) => {
            if (this.plugin.dataStore.config) {
              this.plugin.dataStore.config.templatePath = value;
              await this.plugin.dataStore.saveConfig();
            }
          });
        this.setupPathAutocomplete(text.inputEl, '.md');
      })
      .addButton(button => button
        .setButtonText('🔍 自动检测')
        .onClick(async () => {
          const detected = this.plugin.dataStore.autoDetectTemplatePath();
          if (this.plugin.dataStore.config) {
            this.plugin.dataStore.config.templatePath = detected;
            await this.plugin.dataStore.saveConfig();
          }
          new Notice(`✅ 已检测到: ${detected}`);
          this.display();
        }));

    new Setting(containerEl)
      .setName('更新日记模板')
      .setDesc('根据当前每日任务配置更新日记模板文件')
      .addButton(button => button.setButtonText('📝 更新模板').onClick(() => this.updateDailyTemplate()));

    new Setting(containerEl)
      .setName('🔓 解锁编辑功能')
      .setDesc('需要连续点击42次按钮才能解锁编辑功能，解锁后30分钟自动上锁')
      .addButton(button => {
        button.setButtonText(this.plugin.lockState.unlocked ? '🔓 已解锁' : '🔒 点击解锁');
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

      if (timeSinceUnlock < 15000) {
        const remainingSeconds = Math.ceil((15000 - timeSinceUnlock) / 1000);
        new Notice(`⏳ 请等待 ${remainingSeconds} 秒后才能上锁`);
        return;
      }

      if (this.plugin.lockState.lastLockAttempt && now - this.plugin.lockState.lastLockAttempt < 15000) {
        this.plugin.lockState.lockConfirmCount = (this.plugin.lockState.lockConfirmCount || 0) + 1;
        const remaining = 3 - this.plugin.lockState.lockConfirmCount;
        if (remaining > 0) {
          button.setButtonText(`🔒 确认上锁? (${remaining}次)`);
          return;
        }
      } else {
        this.plugin.lockState.lockConfirmCount = 1;
        this.plugin.lockState.lastLockAttempt = now;
        button.setButtonText('🔒 确认上锁? (2次)');
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
      button.setButtonText('🔒 点击解锁');
      new Notice('🔒 编辑功能已上锁');
      this.display();
      return;
    }

    this.plugin.lockState.clickCount++;
    const remaining = 42 - this.plugin.lockState.clickCount;

    if (remaining <= 0) {
      this.plugin.lockState.unlocked = true;
      this.plugin.lockState.unlockTime = Date.now();
      this.plugin.lockState.lockConfirmCount = 0;
      button.setButtonText('🔓 已解锁');
      new Notice('🔓 编辑功能已解锁！30分钟后自动上锁');

      this.plugin.lockState.autoLockTimer = setTimeout(() => {
        this.plugin.lockState.unlocked = false;
        this.plugin.lockState.clickCount = 0;
        new Notice('🔒 编辑功能已自动上锁');
        this.display();
      }, 30 * 60 * 1000);

      this.display();
    } else {
      button.setButtonText(`🔒 还需点击 ${remaining} 次`);
    }
  }

  addUnlockedSettings(containerEl) {
    containerEl.createEl('h3', { text: '⚙ 每日任务配置' });

    new Setting(containerEl)
      .setName('配置每日任务')
      .setDesc('配置每日任务、习惯、额外任务和番茄钟的数量与积分')
      .addButton(button => button.setButtonText('⚙️ 配置').onClick(() => this.showDailyTasksConfigModal()));

    containerEl.createEl('h3', { text: '🌟 完美打卡配置' });

    new Setting(containerEl)
      .setName('配置完美打卡奖励')
      .setDesc('设置完美打卡的奖励物品和祝福语')
      .addButton(button => button.setButtonText('⚙️ 配置').onClick(() => this.showPerfectCheckInConfigModal()));

    containerEl.createEl('h3', { text: '📦 商品管理' });

    new Setting(containerEl)
      .setName('添加商品')
      .setDesc('添加新的自定义商品到商城')
      .addButton(button => button.setButtonText('➕ 添加').onClick(() => this.showAddItemModal()));

    new Setting(containerEl)
      .setName('编辑商品')
      .setDesc('编辑已有的自定义商品')
      .addButton(button => button.setButtonText('✏️ 编辑').onClick(() => this.showEditItemModal()));

    new Setting(containerEl)
      .setName('删除商品')
      .setDesc('删除自定义商品')
      .addButton(button => button.setButtonText('🗑️ 删除').onClick(() => this.showDeleteItemModal()));

    new Setting(containerEl)
      .setName('导出商品配置')
      .setDesc('导出自定义商品配置为JSON文件')
      .addButton(button => button.setButtonText('📤 导出').onClick(() => this.exportShopConfig()));

    new Setting(containerEl)
      .setName('导入商品配置')
      .setDesc('从JSON文件导入商品配置')
      .addButton(button => button.setButtonText('📥 导入').onClick(() => this.importShopConfig()));

    containerEl.createEl('h3', { text: '📊 等级管理' });

    new Setting(containerEl)
      .setName('编辑等级称号')
      .setDesc('编辑各等级的称号、能力和阶段')
      .addButton(button => button.setButtonText('✏️ 编辑').onClick(() => this.showEditLevelsModal()));

    new Setting(containerEl)
      .setName('添加新等级')
      .setDesc('添加新的等级配置')
      .addButton(button => button.setButtonText('➕ 添加').onClick(() => this.showAddLevelModal()));

    containerEl.createEl('h3', { text: '💰 货币管理' });

    new Setting(containerEl)
      .setName('管理货币')
      .setDesc('查看和管理所有货币类型')
      .addButton(button => button.setButtonText('💰 管理').onClick(() => this.showManageCurrenciesModal()));

    containerEl.createEl('h3', { text: '📤 数据导入导出' });

    new Setting(containerEl)
      .setName('导出数据')
      .setDesc('导出所有账户数据为JSON文件')
      .addButton(button => button.setButtonText('📤 导出').onClick(async () => {
        const data = await this.plugin.dataStore.exportData();
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'supreme-player-backup-' + new Date().toISOString().split('T')[0] + '.json';
        a.click();
        URL.revokeObjectURL(url);
        new Notice('✅ 数据已导出！');
      }));

    new Setting(containerEl)
      .setName('导入数据')
      .setDesc('从JSON文件导入账户数据')
      .addButton(button => button.setButtonText('📥 导入').onClick(() => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = async (e) => {
          const file = e.target.files[0];
          if (file) {
            const reader = new FileReader();
            reader.onload = async (e) => {
              const result = await this.plugin.dataStore.importData(e.target.result);
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
    const config = this.plugin.dataStore.config || this.plugin.dataStore.getDefaultConfig();
    const dailyTasks = config.dailyTasks || {
      mainTasks: { count: 3, pointsPerTask: 100 },
      habits: { items: [] },
      extraTasks: { count: 2, pointsPerTask: 50 },
      pomodoro: { count: 6, pointsPerPomodoro: 50 }
    };

    const modal = new Modal(this.app);
    modal.titleEl.setText('📋 每日任务配置');

    const content = document.createElement('div');
    content.style.padding = '20px';
    content.style.maxHeight = '70vh';
    content.style.overflowY = 'auto';

    content.innerHTML = `
      <div style="background: var(--background-secondary); padding: 15px; border-radius: 8px; margin-bottom: 20px;">
        <div style="font-weight: bold; margin-bottom: 10px; color: #ffaa00;">★ 每日三件事</div>
        <div style="display: flex; gap: 10px; margin-bottom: 10px;">
          <div style="flex: 1;">
            <div style="font-size: 12px; color: #888; margin-bottom: 5px;">任务数量</div>
            <input type="number" id="main-count" value="${dailyTasks.mainTasks?.count || 3}" min="1" max="10" style="width: 100%;">
          </div>
          <div style="flex: 1;">
            <div style="font-size: 12px; color: #888; margin-bottom: 5px;">每任务积分</div>
            <input type="number" id="main-points" value="${dailyTasks.mainTasks?.pointsPerTask || 100}" min="1" style="width: 100%;">
          </div>
        </div>
      </div>

      <div style="background: var(--background-secondary); padding: 15px; border-radius: 8px; margin-bottom: 20px;">
        <div style="font-weight: bold; margin-bottom: 10px; color: #00aaff;">● 习惯打卡</div>
        <div id="habits-container" style="margin-bottom: 10px;"></div>
        <button id="add-habit-btn" style="width: 100%; padding: 8px; background: var(--interactive-accent); color: white; border: none; border-radius: 5px; cursor: pointer;">➕ 添加习惯</button>
      </div>

      <div style="background: var(--background-secondary); padding: 15px; border-radius: 8px; margin-bottom: 20px;">
        <div style="font-weight: bold; margin-bottom: 10px; color: #9966ff;">● 额外任务</div>
        <div style="display: flex; gap: 10px; margin-bottom: 10px;">
          <div style="flex: 1;">
            <div style="font-size: 12px; color: #888; margin-bottom: 5px;">计分数量</div>
            <input type="number" id="extra-count" value="${dailyTasks.extraTasks?.count || 2}" min="1" max="10" style="width: 100%;">
          </div>
          <div style="flex: 1;">
            <div style="font-size: 12px; color: #888; margin-bottom: 5px;">每任务积分</div>
            <input type="number" id="extra-points" value="${dailyTasks.extraTasks?.pointsPerTask || 50}" min="1" style="width: 100%;">
          </div>
        </div>
        <div id="extra-max-display" style="font-size: 12px; color: #888;">最大积分：<span id="extra-max-value">${(dailyTasks.extraTasks?.count || 2) * (dailyTasks.extraTasks?.pointsPerTask || 50)}</span></div>
      </div>

      <div style="background: var(--background-secondary); padding: 15px; border-radius: 8px; margin-bottom: 20px;">
        <div style="font-weight: bold; margin-bottom: 10px; color: #ff6666;">⏰ 专注番茄钟</div>
        <div style="display: flex; gap: 10px; margin-bottom: 10px;">
          <div style="flex: 1;">
            <div style="font-size: 12px; color: #888; margin-bottom: 5px;">番茄钟数量</div>
            <input type="number" id="pomodoro-count" value="${dailyTasks.pomodoro?.count || 6}" min="1" max="12" style="width: 100%;">
          </div>
          <div style="flex: 1;">
            <div style="font-size: 12px; color: #888; margin-bottom: 5px;">每个积分</div>
            <input type="number" id="pomodoro-points" value="${dailyTasks.pomodoro?.pointsPerPomodoro || 50}" min="1" style="width: 100%;">
          </div>
        </div>
        <div id="pomodoro-max-display" style="font-size: 12px; color: #888;">最大积分：<span id="pomodoro-max-value">${(dailyTasks.pomodoro?.count || 6) * (dailyTasks.pomodoro?.pointsPerPomodoro || 50)}</span></div>
      </div>
    `;

    const habitsContainer = content.querySelector('#habits-container');
    const habits = dailyTasks.habits?.items || [];

    const renderHabits = () => {
      habitsContainer.innerHTML = '';
      habits.forEach((habit, index) => {
        const habitDiv = document.createElement('div');
        habitDiv.style.cssText = 'display: flex; gap: 10px; margin-bottom: 8px; align-items: center;';
        habitDiv.innerHTML = `
          <input type="text" value="${habit.name}" placeholder="习惯名称" class="habit-name" data-index="${index}" style="flex: 1;">
          <input type="number" value="${habit.points}" placeholder="积分" class="habit-points" data-index="${index}" style="width: 80px;">
          <button class="remove-habit-btn" data-index="${index}" style="background: #ff6666; color: white; border: none; border-radius: 3px; padding: 5px 10px; cursor: pointer;">✕</button>
        `;
        habitsContainer.appendChild(habitDiv);
      });

      habitsContainer.querySelectorAll('.remove-habit-btn').forEach(btn => {
        btn.onclick = (e) => {
          const idx = parseInt(e.target.dataset.index);
          habits.splice(idx, 1);
          renderHabits();
        };
      });

      habitsContainer.querySelectorAll('.habit-name').forEach(input => {
        input.onchange = (e) => {
          habits[parseInt(e.target.dataset.index)].name = e.target.value;
        };
      });

      habitsContainer.querySelectorAll('.habit-points').forEach(input => {
        input.onchange = (e) => {
          habits[parseInt(e.target.dataset.index)].points = parseInt(e.target.value) || 10;
        };
      });
    };

    renderHabits();

    content.querySelector('#add-habit-btn').onclick = () => {
      habits.push({ name: '新习惯', points: 10 });
      renderHabits();
    };

    const extraCountInput = content.querySelector('#extra-count');
    const extraPointsInput = content.querySelector('#extra-points');
    const extraMaxValue = content.querySelector('#extra-max-value');

    const updateExtraMax = () => {
      const count = parseInt(extraCountInput.value) || 2;
      const points = parseInt(extraPointsInput.value) || 20;
      extraMaxValue.textContent = count * points;
    };

    extraCountInput.oninput = updateExtraMax;
    extraPointsInput.oninput = updateExtraMax;

    const pomodoroCountInput = content.querySelector('#pomodoro-count');
    const pomodoroPointsInput = content.querySelector('#pomodoro-points');
    const pomodoroMaxValue = content.querySelector('#pomodoro-max-value');

    const updatePomodoroMax = () => {
      const count = parseInt(pomodoroCountInput.value) || 6;
      const points = parseInt(pomodoroPointsInput.value) || 50;
      pomodoroMaxValue.textContent = count * points;
    };

    pomodoroCountInput.oninput = updatePomodoroMax;
    pomodoroPointsInput.oninput = updatePomodoroMax;

    const buttonContainer = document.createElement('div');
    buttonContainer.style.display = 'flex';
    buttonContainer.style.gap = '10px';
    buttonContainer.style.marginTop = '20px';

    const confirmBtn = document.createElement('button');
    confirmBtn.textContent = '💾 保存配置';
    confirmBtn.className = 'mod-cta';
    confirmBtn.style.flex = '1';
    confirmBtn.onclick = async () => {
      if (!this.plugin.dataStore.config) this.plugin.dataStore.config = this.plugin.dataStore.getDefaultConfig();

      const extraCount = parseInt(extraCountInput.value) || 2;
      const extraPoints = parseInt(extraPointsInput.value) || 20;
      const pomodoroCount = parseInt(pomodoroCountInput.value) || 6;
      const pomodoroPoints = parseInt(pomodoroPointsInput.value) || 50;

      this.plugin.dataStore.config.dailyTasks = {
        mainTasks: {
          count: parseInt(content.querySelector('#main-count').value) || 3,
          pointsPerTask: parseInt(content.querySelector('#main-points').value) || 50
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
      new Notice('✅ 每日任务配置已保存！');
      modal.close();
    };

    const cancelBtn = document.createElement('button');
    cancelBtn.textContent = '取消';
    cancelBtn.style.flex = '1';
    cancelBtn.onclick = () => modal.close();

    buttonContainer.appendChild(confirmBtn);
    buttonContainer.appendChild(cancelBtn);
    content.appendChild(buttonContainer);

    modal.contentEl.appendChild(content);
    modal.open();
  }

  showPerfectCheckInConfigModal() {
    const config = this.plugin.dataStore.config || this.plugin.dataStore.getDefaultConfig();
    const perfectReward = config.perfectCheckInReward || {
      enabled: true,
      rewardType: 'shop',
      shopItemId: null,
      exclusiveItem: {
        name: '超级大钻石',
        icon: '💎',
        description: '完美打卡奖励，使用后获得好运Buff',
        rarity: 'legendary',
        effect: { type: 'buff', buffName: '好运', buffDuration: 12 }
      },
      blessingTitle: '太棒了！今日任务全部完成！',
      blessingMessage: '每一次完美打卡，都是对自己最好的投资！'
    };

    const shopItems = this.plugin.dataStore.getShopItems() || [];
    const shopOptions = shopItems.map(item =>
      `<option value="${item.id}" ${perfectReward.shopItemId === item.id ? 'selected' : ''}>${item.icon} ${item.name}</option>`
    ).join('');

    const modal = new Modal(this.app);
    modal.titleEl.setText('🌟 完美打卡配置');

    const content = document.createElement('div');
    content.style.padding = '20px';
    content.style.maxHeight = '500px';
    content.style.overflowY = 'auto';

    content.innerHTML = `
      <div style="margin-bottom: 15px;">
        <div style="font-size: 12px; color: #888; margin-bottom: 5px;">奖励类型</div>
        <select id="reward-type" style="width: 100%;">
          <option value="shop" ${perfectReward.rewardType === 'shop' ? 'selected' : ''}>🎁 商城商品</option>
          <option value="exclusive" ${perfectReward.rewardType === 'exclusive' ? 'selected' : ''}>⭐ 特殊商品（仅完美打卡可获得）</option>
        </select>
      </div>

      <div id="shop-reward-section" style="${perfectReward.rewardType === 'shop' ? '' : 'display: none;'}">
        <div style="font-size: 12px; color: #888; margin-bottom: 5px;">选择商城商品</div>
        <select id="shop-item-select" style="width: 100%;">
          <option value="">-- 请选择商品 --</option>
          ${shopOptions}
        </select>
      </div>

      <div id="exclusive-reward-section" style="${perfectReward.rewardType === 'exclusive' ? '' : 'display: none;'}">
        <div style="background: var(--background-secondary); padding: 15px; border-radius: 8px; margin-bottom: 15px;">
          <div style="font-weight: bold; margin-bottom: 10px; color: #ffd700;">⭐ 特殊商品配置</div>
          <div style="font-size: 11px; color: #888; margin-bottom: 10px;">此类商品只能在完美打卡时获得，无法在商城购买</div>
          <div style="margin-bottom: 10px;">
            <div style="font-size: 12px; color: #888; margin-bottom: 5px;">商品名称</div>
            <input type="text" id="exclusive-name" value="${perfectReward.exclusiveItem?.name || '超级大钻石'}" style="width: 100%;">
          </div>
          <div style="margin-bottom: 10px;">
            <div style="font-size: 12px; color: #888; margin-bottom: 5px;">商品图标</div>
            <input type="text" id="exclusive-icon" value="${perfectReward.exclusiveItem?.icon || '💎'}" style="width: 100%;">
          </div>
          <div style="margin-bottom: 10px;">
            <div style="font-size: 12px; color: #888; margin-bottom: 5px;">商品描述</div>
            <input type="text" id="exclusive-desc" value="${perfectReward.exclusiveItem?.description || '完美打卡奖励'}" style="width: 100%;">
          </div>
          <div style="margin-bottom: 10px;">
            <div style="font-size: 12px; color: #888; margin-bottom: 5px;">稀有度</div>
            <select id="exclusive-rarity" style="width: 100%;">
              <option value="rare" ${perfectReward.exclusiveItem?.rarity === 'rare' ? 'selected' : ''}>🎴 稀有</option>
              <option value="legendary" ${perfectReward.exclusiveItem?.rarity === 'legendary' ? 'selected' : ''}>🌠 传奇</option>
            </select>
          </div>
        </div>
      </div>

      <div style="background: var(--background-secondary); padding: 15px; border-radius: 8px; margin-bottom: 20px;">
        <div style="font-weight: bold; margin-bottom: 15px;">✨ 祝福语配置</div>
        <div style="margin-bottom: 10px;">
          <div style="font-size: 12px; color: #888; margin-bottom: 5px;">祝福标题</div>
          <input type="text" id="blessing-title" value="${perfectReward.blessingTitle || '太棒了！今日任务全部完成！'}" style="width: 100%;">
        </div>
        <div style="margin-bottom: 10px;">
          <div style="font-size: 12px; color: #888; margin-bottom: 5px;">祝福语</div>
          <textarea id="blessing-message" style="width: 100%; height: 60px;">${perfectReward.blessingMessage || '每一次完美打卡，都是对自己最好的投资！'}</textarea>
        </div>
      </div>

      <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 20px;">
        <input type="checkbox" id="reward-enabled" ${perfectReward.enabled !== false ? 'checked' : ''}>
        <label for="reward-enabled" style="font-size: 13px;">启用完美打卡奖励</label>
      </div>
    `;

    const rewardTypeSelect = content.querySelector('#reward-type');
    const shopRewardSection = content.querySelector('#shop-reward-section');
    const exclusiveRewardSection = content.querySelector('#exclusive-reward-section');

    rewardTypeSelect.onchange = () => {
      if (rewardTypeSelect.value === 'shop') {
        shopRewardSection.style.display = '';
        exclusiveRewardSection.style.display = 'none';
      } else {
        shopRewardSection.style.display = 'none';
        exclusiveRewardSection.style.display = '';
      }
    };

    const buttonContainer = document.createElement('div');
    buttonContainer.style.display = 'flex';
    buttonContainer.style.gap = '10px';

    const confirmBtn = document.createElement('button');
    confirmBtn.textContent = '💾 保存配置';
    confirmBtn.className = 'mod-cta';
    confirmBtn.style.flex = '1';
    confirmBtn.onclick = async () => {
      if (!this.plugin.dataStore.config) {
        this.plugin.dataStore.config = this.plugin.dataStore.getDefaultConfig();
      }

      const rewardType = content.querySelector('#reward-type').value;
      const exclusiveItem = {
        name: content.querySelector('#exclusive-name').value.trim() || '超级大钻石',
        icon: content.querySelector('#exclusive-icon').value.trim() || '💎',
        description: content.querySelector('#exclusive-desc').value.trim() || '完美打卡奖励',
        rarity: content.querySelector('#exclusive-rarity').value,
        effect: { type: 'buff', buffName: '好运', buffDuration: 12 }
      };

      this.plugin.dataStore.config.perfectCheckInReward = {
        enabled: content.querySelector('#reward-enabled').checked,
        rewardType: rewardType,
        shopItemId: rewardType === 'shop' ? content.querySelector('#shop-item-select').value : null,
        exclusiveItem: rewardType === 'exclusive' ? exclusiveItem : null,
        blessingTitle: content.querySelector('#blessing-title').value.trim() || '太棒了！',
        blessingMessage: content.querySelector('#blessing-message').value.trim() || '完美打卡！'
      };

      await this.plugin.dataStore.saveConfig();
      new Notice('✅ 完美打卡配置已保存！');
      modal.close();
    };

    const cancelBtn = document.createElement('button');
    cancelBtn.textContent = '取消';
    cancelBtn.style.flex = '1';
    cancelBtn.onclick = () => modal.close();

    buttonContainer.appendChild(confirmBtn);
    buttonContainer.appendChild(cancelBtn);
    content.appendChild(buttonContainer);

    modal.contentEl.appendChild(content);
    modal.open();
  }

  showAddItemModal() {
    const modal = new Modal(this.app);
    modal.titleEl.setText('➕ 添加商品');

    const content = document.createElement('div');
    content.style.padding = '20px';
    content.style.maxHeight = '70vh';
    content.style.overflowY = 'auto';

    content.innerHTML = `
      <div style="margin-bottom: 5px;">商品名称：</div>
      <input type="text" id="item-name" placeholder="例如：神秘福袋" style="width: 100%; margin-bottom: 15px;">
      <div style="margin-bottom: 5px;">商品描述：</div>
      <input type="text" id="item-desc" placeholder="商品效果或承诺描述" style="width: 100%; margin-bottom: 15px;">
      <div style="margin-bottom: 5px;">图标（emoji）：</div>
      <input type="text" id="item-icon" placeholder="例如：🎁" style="width: 100%; margin-bottom: 15px;">
      <div style="display: flex; gap: 10px; margin-bottom: 15px;">
        <div style="flex: 1;">
          <div style="margin-bottom: 5px;">价格：</div>
          <input type="number" id="item-price" placeholder="1" min="1" style="width: 100%;">
        </div>
        <div style="flex: 1;">
          <div style="margin-bottom: 5px;">品质：</div>
          <select id="item-rarity" style="width: 100%;">
            <option value="rare">🎴 稀有</option>
            <option value="legendary">🌠 传奇</option>
          </select>
        </div>
      </div>
      <div style="margin-bottom: 5px;">商品分类：</div>
      <select id="item-category" style="width: 100%; margin-bottom: 15px;">
        <option value="system">⚙️ 系统商品（自动生效）</option>
        <option value="external">📝 外部商品（需自行兑现）</option>
      </select>
      <div id="effect-config" style="background: var(--background-secondary); padding: 15px; border-radius: 8px; margin-bottom: 15px;">
        <div style="font-weight: bold; margin-bottom: 10px;">🎁 奖励效果配置</div>
        <div style="margin-bottom: 5px;">效果类型：</div>
        <select id="effect-type" style="width: 100%; margin-bottom: 15px;">
          <option value="add_wish_stars">⭐ 获得愿星</option>
          <option value="add_level">🌟 获得等级</option>
          <option value="buff">🔮 获得Buff效果</option>
          <option value="random_wish_stars">🎁 随机愿星</option>
          <option value="add_points">⚡ 获得积分</option>
        </select>
        <div id="effect-params"></div>
      </div>
    `;

    const effectParams = content.querySelector('#effect-params');
    const effectTypeSelect = content.querySelector('#effect-type');
    const categorySelect = content.querySelector('#item-category');
    const effectConfig = content.querySelector('#effect-config');

    const renderEffectParamsFn = () => renderEffectParams(effectTypeSelect.value, effectParams);

    const toggleEffectConfig = () => {
      const isExternal = categorySelect.value === 'external';
      effectConfig.style.display = isExternal ? 'none' : 'block';
    };

    effectTypeSelect.onchange = renderEffectParamsFn;
    categorySelect.onchange = toggleEffectConfig;
    renderEffectParamsFn();
    toggleEffectConfig();

    const buttonContainer = document.createElement('div');
    buttonContainer.style.display = 'flex';
    buttonContainer.style.gap = '10px';

    const confirmBtn = document.createElement('button');
    confirmBtn.textContent = '✅ 添加';
    confirmBtn.className = 'mod-cta';
    confirmBtn.style.flex = '1';
    confirmBtn.onclick = async () => {
      const name = document.getElementById('item-name').value.trim();
      if (!name) { new Notice('❌ 请输入商品名称'); return; }

      const category = document.getElementById('item-category').value;
      const effect = buildEffectFromForm(category, document.getElementById('effect-type').value);
      if (category === 'system' && effect === null && document.getElementById('effect-type').value === 'buff') return;

      const result = await this.plugin.dataStore.addShopItem(
        name,
        document.getElementById('item-desc').value.trim(),
        category,
        'consumable',
        parseInt(document.getElementById('item-price').value) || 1,
        document.getElementById('item-rarity').value,
        document.getElementById('item-icon').value.trim() || '📦',
        effect
      );
      new Notice(result.message);
      if (result.success) modal.close();
    };

    const cancelBtn = document.createElement('button');
    cancelBtn.textContent = '取消';
    cancelBtn.style.flex = '1';
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
      new Notice('📭 暂无商品可编辑');
      return;
    }

    const modal = new Modal(this.app);
    modal.titleEl.setText('✏️ 编辑商品');

    const content = document.createElement('div');
    content.style.padding = '20px';
    content.style.maxHeight = '500px';
    content.style.overflowY = 'auto';

    content.innerHTML = `
      <div style="margin-bottom: 5px;">选择商品：</div>
      <select id="item-select" style="width: 100%; margin-bottom: 15px;">
        ${allItems.map(item => `<option value="${item.id}">${item.icon} ${item.name}</option>`).join('')}
      </select>
      <div style="margin-bottom: 5px;">商品名称：</div>
      <input type="text" id="item-name" style="width: 100%; margin-bottom: 15px;">
      <div style="margin-bottom: 5px;">商品描述：</div>
      <input type="text" id="item-desc" style="width: 100%; margin-bottom: 15px;">
      <div style="margin-bottom: 5px;">图标：</div>
      <input type="text" id="item-icon" style="width: 100%; margin-bottom: 15px;">
      <div style="margin-bottom: 5px;">价格：</div>
      <input type="number" id="item-price" style="width: 100%; margin-bottom: 15px;">
      <div style="margin-bottom: 5px;">稀有度：</div>
      <select id="item-rarity" style="width: 100%; margin-bottom: 15px;">
        <option value="rare">🎴 稀有</option>
        <option value="legendary">🌠 传奇</option>
      </select>
      <div style="margin-bottom: 5px;">商品类型：</div>
      <select id="item-category" style="width: 100%; margin-bottom: 20px;">
        <option value="system">系统商品（自动生效）</option>
        <option value="external">外部商品（手动兑现）</option>
      </select>
      <div id="effect-section">
        <div style="font-weight: bold; margin-bottom: 10px;">🎁 奖励效果配置</div>
        <div style="margin-bottom: 5px;">效果类型：</div>
        <select id="effect-type" style="width: 100%; margin-bottom: 15px;">
          <option value="add_wish_stars">⭐ 获得愿星</option>
          <option value="add_level">🌟 获得等级</option>
          <option value="buff">🔮 获得Buff效果</option>
          <option value="random_wish_stars">🎁 随机愿星</option>
          <option value="add_points">⚡ 获得积分</option>
        </select>
        <div id="effect-params"></div>
      </div>
    `;

    modal.contentEl.appendChild(content);

    const itemSelect = content.querySelector('#item-select');
    const itemName = content.querySelector('#item-name');
    const itemDesc = content.querySelector('#item-desc');
    const itemIcon = content.querySelector('#item-icon');
    const itemPrice = content.querySelector('#item-price');
    const itemRarity = content.querySelector('#item-rarity');
    const itemCategory = content.querySelector('#item-category');
    const effectTypeSelect = content.querySelector('#effect-type');
    const effectSection = content.querySelector('#effect-section');
    const effectParams = content.querySelector('#effect-params');

    const renderEffectParamsFn = () => renderEffectParams(effectTypeSelect.value, effectParams);

    const loadItem = () => {
      const item = allItems.find(i => i.id === itemSelect.value);
      if (item) {
        itemName.value = item.name;
        itemDesc.value = item.description || '';
        itemIcon.value = item.icon;
        itemPrice.value = item.price;
        itemRarity.value = item.rarity || 'rare';
        itemCategory.value = item.category || 'system';
        
        const category = item.category || 'system';
        effectSection.style.display = category === 'external' ? 'none' : 'block';
        
        if (item.effect) {
          effectTypeSelect.value = item.effect.type;
          renderEffectParamsFn();
          if (item.effect.type === 'add_wish_stars' || item.effect.type === 'add_level' || item.effect.type === 'add_points') {
            const valueInput = effectParams.querySelector('#effect-value');
            if (valueInput) valueInput.value = item.effect.value || 1;
          } else if (item.effect.type === 'buff') {
            const buffName = effectParams.querySelector('#buff-name');
            const buffIcon = effectParams.querySelector('#buff-icon');
            const buffDesc = effectParams.querySelector('#buff-desc');
            const buffDuration = effectParams.querySelector('#buff-duration');
            if (buffName) buffName.value = item.effect.buffName || '';
            if (buffIcon) buffIcon.value = item.effect.buffIcon || '';
            if (buffDesc) buffDesc.value = item.effect.buffDesc || '';
            if (buffDuration) buffDuration.value = item.effect.duration || 24;
          } else if (item.effect.type === 'random_wish_stars') {
            const minInput = effectParams.querySelector('#effect-min');
            const maxInput = effectParams.querySelector('#effect-max');
            if (minInput) minInput.value = item.effect.min || 1;
            if (maxInput) maxInput.value = item.effect.max || 5;
          }
        }
      }
    };

    const toggleEffectConfig = () => {
      const isExternal = itemCategory.value === 'external';
      effectSection.style.display = isExternal ? 'none' : 'block';
    };

    effectTypeSelect.onchange = renderEffectParamsFn;
    itemCategory.onchange = toggleEffectConfig;
    itemSelect.onchange = loadItem;
    
    loadItem();

    const buttonContainer = document.createElement('div');
    buttonContainer.style.display = 'flex';
    buttonContainer.style.gap = '10px';

    const confirmBtn = document.createElement('button');
    confirmBtn.textContent = '💾 保存';
    confirmBtn.className = 'mod-cta';
    confirmBtn.style.flex = '1';
    confirmBtn.onclick = async () => {
      const category = itemCategory.value;
      const effect = buildEffectFromForm(category, effectTypeSelect.value);

      const result = await this.plugin.dataStore.updateShopItem(itemSelect.value, {
        name: itemName.value.trim(),
        description: itemDesc.value.trim(),
        icon: itemIcon.value.trim() || '📦',
        price: parseInt(itemPrice.value) || 1,
        rarity: itemRarity.value,
        category: category,
        effect: effect
      });
      new Notice(result.message);
      if (result.success) modal.close();
    };

    const cancelBtn = document.createElement('button');
    cancelBtn.textContent = '取消';
    cancelBtn.style.flex = '1';
    cancelBtn.onclick = () => modal.close();

    buttonContainer.appendChild(confirmBtn);
    buttonContainer.appendChild(cancelBtn);
    content.appendChild(buttonContainer);

    modal.open();
  }

  showDeleteItemModal() {
    const allItems = this.plugin.dataStore.getShopItems();

    if (allItems.length === 0) {
      new Notice('📭 暂无商品可删除');
      return;
    }

    const modal = new Modal(this.app);
    modal.titleEl.setText('🗑️ 删除商品');

    const content = document.createElement('div');
    content.style.padding = '20px';

    content.innerHTML = `
      <div style="margin-bottom: 5px;">选择要删除的商品：</div>
      <select id="item-select" style="width: 100%; margin-bottom: 20px;">
        ${allItems.map(item => `<option value="${item.id}">${item.icon} ${item.name}</option>`).join('')}
      </select>
      <div style="color: #ff6666; font-size: 12px; margin-bottom: 15px;">⚠️ 删除后无法恢复，请谨慎操作</div>
    `;

    const buttonContainer = document.createElement('div');
    buttonContainer.style.display = 'flex';
    buttonContainer.style.gap = '10px';

    const confirmBtn = document.createElement('button');
    confirmBtn.textContent = '🗑️ 删除';
    confirmBtn.style.cssText = 'background-color: #ff6666; color: white; flex: 1;';
    confirmBtn.onclick = async () => {
      const result = await this.plugin.dataStore.deleteShopItem(document.getElementById('item-select').value);
      new Notice(result.message);
      if (result.success) modal.close();
    };

    const cancelBtn = document.createElement('button');
    cancelBtn.textContent = '取消';
    cancelBtn.style.flex = '1';
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
    modal.titleEl.setText('📊 编辑等级称号');

    const content = document.createElement('div');
    content.style.padding = '20px';

    const levelList = document.createElement('div');
    levelList.style.cssText = 'max-height: 400px; overflow-y: auto;';

    levels.forEach((levelConfig, index) => {
      const levelDiv = document.createElement('div');
      levelDiv.style.cssText = `padding: 15px; margin-bottom: 10px; border: 1px solid var(--border-color); border-radius: 8px; border-left: 4px solid ${levelConfig.color || '#ffffff'}; cursor: pointer;`;
      levelDiv.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
          <div style="font-weight: bold; font-size: 16px;">${levelConfig.title}</div>
          <div style="color: #888; font-size: 12px;">Lv.${levelConfig.minLevel} - ${levelConfig.maxLevel === 999 ? '∞' : levelConfig.maxLevel}</div>
        </div>
        <div style="color: #666; font-size: 12px;">能力：${levelConfig.ability}</div>
        <div style="color: #666; font-size: 12px;">阶段：${levelConfig.phase}</div>
      `;
      levelDiv.onclick = () => this.showEditLevelDetailModal(index, levelConfig);
      levelList.appendChild(levelDiv);
    });

    content.appendChild(levelList);

    const closeBtn = document.createElement('button');
    closeBtn.textContent = '关闭';
    closeBtn.style.width = '100%';
    closeBtn.style.marginTop = '10px';
    closeBtn.onclick = () => modal.close();
    content.appendChild(closeBtn);

    modal.contentEl.appendChild(content);
    modal.open();
  }

  showEditLevelDetailModal(index, levelConfig) {
    const modal = new Modal(this.app);
    modal.titleEl.setText('✏️ 编辑等级：' + levelConfig.title);

    const content = document.createElement('div');
    content.style.padding = '20px';

    content.innerHTML = `
      <div style="margin-bottom: 5px;">称号：</div>
      <input type="text" id="level-title" value="${levelConfig.title}" style="width: 100%; margin-bottom: 15px;">
      <div style="margin-bottom: 5px;">能力：</div>
      <input type="text" id="level-ability" value="${levelConfig.ability}" style="width: 100%; margin-bottom: 15px;">
      <div style="margin-bottom: 5px;">能力图标：</div>
      <input type="text" id="level-ability-icon" value="${levelConfig.abilityIcon || '⚔️'}" style="width: 100%; margin-bottom: 15px;" placeholder="⚔️">
      <div style="margin-bottom: 5px;">阶段：</div>
      <input type="text" id="level-phase" value="${levelConfig.phase}" style="width: 100%; margin-bottom: 15px;">
      <div style="margin-bottom: 5px;">阶段图标：</div>
      <input type="text" id="level-phase-icon" value="${levelConfig.phaseIcon || '👑'}" style="width: 100%; margin-bottom: 15px;" placeholder="👑">
      <div style="margin-bottom: 5px;">颜色（十六进制）：</div>
      <input type="text" id="level-color" value="${levelConfig.color || '#ffffff'}" style="width: 100%; margin-bottom: 15px;">
      <div style="margin-bottom: 5px;">最小等级：</div>
      <input type="number" id="level-min" value="${levelConfig.minLevel}" style="width: 100%; margin-bottom: 15px;">
      <div style="margin-bottom: 5px;">最大等级：</div>
      <input type="number" id="level-max" value="${levelConfig.maxLevel}" style="width: 100%; margin-bottom: 20px;">
      <div id="delete-section" style="margin-top: 20px; padding-top: 15px; border-top: 1px solid var(--background-modifier-border);"></div>
    `;

    modal.contentEl.appendChild(content);

    const titleInput = content.querySelector('#level-title');
    const abilityInput = content.querySelector('#level-ability');
    const abilityIconInput = content.querySelector('#level-ability-icon');
    const phaseInput = content.querySelector('#level-phase');
    const phaseIconInput = content.querySelector('#level-phase-icon');
    const colorInput = content.querySelector('#level-color');
    const minInput = content.querySelector('#level-min');
    const maxInput = content.querySelector('#level-max');
    const deleteSection = content.querySelector('#delete-section');

    let deleteConfirmCount = 0;
    let deleteConfirmTimer = null;

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = '🗑️ 删除此等级';
    deleteBtn.style.width = '100%';
    deleteBtn.style.background = '#ff6666';
    deleteBtn.style.color = 'white';
    deleteBtn.style.border = 'none';
    deleteBtn.style.padding = '10px';
    deleteBtn.style.borderRadius = '5px';
    deleteBtn.style.cursor = 'pointer';

    const resetDeleteButton = () => {
      deleteConfirmCount = 0;
      deleteBtn.textContent = '🗑️ 删除此等级';
      deleteBtn.style.background = '#ff6666';
    };

    deleteBtn.onclick = () => {
      deleteConfirmCount++;
      if (deleteConfirmCount === 1) {
        deleteBtn.textContent = '⚠️ 确定删除？再点2次';
        deleteBtn.style.background = '#ff4444';
        deleteConfirmTimer = setTimeout(resetDeleteButton, 3000);
      } else if (deleteConfirmCount === 2) {
        if (deleteConfirmTimer) clearTimeout(deleteConfirmTimer);
        deleteBtn.textContent = '⚠️ 再次确认！再点1次';
        deleteBtn.style.background = '#cc0000';
        deleteConfirmTimer = setTimeout(resetDeleteButton, 3000);
      } else if (deleteConfirmCount >= 3) {
        if (deleteConfirmTimer) clearTimeout(deleteConfirmTimer);
        this.plugin.dataStore.deleteLevelConfig(index).then(result => {
          new Notice(result.message);
          if (result.success) {
            modal.close();
            this.showEditLevelsModal();
          }
        });
      }
    };

    deleteSection.appendChild(deleteBtn);

    const buttonContainer = document.createElement('div');
    buttonContainer.style.display = 'flex';
    buttonContainer.style.gap = '10px';
    buttonContainer.style.marginTop = '15px';

    const confirmBtn = document.createElement('button');
    confirmBtn.textContent = '💾 保存';
    confirmBtn.className = 'mod-cta';
    confirmBtn.style.flex = '1';
    confirmBtn.onclick = async () => {
      const result = await this.plugin.dataStore.updateLevelConfig(index, {
        title: titleInput.value.trim(),
        ability: abilityInput.value.trim(),
        abilityIcon: abilityIconInput.value.trim() || '⚔️',
        phase: phaseInput.value.trim(),
        phaseIcon: phaseIconInput.value.trim() || '👑',
        color: colorInput.value.trim(),
        minLevel: parseInt(minInput.value) || 0,
        maxLevel: parseInt(maxInput.value) || 999
      });
      new Notice(result.message);
      if (result.success) modal.close();
    };

    const cancelBtn = document.createElement('button');
    cancelBtn.textContent = '取消';
    cancelBtn.style.flex = '1';
    cancelBtn.onclick = () => modal.close();

    buttonContainer.appendChild(confirmBtn);
    buttonContainer.appendChild(cancelBtn);
    content.appendChild(buttonContainer);

    modal.open();
  }

  showAddLevelModal() {
    const modal = new Modal(this.app);
    modal.titleEl.setText('➕ 添加新等级');

    const content = document.createElement('div');
    content.style.padding = '20px';

    content.innerHTML = `
      <div style="margin-bottom: 5px;">称号：</div>
      <input type="text" id="level-title" placeholder="例如：星辰使者" style="width: 100%; margin-bottom: 15px;">
      <div style="margin-bottom: 5px;">能力：</div>
      <input type="text" id="level-ability" placeholder="例如：星河指引-导航" style="width: 100%; margin-bottom: 15px;">
      <div style="margin-bottom: 5px;">能力图标：</div>
      <input type="text" id="level-ability-icon" placeholder="⚔️" style="width: 100%; margin-bottom: 15px;">
      <div style="margin-bottom: 5px;">阶段：</div>
      <input type="text" id="level-phase" placeholder="例如：星使" style="width: 100%; margin-bottom: 15px;">
      <div style="margin-bottom: 5px;">阶段图标：</div>
      <input type="text" id="level-phase-icon" placeholder="👑" style="width: 100%; margin-bottom: 15px;">
      <div style="margin-bottom: 5px;">颜色：</div>
      <input type="text" id="level-color" placeholder="#ffffff" style="width: 100%; margin-bottom: 15px;">
      <div style="margin-bottom: 5px;">最小等级：</div>
      <input type="number" id="level-min" placeholder="0" style="width: 100%; margin-bottom: 15px;">
      <div style="margin-bottom: 5px;">最大等级：</div>
      <input type="number" id="level-max" placeholder="999" style="width: 100%; margin-bottom: 20px;">
    `;

    modal.contentEl.appendChild(content);

    const buttonContainer = document.createElement('div');
    buttonContainer.style.display = 'flex';
    buttonContainer.style.gap = '10px';

    const confirmBtn = document.createElement('button');
    confirmBtn.textContent = '✅ 添加';
    confirmBtn.className = 'mod-cta';
    confirmBtn.style.flex = '1';
    confirmBtn.onclick = async () => {
      const title = content.querySelector('#level-title').value.trim();
      if (!title) { new Notice('❌ 请输入称号'); return; }
      const result = await this.plugin.dataStore.addLevelConfig({
        minLevel: parseInt(content.querySelector('#level-min').value) || 0,
        maxLevel: parseInt(content.querySelector('#level-max').value) || 999,
        title: title,
        ability: content.querySelector('#level-ability').value.trim(),
        abilityIcon: content.querySelector('#level-ability-icon').value.trim() || '⚔️',
        phase: content.querySelector('#level-phase').value.trim(),
        phaseIcon: content.querySelector('#level-phase-icon').value.trim() || '👑',
        color: content.querySelector('#level-color').value.trim() || '#ffffff'
      });
      new Notice(result.message);
      if (result.success) modal.close();
    };

    const cancelBtn = document.createElement('button');
    cancelBtn.textContent = '取消';
    cancelBtn.style.flex = '1';
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
    modal.titleEl.setText('💰 管理货币');

    const content = document.createElement('div');
    content.style.padding = '20px';

    const currencyList = document.createElement('div');
    currencyList.style.cssText = 'max-height: 400px; overflow-y: auto;';

    currencies.forEach(currency => {
      const stats = this.plugin.dataStore.getStats();
      const currentAmount = stats[currency.id] || 0;

      const currencyDiv = document.createElement('div');
      currencyDiv.style.cssText = `padding: 15px; margin-bottom: 10px; border: 1px solid var(--border-color); border-radius: 8px; border-left: 4px solid ${currency.color || '#ffffff'};`;
      if (currency.editable) currencyDiv.style.cursor = 'pointer';

      currencyDiv.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div><span style="font-size: 20px; margin-right: 10px;">${currency.icon}</span><strong>${currency.name}</strong>${currency.editable ? '<span style="color: #888; font-size: 10px; margin-left: 5px;">可编辑</span>' : ''}</div>
          <div style="text-align: right;"><div style="font-weight: bold;">${currentAmount}</div><div style="color: #888; font-size: 10px;">每${currency.earnRate}积分+${currency.earnAmount}</div></div>
        </div>
        <div style="color: #666; font-size: 12px; margin-top: 5px;">${currency.description}</div>
      `;

      if (currency.editable) currencyDiv.onclick = () => this.showEditCurrencyModal(currency);
      currencyList.appendChild(currencyDiv);
    });

    content.appendChild(currencyList);

    const addBtn = document.createElement('button');
    addBtn.textContent = '➕ 添加新货币';
    addBtn.style.width = '100%';
    addBtn.style.marginTop = '10px';
    addBtn.onclick = () => this.showAddCurrencyModal();
    content.appendChild(addBtn);

    const closeBtn = document.createElement('button');
    closeBtn.textContent = '关闭';
    closeBtn.style.width = '100%';
    closeBtn.style.marginTop = '10px';
    closeBtn.onclick = () => modal.close();
    content.appendChild(closeBtn);

    modal.contentEl.appendChild(content);
    modal.open();
  }

  showEditCurrencyModal(currency) {
    const modal = new Modal(this.app);
    modal.titleEl.setText('✏️ 编辑货币：' + currency.name);

    const content = document.createElement('div');
    content.style.padding = '20px';

    content.innerHTML = `
      <div style="margin-bottom: 5px;">名称：</div>
      <input type="text" id="currency-name" value="${currency.name}" style="width: 100%; margin-bottom: 15px;">
      <div style="margin-bottom: 5px;">图标：</div>
      <input type="text" id="currency-icon" value="${currency.icon}" style="width: 100%; margin-bottom: 15px;">
      <div style="margin-bottom: 5px;">描述：</div>
      <input type="text" id="currency-desc" value="${currency.description}" style="width: 100%; margin-bottom: 15px;">
      <div style="margin-bottom: 5px;">获取间隔（积分）：</div>
      <input type="number" id="currency-rate" value="${currency.earnRate}" style="width: 100%; margin-bottom: 15px;">
      <div style="margin-bottom: 5px;">颜色：</div>
      <input type="text" id="currency-color" value="${currency.color || '#ffffff'}" style="width: 100%; margin-bottom: 20px;">
    `;

    const buttonContainer = document.createElement('div');
    buttonContainer.style.display = 'flex';
    buttonContainer.style.gap = '10px';

    const confirmBtn = document.createElement('button');
    confirmBtn.textContent = '💾 保存';
    confirmBtn.className = 'mod-cta';
    confirmBtn.style.flex = '1';
    confirmBtn.onclick = async () => {
      const result = await this.plugin.dataStore.updateCurrency(currency.id, {
        name: document.getElementById('currency-name').value.trim(),
        icon: document.getElementById('currency-icon').value.trim(),
        description: document.getElementById('currency-desc').value.trim(),
        earnRate: parseInt(document.getElementById('currency-rate').value) || 1000,
        color: document.getElementById('currency-color').value.trim()
      });
      new Notice(result.message);
      if (result.success) modal.close();
    };

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = '🗑️ 删除';
    deleteBtn.style.cssText = 'background-color: #ff6666; color: white; flex: 1;';
    deleteBtn.onclick = async () => {
      const result = await this.plugin.dataStore.deleteCurrency(currency.id);
      new Notice(result.message);
      if (result.success) modal.close();
    };

    const cancelBtn = document.createElement('button');
    cancelBtn.textContent = '取消';
    cancelBtn.style.flex = '1';
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
    modal.titleEl.setText('➕ 添加新货币');

    const content = document.createElement('div');
    content.style.padding = '20px';

    content.innerHTML = `
      <div style="margin-bottom: 5px;">名称：</div>
      <input type="text" id="currency-name" placeholder="例如：金币" style="width: 100%; margin-bottom: 15px;">
      <div style="margin-bottom: 5px;">图标：</div>
      <input type="text" id="currency-icon" placeholder="例如：🪙" style="width: 100%; margin-bottom: 15px;">
      <div style="margin-bottom: 5px;">描述：</div>
      <input type="text" id="currency-desc" placeholder="货币用途说明" style="width: 100%; margin-bottom: 15px;">
      <div style="margin-bottom: 5px;">获取间隔（每多少积分获得）：</div>
      <input type="number" id="currency-rate" placeholder="1000" style="width: 100%; margin-bottom: 15px;">
      <div style="margin-bottom: 5px;">颜色：</div>
      <input type="text" id="currency-color" placeholder="#00ff00" style="width: 100%; margin-bottom: 20px;">
      <div style="color: #666; font-size: 12px; margin-bottom: 15px;">💡 新货币会自动加入系统，打卡时根据积分自动获取</div>
    `;

    const buttonContainer = document.createElement('div');
    buttonContainer.style.display = 'flex';
    buttonContainer.style.gap = '10px';

    const confirmBtn = document.createElement('button');
    confirmBtn.textContent = '✅ 添加';
    confirmBtn.className = 'mod-cta';
    confirmBtn.style.flex = '1';
    confirmBtn.onclick = async () => {
      const name = document.getElementById('currency-name').value.trim();
      if (!name) { new Notice('❌ 请输入货币名称'); return; }
      const result = await this.plugin.dataStore.addCurrency(
        name,
        document.getElementById('currency-icon').value.trim() || '💎',
        document.getElementById('currency-desc').value.trim(),
        parseInt(document.getElementById('currency-rate').value) || 1000,
        document.getElementById('currency-color').value.trim() || '#00ff00'
      );
      new Notice(result.message);
      if (result.success) modal.close();
    };

    const cancelBtn = document.createElement('button');
    cancelBtn.textContent = '取消';
    cancelBtn.style.flex = '1';
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
      new Notice('📭 暂无商品可导出');
      return;
    }

    const exportData = {
      exportVersion: '1.0',
      exportedAt: new Date().toISOString(),
      items: items
    };

    const data = JSON.stringify(exportData, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'shop-config-' + new Date().toISOString().split('T')[0] + '.json';
    a.click();
    URL.revokeObjectURL(url);
    new Notice('✅ 商品配置已导出！');
  }

  importShopConfig() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = async (e) => {
          try {
            const data = JSON.parse(e.target.result);
            const items = data.items || data.customItems;
            if (!items || !Array.isArray(items)) {
              new Notice('❌ 无效的商品配置文件');
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
                  id: 'imported-' + Date.now().toString() + '-' + importCount
                };
                this.plugin.dataStore.shopConfig.items.push(newItem);
                importCount++;
              }
            }

            await this.plugin.dataStore.saveShopConfig();
            new Notice(`✅ 成功导入 ${importCount} 个商品！`);
          } catch (err) {
            new Notice('❌ 导入失败：' + err.message);
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  }

  async updateDailyTemplate() {
    if (!this.plugin.dataStore.config) {
      this.plugin.dataStore.config = this.plugin.dataStore.getDefaultConfig();
      await this.plugin.dataStore.saveConfig();
    }
    const config = this.plugin.dataStore.config;
    const dailyTasks = config.dailyTasks || {
      mainTasks: { count: 3, pointsPerTask: 100 },
      habits: { items: [{ name: '早起', points: 50 }, { name: '运动', points: 50 }, { name: '阅读', points: 50 }] },
      extraTasks: { count: 2, pointsPerTask: 50 },
      pomodoro: { count: 6, pointsPerPomodoro: 50 }
    };

    const mainTasks = dailyTasks.mainTasks || { count: 3, pointsPerTask: 100 };
    const habits = dailyTasks.habits?.items || [];
    const extraTasks = dailyTasks.extraTasks || { count: 2, pointsPerTask: 50 };
    const pomodoro = dailyTasks.pomodoro || { count: 6, pointsPerPomodoro: 50 };

    let mainTasksSection = '';
    for (let i = 1; i <= mainTasks.count; i++) {
      mainTasksSection += `- [ ] 任务${i} - ${mainTasks.pointsPerTask}\n`;
    }

    let habitsSection = '';
    for (const habit of habits) {
      const habitPoints = habit.points || 10;
      habitsSection += `- [ ] ${habit.name} - ${habitPoints}\n`;
    }

    let extraTasksSection = '';
    const extraCount = extraTasks.count || 2;
    for (let i = 1; i <= extraCount; i++) {
      extraTasksSection += `- [ ] 额外任务${String.fromCharCode(64 + i)} - ${extraTasks.pointsPerTask || 50}\n`;
    }

    let pomodoroSection = '';
    for (let i = 0; i < pomodoro.count; i++) {
      pomodoroSection += `- [ ] 完成 ⏱️\n`;
    }

    const templateContent = `---
date: {{date}}
weather:
mood:
---

> **📅 自律记录** | 执行打卡命令自动更新下方数据

---

★ **今日三件事**（优先完成，上限${mainTasks.count * mainTasks.pointsPerTask}）

${mainTasksSection}
---

● **习惯打卡**

${habitsSection}
---

● **额外任务**（完成最多${extraTasks.count}项，上限${extraTasks.count * extraTasks.pointsPerTask}）

${extraTasksSection}
---

⏰ **专注番茄钟**（每个${pomodoro.pointsPerPomodoro}积分，最多${pomodoro.count * pomodoro.pointsPerPomodoro}）

${pomodoroSection}
---



> ⚠️ 完成任务后，按 \`Ctrl+P\` 执行 **「每日打卡」**

---

### 📊 打卡记录（自动生成）

<!-- 以下内容由插件自动填充，请勿手动修改 -->

📊 今日积分：

💰 当前积分：
※愿星 \\*
※稀有道具卡 \\*
※传奇道具卡 \\*

⛲**许愿池**

当前愿望：

---

- {{date}} -
`;

    const adapter = this.app.vault.adapter;
    let templatePath = config.templatePath || this.plugin.dataStore.autoDetectTemplatePath();
    if (!templatePath.endsWith('.md')) {
      templatePath += '.md';
    }

    try {
      await adapter.write(templatePath, templateContent);
      new Notice('✅ 每日记录模板已更新！');
    } catch (e) {
      console.error('[Template] Error:', e);
      new Notice('❌ 更新模板失败：' + e.message);
    }
  }
}

module.exports = SupremePlayerSettingTab;
