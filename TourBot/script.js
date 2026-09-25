
// 清空所有測試投票數據與評審記錄函數 (Reset All Test Votes)
window.clearTestVotes = function() {
  if (confirm("確定要重設並清空所有測試投票數據與評審記錄嗎？\n\n清空後，總票數將重新歸零，測試意見將全部移除。")) {
    try {
      if (typeof window !== "undefined") {
        if (window.sessionStorage) sessionStorage.removeItem("fls_management_votes" || "[]");
        if (window.localStorage) localStorage.removeItem("fls_management_votes" || "[]");
      }
    } catch(e) {}
    if (typeof safeStorage !== "undefined") {
      safeStorage.setItem("fls_management_votes" || "[]", "[]");
    }
    const histEl = document.getElementById("feedback-history-list");
    if (histEl) histEl.innerHTML = '<div style="text-align:center; padding:30px; color:var(--text-muted); font-size:0.9rem;">目前暫無評審意見，等待管理層投票。</div>';
    const totalEl = document.getElementById("modal-total-votes");
    if (totalEl) totalEl.textContent = "0";
    alert("✅ 所有測試投票記錄已全數清空！票數已重設為 0。");
    location.reload();
  }
};


// ==========================================================================
// 全域色彩與大設計風格同步控制器 (Universal Theme & Style Controller)
// 支援 sessionStorage + URL 參數傳遞，100% 保證 file:// 與本機瀏覽無縫跨頁記憶
// ==========================================================================
(function() {
  function getQueryParam(param) {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      return urlParams.get(param);
    } catch(e) { return null; }
  }

  function getStoredItem(key) {
    try {
      const q = getQueryParam(key === "fls_active_theme" ? "theme" : "style");
      if (q) return q;
      if (typeof window !== "undefined") {
        if (window.sessionStorage && sessionStorage.getItem(key)) return sessionStorage.getItem(key);
        if (window.localStorage && localStorage.getItem(key)) return localStorage.getItem(key);
      }
    } catch(e) {}
    return null;
  }

  function setStoredItem(key, val) {
    try {
      if (typeof window !== "undefined") {
        if (window.sessionStorage) sessionStorage.setItem(key, String(val));
        if (window.localStorage) localStorage.setItem(key, String(val));
      }
    } catch(e) {}
  }

  window.applyTheme = function(themeId) {
    if (!themeId) themeId = "theme-white";
    document.documentElement.setAttribute("data-theme", themeId);
    setStoredItem("fls_active_theme", themeId);
    document.querySelectorAll(".theme-swatch-btn").forEach(btn => {
      btn.classList.toggle("active", btn.dataset.themeName === themeId);
    });
    document.querySelectorAll(".theme-select-card").forEach(card => {
      card.classList.toggle("active", card.dataset.themeVal === themeId);
    });
    syncAllLinks();
  };

  window.applyStyle = function(styleId) {
    if (!styleId) styleId = "style-a";
    document.documentElement.setAttribute("data-style", styleId);
    // 自動根據大設計風格匹配對應路線的 Hero 影片
    const curStyle = document.documentElement.getAttribute("data-style") || styleId;
    const btnV1 = document.getElementById("btn-hero-v1");
    const btnV2 = document.getElementById("btn-hero-v2");
    if (curStyle === "style-b" || curStyle === "style-c") {
      // 風格 B (奢華) 或 風格 C (科技) ➔ 搭配型格夜景路線影片二
      if (btnV2 && window.switchHeroMedia) {
        window.switchHeroMedia("video", "images/gemini_generated_video_da.mp4", "images/Gemini_Generated_Image_co.jpg", btnV2);
      }
    } else {
      // 風格 A (蘋果極簡) 或 風格 D (電商) ➔ 搭配明亮極簡路線影片一
      if (btnV1 && window.switchHeroMedia) {
        window.switchHeroMedia("video", "images/gemini_generated_video_3e.mp4", "images/Gemini_Generated_Image_sx.jpg", btnV1);
      }
    }

    setStoredItem("fls_active_style", styleId);
    document.querySelectorAll(".style-select-card").forEach(card => {
      card.classList.toggle("active", card.dataset.styleVal === styleId);
    });
    syncAllLinks();
  };

  window.selectTheme = function(themeId, el) {
    document.querySelectorAll(".theme-select-card").forEach(c => c.classList.remove("active"));
    if (el) el.classList.add("active");
    window.selectedThemePref = themeId;
    window.applyTheme(themeId);
  };

  window.selectStylePref = function(styleId, el) {
    document.querySelectorAll(".style-select-card").forEach(c => c.classList.remove("active"));
    if (el) el.classList.add("active");
    window.selectedStylePref = styleId;
    window.applyStyle(styleId);
  };

    // 媒體即時切換函數 (Video & Image Switcher with Smooth Transition)
  window.switchHeroMedia = function(type, videoSrc, posterOrImgSrc, btnEl) {
    const videoEl = document.getElementById("hero-main-video");
    const videoSource = document.getElementById("hero-video-source");
    const fallbackImg = document.getElementById("hero-fallback-img");

    if (btnEl) {
      document.querySelectorAll(".hero-thumb-btn").forEach(b => {
        b.style.background = "transparent";
        b.style.color = "#eee";
        b.style.fontWeight = "normal";
        b.classList.remove("active");
      });
      btnEl.style.background = "var(--accent-orange, #ff6b00)";
      btnEl.style.color = "#ffffff";
      btnEl.style.fontWeight = "bold";
      btnEl.classList.add("active");
    }

    if (type === "video" && videoEl) {
      videoEl.style.display = "block";
      if (fallbackImg) fallbackImg.style.display = "none";
      if (posterOrImgSrc) videoEl.poster = posterOrImgSrc;
      if (videoSource) {
        if (!videoSource.src.endsWith(videoSrc)) {
          videoSource.src = videoSrc;
          videoEl.load();
        }
        videoEl.play().catch(() => {});
      }
    } else if (type === "img") {
      if (videoEl) {
        try { videoEl.pause(); } catch(e) {}
        videoEl.style.display = "none";
      }
      if (fallbackImg) {
        fallbackImg.src = posterOrImgSrc;
        fallbackImg.style.display = "block";
      }
    }
  };

  // 向下兼容舊版 switchHeroImg 呼叫
  window.switchHeroImg = function(imgSrc, btnEl) {
    window.switchHeroMedia('img', '', imgSrc, btnEl);
  };


  function syncAllLinks() {
    const curTheme = document.documentElement.getAttribute("data-theme") || "theme-white";
    const curStyle = document.documentElement.getAttribute("data-style") || "style-a";
    document.querySelectorAll("a").forEach(a => {
      const href = a.getAttribute("href");
      if (href && !href.startsWith("http") && !href.startsWith("#") && !href.startsWith("mailto:") && !href.startsWith("tel:") && !href.startsWith("javascript:")) {
        try {
          const parts = href.split("#");
          const pathAndQuery = parts[0].split("?");
          const path = pathAndQuery[0];
          const sp = new URLSearchParams(pathAndQuery[1] || "");
          sp.set("theme", curTheme);
          sp.set("style", curStyle);
          const hash = parts[1] ? "#" + parts[1] : "";
          a.setAttribute("href", path + "?" + sp.toString() + hash);
        } catch(e) {}
      }
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    const initTheme = getStoredItem("fls_active_theme") || "theme-white";
    const initStyle = getStoredItem("fls_active_style") || "style-a";
    window.applyTheme(initTheme);
    window.applyStyle(initStyle);
    syncAllLinks();
  });
})();

/**
 * 威黃物流服務有限公司 - 核心交互腳本 (Core Interaction Script)
 * 包含多語言翻譯、動態數據渲染、表單雙通道提交流程、色系切換與管理層 Grouping 分組評審系統
 */

// 1. 安全本機存儲包裝器 (Safe Storage Wrapper - 杜絕 file:// 或無痕模式下拋出 SecurityError)
const safeStorage = {
  _mem: {},
  getItem(key) {
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        return window.localStorage.getItem(key);
      }
    } catch (e) {}
    return this._mem[key] !== undefined ? this._mem[key] : null;
  },
  setItem(key, val) {
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        window.localStorage.setItem(key, String(val));
      }
    } catch (e) {}
    this._mem[key] = String(val);
  }
};

// 2. 多語言詞庫 (Multi-Language Dictionary)
const I18N_DICT = {
  "zh-Hant": {
    navAbout: "關於威黃",
    navServices: "服務範疇",
    navBrands: "旗下品牌",
    navBlog: "網誌",
    navMedia: "新聞及媒體",
    navContact: "聯絡我們",
    navProposal: "企劃匯報",
    btnQuote: "立即報價",
    heroBadge: "EST. 1994 • FENIX GROUP 核心成員",
    heroTitle1: "大公司級數的倉配支援。",
    heroTitle2: "中小網店，同樣輕鬆擁有。",
    heroTagline: "集團經營 · 專業首選 ｜ 服務靈活 · 智慧之選 ｜ 服務以誠 · 真摰真心",
    heroDesc: "專為香港品牌與新一代電商打造。提供靈活按日計租、一站式揀貨包裝、中港跨境運輸與智能化庫存對接，讓你專注品牌擴張，其餘繁瑣交給我們。",
    heroBtnQuote: "立即獲取報價 →",
    heroBtnLearn: "探索智慧物流"
  },
  "zh-Hans": {
    navAbout: "关于威黄",
    navServices: "服务范畴",
    navBrands: "旗下品牌",
    navBlog: "网志",
    navMedia: "新闻及媒体",
    navContact: "联系我们",
    navProposal: "企划汇报",
    btnQuote: "立即报价",
    heroBadge: "EST. 1994 • FENIX GROUP 核心成员",
    heroTitle1: "大公司级数的仓配支援。",
    heroTitle2: "中小网店，同样轻松拥有。",
    heroTagline: "集团经营 · 专业首选 ｜ 服务灵活 · 智慧之选 ｜ 服务以诚 · 真挚真心",
    heroDesc: "专为香港品牌与新一代电商打造。提供灵活按日计租、一站式拣货包装、中港跨境运输与智能化库存对接，让你专注品牌扩张，其余繁琐交给我们。",
    heroBtnQuote: "立即获取报价 →",
    heroBtnLearn: "探索智慧物流"
  },
  "en": {
    navAbout: "About Us",
    navServices: "Services",
    navBrands: "Our Brands",
    navBlog: "Insights",
    navMedia: "Media & News",
    navContact: "Contact Us",
    navProposal: "Proposal Deck",
    btnQuote: "Instant Quote",
    heroBadge: "EST. 1994 • FENIX GROUP MEMBER",
    heroTitle1: "Enterprise-Grade Fulfillment.",
    heroTitle2: "Accessible for Every eCommerce.",
    heroTagline: "Group Backed · Trusted 3PL · Flexible Storage · Service Integrity",
    heroDesc: "Empowering Hong Kong retail brands and e-commerce entrepreneurs. Enjoy daily flex rental, standard pick & pack, cross-border freight, and automated API tracking.",
    heroBtnQuote: "Get an Instant Quote →",
    heroBtnLearn: "Explore Logistics Hub"
  }
};

// 3. 5 大色彩主題配置 (5 Color Themes Configuration)
const THEMES_CONFIG = [
  { id: "theme-white", name: "1. 經典純白 (淺色)", gradient: "linear-gradient(135deg, #ffffff 50%, #ff6b00 50%)", border: "#d0d0d5" },
  { id: "theme-ice",   name: "2. 極光冰藍 (淺色)", gradient: "linear-gradient(135deg, #f6f9fc 50%, #0071e3 50%)", border: "#b8d4f0" },
  { id: "theme-warm",  name: "3. 香檳暖米 (淺色)", gradient: "linear-gradient(135deg, #faf8f5 50%, #b3743b 50%)", border: "#dfd3c5" },
  { id: "theme-slate", name: "4. 科技石墨 (深灰)", gradient: "linear-gradient(135deg, #1c1d22 50%, #ff9500 50%)", border: "#4a4c56" },
  { id: "theme-dark",  name: "5. 午夜深空 (純黑)", gradient: "linear-gradient(135deg, #0a0a0c 50%, #ff5500 50%)", border: "#333339" }
];

// 核心全域色彩切換函數
function applyTheme(themeId) {
  if (!themeId) themeId = "theme-white";
  document.documentElement.setAttribute("data-theme", themeId);
  safeStorage.setItem("fls_active_theme", themeId);

  // 同步浮動 Dock 按鈕
  document.querySelectorAll(".theme-swatch-btn").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.themeName === themeId);
  });

  // 同步 Proposal 投票卡片
  document.querySelectorAll(".theme-select-card").forEach(card => {
    card.classList.toggle("active", card.dataset.themeVal === themeId);
  });
}
window.applyTheme = applyTheme;

// Proposal 點選大設計風格 (Grouping 1: Style Selection)
function selectStylePref(styleId, el) {
  document.querySelectorAll(".style-select-card").forEach(c => c.classList.remove("active"));
  if (el) el.classList.add("active");
  window.selectedStylePref = styleId;
  safeStorage.setItem("fls_pref_style", styleId);
}
window.selectStylePref = selectStylePref;

// Proposal 點選細節色系 (Grouping 2: Color Theme Selection)
function selectTheme(themeId, el) {
  document.querySelectorAll(".theme-select-card").forEach(c => c.classList.remove("active"));
  if (el) el.classList.add("active");
  window.selectedThemePref = themeId;
  applyTheme(themeId);
}
window.selectTheme = selectTheme;

// Proposal 星級評分全域處理
function selectRating(rating, btnEl) {
  const form = document.getElementById("management-feedback-form");
  if (form) {
    form.querySelectorAll(".star-btn").forEach(b => b.classList.remove("selected"));
  }
  if (btnEl) btnEl.classList.add("selected");
  window.selectedRatingVal = Number(rating);
}
window.selectRating = selectRating;

// Proposal 關閉彈出結果視窗全域處理
function closeModal() {
  const modalEl = document.getElementById("vote-result-modal");
  if (modalEl) modalEl.style.display = "none";
  const histEl = document.getElementById("feedback-history-list");
  if (histEl) histEl.scrollIntoView({ behavior: "smooth" });
}
window.closeModal = closeModal;

// 智能報價分步切換全域處理
function goToQuoteStep(step) {
  const quoteWizard = document.getElementById("smart-quote-form");
  if (!quoteWizard) return;
  const stepTabs = quoteWizard.querySelectorAll(".step-tab");
  const stepContents = quoteWizard.querySelectorAll(".wizard-step-content");
  stepTabs.forEach(t => t.classList.toggle("active", Number(t.dataset.step) === step));
  stepContents.forEach(c => c.classList.toggle("active", Number(c.dataset.step) === step));
}
window.goToQuoteStep = goToQuoteStep;

// 快速諮詢表單送出全域處理
async function handleQuickSubmit(e) {
  if (e && e.preventDefault) e.preventDefault();
  const form = document.getElementById("quick-inquiry-form");
  if (!form) return false;

  const submitBtn = form.querySelector("button[type='submit']");
  const originalBtnText = submitBtn ? submitBtn.innerHTML : "發送快速查詢 ✉️";
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.innerHTML = "正在處理並調用電郵客戶端...";
  }

  const name = (form.querySelector("[name='name']")?.value || "客戶").trim();
  const contact = (form.querySelector("[name='contact']")?.value || "").trim();
  const msg = (form.querySelector("[name='message']")?.value || "").trim();

  const summaryText = `【威黃物流服務有限公司 - 30秒快速查詢】\n` +
    `• 查詢者：${name}\n` +
    `• 聯絡電話/WhatsApp：${contact}\n` +
    `• 查詢事項：${msg}`;

  const mailSubject = encodeURIComponent(`【官網快速查詢】來自：${name}`);
  const mailBody = encodeURIComponent(summaryText);
  const mailtoUrl = `mailto:jason@fls.com.hk?subject=${mailSubject}&body=${mailBody}`;
  const waUrl = `https://api.whatsapp.com/send?phone=85297242234&text=${encodeURIComponent(summaryText)}`;

  try {
    window.location.href = mailtoUrl;
  } catch (err) {}

  try {
    fetch("https://formsubmit.co/ajax/jason@fls.com.hk", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify({
        _subject: `威黃物流服務有限公司 官網查詢 - ${name}`,
        to: "jason@fls.com.hk",
        查詢者姓名: name,
        聯絡方式: contact,
        查詢事項: msg
      })
    }).catch(() => {});
  } catch (err) {}

  const statusEl = document.getElementById("quick-status");
  if (statusEl) {
    statusEl.innerHTML = `
      <div style="background: rgba(52, 199, 89, 0.12); border: 1px solid rgba(52, 199, 89, 0.3); color: #1e7033; padding: 18px; border-radius: 12px; margin-top: 16px;">
        <p style="font-weight: 700; margin-bottom: 6px; font-size: 1rem;">✓ 查詢已為您打包！已喚起電郵發送至 jason@fls.com.hk</p>
        <p style="font-size: 0.85rem; margin-bottom: 12px; color: var(--text-secondary);">若您的設備未自動彈出郵件應用程式，亦可直接點擊下方按鈕：</p>
        <div style="display:flex; gap:10px; flex-wrap:wrap;">
          <a href="${mailtoUrl}" class="btn btn-primary" style="font-size:0.85rem; padding:8px 16px;">
            ✉️ 點此直接開啟電郵發送
          </a>
          <a href="${waUrl}" target="_blank" class="btn btn-secondary" style="font-size:0.85rem; padding:8px 16px;">
            💬 經 WhatsApp 一鍵發送
          </a>
        </div>
      </div>
    `;
  }

  if (submitBtn) {
    submitBtn.disabled = false;
    submitBtn.innerHTML = originalBtnText;
  }
  return false;
}
window.handleQuickSubmit = handleQuickSubmit;

// 智能報價表單送出全域處理
async function handleQuoteSubmit(e) {
  if (e && e.preventDefault) e.preventDefault();
  const form = document.getElementById("smart-quote-form");
  if (!form) return false;

  const submitBtn = form.querySelector("button[type='submit']");
  const originalBtnText = submitBtn ? submitBtn.innerHTML : "即時提交報價申請 🚀";
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.innerHTML = "正在處理並調用電郵客戶端...";
  }

  const formData = new FormData(form);
  const services = formData.getAll("quote_service").join(", ") || "未選擇";
  const volume = formData.get("quote_volume") || "未提供";
  const cargoType = formData.get("quote_cargo") || "一般消費品";
  const company = formData.get("quote_company") || "私人物流客戶";
  const name = formData.get("quote_name") || "未具名客戶";
  const phone = formData.get("quote_phone") || "";
  const email = formData.get("quote_email") || "";
  const notes = formData.get("quote_notes") || "無特殊備註";

  const summaryText = `【威黃物流服務有限公司 - 智能報價申請】\n` +
    `• 客戶稱呼：${name} (${company})\n` +
    `• 聯絡電話：${phone}\n` +
    `• 電郵：${email}\n` +
    `• 需求服務：${services}\n` +
    `• 預估月貨量：${volume}\n` +
    `• 貨物類別：${cargoType}\n` +
    `• 其他備註：${notes}`;

  const mailSubject = encodeURIComponent(`【官網報價申請】來自：${name} (${company})`);
  const mailBody = encodeURIComponent(summaryText);
  const mailtoUrl = `mailto:jason@fls.com.hk?subject=${mailSubject}&body=${mailBody}`;
  const waUrl = `https://api.whatsapp.com/send?phone=85297242234&text=${encodeURIComponent(summaryText)}`;

  try {
    window.location.href = mailtoUrl;
  } catch (err) {}

  try {
    fetch("https://formsubmit.co/ajax/jason@fls.com.hk", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify({
        _subject: `威黃物流服務有限公司 官網報價 - ${name} (${company})`,
        to: "jason@fls.com.hk",
        客戶稱呼: `${name} (${company})`,
        聯絡電話: phone,
        客戶電郵: email,
        服務模式: services,
        每月預計貨量: volume,
        商品品類: cargoType,
        備註需求: notes
      })
    }).catch(() => {});
  } catch (err) {}

  const statusEl = document.getElementById("quote-status");
  if (statusEl) {
    statusEl.innerHTML = `
      <div style="background: rgba(52, 199, 89, 0.12); border: 1px solid rgba(52, 199, 89, 0.3); color: #1e7033; padding: 20px; border-radius: 12px; margin-top: 20px;">
        <p style="font-weight: 700; font-size: 1.05rem; margin-bottom: 8px;">✓ 報價需求已打包！已為您喚起發送至 jason@fls.com.hk</p>
        <p style="font-size: 0.9rem; margin-bottom: 14px; color: var(--text-secondary);">我們已收到您的資訊，專員 Jason 將於 2 小時內為您核算費用。您亦可直接點擊：</p>
        <div style="display:flex; gap:10px; flex-wrap:wrap;">
          <a href="${mailtoUrl}" class="btn btn-primary" style="font-size:0.85rem; padding:8px 16px;">
            ✉️ 點此直接開啟電郵發送
          </a>
          <a href="${waUrl}" target="_blank" class="btn btn-secondary" style="background:#25D366; color:#ffffff; border:none; font-size:0.85rem; padding:8px 16px;">
            💬 經 WhatsApp 一鍵對話
          </a>
        </div>
      </div>
    `;
  }

  if (submitBtn) {
    submitBtn.disabled = false;
    submitBtn.innerHTML = originalBtnText;
  }
  return false;
}
window.handleQuoteSubmit = handleQuoteSubmit;

// Proposal 評審表單送出全域處理 (Grouping: Style + Theme + Rating)
let isFeedbackSubmitting = false;
function handleFeedbackSubmit(e) {
  if (e) { e.preventDefault(); e.stopPropagation(); }
  if (isFeedbackSubmitting) return false;
  isFeedbackSubmitting = true;
  setTimeout(() => { isFeedbackSubmitting = false; }, 800);
  if (e && e.preventDefault) e.preventDefault();
  const form = document.getElementById("management-feedback-form");
  if (!form) return false;

  const anonymousCheckbox = document.getElementById("anonymous-toggle");
  const nameInput = document.getElementById("feedback-name");
  const commentInput = document.getElementById("feedback-comment");

  const name = (anonymousCheckbox && anonymousCheckbox.checked) ? "管理層匿名成員" : ((nameInput?.value.trim()) || "管理層成員");
  const comment = (commentInput?.value.trim()) || "";
  const stylePref = window.selectedStylePref || safeStorage.getItem("fls_pref_style") || "style-a";
  const themePref = window.selectedThemePref || safeStorage.getItem("fls_active_theme") || "theme-white";
  const rating = window.selectedRatingVal || 5;

  const now = new Date();
  const timeStr = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')} ${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;

  const newEntry = {
    name,
    stylePref,
    themePref,
    rating,
    comment,
    time: timeStr
  };

  const stored = JSON.parse(safeStorage.getItem("fls_management_votes" || "[]") || "[]");
  stored.unshift(newEntry);
  safeStorage.setItem("fls_management_votes" || "[]", JSON.stringify(stored));

  // 更新歷史意見列表
  renderFeedbackHistory(stored);

  // 清空輸入
  if (commentInput) commentInput.value = "";
  if (nameInput && !anonymousCheckbox?.checked) nameInput.value = "";

  // 立即彈出分組統計視窗
  showVoteResultModal(newEntry, stored);
  return false;
}
window.handleFeedbackSubmit = handleFeedbackSubmit;

// 渲染管理層反饋看板 (支援 Style & Theme 分組標籤)
function renderFeedbackHistory(storedList) {
  const listEl = document.getElementById("feedback-history-list");
  if (!listEl) return;
  const list = storedList || JSON.parse(safeStorage.getItem("fls_management_votes" || "[]") || "[]");
  if (list.length === 0) {
    listEl.innerHTML = `<p style="color: var(--text-muted); font-size: 0.9rem; text-align: center; padding: 20px;">目前尚無提交的意見，歡迎作為第一位評審提交意見！</p>`;
    return;
  }
  
  const styleLabels = {
    "style-a": "🍏 風格 A (蘋果極簡)",
    "style-b": "🏛️ 風格 B (奢華商務)",
    "style-c": "⚡ 風格 C (智慧科技)",
    "style-d": "🚀 風格 D (電商活力)"
  };

  const themeNames = {
    "theme-white": "1. 經典純白",
    "theme-ice":   "2. 極光冰藍",
    "theme-warm":  "3. 香檳暖米",
    "theme-slate": "4. 科技石墨",
    "theme-dark":  "5. 午夜深空"
  };

  listEl.innerHTML = list.map(item => `
    <div style="background: var(--bg-secondary); border-radius: 12px; padding: 18px; margin-bottom: 14px; border: 1px solid var(--border-subtle);">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px; flex-wrap:wrap; gap:8px;">
        <strong style="color:var(--text-primary); font-size:1rem;">👤 ${item.name}</strong>
        <div style="display:flex; gap:8px; flex-wrap:wrap;">
          <span style="background:rgba(255,107,0,0.12); color:var(--accent-orange); font-size:0.75rem; font-weight:700; padding:3px 10px; border-radius:99px;">
            ${styleLabels[item.stylePref] || "🍏 風格 A (蘋果極簡)"}
          </span>
          <span style="background:rgba(0,113,227,0.1); color:var(--accent-blue); font-size:0.75rem; font-weight:700; padding:3px 10px; border-radius:99px;">
            🎨 ${themeNames[item.themePref] || "經典純白"}
          </span>
          <span style="background:rgba(52,199,89,0.12); color:#248a3d; font-size:0.75rem; font-weight:700; padding:3px 10px; border-radius:99px;">
            滿意度：${item.rating} / 5 星
          </span>
        </div>
      </div>
      <p style="font-size:0.9rem; color:var(--text-secondary); line-height:1.6; margin-bottom:8px;">
        ${item.comment || "（無額外文字補充）"}
      </p>
      <div style="font-size:0.75rem; color:var(--text-muted); text-align:right;">
        提交時間：${item.time}
      </div>
    </div>
  `).join("");
}

// 彈出投票即時統計結果視窗 (Grouping 分組雙維度統計)
function showVoteResultModal(latestEntry, allVotes) {
  const modalEl = document.getElementById("vote-result-modal");
  if (!modalEl) return;

  const totalVotes = allVotes.length;
  const sumRating = allVotes.reduce((acc, curr) => acc + curr.rating, 0);
  const avgRating = (sumRating / totalVotes).toFixed(1);

  const avgEl = document.getElementById("modal-avg-rating");
  const totalEl = document.getElementById("modal-total-votes");
  if (avgEl) avgEl.textContent = `★ ${avgRating}`;
  if (totalEl) totalEl.textContent = totalVotes;

  // Group 1: 大風格得票統計 (Style Votes)
  const styleCounts = {
    "style-a": { name: "🍏 風格 A：極致蘋果極簡風", color: "#ff6b00", count: 0 },
    "style-b": { name: "🏛️ 風格 B：國際商務奢華風", color: "#c5a059", count: 0 },
    "style-c": { name: "⚡ 風格 C：智慧科技物流風", color: "#0070f3", count: 0 },
    "style-d": { name: "🚀 風格 D：新零售電商活力風", color: "#00b894", count: 0 }
  };

  allVotes.forEach(v => {
    const s = v.stylePref || "style-a";
    if (styleCounts[s]) styleCounts[s].count++;
    else styleCounts["style-a"].count++;
  });

  const styleBarsContainer = document.getElementById("modal-style-bars");
  if (styleBarsContainer) {
    styleBarsContainer.innerHTML = Object.entries(styleCounts).map(([key, val]) => {
      const pct = totalVotes > 0 ? Math.round((val.count / totalVotes) * 100) : 0;
      return `
        <div class="theme-vote-row">
          <div class="theme-vote-header">
            <span>${val.name}</span>
            <span><strong>${val.count} 票</strong> (${pct}%)</span>
          </div>
          <div class="theme-progress-track">
            <div class="theme-progress-fill" style="width: ${pct}%; background: ${val.color};"></div>
          </div>
        </div>
      `;
    }).join("");
  }

  // Group 2: 色系偏好統計 (Theme Votes)
  const themeCounts = {
    "theme-white": { name: "經典純白 (淺色)", color: "#ff6b00", count: 0 },
    "theme-ice":   { name: "極光冰藍 (淺色)", color: "#0071e3", count: 0 },
    "theme-warm":  { name: "香檳暖米 (淺色)", color: "#b3743b", count: 0 },
    "theme-slate": { name: "科技石墨 (深灰)", color: "#ff9500", count: 0 },
    "theme-dark":  { name: "午夜深空 (純黑)", color: "#ff5500", count: 0 }
  };

  allVotes.forEach(v => {
    const t = v.themePref || "theme-white";
    if (themeCounts[t]) themeCounts[t].count++;
    else themeCounts["theme-white"].count++;
  });

  const barsContainer = document.getElementById("modal-theme-bars");
  if (barsContainer) {
    barsContainer.innerHTML = Object.entries(themeCounts).map(([key, val]) => {
      const pct = totalVotes > 0 ? Math.round((val.count / totalVotes) * 100) : 0;
      return `
        <div class="theme-vote-row">
          <div class="theme-vote-header">
            <span>${val.name}</span>
            <span><strong>${val.count} 票</strong> (${pct}%)</span>
          </div>
          <div class="theme-progress-track">
            <div class="theme-progress-fill" style="width: ${pct}%; background: ${val.color};"></div>
          </div>
        </div>
      `;
    }).join("");
  }

  // 最新意見展示
  const commentEl = document.getElementById("modal-latest-comment");
  if (commentEl) {
    const chosenStyle = styleCounts[latestEntry.stylePref]?.name || "🍏 風格 A (蘋果極簡)";
    const chosenTheme = themeCounts[latestEntry.themePref]?.name || "經典純白";
    commentEl.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px; flex-wrap:wrap; gap:8px;">
        <strong>👤 ${latestEntry.name}</strong>
        <div style="display:flex; gap:6px; font-size:0.8rem;">
          <span style="background:rgba(255,107,0,0.12); color:var(--accent-orange); padding:2px 8px; border-radius:4px; font-weight:700;">${chosenStyle}</span>
          <span style="background:rgba(0,113,227,0.1); color:var(--accent-blue); padding:2px 8px; border-radius:4px; font-weight:700;">${chosenTheme}</span>
          <span style="color:var(--accent-orange); font-weight:700;">★ ${latestEntry.rating} 星</span>
        </div>
      </div>
      <p style="color:var(--text-secondary); margin:0;">${latestEntry.comment || "（無額外評語，給予整體高度肯定）"}</p>
    `;
  }

  modalEl.style.display = "flex";
}

// 4. 主應用初始化邏輯 (Main App Initialization)
function initApp() {
  // A. 初始化主題
  const savedTheme = safeStorage.getItem("fls_active_theme") || "theme-white";
  window.selectedThemePref = savedTheme;
  window.selectedRatingVal = 5;
  applyTheme(savedTheme);

  // B. 初始化大風格偏好 (Grouping 1)
  const savedStyle = safeStorage.getItem("fls_pref_style") || "style-a";
  window.selectedStylePref = savedStyle;
  document.querySelectorAll(".style-select-card").forEach(card => {
    card.classList.toggle("active", card.dataset.styleVal === savedStyle);
    card.addEventListener("click", () => selectStylePref(card.dataset.styleVal, card));
  });

  // C. 右手邊懸浮主題切換器 Dock 注入
  if (!document.querySelector(".floating-theme-dock") && document.body) {
    const dock = document.createElement("aside");
    dock.className = "floating-theme-dock";
    dock.setAttribute("aria-label", "色系切換器");
    dock.innerHTML = `
      <div class="theme-dock-title">色系</div>
      ${THEMES_CONFIG.map(t => `
        <button type="button" class="theme-swatch-btn ${t.id === savedTheme ? 'active' : ''}" data-theme-name="${t.id}" aria-label="${t.name}">
          <span class="swatch-dot" style="background: ${t.gradient}; border: 1px solid ${t.border};"></span>
          <span class="swatch-label-tooltip">${t.name}</span>
        </button>
      `).join("")}
    `;
    document.body.appendChild(dock);

    dock.querySelectorAll(".theme-swatch-btn").forEach(btn => {
      btn.addEventListener("click", () => applyTheme(btn.dataset.themeName));
    });
  }

  // D. 初始化版權年份
  document.querySelectorAll(".current-year").forEach(el => el.textContent = new Date().getFullYear());

  // E. 移動端導航選單切換
  const menuToggle = document.querySelector(".menu-toggle");
  const mainNav = document.querySelector(".main-nav");
  if (menuToggle && mainNav) {
    menuToggle.addEventListener("click", () => {
      const isOpen = mainNav.classList.toggle("is-open");
      menuToggle.setAttribute("aria-expanded", String(isOpen));
    });

    mainNav.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        if (window.innerWidth <= 768) {
          mainNav.classList.remove("is-open");
          menuToggle.setAttribute("aria-expanded", "false");
        }
      });
    });
  }

  // F. 多語言切換處理
  const langBtns = document.querySelectorAll(".lang-btn");
  function setLanguage(lang) {
    const dict = I18N_DICT[lang] || I18N_DICT["zh-Hant"];
    document.querySelectorAll("[data-i18n]").forEach(el => {
      const key = el.dataset.i18n;
      if (dict[key]) el.textContent = dict[key];
    });
    langBtns.forEach(btn => {
      btn.classList.toggle("is-active", btn.dataset.lang === lang);
    });
    safeStorage.setItem("fls_site_lang", lang);
  }

  langBtns.forEach(btn => {
    btn.addEventListener("click", () => setLanguage(btn.dataset.lang));
  });

  const savedLang = safeStorage.getItem("fls_site_lang") || "zh-Hant";
  if (savedLang !== "zh-Hant") {
    setLanguage(savedLang);
  }

  // G. 動態渲染走馬燈客戶 (Client Marquee on index.html)
  const marqueeTrack = document.getElementById("marquee-track");
  if (marqueeTrack && window.FLS_DATA && window.FLS_DATA.clients) {
    const clients = window.FLS_DATA.clients;
    const allClients = [...clients, ...clients];
    marqueeTrack.innerHTML = allClients.map(c => `
      <a href="${c.url}" target="_blank" rel="noopener noreferrer" class="client-item" title="${c.name} - ${c.category}">
        <span>${c.name}</span>
      </a>
    `).join("");
  }

  // H. 動態渲染多倉網絡卡片 (Warehouses on services.html)
  const whGrid = document.getElementById("warehouses-dynamic-grid");
  if (whGrid && window.FLS_DATA && window.FLS_DATA.warehouses) {
    whGrid.innerHTML = window.FLS_DATA.warehouses.map(wh => `
      <article class="warehouse-card">
        <div>
          <div class="wh-header" style="margin-top:8px;">
            <span class="wh-tag-badge">${wh.tag}</span>
            <span class="wh-status-badge ${wh.status === "即將啟用" ? "pending" : ""}">${wh.status}</span>
          </div>
          <h3 class="wh-title">${wh.name}</h3>
          <p class="wh-address">📍 ${wh.address}</p>
          <div class="wh-specs">
            <div class="wh-spec-item">
              <strong>規模環境</strong>
              <span>${wh.area}</span>
            </div>
            <div class="wh-spec-item">
              <strong>設施規格</strong>
              <span>${wh.temp}</span>
            </div>
          </div>
          <ul class="wh-features">
            ${wh.features.map(f => `<li>✓ ${f}</li>`).join("")}
          </ul>
        </div>
        <div style="border-top: 1px solid var(--border-subtle); padding-top: 16px; margin-top: 8px;">
          <p style="font-size: 0.8125rem; color: var(--text-muted);">
            <strong>主要適用品類：</strong> ${wh.suitableFor}
          </p>
        </div>
      </article>
    `).join("");
  }

  // I. 動態渲染網誌文章 (Blog on blog.html)
  const blogGrid = document.getElementById("blog-dynamic-grid");
  if (blogGrid && window.FLS_DATA && window.FLS_DATA.blogPosts) {
    function renderBlog(filter = "all") {
      const posts = window.FLS_DATA.blogPosts.filter(p => filter === "all" || p.category === filter);
      blogGrid.innerHTML = posts.map(post => `
        <article class="article-card" data-category="${post.category}" style="padding-top:24px;">
          <div class="article-body">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px;">
              <span class="badge badge-orange" style="font-size:0.75rem;">${post.category}</span>
              <div class="article-meta" style="margin:0; font-size:0.8rem;">
                <span>📅 ${post.date}</span>
                <span>⏱ ${post.readTime}</span>
              </div>
            </div>
            <div class="article-meta">
              <span>📅 ${post.date}</span>
              <span>⏱ ${post.readTime}</span>
            </div>
            <h3 class="article-title">${post.title}</h3>
            <p class="article-snippet">${post.summary}</p>
            <a href="contact.html?subject=查詢網誌內容：${encodeURIComponent(post.title)}" class="article-link">
              閱讀深入分析及諮詢 →
            </a>
          </div>
        </article>
      `).join("");
    }

    renderBlog("all");

    document.querySelectorAll(".filter-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        renderBlog(btn.dataset.category);
      });
    });
  }

  // J. 智能報價表單分步邏輯事件綁定 (Smart Quote Wizard)
  const quoteWizard = document.getElementById("smart-quote-form");
  if (quoteWizard) {
    quoteWizard.querySelectorAll("[data-next-step]").forEach(btn => {
      btn.addEventListener("click", () => goToQuoteStep(Number(btn.dataset.nextStep)));
    });
    quoteWizard.querySelectorAll("[data-prev-step]").forEach(btn => {
      btn.addEventListener("click", () => goToQuoteStep(Number(btn.dataset.prevStep)));
    });
    quoteWizard.addEventListener("submit", handleQuoteSubmit);
  }

  // K. 快速諮詢表單事件綁定 (Quick Inquiry Form)
  const quickForm = document.getElementById("quick-inquiry-form");
  if (quickForm) {
    quickForm.addEventListener("submit", handleQuickSubmit);
  }

  // L. Proposal 管理層反饋評審事件綁定
  const feedbackForm = document.getElementById("management-feedback-form");
  if (feedbackForm) {
    // 星星點選
    feedbackForm.querySelectorAll(".star-btn").forEach(btn => {
      btn.addEventListener("click", () => selectRating(Number(btn.dataset.rating), btn));
    });

    // 色系卡片點選
    feedbackForm.querySelectorAll(".theme-select-card").forEach(card => {
      card.addEventListener("click", () => selectTheme(card.dataset.themeVal, card));
    });

    // 匿名切換
    const anonymousCheckbox = document.getElementById("anonymous-toggle");
    const nameInput = document.getElementById("feedback-name");
    if (anonymousCheckbox && nameInput) {
      anonymousCheckbox.addEventListener("change", () => {
        if (anonymousCheckbox.checked) {
          nameInput.value = "管理層匿名成員";
          nameInput.disabled = true;
        } else {
          nameInput.value = "";
          nameInput.disabled = false;
        }
      });
    }

    // Modal 關閉
    const btnCloseModal = document.getElementById("btn-close-modal");
    const btnModalDone = document.getElementById("btn-modal-done");
    if (btnCloseModal) btnCloseModal.addEventListener("click", closeModal);
    if (btnModalDone) btnModalDone.addEventListener("click", closeModal);

    // 提交監聽
    feedbackForm.addEventListener("submit", handleFeedbackSubmit);

    // 初始渲染看板
    renderFeedbackHistory();
  }
}

// 5. 確保在任何狀態下（無論已載入或正在載入）均能立即啟動 (Zero Delay Bootstrap)
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initApp);
} else {
  initApp();
}


  // 自動依風格同步 Hero 影片 (Style A/D -> 純白片一; Style B/C -> 型格科技夜景片二)
  const origApplyStyle = window.applyStyle;
  window.applyStyle = function(styleName) {
    if (typeof origApplyStyle === "function") {
      origApplyStyle(styleName);
    }
    const heroVid = document.getElementById("hero-main-video");
    const heroSrc = document.getElementById("hero-video-source");
    if (heroVid && heroSrc) {
      const targetVideo = (styleName === "style-b" || styleName === "style-c")
        ? "images/gemini_generated_video_da.mp4"
        : "images/gemini_generated_video_3e.mp4";
      if (!heroSrc.src.endsWith(targetVideo)) {
        heroSrc.src = targetVideo;
        heroVid.load();
        heroVid.play().catch(e => {});
      }
    }
  };


  // 保證 Hero 影片在所有瀏覽器與本機 file:// 環境下均能順暢自動播放 (Robust Autoplay Engine)
  function initHeroVideoAutoplay() {
    const vid = document.getElementById("hero-main-video");
    if (!vid) return;

    vid.muted = true;
    vid.defaultMuted = true;
    vid.setAttribute("muted", "");
    vid.setAttribute("playsinline", "");
    vid.setAttribute("autoplay", "");

    const playPromise = vid.play();
    if (playPromise !== undefined) {
      playPromise.catch(function(err) {
        console.warn("[FLS Video] Autoplay constrained by browser policy. Will auto-play on first user touch/click.", err);
        const playOnInteraction = function() {
          vid.play().catch(e => {});
          window.removeEventListener("click", playOnInteraction);
          window.removeEventListener("touchstart", playOnInteraction);
          window.removeEventListener("scroll", playOnInteraction);
        };
        window.addEventListener("click", playOnInteraction, { once: true });
        window.addEventListener("touchstart", playOnInteraction, { once: true });
        window.addEventListener("scroll", playOnInteraction, { once: true });
      });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initHeroVideoAutoplay);
  } else {
    initHeroVideoAutoplay();
  }
