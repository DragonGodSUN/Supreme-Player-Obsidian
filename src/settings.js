const { PluginSettingTab, Setting, Notice, Modal } = require('obsidian');
const Core = require('./core');
const { renderEffectParams, buildEffectFromForm } = require('./utils');

class SupremePlayerSettingTab extends PluginSettingTab {
  constructor(app, plugin) {
    super(app, plugin);
    this.plugin = plugin;
    this.t = (key, variables) => (this.plugin.t ? this.plugin.t(key, variables) : key);
  }

  getDefaultPlayerName() {
    return this.t('settings.defaultPlayerName');
  }

  getLocalizedText(value, fallback = '') {
    return this.plugin.dataStore?.getLocalizedText
      ? this.plugin.dataStore.getLocalizedText(value, fallback)
      : (value ?? fallback);
  }

  getPerfectRewardDefaults() {
    return this.plugin.dataStore?.getLocalizedPerfectRewardDefaults
      ? this.plugin.dataStore.getLocalizedPerfectRewardDefaults()
      : {
          name: this.t('datastore.reward.superDiamond.name'),
          description: this.t('datastore.reward.superDiamond.desc'),
          blessingTitle: this.t('datastore.reward.defaultBlessingTitle'),
          blessingMessage: this.t('datastore.reward.defaultBlessingMessage')
        };
  }

  ensureConfig() {
    if (!this.plugin.dataStore.config) {
      this.plugin.dataStore.config = this.plugin.dataStore.getDefaultConfig();
    }
    return this.plugin.dataStore.config;
  }

  createModalContent(modal, maxHeight = '70vh') {
    const content = document.createElement('div');
    content.style.padding = '20px';
    content.style.maxHeight = maxHeight;
    content.style.overflowY = 'auto';
    modal.contentEl.appendChild(content);
    return content;
  }

  createButtonRow() {
    const row = document.createElement('div');
    row.style.display = 'flex';
    row.style.gap = '10px';
    row.style.marginTop = '20px';
    return row;
  }

  createActionButton(text, onClick, className, style = '') {
    const button = document.createElement('button');
    button.textContent = text;
    if (className) button.className = className;
    if (style) button.style.cssText = style;
    button.onclick = onClick;
    return button;
  }

  getResolvedLanguageLabel() {
    const language = this.plugin.dataStore?.i18n?.getLanguage?.() || 'en';
    return language === 'zh' ? this.t('settings.languageZh') : this.t('settings.languageEn');
  }

  async renderDebugSection(containerEl) {
    const config = this.ensureConfig();
    const dailySettings = this.plugin.dataStore.getDailyNotesSettings?.() || null;
    const dataPath = config.dataFilePath || this.plugin.dataStore.autoDetectDataPath();
    const templatePath = config.templatePath || this.plugin.dataStore.autoDetectTemplatePath();
    const normalizedTemplatePath = templatePath.endsWith('.md') ? templatePath : `${templatePath}.md`;
    const todayNotePath = Core.getDailyNotePath(this.app);
    const todayNoteFile = await Core.findTodayNoteFile(this.app);
    const activeFile = this.app.workspace.getActiveFile?.();
    const adapter = this.app.vault.adapter;
    const dataExists = await adapter.exists(dataPath);
    const templateExists = await adapter.exists(normalizedTemplatePath);
    let parsedRecord = null;
    let parsedPoints = 0;

    if (todayNoteFile) {
      try {
        const noteContent = await this.app.vault.read(todayNoteFile);
        parsedRecord = this.plugin.parser.parseDailyNote(noteContent, todayNoteFile.basename);
        parsedPoints = this.plugin.parser.calculatePoints(parsedRecord);
      } catch (error) {
        console.error('[Debug] Failed to parse today note:', error);
      }
    }

    containerEl.createEl('h3', { text: this.t('settings.debugTitle') });
    new Setting(containerEl)
      .setName(this.t('settings.debugMode'))
      .setDesc(this.t('settings.debugModeDesc'))
      .addToggle(toggle => {
        toggle
          .setValue(Boolean(config.debugMode))
          .onChange(async value => {
            config.debugMode = value;
            await this.plugin.dataStore.saveConfig();
            this.display();
          });
      });

    if (!config.debugMode) {
      return;
    }

    const suggestions = [];
    if (!todayNoteFile) {
      suggestions.push(this.t('settings.debugSuggestionMissingToday'));
    }
    if (!templateExists) {
      suggestions.push(this.t('settings.debugSuggestionMissingTemplate'));
    }
    if (!dataExists) {
      suggestions.push(this.t('settings.debugSuggestionMissingData'));
    }
    if (!dailySettings) {
      suggestions.push(this.t('settings.debugSuggestionNoPlugin'));
    }
    if (!suggestions.length) {
      suggestions.push(this.t('settings.debugSuggestionHealthy'));
    }

    const panel = containerEl.createDiv();
    panel.style.cssText = 'background: var(--background-secondary); border: 1px solid var(--background-modifier-border); border-radius: 10px; padding: 14px 16px; margin: 10px 0 18px;';

    const title = panel.createDiv();
    title.style.cssText = 'font-weight: 700; margin-bottom: 10px;';
    title.textContent = this.t('settings.debugInfoTitle');

    const infoItems = [
      [this.t('settings.debugResolvedLanguage'), this.getResolvedLanguageLabel()],
      [this.t('settings.debugLanguageMode'), config.language || 'auto'],
      [this.t('settings.debugTodayNotePath'), todayNotePath],
      [this.t('settings.debugTodayNoteFound'), todayNoteFile ? todayNoteFile.path : this.t('common.none')],
      [this.t('settings.debugTemplatePath'), normalizedTemplatePath],
      [this.t('settings.debugTemplateExists'), templateExists ? this.t('common.enabled') : this.t('common.disabled')],
      [this.t('settings.debugDataPath'), dataPath],
      [this.t('settings.debugDataExists'), dataExists ? this.t('common.enabled') : this.t('common.disabled')],
      [this.t('settings.debugActiveFile'), activeFile?.path || this.t('common.none')],
      [this.t('settings.debugDailyFolder'), dailySettings?.folder || this.t('common.none')],
      [this.t('settings.debugDailyFormat'), dailySettings?.format || 'YYYY-MM-DD'],
      [this.t('settings.debugParsedMainTasks'), parsedRecord ? `${parsedRecord.mainTasks.filter(item => item.completed).length}/${parsedRecord.mainTasks.length}` : this.t('common.none')],
      [this.t('settings.debugParsedHabits'), parsedRecord ? `${parsedRecord.habits.filter(item => item.completed).length}/${parsedRecord.habits.length}` : this.t('common.none')],
      [this.t('settings.debugParsedExtraTasks'), parsedRecord ? `${parsedRecord.extraTasks.filter(item => item.completed).length}/${parsedRecord.extraTasks.length}` : this.t('common.none')],
      [this.t('settings.debugParsedPomodoros'), parsedRecord ? `${parsedRecord.pomodoros.filter(item => item.completed).length}/${parsedRecord.pomodoros.length}` : this.t('common.none')],
      [this.t('settings.debugParsedPoints'), parsedRecord ? parsedPoints : this.t('common.none')],
    ];

    infoItems.forEach(([label, value]) => {
      const row = panel.createDiv();
      row.style.cssText = 'display: grid; grid-template-columns: 140px 1fr; gap: 10px; margin-bottom: 6px; font-size: 12px; line-height: 1.6;';

      const labelEl = row.createDiv();
      labelEl.style.cssText = 'color: var(--text-muted);';
      labelEl.textContent = label;

      const valueEl = row.createDiv();
      valueEl.style.cssText = 'word-break: break-all;';
      valueEl.textContent = String(value);
    });

    const suggestionTitle = panel.createDiv();
    suggestionTitle.style.cssText = 'font-weight: 700; margin: 12px 0 8px;';
    suggestionTitle.textContent = this.t('settings.debugSuggestions');

    suggestions.forEach(text => {
      const item = panel.createDiv();
      item.style.cssText = 'font-size: 12px; line-height: 1.7; margin-bottom: 4px;';
      item.textContent = `• ${text}`;
    });
  }

  downloadJson(filename, payload) {
    const blob = new Blob([payload], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = filename;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  setupPathAutocomplete(inputEl, fileExtension) {
    let suggestionEl = null;

    const hideSuggestions = () => {
      if (suggestionEl) {
        suggestionEl.remove();
        suggestionEl = null;
      }
    };

    const showSuggestions = suggestions => {
      hideSuggestions();
      if (!suggestions.length) return;

      suggestionEl = document.createElement('div');
      suggestionEl.className = 'suggestion-container';
      suggestionEl.style.cssText = `
        position: absolute;
        background: var(--background-primary);
        border: 1px solid var(--background-modifier-border);
        border-radius: 4px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        max-height: 200px;
        overflow-y: auto;
        z-index: 10000;
        min-width: 300px;
      `;

      const inputRect = inputEl.getBoundingClientRect();
      suggestionEl.style.top = `${inputRect.bottom + window.scrollY}px`;
      suggestionEl.style.left = `${inputRect.left + window.scrollX}px`;

      suggestions.forEach(path => {
        const item = document.createElement('div');
        item.className = 'suggestion-item';
        item.style.cssText = `
          padding: 8px 12px;
          cursor: pointer;
          border-bottom: 1px solid var(--background-modifier-border);
          font-size: 13px;
        `;
        item.textContent = path;
        item.onmouseenter = () => {
          item.style.background = 'var(--background-secondary)';
        };
        item.onmouseleave = () => {
          item.style.background = 'transparent';
        };
        item.onclick = () => {
          inputEl.value = path;
          inputEl.dispatchEvent(new Event('input', { bubbles: true }));
          hideSuggestions();
        };
        suggestionEl.appendChild(item);
      });

      document.body.appendChild(suggestionEl);
    };

    const searchFiles = query => {
      if (!query || query.length < 1) {
        hideSuggestions();
        return;
      }

      const queryLower = query.toLowerCase();
      const suggestions = [];
      for (const file of this.app.vault.getFiles()) {
        if (fileExtension && !file.path.endsWith(fileExtension)) continue;
        if (file.path.toLowerCase().includes(queryLower)) {
          suggestions.push(file.path);
          if (suggestions.length >= 10) break;
        }
      }
      showSuggestions(suggestions);
    };

    inputEl.addEventListener('input', event => searchFiles(event.target.value));
    inputEl.addEventListener('focus', event => {
      if (event.target.value) searchFiles(event.target.value);
    });
    inputEl.addEventListener('blur', () => setTimeout(hideSuggestions, 200));
    inputEl.addEventListener('keydown', event => {
      if (event.key === 'Escape') hideSuggestions();
    });
  }

  async display() {
    const { containerEl } = this;
    containerEl.empty();

    containerEl.createEl('h2', { text: this.t('settings.title') });

    containerEl.createEl('h3', { text: this.t('settings.user') });
    new Setting(containerEl)
      .setName(this.t('settings.playerName'))
      .setDesc(this.t('settings.playerNameDesc'))
      .addText(text => {
        const stats = this.plugin.dataStore.getStats();
        text
          .setPlaceholder(this.t('settings.playerNamePlaceholder'))
          .setValue(stats.playerName || this.getDefaultPlayerName())
          .onChange(async value => {
            const currentStats = this.plugin.dataStore.getStats();
            currentStats.playerName = value || this.getDefaultPlayerName();
            await this.plugin.dataStore.save();
          });
        text.inputEl.style.width = '200px';
      });

    new Setting(containerEl)
      .setName(this.t('settings.language'))
      .setDesc(this.t('settings.languageDesc'))
      .addDropdown(dropdown => {
        const config = this.ensureConfig();
        dropdown
          .addOption('auto', this.t('settings.languageAuto'))
          .addOption('zh', this.t('settings.languageZh'))
          .addOption('en', this.t('settings.languageEn'))
          .setValue(config.language || 'auto')
          .onChange(async value => {
            config.language = value || 'auto';
            await this.plugin.dataStore.saveConfig();
            this.display();
          });
      });

    containerEl.createEl('h3', { text: this.t('settings.data') });
    new Setting(containerEl)
      .setName(this.t('settings.dataPath'))
      .setDesc(this.t('settings.dataPathDesc'))
      .addText(text => {
        text
          .setPlaceholder(this.plugin.dataStore.autoDetectDataPath())
          .setValue(this.plugin.dataStore.config?.dataFilePath || '')
          .onChange(async value => {
            const config = this.ensureConfig();
            config.dataFilePath = value;
            await this.plugin.dataStore.saveConfig();
          });
        this.setupPathAutocomplete(text.inputEl, '.json');
      })
      .addButton(button =>
        button
          .setButtonText(this.t('template.autoDetect'))
          .onClick(async () => {
            const detected = this.plugin.dataStore.autoDetectDataPath();
            const config = this.ensureConfig();
            config.dataFilePath = detected;
            await this.plugin.dataStore.saveConfig();
            new Notice(this.t('template.detected', { path: detected }));
            this.display();
          })
      );

    containerEl.createEl('h3', { text: this.t('settings.template') });
    new Setting(containerEl)
      .setName(this.t('settings.templatePath'))
      .setDesc(this.t('settings.templatePathDesc'))
      .addText(text => {
        text
          .setPlaceholder(this.plugin.dataStore.autoDetectTemplatePath())
          .setValue(this.plugin.dataStore.config?.templatePath || '')
          .onChange(async value => {
            const config = this.ensureConfig();
            config.templatePath = value;
            await this.plugin.dataStore.saveConfig();
          });
        this.setupPathAutocomplete(text.inputEl, '.md');
      })
      .addButton(button =>
        button
          .setButtonText(this.t('template.autoDetect'))
          .onClick(async () => {
            let detected = this.plugin.dataStore.autoDetectTemplatePath();
            if (!detected.endsWith('.md')) {
              detected += '.md';
            }

            const config = this.ensureConfig();
            config.templatePath = detected;
            await this.plugin.dataStore.saveConfig();

            const exists = await this.app.vault.adapter.exists(detected);
            if (exists) {
              new Notice(this.t('template.detected', { path: detected }));
            } else {
              this.showCreateTemplateConfirm(detected);
            }
            this.display();
          })
      );

    new Setting(containerEl)
      .setName(this.t('settings.updateTemplate'))
      .setDesc(this.t('settings.updateTemplateDesc'))
      .addButton(button => button.setButtonText(this.t('settings.templateButton')).onClick(() => this.updateDailyTemplate()));

    await this.renderDebugSection(containerEl);

    new Setting(containerEl)
      .setName(this.t('settings.unlock'))
      .setDesc(this.t('settings.unlockDesc'))
      .addButton(button => {
        button.setButtonText(this.plugin.lockState.unlocked ? this.t('settings.unlockActive') : this.t('settings.clickToUnlock'));
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
        new Notice(this.t('settings.waitToLock', { seconds: remainingSeconds }));
        return;
      }

      if (this.plugin.lockState.lastLockAttempt && now - this.plugin.lockState.lastLockAttempt < 15000) {
        this.plugin.lockState.lockConfirmCount = (this.plugin.lockState.lockConfirmCount || 0) + 1;
        const remaining = 3 - this.plugin.lockState.lockConfirmCount;
        if (remaining > 0) {
          button.setButtonText(this.t('settings.confirmLock', { remaining }));
          return;
        }
      } else {
        this.plugin.lockState.lockConfirmCount = 1;
        this.plugin.lockState.lastLockAttempt = now;
        button.setButtonText(this.t('settings.confirmLock', { remaining: 2 }));
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
      button.setButtonText(this.t('settings.clickToUnlock'));
      new Notice(this.t('settings.locked'));
      this.display();
      return;
    }

    this.plugin.lockState.clickCount += 1;
    const remaining = 42 - this.plugin.lockState.clickCount;

    if (remaining <= 0) {
      this.plugin.lockState.unlocked = true;
      this.plugin.lockState.unlockTime = Date.now();
      this.plugin.lockState.lockConfirmCount = 0;
      button.setButtonText(this.t('settings.unlockActive'));
      new Notice(this.t('settings.unlocked'));

      this.plugin.lockState.autoLockTimer = setTimeout(() => {
        this.plugin.lockState.unlocked = false;
        this.plugin.lockState.clickCount = 0;
        new Notice(this.t('settings.autoLocked'));
        this.display();
      }, 30 * 60 * 1000);

      this.display();
    } else {
      button.setButtonText(this.t('settings.clicksRemaining', { remaining }));
    }
  }

  addUnlockedSettings(containerEl) {
    containerEl.createEl('h3', { text: this.t('settings.dailyTasks') });
    new Setting(containerEl)
      .setName(this.t('settings.dailyTasks'))
      .setDesc(this.t('settings.dailyTasksDesc'))
      .addButton(button => button.setButtonText(this.t('common.configure')).onClick(() => this.showDailyTasksConfigModal()));

    containerEl.createEl('h3', { text: this.t('settings.perfectConfig') });
    new Setting(containerEl)
      .setName(this.t('settings.perfectConfig'))
      .setDesc(this.t('settings.perfectConfigDesc'))
      .addButton(button => button.setButtonText(this.t('common.configure')).onClick(() => this.showPerfectCheckInConfigModal()));

    containerEl.createEl('h3', { text: this.t('settings.shop') });
    new Setting(containerEl)
      .setName(this.t('settings.shopAdd'))
      .setDesc(this.t('settings.shopAddDesc'))
      .addButton(button => button.setButtonText(this.t('common.add')).onClick(() => this.showAddItemModal()));
    new Setting(containerEl)
      .setName(this.t('settings.shopEdit'))
      .setDesc(this.t('settings.shopEditDesc'))
      .addButton(button => button.setButtonText(this.t('common.edit')).onClick(() => this.showEditItemModal()));
    new Setting(containerEl)
      .setName(this.t('settings.shopDelete'))
      .setDesc(this.t('settings.shopDeleteDesc'))
      .addButton(button => button.setButtonText(this.t('common.delete')).onClick(() => this.showDeleteItemModal()));
    new Setting(containerEl)
      .setName(this.t('settings.shopExport'))
      .setDesc(this.t('settings.shopExportDesc'))
      .addButton(button => button.setButtonText(this.t('common.export')).onClick(() => this.exportShopConfig()));
    new Setting(containerEl)
      .setName(this.t('settings.shopImport'))
      .setDesc(this.t('settings.shopImportDesc'))
      .addButton(button => button.setButtonText(this.t('common.import')).onClick(() => this.importShopConfig()));

    containerEl.createEl('h3', { text: this.t('settings.levels') });
    new Setting(containerEl)
      .setName(this.t('settings.levelsEdit'))
      .setDesc(this.t('settings.levelsEditDesc'))
      .addButton(button => button.setButtonText(this.t('common.edit')).onClick(() => this.showEditLevelsModal()));
    new Setting(containerEl)
      .setName(this.t('settings.levelsAdd'))
      .setDesc(this.t('settings.levelsAddDesc'))
      .addButton(button => button.setButtonText(this.t('common.add')).onClick(() => this.showAddLevelModal()));

    containerEl.createEl('h3', { text: this.t('settings.currencies') });
    new Setting(containerEl)
      .setName(this.t('settings.currencies'))
      .setDesc(this.t('settings.currenciesDesc'))
      .addButton(button => button.setButtonText(this.t('common.manage')).onClick(() => this.showManageCurrenciesModal()));

    containerEl.createEl('h3', { text: this.t('settings.dataIO') });
    new Setting(containerEl)
      .setName(this.t('settings.exportData'))
      .setDesc(this.t('settings.exportDataDesc'))
      .addButton(button => button.setButtonText(this.t('common.export')).onClick(async () => {
        const data = await this.plugin.dataStore.exportData();
        const filename = `supreme-player-backup-${new Date().toISOString().split('T')[0]}.json`;
        this.downloadJson(filename, data);
        new Notice(this.t('settings.dataExported'));
      }));

    new Setting(containerEl)
      .setName(this.t('settings.importData'))
      .setDesc(this.t('settings.importDataDesc'))
      .addButton(button => button.setButtonText(this.t('common.import')).onClick(() => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = async event => {
          const file = event.target.files?.[0];
          if (!file) return;

          const reader = new FileReader();
          reader.onload = async loadEvent => {
            const result = await this.plugin.dataStore.importData(loadEvent.target.result);
            new Notice(result.message);
            if (result.success) {
              Core.updateStatusBar(this.plugin);
              this.display();
            }
          };
          reader.readAsText(file);
        };
        input.click();
      }));
  }

  showDailyTasksConfigModal() {
    const config = this.ensureConfig();
    const dailyTasks = config.dailyTasks || {
      mainTasks: { count: 3, pointsPerTask: 100 },
      habits: { items: [] },
      extraTasks: { count: 2, pointsPerTask: 50 },
      pomodoro: { count: 6, pointsPerPomodoro: 50 }
    };

    const modal = new Modal(this.app);
    modal.titleEl.setText(this.t('settings.dailyTaskModalTitle'));
    const content = this.createModalContent(modal);

    content.innerHTML = `
      <div style="background: var(--background-secondary); padding: 15px; border-radius: 8px; margin-bottom: 20px;">
        <div style="font-weight: bold; margin-bottom: 10px;">${this.t('settings.mainTasks')}</div>
        <div style="display: flex; gap: 10px;">
          <div style="flex: 1;">
            <div style="font-size: 12px; color: #888; margin-bottom: 5px;">${this.t('settings.taskCount')}</div>
            <input type="number" id="main-count" value="${dailyTasks.mainTasks?.count || 3}" min="1" max="10" style="width: 100%;">
          </div>
          <div style="flex: 1;">
            <div style="font-size: 12px; color: #888; margin-bottom: 5px;">${this.t('settings.pointsPerTask')}</div>
            <input type="number" id="main-points" value="${dailyTasks.mainTasks?.pointsPerTask || 100}" min="1" style="width: 100%;">
          </div>
        </div>
      </div>

      <div style="background: var(--background-secondary); padding: 15px; border-radius: 8px; margin-bottom: 20px;">
        <div style="font-weight: bold; margin-bottom: 10px;">${this.t('settings.habitList')}</div>
        <div id="habits-container" style="margin-bottom: 10px;"></div>
        <button id="add-habit-btn" style="width: 100%; padding: 8px; background: var(--interactive-accent); color: white; border: none; border-radius: 5px; cursor: pointer;">${this.t('settings.addHabit')}</button>
      </div>

      <div style="background: var(--background-secondary); padding: 15px; border-radius: 8px; margin-bottom: 20px;">
        <div style="font-weight: bold; margin-bottom: 10px;">${this.t('settings.extraTasks')}</div>
        <div style="display: flex; gap: 10px; margin-bottom: 10px;">
          <div style="flex: 1;">
            <div style="font-size: 12px; color: #888; margin-bottom: 5px;">${this.t('settings.taskCount')}</div>
            <input type="number" id="extra-count" value="${dailyTasks.extraTasks?.count || 2}" min="1" max="10" style="width: 100%;">
          </div>
          <div style="flex: 1;">
            <div style="font-size: 12px; color: #888; margin-bottom: 5px;">${this.t('settings.pointsPerTask')}</div>
            <input type="number" id="extra-points" value="${dailyTasks.extraTasks?.pointsPerTask || 50}" min="1" style="width: 100%;">
          </div>
        </div>
        <div id="extra-max-display" style="font-size: 12px; color: #888;">${this.t('settings.maxPoints', {
          value: (dailyTasks.extraTasks?.count || 2) * (dailyTasks.extraTasks?.pointsPerTask || 50)
        })}</div>
      </div>

      <div style="background: var(--background-secondary); padding: 15px; border-radius: 8px; margin-bottom: 20px;">
        <div style="font-weight: bold; margin-bottom: 10px;">${this.t('settings.pomodoro')}</div>
        <div style="display: flex; gap: 10px; margin-bottom: 10px;">
          <div style="flex: 1;">
            <div style="font-size: 12px; color: #888; margin-bottom: 5px;">${this.t('settings.taskCount')}</div>
            <input type="number" id="pomodoro-count" value="${dailyTasks.pomodoro?.count || 6}" min="1" max="12" style="width: 100%;">
          </div>
          <div style="flex: 1;">
            <div style="font-size: 12px; color: #888; margin-bottom: 5px;">${this.t('settings.pointsPerPomodoro')}</div>
            <input type="number" id="pomodoro-points" value="${dailyTasks.pomodoro?.pointsPerPomodoro || 50}" min="1" style="width: 100%;">
          </div>
        </div>
        <div id="pomodoro-max-display" style="font-size: 12px; color: #888;">${this.t('settings.maxPoints', {
          value: (dailyTasks.pomodoro?.count || 6) * (dailyTasks.pomodoro?.pointsPerPomodoro || 50)
        })}</div>
      </div>
    `;

    const habitsContainer = content.querySelector('#habits-container');
    const habits = [...(dailyTasks.habits?.items || [])];

    const renderHabits = () => {
      habitsContainer.innerHTML = '';
      habits.forEach((habit, index) => {
        const habitDiv = document.createElement('div');
        habitDiv.style.cssText = 'display: flex; gap: 10px; margin-bottom: 8px; align-items: center;';
        habitDiv.innerHTML = `
          <input type="text" value="${habit.name}" placeholder="${this.t('settings.habitNamePlaceholder')}" class="habit-name" data-index="${index}" style="flex: 1;">
          <input type="number" value="${habit.points}" placeholder="${this.t('effect.value')}" class="habit-points" data-index="${index}" style="width: 80px;">
          <button class="remove-habit-btn" data-index="${index}" style="background: #ff6666; color: white; border: none; border-radius: 3px; padding: 5px 10px; cursor: pointer;">×</button>
        `;
        habitsContainer.appendChild(habitDiv);
      });

      habitsContainer.querySelectorAll('.remove-habit-btn').forEach(button => {
        button.onclick = event => {
          const index = parseInt(event.target.dataset.index, 10);
          habits.splice(index, 1);
          renderHabits();
        };
      });

      habitsContainer.querySelectorAll('.habit-name').forEach(input => {
        input.onchange = event => {
          habits[parseInt(event.target.dataset.index, 10)].name = event.target.value;
        };
      });

      habitsContainer.querySelectorAll('.habit-points').forEach(input => {
        input.onchange = event => {
          habits[parseInt(event.target.dataset.index, 10)].points = parseInt(event.target.value, 10) || 10;
        };
      });
    };

    renderHabits();

    content.querySelector('#add-habit-btn').onclick = () => {
      habits.push({ name: this.t('settings.habitNewName'), points: 10 });
      renderHabits();
    };

    const extraCountInput = content.querySelector('#extra-count');
    const extraPointsInput = content.querySelector('#extra-points');
    const extraMaxDisplay = content.querySelector('#extra-max-display');
    const pomodoroCountInput = content.querySelector('#pomodoro-count');
    const pomodoroPointsInput = content.querySelector('#pomodoro-points');
    const pomodoroMaxDisplay = content.querySelector('#pomodoro-max-display');

    const updateExtraMax = () => {
      const count = parseInt(extraCountInput.value, 10) || 2;
      const points = parseInt(extraPointsInput.value, 10) || 50;
      extraMaxDisplay.textContent = this.t('settings.maxPoints', { value: count * points });
    };

    const updatePomodoroMax = () => {
      const count = parseInt(pomodoroCountInput.value, 10) || 6;
      const points = parseInt(pomodoroPointsInput.value, 10) || 50;
      pomodoroMaxDisplay.textContent = this.t('settings.maxPoints', { value: count * points });
    };

    extraCountInput.oninput = updateExtraMax;
    extraPointsInput.oninput = updateExtraMax;
    pomodoroCountInput.oninput = updatePomodoroMax;
    pomodoroPointsInput.oninput = updatePomodoroMax;

    const buttonRow = this.createButtonRow();
    buttonRow.appendChild(this.createActionButton(this.t('common.save'), async () => {
      config.dailyTasks = {
        mainTasks: {
          count: parseInt(content.querySelector('#main-count').value, 10) || 3,
          pointsPerTask: parseInt(content.querySelector('#main-points').value, 10) || 100
        },
        habits: { items: habits },
        extraTasks: {
          count: parseInt(extraCountInput.value, 10) || 2,
          pointsPerTask: parseInt(extraPointsInput.value, 10) || 50
        },
        pomodoro: {
          count: parseInt(pomodoroCountInput.value, 10) || 6,
          pointsPerPomodoro: parseInt(pomodoroPointsInput.value, 10) || 50
        }
      };
      await this.plugin.dataStore.saveConfig();
      new Notice(this.t('settings.dailyTasksSaved'));
      modal.close();
    }, 'mod-cta', 'flex: 1;'));
    buttonRow.appendChild(this.createActionButton(this.t('common.cancel'), () => modal.close(), '', 'flex: 1;'));
    content.appendChild(buttonRow);

    modal.open();
  }

  showPerfectCheckInConfigModal() {
    const config = this.ensureConfig();
    const rewardDefaults = this.getPerfectRewardDefaults();
    const rewardConfig = config.perfectCheckInReward || {
      enabled: true,
      rewardType: 'exclusive',
      shopItemId: null,
      exclusiveItem: {
        name: rewardDefaults.name,
        icon: '💎',
        description: rewardDefaults.description,
        rarity: 'legendary',
        category: 'system',
        effect: { type: 'super_diamond' }
      },
      blessingTitle: rewardDefaults.blessingTitle,
      blessingMessage: rewardDefaults.blessingMessage
    };
    const perfectReward = this.plugin.dataStore.getLocalizedPerfectReward
      ? this.plugin.dataStore.getLocalizedPerfectReward(rewardConfig)
      : rewardConfig;

    const shopItems = this.plugin.dataStore.getShopItems() || [];
    const shopOptions = shopItems.map(item => `<option value="${item.id}" ${perfectReward.shopItemId === item.id ? 'selected' : ''}>${item.icon} ${item.name}</option>`).join('');

    const modal = new Modal(this.app);
    modal.titleEl.setText(this.t('settings.perfectConfigModalTitle'));
    const content = this.createModalContent(modal, '500px');

    content.innerHTML = `
      <div style="margin-bottom: 15px;">
        <div style="font-size: 12px; color: #888; margin-bottom: 5px;">${this.t('settings.rewardType')}</div>
        <select id="reward-type" style="width: 100%;">
          <option value="shop" ${perfectReward.rewardType === 'shop' ? 'selected' : ''}>${this.t('settings.rewardShop')}</option>
          <option value="exclusive" ${perfectReward.rewardType === 'exclusive' ? 'selected' : ''}>${this.t('settings.rewardExclusive')}</option>
        </select>
      </div>

      <div id="shop-reward-section" style="${perfectReward.rewardType === 'shop' ? '' : 'display: none;'}">
        <div style="font-size: 12px; color: #888; margin-bottom: 5px;">${this.t('settings.selectShopItem')}</div>
        <select id="shop-item-select" style="width: 100%; margin-bottom: 15px;">
          <option value="">-- ${this.t('common.select')} --</option>
          ${shopOptions}
        </select>
      </div>

      <div id="exclusive-reward-section" style="${perfectReward.rewardType === 'exclusive' ? '' : 'display: none;'}">
        <div style="background: var(--background-secondary); padding: 15px; border-radius: 8px; margin-bottom: 15px;">
          <div style="font-weight: bold; margin-bottom: 10px;">${this.t('settings.exclusiveConfig')}</div>
          <div style="font-size: 11px; color: #888; margin-bottom: 10px;">${this.t('settings.exclusiveHint')}</div>
          <div style="margin-bottom: 10px;">
            <div style="font-size: 12px; color: #888; margin-bottom: 5px;">${this.t('settings.itemName')}</div>
            <input type="text" id="exclusive-name" value="${perfectReward.exclusiveItem?.name || this.getLocalizedText(rewardDefaults.name, this.t('datastore.reward.superDiamond.name'))}" style="width: 100%;">
          </div>
          <div style="margin-bottom: 10px;">
            <div style="font-size: 12px; color: #888; margin-bottom: 5px;">${this.t('settings.itemIcon')}</div>
            <input type="text" id="exclusive-icon" value="${perfectReward.exclusiveItem?.icon || '💎'}" style="width: 100%;">
          </div>
          <div style="margin-bottom: 10px;">
            <div style="font-size: 12px; color: #888; margin-bottom: 5px;">${this.t('settings.itemDescription')}</div>
            <input type="text" id="exclusive-desc" value="${perfectReward.exclusiveItem?.description || ''}" style="width: 100%;">
          </div>
          <div style="margin-bottom: 10px;">
            <div style="font-size: 12px; color: #888; margin-bottom: 5px;">${this.t('common.rarity')}</div>
            <select id="exclusive-rarity" style="width: 100%;">
              <option value="rare" ${perfectReward.exclusiveItem?.rarity === 'rare' ? 'selected' : ''}>${this.t('rarity.rare')}</option>
              <option value="legendary" ${perfectReward.exclusiveItem?.rarity === 'legendary' ? 'selected' : ''}>${this.t('rarity.legendary')}</option>
            </select>
          </div>
        </div>
      </div>

      <div style="background: var(--background-secondary); padding: 15px; border-radius: 8px; margin-bottom: 20px;">
        <div style="font-weight: bold; margin-bottom: 15px;">${this.t('settings.blessingConfig')}</div>
        <div style="margin-bottom: 10px;">
          <div style="font-size: 12px; color: #888; margin-bottom: 5px;">${this.t('settings.blessingTitle')}</div>
          <input type="text" id="blessing-title" value="${perfectReward.blessingTitle || ''}" style="width: 100%;">
        </div>
        <div style="margin-bottom: 10px;">
          <div style="font-size: 12px; color: #888; margin-bottom: 5px;">${this.t('settings.blessingMessage')}</div>
          <textarea id="blessing-message" style="width: 100%; height: 60px;">${perfectReward.blessingMessage || ''}</textarea>
        </div>
      </div>

      <div style="display: flex; align-items: center; gap: 10px;">
        <input type="checkbox" id="reward-enabled" ${perfectReward.enabled !== false ? 'checked' : ''}>
        <label for="reward-enabled">${this.t('settings.enablePerfectReward')}</label>
      </div>
    `;

    const rewardTypeSelect = content.querySelector('#reward-type');
    const shopRewardSection = content.querySelector('#shop-reward-section');
    const exclusiveRewardSection = content.querySelector('#exclusive-reward-section');

    rewardTypeSelect.onchange = () => {
      const isShop = rewardTypeSelect.value === 'shop';
      shopRewardSection.style.display = isShop ? '' : 'none';
      exclusiveRewardSection.style.display = isShop ? 'none' : '';
    };

    const buttonRow = this.createButtonRow();
    buttonRow.appendChild(this.createActionButton(this.t('common.save'), async () => {
      const rewardType = content.querySelector('#reward-type').value;
      const currentReward = config.perfectCheckInReward || {};
      const currentExclusive = currentReward.exclusiveItem || {};
      config.perfectCheckInReward = {
        enabled: content.querySelector('#reward-enabled').checked,
        rewardType,
        shopItemId: rewardType === 'shop' ? content.querySelector('#shop-item-select').value : null,
        exclusiveItem: rewardType === 'exclusive'
          ? {
              name: this.plugin.dataStore.updateLocalizedValue(currentExclusive.name, content.querySelector('#exclusive-name').value.trim() || this.getLocalizedText(rewardDefaults.name, this.t('datastore.reward.superDiamond.name'))),
              icon: content.querySelector('#exclusive-icon').value.trim() || '💎',
              description: this.plugin.dataStore.updateLocalizedValue(currentExclusive.description, content.querySelector('#exclusive-desc').value.trim()),
              rarity: content.querySelector('#exclusive-rarity').value,
              category: 'system',
              effect: { type: 'super_diamond' }
            }
          : null,
        blessingTitle: this.plugin.dataStore.updateLocalizedValue(currentReward.blessingTitle, content.querySelector('#blessing-title').value.trim() || this.getLocalizedText(rewardDefaults.blessingTitle, this.t('datastore.reward.defaultBlessingTitle'))),
        blessingMessage: this.plugin.dataStore.updateLocalizedValue(currentReward.blessingMessage, content.querySelector('#blessing-message').value.trim() || this.getLocalizedText(rewardDefaults.blessingMessage, this.t('datastore.reward.defaultBlessingMessage')))
      };
      await this.plugin.dataStore.saveConfig();
      new Notice(this.t('settings.perfectConfigSaved'));
      modal.close();
    }, 'mod-cta', 'flex: 1;'));
    buttonRow.appendChild(this.createActionButton(this.t('common.cancel'), () => modal.close(), '', 'flex: 1;'));
    content.appendChild(buttonRow);

    modal.open();
  }

  showAddItemModal() {
    const modal = new Modal(this.app);
    modal.titleEl.setText(this.t('settings.addItemTitle'));
    const content = this.createModalContent(modal);

    content.innerHTML = `
      <div style="margin-bottom: 5px;">${this.t('settings.itemName')}</div>
      <input type="text" id="item-name" placeholder="${this.t('settings.itemNameInputPlaceholder')}" style="width: 100%; margin-bottom: 15px;">
      <div style="margin-bottom: 5px;">${this.t('settings.itemDescription')}</div>
      <input type="text" id="item-desc" placeholder="${this.t('settings.itemDescInputPlaceholder')}" style="width: 100%; margin-bottom: 15px;">
      <div style="margin-bottom: 5px;">${this.t('settings.itemIcon')}</div>
      <input type="text" id="item-icon" placeholder="${this.t('settings.itemIconPlaceholder')}" style="width: 100%; margin-bottom: 15px;">
      <div style="display: flex; gap: 10px; margin-bottom: 15px;">
        <div style="flex: 1;">
          <div style="margin-bottom: 5px;">${this.t('common.price')}</div>
          <input type="number" id="item-price" value="1" min="1" style="width: 100%;">
        </div>
        <div style="flex: 1;">
          <div style="margin-bottom: 5px;">${this.t('common.rarity')}</div>
          <select id="item-rarity" style="width: 100%;">
            <option value="rare">${this.t('rarity.rare')}</option>
            <option value="legendary">${this.t('rarity.legendary')}</option>
          </select>
        </div>
      </div>
      <div style="margin-bottom: 5px;">${this.t('settings.itemCategory')}</div>
      <select id="item-category" style="width: 100%; margin-bottom: 15px;">
        <option value="system">${this.t('settings.systemItem')}</option>
        <option value="external">${this.t('settings.externalItem')}</option>
      </select>
      <div id="effect-config" style="background: var(--background-secondary); padding: 15px; border-radius: 8px; margin-bottom: 15px;">
        <div style="font-weight: bold; margin-bottom: 10px;">${this.t('settings.effectConfig')}</div>
        <div style="margin-bottom: 5px;">${this.t('settings.effectType')}</div>
        <select id="effect-type" style="width: 100%; margin-bottom: 15px;">
          <option value="add_wish_stars">${this.t('effect.addWishStars')}</option>
          <option value="add_level">${this.t('effect.addLevel')}</option>
          <option value="buff">${this.t('effect.buff')}</option>
          <option value="random_wish_stars">${this.t('effect.randomWishStars')}</option>
          <option value="add_points">${this.t('effect.addPoints')}</option>
        </select>
        <div id="effect-params"></div>
      </div>
    `;

    const effectParams = content.querySelector('#effect-params');
    const effectTypeSelect = content.querySelector('#effect-type');
    const categorySelect = content.querySelector('#item-category');
    const effectConfig = content.querySelector('#effect-config');

    const renderEffect = () => renderEffectParams(effectTypeSelect.value, effectParams, this.t);
    const toggleEffectConfig = () => {
      effectConfig.style.display = categorySelect.value === 'external' ? 'none' : 'block';
    };

    effectTypeSelect.onchange = renderEffect;
    categorySelect.onchange = toggleEffectConfig;
    renderEffect();
    toggleEffectConfig();

    const buttonRow = this.createButtonRow();
    buttonRow.appendChild(this.createActionButton(this.t('common.add'), async () => {
      const name = content.querySelector('#item-name').value.trim();
      if (!name) {
        new Notice(this.t('settings.enterItemName'));
        return;
      }

      const category = content.querySelector('#item-category').value;
      const effect = buildEffectFromForm(category, effectTypeSelect.value, this.t);
      if (category === 'system' && effect === null && effectTypeSelect.value === 'buff') {
        return;
      }

      const result = await this.plugin.dataStore.addShopItem(
        name,
        content.querySelector('#item-desc').value.trim(),
        category,
        'consumable',
        parseInt(content.querySelector('#item-price').value, 10) || 1,
        content.querySelector('#item-rarity').value,
        content.querySelector('#item-icon').value.trim() || '🎁',
        effect
      );
      new Notice(result.message);
      if (result.success) {
        modal.close();
      }
    }, 'mod-cta', 'flex: 1;'));
    buttonRow.appendChild(this.createActionButton(this.t('common.cancel'), () => modal.close(), '', 'flex: 1;'));
    content.appendChild(buttonRow);

    modal.open();
  }

  showEditItemModal() {
    const allItems = this.plugin.dataStore.getShopItems();
    if (!allItems.length) {
      new Notice(this.t('settings.noEditableItems'));
      return;
    }

    const modal = new Modal(this.app);
    modal.titleEl.setText(this.t('settings.editItemTitle'));
    const content = this.createModalContent(modal, '500px');

    content.innerHTML = `
      <div style="margin-bottom: 5px;">${this.t('common.select')}</div>
      <select id="item-select" style="width: 100%; margin-bottom: 15px;">
        ${allItems.map(item => `<option value="${item.id}">${item.icon} ${item.name}</option>`).join('')}
      </select>
      <div style="margin-bottom: 5px;">${this.t('settings.itemName')}</div>
      <input type="text" id="item-name" style="width: 100%; margin-bottom: 15px;">
      <div style="margin-bottom: 5px;">${this.t('settings.itemDescription')}</div>
      <input type="text" id="item-desc" style="width: 100%; margin-bottom: 15px;">
      <div style="margin-bottom: 5px;">${this.t('settings.itemIcon')}</div>
      <input type="text" id="item-icon" style="width: 100%; margin-bottom: 15px;">
      <div style="margin-bottom: 5px;">${this.t('common.price')}</div>
      <input type="number" id="item-price" style="width: 100%; margin-bottom: 15px;">
      <div style="margin-bottom: 5px;">${this.t('common.rarity')}</div>
      <select id="item-rarity" style="width: 100%; margin-bottom: 15px;">
        <option value="rare">${this.t('rarity.rare')}</option>
        <option value="legendary">${this.t('rarity.legendary')}</option>
      </select>
      <div style="margin-bottom: 5px;">${this.t('settings.itemCategory')}</div>
      <select id="item-category" style="width: 100%; margin-bottom: 20px;">
        <option value="system">${this.t('settings.systemItem')}</option>
        <option value="external">${this.t('settings.externalItem')}</option>
      </select>
      <div id="effect-section">
        <div style="font-weight: bold; margin-bottom: 10px;">${this.t('settings.effectConfig')}</div>
        <div style="margin-bottom: 5px;">${this.t('settings.effectType')}</div>
        <select id="effect-type" style="width: 100%; margin-bottom: 15px;">
          <option value="add_wish_stars">${this.t('effect.addWishStars')}</option>
          <option value="add_level">${this.t('effect.addLevel')}</option>
          <option value="buff">${this.t('effect.buff')}</option>
          <option value="random_wish_stars">${this.t('effect.randomWishStars')}</option>
          <option value="add_points">${this.t('effect.addPoints')}</option>
        </select>
        <div id="effect-params"></div>
      </div>
    `;

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

    const renderEffect = () => renderEffectParams(effectTypeSelect.value, effectParams, this.t);

    const loadItem = () => {
      const item = allItems.find(entry => entry.id === itemSelect.value);
      if (!item) return;

      itemName.value = item.name;
      itemDesc.value = item.description || '';
      itemIcon.value = item.icon || '🎁';
      itemPrice.value = item.price || 1;
      itemRarity.value = item.rarity || 'rare';
      itemCategory.value = item.category || 'system';

      effectSection.style.display = itemCategory.value === 'external' ? 'none' : 'block';

      const effectType = item.effect?.type || 'add_wish_stars';
      effectTypeSelect.value = effectType;
      renderEffect();

      if (!item.effect) return;

      if (effectType === 'add_wish_stars' || effectType === 'add_level' || effectType === 'add_points') {
        const valueInput = effectParams.querySelector('#effect-value');
        if (valueInput) valueInput.value = item.effect.value || 1;
      } else if (effectType === 'buff') {
        const buffName = effectParams.querySelector('#buff-name');
        const buffIcon = effectParams.querySelector('#buff-icon');
        const buffDesc = effectParams.querySelector('#buff-desc');
        const buffDuration = effectParams.querySelector('#buff-duration');
        if (buffName) buffName.value = item.effect.buffName || '';
        if (buffIcon) buffIcon.value = item.effect.buffIcon || '';
        if (buffDesc) buffDesc.value = item.effect.buffDesc || '';
        if (buffDuration) buffDuration.value = item.effect.duration || item.effect.buffDuration || 24;
      } else if (effectType === 'random_wish_stars') {
        const minInput = effectParams.querySelector('#effect-min');
        const maxInput = effectParams.querySelector('#effect-max');
        if (minInput) minInput.value = item.effect.min || 1;
        if (maxInput) maxInput.value = item.effect.max || 5;
      }
    };

    effectTypeSelect.onchange = renderEffect;
    itemCategory.onchange = () => {
      effectSection.style.display = itemCategory.value === 'external' ? 'none' : 'block';
    };
    itemSelect.onchange = loadItem;
    loadItem();

    const buttonRow = this.createButtonRow();
    buttonRow.appendChild(this.createActionButton(this.t('common.save'), async () => {
      const category = itemCategory.value;
      const effect = buildEffectFromForm(category, effectTypeSelect.value, this.t);
      if (category === 'system' && effect === null && effectTypeSelect.value === 'buff') {
        return;
      }

      const result = await this.plugin.dataStore.updateShopItem(itemSelect.value, {
        name: itemName.value.trim(),
        description: itemDesc.value.trim(),
        icon: itemIcon.value.trim() || '🎁',
        price: parseInt(itemPrice.value, 10) || 1,
        rarity: itemRarity.value,
        category,
        effect
      });
      new Notice(result.message);
      if (result.success) {
        modal.close();
      }
    }, 'mod-cta', 'flex: 1;'));
    buttonRow.appendChild(this.createActionButton(this.t('common.cancel'), () => modal.close(), '', 'flex: 1;'));
    content.appendChild(buttonRow);

    modal.open();
  }

  showDeleteItemModal() {
    const allItems = this.plugin.dataStore.getShopItems();
    if (!allItems.length) {
      new Notice(this.t('settings.noDeletableItems'));
      return;
    }

    const modal = new Modal(this.app);
    modal.titleEl.setText(this.t('settings.deleteItemTitle'));
    const content = this.createModalContent(modal, 'unset');

    content.innerHTML = `
      <div style="margin-bottom: 5px;">${this.t('common.select')}</div>
      <select id="item-select" style="width: 100%; margin-bottom: 20px;">
        ${allItems.map(item => `<option value="${item.id}">${item.icon} ${item.name}</option>`).join('')}
      </select>
      <div style="color: #ff6666; font-size: 12px; margin-bottom: 15px;">${this.t('settings.deleteWarning')}</div>
    `;

    const buttonRow = this.createButtonRow();
    buttonRow.appendChild(this.createActionButton(this.t('common.delete'), async () => {
      const result = await this.plugin.dataStore.deleteShopItem(content.querySelector('#item-select').value);
      new Notice(result.message);
      if (result.success) {
        modal.close();
      }
    }, '', 'background-color: #ff6666; color: white; flex: 1;'));
    buttonRow.appendChild(this.createActionButton(this.t('common.cancel'), () => modal.close(), '', 'flex: 1;'));
    content.appendChild(buttonRow);

    modal.open();
  }

  showEditLevelsModal() {
    const config = this.ensureConfig();
    const levels = config.levels || [];

    const modal = new Modal(this.app);
    modal.titleEl.setText(this.t('settings.editLevelsTitle'));
    const content = this.createModalContent(modal, 'unset');

    const list = document.createElement('div');
    list.style.cssText = 'max-height: 400px; overflow-y: auto;';

    levels.forEach((levelConfig, index) => {
      const displayLevel = this.plugin.dataStore.getLocalizedLevelConfig(levelConfig, index);
      const levelDiv = document.createElement('div');
      levelDiv.style.cssText = `padding: 15px; margin-bottom: 10px; border: 1px solid var(--background-modifier-border); border-radius: 8px; border-left: 4px solid ${displayLevel.color || '#ffffff'}; cursor: pointer;`;
      levelDiv.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
          <div style="font-weight: bold; font-size: 16px;">${displayLevel.title}</div>
          <div style="color: #888; font-size: 12px;">${
            displayLevel.maxLevel === 999
              ? this.t('settings.levelRangeInfinite', { min: displayLevel.minLevel })
              : this.t('settings.levelRange', { min: displayLevel.minLevel, max: displayLevel.maxLevel })
          }</div>
        </div>
        <div style="color: #666; font-size: 12px;">${this.t('settings.levelAbility', { value: displayLevel.ability || '' })}</div>
        <div style="color: #666; font-size: 12px;">${this.t('settings.levelPhase', { value: displayLevel.phase || '' })}</div>
      `;
      levelDiv.onclick = () => this.showEditLevelDetailModal(index, levelConfig);
      list.appendChild(levelDiv);
    });

    content.appendChild(list);
    content.appendChild(this.createActionButton(this.t('common.close'), () => modal.close(), '', 'width: 100%; margin-top: 10px;'));

    modal.open();
  }

  showEditLevelDetailModal(index, levelConfig) {
    const displayLevel = this.plugin.dataStore.getLocalizedLevelConfig(levelConfig, index);
    const modal = new Modal(this.app);
    modal.titleEl.setText(this.t('settings.editLevelTitle', { title: displayLevel.title }));
    const content = this.createModalContent(modal, 'unset');

    content.innerHTML = `
      <div style="margin-bottom: 5px;">${this.t('settings.levelTitle')}</div>
      <input type="text" id="level-title" value="${displayLevel.title}" style="width: 100%; margin-bottom: 15px;">
      <div style="margin-bottom: 5px;">${this.t('settings.levelAbilityLabel')}</div>
      <input type="text" id="level-ability" value="${displayLevel.ability || ''}" style="width: 100%; margin-bottom: 15px;">
      <div style="margin-bottom: 5px;">${this.t('settings.levelAbilityIcon')}</div>
      <input type="text" id="level-ability-icon" value="${levelConfig.abilityIcon || '✨'}" style="width: 100%; margin-bottom: 15px;">
      <div style="margin-bottom: 5px;">${this.t('settings.levelPhaseLabel')}</div>
      <input type="text" id="level-phase" value="${displayLevel.phase || ''}" style="width: 100%; margin-bottom: 15px;">
      <div style="margin-bottom: 5px;">${this.t('settings.levelPhaseIcon')}</div>
      <input type="text" id="level-phase-icon" value="${levelConfig.phaseIcon || '🌟'}" style="width: 100%; margin-bottom: 15px;">
      <div style="margin-bottom: 5px;">${this.t('settings.levelColor')}</div>
      <input type="text" id="level-color" value="${levelConfig.color || '#ffffff'}" style="width: 100%; margin-bottom: 15px;">
      <div style="margin-bottom: 5px;">${this.t('settings.levelMin')}</div>
      <input type="number" id="level-min" value="${levelConfig.minLevel}" style="width: 100%; margin-bottom: 15px;">
      <div style="margin-bottom: 5px;">${this.t('settings.levelMax')}</div>
      <input type="number" id="level-max" value="${levelConfig.maxLevel}" style="width: 100%; margin-bottom: 20px;">
      <div id="delete-section" style="margin-top: 20px; padding-top: 15px; border-top: 1px solid var(--background-modifier-border);"></div>
    `;

    let deleteConfirmCount = 0;
    let deleteConfirmTimer = null;
    const deleteSection = content.querySelector('#delete-section');
    const deleteButton = this.createActionButton(
      this.t('settings.deleteLevel'),
      () => {
        deleteConfirmCount += 1;
        if (deleteConfirmCount === 1) {
          deleteButton.textContent = this.t('settings.deleteClickAgain');
          deleteButton.style.background = '#ff4444';
          deleteConfirmTimer = setTimeout(() => {
            deleteConfirmCount = 0;
            deleteButton.textContent = this.t('settings.deleteLevel');
            deleteButton.style.background = '#ff6666';
          }, 3000);
          return;
        }

        if (deleteConfirmCount === 2) {
          deleteButton.textContent = this.t('settings.deleteClickFinal');
          deleteButton.style.background = '#cc0000';
          deleteConfirmTimer = setTimeout(() => {
            deleteConfirmCount = 0;
            deleteButton.textContent = this.t('settings.deleteLevel');
            deleteButton.style.background = '#ff6666';
          }, 3000);
          return;
        }

        if (deleteConfirmTimer) clearTimeout(deleteConfirmTimer);
        this.plugin.dataStore.deleteLevelConfig(index).then(result => {
          new Notice(result.message);
          if (result.success) {
            modal.close();
            this.showEditLevelsModal();
          }
        });
      },
      '',
      'width: 100%; background: #ff6666; color: white; border: none; padding: 10px; border-radius: 5px; cursor: pointer;'
    );
    deleteSection.appendChild(deleteButton);

    const buttonRow = this.createButtonRow();
    buttonRow.appendChild(this.createActionButton(this.t('common.save'), async () => {
      const result = await this.plugin.dataStore.updateLevelConfig(index, {
        title: content.querySelector('#level-title').value.trim(),
        ability: content.querySelector('#level-ability').value.trim(),
        abilityIcon: content.querySelector('#level-ability-icon').value.trim() || '✨',
        phase: content.querySelector('#level-phase').value.trim(),
        phaseIcon: content.querySelector('#level-phase-icon').value.trim() || '🌟',
        color: content.querySelector('#level-color').value.trim() || '#ffffff',
        minLevel: parseInt(content.querySelector('#level-min').value, 10) || 0,
        maxLevel: parseInt(content.querySelector('#level-max').value, 10) || 999
      });
      new Notice(result.message);
      if (result.success) {
        modal.close();
      }
    }, 'mod-cta', 'flex: 1;'));
    buttonRow.appendChild(this.createActionButton(this.t('common.cancel'), () => modal.close(), '', 'flex: 1;'));
    content.appendChild(buttonRow);

    modal.open();
  }

  showAddLevelModal() {
    const modal = new Modal(this.app);
    modal.titleEl.setText(this.t('settings.addLevelTitle'));
    const content = this.createModalContent(modal, 'unset');

    content.innerHTML = `
      <div style="margin-bottom: 5px;">${this.t('settings.levelTitle')}</div>
      <input type="text" id="level-title" placeholder="${this.t('settings.levelTitlePlaceholder')}" style="width: 100%; margin-bottom: 15px;">
      <div style="margin-bottom: 5px;">${this.t('settings.levelAbilityLabel')}</div>
      <input type="text" id="level-ability" placeholder="${this.t('settings.levelAbilityPlaceholder')}" style="width: 100%; margin-bottom: 15px;">
      <div style="margin-bottom: 5px;">${this.t('settings.levelAbilityIcon')}</div>
      <input type="text" id="level-ability-icon" placeholder="✨" style="width: 100%; margin-bottom: 15px;">
      <div style="margin-bottom: 5px;">${this.t('settings.levelPhaseLabel')}</div>
      <input type="text" id="level-phase" placeholder="${this.t('settings.levelPhasePlaceholder')}" style="width: 100%; margin-bottom: 15px;">
      <div style="margin-bottom: 5px;">${this.t('settings.levelPhaseIcon')}</div>
      <input type="text" id="level-phase-icon" placeholder="🌟" style="width: 100%; margin-bottom: 15px;">
      <div style="margin-bottom: 5px;">${this.t('settings.levelColor')}</div>
      <input type="text" id="level-color" placeholder="#ffffff" style="width: 100%; margin-bottom: 15px;">
      <div style="margin-bottom: 5px;">${this.t('settings.levelMin')}</div>
      <input type="number" id="level-min" placeholder="0" style="width: 100%; margin-bottom: 15px;">
      <div style="margin-bottom: 5px;">${this.t('settings.levelMax')}</div>
      <input type="number" id="level-max" placeholder="999" style="width: 100%; margin-bottom: 20px;">
    `;

    const buttonRow = this.createButtonRow();
    buttonRow.appendChild(this.createActionButton(this.t('common.add'), async () => {
      const title = content.querySelector('#level-title').value.trim();
      if (!title) {
        new Notice(this.t('settings.enterLevelTitle'));
        return;
      }

      const result = await this.plugin.dataStore.addLevelConfig({
        minLevel: parseInt(content.querySelector('#level-min').value, 10) || 0,
        maxLevel: parseInt(content.querySelector('#level-max').value, 10) || 999,
        title,
        ability: content.querySelector('#level-ability').value.trim(),
        abilityIcon: content.querySelector('#level-ability-icon').value.trim() || '✨',
        phase: content.querySelector('#level-phase').value.trim(),
        phaseIcon: content.querySelector('#level-phase-icon').value.trim() || '🌟',
        color: content.querySelector('#level-color').value.trim() || '#ffffff'
      });
      new Notice(result.message);
      if (result.success) {
        modal.close();
      }
    }, 'mod-cta', 'flex: 1;'));
    buttonRow.appendChild(this.createActionButton(this.t('common.cancel'), () => modal.close(), '', 'flex: 1;'));
    content.appendChild(buttonRow);

    modal.open();
  }

  showManageCurrenciesModal() {
    const currencies = this.plugin.dataStore.getCurrencies();
    const stats = this.plugin.dataStore.getStats();

    const modal = new Modal(this.app);
    modal.titleEl.setText(this.t('settings.manageCurrenciesTitle'));
    const content = this.createModalContent(modal, 'unset');

    const currencyList = document.createElement('div');
    currencyList.style.cssText = 'max-height: 400px; overflow-y: auto;';

    currencies.forEach(currency => {
      const currencyDiv = document.createElement('div');
      currencyDiv.style.cssText = `padding: 15px; margin-bottom: 10px; border: 1px solid var(--background-modifier-border); border-radius: 8px; border-left: 4px solid ${currency.color || '#ffffff'};`;
      if (currency.editable) {
        currencyDiv.style.cursor = 'pointer';
        currencyDiv.onclick = () => this.showEditCurrencyModal(currency);
      }

      currencyDiv.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div>
            <span style="font-size: 20px; margin-right: 10px;">${currency.icon}</span>
            <strong>${currency.name}</strong>
            ${currency.editable ? `<span style="color: #888; font-size: 10px; margin-left: 5px;">${this.t('settings.currencyEditable')}</span>` : ''}
          </div>
          <div style="text-align: right;">
            <div style="font-weight: bold;">${stats[currency.id] || 0}</div>
            <div style="color: #888; font-size: 10px;">${this.t('settings.currencyGainRule', {
              rate: currency.earnRate,
              amount: currency.earnAmount || 1
            })}</div>
          </div>
        </div>
        <div style="color: #666; font-size: 12px; margin-top: 5px;">${currency.description || ''}</div>
      `;

      currencyList.appendChild(currencyDiv);
    });

    content.appendChild(currencyList);
    content.appendChild(this.createActionButton(this.t('common.add'), () => this.showAddCurrencyModal(), '', 'width: 100%; margin-top: 10px;'));
    content.appendChild(this.createActionButton(this.t('common.close'), () => modal.close(), '', 'width: 100%; margin-top: 10px;'));

    modal.open();
  }

  showEditCurrencyModal(currency) {
    const modal = new Modal(this.app);
    modal.titleEl.setText(this.t('settings.editCurrencyTitle', { name: currency.name }));
    const content = this.createModalContent(modal, 'unset');

    content.innerHTML = `
      <div style="margin-bottom: 5px;">${this.t('common.name')}</div>
      <input type="text" id="currency-name" value="${currency.name}" style="width: 100%; margin-bottom: 15px;">
      <div style="margin-bottom: 5px;">${this.t('common.icon')}</div>
      <input type="text" id="currency-icon" value="${currency.icon}" style="width: 100%; margin-bottom: 15px;">
      <div style="margin-bottom: 5px;">${this.t('settings.currencyDescription')}</div>
      <input type="text" id="currency-desc" value="${currency.description || ''}" style="width: 100%; margin-bottom: 15px;">
      <div style="margin-bottom: 5px;">${this.t('settings.currencyRate')}</div>
      <input type="number" id="currency-rate" value="${currency.earnRate}" style="width: 100%; margin-bottom: 15px;">
      <div style="margin-bottom: 5px;">${this.t('settings.currencyColor')}</div>
      <input type="text" id="currency-color" value="${currency.color || '#ffffff'}" style="width: 100%; margin-bottom: 20px;">
    `;

    const buttonRow = this.createButtonRow();
    buttonRow.appendChild(this.createActionButton(this.t('common.save'), async () => {
      const result = await this.plugin.dataStore.updateCurrency(currency.id, {
        name: content.querySelector('#currency-name').value.trim(),
        icon: content.querySelector('#currency-icon').value.trim(),
        description: content.querySelector('#currency-desc').value.trim(),
        earnRate: parseInt(content.querySelector('#currency-rate').value, 10) || 1000,
        color: content.querySelector('#currency-color').value.trim()
      });
      new Notice(result.message);
      if (result.success) {
        modal.close();
      }
    }, 'mod-cta', 'flex: 1;'));
    buttonRow.appendChild(this.createActionButton(this.t('common.delete'), async () => {
      const result = await this.plugin.dataStore.deleteCurrency(currency.id);
      new Notice(result.message);
      if (result.success) {
        modal.close();
      }
    }, '', 'background-color: #ff6666; color: white; flex: 1;'));
    buttonRow.appendChild(this.createActionButton(this.t('common.cancel'), () => modal.close(), '', 'flex: 1;'));
    content.appendChild(buttonRow);

    modal.open();
  }

  showAddCurrencyModal() {
    const modal = new Modal(this.app);
    modal.titleEl.setText(this.t('settings.addCurrencyTitle'));
    const content = this.createModalContent(modal, 'unset');

    content.innerHTML = `
      <div style="margin-bottom: 5px;">${this.t('common.name')}</div>
      <input type="text" id="currency-name" placeholder="${this.t('settings.currencyNamePlaceholder')}" style="width: 100%; margin-bottom: 15px;">
      <div style="margin-bottom: 5px;">${this.t('common.icon')}</div>
      <input type="text" id="currency-icon" placeholder="${this.t('settings.currencyIconPlaceholder')}" style="width: 100%; margin-bottom: 15px;">
      <div style="margin-bottom: 5px;">${this.t('settings.currencyDescription')}</div>
      <input type="text" id="currency-desc" placeholder="${this.t('settings.currencyDescPlaceholder')}" style="width: 100%; margin-bottom: 15px;">
      <div style="margin-bottom: 5px;">${this.t('settings.currencyRate')}</div>
      <input type="number" id="currency-rate" placeholder="${this.t('settings.currencyRatePlaceholder')}" style="width: 100%; margin-bottom: 15px;">
      <div style="margin-bottom: 5px;">${this.t('settings.currencyColor')}</div>
      <input type="text" id="currency-color" placeholder="${this.t('settings.currencyColorPlaceholder')}" style="width: 100%; margin-bottom: 20px;">
      <div style="color: #666; font-size: 12px; margin-bottom: 15px;">${this.t('settings.currencyHint')}</div>
    `;

    const buttonRow = this.createButtonRow();
    buttonRow.appendChild(this.createActionButton(this.t('common.add'), async () => {
      const name = content.querySelector('#currency-name').value.trim();
      if (!name) {
        new Notice(this.t('settings.enterCurrencyName'));
        return;
      }

      const result = await this.plugin.dataStore.addCurrency(
        name,
        content.querySelector('#currency-icon').value.trim() || '🪙',
        content.querySelector('#currency-desc').value.trim(),
        parseInt(content.querySelector('#currency-rate').value, 10) || 1000,
        content.querySelector('#currency-color').value.trim() || '#00ff00'
      );
      new Notice(result.message);
      if (result.success) {
        modal.close();
      }
    }, 'mod-cta', 'flex: 1;'));
    buttonRow.appendChild(this.createActionButton(this.t('common.cancel'), () => modal.close(), '', 'flex: 1;'));
    content.appendChild(buttonRow);

    modal.open();
  }

  exportShopConfig() {
    const items = this.plugin.dataStore.getShopItems();
    if (!items.length) {
      new Notice(this.t('settings.noShopToExport'));
      return;
    }

    const exportData = JSON.stringify({
      exportVersion: '1.0',
      exportedAt: new Date().toISOString(),
      items
    }, null, 2);

    const filename = `shop-config-${new Date().toISOString().split('T')[0]}.json`;
    this.downloadJson(filename, exportData);
    new Notice(this.t('settings.shopExported'));
  }

  importShopConfig() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async event => {
      const file = event.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = async loadEvent => {
        try {
          const data = JSON.parse(loadEvent.target.result);
          const items = data.items || data.customItems;
          if (!items || !Array.isArray(items)) {
            new Notice(this.t('settings.invalidShopConfig'));
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
              this.plugin.dataStore.shopConfig.items.push({
                ...item,
                id: `imported-${Date.now()}-${importCount}`
              });
              importCount += 1;
            }
          }

          await this.plugin.dataStore.saveShopConfig();
          new Notice(this.t('settings.shopImportSuccess', { count: importCount }));
        } catch (error) {
          new Notice(this.t('settings.importFailed', { message: error.message }));
        }
      };
      reader.readAsText(file);
    };
    input.click();
  }

  showCreateTemplateConfirm(templatePath) {
    const modal = new Modal(this.app);
    modal.titleEl.setText(this.t('template.createTitle'));
    const content = this.createModalContent(modal, 'unset');

    content.innerHTML = `
      <div style="margin-bottom: 16px; line-height: 1.6;">
        ${this.t('template.createMissing')}
        <div style="margin-top: 8px; padding: 10px; background: var(--background-secondary); border-radius: 6px; word-break: break-all;">
          ${templatePath}
        </div>
      </div>
      <div style="color: var(--text-muted); margin-bottom: 16px;">
        ${this.t('template.createPrompt')}
      </div>
    `;

    const buttonRow = this.createButtonRow();
    buttonRow.appendChild(this.createActionButton(this.t('template.createNow'), async () => {
      modal.close();
      await this.updateDailyTemplate(templatePath);
    }, 'mod-cta', 'flex: 1;'));
    buttonRow.appendChild(this.createActionButton(this.t('template.createLater'), () => {
      modal.close();
      new Notice(this.t('template.savedPath', { path: templatePath }));
    }, '', 'flex: 1;'));
    content.appendChild(buttonRow);

    modal.open();
  }

  async updateDailyTemplate(templatePathOverride) {
    const config = this.ensureConfig();
    await this.plugin.dataStore.saveConfig();

    const dailyTasks = config.dailyTasks || {
      mainTasks: { count: 3, pointsPerTask: 100 },
      habits: { items: this.plugin.dataStore.getDefaultDailyTasksDefinition().habits.items },
      extraTasks: { count: 2, pointsPerTask: 50 },
      pomodoro: { count: 6, pointsPerPomodoro: 50 }
    };

    const mainTasks = dailyTasks.mainTasks || { count: 3, pointsPerTask: 100 };
    const habits = dailyTasks.habits?.items || [];
    const extraTasks = dailyTasks.extraTasks || { count: 2, pointsPerTask: 50 };
    const pomodoro = dailyTasks.pomodoro || { count: 6, pointsPerPomodoro: 50 };
    let mainTasksSection = '';
    for (let index = 1; index <= mainTasks.count; index += 1) {
      mainTasksSection += `- [ ] ${this.t('template.taskLabel')} ${index} - ${mainTasks.pointsPerTask}\n`;
    }

    let habitsSection = '';
    for (const habit of habits) {
      const habitName = this.getLocalizedText(habit.name, '');
      habitsSection += `- [ ] ${habitName} - ${habit.points || 10}\n`;
    }

    let extraTasksSection = '';
    for (let index = 1; index <= (extraTasks.count || 2); index += 1) {
      extraTasksSection += `- [ ] ${this.t('template.extraTaskLabel')} ${index} - ${extraTasks.pointsPerTask || 50}\n`;
    }

    let pomodoroSection = '';
    for (let index = 0; index < pomodoro.count; index += 1) {
      pomodoroSection += `- [ ] ${this.t('template.completePomodoro')}\n`;
    }

    const templateContent = `---
date: {{date}}
${this.t('template.weather')}:
${this.t('template.mood')}:
---

> **${this.t('template.frontmatterNote')}** | ${this.t('template.frontmatterHint')}

---

## 📝 ${this.t('template.mainTasks')} (${this.t('template.maxOnly', { value: mainTasks.count * mainTasks.pointsPerTask })})
${mainTasksSection}
---

## ✅ ${this.t('template.habits')} (${this.t('template.maxOnly', { value: habits.reduce((sum, habit) => sum + (habit.points || 10), 0) })})
${habitsSection}
---

## 📌 ${this.t('template.extraTasks')} (${this.t('template.maxOnly', { value: (extraTasks.count || 2) * (extraTasks.pointsPerTask || 50) })})
${extraTasksSection}
---

## 🍅 ${this.t('template.pomodoro')} (${this.t('template.eachMax', { each: pomodoro.pointsPerPomodoro || 50, max: (pomodoro.count || 6) * (pomodoro.pointsPerPomodoro || 50) })})
${pomodoroSection}
---

> ${this.t('template.checkinCommandHint')}

---

### 📒 ${this.t('template.checkinRecord')}

<!-- supreme-player:start -->
<!-- supreme-player:end -->

- {{date}} -
`;

    let templatePath = templatePathOverride || config.templatePath || this.plugin.dataStore.autoDetectTemplatePath();
    if (!templatePath.endsWith('.md')) {
      templatePath += '.md';
    }

    try {
      await this.app.vault.adapter.write(templatePath, templateContent);
      new Notice(this.t('template.updated'));
    } catch (error) {
      console.error('[Template] Error:', error);
      new Notice(this.t('template.updateFailed', { message: error.message }));
    }
  }
}

module.exports = SupremePlayerSettingTab;
