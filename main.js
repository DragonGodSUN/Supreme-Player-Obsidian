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
    function translate(t, key, variables) {
      return typeof t === "function" ? t(key, variables) : key;
    }
    function showNotice(message) {
      new Notice(message);
    }
    function createElement(tag, styles, innerHTML) {
      const element = document.createElement(tag);
      if (styles)
        element.style.cssText = styles;
      if (innerHTML)
        element.innerHTML = innerHTML;
      return element;
    }
    function createButton(text, className, onClick) {
      const button = document.createElement("button");
      button.textContent = text;
      if (className)
        button.className = className;
      if (onClick)
        button.onclick = onClick;
      return button;
    }
    function createFlexContainer(gap = "10px") {
      const container = document.createElement("div");
      container.style.display = "flex";
      container.style.gap = gap;
      return container;
    }
    function renderEffectParams(type, effectParams, t) {
      effectParams.innerHTML = "";
      switch (type) {
        case "add_wish_stars":
        case "add_level":
        case "add_points": {
          effectParams.innerHTML = `
        <div style="margin-bottom: 5px;">${translate(t, "effect.value")}</div>
        <input type="number" id="effect-value" value="${type === "add_points" ? 100 : 1}" min="1" style="width: 100%;">
      `;
          break;
        }
        case "buff":
          effectParams.innerHTML = `
        <div style="margin-bottom: 5px;">${translate(t, "effect.buffName")}</div>
        <input type="text" id="buff-name" placeholder="${translate(t, "common.placeholder")}\uFF1A${translate(t, "utils.buffNameExample")}" style="width: 100%; margin-bottom: 10px;">
        <div style="margin-bottom: 5px;">${translate(t, "effect.buffIcon")}</div>
        <input type="text" id="buff-icon" placeholder="${translate(t, "common.placeholder")}\uFF1A\u2728" style="width: 100%; margin-bottom: 10px;">
        <div style="margin-bottom: 5px;">${translate(t, "effect.buffDescription")}</div>
        <input type="text" id="buff-desc" placeholder="${translate(t, "common.placeholder")}\uFF1A${translate(t, "utils.buffDescExample")}" style="width: 100%; margin-bottom: 10px;">
        <div style="margin-bottom: 5px;">${translate(t, "effect.buffDuration")}</div>
        <input type="number" id="buff-duration" value="24" min="1" style="width: 100%;">
      `;
          break;
        case "random_wish_stars":
          effectParams.innerHTML = `
        <div style="display: flex; gap: 10px;">
          <div style="flex: 1;">
            <div style="margin-bottom: 5px;">${translate(t, "effect.min")}</div>
            <input type="number" id="effect-min" value="1" min="1" style="width: 100%;">
          </div>
          <div style="flex: 1;">
            <div style="margin-bottom: 5px;">${translate(t, "effect.max")}</div>
            <input type="number" id="effect-max" value="5" min="1" style="width: 100%;">
          </div>
        </div>
      `;
          break;
      }
    }
    function buildEffectFromForm(category, effectType, t) {
      var _a, _b, _c, _d, _e, _f, _g;
      if (category !== "system") {
        return null;
      }
      switch (effectType) {
        case "add_wish_stars":
        case "add_level":
        case "add_points":
          return {
            type: effectType,
            value: parseInt((_a = document.getElementById("effect-value")) == null ? void 0 : _a.value, 10) || 1
          };
        case "buff": {
          const buffName = (_b = document.getElementById("buff-name")) == null ? void 0 : _b.value.trim();
          if (!buffName) {
            showNotice(translate(t, "effect.enterBuffName"));
            return null;
          }
          return {
            type: "buff",
            buffName,
            buffIcon: ((_c = document.getElementById("buff-icon")) == null ? void 0 : _c.value.trim()) || "\u2728",
            buffDesc: ((_d = document.getElementById("buff-desc")) == null ? void 0 : _d.value.trim()) || "",
            duration: parseInt((_e = document.getElementById("buff-duration")) == null ? void 0 : _e.value, 10) || 24
          };
        }
        case "random_wish_stars":
          return {
            type: effectType,
            min: parseInt((_f = document.getElementById("effect-min")) == null ? void 0 : _f.value, 10) || 1,
            max: parseInt((_g = document.getElementById("effect-max")) == null ? void 0 : _g.value, 10) || 5
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

// src/i18n.js
var require_i18n = __commonJS({
  "src/i18n.js"(exports2, module2) {
    var SUPPORTED_LANGUAGES = ["en", "zh"];
    var translations = {
      en: {
        "command.processDailyNote": "Daily Check-in",
        "command.showStats": "Show Current Status",
        "command.syncAccountInfo": "Sync Account Info",
        "command.makeWish": "Make a Wish",
        "command.showWishPool": "Show Wish Pool",
        "command.openShop": "Open Shop",
        "command.openInventory": "Open Inventory",
        "common.add": "Add",
        "common.backToPanel": "Back to Panel",
        "common.cancel": "Cancel",
        "common.close": "Close",
        "common.confirm": "Confirm",
        "common.configure": "Configure",
        "common.create": "Create",
        "common.delete": "Delete",
        "common.description": "Description",
        "common.edit": "Edit",
        "common.export": "Export",
        "common.icon": "Icon",
        "common.import": "Import",
        "common.manage": "Manage",
        "common.name": "Name",
        "common.none": "None",
        "common.placeholder": "For example",
        "common.price": "Price",
        "common.rarity": "Rarity",
        "common.save": "Save",
        "common.select": "Select",
        "common.type": "Type",
        "common.enabled": "Enabled",
        "common.disabled": "Disabled",
        "category.system": "System",
        "category.external": "External",
        "rarity.rare": "Rare",
        "rarity.legendary": "Legendary",
        "template.detected": "Detected: {path}",
        "template.autoDetect": "Auto Detect",
        "template.createTitle": "Create Template",
        "template.createMissing": "Auto-detected template path does not exist:",
        "template.createPrompt": "Create a default daily template file now?",
        "template.createNow": "Create",
        "template.createLater": "Later",
        "template.savedPath": "Template path saved: {path}",
        "template.updated": "Daily template updated.",
        "template.updateFailed": "Failed to update template: {message}",
        "template.frontmatterNote": "Daily Record",
        "template.frontmatterHint": "Run the check-in command to update the account data below",
        "template.mainTasks": "Main Tasks",
        "template.habits": "Habits",
        "template.extraTasks": "Extra Tasks",
        "template.pomodoro": "Pomodoro",
        "template.checkinCommandHint": "After finishing tasks, press `Ctrl+P` and run **Daily Check-in**",
        "template.checkinRecord": "Check-in Record (auto generated)",
        "template.taskLabel": "Task",
        "template.extraTaskLabel": "Extra Task",
        "template.completePomodoro": "Complete \u{1F345}",
        "template.weather": "weather",
        "template.mood": "mood",
        "template.maxOnly": "max {value}",
        "template.eachMax": "each {each}, max {max}",
        "shop.title": "Item Shop",
        "shop.info": "Rare Cards: {rare}  Legendary Cards: {legendary}",
        "shop.purchaseTitle": "Confirm Purchase",
        "shop.purchasePrompt": "Buy this item and spend {currency} {price}?",
        "shop.confirmPurchase": "Confirm Purchase",
        "inventory.title": "Inventory",
        "inventory.empty": "Your inventory is empty. Visit the shop first.",
        "inventory.tapToUse": "Click to use",
        "inventory.useTitle": "Use Item",
        "inventory.externalHint": "This is an external item. Please fulfill it manually after use.",
        "inventory.use": "Use",
        "inventory.useExternal": "Use and Confirm",
        "wish.modalTitle": "Make a Wish",
        "wish.nameLabel": "Wish Name",
        "wish.namePlaceholder": "For example: Pass the exam smoothly",
        "wish.descLabel": "Wish Description (Optional)",
        "wish.descPlaceholder": "Describe your wish in more detail...",
        "wish.help": "After creating a wish, invest wish stars in the pool. Each star adds 10% progress, and at 100% you cast the wish and interfere with the world line.",
        "wish.create": "Create Wish",
        "wish.poolTitle": "Wish Pool",
        "wish.poolStats": "Wish Stars: {stars}  World-Line Interventions: {completed}",
        "wish.activeTitle": "Active Wishes",
        "wish.complete": "Cast Wish",
        "wish.invest": "Invest (Costs 1 Wish Star)",
        "wish.completed": "Cast",
        "wish.noActive": "No active wishes right now.",
        "wish.newWish": "Make a New Wish",
        "wish.completedTitle": "Wish Cast!",
        "wish.completedHeadline": "Your wish has interfered with the world line.",
        "wish.completedBuff": "Luck buff is now active for 24 hours.",
        "wish.completedBonus": "Bonus points +{points}",
        "wish.completedThanks": "Thanks for the blessing",
        "wish.errorNameRequired": "Please enter a wish name.",
        "wish.errorNotEnoughStars": "Not enough wish stars.",
        "wish.investSuccess": "Investment successful! Progress +10%",
        "wish.historyTitle": "Wish History",
        "wish.historyEmpty": "No completed wishes yet.",
        "wish.historyItem": "{name} - {date}",
        "wish.historyBack": "Back to Wish Pool",
        "wish.historyDelete": "Delete this record",
        "wish.historyDeleteConfirm": "Delete this wish record? This cannot be undone.",
        "ui.levelSystemTitle": "Level & Title System",
        "ui.currentLevel": "Current Level",
        "ui.totalPoints": "Total Points",
        "ui.levelStages": "Level Stages",
        "ui.currentTag": "Current",
        "ui.pointsUnit": "points",
        "ui.playerPanel": "{name} Player Panel",
        "ui.stat.points": "Points",
        "ui.stat.level": "Level",
        "ui.stat.wishStars": "Wish Stars",
        "ui.stat.inventory": "Inventory Items",
        "ui.stat.nextLevel": "To Next Level",
        "ui.activeBuffs": "Active Buffs",
        "ui.dailyCheckIn": "Daily Check-in",
        "ui.goWishPool": "Go to Wish Pool",
        "ui.goShop": "Go to Shop",
        "ui.openInventory": "Open Inventory",
        "ui.checkInTitle": "Daily Check-in",
        "ui.todayDone": "Today is already checked in",
        "ui.comeTomorrow": "Come back tomorrow!",
        "ui.todayPoints": "Today's Points",
        "ui.basePoints": "base points",
        "ui.progress": "Progress",
        "ui.taskSummary": "Task Summary",
        "ui.mainTasks": "Main Tasks",
        "ui.habits": "Habits",
        "ui.perfectHint": "Perfect check-in! All core tasks are complete.",
        "ui.keepGoingHint": "Keep going. Finish all core tasks to get a perfect check-in reward.",
        "ui.perfectCheckIn": "Perfect Check-in",
        "ui.confirmCheckIn": "Confirm Check-in",
        "ui.checkInConfirmTitle": "Confirm Check-in",
        "ui.checkInConfirmHeadline": "Confirm today's check-in?",
        "ui.pointsEarned": "Points earned today",
        "ui.pointsToPerfect": "Points needed for perfect check-in",
        "ui.perfectRewardHint": "Finish all core tasks to unlock the perfect check-in reward.",
        "ui.keepWorking": "Keep Working",
        "ui.perfectTitle": "Perfect Check-in!",
        "ui.rewardAdded": "{icon} {name} was added to your inventory.",
        "ui.perfectThanks": "Thank you for the blessing",
        "ui.frequency": "Check-in Frequency",
        "ui.frequencyTitle": "Check-in Frequency",
        "ui.frequencyOpen": "View Frequency Chart",
        "ui.frequencyTodayDone": "Today's check-in is completed.",
        "ui.frequencyTodayPending": "Today has not been checked in yet.",
        "ui.frequencyRecentDays": "Recent {days} Days",
        "ui.frequencyNoData": "No check-in data yet. Complete your first check-in to start the chart.",
        "ui.frequencyChecked": "Checked In",
        "ui.frequencyMissed": "Missed",
        "ui.frequencyTotal": "Total Check-ins",
        "ui.frequencyRate": "Completion Rate",
        "ui.frequencyCurrentStreak": "Current Streak",
        "ui.frequencyLongestStreak": "Best Streak",
        "ui.frequencyCalendarTitle": "Recent Activity Calendar",
        "ui.frequencyCalendarHint": "Each tile represents one day. Today is highlighted so you can spot your rhythm at a glance.",
        "ui.frequencyRecentWeekTitle": "Recent 7-Day Activity",
        "ui.frequencyRecentWeekHint": "Shows only the latest 7 days. Expand the calendar to view the current month.",
        "ui.frequencyMonthTitle": "Current Month Calendar",
        "ui.frequencyMonthHint": "Expanded view for the current month check-in record.",
        "ui.frequencyCurrentMonth": "Current Month",
        "ui.frequencyExpandCalendar": "Expand Calendar",
        "ui.frequencyInsights": "Quick Insights",
        "ui.frequencyBuffTitle": "Current Streak Buff",
        "ui.frequencyBuffActive": "{icon} {name}  +{percent}%",
        "ui.frequencyBuffInactive": "No streak buff active",
        "ui.frequencyWarmup": "Warm-up Cards",
        "ui.frequencyEffectiveStreak": "Effective Streak",
        "ui.frequencyNextBuff": "Next Buff",
        "ui.frequencyRemainingDays": "{count} more day(s)",
        "ui.frequencyReadyNow": "Ready now",
        "ui.frequencyDoneDays": "{count} days completed",
        "ui.frequencyMissedDays": "{count} days missed",
        "ui.frequencyLongestStreakText": "Best streak: {count} days",
        "ui.frequencyTodayTag": "Today",
        "ui.frequencyRecentStatus": "Last 7 Days",
        "ui.frequencyWeekMon": "Mon",
        "ui.frequencyWeekTue": "Tue",
        "ui.frequencyWeekWed": "Wed",
        "ui.frequencyWeekThu": "Thu",
        "ui.frequencyWeekFri": "Fri",
        "ui.frequencyWeekSat": "Sat",
        "ui.frequencyWeekSun": "Sun",
        "settings.title": "Supreme Player Settings",
        "settings.user": "User",
        "settings.language": "Interface Language",
        "settings.languageDesc": "Default follows the current Obsidian language.",
        "settings.languageAuto": "Follow Obsidian",
        "settings.languageZh": "\u7B80\u4F53\u4E2D\u6587",
        "settings.languageEn": "English",
        "settings.playerName": "Player Name",
        "settings.playerNameDesc": "Set your in-game name shown in the status panel.",
        "settings.playerNamePlaceholder": "Player",
        "settings.defaultPlayerName": "Player",
        "settings.data": "Data Storage",
        "settings.dataPath": "Data File Path",
        "settings.dataPathDesc": "Path to the account data file. Leave blank to auto-detect the daily notes folder.",
        "settings.template": "Daily Template",
        "settings.templatePath": "Template File Path",
        "settings.templatePathDesc": "Path to the daily note template. Leave blank to auto-detect it.",
        "settings.updateTemplate": "Update Daily Template",
        "settings.updateTemplateDesc": "Refresh the daily template file using the current task configuration.",
        "settings.debugTitle": "Debug",
        "settings.debugMode": "Debug Mode",
        "settings.debugModeDesc": "Show diagnostic info and suggestions in settings.",
        "settings.debugInfoTitle": "Diagnostic Info",
        "settings.debugResolvedLanguage": "Resolved Language",
        "settings.debugLanguageMode": "Language Setting",
        "settings.debugTodayNotePath": "Expected Today Note",
        "settings.debugTodayNoteFound": "Matched Today Note",
        "settings.debugTemplatePath": "Template Path",
        "settings.debugTemplateExists": "Template Exists",
        "settings.debugDataPath": "Data Path",
        "settings.debugDataExists": "Data Exists",
        "settings.debugActiveFile": "Active File",
        "settings.debugDailyFolder": "Daily Folder",
        "settings.debugDailyFormat": "Daily Format",
        "settings.debugParsedMainTasks": "Parsed Main Tasks",
        "settings.debugParsedHabits": "Parsed Habits",
        "settings.debugParsedExtraTasks": "Parsed Extra Tasks",
        "settings.debugParsedPomodoros": "Parsed Pomodoros",
        "settings.debugParsedPoints": "Parsed Points",
        "settings.debugSuggestions": "Suggestions",
        "settings.debugSuggestionMissingToday": "Today's note is not found. Check the Daily Notes folder and filename format.",
        "settings.debugSuggestionMissingTemplate": "Template file is missing. Use auto-detect or create the template first.",
        "settings.debugSuggestionMissingData": "Data file is missing. The plugin can recreate it after saving or check-in.",
        "settings.debugSuggestionNoPlugin": "Daily Notes or Periodic Notes settings are not detected. Auto-detection may fall back to defaults.",
        "settings.debugSuggestionHealthy": "Current configuration looks healthy.",
        "settings.unlock": "Unlock Editing",
        "settings.unlockDesc": "Click 42 times to unlock editing. It auto-locks again after 30 minutes.",
        "settings.dailyTasks": "Daily Task Config",
        "settings.dailyTasksDesc": "Configure daily tasks, habits, extra tasks, and pomodoro values.",
        "settings.perfectConfig": "Perfect Check-in Config",
        "settings.perfectConfigDesc": "Configure perfect check-in rewards and blessing text.",
        "settings.shop": "Shop Management",
        "settings.shopAdd": "Add Item",
        "settings.shopAddDesc": "Add a custom item to the shop.",
        "settings.shopEdit": "Edit Item",
        "settings.shopEditDesc": "Edit an existing custom item.",
        "settings.shopDelete": "Delete Item",
        "settings.shopDeleteDesc": "Delete a custom item.",
        "settings.shopExport": "Export Shop Config",
        "settings.shopExportDesc": "Export custom shop items as JSON.",
        "settings.shopImport": "Import Shop Config",
        "settings.shopImportDesc": "Import shop items from a JSON file.",
        "settings.levels": "Level Management",
        "settings.levelsEdit": "Edit Levels",
        "settings.levelsEditDesc": "Edit titles, abilities, and phases for each level.",
        "settings.levelsAdd": "Add Level",
        "settings.levelsAddDesc": "Add a new level configuration.",
        "settings.currencies": "Currency Management",
        "settings.currenciesDesc": "View and manage all currency types.",
        "settings.dataIO": "Data Import / Export",
        "settings.exportData": "Export Data",
        "settings.exportDataDesc": "Export all account data as JSON.",
        "settings.importData": "Import Data",
        "settings.importDataDesc": "Import account data from a JSON file.",
        "settings.waitToLock": "Please wait {seconds} seconds before locking again.",
        "settings.locked": "Editing has been locked.",
        "settings.unlocked": "Editing unlocked. It will auto-lock in 30 minutes.",
        "settings.autoLocked": "Editing has been auto-locked.",
        "settings.unlockActive": "Unlocked",
        "settings.clickToUnlock": "Click to Unlock",
        "settings.confirmLock": "Confirm Lock ({remaining})",
        "settings.clicksRemaining": "{remaining} clicks remaining",
        "settings.dataExported": "Data exported.",
        "settings.shopExported": "Shop config exported.",
        "settings.noShopToExport": "No shop items available to export.",
        "settings.invalidShopConfig": "Invalid shop config file.",
        "settings.shopImportSuccess": "Successfully imported {count} items.",
        "settings.importFailed": "Import failed: {message}",
        "settings.enterItemName": "Please enter an item name.",
        "settings.enterLevelTitle": "Please enter a level title.",
        "settings.enterCurrencyName": "Please enter a currency name.",
        "settings.noEditableItems": "No items are available to edit.",
        "settings.noDeletableItems": "No items are available to delete.",
        "settings.dailyTaskModalTitle": "Daily Task Configuration",
        "settings.mainTasks": "Main Tasks",
        "settings.taskCount": "Task Count",
        "settings.pointsPerTask": "Points Per Task",
        "settings.habitList": "Habits",
        "settings.addHabit": "Add Habit",
        "settings.habitNamePlaceholder": "Habit name",
        "settings.habitNewName": "New Habit",
        "settings.extraTasks": "Extra Tasks",
        "settings.maxPoints": "Max Points: {value}",
        "settings.pomodoro": "Pomodoro",
        "settings.pointsPerPomodoro": "Points Per Pomodoro",
        "settings.dailyTasksSaved": "Daily task configuration saved.",
        "settings.perfectConfigModalTitle": "Perfect Check-in Configuration",
        "settings.rewardType": "Reward Type",
        "settings.rewardShop": "Shop Item",
        "settings.rewardExclusive": "Exclusive Reward Item",
        "settings.selectShopItem": "Select Shop Item",
        "settings.exclusiveConfig": "Exclusive Reward Settings",
        "settings.exclusiveHint": "Exclusive rewards can only be obtained from perfect check-ins and cannot be bought in the shop.",
        "settings.itemName": "Item Name",
        "settings.itemDescription": "Item Description",
        "settings.itemIcon": "Item Icon",
        "settings.selectRarity": "Select Rarity",
        "settings.blessingConfig": "Blessing Text",
        "settings.blessingTitle": "Blessing Title",
        "settings.blessingMessage": "Blessing Message",
        "settings.enablePerfectReward": "Enable perfect check-in reward",
        "settings.perfectConfigSaved": "Perfect check-in configuration saved.",
        "settings.addItemTitle": "Add Item",
        "settings.editItemTitle": "Edit Item",
        "settings.deleteItemTitle": "Delete Item",
        "settings.itemNameInputPlaceholder": "For example: Mystery Blessing Bag",
        "settings.itemDescInputPlaceholder": "Describe the item effect or promise",
        "settings.itemIconPlaceholder": "For example: \u{1F381}",
        "settings.itemCategory": "Item Category",
        "settings.systemItem": "System item (takes effect automatically)",
        "settings.externalItem": "External item (redeem manually)",
        "settings.effectConfig": "Reward Effect Settings",
        "settings.effectType": "Effect Type",
        "settings.deleteWarning": "This action cannot be undone.",
        "settings.editLevelsTitle": "Edit Levels",
        "settings.levelRange": "Lv.{min} - {max}",
        "settings.levelRangeInfinite": "Lv.{min} - \u221E",
        "settings.levelAbility": "Ability: {value}",
        "settings.levelPhase": "Phase: {value}",
        "settings.editLevelTitle": "Edit Level: {title}",
        "settings.levelTitle": "Title",
        "settings.levelAbilityLabel": "Ability",
        "settings.levelAbilityIcon": "Ability Icon",
        "settings.levelPhaseLabel": "Phase",
        "settings.levelPhaseIcon": "Phase Icon",
        "settings.levelColor": "Color",
        "settings.levelMin": "Minimum Level",
        "settings.levelMax": "Maximum Level",
        "settings.deleteLevel": "Delete This Level",
        "settings.deleteClickAgain": "Click again to confirm delete",
        "settings.deleteClickFinal": "Click one more time to delete",
        "settings.addLevelTitle": "Add Level",
        "settings.levelTitlePlaceholder": "For example: Star Envoy",
        "settings.levelAbilityPlaceholder": "For example: Rewrite Reality",
        "settings.levelPhasePlaceholder": "For example: Mortal",
        "settings.manageCurrenciesTitle": "Manage Currencies",
        "settings.currencyEditable": "Editable",
        "settings.currencyGainRule": "Every {rate} points +{amount}",
        "settings.addCurrencyTitle": "Add Currency",
        "settings.editCurrencyTitle": "Edit Currency: {name}",
        "settings.currencyDescription": "Currency Description",
        "settings.currencyRate": "Earn Rate (points)",
        "settings.currencyColor": "Color",
        "settings.currencyNamePlaceholder": "For example: Gold Coin",
        "settings.currencyIconPlaceholder": "For example: \u{1FA99}",
        "settings.currencyDescPlaceholder": "Describe what this currency is used for",
        "settings.currencyRatePlaceholder": "1000",
        "settings.currencyColorPlaceholder": "#00ff00",
        "settings.currencyHint": "New currencies are automatically added to the system and earned from check-ins based on points.",
        "settings.templateButton": "Update Template",
        "effect.addWishStars": "Add Wish Stars",
        "effect.addLevel": "Add Level",
        "effect.buff": "Add Buff",
        "effect.randomWishStars": "Random Wish Stars",
        "effect.addPoints": "Add Points",
        "effect.value": "Value",
        "effect.buffName": "Buff Name",
        "effect.buffIcon": "Buff Icon",
        "effect.buffDescription": "Buff Description",
        "effect.buffDuration": "Duration (hours)",
        "effect.min": "Minimum",
        "effect.max": "Maximum",
        "effect.enterBuffName": "Please enter a buff name.",
        "datastore.currency.wishStars.name": "Wish Star",
        "datastore.currency.wishStars.desc": "Used for wishes and world-line progress.",
        "datastore.currency.rareItemCards.name": "Rare Item Card",
        "datastore.currency.rareItemCards.desc": "Used to buy rare items.",
        "datastore.currency.legendaryItemCards.name": "Legendary Item Card",
        "datastore.currency.legendaryItemCards.desc": "Used to buy legendary items.",
        "datastore.habit.wakeUp": "Wake up early",
        "datastore.habit.exercise": "Exercise",
        "datastore.habit.read": "Read",
        "datastore.level.0.title": "Star Whisperer",
        "datastore.level.0.ability": "Bend Reality",
        "datastore.level.0.phase": "Mortal",
        "datastore.level.1.title": "Dream Weaver",
        "datastore.level.1.ability": "Rewrite Reality",
        "datastore.level.1.phase": "Ascendant",
        "datastore.level.2.title": "Creator",
        "datastore.level.2.ability": "Manifest Creation",
        "datastore.level.2.phase": "Demigod",
        "datastore.level.3.title": "World Keeper",
        "datastore.level.3.ability": "Control the World",
        "datastore.level.3.phase": "True God",
        "datastore.level.4.title": "Origin Star Deity",
        "datastore.level.4.ability": "Guide the Cosmos",
        "datastore.level.4.phase": "Star God",
        "datastore.level.5.title": "Infinite",
        "datastore.level.5.ability": "Beyond All Limits",
        "datastore.level.5.phase": "Transcendent",
        "datastore.shop.wish-star-boost.name": "Wish Star Booster",
        "datastore.shop.wish-star-boost.desc": "Get 5 wish stars immediately.",
        "datastore.shop.level-skip.name": "Level Skip Ticket",
        "datastore.shop.level-skip.desc": "Gain 5000 points immediately.",
        "datastore.shop.warmup-card.name": "Warm-up Card",
        "datastore.shop.warmup-card.desc": "Reduce current streak buff requirements by 1 day. Stackable while maintaining a continuous check-in chain.",
        "datastore.shop.mystery-box.name": "Mystery Box",
        "datastore.shop.mystery-box.desc": "Randomly get 1-10 wish stars.",
        "datastore.shop.milk.name": "Milk",
        "datastore.shop.milk.desc": "Clear all active buffs.",
        "datastore.reward.superDiamond.name": "Super Diamond",
        "datastore.reward.superDiamond.desc": "Perfect check-in reward. Grants random wish stars and a strong luck buff.",
        "datastore.reward.defaultBlessingTitle": "Excellent work!",
        "datastore.reward.defaultBlessingMessage": "Every perfect check-in is a great investment in yourself.",
        "inventory.message.itemNotFound": "Item not found.",
        "inventory.message.purchaseSuccess": "Purchase successful. The item was added to your inventory.",
        "inventory.message.usedSuccess": "{name} used successfully",
        "inventory.message.usedSuccessWithEffect": "{name} used successfully - {effect}",
        "inventory.message.externalUsed": "{name} marked as used. Please redeem it manually.",
        "inventory.message.useFailed": "Failed to use item.",
        "inventory.effect.addWishStars": "Gain {value} wish stars",
        "inventory.effect.addLevel": "Gain {value} level",
        "inventory.effect.addPoints": "Gain {value} points",
        "inventory.effect.randomWishStars": "Gain {value} random wish stars",
        "inventory.effect.checkInWarmup": "Warm-up +{value}, total {total}. Next target {target}, remaining {remaining} day(s)",
        "inventory.effect.buff": "Gain buff: {name}",
        "inventory.effect.superDiamond": "Gain {value} wish stars and Super Luck",
        "inventory.effect.clearAllBuffs": "All buffs cleared",
        "inventory.buff.superLuckName": "Super Luck",
        "inventory.buff.superLuckDesc": "Starlight surrounds you and luck surges.",
        "inventory.buff.checkInEnhanceName": "Enhanced",
        "inventory.buff.checkInEnhanceDesc": "After a 3-day streak, daily check-in points increase by 20%.",
        "inventory.buff.checkInTranscendentName": "Transcendent",
        "inventory.buff.checkInTranscendentDesc": "After a 7-day streak, daily check-in points increase by 50%.",
        "utils.buffNameExample": "Lucky Aura",
        "utils.buffDescExample": "Fortune favors you today",
        "datastore.reward.levelUp": "Level up to {level}!",
        "datastore.reward.currencyGain": "{icon} {name} +{amount}!",
        "wish.message.created": "Wish created successfully.",
        "wish.message.notEnoughStars": "Not enough wish stars.",
        "wish.message.notFound": "Wish not found.",
        "wish.message.inactive": "This wish can no longer be boosted.",
        "wish.message.progress": "Wish progress +{amount}%",
        "wish.message.progressNotFull": "Wish progress is not full yet.",
        "wish.message.completed": "Wish cast successfully. The world line has shifted.",
        "wish.blessing.0": "May the starlight guide your steps.",
        "wish.blessing.1": "The world line is quietly shifting in your favor.",
        "wish.blessing.2": "Fortune is already on the way to you.",
        "wish.blessing.3": "Your wish has been heard. Let it bloom.",
        "wish.blessing.4": "May good luck stay with you today.",
        "shop.message.notEnoughRareCards": "Not enough rare item cards.",
        "shop.message.notEnoughLegendaryCards": "Not enough legendary item cards.",
        "datastore.message.importSuccess": "Data imported successfully.",
        "datastore.message.importFailed": "Data import failed: {message}",
        "datastore.message.shopConfigMissing": "Shop config does not exist.",
        "datastore.message.configMissing": "Config does not exist.",
        "datastore.message.levelConfigMissing": "Level config does not exist.",
        "datastore.message.levelNotFound": "Level not found.",
        "datastore.message.currencyNotFound": "Currency not found.",
        "datastore.message.customCurrencyListMissing": "Custom currency list does not exist.",
        "datastore.message.systemCurrencyLocked": "System currency cannot be edited.",
        "datastore.message.itemAdded": "Item added successfully.",
        "datastore.message.itemUpdated": "Item updated successfully.",
        "datastore.message.itemDeleted": "Item deleted successfully.",
        "datastore.message.levelAdded": "Level added successfully.",
        "datastore.message.levelUpdated": "Level updated successfully.",
        "datastore.message.levelDeleted": "Level deleted successfully.",
        "datastore.message.currencyAdded": "Currency added successfully.",
        "datastore.message.currencyUpdated": "Currency updated successfully.",
        "datastore.message.currencyDeleted": "Currency deleted successfully.",
        "core.noActiveWishes": "No active wishes",
        "core.accountTitle": "Supreme Player Account",
        "core.dailySummaryTitle": "Supreme Player Daily Summary",
        "core.todayPointsLabel": "Today points",
        "core.currentPointsLabel": "Current points",
        "core.wishStarsLabel": "Wish Stars",
        "core.rareCardsLabel": "Rare Item Cards",
        "core.legendaryCardsLabel": "Legendary Item Cards",
        "core.wishPoolLabel": "Wish Pool",
        "core.syncedAtLabel": "Synced at",
        "core.status.level": "Level",
        "core.status.totalPoints": "Total Points",
        "core.status.todayPoints": "Today Points",
        "core.status.wishStars": "Wish Stars",
        "core.status.rareCards": "Rare Item Cards",
        "core.status.legendaryCards": "Legendary Item Cards",
        "core.status.inventory": "Inventory",
        "core.status.activeBuffs": "Active Buffs",
        "core.status.none": "None",
        "core.todayNoteMissing": "Today's note was not found. Please create it first.",
        "core.todayAlreadyProcessed": "Today's note has already been processed.",
        "core.checkinComplete": "Check-in complete! +{points} points",
        "core.checkinBonusApplied": "(Streak {streak} days, +{percent}%: {base} \u2192 {total})",
        "core.levelUp": "Level up to Lv.{level}!",
        "core.processFailed": "Processing failed: {message}",
        "core.openFileFirst": "Please open a file first.",
        "core.markdownOnly": "The current file is not a Markdown file.",
        "core.accountSynced": "Account info synced.",
        "core.nothingToUpdate": "No updates were needed.",
        "core.accountInserted": "Account info was inserted at the end of the file.",
        "core.syncFailed": "Sync failed: {message}"
      },
      zh: {
        "command.processDailyNote": "\u6BCF\u65E5\u6253\u5361",
        "command.showStats": "\u67E5\u770B\u5F53\u524D\u72B6\u6001",
        "command.syncAccountInfo": "\u540C\u6B65\u8D26\u6237\u4FE1\u606F",
        "command.makeWish": "\u8BB8\u4E0B\u613F\u671B",
        "command.showWishPool": "\u67E5\u770B\u8BB8\u613F\u6C60",
        "command.openShop": "\u6253\u5F00\u5546\u5E97",
        "command.openInventory": "\u6253\u5F00\u80CC\u5305",
        "common.add": "\u6DFB\u52A0",
        "common.backToPanel": "\u8FD4\u56DE\u9762\u677F",
        "common.cancel": "\u53D6\u6D88",
        "common.close": "\u5173\u95ED",
        "common.confirm": "\u786E\u8BA4",
        "common.configure": "\u914D\u7F6E",
        "common.create": "\u521B\u5EFA",
        "common.delete": "\u5220\u9664",
        "common.description": "\u63CF\u8FF0",
        "common.edit": "\u7F16\u8F91",
        "common.export": "\u5BFC\u51FA",
        "common.icon": "\u56FE\u6807",
        "common.import": "\u5BFC\u5165",
        "common.manage": "\u7BA1\u7406",
        "common.name": "\u540D\u79F0",
        "common.none": "\u65E0",
        "common.placeholder": "\u4F8B\u5982",
        "common.price": "\u4EF7\u683C",
        "common.rarity": "\u7A00\u6709\u5EA6",
        "common.save": "\u4FDD\u5B58",
        "common.select": "\u9009\u62E9",
        "common.type": "\u7C7B\u578B",
        "common.enabled": "\u542F\u7528",
        "common.disabled": "\u7981\u7528",
        "category.system": "\u7CFB\u7EDF",
        "category.external": "\u5916\u90E8",
        "rarity.rare": "\u7A00\u6709",
        "rarity.legendary": "\u4F20\u5947",
        "template.detected": "\u5DF2\u68C0\u6D4B\u5230\uFF1A{path}",
        "template.autoDetect": "\u81EA\u52A8\u68C0\u6D4B",
        "template.createTitle": "\u521B\u5EFA\u6A21\u677F",
        "template.createMissing": "\u81EA\u52A8\u68C0\u6D4B\u5230\u7684\u6A21\u677F\u8DEF\u5F84\u4E0D\u5B58\u5728\uFF1A",
        "template.createPrompt": "\u662F\u5426\u73B0\u5728\u521B\u5EFA\u9ED8\u8BA4\u7684\u65E5\u8BB0\u6A21\u677F\u6587\u4EF6\uFF1F",
        "template.createNow": "\u521B\u5EFA",
        "template.createLater": "\u7A0D\u540E",
        "template.savedPath": "\u6A21\u677F\u8DEF\u5F84\u5DF2\u4FDD\u5B58\uFF1A{path}",
        "template.updated": "\u65E5\u8BB0\u6A21\u677F\u5DF2\u66F4\u65B0\u3002",
        "template.updateFailed": "\u6A21\u677F\u66F4\u65B0\u5931\u8D25\uFF1A{message}",
        "template.frontmatterNote": "\u6BCF\u65E5\u8BB0\u5F55",
        "template.frontmatterHint": "\u8FD0\u884C\u6253\u5361\u547D\u4EE4\u540E\u4F1A\u5728\u4E0B\u65B9\u66F4\u65B0\u8D26\u6237\u6570\u636E",
        "template.mainTasks": "\u4E3B\u4EFB\u52A1",
        "template.habits": "\u4E60\u60EF",
        "template.extraTasks": "\u989D\u5916\u4EFB\u52A1",
        "template.pomodoro": "\u756A\u8304\u949F",
        "template.checkinCommandHint": "\u5B8C\u6210\u4EFB\u52A1\u540E\uFF0C\u6309 `Ctrl+P` \u5E76\u8FD0\u884C **\u6BCF\u65E5\u6253\u5361**",
        "template.checkinRecord": "\u6253\u5361\u8BB0\u5F55\uFF08\u81EA\u52A8\u751F\u6210\uFF09",
        "template.taskLabel": "\u4EFB\u52A1",
        "template.extraTaskLabel": "\u989D\u5916\u4EFB\u52A1",
        "template.completePomodoro": "\u5B8C\u6210\u4E00\u4E2A \u{1F345}",
        "template.weather": "\u5929\u6C14",
        "template.mood": "\u5FC3\u60C5",
        "template.maxOnly": "\u6700\u9AD8 {value}",
        "template.eachMax": "\u6BCF\u4E2A {each}\uFF0C\u6700\u9AD8 {max}",
        "shop.title": "\u9053\u5177\u5546\u5E97",
        "shop.info": "\u7A00\u6709\u5361\uFF1A{rare}  \u4F20\u5947\u5361\uFF1A{legendary}",
        "shop.purchaseTitle": "\u786E\u8BA4\u8D2D\u4E70",
        "shop.purchasePrompt": "\u8D2D\u4E70\u6B64\u5546\u54C1\u5E76\u6D88\u8017 {currency} {price} \u5417\uFF1F",
        "shop.confirmPurchase": "\u786E\u8BA4\u8D2D\u4E70",
        "inventory.title": "\u80CC\u5305",
        "inventory.empty": "\u4F60\u7684\u80CC\u5305\u8FD8\u662F\u7A7A\u7684\uFF0C\u5148\u53BB\u5546\u5E97\u770B\u770B\u5427\u3002",
        "inventory.tapToUse": "\u70B9\u51FB\u4F7F\u7528",
        "inventory.useTitle": "\u4F7F\u7528\u7269\u54C1",
        "inventory.externalHint": "\u8FD9\u662F\u5916\u90E8\u7269\u54C1\uFF0C\u4F7F\u7528\u540E\u8BF7\u624B\u52A8\u5151\u73B0\u3002",
        "inventory.use": "\u4F7F\u7528",
        "inventory.useExternal": "\u4F7F\u7528\u5E76\u786E\u8BA4",
        "wish.modalTitle": "\u8BB8\u4E0B\u613F\u671B",
        "wish.nameLabel": "\u613F\u671B\u540D\u79F0",
        "wish.namePlaceholder": "\u4F8B\u5982\uFF1A\u987A\u5229\u901A\u8FC7\u8003\u8BD5",
        "wish.descLabel": "\u613F\u671B\u63CF\u8FF0\uFF08\u53EF\u9009\uFF09",
        "wish.descPlaceholder": "\u66F4\u8BE6\u7EC6\u5730\u63CF\u8FF0\u4F60\u7684\u613F\u671B\u2026\u2026",
        "wish.help": "\u521B\u5EFA\u613F\u671B\u540E\uFF0C\u53EF\u4EE5\u5411\u8BB8\u613F\u6C60\u6295\u5165\u613F\u661F\u3002\u6BCF\u9897\u613F\u661F\u589E\u52A0 10% \u8FDB\u5EA6\uFF0C\u8FBE\u5230 100% \u540E\u5373\u4E3A\u8BB8\u4E0B\u613F\u671B\uFF0C\u5E76\u5E72\u6D89\u4E16\u754C\u7EBF\u3002",
        "wish.create": "\u521B\u5EFA\u613F\u671B",
        "wish.poolTitle": "\u8BB8\u613F\u6C60",
        "wish.poolStats": "\u613F\u661F\uFF1A{stars}  \u5DF2\u5E72\u6D89\u4E16\u754C\u7EBF\uFF1A{completed}",
        "wish.activeTitle": "\u8FDB\u884C\u4E2D\u7684\u613F\u671B",
        "wish.complete": "\u8BB8\u4E0B\u613F\u671B",
        "wish.invest": "\u6295\u5165\uFF08\u6D88\u8017 1 \u613F\u661F\uFF09",
        "wish.completed": "\u5DF2\u8BB8\u4E0B",
        "wish.noActive": "\u5F53\u524D\u6CA1\u6709\u8FDB\u884C\u4E2D\u7684\u613F\u671B\u3002",
        "wish.newWish": "\u8BB8\u4E0B\u65B0\u613F\u671B",
        "wish.completedTitle": "\u613F\u671B\u5DF2\u8BB8\u4E0B\uFF01",
        "wish.completedHeadline": "\u4F60\u7684\u613F\u671B\u5DF2\u7ECF\u5E72\u6D89\u4E86\u4E16\u754C\u7EBF\u3002",
        "wish.completedBuff": "\u597D\u8FD0 Buff \u5DF2\u751F\u6548 24 \u5C0F\u65F6\u3002",
        "wish.completedBonus": "\u5956\u52B1\u79EF\u5206 +{points}",
        "wish.completedThanks": "\u611F\u8C22\u795D\u798F",
        "wish.errorNameRequired": "\u8BF7\u8F93\u5165\u613F\u671B\u540D\u79F0\u3002",
        "wish.errorNotEnoughStars": "\u613F\u661F\u4E0D\u8DB3\u3002",
        "wish.investSuccess": "\u6295\u5165\u6210\u529F\uFF01\u8FDB\u5EA6 +10%",
        "wish.historyTitle": "\u8BB8\u613F\u5386\u53F2",
        "wish.historyEmpty": "\u6682\u65E0\u5DF2\u5B8C\u6210\u7684\u613F\u671B\u3002",
        "wish.historyItem": "{name} - {date}",
        "wish.historyBack": "\u8FD4\u56DE\u8BB8\u613F\u6C60",
        "wish.historyDelete": "\u5220\u9664\u6B64\u8BB0\u5F55",
        "wish.historyDeleteConfirm": "\u786E\u5B9A\u5220\u9664\u6B64\u8BB8\u613F\u8BB0\u5F55\uFF1F\u6B64\u64CD\u4F5C\u4E0D\u53EF\u64A4\u9500\u3002",
        "ui.levelSystemTitle": "\u7B49\u7EA7\u4E0E\u79F0\u53F7\u7CFB\u7EDF",
        "ui.currentLevel": "\u5F53\u524D\u7B49\u7EA7",
        "ui.totalPoints": "\u603B\u79EF\u5206",
        "ui.levelStages": "\u7B49\u7EA7\u9636\u6BB5",
        "ui.currentTag": "\u5F53\u524D",
        "ui.pointsUnit": "\u79EF\u5206",
        "ui.playerPanel": "{name} \u7684\u73A9\u5BB6\u9762\u677F",
        "ui.stat.points": "\u79EF\u5206",
        "ui.stat.level": "\u7B49\u7EA7",
        "ui.stat.wishStars": "\u613F\u661F",
        "ui.stat.inventory": "\u80CC\u5305\u7269\u54C1",
        "ui.stat.nextLevel": "\u8DDD\u79BB\u4E0B\u4E00\u7EA7",
        "ui.activeBuffs": "\u5F53\u524D Buff",
        "ui.dailyCheckIn": "\u6BCF\u65E5\u6253\u5361",
        "ui.goWishPool": "\u8BB8\u613F\u6C60",
        "ui.goShop": "\u5546\u5E97",
        "ui.openInventory": "\u80CC\u5305",
        "ui.checkInTitle": "\u6BCF\u65E5\u6253\u5361",
        "ui.todayDone": "\u4ECA\u65E5\u5DF2\u6253\u5361",
        "ui.comeTomorrow": "\u660E\u5929\u518D\u6765\u5427\uFF01",
        "ui.todayPoints": "\u4ECA\u65E5\u79EF\u5206",
        "ui.basePoints": "\u57FA\u7840\u79EF\u5206",
        "ui.progress": "\u8FDB\u5EA6",
        "ui.taskSummary": "\u4EFB\u52A1\u6C47\u603B",
        "ui.mainTasks": "\u4E3B\u4EFB\u52A1",
        "ui.habits": "\u4E60\u60EF",
        "ui.perfectHint": "\u5B8C\u7F8E\u6253\u5361\uFF01\u6240\u6709\u6838\u5FC3\u4EFB\u52A1\u90FD\u5DF2\u5B8C\u6210\u3002",
        "ui.keepGoingHint": "\u7EE7\u7EED\u52AA\u529B\uFF0C\u5B8C\u6210\u6240\u6709\u6838\u5FC3\u4EFB\u52A1\u5373\u53EF\u83B7\u5F97\u5B8C\u7F8E\u6253\u5361\u5956\u52B1\u3002",
        "ui.perfectCheckIn": "\u5B8C\u7F8E\u6253\u5361",
        "ui.confirmCheckIn": "\u786E\u8BA4\u6253\u5361",
        "ui.checkInConfirmTitle": "\u786E\u8BA4\u6253\u5361",
        "ui.checkInConfirmHeadline": "\u786E\u8BA4\u4ECA\u5929\u6253\u5361\u5417\uFF1F",
        "ui.pointsEarned": "\u4ECA\u65E5\u83B7\u5F97\u79EF\u5206",
        "ui.pointsToPerfect": "\u8DDD\u79BB\u5B8C\u7F8E\u6253\u5361\u8FD8\u5DEE",
        "ui.perfectRewardHint": "\u5B8C\u6210\u6240\u6709\u6838\u5FC3\u4EFB\u52A1\u5373\u53EF\u89E3\u9501\u5B8C\u7F8E\u6253\u5361\u5956\u52B1\u3002",
        "ui.keepWorking": "\u7EE7\u7EED\u52AA\u529B",
        "ui.perfectTitle": "\u5B8C\u7F8E\u6253\u5361\uFF01",
        "ui.rewardAdded": "{icon} {name} \u5DF2\u52A0\u5165\u80CC\u5305\u3002",
        "ui.perfectThanks": "\u611F\u8C22\u795D\u798F",
        "ui.frequency": "\u6253\u5361\u9891\u7387",
        "ui.frequencyTitle": "\u6253\u5361\u9891\u7387",
        "ui.frequencyOpen": "\u67E5\u770B\u9891\u7387\u56FE\u8868",
        "ui.frequencyTodayDone": "\u4ECA\u65E5\u6253\u5361\u5DF2\u5B8C\u6210\u3002",
        "ui.frequencyTodayPending": "\u4ECA\u65E5\u5C1A\u672A\u6253\u5361\u3002",
        "ui.frequencyRecentDays": "\u6700\u8FD1 {days} \u5929",
        "ui.frequencyNoData": "\u8FD8\u6CA1\u6709\u6253\u5361\u6570\u636E\uFF0C\u5B8C\u6210\u7B2C\u4E00\u6B21\u6253\u5361\u540E\u8FD9\u91CC\u4F1A\u663E\u793A\u56FE\u8868\u3002",
        "ui.frequencyChecked": "\u5DF2\u6253\u5361",
        "ui.frequencyMissed": "\u672A\u6253\u5361",
        "ui.frequencyTotal": "\u7D2F\u8BA1\u6253\u5361",
        "ui.frequencyRate": "\u5B8C\u6210\u7387",
        "ui.frequencyCurrentStreak": "\u5F53\u524D\u8FDE\u7EED\u5929\u6570",
        "ui.frequencyLongestStreak": "\u6700\u4F73\u8FDE\u7EED\u5929\u6570",
        "ui.frequencyCalendarTitle": "\u8FD1\u671F\u6253\u5361\u65E5\u5386",
        "ui.frequencyCalendarHint": "\u6BCF\u4E2A\u65B9\u5757\u4EE3\u8868\u4E00\u5929\uFF0C\u4ECA\u65E5\u4F1A\u88AB\u9AD8\u4EAE\uFF0C\u65B9\u4FBF\u5FEB\u901F\u89C2\u5BDF\u4F60\u7684\u6253\u5361\u8282\u594F\u3002",
        "ui.frequencyRecentWeekTitle": "\u6700\u8FD1 7 \u65E5\u8BB0\u5F55",
        "ui.frequencyRecentWeekHint": "\u8FD9\u91CC\u53EA\u663E\u793A\u6700\u8FD1 7 \u5929\uFF0C\u70B9\u51FB\u5C55\u5F00\u65E5\u5386\u53EF\u67E5\u770B\u5F53\u6708\u8BB0\u5F55\u3002",
        "ui.frequencyMonthTitle": "\u5F53\u6708\u6253\u5361\u65E5\u5386",
        "ui.frequencyMonthHint": "\u5C55\u5F00\u540E\u663E\u793A\u672C\u6708\u5B8C\u6574\u6253\u5361\u8BB0\u5F55\u3002",
        "ui.frequencyCurrentMonth": "\u5F53\u6708\u8BB0\u5F55",
        "ui.frequencyExpandCalendar": "\u5C55\u5F00\u65E5\u5386",
        "ui.frequencyInsights": "\u5FEB\u901F\u6982\u89C8",
        "ui.frequencyBuffTitle": "\u5F53\u524D\u8FDE\u7B7E Buff",
        "ui.frequencyBuffActive": "{icon} {name}  +{percent}%",
        "ui.frequencyBuffInactive": "\u5F53\u524D\u672A\u6FC0\u6D3B\u8FDE\u7B7E Buff",
        "ui.frequencyWarmup": "\u70ED\u8EAB\u5361\u5C42\u6570",
        "ui.frequencyEffectiveStreak": "\u6709\u6548\u8FDE\u7B7E",
        "ui.frequencyNextBuff": "\u4E0B\u4E00\u6863 Buff",
        "ui.frequencyRemainingDays": "\u8FD8\u9700 {count} \u5929",
        "ui.frequencyReadyNow": "\u5DF2\u53EF\u83B7\u5F97",
        "ui.frequencyDoneDays": "\u5DF2\u5B8C\u6210 {count} \u5929",
        "ui.frequencyMissedDays": "\u9057\u6F0F {count} \u5929",
        "ui.frequencyLongestStreakText": "\u6700\u4F73\u8FDE\u7EED\u8BB0\u5F55\uFF1A{count} \u5929",
        "ui.frequencyTodayTag": "\u4ECA\u65E5",
        "ui.frequencyRecentStatus": "\u6700\u8FD1 7 \u5929",
        "ui.frequencyWeekMon": "\u4E00",
        "ui.frequencyWeekTue": "\u4E8C",
        "ui.frequencyWeekWed": "\u4E09",
        "ui.frequencyWeekThu": "\u56DB",
        "ui.frequencyWeekFri": "\u4E94",
        "ui.frequencyWeekSat": "\u516D",
        "ui.frequencyWeekSun": "\u65E5",
        "settings.title": "Supreme Player \u8BBE\u7F6E",
        "settings.user": "\u7528\u6237\u4FE1\u606F",
        "settings.language": "\u754C\u9762\u8BED\u8A00",
        "settings.languageDesc": "\u9ED8\u8BA4\u8DDF\u968F\u5F53\u524D Obsidian \u8BED\u8A00\u3002",
        "settings.languageAuto": "\u8DDF\u968F Obsidian",
        "settings.languageZh": "\u7B80\u4F53\u4E2D\u6587",
        "settings.languageEn": "English",
        "settings.playerName": "\u73A9\u5BB6\u540D\u79F0",
        "settings.playerNameDesc": "\u8BBE\u7F6E\u72B6\u6001\u9762\u677F\u4E2D\u663E\u793A\u7684\u73A9\u5BB6\u540D\u79F0\u3002",
        "settings.playerNamePlaceholder": "\u73A9\u5BB6",
        "settings.defaultPlayerName": "\u73A9\u5BB6",
        "settings.data": "\u6570\u636E\u5B58\u50A8",
        "settings.dataPath": "\u6570\u636E\u6587\u4EF6\u8DEF\u5F84",
        "settings.dataPathDesc": "\u8D26\u6237\u6570\u636E\u6587\u4EF6\u8DEF\u5F84\u3002\u7559\u7A7A\u65F6\u81EA\u52A8\u68C0\u6D4B\u65E5\u8BB0\u76EE\u5F55\u3002",
        "settings.template": "\u65E5\u8BB0\u6A21\u677F",
        "settings.templatePath": "\u6A21\u677F\u6587\u4EF6\u8DEF\u5F84",
        "settings.templatePathDesc": "\u6BCF\u65E5\u7B14\u8BB0\u6A21\u677F\u8DEF\u5F84\u3002\u7559\u7A7A\u65F6\u81EA\u52A8\u68C0\u6D4B\u3002",
        "settings.updateTemplate": "\u66F4\u65B0\u65E5\u8BB0\u6A21\u677F",
        "settings.updateTemplateDesc": "\u6839\u636E\u5F53\u524D\u4EFB\u52A1\u914D\u7F6E\u5237\u65B0\u65E5\u8BB0\u6A21\u677F\u6587\u4EF6\u3002",
        "settings.debugTitle": "\u8C03\u8BD5",
        "settings.debugMode": "\u8C03\u8BD5\u6A21\u5F0F",
        "settings.debugModeDesc": "\u5728\u8BBE\u7F6E\u9875\u663E\u793A\u8BCA\u65AD\u4FE1\u606F\u548C\u6392\u67E5\u5EFA\u8BAE\u3002",
        "settings.debugInfoTitle": "\u8BCA\u65AD\u4FE1\u606F",
        "settings.debugResolvedLanguage": "\u5F53\u524D\u8BED\u8A00",
        "settings.debugLanguageMode": "\u8BED\u8A00\u8BBE\u7F6E",
        "settings.debugTodayNotePath": "\u9884\u671F\u4ECA\u65E5\u65E5\u8BB0",
        "settings.debugTodayNoteFound": "\u5339\u914D\u5230\u7684\u4ECA\u65E5\u65E5\u8BB0",
        "settings.debugTemplatePath": "\u6A21\u677F\u8DEF\u5F84",
        "settings.debugTemplateExists": "\u6A21\u677F\u662F\u5426\u5B58\u5728",
        "settings.debugDataPath": "\u6570\u636E\u8DEF\u5F84",
        "settings.debugDataExists": "\u6570\u636E\u662F\u5426\u5B58\u5728",
        "settings.debugActiveFile": "\u5F53\u524D\u6D3B\u52A8\u6587\u4EF6",
        "settings.debugDailyFolder": "\u65E5\u8BB0\u76EE\u5F55",
        "settings.debugDailyFormat": "\u65E5\u8BB0\u683C\u5F0F",
        "settings.debugParsedMainTasks": "\u8BC6\u522B\u5230\u7684\u4E3B\u4EFB\u52A1",
        "settings.debugParsedHabits": "\u8BC6\u522B\u5230\u7684\u4E60\u60EF",
        "settings.debugParsedExtraTasks": "\u8BC6\u522B\u5230\u7684\u989D\u5916\u4EFB\u52A1",
        "settings.debugParsedPomodoros": "\u8BC6\u522B\u5230\u7684\u756A\u8304\u949F",
        "settings.debugParsedPoints": "\u8BC6\u522B\u5230\u7684\u79EF\u5206",
        "settings.debugSuggestions": "\u5EFA\u8BAE\u4FE1\u606F",
        "settings.debugSuggestionMissingToday": "\u672A\u627E\u5230\u4ECA\u65E5\u65E5\u8BB0\uFF0C\u8BF7\u68C0\u67E5 Daily Notes \u7684\u76EE\u5F55\u4E0E\u6587\u4EF6\u547D\u540D\u683C\u5F0F\u3002",
        "settings.debugSuggestionMissingTemplate": "\u6A21\u677F\u6587\u4EF6\u4E0D\u5B58\u5728\uFF0C\u8BF7\u5148\u81EA\u52A8\u68C0\u6D4B\u6216\u521B\u5EFA\u6A21\u677F\u3002",
        "settings.debugSuggestionMissingData": "\u6570\u636E\u6587\u4EF6\u4E0D\u5B58\u5728\uFF0C\u4FDD\u5B58\u8BBE\u7F6E\u6216\u5B8C\u6210\u4E00\u6B21\u6253\u5361\u540E\u4F1A\u81EA\u52A8\u91CD\u5EFA\u3002",
        "settings.debugSuggestionNoPlugin": "\u672A\u68C0\u6D4B\u5230 Daily Notes \u6216 Periodic Notes \u914D\u7F6E\uFF0C\u81EA\u52A8\u8BC6\u522B\u4F1A\u56DE\u9000\u5230\u9ED8\u8BA4\u8DEF\u5F84\u3002",
        "settings.debugSuggestionHealthy": "\u5F53\u524D\u914D\u7F6E\u770B\u8D77\u6765\u6B63\u5E38\u3002",
        "settings.unlock": "\u89E3\u9501\u7F16\u8F91",
        "settings.unlockDesc": "\u8FDE\u7EED\u70B9\u51FB 42 \u6B21\u89E3\u9501\u7F16\u8F91\uFF0C30 \u5206\u949F\u540E\u81EA\u52A8\u91CD\u65B0\u9501\u5B9A\u3002",
        "settings.dailyTasks": "\u6BCF\u65E5\u4EFB\u52A1\u914D\u7F6E",
        "settings.dailyTasksDesc": "\u914D\u7F6E\u4E3B\u4EFB\u52A1\u3001\u4E60\u60EF\u3001\u989D\u5916\u4EFB\u52A1\u548C\u756A\u8304\u949F\u5206\u503C\u3002",
        "settings.perfectConfig": "\u5B8C\u7F8E\u6253\u5361\u914D\u7F6E",
        "settings.perfectConfigDesc": "\u914D\u7F6E\u5B8C\u7F8E\u6253\u5361\u5956\u52B1\u548C\u795D\u798F\u8BED\u3002",
        "settings.shop": "\u5546\u5E97\u7BA1\u7406",
        "settings.shopAdd": "\u6DFB\u52A0\u5546\u54C1",
        "settings.shopAddDesc": "\u5411\u5546\u5E97\u6DFB\u52A0\u81EA\u5B9A\u4E49\u5546\u54C1\u3002",
        "settings.shopEdit": "\u7F16\u8F91\u5546\u54C1",
        "settings.shopEditDesc": "\u7F16\u8F91\u5DF2\u6709\u5546\u54C1\u3002",
        "settings.shopDelete": "\u5220\u9664\u5546\u54C1",
        "settings.shopDeleteDesc": "\u5220\u9664\u4E00\u4E2A\u5546\u54C1\u3002",
        "settings.shopExport": "\u5BFC\u51FA\u5546\u5E97\u914D\u7F6E",
        "settings.shopExportDesc": "\u5C06\u81EA\u5B9A\u4E49\u5546\u54C1\u5BFC\u51FA\u4E3A JSON\u3002",
        "settings.shopImport": "\u5BFC\u5165\u5546\u5E97\u914D\u7F6E",
        "settings.shopImportDesc": "\u4ECE JSON \u6587\u4EF6\u5BFC\u5165\u5546\u54C1\u3002",
        "settings.levels": "\u7B49\u7EA7\u7BA1\u7406",
        "settings.levelsEdit": "\u7F16\u8F91\u7B49\u7EA7",
        "settings.levelsEditDesc": "\u7F16\u8F91\u6BCF\u4E2A\u7B49\u7EA7\u7684\u79F0\u53F7\u3001\u80FD\u529B\u548C\u9636\u6BB5\u3002",
        "settings.levelsAdd": "\u65B0\u589E\u7B49\u7EA7",
        "settings.levelsAddDesc": "\u6DFB\u52A0\u65B0\u7684\u7B49\u7EA7\u914D\u7F6E\u3002",
        "settings.currencies": "\u8D27\u5E01\u7BA1\u7406",
        "settings.currenciesDesc": "\u67E5\u770B\u5E76\u7BA1\u7406\u6240\u6709\u8D27\u5E01\u7C7B\u578B\u3002",
        "settings.dataIO": "\u6570\u636E\u5BFC\u5165 / \u5BFC\u51FA",
        "settings.exportData": "\u5BFC\u51FA\u6570\u636E",
        "settings.exportDataDesc": "\u5C06\u6240\u6709\u8D26\u6237\u6570\u636E\u5BFC\u51FA\u4E3A JSON\u3002",
        "settings.importData": "\u5BFC\u5165\u6570\u636E",
        "settings.importDataDesc": "\u4ECE JSON \u6587\u4EF6\u5BFC\u5165\u8D26\u6237\u6570\u636E\u3002",
        "settings.waitToLock": "\u8BF7\u5728 {seconds} \u79D2\u540E\u518D\u5C1D\u8BD5\u4E0A\u9501\u3002",
        "settings.locked": "\u7F16\u8F91\u5DF2\u9501\u5B9A\u3002",
        "settings.unlocked": "\u7F16\u8F91\u5DF2\u89E3\u9501\uFF0C30 \u5206\u949F\u540E\u81EA\u52A8\u4E0A\u9501\u3002",
        "settings.autoLocked": "\u7F16\u8F91\u5DF2\u81EA\u52A8\u4E0A\u9501\u3002",
        "settings.unlockActive": "\u5DF2\u89E3\u9501",
        "settings.clickToUnlock": "\u70B9\u51FB\u89E3\u9501",
        "settings.confirmLock": "\u786E\u8BA4\u4E0A\u9501\uFF08\u5269\u4F59 {remaining} \u6B21\uFF09",
        "settings.clicksRemaining": "\u8FD8\u9700\u70B9\u51FB {remaining} \u6B21",
        "settings.dataExported": "\u6570\u636E\u5DF2\u5BFC\u51FA\u3002",
        "settings.shopExported": "\u5546\u5E97\u914D\u7F6E\u5DF2\u5BFC\u51FA\u3002",
        "settings.noShopToExport": "\u6CA1\u6709\u53EF\u5BFC\u51FA\u7684\u5546\u5E97\u5546\u54C1\u3002",
        "settings.invalidShopConfig": "\u65E0\u6548\u7684\u5546\u5E97\u914D\u7F6E\u6587\u4EF6\u3002",
        "settings.shopImportSuccess": "\u6210\u529F\u5BFC\u5165 {count} \u4E2A\u5546\u54C1\u3002",
        "settings.importFailed": "\u5BFC\u5165\u5931\u8D25\uFF1A{message}",
        "settings.enterItemName": "\u8BF7\u8F93\u5165\u5546\u54C1\u540D\u79F0\u3002",
        "settings.enterLevelTitle": "\u8BF7\u8F93\u5165\u7B49\u7EA7\u79F0\u53F7\u3002",
        "settings.enterCurrencyName": "\u8BF7\u8F93\u5165\u8D27\u5E01\u540D\u79F0\u3002",
        "settings.noEditableItems": "\u6CA1\u6709\u53EF\u7F16\u8F91\u7684\u5546\u54C1\u3002",
        "settings.noDeletableItems": "\u6CA1\u6709\u53EF\u5220\u9664\u7684\u5546\u54C1\u3002",
        "settings.dailyTaskModalTitle": "\u6BCF\u65E5\u4EFB\u52A1\u914D\u7F6E",
        "settings.mainTasks": "\u4E3B\u4EFB\u52A1",
        "settings.taskCount": "\u4EFB\u52A1\u6570\u91CF",
        "settings.pointsPerTask": "\u6BCF\u9879\u79EF\u5206",
        "settings.habitList": "\u4E60\u60EF\u5217\u8868",
        "settings.addHabit": "\u6DFB\u52A0\u4E60\u60EF",
        "settings.habitNamePlaceholder": "\u4E60\u60EF\u540D\u79F0",
        "settings.habitNewName": "\u65B0\u4E60\u60EF",
        "settings.extraTasks": "\u989D\u5916\u4EFB\u52A1",
        "settings.maxPoints": "\u6700\u9AD8\u79EF\u5206\uFF1A{value}",
        "settings.pomodoro": "\u756A\u8304\u949F",
        "settings.pointsPerPomodoro": "\u6BCF\u4E2A\u756A\u8304\u949F\u79EF\u5206",
        "settings.dailyTasksSaved": "\u6BCF\u65E5\u4EFB\u52A1\u914D\u7F6E\u5DF2\u4FDD\u5B58\u3002",
        "settings.perfectConfigModalTitle": "\u5B8C\u7F8E\u6253\u5361\u914D\u7F6E",
        "settings.rewardType": "\u5956\u52B1\u7C7B\u578B",
        "settings.rewardShop": "\u5546\u5E97\u5546\u54C1",
        "settings.rewardExclusive": "\u4E13\u5C5E\u5956\u52B1\u7269\u54C1",
        "settings.selectShopItem": "\u9009\u62E9\u5546\u5E97\u5546\u54C1",
        "settings.exclusiveConfig": "\u4E13\u5C5E\u5956\u52B1\u914D\u7F6E",
        "settings.exclusiveHint": "\u4E13\u5C5E\u5956\u52B1\u53EA\u80FD\u901A\u8FC7\u5B8C\u7F8E\u6253\u5361\u83B7\u5F97\uFF0C\u4E0D\u80FD\u5728\u5546\u5E97\u8D2D\u4E70\u3002",
        "settings.itemName": "\u5546\u54C1\u540D\u79F0",
        "settings.itemDescription": "\u5546\u54C1\u63CF\u8FF0",
        "settings.itemIcon": "\u5546\u54C1\u56FE\u6807",
        "settings.selectRarity": "\u9009\u62E9\u7A00\u6709\u5EA6",
        "settings.blessingConfig": "\u795D\u798F\u6587\u6848",
        "settings.blessingTitle": "\u795D\u798F\u6807\u9898",
        "settings.blessingMessage": "\u795D\u798F\u5185\u5BB9",
        "settings.enablePerfectReward": "\u542F\u7528\u5B8C\u7F8E\u6253\u5361\u5956\u52B1",
        "settings.perfectConfigSaved": "\u5B8C\u7F8E\u6253\u5361\u914D\u7F6E\u5DF2\u4FDD\u5B58\u3002",
        "settings.addItemTitle": "\u6DFB\u52A0\u5546\u54C1",
        "settings.editItemTitle": "\u7F16\u8F91\u5546\u54C1",
        "settings.deleteItemTitle": "\u5220\u9664\u5546\u54C1",
        "settings.itemNameInputPlaceholder": "\u4F8B\u5982\uFF1A\u795E\u79D8\u795D\u798F\u888B",
        "settings.itemDescInputPlaceholder": "\u63CF\u8FF0\u5546\u54C1\u6548\u679C\u6216\u627F\u8BFA",
        "settings.itemIconPlaceholder": "\u4F8B\u5982\uFF1A\u{1F381}",
        "settings.itemCategory": "\u5546\u54C1\u5206\u7C7B",
        "settings.systemItem": "\u7CFB\u7EDF\u5546\u54C1\uFF08\u81EA\u52A8\u751F\u6548\uFF09",
        "settings.externalItem": "\u5916\u90E8\u5546\u54C1\uFF08\u624B\u52A8\u5151\u73B0\uFF09",
        "settings.effectConfig": "\u5956\u52B1\u6548\u679C\u914D\u7F6E",
        "settings.effectType": "\u6548\u679C\u7C7B\u578B",
        "settings.deleteWarning": "\u5220\u9664\u540E\u65E0\u6CD5\u6062\u590D\uFF0C\u8BF7\u8C28\u614E\u64CD\u4F5C\u3002",
        "settings.editLevelsTitle": "\u7F16\u8F91\u7B49\u7EA7",
        "settings.levelRange": "Lv.{min} - {max}",
        "settings.levelRangeInfinite": "Lv.{min} - \u221E",
        "settings.levelAbility": "\u80FD\u529B\uFF1A{value}",
        "settings.levelPhase": "\u9636\u6BB5\uFF1A{value}",
        "settings.editLevelTitle": "\u7F16\u8F91\u7B49\u7EA7\uFF1A{title}",
        "settings.levelTitle": "\u79F0\u53F7",
        "settings.levelAbilityLabel": "\u80FD\u529B",
        "settings.levelAbilityIcon": "\u80FD\u529B\u56FE\u6807",
        "settings.levelPhaseLabel": "\u9636\u6BB5",
        "settings.levelPhaseIcon": "\u9636\u6BB5\u56FE\u6807",
        "settings.levelColor": "\u989C\u8272",
        "settings.levelMin": "\u6700\u4F4E\u7B49\u7EA7",
        "settings.levelMax": "\u6700\u9AD8\u7B49\u7EA7",
        "settings.deleteLevel": "\u5220\u9664\u8BE5\u7B49\u7EA7",
        "settings.deleteClickAgain": "\u518D\u70B9\u4E00\u6B21\u786E\u8BA4\u5220\u9664",
        "settings.deleteClickFinal": "\u6700\u540E\u518D\u70B9\u4E00\u6B21\u5373\u53EF\u5220\u9664",
        "settings.addLevelTitle": "\u6DFB\u52A0\u7B49\u7EA7",
        "settings.levelTitlePlaceholder": "\u4F8B\u5982\uFF1A\u661F\u4E4B\u4F7F\u8005",
        "settings.levelAbilityPlaceholder": "\u4F8B\u5982\uFF1A\u6539\u5199\u73B0\u5B9E",
        "settings.levelPhasePlaceholder": "\u4F8B\u5982\uFF1A\u51E1\u4EBA",
        "settings.manageCurrenciesTitle": "\u7BA1\u7406\u8D27\u5E01",
        "settings.currencyEditable": "\u53EF\u7F16\u8F91",
        "settings.currencyGainRule": "\u6BCF {rate} \u79EF\u5206 +{amount}",
        "settings.addCurrencyTitle": "\u6DFB\u52A0\u8D27\u5E01",
        "settings.editCurrencyTitle": "\u7F16\u8F91\u8D27\u5E01\uFF1A{name}",
        "settings.currencyDescription": "\u8D27\u5E01\u63CF\u8FF0",
        "settings.currencyRate": "\u83B7\u53D6\u95F4\u9694\uFF08\u79EF\u5206\uFF09",
        "settings.currencyColor": "\u989C\u8272",
        "settings.currencyNamePlaceholder": "\u4F8B\u5982\uFF1A\u91D1\u5E01",
        "settings.currencyIconPlaceholder": "\u4F8B\u5982\uFF1A\u{1FA99}",
        "settings.currencyDescPlaceholder": "\u63CF\u8FF0\u8BE5\u8D27\u5E01\u7684\u7528\u9014",
        "settings.currencyRatePlaceholder": "1000",
        "settings.currencyColorPlaceholder": "#00ff00",
        "settings.currencyHint": "\u65B0\u8D27\u5E01\u4F1A\u81EA\u52A8\u52A0\u5165\u7CFB\u7EDF\uFF0C\u5E76\u5728\u6253\u5361\u65F6\u6839\u636E\u79EF\u5206\u81EA\u52A8\u83B7\u53D6\u3002",
        "settings.templateButton": "\u66F4\u65B0\u6A21\u677F",
        "effect.addWishStars": "\u83B7\u5F97\u613F\u661F",
        "effect.addLevel": "\u63D0\u5347\u7B49\u7EA7",
        "effect.buff": "\u6DFB\u52A0 Buff",
        "effect.randomWishStars": "\u968F\u673A\u613F\u661F",
        "effect.addPoints": "\u589E\u52A0\u79EF\u5206",
        "effect.value": "\u6570\u503C",
        "effect.buffName": "Buff \u540D\u79F0",
        "effect.buffIcon": "Buff \u56FE\u6807",
        "effect.buffDescription": "Buff \u63CF\u8FF0",
        "effect.buffDuration": "\u6301\u7EED\u65F6\u95F4\uFF08\u5C0F\u65F6\uFF09",
        "effect.min": "\u6700\u5C0F\u503C",
        "effect.max": "\u6700\u5927\u503C",
        "effect.enterBuffName": "\u8BF7\u8F93\u5165 Buff \u540D\u79F0\u3002",
        "datastore.currency.wishStars.name": "\u613F\u661F",
        "datastore.currency.wishStars.desc": "\u7528\u4E8E\u8BB8\u613F\u548C\u63A8\u52A8\u4E16\u754C\u7EBF\u3002",
        "datastore.currency.rareItemCards.name": "\u7A00\u6709\u9053\u5177\u5361",
        "datastore.currency.rareItemCards.desc": "\u7528\u4E8E\u8D2D\u4E70\u7A00\u6709\u54C1\u8D28\u5546\u54C1\u3002",
        "datastore.currency.legendaryItemCards.name": "\u4F20\u5947\u9053\u5177\u5361",
        "datastore.currency.legendaryItemCards.desc": "\u7528\u4E8E\u8D2D\u4E70\u4F20\u5947\u54C1\u8D28\u5546\u54C1\u3002",
        "datastore.habit.wakeUp": "\u65E9\u8D77",
        "datastore.habit.exercise": "\u8FD0\u52A8",
        "datastore.habit.read": "\u9605\u8BFB",
        "datastore.level.0.title": "\u661F\u8BED\u8005",
        "datastore.level.0.ability": "\u626D\u66F2\u73B0\u5B9E",
        "datastore.level.0.phase": "\u672F\u58EB",
        "datastore.level.1.title": "\u7EC7\u68A6\u8005",
        "datastore.level.1.ability": "\u8986\u5199\u771F\u5B9E",
        "datastore.level.1.phase": "\u534A\u795E",
        "datastore.level.2.title": "\u521B\u9020\u4E3B",
        "datastore.level.2.ability": "\u663E\u5316\u521B\u9020",
        "datastore.level.2.phase": "\u4F2A\u795E",
        "datastore.level.3.title": "\u638C\u754C\u8005",
        "datastore.level.3.ability": "\u638C\u63A7\u4E16\u754C",
        "datastore.level.3.phase": "\u771F\u795E",
        "datastore.level.4.title": "\u4E98\u53E4\u8005",
        "datastore.level.4.ability": "\u6307\u5C16\u5BF0\u5B87",
        "datastore.level.4.phase": "\u661F\u795E",
        "datastore.level.5.title": "\u65E0\u6781\u5C0A",
        "datastore.level.5.ability": "\u8D85\u8D8A\u4E00\u5207",
        "datastore.level.5.phase": "\u25A0 \u25A0",
        "datastore.shop.wish-star-boost.name": "\u613F\u661F\u589E\u5E45\u5668",
        "datastore.shop.wish-star-boost.desc": "\u7ACB\u523B\u83B7\u5F97 5 \u4E2A\u613F\u661F\u3002",
        "datastore.shop.level-skip.name": "\u7B49\u7EA7\u8DC3\u8FC1\u5238",
        "datastore.shop.level-skip.desc": "\u7ACB\u523B\u83B7\u5F97 5000 \u79EF\u5206\u3002",
        "datastore.shop.warmup-card.name": "\u70ED\u8EAB\u5361",
        "datastore.shop.warmup-card.desc": "\u4F7F\u5F53\u524D\u8FDE\u7B7E Buff \u6240\u9700\u5929\u6570\u51CF\u5C11 1 \u5929\u3002\u8FDE\u7EED\u4E0D\u65AD\u7B7E\u65F6\u53EF\u53E0\u52A0\u4F7F\u7528\u3002",
        "datastore.shop.mystery-box.name": "\u795E\u79D8\u793C\u76D2",
        "datastore.shop.mystery-box.desc": "\u968F\u673A\u83B7\u5F97 1-10 \u4E2A\u613F\u661F\u3002",
        "datastore.shop.milk.name": "\u725B\u5976",
        "datastore.shop.milk.desc": "\u6E05\u9664\u6240\u6709\u5F53\u524D Buff\u3002",
        "datastore.reward.superDiamond.name": "\u8D85\u7EA7\u5927\u94BB\u77F3",
        "datastore.reward.superDiamond.desc": "\u5B8C\u7F8E\u6253\u5361\u5956\u52B1\u3002\u63D0\u4F9B\u968F\u673A\u613F\u661F\u548C\u5F3A\u529B\u5E78\u8FD0 Buff\u3002",
        "datastore.reward.defaultBlessingTitle": "\u505A\u5F97\u592A\u68D2\u4E86\uFF01",
        "datastore.reward.defaultBlessingMessage": "\u6BCF\u4E00\u6B21\u5B8C\u7F8E\u6253\u5361\uFF0C\u90FD\u662F\u5BF9\u81EA\u5DF1\u7684\u91CD\u8981\u6295\u8D44\u3002",
        "inventory.message.itemNotFound": "\u672A\u627E\u5230\u7269\u54C1\u3002",
        "inventory.message.purchaseSuccess": "\u8D2D\u4E70\u6210\u529F\uFF0C\u7269\u54C1\u5DF2\u52A0\u5165\u80CC\u5305\u3002",
        "inventory.message.usedSuccess": "{name} \u4F7F\u7528\u6210\u529F",
        "inventory.message.usedSuccessWithEffect": "{name} \u4F7F\u7528\u6210\u529F - {effect}",
        "inventory.message.externalUsed": "{name} \u5DF2\u6807\u8BB0\u4E3A\u5DF2\u4F7F\u7528\uFF0C\u8BF7\u624B\u52A8\u5151\u73B0\u3002",
        "inventory.message.useFailed": "\u4F7F\u7528\u7269\u54C1\u5931\u8D25\u3002",
        "inventory.effect.addWishStars": "\u83B7\u5F97 {value} \u4E2A\u613F\u661F",
        "inventory.effect.addLevel": "\u63D0\u5347 {value} \u7EA7",
        "inventory.effect.addPoints": "\u83B7\u5F97 {value} \u79EF\u5206",
        "inventory.effect.randomWishStars": "\u968F\u673A\u83B7\u5F97 {value} \u4E2A\u613F\u661F",
        "inventory.effect.checkInWarmup": "\u70ED\u8EAB +{value}\uFF0C\u5F53\u524D\u5171 {total} \u5C42\u3002\u4E0B\u4E00\u76EE\u6807 {target}\uFF0C\u8FD8\u9700 {remaining} \u5929",
        "inventory.effect.buff": "\u83B7\u5F97 Buff\uFF1A{name}",
        "inventory.effect.superDiamond": "\u83B7\u5F97 {value} \u4E2A\u613F\u661F\u5E76\u89E6\u53D1\u8D85\u7EA7\u5E78\u8FD0",
        "inventory.effect.clearAllBuffs": "\u5DF2\u6E05\u9664\u6240\u6709 Buff",
        "inventory.buff.superLuckName": "\u8D85\u7EA7\u5E78\u8FD0",
        "inventory.buff.superLuckDesc": "\u661F\u5149\u73AF\u7ED5\uFF0C\u5E78\u8FD0\u6B63\u5728\u6D8C\u6765\u3002",
        "inventory.buff.checkInEnhanceName": "\u5F3A\u5316",
        "inventory.buff.checkInEnhanceDesc": "\u8FDE\u7EED\u6253\u5361 3 \u5929\u540E\u751F\u6548\uFF0C\u6BCF\u65E5\u6253\u5361\u79EF\u5206\u63D0\u9AD8 20%\u3002",
        "inventory.buff.checkInTranscendentName": "\u8D85\u51E1",
        "inventory.buff.checkInTranscendentDesc": "\u8FDE\u7EED\u6253\u5361 7 \u5929\u540E\u751F\u6548\uFF0C\u6BCF\u65E5\u6253\u5361\u79EF\u5206\u63D0\u9AD8 50%\u3002",
        "utils.buffNameExample": "\u5E78\u8FD0\u5149\u73AF",
        "utils.buffDescExample": "\u4ECA\u5929\u597D\u8FD0\u4F1A\u504F\u5411\u4F60",
        "datastore.reward.levelUp": "\u5347\u7EA7\u5230 Lv.{level}\uFF01",
        "datastore.reward.currencyGain": "{icon} {name} +{amount}\uFF01",
        "wish.message.created": "\u613F\u671B\u521B\u5EFA\u6210\u529F\u3002",
        "wish.message.notEnoughStars": "\u613F\u661F\u4E0D\u8DB3\u3002",
        "wish.message.notFound": "\u672A\u627E\u5230\u613F\u671B\u3002",
        "wish.message.inactive": "\u8FD9\u4E2A\u613F\u671B\u5DF2\u65E0\u6CD5\u7EE7\u7EED\u6295\u5165\u3002",
        "wish.message.progress": "\u613F\u671B\u8FDB\u5EA6 +{amount}%",
        "wish.message.progressNotFull": "\u613F\u671B\u8FDB\u5EA6\u5C1A\u672A\u8FBE\u5230 100%\u3002",
        "wish.message.completed": "\u613F\u671B\u5DF2\u8BB8\u4E0B\uFF0C\u4E16\u754C\u7EBF\u5F00\u59CB\u504F\u8F6C\u3002",
        "wish.blessing.0": "\u613F\u661F\u5149\u6307\u5F15\u4F60\u7684\u811A\u6B65\u3002",
        "wish.blessing.1": "\u4E16\u754C\u7EBF\u6B63\u6084\u6084\u671D\u7740\u5BF9\u4F60\u6709\u5229\u7684\u65B9\u5411\u504F\u8F6C\u3002",
        "wish.blessing.2": "\u597D\u8FD0\u5DF2\u7ECF\u5728\u8DEF\u4E0A\u5411\u4F60\u8D76\u6765\u3002",
        "wish.blessing.3": "\u4F60\u7684\u613F\u671B\u5DF2\u7ECF\u88AB\u542C\u89C1\uFF0C\u8BA9\u5B83\u6162\u6162\u5F00\u82B1\u3002",
        "wish.blessing.4": "\u613F\u4ECA\u5929\u7684\u597D\u8FD0\u4E00\u76F4\u966A\u7740\u4F60\u3002",
        "shop.message.notEnoughRareCards": "\u7A00\u6709\u9053\u5177\u5361\u4E0D\u8DB3\u3002",
        "shop.message.notEnoughLegendaryCards": "\u4F20\u5947\u9053\u5177\u5361\u4E0D\u8DB3\u3002",
        "datastore.message.importSuccess": "\u6570\u636E\u5BFC\u5165\u6210\u529F\u3002",
        "datastore.message.importFailed": "\u6570\u636E\u5BFC\u5165\u5931\u8D25\uFF1A{message}",
        "datastore.message.shopConfigMissing": "\u5546\u5E97\u914D\u7F6E\u4E0D\u5B58\u5728\u3002",
        "datastore.message.configMissing": "\u914D\u7F6E\u4E0D\u5B58\u5728\u3002",
        "datastore.message.levelConfigMissing": "\u7B49\u7EA7\u914D\u7F6E\u4E0D\u5B58\u5728\u3002",
        "datastore.message.levelNotFound": "\u672A\u627E\u5230\u7B49\u7EA7\u3002",
        "datastore.message.currencyNotFound": "\u672A\u627E\u5230\u8D27\u5E01\u3002",
        "datastore.message.customCurrencyListMissing": "\u81EA\u5B9A\u4E49\u8D27\u5E01\u5217\u8868\u4E0D\u5B58\u5728\u3002",
        "datastore.message.systemCurrencyLocked": "\u7CFB\u7EDF\u8D27\u5E01\u4E0D\u53EF\u7F16\u8F91\u3002",
        "datastore.message.itemAdded": "\u7269\u54C1\u6DFB\u52A0\u6210\u529F\u3002",
        "datastore.message.itemUpdated": "\u7269\u54C1\u66F4\u65B0\u6210\u529F\u3002",
        "datastore.message.itemDeleted": "\u7269\u54C1\u5220\u9664\u6210\u529F\u3002",
        "datastore.message.levelAdded": "\u7B49\u7EA7\u6DFB\u52A0\u6210\u529F\u3002",
        "datastore.message.levelUpdated": "\u7B49\u7EA7\u66F4\u65B0\u6210\u529F\u3002",
        "datastore.message.levelDeleted": "\u7B49\u7EA7\u5220\u9664\u6210\u529F\u3002",
        "datastore.message.currencyAdded": "\u8D27\u5E01\u6DFB\u52A0\u6210\u529F\u3002",
        "datastore.message.currencyUpdated": "\u8D27\u5E01\u66F4\u65B0\u6210\u529F\u3002",
        "datastore.message.currencyDeleted": "\u8D27\u5E01\u5220\u9664\u6210\u529F\u3002",
        "core.noActiveWishes": "\u5F53\u524D\u6CA1\u6709\u8FDB\u884C\u4E2D\u7684\u613F\u671B",
        "core.accountTitle": "Supreme Player \u8D26\u6237\u4FE1\u606F",
        "core.dailySummaryTitle": "Supreme Player \u6BCF\u65E5\u603B\u7ED3",
        "core.todayPointsLabel": "\u4ECA\u65E5\u79EF\u5206",
        "core.currentPointsLabel": "\u5F53\u524D\u79EF\u5206",
        "core.wishStarsLabel": "\u613F\u661F",
        "core.rareCardsLabel": "\u7A00\u6709\u9053\u5177\u5361",
        "core.legendaryCardsLabel": "\u4F20\u5947\u9053\u5177\u5361",
        "core.wishPoolLabel": "\u8BB8\u613F\u6C60",
        "core.syncedAtLabel": "\u540C\u6B65\u65F6\u95F4",
        "core.status.level": "\u7B49\u7EA7",
        "core.status.totalPoints": "\u603B\u79EF\u5206",
        "core.status.todayPoints": "\u4ECA\u65E5\u79EF\u5206",
        "core.status.wishStars": "\u613F\u661F",
        "core.status.rareCards": "\u7A00\u6709\u9053\u5177\u5361",
        "core.status.legendaryCards": "\u4F20\u5947\u9053\u5177\u5361",
        "core.status.inventory": "\u80CC\u5305",
        "core.status.activeBuffs": "\u5F53\u524D Buff",
        "core.status.none": "\u65E0",
        "core.todayNoteMissing": "\u4ECA\u65E5\u7B14\u8BB0\u4E0D\u5B58\u5728\uFF0C\u8BF7\u5148\u521B\u5EFA\u3002",
        "core.todayAlreadyProcessed": "\u4ECA\u65E5\u7B14\u8BB0\u5DF2\u7ECF\u5904\u7406\u8FC7\u4E86\u3002",
        "core.checkinComplete": "\u6253\u5361\u5B8C\u6210\uFF01+{points} \u79EF\u5206",
        "core.checkinBonusApplied": "\uFF08\u8FDE\u7B7E {streak} \u5929\uFF0C+{percent}%\uFF1A{base} \u2192 {total}\uFF09",
        "core.levelUp": "\u5347\u7EA7\u5230 Lv.{level}\uFF01",
        "core.processFailed": "\u5904\u7406\u5931\u8D25\uFF1A{message}",
        "core.openFileFirst": "\u8BF7\u5148\u6253\u5F00\u4E00\u4E2A\u6587\u4EF6\u3002",
        "core.markdownOnly": "\u5F53\u524D\u6587\u4EF6\u4E0D\u662F Markdown \u6587\u4EF6\u3002",
        "core.accountSynced": "\u8D26\u6237\u4FE1\u606F\u5DF2\u540C\u6B65\u3002",
        "core.nothingToUpdate": "\u6CA1\u6709\u9700\u8981\u66F4\u65B0\u7684\u5185\u5BB9\u3002",
        "core.accountInserted": "\u8D26\u6237\u4FE1\u606F\u5DF2\u63D2\u5165\u5230\u6587\u4EF6\u672B\u5C3E\u3002",
        "core.syncFailed": "\u540C\u6B65\u5931\u8D25\uFF1A{message}"
      }
    };
    function normalizeLanguage(language) {
      if (!language || typeof language !== "string") {
        return null;
      }
      const value = language.toLowerCase();
      if (value === "auto")
        return "auto";
      if (value.startsWith("zh"))
        return "zh";
      if (value.startsWith("en"))
        return "en";
      return null;
    }
    function detectLanguage(app, override = "auto") {
      var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r;
      const overrideLang = normalizeLanguage(override);
      if (overrideLang !== "auto" && SUPPORTED_LANGUAGES.includes(overrideLang)) {
        return overrideLang;
      }
      const candidates = [
        app == null ? void 0 : app.appId,
        (_b = (_a = app == null ? void 0 : app.vault) == null ? void 0 : _a.getConfig) == null ? void 0 : _b.call(_a, "locale"),
        (_d = (_c = app == null ? void 0 : app.vault) == null ? void 0 : _c.getConfig) == null ? void 0 : _d.call(_c, "language"),
        app == null ? void 0 : app.locale,
        (_e = app == null ? void 0 : app.i18n) == null ? void 0 : _e.locale,
        (_i = (_h = (_g = (_f = app == null ? void 0 : app.plugins) == null ? void 0 : _f.plugins) == null ? void 0 : _g["obsidian-language-switcher"]) == null ? void 0 : _h.settings) == null ? void 0 : _i.defaultLanguage,
        (_k = (_j = globalThis == null ? void 0 : globalThis.localStorage) == null ? void 0 : _j.getItem) == null ? void 0 : _k.call(_j, "language"),
        (_m = (_l = globalThis == null ? void 0 : globalThis.localStorage) == null ? void 0 : _l.getItem) == null ? void 0 : _m.call(_l, "locale"),
        (_o = (_n = globalThis == null ? void 0 : globalThis.document) == null ? void 0 : _n.documentElement) == null ? void 0 : _o.lang,
        (_p = globalThis == null ? void 0 : globalThis.navigator) == null ? void 0 : _p.language,
        (_r = (_q = globalThis == null ? void 0 : globalThis.moment) == null ? void 0 : _q.locale) == null ? void 0 : _r.call(_q)
      ];
      for (const candidate of candidates) {
        const normalized = normalizeLanguage(candidate);
        if (SUPPORTED_LANGUAGES.includes(normalized)) {
          return normalized;
        }
      }
      return "en";
    }
    function format(template, variables = {}) {
      return template.replace(/\{(\w+)\}/g, (_, key) => {
        const value = variables[key];
        return value === void 0 || value === null ? `{${key}}` : String(value);
      });
    }
    function createI18n2(app, getOverrideLanguage) {
      return {
        getLanguage() {
          const override = typeof getOverrideLanguage === "function" ? getOverrideLanguage() : "auto";
          return detectLanguage(app, override);
        },
        translate(language, key, variables) {
          const table = translations[language] || translations.en;
          const fallback = translations.en[key] || key;
          return format(table[key] || fallback, variables);
        },
        t(key, variables) {
          return this.translate(this.getLanguage(), key, variables);
        }
      };
    }
    module2.exports = {
      createI18n: createI18n2,
      detectLanguage,
      normalizeLanguage
    };
  }
});

// src/data-store.js
var require_data_store = __commonJS({
  "src/data-store.js"(exports2, module2) {
    var { CONFIG_FILE, SHOP_CONFIG_FILE } = require_utils();
    var { createI18n: createI18n2 } = require_i18n();
    var DataStore2 = class {
      constructor(app) {
        this.app = app;
        this.stats = null;
        this.shopConfig = null;
        this.config = null;
        this.i18n = createI18n2(app, () => {
          var _a;
          return ((_a = this.config) == null ? void 0 : _a.language) || "auto";
        });
        this.t = (key, variables) => this.i18n.t(key, variables);
      }
      getLocalDateString(date = /* @__PURE__ */ new Date()) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
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
        var _a, _b, _c;
        let folder = "Notes/DailyNotes";
        let template = "";
        const dailyNotesPlugin = (_b = (_a = this.app.internalPlugins) == null ? void 0 : _a.plugins) == null ? void 0 : _b["daily-notes"];
        if ((dailyNotesPlugin == null ? void 0 : dailyNotesPlugin.enabled) && ((_c = dailyNotesPlugin == null ? void 0 : dailyNotesPlugin.instance) == null ? void 0 : _c.options)) {
          folder = dailyNotesPlugin.instance.options.folder || folder;
          template = dailyNotesPlugin.instance.options.template || "";
        }
        if (template)
          return template;
        return `${folder}/Template`;
      }
      autoDetectDataPath() {
        var _a, _b, _c;
        let folder = "Notes/DailyNotes";
        const dailyNotesPlugin = (_b = (_a = this.app.internalPlugins) == null ? void 0 : _a.plugins) == null ? void 0 : _b["daily-notes"];
        if ((dailyNotesPlugin == null ? void 0 : dailyNotesPlugin.enabled) && ((_c = dailyNotesPlugin == null ? void 0 : dailyNotesPlugin.instance) == null ? void 0 : _c.options)) {
          folder = dailyNotesPlugin.instance.options.folder || folder;
        }
        return `${folder}/supreme-player-data.json`;
      }
      getDefaultCurrenciesDefinition() {
        return [
          {
            id: "wishStars",
            name: this.makeBilingualFromKey("datastore.currency.wishStars.name"),
            icon: "\u2B50",
            description: this.makeBilingualFromKey("datastore.currency.wishStars.desc"),
            earnRate: 100,
            earnAmount: 1,
            color: "#ffd700",
            editable: true
          },
          {
            id: "rareItemCards",
            name: this.makeBilingualFromKey("datastore.currency.rareItemCards.name"),
            icon: "\u{1F3B4}",
            description: this.makeBilingualFromKey("datastore.currency.rareItemCards.desc"),
            earnRate: 500,
            earnAmount: 1,
            color: "#9966ff",
            editable: true
          },
          {
            id: "legendaryItemCards",
            name: this.makeBilingualFromKey("datastore.currency.legendaryItemCards.name"),
            icon: "\u{1F320}",
            description: this.makeBilingualFromKey("datastore.currency.legendaryItemCards.desc"),
            earnRate: 2e3,
            earnAmount: 1,
            color: "#ffaa00",
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
          this.getTranslation("zh", key),
          this.getTranslation("en", key)
        );
      }
      isBilingualValue(value) {
        return Boolean(
          value && typeof value === "object" && !Array.isArray(value) && value.lang && typeof value.lang === "object"
        );
      }
      getLocalizedText(value, fallback = "") {
        if (this.isBilingualValue(value)) {
          const language = this.i18n.getLanguage();
          return value.lang[language] || value.lang.zh || value.lang.en || fallback;
        }
        return value != null ? value : fallback;
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
          { minLevel: 0, maxLevel: 5, color: "#9966ff", abilityIcon: "\u2728", phaseIcon: "\u{1FA84}" },
          { minLevel: 6, maxLevel: 10, color: "#00aaff", abilityIcon: "\u{1F52E}", phaseIcon: "\u{1FAE7}" },
          { minLevel: 11, maxLevel: 15, color: "#00ffaa", abilityIcon: "\u{1F6E0}\uFE0F", phaseIcon: "\u{1F451}" },
          { minLevel: 16, maxLevel: 20, color: "#ffaa00", abilityIcon: "\u{1F30D}", phaseIcon: "\u{1F9FF}" },
          { minLevel: 21, maxLevel: 25, color: "#ff6666", abilityIcon: "\u{1F30C}", phaseIcon: "\u{1F47E}" },
          { minLevel: 26, maxLevel: 999, color: "#ffd700", abilityIcon: "\u267E\uFE0F", phaseIcon: "\u2182" }
        ];
      }
      getLocalizedBuiltinLevel(index) {
        const base = this.getBuiltinLevelDefinitions()[index];
        if (!base)
          return null;
        return {
          ...base,
          title: this.makeBilingualFromKey(`datastore.level.${index}.title`),
          ability: this.makeBilingualFromKey(`datastore.level.${index}.ability`),
          phase: this.makeBilingualFromKey(`datastore.level.${index}.phase`)
        };
      }
      getBuiltinShopDefinitions() {
        return [
          { id: "wish-star-boost", category: "system", type: "consumable", rarity: "rare", price: 1, icon: "\u2B50", effect: { type: "add_wish_stars", value: 5 }, editable: false },
          { id: "level-skip", category: "system", type: "consumable", rarity: "legendary", price: 5, icon: "\u23EB", effect: { type: "add_points", value: 5e3 }, editable: false },
          { id: "warmup-card", category: "system", type: "consumable", rarity: "rare", price: 10, icon: "\u{1F525}", effect: { type: "checkin_warmup", value: 1 }, editable: false },
          { id: "mystery-box", category: "system", type: "consumable", rarity: "rare", price: 1, icon: "\u{1F381}", effect: { type: "random_wish_stars", min: 1, max: 10 }, editable: true }
        ];
      }
      getLocalizedBuiltinShopItem(id) {
        const base = this.getBuiltinShopDefinitions().find((item) => item.id === id);
        if (!base)
          return null;
        return {
          ...base,
          name: this.makeBilingualFromKey(`datastore.shop.${id}.name`),
          description: this.makeBilingualFromKey(`datastore.shop.${id}.desc`)
        };
      }
      getLocalizedPerfectRewardDefaults() {
        return {
          name: this.makeBilingualFromKey("datastore.reward.superDiamond.name"),
          description: this.makeBilingualFromKey("datastore.reward.superDiamond.desc"),
          blessingTitle: this.makeBilingualFromKey("datastore.reward.defaultBlessingTitle"),
          blessingMessage: this.makeBilingualFromKey("datastore.reward.defaultBlessingMessage")
        };
      }
      getLocalizedCurrency(currency) {
        const keysById = {
          wishStars: ["datastore.currency.wishStars.name", "datastore.currency.wishStars.desc"],
          rareItemCards: ["datastore.currency.rareItemCards.name", "datastore.currency.rareItemCards.desc"],
          legendaryItemCards: ["datastore.currency.legendaryItemCards.name", "datastore.currency.legendaryItemCards.desc"]
        };
        const keys = keysById[currency.id];
        if (!keys)
          return currency;
        const [nameKey, descKey] = keys;
        const englishName = this.getTranslation("en", nameKey);
        const englishDesc = this.getTranslation("en", descKey);
        const localizedName = this.t(nameKey);
        const localizedDesc = this.t(descKey);
        const resolvedName = this.getLocalizedText(currency.name);
        const resolvedDescription = this.getLocalizedText(currency.description);
        return {
          ...currency,
          name: this.isBilingualValue(currency.name) || !currency.name || currency.name === englishName || currency.name === localizedName ? resolvedName || localizedName : currency.name,
          description: this.isBilingualValue(currency.description) || !currency.description || currency.description === englishDesc || currency.description === localizedDesc ? resolvedDescription || localizedDesc : currency.description
        };
      }
      getLocalizedLevelConfig(levelConfig, index) {
        const localized = this.getLocalizedBuiltinLevel(index);
        if (!localized)
          return levelConfig;
        const englishTitle = this.getTranslation("en", `datastore.level.${index}.title`);
        const englishAbility = this.getTranslation("en", `datastore.level.${index}.ability`);
        const englishPhase = this.getTranslation("en", `datastore.level.${index}.phase`);
        const localizedTitle = this.getLocalizedText(localized.title);
        const localizedAbility = this.getLocalizedText(localized.ability);
        const localizedPhase = this.getLocalizedText(localized.phase);
        const currentTitle = this.getLocalizedText(levelConfig.title, levelConfig.title);
        const currentAbility = this.getLocalizedText(levelConfig.ability, levelConfig.ability);
        const currentPhase = this.getLocalizedText(levelConfig.phase, levelConfig.phase);
        const sameRange = levelConfig.minLevel === localized.minLevel && levelConfig.maxLevel === localized.maxLevel;
        const canTranslate = sameRange && [englishTitle, localizedTitle].includes(currentTitle) && [englishAbility, localizedAbility].includes(currentAbility) && [englishPhase, localizedPhase].includes(currentPhase);
        if (!canTranslate) {
          return {
            ...levelConfig,
            title: this.getLocalizedText(levelConfig.title, ""),
            ability: this.getLocalizedText(levelConfig.ability, ""),
            phase: this.getLocalizedText(levelConfig.phase, "")
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
        const englishName = this.getTranslation("en", `datastore.shop.${item.id}.name`);
        const englishDesc = this.getTranslation("en", `datastore.shop.${item.id}.desc`);
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
        if (!reward)
          return reward;
        return {
          ...reward,
          blessingTitle: this.getLocalizedText(reward.blessingTitle, ""),
          blessingMessage: this.getLocalizedText(reward.blessingMessage, ""),
          exclusiveItem: reward.exclusiveItem ? {
            ...reward.exclusiveItem,
            name: this.getLocalizedText(reward.exclusiveItem.name, ""),
            description: this.getLocalizedText(reward.exclusiveItem.description, "")
          } : reward.exclusiveItem
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
              { name: this.t("datastore.habit.wakeUp"), points: 50 },
              { name: this.t("datastore.habit.exercise"), points: 50 },
              { name: this.t("datastore.habit.read"), points: 50 }
            ]
          },
          extraTasks: { count: 2, pointsPerTask: 50 },
          pomodoro: { count: 6, pointsPerPomodoro: 50 }
        };
      }
      async loadConfig() {
        try {
          const adapter2 = this.app.vault.adapter;
          if (await adapter2.exists(CONFIG_FILE)) {
            const content = await adapter2.read(CONFIG_FILE);
            const config = JSON.parse(content);
            let changed = false;
            if (!config.currencies) {
              config.currencies = this.getDefaultCurrenciesDefinition();
              changed = true;
            }
            if (!config.language) {
              config.language = "auto";
              changed = true;
            }
            if (!config.perfectCheckInReward) {
              config.perfectCheckInReward = this.getDefaultConfig().perfectCheckInReward;
              changed = true;
            }
            if (changed) {
              await adapter2.write(CONFIG_FILE, JSON.stringify(config, null, 2));
            }
            return config;
          }
        } catch (e) {
          console.error("Failed to load config:", e);
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
          language: "auto",
          debugMode: false,
          dataFilePath: detectedDataPath,
          templatePath: detectedTemplatePath,
          levels: this.getDefaultLevelsDefinition(),
          currencies: this.getDefaultCurrenciesDefinition(),
          customCurrencies: [],
          dailyTasks: this.getDefaultDailyTasksDefinition(),
          perfectCheckInReward: {
            enabled: true,
            rewardType: "exclusive",
            shopItemId: null,
            exclusiveItem: {
              name: this.makeBilingualFromKey("datastore.reward.superDiamond.name"),
              icon: "\u{1F48E}",
              description: this.makeBilingualFromKey("datastore.reward.superDiamond.desc"),
              rarity: "legendary",
              category: "system",
              effect: { type: "super_diamond" }
            },
            blessingTitle: this.makeBilingualFromKey("datastore.reward.defaultBlessingTitle"),
            blessingMessage: this.makeBilingualFromKey("datastore.reward.defaultBlessingMessage")
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
        const defaultCurrencies = this.getDefaultCurrenciesDefinition();
        if (!this.config)
          return defaultCurrencies;
        const currencies = this.config.currencies || defaultCurrencies;
        return [...currencies.map((currency) => this.getLocalizedCurrency(currency)), ...this.config.customCurrencies || []];
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
        if (!this.stats.checkInHistory)
          this.stats.checkInHistory = [];
        if (this.stats.checkInWarmupStacks === void 0)
          this.stats.checkInWarmupStacks = 0;
        if (this.stats.checkInWarmupAnchorDate === void 0)
          this.stats.checkInWarmupAnchorDate = null;
        if (this.stats.playerName === void 0)
          this.stats.playerName = this.t("settings.defaultPlayerName");
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
            const builtinItems = this.getDefaultShopItems();
            if (!config.items || config.items.length === 0) {
              config.items = builtinItems;
              await adapter.write(SHOP_CONFIG_FILE, JSON.stringify(config, null, 2));
            } else {
              const existingIds = new Set(config.items.map((item) => item.id));
              const missingBuiltinItems = builtinItems.filter((item) => !existingIds.has(item.id));
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
          playerName: this.t("settings.defaultPlayerName"),
          totalPoints: 0,
          currentPoints: 0,
          level: 0,
          todayPoints: 0,
          wishStars: 0,
          rareItemCards: 0,
          legendaryItemCards: 0,
          lastUpdated: (/* @__PURE__ */ new Date()).toISOString(),
          lastCheckInDate: null,
          checkInHistory: [],
          checkInWarmupStacks: 0,
          checkInWarmupAnchorDate: null,
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
        stats.buffs = stats.buffs.filter((existing) => existing.id !== buffId);
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
      getCheckInStreak(referenceDate = /* @__PURE__ */ new Date()) {
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
      getYesterdayString(referenceDate = /* @__PURE__ */ new Date()) {
        const yesterday = new Date(referenceDate);
        yesterday.setDate(yesterday.getDate() - 1);
        return this.getLocalDateString(yesterday);
      }
      isCheckInChainActive(referenceDate = /* @__PURE__ */ new Date()) {
        const stats = this.getStats();
        const actualStreak = this.getCheckInStreak(referenceDate);
        if (actualStreak > 0) {
          return true;
        }
        const yesterday = this.getYesterdayString(referenceDate);
        return stats.lastCheckInDate === yesterday;
      }
      normalizeCheckInWarmupState(referenceDate = /* @__PURE__ */ new Date()) {
        const stats = this.getStats();
        if (!this.isCheckInChainActive(referenceDate)) {
          stats.checkInWarmupStacks = 0;
          stats.checkInWarmupAnchorDate = null;
        }
      }
      getCheckInWarmupStacks(referenceDate = /* @__PURE__ */ new Date()) {
        this.normalizeCheckInWarmupState(referenceDate);
        const stats = this.getStats();
        return Math.max(0, Number(stats.checkInWarmupStacks || 0));
      }
      getEffectiveCheckInStreak(referenceDate = /* @__PURE__ */ new Date()) {
        const actualStreak = this.getCheckInStreak(referenceDate);
        const warmupStacks = this.getCheckInWarmupStacks(referenceDate);
        return {
          actualStreak,
          warmupStacks,
          effectiveStreak: actualStreak + warmupStacks
        };
      }
      getCheckInBonusMultiplier(streak) {
        if (streak >= 7)
          return 1.5;
        if (streak >= 3)
          return 1.2;
        return 1;
      }
      getCurrentCheckInBuffInfo(referenceDate = /* @__PURE__ */ new Date()) {
        const stats = this.getStats();
        this.normalizeCheckInWarmupState(referenceDate);
        const { actualStreak, warmupStacks, effectiveStreak } = this.getEffectiveCheckInStreak(referenceDate);
        const activeBuffs = this.getActiveBuffs();
        const activeBuff = activeBuffs.find((buff) => ["checkin-enhance", "checkin-transcendent"].includes(buff.id)) || null;
        const multiplier = this.getCheckInBonusMultiplier(effectiveStreak);
        const nextTarget = effectiveStreak >= 7 ? null : effectiveStreak >= 3 ? 7 : 3;
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
        if (!stats.buffs)
          stats.buffs = [];
        stats.buffs = stats.buffs.filter((buff) => !["checkin-enhance", "checkin-transcendent"].includes(buff.id));
        if (streak >= 7) {
          await this.addBuff(
            "checkin-transcendent",
            this.t("inventory.buff.checkInTranscendentName"),
            "\u{1F320}",
            this.t("inventory.buff.checkInTranscendentDesc"),
            24
          );
          return "checkin-transcendent";
        }
        if (streak >= 3) {
          await this.addBuff(
            "checkin-enhance",
            this.t("inventory.buff.checkInEnhanceName"),
            "\u26A1",
            this.t("inventory.buff.checkInEnhanceDesc"),
            24
          );
          return "checkin-enhance";
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
        const newLevel = Math.floor(stats.totalPoints / 5e3);
        const rewards = [];
        if (newLevel > oldLevel) {
          stats.level = newLevel;
          rewards.push(this.t("datastore.reward.levelUp", { level: newLevel }));
        }
        const currencies = this.getCurrencies();
        for (const currency of currencies) {
          const oldAmount = Math.floor(oldTotal / currency.earnRate);
          const newAmount = Math.floor(stats.totalPoints / currency.earnRate);
          if (newAmount > oldAmount) {
            stats[currency.id] = (stats[currency.id] || 0) + (newAmount - oldAmount);
            rewards.push(this.t("datastore.reward.currencyGain", { icon: currency.icon, name: currency.name, amount: newAmount - oldAmount }));
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
        return { success: true, wish, message: this.t("wish.message.created") };
      }
      async boostWish(wishId, starCost) {
        const stats = this.getStats();
        if (stats.wishStars < starCost) {
          return { success: false, message: this.t("wish.message.notEnoughStars") };
        }
        const wish = stats.wishes.find((w) => w.id === wishId);
        if (!wish)
          return { success: false, message: this.t("wish.message.notFound") };
        if (wish.status !== "active")
          return { success: false, message: this.t("wish.message.inactive") };
        const hasLuckCharm = this.getActiveBuffs().some((buff) => buff.id === "luck-charm");
        let boostAmount = starCost * 10;
        if (hasLuckCharm) {
          boostAmount *= 2;
          stats.buffs = stats.buffs.filter((buff) => buff.id !== "luck-charm");
        }
        stats.wishStars -= starCost;
        wish.progress = Math.min(wish.progress + boostAmount, 100);
        wish.lastBoost = (/* @__PURE__ */ new Date()).toISOString();
        if (wish.progress >= 100) {
          const result = await this.completeWish(wishId);
          return { success: true, wish: null, message: result.message, completed: true, blessings: result.blessings, bonusPoints: result.bonusPoints };
        }
        await this.save();
        return { success: true, wish, message: this.t("wish.message.progress", { amount: boostAmount }), completed: false };
      }
      async completeWish(wishId) {
        const stats = this.getStats();
        const wishIndex = stats.wishes.findIndex((w) => w.id === wishId);
        if (wishIndex === -1)
          return { success: false, message: this.t("wish.message.notFound") };
        const wish = stats.wishes[wishIndex];
        if (wish.progress < 100)
          return { success: false, message: this.t("wish.message.progressNotFull") };
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
        await this.addBuff("luck-boost", this.t("inventory.buff.superLuckName"), "\u{1F340}", this.t("inventory.buff.superLuckDesc"), 24);
        await this.save();
        return {
          success: true,
          message: this.t("wish.message.completed"),
          bonusPoints: 500,
          blessings: this.getRandomBlessings()
        };
      }
      getRandomBlessings() {
        const blessings = [
          this.t("wish.blessing.0"),
          this.t("wish.blessing.1"),
          this.t("wish.blessing.2"),
          this.t("wish.blessing.3"),
          this.t("wish.blessing.4")
        ];
        return blessings.sort(() => Math.random() - 0.5).slice(0, 3);
      }
      getLevelTitle(level) {
        var _a;
        if (!((_a = this.config) == null ? void 0 : _a.levels)) {
          return this.getFallbackLevelTitle(level);
        }
        for (let index = 0; index < this.config.levels.length; index += 1) {
          const levelConfig = this.getLocalizedLevelConfig(this.config.levels[index], index);
          if (level >= levelConfig.minLevel && level <= levelConfig.maxLevel) {
            return {
              title: levelConfig.title,
              ability: levelConfig.ability,
              phase: levelConfig.phase,
              color: levelConfig.color || "#ffffff",
              abilityIcon: levelConfig.abilityIcon || "\u2728",
              phaseIcon: levelConfig.phaseIcon || "\u{1F31F}"
            };
          }
        }
        const lastIndex = this.config.levels.length - 1;
        const lastLevel = this.getLocalizedLevelConfig(this.config.levels[lastIndex], lastIndex);
        return {
          title: lastLevel.title,
          ability: lastLevel.ability,
          phase: lastLevel.phase,
          color: lastLevel.color || "#ffffff",
          abilityIcon: lastLevel.abilityIcon || "\u2728",
          phaseIcon: lastLevel.phaseIcon || "\u{1F31F}"
        };
      }
      getFallbackLevelTitle(level) {
        const levels = this.getDefaultLevelsDefinition();
        for (const entry of levels) {
          if (level <= entry.maxLevel)
            return { ...entry, abilityIcon: entry.abilityIcon || "\u2728", phaseIcon: entry.phaseIcon || "\u{1F31F}" };
        }
        const finalLevel = levels[levels.length - 1];
        return { ...finalLevel, abilityIcon: finalLevel.abilityIcon || "\u2728", phaseIcon: finalLevel.phaseIcon || "\u{1F31F}" };
      }
      getShopItems() {
        if (!this.shopConfig)
          this.shopConfig = { items: this.getDefaultShopItems() };
        if (!this.shopConfig.items)
          this.shopConfig.items = this.getDefaultShopItems();
        return this.shopConfig.items.filter((item) => item.id !== "milk").map((item) => this.getLocalizedShopItem(item));
      }
      getDefaultShopItems() {
        return this.getBuiltinShopDefinitions().map((item) => this.getLocalizedBuiltinShopItem(item.id));
      }
      async purchaseItem(itemId) {
        const stats = this.getStats();
        const items = this.getShopItems();
        const item = items.find((entry) => entry.id === itemId);
        if (!item)
          return { success: false, message: this.t("inventory.message.itemNotFound") };
        if (item.rarity === "rare" && stats.rareItemCards < item.price) {
          return { success: false, message: this.t("shop.message.notEnoughRareCards") };
        }
        if (item.rarity === "legendary" && stats.legendaryItemCards < item.price) {
          return { success: false, message: this.t("shop.message.notEnoughLegendaryCards") };
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
        return { success: true, message: this.t("inventory.message.purchaseSuccess") };
      }
      async useItem(instanceId) {
        const stats = this.getStats();
        const itemIndex = stats.inventory.findIndex((item2) => item2.instanceId === instanceId);
        if (itemIndex === -1)
          return { success: false, message: this.t("inventory.message.itemNotFound") };
        const item = stats.inventory[itemIndex];
        if (item.category === "system" || item.category === "exclusive") {
          const effect = item.effect;
          let effectMessage = "";
          if (effect) {
            switch (effect.type) {
              case "add_wish_stars":
                stats.wishStars += effect.value || 1;
                effectMessage = this.t("inventory.effect.addWishStars", { value: effect.value || 1 });
                break;
              case "add_level":
                stats.level += effect.value || 1;
                stats.totalPoints = Math.max(stats.totalPoints, stats.level * 5e3);
                effectMessage = this.t("inventory.effect.addLevel", { value: effect.value || 1 });
                break;
              case "add_points":
                stats.totalPoints += effect.value || 100;
                stats.currentPoints += effect.value || 100;
                stats.level = Math.floor(stats.totalPoints / 5e3);
                effectMessage = this.t("inventory.effect.addPoints", { value: effect.value || 100 });
                break;
              case "random_wish_stars": {
                const min = effect.min || 1;
                const max = effect.max || 5;
                const amount = Math.floor(Math.random() * (max - min + 1)) + min;
                stats.wishStars += amount;
                effectMessage = this.t("inventory.effect.randomWishStars", { value: amount });
                break;
              }
              case "checkin_warmup": {
                this.normalizeCheckInWarmupState();
                stats.checkInWarmupStacks = Math.max(0, Number(stats.checkInWarmupStacks || 0)) + (effect.value || 1);
                stats.checkInWarmupAnchorDate = this.getLocalDateString();
                const refreshedInfo = this.getCurrentCheckInBuffInfo();
                if (this.isCheckInChainActive() && refreshedInfo.effectiveStreak >= 3) {
                  await this.refreshCheckInStreakBuff(refreshedInfo.effectiveStreak);
                }
                const info = this.getCurrentCheckInBuffInfo();
                effectMessage = this.t("inventory.effect.checkInWarmup", {
                  value: effect.value || 1,
                  total: stats.checkInWarmupStacks,
                  target: info.nextTarget || 7,
                  remaining: info.remainingDays
                });
                break;
              }
              case "buff": {
                const buffId = "custom-" + Date.now().toString();
                const duration = effect.duration || effect.buffDuration || 24;
                await this.addBuff(buffId, effect.buffName, effect.buffIcon || item.icon, effect.buffDesc || item.description, duration);
                effectMessage = this.t("inventory.effect.buff", { name: effect.buffName });
                break;
              }
              case "super_diamond": {
                const baseAmount = Math.floor(Math.random() * 5) + 1;
                let totalStars = baseAmount;
                if (Math.random() < 0.2)
                  totalStars += 5;
                if (Math.random() < 0.01)
                  totalStars += 100;
                stats.wishStars += totalStars;
                await this.addBuff("super-luck", this.t("inventory.buff.superLuckName"), "\u{1F4AB}", this.t("inventory.buff.superLuckDesc"), 1);
                effectMessage = this.t("inventory.effect.superDiamond", { value: totalStars });
                break;
              }
              case "clear_all_buffs":
                stats.buffs = [];
                effectMessage = this.t("inventory.effect.clearAllBuffs");
                break;
            }
          }
          stats.inventory.splice(itemIndex, 1);
          await this.save();
          return {
            success: true,
            message: effectMessage ? this.t("inventory.message.usedSuccessWithEffect", { name: item.name, effect: effectMessage }) : this.t("inventory.message.usedSuccess", { name: item.name }),
            external: false
          };
        }
        if (item.category === "external") {
          stats.inventory.splice(itemIndex, 1);
          if (!stats.usedExternalItems)
            stats.usedExternalItems = [];
          stats.usedExternalItems.push({ ...item, usedAt: (/* @__PURE__ */ new Date()).toISOString() });
          await this.save();
          return { success: true, message: this.t("inventory.message.externalUsed", { name: item.name }), external: true, item };
        }
        return { success: false, message: this.t("inventory.message.useFailed") };
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
            if (Array.isArray(this.stats.inventory)) {
              for (const item of this.stats.inventory) {
                if ((item == null ? void 0 : item.category) === "exclusive") {
                  item.category = "system";
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
          return { success: true, message: this.t("datastore.message.importSuccess") };
        } catch (e) {
          return { success: false, message: this.t("datastore.message.importFailed", { message: e.message }) };
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
          icon: icon || "\u{1F381}",
          effect
        };
        this.shopConfig.items.push(newItem);
        await this.saveShopConfig();
        return { success: true, message: this.t("datastore.message.itemAdded"), item: newItem };
      }
      async updateShopItem(itemId, updates) {
        var _a;
        if (!((_a = this.shopConfig) == null ? void 0 : _a.items)) {
          return { success: false, message: this.t("datastore.message.shopConfigMissing") };
        }
        const item = this.shopConfig.items.find((entry) => entry.id === itemId);
        if (!item)
          return { success: false, message: this.t("inventory.message.itemNotFound") };
        if (updates.name !== void 0)
          item.name = this.updateLocalizedValue(item.name, updates.name);
        if (updates.description !== void 0)
          item.description = this.updateLocalizedValue(item.description, updates.description);
        const fields = ["icon", "price", "rarity", "category", "effect"];
        for (const field of fields) {
          if (updates[field] !== void 0)
            item[field] = updates[field];
        }
        await this.saveShopConfig();
        return { success: true, message: this.t("datastore.message.itemUpdated") };
      }
      async deleteShopItem(itemId) {
        var _a;
        if (!((_a = this.shopConfig) == null ? void 0 : _a.items)) {
          return { success: false, message: this.t("datastore.message.shopConfigMissing") };
        }
        const itemIndex = this.shopConfig.items.findIndex((entry) => entry.id === itemId);
        if (itemIndex === -1)
          return { success: false, message: this.t("inventory.message.itemNotFound") };
        this.shopConfig.items.splice(itemIndex, 1);
        await this.saveShopConfig();
        return { success: true, message: this.t("datastore.message.itemDeleted") };
      }
      async updateLevelConfig(index, updates) {
        var _a;
        if (!((_a = this.config) == null ? void 0 : _a.levels))
          return { success: false, message: this.t("datastore.message.levelConfigMissing") };
        if (!this.config.levels[index])
          return { success: false, message: this.t("datastore.message.levelNotFound") };
        const level = this.config.levels[index];
        if (updates.title !== void 0)
          level.title = this.updateLocalizedValue(level.title, updates.title);
        if (updates.ability !== void 0)
          level.ability = this.updateLocalizedValue(level.ability, updates.ability);
        if (updates.phase !== void 0)
          level.phase = this.updateLocalizedValue(level.phase, updates.phase);
        const fields = ["abilityIcon", "phaseIcon", "color", "minLevel", "maxLevel"];
        for (const field of fields) {
          if (updates[field] !== void 0)
            level[field] = updates[field];
        }
        await this.saveConfig();
        return { success: true, message: this.t("datastore.message.levelUpdated") };
      }
      async addLevelConfig(levelData) {
        if (!this.config)
          this.config = this.getDefaultConfig();
        if (!this.config.levels)
          this.config.levels = [];
        const newLevel = {
          minLevel: levelData.minLevel || 0,
          maxLevel: levelData.maxLevel || 999,
          title: levelData.title || "New Level",
          ability: levelData.ability || "",
          abilityIcon: levelData.abilityIcon || "\u2728",
          phase: levelData.phase || "Mortal",
          phaseIcon: levelData.phaseIcon || "\u{1F31F}",
          color: levelData.color || "#ffffff"
        };
        this.config.levels.push(newLevel);
        this.config.levels.sort((a, b) => a.minLevel - b.minLevel);
        await this.saveConfig();
        return { success: true, message: this.t("datastore.message.levelAdded") };
      }
      async deleteLevelConfig(index) {
        var _a;
        if (!((_a = this.config) == null ? void 0 : _a.levels))
          return { success: false, message: this.t("datastore.message.levelConfigMissing") };
        if (!this.config.levels[index])
          return { success: false, message: this.t("datastore.message.levelNotFound") };
        this.config.levels.splice(index, 1);
        await this.saveConfig();
        return { success: true, message: this.t("datastore.message.levelDeleted") };
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
          icon: icon || "\u{1FA99}",
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
        return { success: true, message: this.t("datastore.message.currencyAdded"), currency: newCurrency };
      }
      async updateCurrency(currencyId, updates) {
        var _a, _b;
        if (!this.config)
          return { success: false, message: this.t("datastore.message.configMissing") };
        let currency = (_a = this.config.customCurrencies) == null ? void 0 : _a.find((entry) => entry.id === currencyId);
        if (!currency)
          currency = (_b = this.config.currencies) == null ? void 0 : _b.find((entry) => entry.id === currencyId);
        if (!currency)
          return { success: false, message: this.t("datastore.message.currencyNotFound") };
        if (!currency.editable)
          return { success: false, message: this.t("datastore.message.systemCurrencyLocked") };
        if (updates.name !== void 0)
          currency.name = this.updateLocalizedValue(currency.name, updates.name);
        if (updates.description !== void 0)
          currency.description = this.updateLocalizedValue(currency.description, updates.description);
        const fields = ["icon", "earnRate", "color"];
        for (const field of fields) {
          if (updates[field] !== void 0)
            currency[field] = updates[field];
        }
        await this.saveConfig();
        return { success: true, message: this.t("datastore.message.currencyUpdated") };
      }
      async deleteCurrency(currencyId) {
        var _a;
        if (!((_a = this.config) == null ? void 0 : _a.customCurrencies))
          return { success: false, message: this.t("datastore.message.customCurrencyListMissing") };
        const index = this.config.customCurrencies.findIndex((entry) => entry.id === currencyId);
        if (index === -1)
          return { success: false, message: this.t("datastore.message.currencyNotFound") };
        this.config.customCurrencies.splice(index, 1);
        await this.saveConfig();
        return { success: true, message: this.t("datastore.message.currencyDeleted") };
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
      getSectionKeywords(key) {
        const zh = this.dataStore.getTranslation("zh", key);
        const en = this.dataStore.getTranslation("en", key);
        const current = this.dataStore.t(key);
        const keywords = /* @__PURE__ */ new Set();
        if (zh)
          keywords.add(zh);
        if (en)
          keywords.add(en);
        if (current)
          keywords.add(current);
        return [...keywords];
      }
      buildSectionRegex(keywords) {
        const escaped = keywords.map((kw) => kw.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
        const pattern = `^(?:${escaped.join("|")})$`;
        return new RegExp(pattern, "i");
      }
      parseDailyNote(content, date) {
        const record = { date, mainTasks: [], habits: [], extraTasks: [], pomodoros: [], totalPoints: 0 };
        const sections = this.extractSections(content);
        const mainKeywords = this.getSectionKeywords("template.mainTasks");
        const mainRegex = this.buildSectionRegex(mainKeywords);
        const mainSection = this.findSection(sections, mainRegex);
        if (mainSection)
          record.mainTasks = this.parseTaskLines(mainSection.content);
        const habitKeywords = this.getSectionKeywords("template.habits");
        const habitRegex = this.buildSectionRegex(habitKeywords);
        const habitSection = this.findSection(sections, habitRegex);
        if (habitSection)
          record.habits = this.parseTaskLines(habitSection.content);
        const extraKeywords = this.getSectionKeywords("template.extraTasks");
        const extraRegex = this.buildSectionRegex(extraKeywords);
        const extraSection = this.findSection(sections, extraRegex);
        if (extraSection)
          record.extraTasks = this.parseTaskLines(extraSection.content);
        const pomodoroKeywords = this.getSectionKeywords("template.pomodoro");
        const pomodoroRegex = this.buildSectionRegex(pomodoroKeywords);
        const pomodoroSection = this.findSection(sections, pomodoroRegex);
        if (pomodoroSection)
          record.pomodoros = this.parsePomodoros(pomodoroSection.content);
        return record;
      }
      extractSections(content) {
        const sections = [];
        const lines = content.split("\n");
        const headings = [];
        for (let i = 0; i < lines.length; i++) {
          const line = lines[i];
          if (line.startsWith("## ")) {
            const title = line.substring(3).replace(/^[^\w\s（）()]*/, "").replace(/\s*\([^)]*\)\s*$/, "").trim();
            if (title) {
              headings.push({ title, lineIndex: i });
            }
          }
        }
        for (let i = 0; i < headings.length; i++) {
          const current = headings[i];
          const next = headings[i + 1];
          const startLine = current.lineIndex + 1;
          const endLine = next ? next.lineIndex : lines.length;
          const sectionLines = lines.slice(startLine, endLine);
          const separatorIdx = sectionLines.findIndex((l) => l.trim() === "---");
          const contentLines = separatorIdx !== -1 ? sectionLines.slice(0, separatorIdx) : sectionLines;
          sections.push({
            title: current.title,
            content: contentLines.join("\n").trim()
          });
        }
        return sections;
      }
      findSection(sections, titleRegex) {
        for (const section of sections) {
          if (titleRegex.test(section.title)) {
            return section;
          }
        }
        return null;
      }
      parseTaskLines(text) {
        const tasks = [];
        const lines = text.split("\n").filter((line) => line.trim());
        for (const line of lines) {
          const match = line.match(/^\s*[-*]?\s*\[([ x])\]\s*(.+?)\s*-\s*(\d+)/i);
          if (!match) {
            continue;
          }
          tasks.push({
            name: match[2].trim(),
            points: parseInt(match[3], 10),
            completed: match[1].toLowerCase() === "x"
          });
        }
        return tasks;
      }
      parsePomodoros(text) {
        const pomodoros = [];
        const lines = text.split("\n").filter((line) => line.trim());
        for (const line of lines) {
          const match = line.match(/^\s*[-*]?\s*\[([ x])\].*?(?:🍅|Pomodoro|番茄钟|Complete)/i);
          if (!match) {
            continue;
          }
          pomodoros.push({ completed: match[1].toLowerCase() === "x" });
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
        const completedExtraTasks = record.extraTasks.filter((task) => task.completed);
        const extraCount = Math.min(completedExtraTasks.length, extraConfig.count || 2);
        for (let index = 0; index < extraCount; index += 1) {
          points += completedExtraTasks[index].points;
        }
        const pomodoroConfig = dailyTasks.pomodoro || { count: 6, pointsPerPomodoro: 50 };
        const completedPomodoros = record.pomodoros.filter((pomodoro) => pomodoro.completed).length;
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
    function translate(plugin, key, variables) {
      return plugin.t ? plugin.t(key, variables) : key;
    }
    function getLocalDateString(date = /* @__PURE__ */ new Date()) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    }
    function buildWishLines(plugin, activeWishes) {
      if (!activeWishes.length) {
        return ["> " + translate(plugin, "core.noActiveWishes")];
      }
      return activeWishes.map((wish) => {
        const filledBlocks = Math.floor(wish.progress / 10);
        const emptyBlocks = 10 - filledBlocks;
        const bar = "\u25A0".repeat(filledBlocks) + "\u25A1".repeat(emptyBlocks);
        const statusIcon = wish.progress >= 100 ? "\u2705" : "\u{1F31F}";
        return `> ${statusIcon} **${wish.name}** ${bar} ${wish.progress}%`;
      });
    }
    function buildAccountSection(plugin) {
      const stats = plugin.dataStore.getStats();
      const activeWishes = (stats.wishes || []).filter((wish) => wish.status === "active");
      const levelInfo = plugin.dataStore.getLevelTitle(stats.level);
      const today = getLocalDateString();
      const wishLines = buildWishLines(plugin, activeWishes);
      return [
        "<!-- supreme-player:start -->",
        `### ${translate(plugin, "core.accountTitle")}`,
        `> **${stats.playerName || translate(plugin, "settings.defaultPlayerName")}** | Lv.${stats.level} ${levelInfo.title}`,
        `> ${levelInfo.abilityIcon || "\u2728"} ${levelInfo.ability} | ${levelInfo.phaseIcon || "\u{1F31F}"} ${levelInfo.phase}`,
        ">",
        `> \u{1F4CA} **${translate(plugin, "core.todayPointsLabel")}**: ${stats.todayPoints || 0}`,
        `> \u26A1 **${translate(plugin, "core.currentPointsLabel")}**: ${stats.totalPoints || 0}`,
        `> \u2B50 **${translate(plugin, "core.wishStarsLabel")}**: ${stats.wishStars || 0}`,
        `> \u{1F3B4} **${translate(plugin, "core.rareCardsLabel")}**: ${stats.rareItemCards || 0}`,
        `> \u{1F320} **${translate(plugin, "core.legendaryCardsLabel")}**: ${stats.legendaryItemCards || 0}`,
        ">",
        `> \u26F2 **${translate(plugin, "core.wishPoolLabel")}**`,
        ...wishLines,
        ">",
        `> *${translate(plugin, "core.syncedAtLabel")}: ${today}*`,
        "<!-- supreme-player:end -->"
      ].join("\n");
    }
    function buildStatusHover(plugin) {
      const stats = plugin.dataStore.getStats();
      const levelInfo = plugin.dataStore.getLevelTitle(stats.level);
      const playerName = stats.playerName || translate(plugin, "settings.defaultPlayerName");
      const activeBuffs = plugin.dataStore.getActiveBuffs ? plugin.dataStore.getActiveBuffs() : [];
      const nextLevel = stats.level + 1;
      const pointsToNext = nextLevel * 5e3 - stats.totalPoints;
      const currencies = plugin.dataStore.getCurrencies ? plugin.dataStore.getCurrencies() : [];
      const currencyHtml = currencies.map((currency) => {
        const value = stats[currency.id] || 0;
        return `
      <div style="display: flex; justify-content: space-between; padding: 4px 0; border-bottom: 1px solid var(--background-modifier-border);">
        <span>${currency.icon} ${currency.name}</span>
        <span style="font-weight: 700; color: ${currency.color};">${value}</span>
      </div>
    `;
      }).join("");
      const buffIcons = activeBuffs.length ? Array.from(new Set(activeBuffs.map((buff) => buff.icon || "\u2728"))).join(" ") : translate(plugin, "core.status.none");
      return `
    <div style="font-weight: 700; font-size: 16px; margin-bottom: 10px; color: ${levelInfo.color};">
      \u{1F464} ${playerName} | \u2B50 Lv.${stats.level} ${levelInfo.title}
    </div>
    <div style="color: var(--text-muted); font-size: 13px; margin-bottom: 10px;">
      ${levelInfo.abilityIcon || "\u2728"} ${levelInfo.ability} | ${levelInfo.phaseIcon || "\u{1F31F}"} ${levelInfo.phase}
    </div>
    <div style="margin-bottom: 10px; font-size: 13px;">
      <div style="display: flex; justify-content: space-between; padding: 4px 0;">
        <span>\u{1F4CA} ${translate(plugin, "core.status.totalPoints")}</span>
        <span style="font-weight: 700;">${stats.totalPoints || 0}</span>
      </div>
      <div style="display: flex; justify-content: space-between; padding: 4px 0;">
        <span>\u{1F4C8} ${translate(plugin, "ui.stat.nextLevel")}</span>
        <span style="font-weight: 700;">${pointsToNext}</span>
      </div>
    </div>
    <div style="font-weight: 700; margin-top: 10px;">\u{1FA99} ${translate(plugin, "settings.currencies")}</div>
    <div style="font-size: 13px;">
      ${currencyHtml}
    </div>
    <div style="margin-top: 10px; font-weight: 700;">\u2728 ${translate(plugin, "core.status.activeBuffs")}</div>
    <div style="padding: 4px 0; font-size: 13px;">${buffIcons}</div>
    <div style="margin-top: 14px; display: flex; gap: 8px;">
      <button class="sp-hover-btn sp-hover-wish" style="flex: 1; padding: 6px; border-radius: 4px; cursor: pointer;">\u2728 ${translate(plugin, "ui.goWishPool")}</button>
      <button class="sp-hover-btn sp-hover-shop" style="flex: 1; padding: 6px; border-radius: 4px; cursor: pointer;">\u{1F3B4} ${translate(plugin, "ui.goShop")}</button>
      <button class="sp-hover-btn sp-hover-inventory" style="flex: 1; padding: 6px; border-radius: 4px; cursor: pointer;">\u{1F392} ${translate(plugin, "ui.openInventory")}</button>
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
      if (!plugin.statusBar)
        return;
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
        wishBtn.onclick = (event) => {
          event.stopPropagation();
          removeStatusHover(plugin);
          plugin.showWishPool();
        };
      }
      if (shopBtn) {
        shopBtn.onclick = (event) => {
          event.stopPropagation();
          removeStatusHover(plugin);
          plugin.showShop();
        };
      }
      if (inventoryBtn) {
        inventoryBtn.onclick = (event) => {
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
    var Core2 = {
      getDailyNotesSettings(app) {
        var _a, _b, _c, _d, _e, _f;
        const dailyNotesPlugin = (_b = (_a = app.internalPlugins) == null ? void 0 : _a.plugins) == null ? void 0 : _b["daily-notes"];
        if ((dailyNotesPlugin == null ? void 0 : dailyNotesPlugin.enabled) && ((_c = dailyNotesPlugin == null ? void 0 : dailyNotesPlugin.instance) == null ? void 0 : _c.options)) {
          return dailyNotesPlugin.instance.options;
        }
        const periodicNotesPlugin = (_e = (_d = app.plugins) == null ? void 0 : _d.plugins) == null ? void 0 : _e["periodic-notes"];
        if ((_f = periodicNotesPlugin == null ? void 0 : periodicNotesPlugin.settings) == null ? void 0 : _f.daily) {
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
        const folder = (settings == null ? void 0 : settings.folder) || "Notes/DailyNotes";
        const format = (settings == null ? void 0 : settings.format) || "YYYY-MM-DD";
        return this.buildDailyNotePath(folder, format);
      },
      async findTodayNoteFile(app) {
        var _a, _b, _c;
        const settings = this.getDailyNotesSettings(app);
        const folder = (settings == null ? void 0 : settings.folder) || "Notes/DailyNotes";
        const format = (settings == null ? void 0 : settings.format) || "YYYY-MM-DD";
        const candidates = [];
        candidates.push(this.buildDailyNotePath(folder, format));
        candidates.push(this.buildDailyNotePath(folder, "YYYY-MM-DD"));
        const activeFile = (_b = (_a = app.workspace).getActiveFile) == null ? void 0 : _b.call(_a);
        if (activeFile == null ? void 0 : activeFile.path) {
          const todayKey = window.moment().format(format || "YYYY-MM-DD");
          const activeBaseName = activeFile.basename || ((_c = activeFile.name) == null ? void 0 : _c.replace(/\.md$/, ""));
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
            nextContent = `${content.trimEnd()}

---

${accountSection}
`;
          }
          await plugin.app.vault.modify(file, nextContent);
          this.updateStatusBar(plugin);
          new Notice(content === nextContent ? translate(plugin, "core.nothingToUpdate") : translate(plugin, "core.accountSynced"));
        } catch (error) {
          console.error("[Sync] Error:", error);
          new Notice(translate(plugin, "core.syncFailed", { message: error.message }));
        }
      },
      async updateDailyNote(plugin, path, originalContent, points) {
        const stats = plugin.dataStore.getStats();
        const today = getLocalDateString();
        let newContent = originalContent;
        const accountBlock = [
          "",
          `### ${translate(plugin, "core.dailySummaryTitle")}`,
          `> \u{1F4CA} **${translate(plugin, "core.todayPointsLabel")}**: ${points}`,
          `> \u{1F4AF} **${translate(plugin, "core.currentPointsLabel")}**: ${stats.totalPoints}`,
          `> \u2B50 **${translate(plugin, "core.wishStarsLabel")}**: ${stats.wishStars}`,
          `> \u{1F3B4} **${translate(plugin, "core.rareCardsLabel")}**: ${stats.rareItemCards}`,
          `> \u{1F320} **${translate(plugin, "core.legendaryCardsLabel")}**: ${stats.legendaryItemCards}`,
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
          newContent = `${newContent.trimEnd()}
${accountBlock}`;
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
      <span class="sp-stats-btn" style="cursor: pointer;" title="${translate(plugin, "core.status.totalPoints")}">\u{1F4CA} ${stats.totalPoints}</span>
      <span> | </span>
      <span class="sp-stats-btn" style="cursor: pointer;" title="${translate(plugin, "core.status.wishStars")}">\u2B50 ${stats.wishStars}</span>
    `;
        const levelButton = plugin.statusBar.querySelector(".sp-level-btn");
        if (levelButton) {
          levelButton.onclick = (event) => {
            event.stopPropagation();
            plugin.showLevelSystem();
          };
        }
        plugin.statusBar.querySelectorAll(".sp-stats-btn").forEach((button) => {
          button.onclick = () => plugin.showStats();
        });
        plugin.statusBar.onmouseenter = () => showStatusHover(plugin);
        plugin.statusBar.onmouseleave = () => scheduleHideStatusHover(plugin);
      }
    };
    module2.exports = Core2;
  }
});

// src/ui.js
var require_ui = __commonJS({
  "src/ui.js"(exports2, module2) {
    var { Modal, Notice } = require("obsidian");
    var Core2 = require_core();
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
      const now = /* @__PURE__ */ new Date();
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
    function buildFrequencyDataset(stats, days = 30) {
      const history = new Set(ensureCheckInHistory(stats));
      const today = /* @__PURE__ */ new Date();
      const result = [];
      for (let offset = days - 1; offset >= 0; offset -= 1) {
        const current = new Date(today);
        current.setDate(today.getDate() - offset);
        const date = `${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, "0")}-${String(current.getDate()).padStart(2, "0")}`;
        result.push({
          date,
          label: `${current.getMonth() + 1}/${current.getDate()}`,
          checked: history.has(date)
        });
      }
      return result;
    }
    function buildCurrentMonthDataset(stats) {
      const history = new Set(ensureCheckInHistory(stats));
      const today = /* @__PURE__ */ new Date();
      const start = new Date(today.getFullYear(), today.getMonth(), 1);
      const end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      const result = [];
      for (let day = 1; day <= end.getDate(); day += 1) {
        const current = new Date(today.getFullYear(), today.getMonth(), day);
        const date = `${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, "0")}-${String(current.getDate()).padStart(2, "0")}`;
        result.push({
          date,
          label: `${current.getMonth() + 1}/${current.getDate()}`,
          checked: history.has(date)
        });
      }
      return {
        dataset: result,
        monthKey: `${start.getFullYear()}-${String(start.getMonth() + 1).padStart(2, "0")}`
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
        const diffDays = Math.round((currentDate - previous) / 864e5);
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
      const firstDate = /* @__PURE__ */ new Date(`${dataset[0].date}T00:00:00`);
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
      const cursor = /* @__PURE__ */ new Date();
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
      let message = perfect ? `${translate(plugin, baseKey)} +${points}` : translate(plugin, baseKey, { points });
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
    var UI2 = {
      showCheckInFrequency(plugin, options = {}) {
        const stats = plugin.dataStore.getStats();
        const mode = options.mode || "recent";
        const recentDays = options.days || 7;
        const buffInfo = plugin.dataStore.getCurrentCheckInBuffInfo ? plugin.dataStore.getCurrentCheckInBuffInfo() : {
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
        const checkedCount = dataset.filter((item) => item.checked).length;
        const missedCount = dataset.length - checkedCount;
        const completionRate = dataset.length ? Math.round(checkedCount / dataset.length * 100) : 0;
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
        const activeBuffLabel = buffInfo.activeBuff ? translate(plugin, "ui.frequencyBuffActive", {
          icon: buffInfo.activeBuff.icon || "\u2728",
          name: buffInfo.activeBuff.name,
          percent: buffInfo.bonusPercent
        }) : translate(plugin, "ui.frequencyBuffInactive");
        const nextBuffLabel = buffInfo.nextTarget ? `${buffInfo.nextTarget} ${translate(plugin, "ui.frequencyRemainingDays", { count: buffInfo.remainingDays })}` : translate(plugin, "ui.frequencyReadyNow");
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
            <div>\u2705 ${translate(plugin, "ui.frequencyDoneDays", { count: checkedCount })}</div>
            <div>\u{1F573}\uFE0F ${translate(plugin, "ui.frequencyMissedDays", { count: missedCount })}</div>
            <div>\u{1F525} ${translate(plugin, "ui.frequencyLongestStreakText", { count: longestStreak })}</div>
          </div>
        </div>
      `;
          content.appendChild(insightGrid);
          const calendarWrap = document.createElement("div");
          calendarWrap.style.cssText = "background: var(--background-secondary); border-radius: 12px; padding: 16px; margin-bottom: 16px;";
          if (mode === "recent") {
            const recentStrip = document.createElement("div");
            recentStrip.style.cssText = "display: grid; grid-template-columns: repeat(7, minmax(0, 1fr)); gap: 8px; margin-bottom: 14px;";
            dataset.forEach((item) => {
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
              <span style="font-size:18px;line-height:1;">${item.checked ? "\u2714" : "\xB7"}</span>
              <span style="font-size:10px;color:var(--text-muted);">${item.label}</span>
            </div>
          `;
              recentStrip.appendChild(cell);
            });
            calendarWrap.appendChild(recentStrip);
            const expandBtn = createButton(`\u{1F5D3} ${translate(plugin, "ui.frequencyExpandCalendar")}`, () => {
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
              "ui.frequencyWeekSun"
            ].forEach((key) => {
              const headerItem = document.createElement("div");
              headerItem.style.cssText = "font-size: 11px; color: var(--text-muted); text-align: center; font-weight: 600;";
              headerItem.textContent = translate(plugin, key);
              weekdayHeader.appendChild(headerItem);
            });
            calendarWrap.appendChild(weekdayHeader);
            const calendarGrid = document.createElement("div");
            calendarGrid.style.cssText = "display: grid; gap: 8px;";
            weeks.forEach((week) => {
              const weekRow = document.createElement("div");
              weekRow.style.cssText = "display: grid; grid-template-columns: repeat(7, minmax(0, 1fr)); gap: 8px;";
              week.forEach((item) => {
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
              <span>${item.checked ? "\u2714" : "\xB7"}</span>
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
          const backButton = createButton(`\u21A9 ${translate(plugin, "ui.checkInTitle")}`, () => {
            modal.close();
            this.showCheckInPanel(plugin);
          });
          backButton.style.flex = "1";
          buttonRow.appendChild(backButton);
        }
        const closeBtn = createButton(`\u2716 ${translate(plugin, "common.close")}`, () => modal.close(), options.todayCompleted ? "mod-cta" : "");
        closeBtn.style.flex = "1";
        buttonRow.appendChild(closeBtn);
        content.appendChild(buttonRow);
        modal.contentEl.appendChild(content);
        modal.open();
      },
      showLevelSystem(plugin) {
        var _a;
        const stats = plugin.dataStore.getStats();
        const levels = (((_a = plugin.dataStore.config) == null ? void 0 : _a.levels) || []).map(
          (level, index) => plugin.dataStore.getLocalizedLevelConfig(level, index)
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
      <div style="font-size: 14px; color: #888; margin-top: 5px;">${currentLevelInfo.abilityIcon || "\u2728"} ${currentLevelInfo.ability} | ${currentLevelInfo.phaseIcon || "\u{1F331}"} ${currentLevelInfo.phase}</div>
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
          const minPoints = level.minLevel * 5e3;
          const maxPoints = level.maxLevel * 5e3;
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
          <span style="color: #00aaff;">${level.abilityIcon || "\u2728"} ${level.ability}</span>
          <span style="color: #888; margin: 0 8px;">|</span>
          <span style="color: #ffd700;">${level.phaseIcon || "\u{1F331}"} ${level.phase}</span>
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
        var _a, _b;
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
      <div style="background: var(--background-secondary); padding: 15px; border-radius: 8px;"><div style="color: #888; font-size: 12px;">\u{1F4CA} ${translate(plugin, "ui.stat.points")}</div><div style="font-size: 24px; font-weight: bold;">${stats.totalPoints}</div></div>
      <div style="background: var(--background-secondary); padding: 15px; border-radius: 8px;"><div style="color: #888; font-size: 12px;">\u2B50 ${translate(plugin, "ui.stat.level")}</div><div style="font-size: 24px; font-weight: bold; color: ${levelInfo.color};">Lv.${stats.level} ${levelInfo.title}</div></div>
      <div style="background: var(--background-secondary); padding: 15px; border-radius: 8px;"><div style="color: #888; font-size: 12px;">\u2728 ${translate(plugin, "ui.stat.wishStars")}</div><div style="font-size: 24px; font-weight: bold;">${stats.wishStars}</div></div>
      <div style="background: var(--background-secondary); padding: 15px; border-radius: 8px;"><div style="color: #888; font-size: 12px;">\u{1F392} ${translate(plugin, "ui.stat.inventory")}</div><div style="font-size: 24px; font-weight: bold;">${stats.inventory.length}</div></div>
    `;
        content.appendChild(topGrid);
        const bottomGrid = document.createElement("div");
        bottomGrid.style.marginTop = "20px";
        bottomGrid.style.display = "grid";
        bottomGrid.style.gridTemplateColumns = "1fr 1fr 1fr";
        bottomGrid.style.gap = "10px";
        const rareCardName = ((_a = plugin.dataStore.getCurrencies().find((currency) => currency.id === "rareItemCards")) == null ? void 0 : _a.name) || "Rare Item Card";
        const legendaryCardName = ((_b = plugin.dataStore.getCurrencies().find((currency) => currency.id === "legendaryItemCards")) == null ? void 0 : _b.name) || "Legendary Item Card";
        bottomGrid.innerHTML = `
      <div style="background: #9966ff20; padding: 10px; border-radius: 5px; text-align: center;"><div style="font-size: 20px;">\u{1F3B4}</div><div>${rareCardName}</div><div style="font-weight: bold;">${stats.rareItemCards}</div></div>
      <div style="background: #ffd70020; padding: 10px; border-radius: 5px; text-align: center;"><div style="font-size: 20px;">\u{1F320}</div><div>${legendaryCardName}</div><div style="font-weight: bold;">${stats.legendaryItemCards}</div></div>
      <div style="background: #00ff0020; padding: 10px; border-radius: 5px; text-align: center;"><div style="font-size: 20px;">\u{1F4C8}</div><div>${translate(plugin, "ui.stat.nextLevel")}</div><div style="font-weight: bold;">${5e3 - stats.totalPoints % 5e3}</div></div>
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
        const checkInBtn = createButton(`\u{1F4DD} ${translate(plugin, "ui.dailyCheckIn")}`, () => {
          modal.close();
          this.showCheckInPanel(plugin);
        }, "mod-cta");
        checkInBtn.style.gridColumn = "1 / -1";
        buttonSection.appendChild(checkInBtn);
        const wishBtn = createButton(`\u2728 ${translate(plugin, "ui.goWishPool")}`, () => {
          modal.close();
          plugin.showWishPool();
        });
        buttonSection.appendChild(wishBtn);
        const shopBtn = createButton(`\u{1F3B4} ${translate(plugin, "ui.goShop")}`, () => {
          modal.close();
          plugin.showShop();
        });
        buttonSection.appendChild(shopBtn);
        const inventoryBtn = createButton(`\u{1F392} ${translate(plugin, "ui.openInventory")}`, () => {
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
        var _a, _b;
        const config = plugin.dataStore.config || plugin.dataStore.getDefaultConfig();
        const stats = plugin.dataStore.getStats();
        const today = getTodayString();
        const dailyTasks = config.dailyTasks || {
          mainTasks: { count: 3, pointsPerTask: 100 },
          habits: { items: [] },
          extraTasks: { count: 2, pointsPerTask: 50 },
          pomodoro: { count: 6, pointsPerPomodoro: 50 }
        };
        const mainTasks = dailyTasks.mainTasks || { count: 3, pointsPerTask: 100 };
        const habits = ((_a = dailyTasks.habits) == null ? void 0 : _a.items) || [];
        const habitsPoints = habits.reduce((sum, item) => sum + (item.points || 0), 0);
        const maxBasePoints = mainTasks.count * mainTasks.pointsPerTask + habitsPoints;
        let currentPoints = 0;
        let record = null;
        try {
          const file = await Core2.findTodayNoteFile(plugin.app);
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
          console.log("[CheckIn] dataFilePath:", (_b = plugin.dataStore.config) == null ? void 0 : _b.dataFilePath);
          console.log("[CheckIn] stats.lastCheckInDate:", stats.lastCheckInDate, "today:", today, "alreadyCheckedIn:", alreadyCheckedIn);
          console.log("[CheckIn] full stats:", JSON.stringify(stats, null, 2).substring(0, 500));
        }
        const modal = new Modal(plugin.app);
        modal.titleEl.setText(translate(plugin, "ui.checkInTitle"));
        const content = document.createElement("div");
        content.style.padding = "20px";
        if (alreadyCheckedIn) {
          content.innerHTML = `
        <div style="text-align: center; margin-bottom: 20px;">
          <div style="font-size: 64px; margin-bottom: 15px;">\u2705</div>
          <div style="font-size: 18px; font-weight: bold; margin-bottom: 10px; color: #00aaff;">${translate(plugin, "ui.todayDone")}</div>
          <div style="color: #888; font-size: 13px;">${translate(plugin, "ui.comeTomorrow")}</div>
        </div>
      `;
          const chartBtn = createButton(`\u{1F4C5} ${translate(plugin, "ui.frequencyOpen")}`, () => {
            modal.close();
            this.showCheckInFrequency(plugin, { fromCheckIn: true, todayCompleted: true });
          }, "mod-cta");
          chartBtn.style.width = "100%";
          chartBtn.style.marginBottom = "10px";
          content.appendChild(chartBtn);
          const closeBtn2 = createButton(`\u2716 ${translate(plugin, "common.close")}`, () => modal.close());
          closeBtn2.style.width = "100%";
          content.appendChild(closeBtn2);
          modal.contentEl.appendChild(content);
          modal.open();
          return;
        }
        const progressPercent = Math.min(100, Math.round(currentPoints / maxBasePoints * 100));
        const isPerfect = currentPoints >= maxBasePoints;
        const completedMain = record ? record.mainTasks.filter((task) => task.completed).length : 0;
        const completedHabits = record ? record.habits.filter((task) => task.completed).length : 0;
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
          <div>\u2022 ${translate(plugin, "ui.mainTasks")}: ${completedMain}/${mainTasks.count}</div>
          <div>\u2022 ${translate(plugin, "ui.habits")}: ${completedHabits}/${habits.length}</div>
        </div>
      </div>

      <div style="text-align: center; color: #888; font-size: 12px; margin-bottom: 15px;">
        ${isPerfect ? translate(plugin, "ui.perfectHint") : translate(plugin, "ui.keepGoingHint")}
      </div>
    `;
        const checkInBtn = createButton(
          isPerfect ? `\u{1F31F} ${translate(plugin, "ui.perfectCheckIn")}` : `\u2705 ${translate(plugin, "ui.confirmCheckIn")}`,
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
        const frequencyBtn = createButton(`\u{1F4C5} ${translate(plugin, "ui.frequencyOpen")}`, () => {
          modal.close();
          this.showCheckInFrequency(plugin, { fromCheckIn: true, todayCompleted: false });
        });
        frequencyBtn.style.width = "100%";
        frequencyBtn.style.marginBottom = "10px";
        content.appendChild(frequencyBtn);
        const buttonContainer = document.createElement("div");
        buttonContainer.style.display = "flex";
        buttonContainer.style.gap = "10px";
        const backBtn = createButton(`\u21A9 ${translate(plugin, "common.backToPanel")}`, () => {
          modal.close();
          plugin.showStats();
        });
        backBtn.style.flex = "1";
        const closeBtn = createButton(`\u2716 ${translate(plugin, "common.close")}`, () => modal.close());
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
      <div style="font-size: 48px; margin-bottom: 15px;">\u{1F4DD}</div>
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
        const confirmBtn = createButton(`\u2705 ${translate(plugin, "ui.confirmCheckIn")}`, async () => {
          modal.close();
          const result = await plugin.dataStore.addCheckInPoints(currentPoints);
          const file = await Core2.findTodayNoteFile(plugin.app);
          if (file) {
            const noteContent = await plugin.app.vault.read(file);
            await Core2.updateDailyNote(plugin, file.path, noteContent, result.awardedPoints);
          }
          new Notice(rewardMessage(plugin, result, result.awardedPoints));
          plugin.updateStatusBar();
          this.showCheckInFrequency(plugin, { todayCompleted: true });
        }, "mod-cta");
        confirmBtn.style.flex = "1";
        const cancelBtn = createButton(`\u{1F4AA} ${translate(plugin, "ui.keepWorking")}`, () => modal.close());
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
            icon: "\u{1F48E}",
            description: "Perfect check-in reward",
            rarity: "legendary",
            category: "system"
          },
          blessingTitle: translate(plugin, "ui.perfectTitle"),
          blessingMessage: translate(plugin, "ui.perfectHint")
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
            rewardItem = shopItems.find((item) => item.id === perfectReward.shopItemId);
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
              obtainedAt: (/* @__PURE__ */ new Date()).toISOString()
            };
            rewardInfo = translate(plugin, "ui.rewardAdded", { icon: reward.icon, name: reward.name });
          }
        }
        content.innerHTML = `
      <div style="font-size: 64px; margin-bottom: 20px;">\u{1F3C6}</div>
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
        const file = await Core2.findTodayNoteFile(plugin.app);
        if (file) {
          const noteContent = await plugin.app.vault.read(file);
          await Core2.updateDailyNote(plugin, file.path, noteContent, result.awardedPoints);
        }
        plugin.updateStatusBar();
        new Notice(rewardMessage(plugin, result, result.awardedPoints, true));
        const closeBtn = createButton(`\u{1F496} ${translate(plugin, "ui.perfectThanks")}`, () => {
          modal.close();
          this.showCheckInFrequency(plugin, { todayCompleted: true });
        }, "mod-cta");
        closeBtn.style.width = "100%";
        content.appendChild(closeBtn);
        modal.contentEl.appendChild(content);
        modal.open();
        setTimeout(() => this.showCheckInFrequency(plugin, { todayCompleted: true }), 0);
      }
    };
    module2.exports = UI2;
  }
});

// src/wish.js
var require_wish = __commonJS({
  "src/wish.js"(exports2, module2) {
    var { Modal, Notice } = require("obsidian");
    var Core2 = require_core();
    function translate(plugin, key, variables) {
      if (plugin.t)
        return plugin.t(key, variables);
      if (plugin.dataStore && plugin.dataStore.t)
        return plugin.dataStore.t(key, variables);
      return key;
    }
    var Wish2 = {
      showWishModal(plugin) {
        const modal = new Modal(plugin.app);
        modal.titleEl.setText(translate(plugin, "wish.modalTitle"));
        const content = document.createElement("div");
        content.style.padding = "20px";
        content.innerHTML = `
      <div style="margin-bottom: 5px;">${translate(plugin, "wish.nameLabel")}</div>
      <input type="text" id="wish-name" placeholder="${translate(plugin, "wish.namePlaceholder")}" style="width: 100%; margin-bottom: 15px;">
      <div style="margin-bottom: 5px;">${translate(plugin, "wish.descLabel")}</div>
      <textarea id="wish-desc" placeholder="${translate(plugin, "wish.descPlaceholder")}" style="width: 100%; height: 80px; margin-bottom: 15px;"></textarea>
      <div style="color: #666; font-size: 12px; margin-bottom: 15px; padding: 10px; background: var(--background-secondary); border-radius: 5px;">
        ${translate(plugin, "wish.help")}
      </div>
    `;
        const buttonContainer = document.createElement("div");
        buttonContainer.style.display = "flex";
        buttonContainer.style.gap = "10px";
        const confirmBtn = document.createElement("button");
        confirmBtn.textContent = `\u2728 ${translate(plugin, "wish.create")}`;
        confirmBtn.className = "mod-cta";
        confirmBtn.style.flex = "1";
        confirmBtn.onclick = async () => {
          const name = document.getElementById("wish-name").value.trim();
          if (!name) {
            new Notice(translate(plugin, "wish.errorNameRequired"));
            return;
          }
          const result = await plugin.dataStore.makeWish(name, document.getElementById("wish-desc").value.trim());
          if (result.success) {
            Core2.updateStatusBar(plugin);
            modal.close();
            new Notice(result.message);
          }
        };
        const cancelBtn = document.createElement("button");
        cancelBtn.textContent = `\u2716 ${translate(plugin, "common.cancel")}`;
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
        const activeWishes = wishes.filter((wish) => wish.status === "active");
        const completedCount = stats.completedWishes || 0;
        const modal = new Modal(plugin.app);
        modal.titleEl.setText(translate(plugin, "wish.poolTitle"));
        const content = document.createElement("div");
        content.style.padding = "20px";
        content.style.maxHeight = "70vh";
        content.style.overflowY = "auto";
        const starInfo = document.createElement("div");
        starInfo.style.cssText = "margin-bottom: 20px; padding: 10px; background-color: var(--background-secondary); border-radius: 5px;";
        starInfo.textContent = translate(plugin, "wish.poolStats", {
          stars: stats.wishStars,
          completed: completedCount
        });
        content.appendChild(starInfo);
        if (activeWishes.length > 0) {
          const activeLabel = document.createElement("div");
          activeLabel.style.cssText = "font-weight: bold; margin-bottom: 10px;";
          activeLabel.textContent = translate(plugin, "wish.activeTitle");
          content.appendChild(activeLabel);
          for (const wish of activeWishes) {
            const wishDiv = document.createElement("div");
            wishDiv.style.cssText = "padding: 15px; margin-bottom: 10px; border: 1px solid var(--border-color); border-radius: 8px;";
            wishDiv.id = `wish-${wish.id}`;
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
              completeBtn.textContent = `\u{1F389} ${translate(plugin, "wish.complete")}`;
              completeBtn.className = "mod-cta";
              completeBtn.style.width = "100%";
              completeBtn.onclick = async () => {
                const result = await plugin.dataStore.completeWish(wish.id);
                if (result.success) {
                  Core2.updateStatusBar(plugin);
                  modal.close();
                  this.showWishCompletedModal(plugin, result);
                }
              };
              wishDiv.appendChild(completeBtn);
            } else {
              const investBtn = document.createElement("button");
              investBtn.textContent = `\u2B50 ${translate(plugin, "wish.invest")}`;
              investBtn.className = "mod-cta";
              investBtn.style.width = "100%";
              investBtn.disabled = stats.wishStars < 1;
              if (stats.wishStars < 1) {
                investBtn.style.opacity = "0.5";
              }
              investBtn.onclick = async () => {
                if (stats.wishStars < 1) {
                  new Notice(translate(plugin, "wish.errorNotEnoughStars"));
                  return;
                }
                const result = await plugin.dataStore.boostWish(wish.id, 1);
                if (result.success) {
                  Core2.updateStatusBar(plugin);
                  if (result.completed) {
                    modal.close();
                    this.showWishCompletedModal(plugin, result);
                  } else {
                    document.getElementById(`progress-bar-${wish.id}`).style.width = `${result.wish.progress}%`;
                    document.getElementById(`progress-text-${wish.id}`).textContent = `${result.wish.progress}%`;
                    if (result.wish.progress >= 100) {
                      investBtn.disabled = true;
                      investBtn.style.opacity = "0.5";
                      investBtn.textContent = translate(plugin, "wish.completed");
                    }
                    const newStats = plugin.dataStore.getStats();
                    starInfo.textContent = translate(plugin, "wish.poolStats", {
                      stars: newStats.wishStars,
                      completed: newStats.completedWishes || 0
                    });
                    new Notice(translate(plugin, "wish.investSuccess"));
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
          emptyDiv.textContent = translate(plugin, "wish.noActive");
          content.appendChild(emptyDiv);
        }
        const newWishBtn = document.createElement("button");
        newWishBtn.textContent = `\u2728 ${translate(plugin, "wish.newWish")}`;
        newWishBtn.style.width = "100%";
        newWishBtn.style.marginTop = "10px";
        newWishBtn.onclick = () => {
          modal.close();
          this.showWishModal(plugin);
        };
        content.appendChild(newWishBtn);
        if (stats.completedWishRecords && stats.completedWishRecords.length > 0) {
          const historyBtn = document.createElement("button");
          historyBtn.textContent = `\u{1F4DC} ${translate(plugin, "wish.historyTitle")}`;
          historyBtn.style.width = "100%";
          historyBtn.style.marginTop = "10px";
          historyBtn.onclick = () => {
            modal.close();
            this.showWishHistory(plugin);
          };
          content.appendChild(historyBtn);
        }
        const buttonContainer = document.createElement("div");
        buttonContainer.style.display = "flex";
        buttonContainer.style.gap = "10px";
        buttonContainer.style.marginTop = "10px";
        const backBtn = document.createElement("button");
        backBtn.textContent = `\u21A9 ${translate(plugin, "common.backToPanel")}`;
        backBtn.style.flex = "1";
        backBtn.onclick = () => {
          modal.close();
          plugin.showStats();
        };
        const closeBtn = document.createElement("button");
        closeBtn.textContent = `\u2716 ${translate(plugin, "common.close")}`;
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
        modal.titleEl.setText(translate(plugin, "wish.completedTitle"));
        const content = document.createElement("div");
        content.style.padding = "20px";
        content.style.textAlign = "center";
        content.innerHTML = `
      <div style="font-size: 64px; margin-bottom: 20px;">\u2705</div>
      <div style="font-size: 18px; font-weight: bold; margin-bottom: 15px;">${translate(plugin, "wish.completedHeadline")}</div>
      <div style="background: var(--background-secondary); padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <div style="color: #ffd700; font-size: 14px; margin-bottom: 10px;">${translate(plugin, "wish.completedBuff")}</div>
        ${result.bonusPoints ? `<div style="color: #00ff00; font-size: 14px;">${translate(plugin, "wish.completedBonus", { points: result.bonusPoints })}</div>` : ""}
      </div>
      <div style="color: #888; font-size: 12px; margin-bottom: 15px;">
        ${result.blessings ? result.blessings.map((message) => `\u2705 ${message}`).join("<br>") : ""}
      </div>
    `;
        const closeBtn = document.createElement("button");
        closeBtn.textContent = `\u{1F496} ${translate(plugin, "wish.completedThanks")}`;
        closeBtn.className = "mod-cta";
        closeBtn.style.width = "100%";
        closeBtn.onclick = () => modal.close();
        content.appendChild(closeBtn);
        modal.contentEl.appendChild(content);
        modal.open();
      },
      showWishHistory(plugin) {
        const stats = plugin.dataStore.getStats();
        const records = stats.completedWishRecords || [];
        const modal = new Modal(plugin.app);
        modal.titleEl.setText(translate(plugin, "wish.historyTitle"));
        const content = document.createElement("div");
        content.style.padding = "20px";
        content.style.maxHeight = "70vh";
        content.style.overflowY = "auto";
        if (records.length === 0) {
          const emptyDiv = document.createElement("div");
          emptyDiv.style.cssText = "text-align: center; color: #888; padding: 20px;";
          emptyDiv.textContent = translate(plugin, "wish.historyEmpty");
          content.appendChild(emptyDiv);
        } else {
          for (let i = records.length - 1; i >= 0; i--) {
            const record = records[i];
            const date = new Date(record.completedAt).toLocaleDateString();
            const wishDiv = document.createElement("div");
            wishDiv.style.cssText = "padding: 15px; margin-bottom: 10px; border: 1px solid var(--border-color); border-radius: 8px; background: var(--background-secondary);";
            const headerDiv = document.createElement("div");
            headerDiv.style.cssText = "display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;";
            const nameSpan = document.createElement("span");
            nameSpan.style.cssText = "font-weight: bold; font-size: 15px;";
            nameSpan.textContent = `\u{1F31F} ${record.name}`;
            const dateSpan = document.createElement("span");
            dateSpan.style.cssText = "color: #888; font-size: 12px;";
            dateSpan.textContent = date;
            const deleteBtn = document.createElement("button");
            deleteBtn.textContent = "\u{1F5D1}";
            deleteBtn.style.cssText = "background: none; border: none; cursor: pointer; font-size: 14px; padding: 4px 8px; opacity: 0.6;";
            deleteBtn.title = translate(plugin, "wish.historyDelete");
            deleteBtn.onclick = async () => {
              if (confirm(translate(plugin, "wish.historyDeleteConfirm"))) {
                const newStats = plugin.dataStore.getStats();
                const idx = newStats.completedWishRecords.findIndex((r) => r.id === record.id);
                if (idx !== -1) {
                  newStats.completedWishRecords.splice(idx, 1);
                  await plugin.dataStore.save();
                  modal.close();
                  this.showWishHistory(plugin);
                }
              }
            };
            headerDiv.appendChild(nameSpan);
            headerDiv.appendChild(dateSpan);
            headerDiv.appendChild(deleteBtn);
            wishDiv.appendChild(headerDiv);
            if (record.description) {
              const descDiv = document.createElement("div");
              descDiv.style.cssText = "color: #888; font-size: 13px; margin-bottom: 8px;";
              descDiv.textContent = record.description;
              wishDiv.appendChild(descDiv);
            }
            const pointsDiv = document.createElement("div");
            pointsDiv.style.cssText = "color: #ffd700; font-size: 13px;";
            pointsDiv.textContent = `+${record.bonusPoints || 500} ${translate(plugin, "ui.pointsUnit")}`;
            wishDiv.appendChild(pointsDiv);
            content.appendChild(wishDiv);
          }
        }
        const buttonContainer = document.createElement("div");
        buttonContainer.style.display = "flex";
        buttonContainer.style.gap = "10px";
        buttonContainer.style.marginTop = "10px";
        const backBtn = document.createElement("button");
        backBtn.textContent = `\u21A9 ${translate(plugin, "wish.historyBack")}`;
        backBtn.style.flex = "1";
        backBtn.onclick = () => {
          modal.close();
          this.showWishPool(plugin);
        };
        const closeBtn = document.createElement("button");
        closeBtn.textContent = `\u2716 ${translate(plugin, "common.close")}`;
        closeBtn.style.flex = "1";
        closeBtn.onclick = () => modal.close();
        buttonContainer.appendChild(backBtn);
        buttonContainer.appendChild(closeBtn);
        content.appendChild(buttonContainer);
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
    var Core2 = require_core();
    function translate(plugin, key, variables) {
      return plugin.t ? plugin.t(key, variables) : key;
    }
    function getCategoryTag(plugin, category) {
      if (category === "system") {
        return `<span style="background: #00aaff20; color: #00aaff; padding: 2px 6px; border-radius: 3px; font-size: 10px; margin-left: 5px;">${translate(plugin, "category.system")}</span>`;
      }
      return `<span style="background: #ffaa0020; color: #ffaa00; padding: 2px 6px; border-radius: 3px; font-size: 10px; margin-left: 5px;">${translate(plugin, "category.external")}</span>`;
    }
    function getRarityBadge(item) {
      return item.rarity === "legendary" ? '<span style="color: #ffd700; margin-left: 5px;">\u{1F320}</span>' : '<span style="color: #9966ff; margin-left: 5px;">\u{1F3B4}</span>';
    }
    function getCurrencyLabel(plugin, item) {
      return item.rarity === "legendary" ? `\u{1F320} ${translate(plugin, "rarity.legendary")}` : `\u{1F3B4} ${translate(plugin, "rarity.rare")}`;
    }
    var Shop2 = {
      showShop(plugin) {
        var _a;
        const stats = plugin.dataStore.getStats();
        const items = plugin.dataStore.getShopItems();
        const modal = new Modal(plugin.app);
        modal.titleEl.setText(((_a = plugin.dataStore.shopConfig) == null ? void 0 : _a.shopName) || translate(plugin, "shop.title"));
        const content = document.createElement("div");
        content.style.padding = "20px";
        const infoDiv = document.createElement("div");
        infoDiv.style.cssText = "margin-bottom: 20px; padding: 10px; background-color: var(--background-secondary); border-radius: 5px;";
        infoDiv.textContent = translate(plugin, "shop.info", {
          rare: stats.rareItemCards,
          legendary: stats.legendaryItemCards
        });
        content.appendChild(infoDiv);
        const itemList = document.createElement("div");
        itemList.style.cssText = "max-height: 300px; overflow-y: auto;";
        for (const item of items) {
          const canAfford = item.rarity === "rare" && stats.rareItemCards >= item.price || item.rarity === "legendary" && stats.legendaryItemCards >= item.price;
          const itemDiv = document.createElement("div");
          itemDiv.style.cssText = `padding: 12px; margin-bottom: 10px; border: 1px solid var(--border-color); border-radius: 5px; opacity: ${canAfford ? "1" : "0.6"};`;
          itemDiv.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div><span style="font-size: 20px; margin-right: 10px;">${item.icon}</span><strong>${item.name}</strong>${getCategoryTag(plugin, item.category)}${getRarityBadge(item)}</div>
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
        backBtn.textContent = `\u21A9 ${translate(plugin, "common.backToPanel")}`;
        backBtn.style.flex = "1";
        backBtn.onclick = () => {
          modal.close();
          plugin.showStats();
        };
        const closeBtn = document.createElement("button");
        closeBtn.textContent = `\u2716 ${translate(plugin, "common.close")}`;
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
        modal.titleEl.setText(translate(plugin, "shop.purchaseTitle"));
        const content = document.createElement("div");
        content.style.padding = "20px";
        content.style.textAlign = "center";
        content.innerHTML = `
      <div style="font-size: 48px; margin-bottom: 15px;">${item.icon}</div>
      <div style="font-size: 18px; font-weight: bold; margin-bottom: 10px;">${item.name}</div>
      <div style="color: #888; margin-bottom: 15px;">${item.description}</div>
      <div style="background: var(--background-secondary); padding: 10px; border-radius: 5px; margin-bottom: 15px;">
        ${translate(plugin, "shop.purchasePrompt", {
          currency: getCurrencyLabel(plugin, item),
          price: item.price
        })}
      </div>
    `;
        const buttonContainer = document.createElement("div");
        buttonContainer.style.display = "flex";
        buttonContainer.style.gap = "10px";
        buttonContainer.style.marginTop = "20px";
        const confirmBtn = document.createElement("button");
        confirmBtn.textContent = `\u{1F6D2} ${translate(plugin, "shop.confirmPurchase")}`;
        confirmBtn.className = "mod-cta";
        confirmBtn.style.flex = "1";
        confirmBtn.onclick = async () => {
          const result = await plugin.dataStore.purchaseItem(item.id);
          new Notice(result.message);
          if (result.success) {
            Core2.updateStatusBar(plugin);
            modal.close();
            shopModal.close();
            this.showShop(plugin);
          }
        };
        const cancelBtn = document.createElement("button");
        cancelBtn.textContent = `\u2716 ${translate(plugin, "common.cancel")}`;
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
    var Core2 = require_core();
    function translate(plugin, key, variables) {
      return plugin.t ? plugin.t(key, variables) : key;
    }
    function getCategoryTag(plugin, category) {
      if (category === "system") {
        return `<span style="background: #00aaff20; color: #00aaff; padding: 2px 6px; border-radius: 3px; font-size: 10px;">${translate(plugin, "category.system")}</span>`;
      }
      return `<span style="background: #ffaa0020; color: #ffaa00; padding: 2px 6px; border-radius: 3px; font-size: 10px;">${translate(plugin, "category.external")}</span>`;
    }
    function getRarityTag(item) {
      return item.rarity === "legendary" ? '<span style="color: #ffd700; margin-left: 5px;">\u{1F320}</span>' : '<span style="color: #9966ff; margin-left: 5px;">\u{1F3B4}</span>';
    }
    var Inventory2 = {
      showInventory(plugin) {
        const stats = plugin.dataStore.getStats();
        const inventory = stats.inventory || [];
        const modal = new Modal(plugin.app);
        modal.titleEl.setText(translate(plugin, "inventory.title"));
        const content = document.createElement("div");
        content.style.padding = "20px";
        if (inventory.length === 0) {
          content.innerHTML = `<div style="text-align: center; color: #888; padding: 40px;">${translate(plugin, "inventory.empty")}</div>`;
        } else {
          const itemCounts = {};
          for (const item of inventory) {
            const key = `${item.name}|${item.icon}`;
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
            itemDiv.innerHTML = `
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <div><span style="font-size: 24px; margin-right: 10px;">${item.icon}</span><strong>${item.name}</strong>${getCategoryTag(plugin, item.category)}${getRarityTag(item)}</div>
            <div style="display: flex; align-items: center; gap: 10px;">
              <span style="background: var(--background-secondary); padding: 4px 10px; border-radius: 12px; font-size: 12px; font-weight: bold;">x${item.count}</span>
              <span style="color: #888; font-size: 12px;">${translate(plugin, "inventory.tapToUse")}</span>
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
        backBtn.textContent = `\u21A9 ${translate(plugin, "common.backToPanel")}`;
        backBtn.style.flex = "1";
        backBtn.onclick = () => {
          modal.close();
          plugin.showStats();
        };
        const closeBtn = document.createElement("button");
        closeBtn.textContent = `\u2716 ${translate(plugin, "common.close")}`;
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
        modal.titleEl.setText(translate(plugin, "inventory.useTitle"));
        const content = document.createElement("div");
        content.style.padding = "20px";
        content.style.textAlign = "center";
        const externalHint = item.category === "external" ? `<div style="background: #ffaa0020; padding: 10px; border-radius: 5px; margin-bottom: 15px; color: #ffaa00; font-size: 14px;">${translate(plugin, "inventory.externalHint")}</div>` : "";
        content.innerHTML = `
      <div style="font-size: 48px; margin-bottom: 15px;">${item.icon}</div>
      <div style="font-size: 18px; font-weight: bold; margin-bottom: 10px;">${item.name}</div>
      <div style="color: #888; margin-bottom: 15px;">${item.description}</div>
      ${externalHint}
    `;
        const buttonContainer = document.createElement("div");
        buttonContainer.style.display = "flex";
        buttonContainer.style.gap = "10px";
        buttonContainer.style.marginTop = "20px";
        const confirmBtn = document.createElement("button");
        confirmBtn.textContent = item.category === "system" ? `\u2699 ${translate(plugin, "inventory.use")}` : `\u{1F381} ${translate(plugin, "inventory.useExternal")}`;
        confirmBtn.className = "mod-cta";
        confirmBtn.style.flex = "1";
        confirmBtn.onclick = async () => {
          const result = await plugin.dataStore.useItem(item.instanceId);
          new Notice(result.message);
          if (result.success) {
            Core2.updateStatusBar(plugin);
            modal.close();
            if (inventoryModal) {
              inventoryModal.close();
            }
            this.showInventory(plugin);
          }
        };
        const cancelBtn = document.createElement("button");
        cancelBtn.textContent = `\u2716 ${translate(plugin, "common.cancel")}`;
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
    var Core2 = require_core();
    var { renderEffectParams, buildEffectFromForm } = require_utils();
    var SupremePlayerSettingTab2 = class extends PluginSettingTab {
      constructor(app, plugin) {
        super(app, plugin);
        this.plugin = plugin;
        this.t = (key, variables) => this.plugin.t ? this.plugin.t(key, variables) : key;
      }
      getDefaultPlayerName() {
        return this.t("settings.defaultPlayerName");
      }
      getLocalizedText(value, fallback = "") {
        var _a;
        return ((_a = this.plugin.dataStore) == null ? void 0 : _a.getLocalizedText) ? this.plugin.dataStore.getLocalizedText(value, fallback) : value != null ? value : fallback;
      }
      getPerfectRewardDefaults() {
        var _a;
        return ((_a = this.plugin.dataStore) == null ? void 0 : _a.getLocalizedPerfectRewardDefaults) ? this.plugin.dataStore.getLocalizedPerfectRewardDefaults() : {
          name: this.t("datastore.reward.superDiamond.name"),
          description: this.t("datastore.reward.superDiamond.desc"),
          blessingTitle: this.t("datastore.reward.defaultBlessingTitle"),
          blessingMessage: this.t("datastore.reward.defaultBlessingMessage")
        };
      }
      ensureConfig() {
        if (!this.plugin.dataStore.config) {
          this.plugin.dataStore.config = this.plugin.dataStore.getDefaultConfig();
        }
        return this.plugin.dataStore.config;
      }
      createModalContent(modal, maxHeight = "70vh") {
        const content = document.createElement("div");
        content.style.padding = "20px";
        content.style.maxHeight = maxHeight;
        content.style.overflowY = "auto";
        modal.contentEl.appendChild(content);
        return content;
      }
      createButtonRow() {
        const row = document.createElement("div");
        row.style.display = "flex";
        row.style.gap = "10px";
        row.style.marginTop = "20px";
        return row;
      }
      createActionButton(text, onClick, className, style = "") {
        const button = document.createElement("button");
        button.textContent = text;
        if (className)
          button.className = className;
        if (style)
          button.style.cssText = style;
        button.onclick = onClick;
        return button;
      }
      getResolvedLanguageLabel() {
        var _a, _b, _c;
        const language = ((_c = (_b = (_a = this.plugin.dataStore) == null ? void 0 : _a.i18n) == null ? void 0 : _b.getLanguage) == null ? void 0 : _c.call(_b)) || "en";
        return language === "zh" ? this.t("settings.languageZh") : this.t("settings.languageEn");
      }
      async renderDebugSection(containerEl) {
        var _a, _b, _c, _d;
        const config = this.ensureConfig();
        const dailySettings = ((_b = (_a = this.plugin.dataStore).getDailyNotesSettings) == null ? void 0 : _b.call(_a)) || null;
        const dataPath = config.dataFilePath || this.plugin.dataStore.autoDetectDataPath();
        const templatePath = config.templatePath || this.plugin.dataStore.autoDetectTemplatePath();
        const normalizedTemplatePath = templatePath.endsWith(".md") ? templatePath : `${templatePath}.md`;
        const todayNotePath = Core2.getDailyNotePath(this.app);
        const todayNoteFile = await Core2.findTodayNoteFile(this.app);
        const activeFile = (_d = (_c = this.app.workspace).getActiveFile) == null ? void 0 : _d.call(_c);
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
            console.error("[Debug] Failed to parse today note:", error);
          }
        }
        containerEl.createEl("h3", { text: this.t("settings.debugTitle") });
        new Setting(containerEl).setName(this.t("settings.debugMode")).setDesc(this.t("settings.debugModeDesc")).addToggle((toggle) => {
          toggle.setValue(Boolean(config.debugMode)).onChange(async (value) => {
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
          suggestions.push(this.t("settings.debugSuggestionMissingToday"));
        }
        if (!templateExists) {
          suggestions.push(this.t("settings.debugSuggestionMissingTemplate"));
        }
        if (!dataExists) {
          suggestions.push(this.t("settings.debugSuggestionMissingData"));
        }
        if (!dailySettings) {
          suggestions.push(this.t("settings.debugSuggestionNoPlugin"));
        }
        if (!suggestions.length) {
          suggestions.push(this.t("settings.debugSuggestionHealthy"));
        }
        const panel = containerEl.createDiv();
        panel.style.cssText = "background: var(--background-secondary); border: 1px solid var(--background-modifier-border); border-radius: 10px; padding: 14px 16px; margin: 10px 0 18px;";
        const title = panel.createDiv();
        title.style.cssText = "font-weight: 700; margin-bottom: 10px;";
        title.textContent = this.t("settings.debugInfoTitle");
        const infoItems = [
          [this.t("settings.debugResolvedLanguage"), this.getResolvedLanguageLabel()],
          [this.t("settings.debugLanguageMode"), config.language || "auto"],
          [this.t("settings.debugTodayNotePath"), todayNotePath],
          [this.t("settings.debugTodayNoteFound"), todayNoteFile ? todayNoteFile.path : this.t("common.none")],
          [this.t("settings.debugTemplatePath"), normalizedTemplatePath],
          [this.t("settings.debugTemplateExists"), templateExists ? this.t("common.enabled") : this.t("common.disabled")],
          [this.t("settings.debugDataPath"), dataPath],
          [this.t("settings.debugDataExists"), dataExists ? this.t("common.enabled") : this.t("common.disabled")],
          [this.t("settings.debugActiveFile"), (activeFile == null ? void 0 : activeFile.path) || this.t("common.none")],
          [this.t("settings.debugDailyFolder"), (dailySettings == null ? void 0 : dailySettings.folder) || this.t("common.none")],
          [this.t("settings.debugDailyFormat"), (dailySettings == null ? void 0 : dailySettings.format) || "YYYY-MM-DD"],
          [this.t("settings.debugParsedMainTasks"), parsedRecord ? `${parsedRecord.mainTasks.filter((item) => item.completed).length}/${parsedRecord.mainTasks.length}` : this.t("common.none")],
          [this.t("settings.debugParsedHabits"), parsedRecord ? `${parsedRecord.habits.filter((item) => item.completed).length}/${parsedRecord.habits.length}` : this.t("common.none")],
          [this.t("settings.debugParsedExtraTasks"), parsedRecord ? `${parsedRecord.extraTasks.filter((item) => item.completed).length}/${parsedRecord.extraTasks.length}` : this.t("common.none")],
          [this.t("settings.debugParsedPomodoros"), parsedRecord ? `${parsedRecord.pomodoros.filter((item) => item.completed).length}/${parsedRecord.pomodoros.length}` : this.t("common.none")],
          [this.t("settings.debugParsedPoints"), parsedRecord ? parsedPoints : this.t("common.none")]
        ];
        infoItems.forEach(([label, value]) => {
          const row = panel.createDiv();
          row.style.cssText = "display: grid; grid-template-columns: 140px 1fr; gap: 10px; margin-bottom: 6px; font-size: 12px; line-height: 1.6;";
          const labelEl = row.createDiv();
          labelEl.style.cssText = "color: var(--text-muted);";
          labelEl.textContent = label;
          const valueEl = row.createDiv();
          valueEl.style.cssText = "word-break: break-all;";
          valueEl.textContent = String(value);
        });
        const suggestionTitle = panel.createDiv();
        suggestionTitle.style.cssText = "font-weight: 700; margin: 12px 0 8px;";
        suggestionTitle.textContent = this.t("settings.debugSuggestions");
        suggestions.forEach((text) => {
          const item = panel.createDiv();
          item.style.cssText = "font-size: 12px; line-height: 1.7; margin-bottom: 4px;";
          item.textContent = `\u2022 ${text}`;
        });
      }
      downloadJson(filename, payload) {
        const blob = new Blob([payload], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const anchor = document.createElement("a");
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
        const showSuggestions = (suggestions) => {
          hideSuggestions();
          if (!suggestions.length)
            return;
          suggestionEl = document.createElement("div");
          suggestionEl.className = "suggestion-container";
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
        };
        const searchFiles = (query) => {
          if (!query || query.length < 1) {
            hideSuggestions();
            return;
          }
          const queryLower = query.toLowerCase();
          const suggestions = [];
          for (const file of this.app.vault.getFiles()) {
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
        inputEl.addEventListener("input", (event) => searchFiles(event.target.value));
        inputEl.addEventListener("focus", (event) => {
          if (event.target.value)
            searchFiles(event.target.value);
        });
        inputEl.addEventListener("blur", () => setTimeout(hideSuggestions, 200));
        inputEl.addEventListener("keydown", (event) => {
          if (event.key === "Escape")
            hideSuggestions();
        });
      }
      async display() {
        const { containerEl } = this;
        containerEl.empty();
        containerEl.createEl("h2", { text: this.t("settings.title") });
        containerEl.createEl("h3", { text: this.t("settings.user") });
        new Setting(containerEl).setName(this.t("settings.playerName")).setDesc(this.t("settings.playerNameDesc")).addText((text) => {
          const stats = this.plugin.dataStore.getStats();
          text.setPlaceholder(this.t("settings.playerNamePlaceholder")).setValue(stats.playerName || this.getDefaultPlayerName()).onChange(async (value) => {
            const currentStats = this.plugin.dataStore.getStats();
            currentStats.playerName = value || this.getDefaultPlayerName();
            await this.plugin.dataStore.save();
          });
          text.inputEl.style.width = "200px";
        });
        new Setting(containerEl).setName(this.t("settings.language")).setDesc(this.t("settings.languageDesc")).addDropdown((dropdown) => {
          const config = this.ensureConfig();
          dropdown.addOption("auto", this.t("settings.languageAuto")).addOption("zh", this.t("settings.languageZh")).addOption("en", this.t("settings.languageEn")).setValue(config.language || "auto").onChange(async (value) => {
            config.language = value || "auto";
            await this.plugin.dataStore.saveConfig();
            this.display();
          });
        });
        containerEl.createEl("h3", { text: this.t("settings.data") });
        new Setting(containerEl).setName(this.t("settings.dataPath")).setDesc(this.t("settings.dataPathDesc")).addText((text) => {
          var _a;
          text.setPlaceholder(this.plugin.dataStore.autoDetectDataPath()).setValue(((_a = this.plugin.dataStore.config) == null ? void 0 : _a.dataFilePath) || "").onChange(async (value) => {
            const config = this.ensureConfig();
            config.dataFilePath = value;
            await this.plugin.dataStore.saveConfig();
          });
          this.setupPathAutocomplete(text.inputEl, ".json");
        }).addButton(
          (button) => button.setButtonText(this.t("template.autoDetect")).onClick(async () => {
            const detected = this.plugin.dataStore.autoDetectDataPath();
            const config = this.ensureConfig();
            config.dataFilePath = detected;
            await this.plugin.dataStore.saveConfig();
            new Notice(this.t("template.detected", { path: detected }));
            this.display();
          })
        );
        containerEl.createEl("h3", { text: this.t("settings.template") });
        new Setting(containerEl).setName(this.t("settings.templatePath")).setDesc(this.t("settings.templatePathDesc")).addText((text) => {
          var _a;
          text.setPlaceholder(this.plugin.dataStore.autoDetectTemplatePath()).setValue(((_a = this.plugin.dataStore.config) == null ? void 0 : _a.templatePath) || "").onChange(async (value) => {
            const config = this.ensureConfig();
            config.templatePath = value;
            await this.plugin.dataStore.saveConfig();
          });
          this.setupPathAutocomplete(text.inputEl, ".md");
        }).addButton(
          (button) => button.setButtonText(this.t("template.autoDetect")).onClick(async () => {
            let detected = this.plugin.dataStore.autoDetectTemplatePath();
            if (!detected.endsWith(".md")) {
              detected += ".md";
            }
            const config = this.ensureConfig();
            config.templatePath = detected;
            await this.plugin.dataStore.saveConfig();
            const exists = await this.app.vault.adapter.exists(detected);
            if (exists) {
              new Notice(this.t("template.detected", { path: detected }));
            } else {
              this.showCreateTemplateConfirm(detected);
            }
            this.display();
          })
        );
        new Setting(containerEl).setName(this.t("settings.updateTemplate")).setDesc(this.t("settings.updateTemplateDesc")).addButton((button) => button.setButtonText(this.t("settings.templateButton")).onClick(() => this.updateDailyTemplate()));
        await this.renderDebugSection(containerEl);
        new Setting(containerEl).setName(this.t("settings.unlock")).setDesc(this.t("settings.unlockDesc")).addButton((button) => {
          button.setButtonText(this.plugin.lockState.unlocked ? this.t("settings.unlockActive") : this.t("settings.clickToUnlock"));
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
            new Notice(this.t("settings.waitToLock", { seconds: remainingSeconds }));
            return;
          }
          if (this.plugin.lockState.lastLockAttempt && now - this.plugin.lockState.lastLockAttempt < 15e3) {
            this.plugin.lockState.lockConfirmCount = (this.plugin.lockState.lockConfirmCount || 0) + 1;
            const remaining2 = 3 - this.plugin.lockState.lockConfirmCount;
            if (remaining2 > 0) {
              button.setButtonText(this.t("settings.confirmLock", { remaining: remaining2 }));
              return;
            }
          } else {
            this.plugin.lockState.lockConfirmCount = 1;
            this.plugin.lockState.lastLockAttempt = now;
            button.setButtonText(this.t("settings.confirmLock", { remaining: 2 }));
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
          button.setButtonText(this.t("settings.clickToUnlock"));
          new Notice(this.t("settings.locked"));
          this.display();
          return;
        }
        this.plugin.lockState.clickCount += 1;
        const remaining = 42 - this.plugin.lockState.clickCount;
        if (remaining <= 0) {
          this.plugin.lockState.unlocked = true;
          this.plugin.lockState.unlockTime = Date.now();
          this.plugin.lockState.lockConfirmCount = 0;
          button.setButtonText(this.t("settings.unlockActive"));
          new Notice(this.t("settings.unlocked"));
          this.plugin.lockState.autoLockTimer = setTimeout(() => {
            this.plugin.lockState.unlocked = false;
            this.plugin.lockState.clickCount = 0;
            new Notice(this.t("settings.autoLocked"));
            this.display();
          }, 30 * 60 * 1e3);
          this.display();
        } else {
          button.setButtonText(this.t("settings.clicksRemaining", { remaining }));
        }
      }
      addUnlockedSettings(containerEl) {
        containerEl.createEl("h3", { text: this.t("settings.dailyTasks") });
        new Setting(containerEl).setName(this.t("settings.dailyTasks")).setDesc(this.t("settings.dailyTasksDesc")).addButton((button) => button.setButtonText(this.t("common.configure")).onClick(() => this.showDailyTasksConfigModal()));
        containerEl.createEl("h3", { text: this.t("settings.perfectConfig") });
        new Setting(containerEl).setName(this.t("settings.perfectConfig")).setDesc(this.t("settings.perfectConfigDesc")).addButton((button) => button.setButtonText(this.t("common.configure")).onClick(() => this.showPerfectCheckInConfigModal()));
        containerEl.createEl("h3", { text: this.t("settings.shop") });
        new Setting(containerEl).setName(this.t("settings.shopAdd")).setDesc(this.t("settings.shopAddDesc")).addButton((button) => button.setButtonText(this.t("common.add")).onClick(() => this.showAddItemModal()));
        new Setting(containerEl).setName(this.t("settings.shopEdit")).setDesc(this.t("settings.shopEditDesc")).addButton((button) => button.setButtonText(this.t("common.edit")).onClick(() => this.showEditItemModal()));
        new Setting(containerEl).setName(this.t("settings.shopDelete")).setDesc(this.t("settings.shopDeleteDesc")).addButton((button) => button.setButtonText(this.t("common.delete")).onClick(() => this.showDeleteItemModal()));
        new Setting(containerEl).setName(this.t("settings.shopExport")).setDesc(this.t("settings.shopExportDesc")).addButton((button) => button.setButtonText(this.t("common.export")).onClick(() => this.exportShopConfig()));
        new Setting(containerEl).setName(this.t("settings.shopImport")).setDesc(this.t("settings.shopImportDesc")).addButton((button) => button.setButtonText(this.t("common.import")).onClick(() => this.importShopConfig()));
        containerEl.createEl("h3", { text: this.t("settings.levels") });
        new Setting(containerEl).setName(this.t("settings.levelsEdit")).setDesc(this.t("settings.levelsEditDesc")).addButton((button) => button.setButtonText(this.t("common.edit")).onClick(() => this.showEditLevelsModal()));
        new Setting(containerEl).setName(this.t("settings.levelsAdd")).setDesc(this.t("settings.levelsAddDesc")).addButton((button) => button.setButtonText(this.t("common.add")).onClick(() => this.showAddLevelModal()));
        containerEl.createEl("h3", { text: this.t("settings.currencies") });
        new Setting(containerEl).setName(this.t("settings.currencies")).setDesc(this.t("settings.currenciesDesc")).addButton((button) => button.setButtonText(this.t("common.manage")).onClick(() => this.showManageCurrenciesModal()));
        containerEl.createEl("h3", { text: this.t("settings.dataIO") });
        new Setting(containerEl).setName(this.t("settings.exportData")).setDesc(this.t("settings.exportDataDesc")).addButton((button) => button.setButtonText(this.t("common.export")).onClick(async () => {
          const data = await this.plugin.dataStore.exportData();
          const filename = `supreme-player-backup-${(/* @__PURE__ */ new Date()).toISOString().split("T")[0]}.json`;
          this.downloadJson(filename, data);
          new Notice(this.t("settings.dataExported"));
        }));
        new Setting(containerEl).setName(this.t("settings.importData")).setDesc(this.t("settings.importDataDesc")).addButton((button) => button.setButtonText(this.t("common.import")).onClick(() => {
          const input = document.createElement("input");
          input.type = "file";
          input.accept = ".json";
          input.onchange = async (event) => {
            var _a;
            const file = (_a = event.target.files) == null ? void 0 : _a[0];
            if (!file)
              return;
            const reader = new FileReader();
            reader.onload = async (loadEvent) => {
              const result = await this.plugin.dataStore.importData(loadEvent.target.result);
              new Notice(result.message);
              if (result.success) {
                Core2.updateStatusBar(this.plugin);
                this.display();
              }
            };
            reader.readAsText(file);
          };
          input.click();
        }));
      }
      showDailyTasksConfigModal() {
        var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k;
        const config = this.ensureConfig();
        const dailyTasks = config.dailyTasks || {
          mainTasks: { count: 3, pointsPerTask: 100 },
          habits: { items: [] },
          extraTasks: { count: 2, pointsPerTask: 50 },
          pomodoro: { count: 6, pointsPerPomodoro: 50 }
        };
        const modal = new Modal(this.app);
        modal.titleEl.setText(this.t("settings.dailyTaskModalTitle"));
        const content = this.createModalContent(modal);
        content.innerHTML = `
      <div style="background: var(--background-secondary); padding: 15px; border-radius: 8px; margin-bottom: 20px;">
        <div style="font-weight: bold; margin-bottom: 10px;">${this.t("settings.mainTasks")}</div>
        <div style="display: flex; gap: 10px;">
          <div style="flex: 1;">
            <div style="font-size: 12px; color: #888; margin-bottom: 5px;">${this.t("settings.taskCount")}</div>
            <input type="number" id="main-count" value="${((_a = dailyTasks.mainTasks) == null ? void 0 : _a.count) || 3}" min="1" max="10" style="width: 100%;">
          </div>
          <div style="flex: 1;">
            <div style="font-size: 12px; color: #888; margin-bottom: 5px;">${this.t("settings.pointsPerTask")}</div>
            <input type="number" id="main-points" value="${((_b = dailyTasks.mainTasks) == null ? void 0 : _b.pointsPerTask) || 100}" min="1" style="width: 100%;">
          </div>
        </div>
      </div>

      <div style="background: var(--background-secondary); padding: 15px; border-radius: 8px; margin-bottom: 20px;">
        <div style="font-weight: bold; margin-bottom: 10px;">${this.t("settings.habitList")}</div>
        <div id="habits-container" style="margin-bottom: 10px;"></div>
        <button id="add-habit-btn" style="width: 100%; padding: 8px; background: var(--interactive-accent); color: white; border: none; border-radius: 5px; cursor: pointer;">${this.t("settings.addHabit")}</button>
      </div>

      <div style="background: var(--background-secondary); padding: 15px; border-radius: 8px; margin-bottom: 20px;">
        <div style="font-weight: bold; margin-bottom: 10px;">${this.t("settings.extraTasks")}</div>
        <div style="display: flex; gap: 10px; margin-bottom: 10px;">
          <div style="flex: 1;">
            <div style="font-size: 12px; color: #888; margin-bottom: 5px;">${this.t("settings.taskCount")}</div>
            <input type="number" id="extra-count" value="${((_c = dailyTasks.extraTasks) == null ? void 0 : _c.count) || 2}" min="1" max="10" style="width: 100%;">
          </div>
          <div style="flex: 1;">
            <div style="font-size: 12px; color: #888; margin-bottom: 5px;">${this.t("settings.pointsPerTask")}</div>
            <input type="number" id="extra-points" value="${((_d = dailyTasks.extraTasks) == null ? void 0 : _d.pointsPerTask) || 50}" min="1" style="width: 100%;">
          </div>
        </div>
        <div id="extra-max-display" style="font-size: 12px; color: #888;">${this.t("settings.maxPoints", {
          value: (((_e = dailyTasks.extraTasks) == null ? void 0 : _e.count) || 2) * (((_f = dailyTasks.extraTasks) == null ? void 0 : _f.pointsPerTask) || 50)
        })}</div>
      </div>

      <div style="background: var(--background-secondary); padding: 15px; border-radius: 8px; margin-bottom: 20px;">
        <div style="font-weight: bold; margin-bottom: 10px;">${this.t("settings.pomodoro")}</div>
        <div style="display: flex; gap: 10px; margin-bottom: 10px;">
          <div style="flex: 1;">
            <div style="font-size: 12px; color: #888; margin-bottom: 5px;">${this.t("settings.taskCount")}</div>
            <input type="number" id="pomodoro-count" value="${((_g = dailyTasks.pomodoro) == null ? void 0 : _g.count) || 6}" min="1" max="12" style="width: 100%;">
          </div>
          <div style="flex: 1;">
            <div style="font-size: 12px; color: #888; margin-bottom: 5px;">${this.t("settings.pointsPerPomodoro")}</div>
            <input type="number" id="pomodoro-points" value="${((_h = dailyTasks.pomodoro) == null ? void 0 : _h.pointsPerPomodoro) || 50}" min="1" style="width: 100%;">
          </div>
        </div>
        <div id="pomodoro-max-display" style="font-size: 12px; color: #888;">${this.t("settings.maxPoints", {
          value: (((_i = dailyTasks.pomodoro) == null ? void 0 : _i.count) || 6) * (((_j = dailyTasks.pomodoro) == null ? void 0 : _j.pointsPerPomodoro) || 50)
        })}</div>
      </div>
    `;
        const habitsContainer = content.querySelector("#habits-container");
        const habits = [...((_k = dailyTasks.habits) == null ? void 0 : _k.items) || []];
        const renderHabits = () => {
          habitsContainer.innerHTML = "";
          habits.forEach((habit, index) => {
            const habitDiv = document.createElement("div");
            habitDiv.style.cssText = "display: flex; gap: 10px; margin-bottom: 8px; align-items: center;";
            habitDiv.innerHTML = `
          <input type="text" value="${habit.name}" placeholder="${this.t("settings.habitNamePlaceholder")}" class="habit-name" data-index="${index}" style="flex: 1;">
          <input type="number" value="${habit.points}" placeholder="${this.t("effect.value")}" class="habit-points" data-index="${index}" style="width: 80px;">
          <button class="remove-habit-btn" data-index="${index}" style="background: #ff6666; color: white; border: none; border-radius: 3px; padding: 5px 10px; cursor: pointer;">\xD7</button>
        `;
            habitsContainer.appendChild(habitDiv);
          });
          habitsContainer.querySelectorAll(".remove-habit-btn").forEach((button) => {
            button.onclick = (event) => {
              const index = parseInt(event.target.dataset.index, 10);
              habits.splice(index, 1);
              renderHabits();
            };
          });
          habitsContainer.querySelectorAll(".habit-name").forEach((input) => {
            input.onchange = (event) => {
              habits[parseInt(event.target.dataset.index, 10)].name = event.target.value;
            };
          });
          habitsContainer.querySelectorAll(".habit-points").forEach((input) => {
            input.onchange = (event) => {
              habits[parseInt(event.target.dataset.index, 10)].points = parseInt(event.target.value, 10) || 10;
            };
          });
        };
        renderHabits();
        content.querySelector("#add-habit-btn").onclick = () => {
          habits.push({ name: this.t("settings.habitNewName"), points: 10 });
          renderHabits();
        };
        const extraCountInput = content.querySelector("#extra-count");
        const extraPointsInput = content.querySelector("#extra-points");
        const extraMaxDisplay = content.querySelector("#extra-max-display");
        const pomodoroCountInput = content.querySelector("#pomodoro-count");
        const pomodoroPointsInput = content.querySelector("#pomodoro-points");
        const pomodoroMaxDisplay = content.querySelector("#pomodoro-max-display");
        const updateExtraMax = () => {
          const count = parseInt(extraCountInput.value, 10) || 2;
          const points = parseInt(extraPointsInput.value, 10) || 50;
          extraMaxDisplay.textContent = this.t("settings.maxPoints", { value: count * points });
        };
        const updatePomodoroMax = () => {
          const count = parseInt(pomodoroCountInput.value, 10) || 6;
          const points = parseInt(pomodoroPointsInput.value, 10) || 50;
          pomodoroMaxDisplay.textContent = this.t("settings.maxPoints", { value: count * points });
        };
        extraCountInput.oninput = updateExtraMax;
        extraPointsInput.oninput = updateExtraMax;
        pomodoroCountInput.oninput = updatePomodoroMax;
        pomodoroPointsInput.oninput = updatePomodoroMax;
        const buttonRow = this.createButtonRow();
        buttonRow.appendChild(this.createActionButton(this.t("common.save"), async () => {
          config.dailyTasks = {
            mainTasks: {
              count: parseInt(content.querySelector("#main-count").value, 10) || 3,
              pointsPerTask: parseInt(content.querySelector("#main-points").value, 10) || 100
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
          new Notice(this.t("settings.dailyTasksSaved"));
          modal.close();
        }, "mod-cta", "flex: 1;"));
        buttonRow.appendChild(this.createActionButton(this.t("common.cancel"), () => modal.close(), "", "flex: 1;"));
        content.appendChild(buttonRow);
        modal.open();
      }
      showPerfectCheckInConfigModal() {
        var _a, _b, _c, _d, _e;
        const config = this.ensureConfig();
        const rewardDefaults = this.getPerfectRewardDefaults();
        const rewardConfig = config.perfectCheckInReward || {
          enabled: true,
          rewardType: "exclusive",
          shopItemId: null,
          exclusiveItem: {
            name: rewardDefaults.name,
            icon: "\u{1F48E}",
            description: rewardDefaults.description,
            rarity: "legendary",
            category: "system",
            effect: { type: "super_diamond" }
          },
          blessingTitle: rewardDefaults.blessingTitle,
          blessingMessage: rewardDefaults.blessingMessage
        };
        const perfectReward = this.plugin.dataStore.getLocalizedPerfectReward ? this.plugin.dataStore.getLocalizedPerfectReward(rewardConfig) : rewardConfig;
        const shopItems = this.plugin.dataStore.getShopItems() || [];
        const shopOptions = shopItems.map((item) => `<option value="${item.id}" ${perfectReward.shopItemId === item.id ? "selected" : ""}>${item.icon} ${item.name}</option>`).join("");
        const modal = new Modal(this.app);
        modal.titleEl.setText(this.t("settings.perfectConfigModalTitle"));
        const content = this.createModalContent(modal, "500px");
        content.innerHTML = `
      <div style="margin-bottom: 15px;">
        <div style="font-size: 12px; color: #888; margin-bottom: 5px;">${this.t("settings.rewardType")}</div>
        <select id="reward-type" style="width: 100%;">
          <option value="shop" ${perfectReward.rewardType === "shop" ? "selected" : ""}>${this.t("settings.rewardShop")}</option>
          <option value="exclusive" ${perfectReward.rewardType === "exclusive" ? "selected" : ""}>${this.t("settings.rewardExclusive")}</option>
        </select>
      </div>

      <div id="shop-reward-section" style="${perfectReward.rewardType === "shop" ? "" : "display: none;"}">
        <div style="font-size: 12px; color: #888; margin-bottom: 5px;">${this.t("settings.selectShopItem")}</div>
        <select id="shop-item-select" style="width: 100%; margin-bottom: 15px;">
          <option value="">-- ${this.t("common.select")} --</option>
          ${shopOptions}
        </select>
      </div>

      <div id="exclusive-reward-section" style="${perfectReward.rewardType === "exclusive" ? "" : "display: none;"}">
        <div style="background: var(--background-secondary); padding: 15px; border-radius: 8px; margin-bottom: 15px;">
          <div style="font-weight: bold; margin-bottom: 10px;">${this.t("settings.exclusiveConfig")}</div>
          <div style="font-size: 11px; color: #888; margin-bottom: 10px;">${this.t("settings.exclusiveHint")}</div>
          <div style="margin-bottom: 10px;">
            <div style="font-size: 12px; color: #888; margin-bottom: 5px;">${this.t("settings.itemName")}</div>
            <input type="text" id="exclusive-name" value="${((_a = perfectReward.exclusiveItem) == null ? void 0 : _a.name) || this.getLocalizedText(rewardDefaults.name, this.t("datastore.reward.superDiamond.name"))}" style="width: 100%;">
          </div>
          <div style="margin-bottom: 10px;">
            <div style="font-size: 12px; color: #888; margin-bottom: 5px;">${this.t("settings.itemIcon")}</div>
            <input type="text" id="exclusive-icon" value="${((_b = perfectReward.exclusiveItem) == null ? void 0 : _b.icon) || "\u{1F48E}"}" style="width: 100%;">
          </div>
          <div style="margin-bottom: 10px;">
            <div style="font-size: 12px; color: #888; margin-bottom: 5px;">${this.t("settings.itemDescription")}</div>
            <input type="text" id="exclusive-desc" value="${((_c = perfectReward.exclusiveItem) == null ? void 0 : _c.description) || ""}" style="width: 100%;">
          </div>
          <div style="margin-bottom: 10px;">
            <div style="font-size: 12px; color: #888; margin-bottom: 5px;">${this.t("common.rarity")}</div>
            <select id="exclusive-rarity" style="width: 100%;">
              <option value="rare" ${((_d = perfectReward.exclusiveItem) == null ? void 0 : _d.rarity) === "rare" ? "selected" : ""}>${this.t("rarity.rare")}</option>
              <option value="legendary" ${((_e = perfectReward.exclusiveItem) == null ? void 0 : _e.rarity) === "legendary" ? "selected" : ""}>${this.t("rarity.legendary")}</option>
            </select>
          </div>
        </div>
      </div>

      <div style="background: var(--background-secondary); padding: 15px; border-radius: 8px; margin-bottom: 20px;">
        <div style="font-weight: bold; margin-bottom: 15px;">${this.t("settings.blessingConfig")}</div>
        <div style="margin-bottom: 10px;">
          <div style="font-size: 12px; color: #888; margin-bottom: 5px;">${this.t("settings.blessingTitle")}</div>
          <input type="text" id="blessing-title" value="${perfectReward.blessingTitle || ""}" style="width: 100%;">
        </div>
        <div style="margin-bottom: 10px;">
          <div style="font-size: 12px; color: #888; margin-bottom: 5px;">${this.t("settings.blessingMessage")}</div>
          <textarea id="blessing-message" style="width: 100%; height: 60px;">${perfectReward.blessingMessage || ""}</textarea>
        </div>
      </div>

      <div style="display: flex; align-items: center; gap: 10px;">
        <input type="checkbox" id="reward-enabled" ${perfectReward.enabled !== false ? "checked" : ""}>
        <label for="reward-enabled">${this.t("settings.enablePerfectReward")}</label>
      </div>
    `;
        const rewardTypeSelect = content.querySelector("#reward-type");
        const shopRewardSection = content.querySelector("#shop-reward-section");
        const exclusiveRewardSection = content.querySelector("#exclusive-reward-section");
        rewardTypeSelect.onchange = () => {
          const isShop = rewardTypeSelect.value === "shop";
          shopRewardSection.style.display = isShop ? "" : "none";
          exclusiveRewardSection.style.display = isShop ? "none" : "";
        };
        const buttonRow = this.createButtonRow();
        buttonRow.appendChild(this.createActionButton(this.t("common.save"), async () => {
          const rewardType = content.querySelector("#reward-type").value;
          const currentReward = config.perfectCheckInReward || {};
          const currentExclusive = currentReward.exclusiveItem || {};
          config.perfectCheckInReward = {
            enabled: content.querySelector("#reward-enabled").checked,
            rewardType,
            shopItemId: rewardType === "shop" ? content.querySelector("#shop-item-select").value : null,
            exclusiveItem: rewardType === "exclusive" ? {
              name: this.plugin.dataStore.updateLocalizedValue(currentExclusive.name, content.querySelector("#exclusive-name").value.trim() || this.getLocalizedText(rewardDefaults.name, this.t("datastore.reward.superDiamond.name"))),
              icon: content.querySelector("#exclusive-icon").value.trim() || "\u{1F48E}",
              description: this.plugin.dataStore.updateLocalizedValue(currentExclusive.description, content.querySelector("#exclusive-desc").value.trim()),
              rarity: content.querySelector("#exclusive-rarity").value,
              category: "system",
              effect: { type: "super_diamond" }
            } : null,
            blessingTitle: this.plugin.dataStore.updateLocalizedValue(currentReward.blessingTitle, content.querySelector("#blessing-title").value.trim() || this.getLocalizedText(rewardDefaults.blessingTitle, this.t("datastore.reward.defaultBlessingTitle"))),
            blessingMessage: this.plugin.dataStore.updateLocalizedValue(currentReward.blessingMessage, content.querySelector("#blessing-message").value.trim() || this.getLocalizedText(rewardDefaults.blessingMessage, this.t("datastore.reward.defaultBlessingMessage")))
          };
          await this.plugin.dataStore.saveConfig();
          new Notice(this.t("settings.perfectConfigSaved"));
          modal.close();
        }, "mod-cta", "flex: 1;"));
        buttonRow.appendChild(this.createActionButton(this.t("common.cancel"), () => modal.close(), "", "flex: 1;"));
        content.appendChild(buttonRow);
        modal.open();
      }
      showAddItemModal() {
        const modal = new Modal(this.app);
        modal.titleEl.setText(this.t("settings.addItemTitle"));
        const content = this.createModalContent(modal);
        content.innerHTML = `
      <div style="margin-bottom: 5px;">${this.t("settings.itemName")}</div>
      <input type="text" id="item-name" placeholder="${this.t("settings.itemNameInputPlaceholder")}" style="width: 100%; margin-bottom: 15px;">
      <div style="margin-bottom: 5px;">${this.t("settings.itemDescription")}</div>
      <input type="text" id="item-desc" placeholder="${this.t("settings.itemDescInputPlaceholder")}" style="width: 100%; margin-bottom: 15px;">
      <div style="margin-bottom: 5px;">${this.t("settings.itemIcon")}</div>
      <input type="text" id="item-icon" placeholder="${this.t("settings.itemIconPlaceholder")}" style="width: 100%; margin-bottom: 15px;">
      <div style="display: flex; gap: 10px; margin-bottom: 15px;">
        <div style="flex: 1;">
          <div style="margin-bottom: 5px;">${this.t("common.price")}</div>
          <input type="number" id="item-price" value="1" min="1" style="width: 100%;">
        </div>
        <div style="flex: 1;">
          <div style="margin-bottom: 5px;">${this.t("common.rarity")}</div>
          <select id="item-rarity" style="width: 100%;">
            <option value="rare">${this.t("rarity.rare")}</option>
            <option value="legendary">${this.t("rarity.legendary")}</option>
          </select>
        </div>
      </div>
      <div style="margin-bottom: 5px;">${this.t("settings.itemCategory")}</div>
      <select id="item-category" style="width: 100%; margin-bottom: 15px;">
        <option value="system">${this.t("settings.systemItem")}</option>
        <option value="external">${this.t("settings.externalItem")}</option>
      </select>
      <div id="effect-config" style="background: var(--background-secondary); padding: 15px; border-radius: 8px; margin-bottom: 15px;">
        <div style="font-weight: bold; margin-bottom: 10px;">${this.t("settings.effectConfig")}</div>
        <div style="margin-bottom: 5px;">${this.t("settings.effectType")}</div>
        <select id="effect-type" style="width: 100%; margin-bottom: 15px;">
          <option value="add_wish_stars">${this.t("effect.addWishStars")}</option>
          <option value="add_level">${this.t("effect.addLevel")}</option>
          <option value="buff">${this.t("effect.buff")}</option>
          <option value="random_wish_stars">${this.t("effect.randomWishStars")}</option>
          <option value="add_points">${this.t("effect.addPoints")}</option>
        </select>
        <div id="effect-params"></div>
      </div>
    `;
        const effectParams = content.querySelector("#effect-params");
        const effectTypeSelect = content.querySelector("#effect-type");
        const categorySelect = content.querySelector("#item-category");
        const effectConfig = content.querySelector("#effect-config");
        const renderEffect = () => renderEffectParams(effectTypeSelect.value, effectParams, this.t);
        const toggleEffectConfig = () => {
          effectConfig.style.display = categorySelect.value === "external" ? "none" : "block";
        };
        effectTypeSelect.onchange = renderEffect;
        categorySelect.onchange = toggleEffectConfig;
        renderEffect();
        toggleEffectConfig();
        const buttonRow = this.createButtonRow();
        buttonRow.appendChild(this.createActionButton(this.t("common.add"), async () => {
          const name = content.querySelector("#item-name").value.trim();
          if (!name) {
            new Notice(this.t("settings.enterItemName"));
            return;
          }
          const category = content.querySelector("#item-category").value;
          const effect = buildEffectFromForm(category, effectTypeSelect.value, this.t);
          if (category === "system" && effect === null && effectTypeSelect.value === "buff") {
            return;
          }
          const result = await this.plugin.dataStore.addShopItem(
            name,
            content.querySelector("#item-desc").value.trim(),
            category,
            "consumable",
            parseInt(content.querySelector("#item-price").value, 10) || 1,
            content.querySelector("#item-rarity").value,
            content.querySelector("#item-icon").value.trim() || "\u{1F381}",
            effect
          );
          new Notice(result.message);
          if (result.success) {
            modal.close();
          }
        }, "mod-cta", "flex: 1;"));
        buttonRow.appendChild(this.createActionButton(this.t("common.cancel"), () => modal.close(), "", "flex: 1;"));
        content.appendChild(buttonRow);
        modal.open();
      }
      showEditItemModal() {
        const allItems = this.plugin.dataStore.getShopItems();
        if (!allItems.length) {
          new Notice(this.t("settings.noEditableItems"));
          return;
        }
        const modal = new Modal(this.app);
        modal.titleEl.setText(this.t("settings.editItemTitle"));
        const content = this.createModalContent(modal, "500px");
        content.innerHTML = `
      <div style="margin-bottom: 5px;">${this.t("common.select")}</div>
      <select id="item-select" style="width: 100%; margin-bottom: 15px;">
        ${allItems.map((item) => `<option value="${item.id}">${item.icon} ${item.name}</option>`).join("")}
      </select>
      <div style="margin-bottom: 5px;">${this.t("settings.itemName")}</div>
      <input type="text" id="item-name" style="width: 100%; margin-bottom: 15px;">
      <div style="margin-bottom: 5px;">${this.t("settings.itemDescription")}</div>
      <input type="text" id="item-desc" style="width: 100%; margin-bottom: 15px;">
      <div style="margin-bottom: 5px;">${this.t("settings.itemIcon")}</div>
      <input type="text" id="item-icon" style="width: 100%; margin-bottom: 15px;">
      <div style="margin-bottom: 5px;">${this.t("common.price")}</div>
      <input type="number" id="item-price" style="width: 100%; margin-bottom: 15px;">
      <div style="margin-bottom: 5px;">${this.t("common.rarity")}</div>
      <select id="item-rarity" style="width: 100%; margin-bottom: 15px;">
        <option value="rare">${this.t("rarity.rare")}</option>
        <option value="legendary">${this.t("rarity.legendary")}</option>
      </select>
      <div style="margin-bottom: 5px;">${this.t("settings.itemCategory")}</div>
      <select id="item-category" style="width: 100%; margin-bottom: 20px;">
        <option value="system">${this.t("settings.systemItem")}</option>
        <option value="external">${this.t("settings.externalItem")}</option>
      </select>
      <div id="effect-section">
        <div style="font-weight: bold; margin-bottom: 10px;">${this.t("settings.effectConfig")}</div>
        <div style="margin-bottom: 5px;">${this.t("settings.effectType")}</div>
        <select id="effect-type" style="width: 100%; margin-bottom: 15px;">
          <option value="add_wish_stars">${this.t("effect.addWishStars")}</option>
          <option value="add_level">${this.t("effect.addLevel")}</option>
          <option value="buff">${this.t("effect.buff")}</option>
          <option value="random_wish_stars">${this.t("effect.randomWishStars")}</option>
          <option value="add_points">${this.t("effect.addPoints")}</option>
        </select>
        <div id="effect-params"></div>
      </div>
    `;
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
        const renderEffect = () => renderEffectParams(effectTypeSelect.value, effectParams, this.t);
        const loadItem = () => {
          var _a;
          const item = allItems.find((entry) => entry.id === itemSelect.value);
          if (!item)
            return;
          itemName.value = item.name;
          itemDesc.value = item.description || "";
          itemIcon.value = item.icon || "\u{1F381}";
          itemPrice.value = item.price || 1;
          itemRarity.value = item.rarity || "rare";
          itemCategory.value = item.category || "system";
          effectSection.style.display = itemCategory.value === "external" ? "none" : "block";
          const effectType = ((_a = item.effect) == null ? void 0 : _a.type) || "add_wish_stars";
          effectTypeSelect.value = effectType;
          renderEffect();
          if (!item.effect)
            return;
          if (effectType === "add_wish_stars" || effectType === "add_level" || effectType === "add_points") {
            const valueInput = effectParams.querySelector("#effect-value");
            if (valueInput)
              valueInput.value = item.effect.value || 1;
          } else if (effectType === "buff") {
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
              buffDuration.value = item.effect.duration || item.effect.buffDuration || 24;
          } else if (effectType === "random_wish_stars") {
            const minInput = effectParams.querySelector("#effect-min");
            const maxInput = effectParams.querySelector("#effect-max");
            if (minInput)
              minInput.value = item.effect.min || 1;
            if (maxInput)
              maxInput.value = item.effect.max || 5;
          }
        };
        effectTypeSelect.onchange = renderEffect;
        itemCategory.onchange = () => {
          effectSection.style.display = itemCategory.value === "external" ? "none" : "block";
        };
        itemSelect.onchange = loadItem;
        loadItem();
        const buttonRow = this.createButtonRow();
        buttonRow.appendChild(this.createActionButton(this.t("common.save"), async () => {
          const category = itemCategory.value;
          const effect = buildEffectFromForm(category, effectTypeSelect.value, this.t);
          if (category === "system" && effect === null && effectTypeSelect.value === "buff") {
            return;
          }
          const result = await this.plugin.dataStore.updateShopItem(itemSelect.value, {
            name: itemName.value.trim(),
            description: itemDesc.value.trim(),
            icon: itemIcon.value.trim() || "\u{1F381}",
            price: parseInt(itemPrice.value, 10) || 1,
            rarity: itemRarity.value,
            category,
            effect
          });
          new Notice(result.message);
          if (result.success) {
            modal.close();
          }
        }, "mod-cta", "flex: 1;"));
        buttonRow.appendChild(this.createActionButton(this.t("common.cancel"), () => modal.close(), "", "flex: 1;"));
        content.appendChild(buttonRow);
        modal.open();
      }
      showDeleteItemModal() {
        const allItems = this.plugin.dataStore.getShopItems();
        if (!allItems.length) {
          new Notice(this.t("settings.noDeletableItems"));
          return;
        }
        const modal = new Modal(this.app);
        modal.titleEl.setText(this.t("settings.deleteItemTitle"));
        const content = this.createModalContent(modal, "unset");
        content.innerHTML = `
      <div style="margin-bottom: 5px;">${this.t("common.select")}</div>
      <select id="item-select" style="width: 100%; margin-bottom: 20px;">
        ${allItems.map((item) => `<option value="${item.id}">${item.icon} ${item.name}</option>`).join("")}
      </select>
      <div style="color: #ff6666; font-size: 12px; margin-bottom: 15px;">${this.t("settings.deleteWarning")}</div>
    `;
        const buttonRow = this.createButtonRow();
        buttonRow.appendChild(this.createActionButton(this.t("common.delete"), async () => {
          const result = await this.plugin.dataStore.deleteShopItem(content.querySelector("#item-select").value);
          new Notice(result.message);
          if (result.success) {
            modal.close();
          }
        }, "", "background-color: #ff6666; color: white; flex: 1;"));
        buttonRow.appendChild(this.createActionButton(this.t("common.cancel"), () => modal.close(), "", "flex: 1;"));
        content.appendChild(buttonRow);
        modal.open();
      }
      showEditLevelsModal() {
        const config = this.ensureConfig();
        const levels = config.levels || [];
        const modal = new Modal(this.app);
        modal.titleEl.setText(this.t("settings.editLevelsTitle"));
        const content = this.createModalContent(modal, "unset");
        const list = document.createElement("div");
        list.style.cssText = "max-height: 400px; overflow-y: auto;";
        levels.forEach((levelConfig, index) => {
          const displayLevel = this.plugin.dataStore.getLocalizedLevelConfig(levelConfig, index);
          const levelDiv = document.createElement("div");
          levelDiv.style.cssText = `padding: 15px; margin-bottom: 10px; border: 1px solid var(--background-modifier-border); border-radius: 8px; border-left: 4px solid ${displayLevel.color || "#ffffff"}; cursor: pointer;`;
          levelDiv.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
          <div style="font-weight: bold; font-size: 16px;">${displayLevel.title}</div>
          <div style="color: #888; font-size: 12px;">${displayLevel.maxLevel === 999 ? this.t("settings.levelRangeInfinite", { min: displayLevel.minLevel }) : this.t("settings.levelRange", { min: displayLevel.minLevel, max: displayLevel.maxLevel })}</div>
        </div>
        <div style="color: #666; font-size: 12px;">${this.t("settings.levelAbility", { value: displayLevel.ability || "" })}</div>
        <div style="color: #666; font-size: 12px;">${this.t("settings.levelPhase", { value: displayLevel.phase || "" })}</div>
      `;
          levelDiv.onclick = () => this.showEditLevelDetailModal(index, levelConfig);
          list.appendChild(levelDiv);
        });
        content.appendChild(list);
        content.appendChild(this.createActionButton(this.t("common.close"), () => modal.close(), "", "width: 100%; margin-top: 10px;"));
        modal.open();
      }
      showEditLevelDetailModal(index, levelConfig) {
        const displayLevel = this.plugin.dataStore.getLocalizedLevelConfig(levelConfig, index);
        const modal = new Modal(this.app);
        modal.titleEl.setText(this.t("settings.editLevelTitle", { title: displayLevel.title }));
        const content = this.createModalContent(modal, "unset");
        content.innerHTML = `
      <div style="margin-bottom: 5px;">${this.t("settings.levelTitle")}</div>
      <input type="text" id="level-title" value="${displayLevel.title}" style="width: 100%; margin-bottom: 15px;">
      <div style="margin-bottom: 5px;">${this.t("settings.levelAbilityLabel")}</div>
      <input type="text" id="level-ability" value="${displayLevel.ability || ""}" style="width: 100%; margin-bottom: 15px;">
      <div style="margin-bottom: 5px;">${this.t("settings.levelAbilityIcon")}</div>
      <input type="text" id="level-ability-icon" value="${levelConfig.abilityIcon || "\u2728"}" style="width: 100%; margin-bottom: 15px;">
      <div style="margin-bottom: 5px;">${this.t("settings.levelPhaseLabel")}</div>
      <input type="text" id="level-phase" value="${displayLevel.phase || ""}" style="width: 100%; margin-bottom: 15px;">
      <div style="margin-bottom: 5px;">${this.t("settings.levelPhaseIcon")}</div>
      <input type="text" id="level-phase-icon" value="${levelConfig.phaseIcon || "\u{1F31F}"}" style="width: 100%; margin-bottom: 15px;">
      <div style="margin-bottom: 5px;">${this.t("settings.levelColor")}</div>
      <input type="text" id="level-color" value="${levelConfig.color || "#ffffff"}" style="width: 100%; margin-bottom: 15px;">
      <div style="margin-bottom: 5px;">${this.t("settings.levelMin")}</div>
      <input type="number" id="level-min" value="${levelConfig.minLevel}" style="width: 100%; margin-bottom: 15px;">
      <div style="margin-bottom: 5px;">${this.t("settings.levelMax")}</div>
      <input type="number" id="level-max" value="${levelConfig.maxLevel}" style="width: 100%; margin-bottom: 20px;">
      <div id="delete-section" style="margin-top: 20px; padding-top: 15px; border-top: 1px solid var(--background-modifier-border);"></div>
    `;
        let deleteConfirmCount = 0;
        let deleteConfirmTimer = null;
        const deleteSection = content.querySelector("#delete-section");
        const deleteButton = this.createActionButton(
          this.t("settings.deleteLevel"),
          () => {
            deleteConfirmCount += 1;
            if (deleteConfirmCount === 1) {
              deleteButton.textContent = this.t("settings.deleteClickAgain");
              deleteButton.style.background = "#ff4444";
              deleteConfirmTimer = setTimeout(() => {
                deleteConfirmCount = 0;
                deleteButton.textContent = this.t("settings.deleteLevel");
                deleteButton.style.background = "#ff6666";
              }, 3e3);
              return;
            }
            if (deleteConfirmCount === 2) {
              deleteButton.textContent = this.t("settings.deleteClickFinal");
              deleteButton.style.background = "#cc0000";
              deleteConfirmTimer = setTimeout(() => {
                deleteConfirmCount = 0;
                deleteButton.textContent = this.t("settings.deleteLevel");
                deleteButton.style.background = "#ff6666";
              }, 3e3);
              return;
            }
            if (deleteConfirmTimer)
              clearTimeout(deleteConfirmTimer);
            this.plugin.dataStore.deleteLevelConfig(index).then((result) => {
              new Notice(result.message);
              if (result.success) {
                modal.close();
                this.showEditLevelsModal();
              }
            });
          },
          "",
          "width: 100%; background: #ff6666; color: white; border: none; padding: 10px; border-radius: 5px; cursor: pointer;"
        );
        deleteSection.appendChild(deleteButton);
        const buttonRow = this.createButtonRow();
        buttonRow.appendChild(this.createActionButton(this.t("common.save"), async () => {
          const result = await this.plugin.dataStore.updateLevelConfig(index, {
            title: content.querySelector("#level-title").value.trim(),
            ability: content.querySelector("#level-ability").value.trim(),
            abilityIcon: content.querySelector("#level-ability-icon").value.trim() || "\u2728",
            phase: content.querySelector("#level-phase").value.trim(),
            phaseIcon: content.querySelector("#level-phase-icon").value.trim() || "\u{1F31F}",
            color: content.querySelector("#level-color").value.trim() || "#ffffff",
            minLevel: parseInt(content.querySelector("#level-min").value, 10) || 0,
            maxLevel: parseInt(content.querySelector("#level-max").value, 10) || 999
          });
          new Notice(result.message);
          if (result.success) {
            modal.close();
          }
        }, "mod-cta", "flex: 1;"));
        buttonRow.appendChild(this.createActionButton(this.t("common.cancel"), () => modal.close(), "", "flex: 1;"));
        content.appendChild(buttonRow);
        modal.open();
      }
      showAddLevelModal() {
        const modal = new Modal(this.app);
        modal.titleEl.setText(this.t("settings.addLevelTitle"));
        const content = this.createModalContent(modal, "unset");
        content.innerHTML = `
      <div style="margin-bottom: 5px;">${this.t("settings.levelTitle")}</div>
      <input type="text" id="level-title" placeholder="${this.t("settings.levelTitlePlaceholder")}" style="width: 100%; margin-bottom: 15px;">
      <div style="margin-bottom: 5px;">${this.t("settings.levelAbilityLabel")}</div>
      <input type="text" id="level-ability" placeholder="${this.t("settings.levelAbilityPlaceholder")}" style="width: 100%; margin-bottom: 15px;">
      <div style="margin-bottom: 5px;">${this.t("settings.levelAbilityIcon")}</div>
      <input type="text" id="level-ability-icon" placeholder="\u2728" style="width: 100%; margin-bottom: 15px;">
      <div style="margin-bottom: 5px;">${this.t("settings.levelPhaseLabel")}</div>
      <input type="text" id="level-phase" placeholder="${this.t("settings.levelPhasePlaceholder")}" style="width: 100%; margin-bottom: 15px;">
      <div style="margin-bottom: 5px;">${this.t("settings.levelPhaseIcon")}</div>
      <input type="text" id="level-phase-icon" placeholder="\u{1F31F}" style="width: 100%; margin-bottom: 15px;">
      <div style="margin-bottom: 5px;">${this.t("settings.levelColor")}</div>
      <input type="text" id="level-color" placeholder="#ffffff" style="width: 100%; margin-bottom: 15px;">
      <div style="margin-bottom: 5px;">${this.t("settings.levelMin")}</div>
      <input type="number" id="level-min" placeholder="0" style="width: 100%; margin-bottom: 15px;">
      <div style="margin-bottom: 5px;">${this.t("settings.levelMax")}</div>
      <input type="number" id="level-max" placeholder="999" style="width: 100%; margin-bottom: 20px;">
    `;
        const buttonRow = this.createButtonRow();
        buttonRow.appendChild(this.createActionButton(this.t("common.add"), async () => {
          const title = content.querySelector("#level-title").value.trim();
          if (!title) {
            new Notice(this.t("settings.enterLevelTitle"));
            return;
          }
          const result = await this.plugin.dataStore.addLevelConfig({
            minLevel: parseInt(content.querySelector("#level-min").value, 10) || 0,
            maxLevel: parseInt(content.querySelector("#level-max").value, 10) || 999,
            title,
            ability: content.querySelector("#level-ability").value.trim(),
            abilityIcon: content.querySelector("#level-ability-icon").value.trim() || "\u2728",
            phase: content.querySelector("#level-phase").value.trim(),
            phaseIcon: content.querySelector("#level-phase-icon").value.trim() || "\u{1F31F}",
            color: content.querySelector("#level-color").value.trim() || "#ffffff"
          });
          new Notice(result.message);
          if (result.success) {
            modal.close();
          }
        }, "mod-cta", "flex: 1;"));
        buttonRow.appendChild(this.createActionButton(this.t("common.cancel"), () => modal.close(), "", "flex: 1;"));
        content.appendChild(buttonRow);
        modal.open();
      }
      showManageCurrenciesModal() {
        const currencies = this.plugin.dataStore.getCurrencies();
        const stats = this.plugin.dataStore.getStats();
        const modal = new Modal(this.app);
        modal.titleEl.setText(this.t("settings.manageCurrenciesTitle"));
        const content = this.createModalContent(modal, "unset");
        const currencyList = document.createElement("div");
        currencyList.style.cssText = "max-height: 400px; overflow-y: auto;";
        currencies.forEach((currency) => {
          const currencyDiv = document.createElement("div");
          currencyDiv.style.cssText = `padding: 15px; margin-bottom: 10px; border: 1px solid var(--background-modifier-border); border-radius: 8px; border-left: 4px solid ${currency.color || "#ffffff"};`;
          if (currency.editable) {
            currencyDiv.style.cursor = "pointer";
            currencyDiv.onclick = () => this.showEditCurrencyModal(currency);
          }
          currencyDiv.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div>
            <span style="font-size: 20px; margin-right: 10px;">${currency.icon}</span>
            <strong>${currency.name}</strong>
            ${currency.editable ? `<span style="color: #888; font-size: 10px; margin-left: 5px;">${this.t("settings.currencyEditable")}</span>` : ""}
          </div>
          <div style="text-align: right;">
            <div style="font-weight: bold;">${stats[currency.id] || 0}</div>
            <div style="color: #888; font-size: 10px;">${this.t("settings.currencyGainRule", {
            rate: currency.earnRate,
            amount: currency.earnAmount || 1
          })}</div>
          </div>
        </div>
        <div style="color: #666; font-size: 12px; margin-top: 5px;">${currency.description || ""}</div>
      `;
          currencyList.appendChild(currencyDiv);
        });
        content.appendChild(currencyList);
        content.appendChild(this.createActionButton(this.t("common.add"), () => this.showAddCurrencyModal(), "", "width: 100%; margin-top: 10px;"));
        content.appendChild(this.createActionButton(this.t("common.close"), () => modal.close(), "", "width: 100%; margin-top: 10px;"));
        modal.open();
      }
      showEditCurrencyModal(currency) {
        const modal = new Modal(this.app);
        modal.titleEl.setText(this.t("settings.editCurrencyTitle", { name: currency.name }));
        const content = this.createModalContent(modal, "unset");
        content.innerHTML = `
      <div style="margin-bottom: 5px;">${this.t("common.name")}</div>
      <input type="text" id="currency-name" value="${currency.name}" style="width: 100%; margin-bottom: 15px;">
      <div style="margin-bottom: 5px;">${this.t("common.icon")}</div>
      <input type="text" id="currency-icon" value="${currency.icon}" style="width: 100%; margin-bottom: 15px;">
      <div style="margin-bottom: 5px;">${this.t("settings.currencyDescription")}</div>
      <input type="text" id="currency-desc" value="${currency.description || ""}" style="width: 100%; margin-bottom: 15px;">
      <div style="margin-bottom: 5px;">${this.t("settings.currencyRate")}</div>
      <input type="number" id="currency-rate" value="${currency.earnRate}" style="width: 100%; margin-bottom: 15px;">
      <div style="margin-bottom: 5px;">${this.t("settings.currencyColor")}</div>
      <input type="text" id="currency-color" value="${currency.color || "#ffffff"}" style="width: 100%; margin-bottom: 20px;">
    `;
        const buttonRow = this.createButtonRow();
        buttonRow.appendChild(this.createActionButton(this.t("common.save"), async () => {
          const result = await this.plugin.dataStore.updateCurrency(currency.id, {
            name: content.querySelector("#currency-name").value.trim(),
            icon: content.querySelector("#currency-icon").value.trim(),
            description: content.querySelector("#currency-desc").value.trim(),
            earnRate: parseInt(content.querySelector("#currency-rate").value, 10) || 1e3,
            color: content.querySelector("#currency-color").value.trim()
          });
          new Notice(result.message);
          if (result.success) {
            modal.close();
          }
        }, "mod-cta", "flex: 1;"));
        buttonRow.appendChild(this.createActionButton(this.t("common.delete"), async () => {
          const result = await this.plugin.dataStore.deleteCurrency(currency.id);
          new Notice(result.message);
          if (result.success) {
            modal.close();
          }
        }, "", "background-color: #ff6666; color: white; flex: 1;"));
        buttonRow.appendChild(this.createActionButton(this.t("common.cancel"), () => modal.close(), "", "flex: 1;"));
        content.appendChild(buttonRow);
        modal.open();
      }
      showAddCurrencyModal() {
        const modal = new Modal(this.app);
        modal.titleEl.setText(this.t("settings.addCurrencyTitle"));
        const content = this.createModalContent(modal, "unset");
        content.innerHTML = `
      <div style="margin-bottom: 5px;">${this.t("common.name")}</div>
      <input type="text" id="currency-name" placeholder="${this.t("settings.currencyNamePlaceholder")}" style="width: 100%; margin-bottom: 15px;">
      <div style="margin-bottom: 5px;">${this.t("common.icon")}</div>
      <input type="text" id="currency-icon" placeholder="${this.t("settings.currencyIconPlaceholder")}" style="width: 100%; margin-bottom: 15px;">
      <div style="margin-bottom: 5px;">${this.t("settings.currencyDescription")}</div>
      <input type="text" id="currency-desc" placeholder="${this.t("settings.currencyDescPlaceholder")}" style="width: 100%; margin-bottom: 15px;">
      <div style="margin-bottom: 5px;">${this.t("settings.currencyRate")}</div>
      <input type="number" id="currency-rate" placeholder="${this.t("settings.currencyRatePlaceholder")}" style="width: 100%; margin-bottom: 15px;">
      <div style="margin-bottom: 5px;">${this.t("settings.currencyColor")}</div>
      <input type="text" id="currency-color" placeholder="${this.t("settings.currencyColorPlaceholder")}" style="width: 100%; margin-bottom: 20px;">
      <div style="color: #666; font-size: 12px; margin-bottom: 15px;">${this.t("settings.currencyHint")}</div>
    `;
        const buttonRow = this.createButtonRow();
        buttonRow.appendChild(this.createActionButton(this.t("common.add"), async () => {
          const name = content.querySelector("#currency-name").value.trim();
          if (!name) {
            new Notice(this.t("settings.enterCurrencyName"));
            return;
          }
          const result = await this.plugin.dataStore.addCurrency(
            name,
            content.querySelector("#currency-icon").value.trim() || "\u{1FA99}",
            content.querySelector("#currency-desc").value.trim(),
            parseInt(content.querySelector("#currency-rate").value, 10) || 1e3,
            content.querySelector("#currency-color").value.trim() || "#00ff00"
          );
          new Notice(result.message);
          if (result.success) {
            modal.close();
          }
        }, "mod-cta", "flex: 1;"));
        buttonRow.appendChild(this.createActionButton(this.t("common.cancel"), () => modal.close(), "", "flex: 1;"));
        content.appendChild(buttonRow);
        modal.open();
      }
      exportShopConfig() {
        const items = this.plugin.dataStore.getShopItems();
        if (!items.length) {
          new Notice(this.t("settings.noShopToExport"));
          return;
        }
        const exportData = JSON.stringify({
          exportVersion: "1.0",
          exportedAt: (/* @__PURE__ */ new Date()).toISOString(),
          items
        }, null, 2);
        const filename = `shop-config-${(/* @__PURE__ */ new Date()).toISOString().split("T")[0]}.json`;
        this.downloadJson(filename, exportData);
        new Notice(this.t("settings.shopExported"));
      }
      importShopConfig() {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = ".json";
        input.onchange = async (event) => {
          var _a;
          const file = (_a = event.target.files) == null ? void 0 : _a[0];
          if (!file)
            return;
          const reader = new FileReader();
          reader.onload = async (loadEvent) => {
            try {
              const data = JSON.parse(loadEvent.target.result);
              const items = data.items || data.customItems;
              if (!items || !Array.isArray(items)) {
                new Notice(this.t("settings.invalidShopConfig"));
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
              new Notice(this.t("settings.shopImportSuccess", { count: importCount }));
            } catch (error) {
              new Notice(this.t("settings.importFailed", { message: error.message }));
            }
          };
          reader.readAsText(file);
        };
        input.click();
      }
      showCreateTemplateConfirm(templatePath) {
        const modal = new Modal(this.app);
        modal.titleEl.setText(this.t("template.createTitle"));
        const content = this.createModalContent(modal, "unset");
        content.innerHTML = `
      <div style="margin-bottom: 16px; line-height: 1.6;">
        ${this.t("template.createMissing")}
        <div style="margin-top: 8px; padding: 10px; background: var(--background-secondary); border-radius: 6px; word-break: break-all;">
          ${templatePath}
        </div>
      </div>
      <div style="color: var(--text-muted); margin-bottom: 16px;">
        ${this.t("template.createPrompt")}
      </div>
    `;
        const buttonRow = this.createButtonRow();
        buttonRow.appendChild(this.createActionButton(this.t("template.createNow"), async () => {
          modal.close();
          await this.updateDailyTemplate(templatePath);
        }, "mod-cta", "flex: 1;"));
        buttonRow.appendChild(this.createActionButton(this.t("template.createLater"), () => {
          modal.close();
          new Notice(this.t("template.savedPath", { path: templatePath }));
        }, "", "flex: 1;"));
        content.appendChild(buttonRow);
        modal.open();
      }
      async updateDailyTemplate(templatePathOverride) {
        var _a;
        const config = this.ensureConfig();
        await this.plugin.dataStore.saveConfig();
        const dailyTasks = config.dailyTasks || {
          mainTasks: { count: 3, pointsPerTask: 100 },
          habits: { items: this.plugin.dataStore.getDefaultDailyTasksDefinition().habits.items },
          extraTasks: { count: 2, pointsPerTask: 50 },
          pomodoro: { count: 6, pointsPerPomodoro: 50 }
        };
        const mainTasks = dailyTasks.mainTasks || { count: 3, pointsPerTask: 100 };
        const habits = ((_a = dailyTasks.habits) == null ? void 0 : _a.items) || [];
        const extraTasks = dailyTasks.extraTasks || { count: 2, pointsPerTask: 50 };
        const pomodoro = dailyTasks.pomodoro || { count: 6, pointsPerPomodoro: 50 };
        let mainTasksSection = "";
        for (let index = 1; index <= mainTasks.count; index += 1) {
          mainTasksSection += `- [ ] ${this.t("template.taskLabel")} ${index} - ${mainTasks.pointsPerTask}
`;
        }
        let habitsSection = "";
        for (const habit of habits) {
          const habitName = this.getLocalizedText(habit.name, "");
          habitsSection += `- [ ] ${habitName} - ${habit.points || 10}
`;
        }
        let extraTasksSection = "";
        for (let index = 1; index <= (extraTasks.count || 2); index += 1) {
          extraTasksSection += `- [ ] ${this.t("template.extraTaskLabel")} ${index} - ${extraTasks.pointsPerTask || 50}
`;
        }
        let pomodoroSection = "";
        for (let index = 0; index < pomodoro.count; index += 1) {
          pomodoroSection += `- [ ] ${this.t("template.completePomodoro")}
`;
        }
        const templateContent = `---
date: {{date}}
${this.t("template.weather")}:
${this.t("template.mood")}:
---

> **${this.t("template.frontmatterNote")}** | ${this.t("template.frontmatterHint")}

---

## \u{1F4DD} ${this.t("template.mainTasks")} (${this.t("template.maxOnly", { value: mainTasks.count * mainTasks.pointsPerTask })})
${mainTasksSection}
---

## \u2705 ${this.t("template.habits")} (${this.t("template.maxOnly", { value: habits.reduce((sum, habit) => sum + (habit.points || 10), 0) })})
${habitsSection}
---

## \u{1F4CC} ${this.t("template.extraTasks")} (${this.t("template.maxOnly", { value: (extraTasks.count || 2) * (extraTasks.pointsPerTask || 50) })})
${extraTasksSection}
---

## \u{1F345} ${this.t("template.pomodoro")} (${this.t("template.eachMax", { each: pomodoro.pointsPerPomodoro || 50, max: (pomodoro.count || 6) * (pomodoro.pointsPerPomodoro || 50) })})
${pomodoroSection}
---

> ${this.t("template.checkinCommandHint")}

---

### \u{1F4D2} ${this.t("template.checkinRecord")}

<!-- supreme-player:start -->
<!-- supreme-player:end -->

- {{date}} -
`;
        let templatePath = templatePathOverride || config.templatePath || this.plugin.dataStore.autoDetectTemplatePath();
        if (!templatePath.endsWith(".md")) {
          templatePath += ".md";
        }
        try {
          await this.app.vault.adapter.write(templatePath, templateContent);
          new Notice(this.t("template.updated"));
        } catch (error) {
          console.error("[Template] Error:", error);
          new Notice(this.t("template.updateFailed", { message: error.message }));
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
var Core = require_core();
var UI = require_ui();
var Wish = require_wish();
var Shop = require_shop();
var Inventory = require_inventory();
var SupremePlayerSettingTab = require_settings();
var { createI18n } = require_i18n();
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
      lastLockAttempt: null
    };
  }
  async onload() {
    this.dataStore = new DataStore(this.app);
    this.i18n = createI18n(this.app, () => {
      var _a, _b;
      return ((_b = (_a = this.dataStore) == null ? void 0 : _a.config) == null ? void 0 : _b.language) || "auto";
    });
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
      callback: () => UI.showCheckInPanel(this).catch((error) => console.error("Check-in error:", error))
    });
    this.addCommand({
      id: "show-stats",
      name: this.t("command.showStats"),
      callback: () => UI.showStats(this)
    });
    this.addCommand({
      id: "reset-daily",
      name: this.t("command.syncAccountInfo"),
      callback: () => Core.syncAccountInfo(this)
    });
    this.addCommand({
      id: "make-wish",
      name: this.t("command.makeWish"),
      callback: () => Wish.showWishModal(this)
    });
    this.addCommand({
      id: "show-wish-pool",
      name: this.t("command.showWishPool"),
      callback: () => Wish.showWishPool(this)
    });
    this.addCommand({
      id: "open-shop",
      name: this.t("command.openShop"),
      callback: () => Shop.showShop(this)
    });
    this.addCommand({
      id: "open-inventory",
      name: this.t("command.openInventory"),
      callback: () => Inventory.showInventory(this)
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
