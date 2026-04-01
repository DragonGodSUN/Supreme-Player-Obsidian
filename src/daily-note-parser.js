class DailyNoteParser {
  constructor(dataStore) {
    this.dataStore = dataStore;
  }

  getSectionKeywords(key) {
    const zh = this.dataStore.getTranslation('zh', key);
    const en = this.dataStore.getTranslation('en', key);
    const current = this.dataStore.t(key);
    const keywords = new Set();
    if (zh) keywords.add(zh);
    if (en) keywords.add(en);
    if (current) keywords.add(current);
    return [...keywords];
  }

  buildSectionRegex(keywords) {
    const escaped = keywords.map(kw => kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
    const pattern = `^(?:${escaped.join('|')})$`;
    return new RegExp(pattern, 'i');
  }

  parseDailyNote(content, date) {
    const record = { date, mainTasks: [], habits: [], extraTasks: [], pomodoros: [], totalPoints: 0 };

    const sections = this.extractSections(content);

    const mainKeywords = this.getSectionKeywords('template.mainTasks');
    const mainRegex = this.buildSectionRegex(mainKeywords);
    const mainSection = this.findSection(sections, mainRegex);
    if (mainSection) record.mainTasks = this.parseTaskLines(mainSection.content);

    const habitKeywords = this.getSectionKeywords('template.habits');
    const habitRegex = this.buildSectionRegex(habitKeywords);
    const habitSection = this.findSection(sections, habitRegex);
    if (habitSection) record.habits = this.parseTaskLines(habitSection.content);

    const extraKeywords = this.getSectionKeywords('template.extraTasks');
    const extraRegex = this.buildSectionRegex(extraKeywords);
    const extraSection = this.findSection(sections, extraRegex);
    if (extraSection) record.extraTasks = this.parseTaskLines(extraSection.content);

    const pomodoroKeywords = this.getSectionKeywords('template.pomodoro');
    const pomodoroRegex = this.buildSectionRegex(pomodoroKeywords);
    const pomodoroSection = this.findSection(sections, pomodoroRegex);
    if (pomodoroSection) record.pomodoros = this.parsePomodoros(pomodoroSection.content);

    return record;
  }

  extractSections(content) {
    const sections = [];
    const lines = content.split('\n');
    const headings = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (line.startsWith('## ')) {
        const title = line.substring(3)
          .replace(/^[^\w\s（）()]*/, '')
          .replace(/\s*\([^)]*\)\s*$/, '')
          .trim();
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

      const separatorIdx = sectionLines.findIndex(l => l.trim() === '---');
      const contentLines = separatorIdx !== -1
        ? sectionLines.slice(0, separatorIdx)
        : sectionLines;

      sections.push({
        title: current.title,
        content: contentLines.join('\n').trim()
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
    const lines = text.split("\n").filter(line => line.trim());

    for (const line of lines) {
      const match = line.match(/^\s*[-*]?\s*\[([ x])\]\s*(.+?)\s*-\s*(\d+)/i);
      if (!match) {
        continue;
      }

      tasks.push({
        name: match[2].trim(),
        points: parseInt(match[3], 10),
        completed: match[1].toLowerCase() === "x",
      });
    }

    return tasks;
  }

  parsePomodoros(text) {
    const pomodoros = [];
    const lines = text.split("\n").filter(line => line.trim());

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
      if (task.completed) points += task.points;
    }

    for (const habit of record.habits) {
      if (habit.completed) points += habit.points;
    }

    const extraConfig = dailyTasks.extraTasks || { count: 2, pointsPerTask: 50 };
    const completedExtraTasks = record.extraTasks.filter(task => task.completed);
    const extraCount = Math.min(completedExtraTasks.length, extraConfig.count || 2);
    for (let index = 0; index < extraCount; index += 1) {
      points += completedExtraTasks[index].points;
    }

    const pomodoroConfig = dailyTasks.pomodoro || { count: 6, pointsPerPomodoro: 50 };
    const completedPomodoros = record.pomodoros.filter(pomodoro => pomodoro.completed).length;
    const pomodoroCount = Math.min(completedPomodoros, pomodoroConfig.count || 6);
    points += pomodoroCount * (pomodoroConfig.pointsPerPomodoro || 50);

    return points;
  }
}

module.exports = DailyNoteParser;
