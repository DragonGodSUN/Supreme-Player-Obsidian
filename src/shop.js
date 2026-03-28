const { Modal, Notice } = require("obsidian");
const Core = require("./core");

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
  return item.rarity === "legendary"
    ? '<span style="color: #ffd700; margin-left: 5px;">🌠</span>'
    : '<span style="color: #9966ff; margin-left: 5px;">🎴</span>';
}

function getCurrencyLabel(plugin, item) {
  return item.rarity === "legendary"
    ? `🌠 ${translate(plugin, "rarity.legendary")}`
    : `🎴 ${translate(plugin, "rarity.rare")}`;
}

const Shop = {
  showShop(plugin) {
    const stats = plugin.dataStore.getStats();
    const items = plugin.dataStore.getShopItems();

    const modal = new Modal(plugin.app);
    modal.titleEl.setText(plugin.dataStore.shopConfig?.shopName || translate(plugin, "shop.title"));

    const content = document.createElement("div");
    content.style.padding = "20px";

    const infoDiv = document.createElement("div");
    infoDiv.style.cssText = "margin-bottom: 20px; padding: 10px; background-color: var(--background-secondary); border-radius: 5px;";
    infoDiv.textContent = translate(plugin, "shop.info", {
      rare: stats.rareItemCards,
      legendary: stats.legendaryItemCards,
    });
    content.appendChild(infoDiv);

    const itemList = document.createElement("div");
    itemList.style.cssText = "max-height: 300px; overflow-y: auto;";

    for (const item of items) {
      const canAfford =
        (item.rarity === "rare" && stats.rareItemCards >= item.price) ||
        (item.rarity === "legendary" && stats.legendaryItemCards >= item.price);

      const itemDiv = document.createElement("div");
      itemDiv.style.cssText = `padding: 12px; margin-bottom: 10px; border: 1px solid var(--border-color); border-radius: 5px; opacity: ${canAfford ? "1" : "0.6"};`;

      itemDiv.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div><span style="font-size: 20px; margin-right: 10px;">${item.icon}</span><strong>${item.name}</strong>${getCategoryTag(plugin, item.category)}${getRarityBadge(item)}</div>
          <div>${item.rarity === "legendary" ? "🌠" : "🎴"} ×${item.price}</div>
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
          price: item.price,
        })}
      </div>
    `;

    const buttonContainer = document.createElement("div");
    buttonContainer.style.display = "flex";
    buttonContainer.style.gap = "10px";
    buttonContainer.style.marginTop = "20px";

    const confirmBtn = document.createElement("button");
    confirmBtn.textContent = `🛒 ${translate(plugin, "shop.confirmPurchase")}`;
    confirmBtn.className = "mod-cta";
    confirmBtn.style.flex = "1";
    confirmBtn.onclick = async () => {
      const result = await plugin.dataStore.purchaseItem(item.id);
      new Notice(result.message);
      if (result.success) {
        Core.updateStatusBar(plugin);
        modal.close();
        shopModal.close();
        this.showShop(plugin);
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

module.exports = Shop;
