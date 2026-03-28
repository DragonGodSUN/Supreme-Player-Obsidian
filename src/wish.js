const { Modal, Notice } = require("obsidian");
const Core = require("./core");

function translate(plugin, key, variables) {
  return plugin.t ? plugin.t(key, variables) : key;
}

const Wish = {
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
    confirmBtn.textContent = `✨ ${translate(plugin, "wish.create")}`;
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
        Core.updateStatusBar(plugin);
        modal.close();
        new Notice(result.message);
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

  showWishPool(plugin) {
    const stats = plugin.dataStore.getStats();
    const wishes = stats.wishes || [];
    const activeWishes = wishes.filter(wish => wish.status === "active");
    const completedWishes = wishes.filter(wish => wish.status === "completed");

    const modal = new Modal(plugin.app);
    modal.titleEl.setText(translate(plugin, "wish.poolTitle"));

    const content = document.createElement("div");
    content.style.padding = "20px";

    const starInfo = document.createElement("div");
    starInfo.style.cssText = "margin-bottom: 20px; padding: 10px; background-color: var(--background-secondary); border-radius: 5px;";
    starInfo.textContent = translate(plugin, "wish.poolStats", {
      stars: stats.wishStars,
      completed: completedWishes.length,
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
          completeBtn.textContent = `🎉 ${translate(plugin, "wish.complete")}`;
          completeBtn.className = "mod-cta";
          completeBtn.style.width = "100%";
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
          const investBtn = document.createElement("button");
          investBtn.textContent = `⭐ ${translate(plugin, "wish.invest")}`;
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
              Core.updateStatusBar(plugin);
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
                  completed: completedWishes.length,
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
    newWishBtn.textContent = `✨ ${translate(plugin, "wish.newWish")}`;
    newWishBtn.style.width = "100%";
    newWishBtn.style.marginTop = "10px";
    newWishBtn.onclick = () => {
      modal.close();
      this.showWishModal(plugin);
    };
    content.appendChild(newWishBtn);

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

  showWishCompletedModal(plugin, result) {
    const modal = new Modal(plugin.app);
    modal.titleEl.setText(translate(plugin, "wish.completedTitle"));

    const content = document.createElement("div");
    content.style.padding = "20px";
    content.style.textAlign = "center";

    content.innerHTML = `
      <div style="font-size: 64px; margin-bottom: 20px;">✅</div>
      <div style="font-size: 18px; font-weight: bold; margin-bottom: 15px;">${translate(plugin, "wish.completedHeadline")}</div>
      <div style="background: var(--background-secondary); padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <div style="color: #ffd700; font-size: 14px; margin-bottom: 10px;">${translate(plugin, "wish.completedBuff")}</div>
        ${result.bonusPoints ? `<div style="color: #00ff00; font-size: 14px;">${translate(plugin, "wish.completedBonus", { points: result.bonusPoints })}</div>` : ""}
      </div>
      <div style="color: #888; font-size: 12px; margin-bottom: 15px;">
        ${result.blessings ? result.blessings.map(message => `✅ ${message}`).join("<br>") : ""}
      </div>
    `;

    const closeBtn = document.createElement("button");
    closeBtn.textContent = `💖 ${translate(plugin, "wish.completedThanks")}`;
    closeBtn.className = "mod-cta";
    closeBtn.style.width = "100%";
    closeBtn.onclick = () => modal.close();
    content.appendChild(closeBtn);

    modal.contentEl.appendChild(content);
    modal.open();
  },
};

module.exports = Wish;
