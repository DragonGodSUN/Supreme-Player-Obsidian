const { Modal, Notice } = require("obsidian");
const Core = require('./core');

const Wish = {
  showWishModal(plugin) {
    const modal = new Modal(plugin.app);
    modal.titleEl.setText('🌟 许下愿望');

    const content = document.createElement('div');
    content.style.padding = '20px';

    content.innerHTML = `
      <div style="margin-bottom: 5px;">愿望名称：</div>
      <input type="text" id="wish-name" placeholder="例如：顺利通过考试" style="width: 100%; margin-bottom: 15px;">
      <div style="margin-bottom: 5px;">愿望描述（可选）：</div>
      <textarea id="wish-desc" placeholder="详细描述你的愿望..." style="width: 100%; height: 80px; margin-bottom: 15px;"></textarea>
      <div style="color: #666; font-size: 12px; margin-bottom: 15px; padding: 10px; background: var(--background-secondary); border-radius: 5px;">
        💡 创建愿望后，在许愿池中点击"投入"按钮消耗愿星来扰动世界线<br>每颗愿星增加10%进度，填满100%即可完成许愿
      </div>
    `;

    const buttonContainer = document.createElement('div');
    buttonContainer.style.display = 'flex';
    buttonContainer.style.gap = '10px';

    const confirmBtn = document.createElement('button');
    confirmBtn.textContent = '✨ 创建愿望';
    confirmBtn.className = 'mod-cta';
    confirmBtn.style.flex = '1';
    confirmBtn.onclick = async () => {
      const name = document.getElementById('wish-name').value.trim();
      if (!name) { new Notice('❌ 请输入愿望名称'); return; }
      const result = await plugin.dataStore.makeWish(name, document.getElementById('wish-desc').value.trim());
      if (result.success) {
        Core.updateStatusBar(plugin);
        modal.close();
        new Notice(result.message);
      }
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
  },

  showWishPool(plugin) {
    const stats = plugin.dataStore.getStats();
    const wishes = stats.wishes || [];
    const activeWishes = wishes.filter(w => w.status === 'active');
    const completedWishes = wishes.filter(w => w.status === 'completed');

    const modal = new Modal(plugin.app);
    modal.titleEl.setText('⛲ 许愿池');

    const content = document.createElement('div');
    content.style.padding = '20px';

    const starInfo = document.createElement('div');
    starInfo.style.cssText = 'margin-bottom: 20px; padding: 10px; background-color: var(--background-secondary); border-radius: 5px;';
    starInfo.innerHTML = '⭐ 当前愿星：' + stats.wishStars + ' &nbsp;&nbsp; ✨ 已完成愿望：' + completedWishes.length;
    content.appendChild(starInfo);

    if (activeWishes.length > 0) {
      const activeLabel = document.createElement('div');
      activeLabel.style.cssText = 'font-weight: bold; margin-bottom: 10px;';
      activeLabel.textContent = '📨 进行中的愿望';
      content.appendChild(activeLabel);

      for (const wish of activeWishes) {
        const wishDiv = document.createElement('div');
        wishDiv.style.cssText = 'padding: 15px; margin-bottom: 10px; border: 1px solid var(--border-color); border-radius: 8px;';
        wishDiv.id = 'wish-' + wish.id;

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
          const completeBtn = document.createElement('button');
          completeBtn.textContent = '🌟 完成许愿';
          completeBtn.className = 'mod-cta';
          completeBtn.style.width = '100%';
          completeBtn.onclick = async () => {
            const result = await plugin.dataStore.completeWish(wish.id);
            if (result.success) {
              Core.updateStatusBar(plugin);
              modal.close();
              this.showWishCompletedModal(plugin, result);
            }
          };
          wishDiv.appendChild(completeBtn);
        } else {
          const investBtn = document.createElement('button');
          investBtn.textContent = '✨ 投入 (消耗1愿星)';
          investBtn.className = 'mod-cta';
          investBtn.style.width = '100%';
          investBtn.disabled = stats.wishStars < 1;
          if (stats.wishStars < 1) investBtn.style.opacity = '0.5';
          investBtn.onclick = async () => {
            if (stats.wishStars < 1) { new Notice('❌ 愿星不足！'); return; }
            const result = await plugin.dataStore.boostWish(wish.id, 1);
            if (result.success) {
              Core.updateStatusBar(plugin);
              if (result.completed) {
                modal.close();
                this.showWishCompletedModal(plugin, result);
              } else {
                document.getElementById('progress-bar-' + wish.id).style.width = result.wish.progress + '%';
                document.getElementById('progress-text-' + wish.id).textContent = result.wish.progress + '%';
                if (result.wish.progress >= 100) {
                  investBtn.disabled = true;
                  investBtn.style.opacity = '0.5';
                  investBtn.textContent = '✅ 已完成';
                }
                const newStats = plugin.dataStore.getStats();
                starInfo.innerHTML = '⭐ 当前愿星：' + newStats.wishStars + ' &nbsp;&nbsp; ✨ 已完成愿望：' + completedWishes.length;
                new Notice('✨ 投入成功！进度 +10%');
              }
            }
          };
          wishDiv.appendChild(investBtn);
        }

        content.appendChild(wishDiv);
      }
    } else {
      const emptyDiv = document.createElement('div');
      emptyDiv.style.cssText = 'text-align: center; color: #888; padding: 20px;';
      emptyDiv.textContent = '📭 暂无进行中的愿望';
      content.appendChild(emptyDiv);
    }

    const newWishBtn = document.createElement('button');
    newWishBtn.textContent = '🌟 许下新愿望';
    newWishBtn.style.width = '100%';
    newWishBtn.style.marginTop = '10px';
    newWishBtn.onclick = () => { modal.close(); this.showWishModal(plugin); };
    content.appendChild(newWishBtn);

    const buttonContainer = document.createElement('div');
    buttonContainer.style.display = 'flex';
    buttonContainer.style.gap = '10px';
    buttonContainer.style.marginTop = '10px';

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

  showWishCompletedModal(plugin, result) {
    const modal = new Modal(plugin.app);
    modal.titleEl.setText('🌟 世界线扰动成功！');

    const content = document.createElement('div');
    content.style.padding = '20px';
    content.style.textAlign = 'center';

    content.innerHTML = `
      <div style="font-size: 64px; margin-bottom: 20px;">✨</div>
      <div style="font-size: 18px; font-weight: bold; margin-bottom: 15px;">愿望已记录于世界线之中</div>
      <div style="background: var(--background-secondary); padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <div style="color: #ffd700; font-size: 14px; margin-bottom: 10px;">🍀 好运气加成已生效（持续24小时）</div>
        ${result.bonusPoints ? '<div style="color: #00ff00; font-size: 14px;">⚡ 奖励积分 +' + result.bonusPoints + '</div>' : ''}
      </div>
      <div style="color: #888; font-size: 12px; margin-bottom: 15px;">
        ${result.blessings ? result.blessings.map(b => '✨ ' + b).join('<br>') : ''}
      </div>
    `;

    const closeBtn = document.createElement('button');
    closeBtn.textContent = '🙏 感谢星之祝福';
    closeBtn.className = 'mod-cta';
    closeBtn.style.width = '100%';
    closeBtn.onclick = () => modal.close();
    content.appendChild(closeBtn);

    modal.contentEl.appendChild(content);
    modal.open();
  }
};

module.exports = Wish;
