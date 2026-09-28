/**
 * FLS 威黃物流服務有限公司 - 官網核心邏輯 (Main JavaScript)
 * 嚴格遵循舊網站設計，僅更新倉庫地址，保留顯著發送電郵提示
 * Version: v0.4 (Build 20260928)
 */

console.log(
  "%c Project Version %c v0.4 [2026-09-28] ",
  "background:#ff6b00;color:#fff;padding:2px 6px;border-radius:3px 0 0 3px;",
  "background:#1d1d1f;color:#00f2fe;padding:2px 6px;border-radius:0 3px 3px 0;"
);

document.addEventListener("DOMContentLoaded", () => {
  const data = window.FLS_DATA || window.FLS_DEFAULT_DATA;

  // 1. 移動端漢堡選單切換
  const menuBtn = document.getElementById("mobile-menu-btn");
  const mainNav = document.getElementById("main-nav");

  if (menuBtn && mainNav) {
    menuBtn.addEventListener("click", () => {
      mainNav.classList.toggle("open");
      const icon = menuBtn.querySelector("i");
      if (icon) {
        icon.classList.toggle("fa-bars");
        icon.classList.toggle("fa-times");
      }
    });

    mainNav.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        mainNav.classList.remove("open");
        const icon = menuBtn.querySelector("i");
        if (icon) {
          icon.classList.add("fa-bars");
          icon.classList.remove("fa-times");
        }
      });
    });
  }

  // 2. 動態渲染 6 大物流方案 (每張卡片使用獨立真實照片)
  const servicesContainer = document.getElementById("services-grid-container");
  if (servicesContainer && data.services) {
    servicesContainer.innerHTML = data.services.map(s => {
      const isIcon = s.image.includes(".png") && (s.image.includes("car") || s.image.includes("index_icon"));
      return `
        <article class="service-card" id="service-${s.id}">
          <div class="service-thumb">
            <img src="${s.image}" alt="${s.title}" class="${isIcon ? 'contain-fit' : ''}" loading="lazy" />
          </div>
          <div class="service-body">
            <h3 class="service-title">${s.title}</h3>
            <p class="service-desc">${s.desc}</p>
          </div>
        </article>
      `;
    }).join("");
  }

  // 3. 動態渲染位置圖清單 (僅更新地址，保持舊網站簡約排位)
  const locationsContainer = document.getElementById("locations-grid-container");
  if (locationsContainer && data.locations) {
    locationsContainer.innerHTML = data.locations.map(loc => `
      <div class="location-item">
        <h4><i class="fas fa-map-marker-alt" style="color: var(--accent); margin-right: 6px;"></i>${loc.name}</h4>
        <p>${loc.address}</p>
      </div>
    `).join("");
  }

  // 4. 動態渲染合作客戶
  const clientsContainer = document.getElementById("clients-grid-container");
  if (clientsContainer && data.clients) {
    clientsContainer.innerHTML = data.clients.map(c => `
      <div class="client-chip">${c.name}</div>
    `).join("");
  }

  // 5. 提示對話框函數 (Modal Dialog)
  const modalOverlay = document.getElementById("feedback-modal");
  const modalIcon = document.getElementById("modal-icon");
  const modalTitle = document.getElementById("modal-title");
  const modalDesc = document.getElementById("modal-desc");
  const modalCloseBtn = document.getElementById("modal-close-btn");

  function showModal({ success, title, message }) {
    if (!modalOverlay) return;
    if (success) {
      modalIcon.className = "modal-icon-circle";
      modalIcon.innerHTML = '<i class="fas fa-check"></i>';
    } else {
      modalIcon.className = "modal-icon-circle error";
      modalIcon.innerHTML = '<i class="fas fa-exclamation-triangle"></i>';
    }
    modalTitle.textContent = title;
    modalDesc.innerHTML = message;
    modalOverlay.style.display = "flex";
  }

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener("click", () => {
      modalOverlay.style.display = "none";
    });
  }

  if (modalOverlay) {
    modalOverlay.addEventListener("click", (e) => {
      if (e.target === modalOverlay) {
        modalOverlay.style.display = "none";
      }
    });
  }

  // 6. Formspree 電郵表單 AJAX 提交
  const contactForm = document.getElementById("fls-quote-form");
  const formAlert = document.getElementById("form-alert");
  const submitBtn = document.getElementById("submit-btn");

  if (contactForm) {
    contactForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const endpoint = (data.siteInfo && data.siteInfo.formspreeEndpoint)
        ? data.siteInfo.formspreeEndpoint
        : "https://formspree.io/f/mljezogk";

      const formData = new FormData(contactForm);
      const jsonBody = {};
      formData.forEach((value, key) => { jsonBody[key] = value; });

      const senderName = jsonBody["name"] || "貴客戶";
      const senderEmail = jsonBody["email"] || "";

      // 按鈕載入狀態
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 正在傳送查詢中...';
      }
      if (formAlert) {
        formAlert.style.display = "none";
        formAlert.className = "form-alert";
      }

      try {
        const response = await fetch(endpoint, {
          method: "POST",
          headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
          },
          body: JSON.stringify(jsonBody)
        });

        if (response.ok) {
          // 1. 彈出顯眼居中提示對話框
          showModal({
            success: true,
            title: "查詢傳送成功！",
            message: `感謝 <strong>${senderName}</strong> 的查詢！<br />我們已成功透過電郵收到您的需求（確認電郵將發至 <strong>${senderEmail}</strong>）。<br />威黃物流專屬主任將於 24 小時內與您聯絡！`
          });

          // 2. 表單上方顯示綠色提示列
          if (formAlert) {
            formAlert.className = "form-alert success";
            formAlert.innerHTML = '<i class="fas fa-check-circle" style="margin-right:6px;"></i><strong>傳送成功！</strong> 我們已收到您的訊息，專屬物流主任將於 24 小時內與您聯絡。';
            formAlert.style.display = "block";
            formAlert.scrollIntoView({ behavior: "smooth", block: "center" });
          }

          // 3. 按鈕切換為成功狀態
          if (submitBtn) {
            submitBtn.style.backgroundColor = "#16a34a";
            submitBtn.innerHTML = '<i class="fas fa-check-circle" style="margin-right:6px;"></i> 已成功提交！感謝您的查詢';
            setTimeout(() => {
              submitBtn.style.backgroundColor = "";
              submitBtn.disabled = false;
              submitBtn.innerHTML = '即時提交查詢 <i class="fas fa-paper-plane" style="margin-left: 6px;"></i>';
            }, 6000);
          }

          contactForm.reset();
        } else {
          throw new Error("傳送失敗");
        }
      } catch (err) {
        console.error("Formspree submit error:", err);
        showModal({
          success: false,
          title: "傳送未能完成",
          message: "網絡連線異常或服務暫時未能響應。<br />請稍後再試，或直接致電服務熱線 <strong>(852) 2487 1968</strong> 或電郵至 <strong>cs@fls.com.hk</strong>。"
        });

        if (formAlert) {
          formAlert.className = "form-alert error";
          formAlert.innerHTML = '<i class="fas fa-exclamation-triangle" style="margin-right:6px;"></i><strong>傳送未能完成：</strong> 請致電熱線 <strong>(852) 2487 1968</strong> 或電郵至 <strong>cs@fls.com.hk</strong>。';
          formAlert.style.display = "block";
        }

        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = '重新提交查詢 <i class="fas fa-paper-plane" style="margin-left: 6px;"></i>';
        }
      }
    });
  }
});
