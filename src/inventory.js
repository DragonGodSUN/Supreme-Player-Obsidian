const { Modal, Notice } = require("obsidian");
const Core = require("./core");

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
  return item.rarity === "legendary"
    ? '<span style="color: #ffd700; margin-left: 5px;">🌠</span>'
    : '<span style="color: #9966ff; margin-left: 5px;">🎴</span>';
}

const Inventory = {
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
    backBtn.textContent = `↩ ${translate(plugin, "common.backToPanel")}`;
    backBtn.style.flex = "1";
    backBtn.onclick = () => {
      modal.close();
      plugin.showStats();
    };

    const closeBtn = document.createElement("button");
    closeBtn.textContent = `✖ ${translate(plugin, "common.close")}`;
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

    const externalHint = item.category === "external"
      ? `<div style="background: #ffaa0020; padding: 10px; border-radius: 5px; margin-bottom: 15px; color: #ffaa00; font-size: 14px;">${translate(plugin, "inventory.externalHint")}</div>`
      : "";

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
    confirmBtn.textContent = item.category === "system"
      ? `⚙ ${translate(plugin, "inventory.use")}`
      : `🎁 ${translate(plugin, "inventory.useExternal")}`;
    confirmBtn.className = "mod-cta";
    confirmBtn.style.flex = "1";
    confirmBtn.onclick = async () => {
      const result = await plugin.dataStore.useItem(item.instanceId);
      new Notice(result.message);
      if (result.success) {
        Core.updateStatusBar(plugin);
        modal.close();
        if (inventoryModal) {
          inventoryModal.close();
        }
        this.showInventory(plugin);
      }
    };

    const cancelBtn = document.createElement("button");
    cancelBtn.textContent = `✖ ${translate(plugin, "common.cancel")}`;
    cancelBtn.style.flex = "1";
    cancelBtn.onclick = () => modal.close();

    buttonContainer.appendChild(confirmBtn);
    buttonContainer.appendChild(cancelBtn);
    content.appendChild(buttonContainer);

    modal.contentEl.appendChild(content);
    modal.open();
  },
};

module.exports = Inventory;
