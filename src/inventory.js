const { Modal, Notice } = require("obsidian");
const Core = require('./core');

const Inventory = {
  showInventory(plugin) {
    const stats = plugin.dataStore.getStats();
    const inventory = stats.inventory || [];

    const modal = new Modal(plugin.app);
    modal.titleEl.setText('🎒 背包');

    const content = document.createElement('div');
    content.style.padding = '20px';

    if (inventory.length === 0) {
      content.innerHTML = '<div style="text-align: center; color: #888; padding: 40px;">背包空空如也～<br>去商城购买些商品吧！</div>';
    } else {
      const itemCounts = {};
      for (const item of inventory) {
        const key = item.name + '|' + item.icon;
        if (!itemCounts[key]) {
          itemCounts[key] = { ...item, count: 0, instanceIds: [] };
        }
        itemCounts[key].count++;
        if (item.instanceId) {
          itemCounts[key].instanceIds.push(item.instanceId);
        }
      }

      const itemList = document.createElement('div');
      itemList.style.cssText = 'max-height: 400px; overflow-y: auto;';

      for (const key in itemCounts) {
        const item = itemCounts[key];
        const itemDiv = document.createElement('div');
        itemDiv.style.cssText = 'padding: 12px; margin-bottom: 10px; border: 1px solid var(--border-color); border-radius: 5px; cursor: pointer;';

        const categoryTag = item.category === 'system' ?
          '<span style="background: #00aaff20; color: #00aaff; padding: 2px 6px; border-radius: 3px; font-size: 10px;">系统</span>' :
          '<span style="background: #ffaa0020; color: #ffaa00; padding: 2px 6px; border-radius: 3px; font-size: 10px;">外部</span>';

        const rarityTag = item.rarity === 'legendary' ?
          '<span style="color: #ffd700; margin-left: 5px;">🌠</span>' :
          '<span style="color: #9966ff; margin-left: 5px;">🎴</span>';

        itemDiv.innerHTML = `
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <div><span style="font-size: 24px; margin-right: 10px;">${item.icon}</span><strong>${item.name}</strong>${categoryTag}${rarityTag}</div>
            <div style="display: flex; align-items: center; gap: 10px;">
              <span style="background: var(--background-secondary); padding: 4px 10px; border-radius: 12px; font-size: 12px; font-weight: bold;">x${item.count}</span>
              <span style="color: #888; font-size: 12px;">点击使用</span>
            </div>
          </div>
          <div style="color: #666; font-size: 12px; margin-top: 5px;">${item.description}</div>
        `;

        itemDiv.onclick = () => {
          if (item.instanceIds.length > 0) {
            this.showUseConfirm(plugin, { ...item, instanceId: item.instanceIds[0] }, modal);
          }
        };
        itemDiv.onmouseenter = () => { itemDiv.style.background = 'var(--background-secondary)'; };
        itemDiv.onmouseleave = () => { itemDiv.style.background = 'transparent'; };

        itemList.appendChild(itemDiv);
      }
      content.appendChild(itemList);
    }

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

  showUseConfirm(plugin, item, inventoryModal) {
    const modal = new Modal(plugin.app);
    modal.titleEl.setText('🎯 使用物品');

    const content = document.createElement('div');
    content.style.padding = '20px';
    content.style.textAlign = 'center';

    content.innerHTML = `
      <div style="font-size: 48px; margin-bottom: 15px;">${item.icon}</div>
      <div style="font-size: 18px; font-weight: bold; margin-bottom: 10px;">${item.name}</div>
      <div style="color: #888; margin-bottom: 15px;">${item.description}</div>
      ${item.category === 'external' ? '<div style="background: #ffaa0020; padding: 10px; border-radius: 5px; margin-bottom: 15px; color: #ffaa00; font-size: 14px;">⚠️ 这是外部商品<br>使用后请记得自行兑现承诺哦！</div>' : ''}
    `;

    const buttonContainer = document.createElement('div');
    buttonContainer.style.display = 'flex';
    buttonContainer.style.gap = '10px';
    buttonContainer.style.marginTop = '20px';

    const confirmBtn = document.createElement('button');
    confirmBtn.textContent = item.category === 'system' ? '✅ 使用' : '⚠️ 使用并承诺';
    confirmBtn.className = 'mod-cta';
    confirmBtn.style.flex = '1';
    confirmBtn.onclick = async () => {
      const result = await plugin.dataStore.useItem(item.instanceId);
      new Notice(result.message);
      if (result.success) {
        Core.updateStatusBar(plugin);
        modal.close();
        if (inventoryModal) inventoryModal.close();
        this.showInventory(plugin);
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
  }
};

module.exports = Inventory;
