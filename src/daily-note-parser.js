class DailyNoteParser {
  constructor(dataStore) {
    this.dataStore = dataStore;
  }

  parseDailyNote(content, date) {
    const record = { date, mainTasks: [], habits: [], extraTasks: [], pomodoros: [], totalPoints: 0 };

    const mainTaskRegex = /(?:^|\n)##\s*(?:Main Tasks|主任务)(?:\s*\([^)]+\))?\s*\n([\s\S]*?)(?=\n##\s*(?:Habits|习惯|Extra Tasks|额外任务|Pomodoro|番茄钟)\b|\n---|\n###|$)/i;
    const habitRegex = /(?:^|\n)##\s*(?:Habits|习惯)(?:\s*\([^)]+\))?\s*\n([\s\S]*?)(?=\n##\s*(?:Extra Tasks|额外任务|Pomodoro|番茄钟)\b|\n---|\n###|$)/i;
    const extraTaskRegex = /(?:^|\n)##\s*(?:Extra Tasks|额外任务)(?:\s*\([^)]+\))?\s*\n([\s\S]*?)(?=\n##\s*(?:Pomodoro|番茄钟)\b|\n---|\n###|$)/i;
    const pomodoroRegex = /(?:^|\n)##\s*(?:Pomodoro|番茄钟)(?:\s*\([^)]+\))?\s*\n([\s\S]*?)(?=\n---|\n###|$)/i;

    const mainMatch = mainTaskRegex.exec(content);
    if (mainMatch) record.mainTasks = this.parseTaskLines(mainMatch[1]);

    const habitMatch = habitRegex.exec(content);
    if (habitMatch) record.habits = this.parseTaskLines(habitMatch[1]);

    const extraMatch = extraTaskRegex.exec(content);
    if (extraMatch) record.extraTasks = this.parseTaskLines(extraMatch[1]);

    const pomodoroMatch = pomodoroRegex.exec(content);
    if (pomodoroMatch) record.pomodoros = this.parsePomodoros(pomodoroMatch[1]);

    return record;
  }

  parseTaskLines(text) {
    const tasks = [];
    const lines = text.split("\n").filter(line => line.trim());

    for (const line of lines) {
      const match = line.match(/^\s*[-*]?\s*\[([ x])\]\s*(.+?)\s*-\s*(\d+)\s*$/i);
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
