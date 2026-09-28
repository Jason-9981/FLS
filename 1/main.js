/**
 * FLS 威黃物流服務有限公司 - 官網核心邏輯 (Main JavaScript)
 * 100% 依據 fls.com.hk 舊網站原文建構
 * Version: v0.1 (Build 20260928)
 */

console.log(
  "%c Project Version %c v0.1 [2026-09-28] ",
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

  // 3. 動態渲染位置圖清單
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

  // 5. Formspree 報價表單 AJAX 提交
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

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 正在傳送...';
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
          if (formAlert) {
            formAlert.className = "form-alert success";
            formAlert.innerHTML = '<strong>✅ 感謝閣下的查詢！</strong> 我們已收到您的訊息，專屬物流主任將於 24 小時內與您聯絡。';
            formAlert.style.display = "block";
          }
          contactForm.reset();
        } else {
          throw new Error("傳送失敗");
        }
      } catch (err) {
        console.error("Formspree submit error:", err);
        if (formAlert) {
          formAlert.className = "form-alert error";
          formAlert.innerHTML = `<strong>⚠️ 傳送未能完成：</strong> 請致電熱線 <strong>852 2487 1968</strong> 或電郵至 <strong>cs@fls.com.hk</strong>。`;
          formAlert.style.display = "block";
        }
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = '即時提交查詢 <i class="fas fa-paper-plane" style="margin-left: 6px;"></i>';
        }
      }
    });
  }
});
