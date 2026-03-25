class DailyNoteParser {
  constructor(dataStore) {
    this.dataStore = dataStore;
  }

  parseDailyNote(content, date) {
    const record = { date: date, mainTasks: [], habits: [], extraTasks: [], pomodoros: [], totalPoints: 0 };

    const mainTaskRegex = /★.*?三件事.*?\n([\s\S]*?)(?=●|📊|⏰|$)/gi;
    const mainMatch = mainTaskRegex.exec(content);
    if (mainMatch) record.mainTasks = this.parseMainTasks(mainMatch[1]);

    const habitRegex = /●.*?习惯.*?\n([\s\S]*?)(?=●|📊|⏰|$)/gi;
    const habitMatch = habitRegex.exec(content);
    if (habitMatch) record.habits = this.parseHabits(habitMatch[1]);

    const extraTaskRegex = /●.*?额外.*?\n([\s\S]*?)(?=●|特殊|📊|⏰|$)/gi;
    const extraMatch = extraTaskRegex.exec(content);
    if (extraMatch) record.extraTasks = this.parseExtraTasks(extraMatch[1]);

    const pomodoroRegex = /⏰.*?番茄钟.*?\n([\s\S]*?)(?=●|⛲|📊|$)/gi;
    const pomodoroMatch = pomodoroRegex.exec(content);
    if (pomodoroMatch) record.pomodoros = this.parsePomodoros(pomodoroMatch[1]);

    return record;
  }

  parseTaskLine(text) {
    const tasks = [];
    const lines = text.split('\n').filter(line => line.trim());
    for (const line of lines) {
      const match = line.match(/\[([ x])\]\s*(.+?)\s*-\s*(\d+)/);
      if (match) {
        tasks.push({
          name: match[2].trim(),
          points: parseInt(match[3], 10),
          completed: match[1].toLowerCase() === 'x'
        });
      }
    }
    return tasks;
  }

  parseMainTasks(text) {
    return this.parseTaskLine(text);
  }

  parseHabits(text) {
    return this.parseTaskLine(text);
  }

  parseExtraTasks(text) {
    return this.parseTaskLine(text);
  }

  parsePomodoros(text) {
    const pomodoros = [];
    const lines = text.split('\n').filter(line => line.trim());
    for (const line of lines) {
      const match = line.match(/\[([ x])\].*?⏱️/i);
      if (match) {
        pomodoros.push({ completed: match[1].toLowerCase() === 'x' });
      }
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
    const completedExtraTasks = record.extraTasks.filter(t => t.completed);
    const extraCount = Math.min(completedExtraTasks.length, extraConfig.count || 2);
    for (let i = 0; i < extraCount; i++) {
      points += completedExtraTasks[i].points;
    }

    const pomodoroConfig = dailyTasks.pomodoro || { count: 6, pointsPerPomodoro: 50 };
    const completedPomodoros = record.pomodoros.filter(p => p.completed).length;
    const pomodoroCount = Math.min(completedPomodoros, pomodoroConfig.count || 6);
    points += pomodoroCount * (pomodoroConfig.pointsPerPomodoro || 50);

    return points;
  }
}

module.exports = DailyNoteParser;
