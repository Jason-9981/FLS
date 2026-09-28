
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
    heroDesc: "專為香港品牌與新一代電商打造。提供靈活按日計租、一站式揀貨包裝、門市庫存及 POS 數據管理與智能化庫存對接，讓你專注品牌擴張，其餘繁瑣交給我們。",
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
    heroDesc: "专为香港品牌与新一代电商打造。提供灵活按日计租、一站式拣货包装、门市POS库存管理、香港本地车队派送与货仓ERP查货系统，让你专注品牌扩张，其余繁琐交给我们。",
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
        <p style="font-weight: 700; margin-bottom: 6px; font-size: 1rem;">✓ 查詢已為您打包！已喚起電郵客戶端直接發送</p>
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
        <p style="font-weight: 700; font-size: 1.05rem; margin-bottom: 8px;">✓ 報價需求已打包！已為您喚起電郵客戶端發送</p>
        <p style="font-size: 0.9rem; margin-bottom: 14px; color: var(--text-secondary);">我們已收到您的資訊，資深物流顧問將於 2 小時內為您核算費用。您亦可直接點擊：</p>
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

  // ==========================================================================
  // FLS 全站多語言智能即時翻譯引擎 (Full-Site Universal i18n Translation Engine)
  // 支援：繁體中文 (zh-Hant) ｜ 簡體中文 (zh-Hans 全字元自動轉碼) ｜ 英文 (en)
  // ==========================================================================
  const T2S_MAP = {"與": "与", "務": "务", "倉": "仓", "貨": "货", "網": "网", "黃": "黄", "業": "业", "電": "电", "專": "专", "時": "时", "報": "报", "統": "统", "係": "系", "運": "运", "關": "关", "劃": "划", "範": "范", "疇": "畴", "誌": "志", "體": "体", "聯": "联", "絡": "络", "價": "价", "儲": "储", "點": "点", "擊": "击", "開": "开", "發": "发", "階": "阶", "段": "段", "實": "实", "線": "线", "導": "导", "覽": "览", "機": "机", "器": "器", "經": "经", "銷": "销", "戰": "战", "略": "略", "夥": "伙", "伴": "伴", "緊": "紧", "圍": "围", "蓋": "盖", "門": "门", "區": "区", "恆": "恒", "糧": "粮", "嚴": "严", "庫": "库", "控": "控", "訪": "访", "問": "问", "訊": "讯", "屬": "属", "數": "数", "據": "据", "樞": "枢", "紐": "纽", "總": "总", "艦": "舰", "適": "适", "載": "载", "設": "设", "備": "备", "檢": "检", "驗": "验", "裝": "装", "卸": "卸", "達": "达", "環": "环", "保": "保", "節": "节", "省": "省", "車": "车", "隊": "队", "輸": "输", "送": "送", "誠": "诚", "摯": "挚", "航": "航", "評": "评", "審": "审", "免": "免", "責": "责", "聲": "声", "明": "明", "履": "履", "約": "约", "製": "制", "擴": "扩", "張": "张", "繁": "繁", "瑣": "琐", "獲": "获", "取": "取", "測": "测", "算": "算", "優": "优", "勢": "势", "積": "积", "累": "累", "轉": "转", "換": "换", "縮": "缩", "減": "减", "兩": "两", "無": "无", "論": "论", "潔": "洁", "簡": "简", "質": "质", "感": "感", "極": "极", "致": "致", "銳": "锐", "雙": "双", "邊": "边", "框": "框", "圓": "圆", "陰": "阴", "影": "影", "動": "动", "態": "态", "響": "响", "應": "应", "觸": "触", "攔": "拦", "截": "截", "穿": "穿", "遮": "遮", "擋": "挡", "錯": "错", "復": "复", "創": "创", "辦": "办", "處": "处", "讓": "让", "訂": "订", "閱": "阅", "證": "证", "認": "认", "講": "讲", "話": "话", "說": "说", "讀": "读", "調": "调", "諮": "咨", "諾": "诺", "謝": "谢", "護": "护", "譽": "誉", "變": "变", "雜": "杂", "歡": "欢", "歐": "欧", "規": "规", "親": "亲", "覺": "觉", "觀": "观", "買": "买", "賣": "卖", "費": "费", "貿": "贸", "賃": "赁", "購": "购", "賽": "赛", "贊": "赞", "贈": "赠", "跨": "跨", "較": "较", "輯": "辑", "辭": "辞", "遠": "远", "遲": "迟", "遷": "迁", "選": "选", "遺": "遗", "邁": "迈", "還": "还", "邏": "逻", "郵": "邮", "鄉": "乡", "鄰": "邻", "醫": "医", "針": "针", "鈕": "纽", "錄": "录", "錢": "钱", "鎮": "镇", "鏡": "镜", "鐘": "钟", "鐵": "铁", "閃": "闪", "閉": "闭", "間": "间", "閣": "阁", "闊": "阔", "陸": "陆", "陳": "陈", "陽": "阳", "隕": "陨", "險": "险", "隨": "随", "隱": "隐", "隻": "只", "難": "难", "雲": "云", "霧": "雾", "靈": "灵", "靜": "静", "韋": "韦", "頂": "顶", "項": "项", "順": "顺", "須": "须", "預": "预", "頑": "顽", "領": "领", "頭": "头", "頻": "频", "題": "题", "額": "额", "風": "风", "飛": "飞", "養": "养", "館": "馆", "馬": "马", "馮": "冯", "馭": "驭", "馳": "驰", "驅": "驱", "駐": "驻", "駕": "驾", "髮": "发", "鬆": "松", "鬧": "闹", "魚": "鱼", "鮮": "鲜", "鷗": "鸥", "鵪": "鹌", "鸕": "鸬", "鹽": "盐", "麗": "丽", "麥": "麦", "麵": "面", "麼": "么", "齋": "斋", "齊": "齐", "齒": "齿", "龍": "龙", "龜": "龟", "個": "个", "們": "们", "來": "来", "為": "为", "國": "国", "會": "会", "這": "这", "對": "对", "著": "着", "後": "后", "產": "产", "愛": "爱", "幫": "帮", "標": "标", "並": "并", "步": "步", "參": "参", "策": "策", "差": "差", "長": "长", "廠": "厂", "徹": "彻", "稱": "称", "程": "程", "純": "纯", "從": "从", "帶": "带", "單": "单", "擔": "担", "當": "当", "黨": "党", "鄧": "邓", "遞": "递", "獨": "独", "端": "端", "噸": "吨", "奪": "夺", "兒": "儿", "飯": "饭", "紛": "纷", "奮": "奋", "豐": "丰", "鳳": "凤", "婦": "妇", "複": "复", "覆": "覆", "該": "该", "概": "概", "幹": "干", "岡": "冈", "鋼": "钢", "顧": "顾", "掛": "挂", "貫": "贯", "慣": "惯", "廣": "广", "歸": "归", "軌": "轨", "貴": "贵", "過": "过", "號": "号", "懷": "怀", "壞": "坏", "繪": "绘", "級": "级", "記": "记", "際": "际", "繼": "继", "績": "绩", "架": "架", "監": "监", "堅": "坚", "見": "见", "將": "将", "降": "降", "腳": "脚", "結": "结", "屆": "届", "錦": "锦", "進": "进", "勁": "劲", "驚": "惊", "舉": "举", "劇": "剧", "聚": "聚", "絕": "绝", "軍": "军", "凱": "凯", "顆": "颗", "誇": "夸", "寬": "宽", "況": "况", "虧": "亏", "賴": "赖", "藍": "蓝", "樂": "乐", "類": "类", "禮": "礼", "歷": "历", "連": "连", "戀": "恋", "涼": "凉", "臨": "临", "樓": "楼", "漏": "漏", "輪": "轮", "羅": "罗", "慮": "虑", "媽": "妈", "碼": "码", "螞": "蚂", "滿": "满", "夢": "梦", "滅": "灭", "鳴": "鸣", "謀": "谋", "納": "纳", "囊": "囊", "腦": "脑", "內": "内", "鳥": "鸟", "寧": "宁", "農": "农", "盤": "盘", "拋": "抛", "貧": "贫", "憑": "凭", "頗": "颇", "撲": "扑", "鋪": "铺", "騎": "骑", "啟": "启", "氣": "气", "牽": "牵", "潛": "潜", "淺": "浅", "強": "强", "牆": "墙", "槍": "枪", "搶": "抢", "橋": "桥", "竊": "窃", "輕": "轻", "傾": "倾", "請": "请", "慶": "庆", "窮": "穷", "趨": "趋", "權": "权", "勸": "劝", "卻": "却", "確": "确", "饒": "饶", "熱": "热", "榮": "荣", "軟": "软", "傘": "伞", "掃": "扫", "殺": "杀", "紗": "纱", "篩": "筛", "刪": "删", "傷": "伤", "賞": "赏", "紹": "绍", "升": "升", "勝": "胜", "繩": "绳", "師": "师", "濕": "湿", "識": "识", "駛": "驶", "釋": "释", "壽": "寿", "書": "书", "術": "术", "樹": "树", "帥": "帅", "絲": "丝", "損": "损", "鎖": "锁", "談": "谈", "彈": "弹", "湯": "汤", "討": "讨", "騰": "腾", "條": "条", "聽": "听", "圖": "图", "團": "团", "脫": "脱", "灣": "湾", "萬": "万", "衛": "卫", "溫": "温", "聞": "闻", "撾": "挝", "臥": "卧", "誤": "误", "習": "习", "戲": "戏", "細": "细", "纖": "纤", "顯": "显", "現": "现", "縣": "县", "憲": "宪", "詳": "详", "想": "想", "協": "协", "寫": "写", "洩": "泄", "興": "兴", "續": "续", "懸": "悬", "學": "学", "尋": "寻", "訓": "训", "迅": "迅", "壓": "压", "亞": "亚", "顏": "颜", "演": "演", "厭": "厌", "樣": "样", "遙": "遥", "藥": "药", "耀": "耀", "爺": "爷", "葉": "叶", "頁": "页", "儀": "仪", "億": "亿", "憶": "忆", "義": "义", "議": "议", "藝": "艺", "譯": "译", "銀": "银", "營": "营", "穎": "颖", "擁": "拥", "踴": "踊", "誘": "诱", "餘": "余", "語": "语", "願": "愿", "躍": "跃", "災": "灾", "暫": "暂", "髒": "脏", "則": "则", "擇": "择", "澤": "泽", "閘": "闸", "展": "展", "佔": "占", "漲": "涨", "帳": "账", "障": "障", "照": "照", "偵": "侦", "診": "诊", "陣": "阵", "爭": "争", "睜": "睁", "蒸": "蒸", "織": "织", "執": "执", "職": "职", "紙": "纸", "終": "终", "傳": "传", "賺": "赚", "壯": "壮", "狀": "状", "準": "准", "濁": "浊", "資": "资", "綜": "综", "縱": "纵", "組": "组", "誕": "诞", "縛": "缚", "縫": "缝", "匯": "汇", "層": "层", "惱": "恼", "戶": "户", "捨": "舍", "膠": "胶", "喚": "唤", "寵": "宠", "貼": "贴", "鍵": "键", "摰": "挚", "舖": "铺", "棧": "栈", "摺": "折", "撐": "撑", "撥": "拨", "擅": "擅", "擎": "擎", "擺": "摆", "攜": "携", "攬": "揽", "斷": "断", "暢": "畅", "棟": "栋", "構": "构", "橫": "横", "檔": "档", "檳": "槟", "檻": "槛", "櫃": "柜", "欄": "栏", "湊": "凑", "滾": "滚", "潑": "泼", "潤": "润", "濾": "滤", "瀏": "浏", "熨": "熨", "燙": "烫", "猶": "犹", "皺": "皱", "盜": "盗", "盡": "尽", "眾": "众", "睞": "睐", "稅": "税", "種": "种", "穩": "稳", "窩": "窝", "竭": "竭", "籤": "签", "簽": "签", "紮": "扎", "綁": "绑", "緒": "绪", "繫": "系", "繳": "缴", "膩": "腻", "臟": "脏", "薦": "荐", "蘊": "蕴", "蘋": "苹", "袱": "袱", "裹": "裹", "襯": "衬", "襲": "袭", "託": "托", "詞": "词", "詢": "询", "試": "试", "謊": "谎", "謹": "谨", "譜": "谱", "警": "警", "賦": "赋", "蹤": "踪", "輒": "辄", "轄": "辖", "逾": "逾", "邃": "邃", "銜": "衔", "闆": "板", "隸": "隶", "露": "露", "韌": "韧", "顛": "颠", "饋": "馈", "驟": "骤", "場": "场", "幾": "几", "東": "东", "華": "华", "售": "售", "客": "客", "描": "描", "品": "品", "量": "量", "核": "核", "收": "收", "入": "入", "出": "出", "移": "移", "配": "配", "退": "退", "補": "补", "償": "偿", "格": "格", "用": "用", "計": "计", "票": "票", "率": "率", "扣": "扣", "除": "除", "惠": "惠", "折": "折", "券": "券", "分": "分", "員": "员", "登": "登", "註": "注", "冊": "册", "密": "密", "忘": "忘", "重": "重", "置": "置", "修": "修", "改": "改", "定": "定", "存": "存", "提": "提", "交": "交", "消": "消", "返": "返", "回": "回", "前": "前", "刷": "刷", "新": "新", "加": "加", "搜": "搜", "索": "索", "查": "查", "排": "排", "序": "序", "打": "打", "印": "印", "享": "享", "藏": "藏", "注": "注", "讚": "赞", "留": "留", "言": "言", "私": "私", "信": "信", "通": "通", "知": "知", "醒": "醒", "息": "息", "公": "公", "告": "告", "助": "助", "中": "中", "心": "心", "我": "我", "於": "于", "款": "款", "版": "版", "所": "所", "有": "有", "案": "案", "技": "技", "支": "支", "援": "援", "系": "系", "維": "维", "日": "日", "份": "份", "原": "原", "同": "同", "接": "接", "口": "口", "者": "者", "境": "境", "正": "正", "式": "式", "布": "布", "本": "本", "更": "更", "路": "路", "流": "流", "延": "延", "丟": "丢", "包": "包", "伺": "伺", "服": "服", "負": "负", "均": "均", "衡": "衡", "高": "高", "可": "可", "容": "容", "叢": "丛", "集": "集", "故": "故", "指": "指", "閾": "阈", "值": "值", "渠": "渠", "道": "道", "件": "件", "微": "微", "釘": "钉", "企": "企", "音": "音", "短": "短", "常": "常", "得": "得", "給": "给", "面": "面", "力": "力", "西": "西", "南": "南", "北": "北", "家": "家", "政": "政", "民": "民", "社": "社", "部": "部", "局": "局", "科": "科", "室": "室", "班": "班", "工": "工", "兵": "兵", "商": "商", "文": "文", "理": "理", "化": "化", "生": "生", "史": "史", "地": "地", "法": "法", "律": "律", "章": "章", "制": "制", "度": "度", "例": "例", "手": "手", "要": "要", "求": "求", "痛": "痛", "劣": "劣", "遇": "遇", "挑": "挑", "方": "方", "措": "措", "施": "施", "目": "目", "任": "任", "限": "限", "效": "效", "考": "考", "估": "估", "督": "督", "促": "促", "落": "落", "反": "反"};
  const CANTONESE_PHRASES = [["你好！我係導覽員小威", "你好！我是导览员小威"], ["身邊呢位戴眼鏡嘅係小黃", "身边这位戴眼镜的是小黄"], ["歡迎參觀威黃物流（FLS）！", "欢迎参观威黄物流（FLS）！"], ["向下滾動我會為你解密每個位置嘅物流內幕！", "向下滚动我会为你解密每个位置的物流内幕！"], ["早在 1994 年就已經係", "早在 1994 年就已经是"], ["嘅專屬物流心臟", "的专属物流心脏"], ["當年全港第一批", "当年全港第一批"], ["嘅恆溫吊掛時裝倉", "的恒温吊挂时装仓"], ["就係由我哋達利中心工程團隊一手打造！", "就是由我们达利中心工程团队一手打造！"], ["行到最底喇！", "走到最底啦！"], ["搵我們的物流專員", "联系我们的物流专员"], ["隨時為你提供支援", "随时为你提供支持"], ["用幾多算幾多", "用多少算多少"], ["免去奔波迷你倉煩惱", "免去奔波迷你仓烦恼"], ["點擊即時解密", "点击即时解密"], ["專屬導覽員小威", "专属导览员小威"], ["重講當前頁段", "重讲当前页段"], ["試算報價", "试算报价"], ["我係", "我是"], ["呢位", "这位"], ["嘅係", "的是"], ["我哋", "我们"], ["咗", "了"], ["喺", "在"], ["嘅", "的"], ["哋", "们"], ["搵", "找"], ["咁", "这么"], ["點樣", "怎样"], ["邊度", "哪里"], ["幾多", "多少"], ["好抵", "划算"], ["係", "是"], ["唔", "不"]];
  const EN_PHRASES = {"威黃物流服務有限公司自 1994 年成立，深耕香港及大灣區逾 30 年。以三黃集團堅實後盾，提供企業級倉配、本地專櫃快運與新一代電商智能履約方案。": "Established in 1994, Fenix Logistics Services Ltd. has served Hong Kong and the GBA for over 30 years, backed by Fenix Group.", "專為香港品牌與新一代電商打造。提供靈活按日計租、一站式揀貨包裝、門市庫存及 POS 數據管理與智能化庫存對接，讓你專注品牌擴張，其餘繁瑣交給我們。": "Empowering Hong Kong retail brands and modern e-commerce. We provide daily flex rental, seamless pick & pack, cross-border logistics, and automated system sync so you can focus on brand growth.", "配備恆溫冷氣倉、高位重型貨架與專用吊掛成衣區。地處葵青物流咽喉，緊鄰葵涌貨櫃碼頭與主要幹線，跨境運輸每日準時往返。": "Equipped with climate-controlled cold air storage, heavy pallet racks, and dedicated garment-on-hanger areas. Prime Kwai Tsing location next to container terminals with daily cross-border transit.", "Fenix Pet 為 FLS 公司旗下專營寵物用品銷售業務的子公司，致力代理世界各地著名優質寵物用品與食品品牌。": "Fenix Pet is an FLS subsidiary dedicated to distributing world-renowned premium pet food, accessories, and wellness products.", "FENIX GROUP HOLDINGS LTD 業務橫跨頂級零售、品牌代理與物流，逾 30 年外資信譽卓越。": "FENIX GROUP HOLDINGS LTD spans luxury fashion retail, brand distribution, and logistics with over 30 years of impeccable heritage.", "不再需要自己下班包貨、排隊寄快遞。將貨品存入 FLS，我們為你自動接單、精美包裝並代寄出貨，助你專注市場行銷。": "No more packing late at night or queuing at couriers. Store your goods at FLS: we automate orders, pack delicately, and dispatch directly so you can focus on sales.", "自 1994 年深耕香港，我們將 30 年累積的大型供應鏈基建，轉化為每一家中小網店都能即開即用的彈性資源。": "Rooted in Hong Kong since 1994, we convert 30 years of premier supply-chain infrastructure into ready-to-use scalable resources for every online brand.", "專為連鎖時裝、高價精品與跨國企業打造。提供多門市點對點補貨、香港本地專櫃冷氣運輸與門市庫存管理、產地來源證申報及系統深度對接。": "Crafted for fashion chains, luxury boutiques, and enterprises. Offering store-to-store replenishment, temperature-controlled transit, and deep ERP integration.", "Carry Kuma 專為家庭、個人及微小型電商提供上門儲存箱及靈活倉配服務，隸屬三黃集團與威黃物流。": "Carry Kuma delivers door-to-door storage box services and agile fulfillment for households, individuals, and boutique eCommerce brands.", "結合 30 年實體基建與現代數字化賦能，為品牌打造從倉儲、運輸、IT電腦支援到國際船務的一條龍閉環：": "Blending 30 years of physical infrastructure with digital empowerment to build a closed-loop ecosystem from warehousing, transport, and IT support to international freight:", "無論您是迅速崛起的獨立網店，或是需要跨國供應鏈的品牌集團，FLS 皆能量身定制最優履約路徑：": "Whether you are a fast-growing boutique eCommerce store or a multinational brand group, FLS tailors the optimal fulfillment pathway:", "透過專業子公司與新世代品牌延伸，我們將集團物流優勢深耕至寵物用品代理與智慧上門生活存儲領域。": "Extending our 30-year logistics excellence into specialized premium pet care distribution and smart on-demand door-to-door storage.", "只需 1 分鐘填寫需求，我們的資深物流顧問將為您量身定制最具性價比的倉儲及配送方案。": "Take 1 minute to outline your needs. Our logistics consultants will tailor the most cost-effective storage & delivery plan for you.", "配備客製化貨倉 ERP 雲端查貨系統與條碼雙重防呆驗證，庫存實時同步，徹底杜絕發錯貨。": "Powered by custom Warehouse ERP cloud tracking and double barcode proofing. Real-time stock synchronization eliminates shipping errors.", "集團經營 · 專業首選 ｜ 服務靈活 · 智慧之選 ｜ 服務以誠 · 真摰真心": "Group Heritage · Professional Choice | Flexible Solutions · Smart Choice | Service Integrity · Dedication from Heart", "淡季不用白繳租金，旺季促銷隨時擴倉。專為電商創業者量身定制的零負擔倉儲模型。": "No wasted rent during low seasons; scale up instantly during flash sales. A burden-free warehousing model tailored for modern entrepreneurs.", "標準化流水線與條碼覆核作業，無論雙11或節日促銷，保證當日訂單當日發出。": "Standardized assembly lines and barcode verification ensure same-day dispatch even during Double 11 and peak shopping seasons.", "Shopify/HKTVmall 對接，99.9% 掃描防呆當日發貨。": "Direct Shopify/HKTVmall integration, 99.9% barcode-verified same-day dispatch.", "✓ 即日揀貨發貨：串接順豐、Zeek 等主流快遞，享大客運費優惠": "✓ Same-Day Dispatch: Integrated with SF Express, Zeek, etc., with tier-1 corporate courier rates", "✓ 貨倉 ERP 查貨系統：24小時線上即時掌握庫存與貨流": "✓ Warehouse ERP System: 24/7 online stock tracking", "24小時雲端查貨，支援 API / EDI 對接客戶 ERP。": "24/7 cloud inventory visibility, supporting API/EDI integration with client ERPs.", "一站式 I.T. 軟硬體支援維護，簡化客戶管理，提升投資回報。": "One-stop hardware and software IT support to streamline operations and enhance ROI.", "✓ 戰略合作夥伴：與 Waylun Pet Care 緊密合作": "✓ Strategic Partner: Strong synergy with Waylun Pet Care", "數字不說謊，看看將倉儲交給專業團隊能為你節省多少精力與金錢：": "Numbers speak for themselves. Discover how outsourcing storage saves you time, energy, and costs:", "✓ 客製化包裝禮盒：支援附送品牌感謝卡、禮盒絲帶與防震包裝": "✓ Custom Gift Packaging: Support brand cards, satin ribbons, and premium protective wrapping", "EST. 1994 • FENIX GROUP 核心成員": "EST. 1994 • CORE MEMBER OF FENIX GROUP", "文件製作、專業報關、產地證及熏蒸證申請、代訂進出口倉位。": "Documentation, customs declaration, Certificate of Origin, fumigation, and freight booking.", "✓ 按日計租：無需簽署工廈死約，按實際佔用板位或箱數扣費": "✓ Daily Flex Rental: Zero lock-in leases; pay only for actual pallets or cartons used", "✓ 貨倉 ERP 系統 24 小時在線即時掌握庫存與貨流": "✓ Proprietary EBP system offers 24/7 real-time inventory visibility", "常溫及18-22°C恆溫精品冷氣倉，按日按板靈活計租。": "Ambient & 18-22°C climate-controlled storage, flexible daily/pallet rental.", "✓ 專業增值處理：成衣防塵吊掛、蒸氣熨燙、繁體標籤貼換": "✓ Professional VAS: Garment-on-hanger protection, steaming, and Chinese label replacement", "全港各大商場專櫃補貨、門市急送與 B2C 宅配直達。": "Shopping mall store replenishment, express retail dispatch, and door-to-door B2C delivery.", "✓ 全港商場專櫃補貨：自設車隊熟悉各大商場卸貨區規則": "✓ Mall Store Replenishment: Dedicated fleet familiar with loading dock regulations across HK malls", "✓ 專業全職員工流水線作業，99.9% 掃描防呆出貨": "✓ Dedicated full-time assembly teams; 99.9% barcode-verified dispatch", "✓ 集團級海量單量對接快遞，享大客運費並每日定時攬收": "✓ Enterprise shipping volume with top courier discounts and scheduled daily pickups", "成衣專業蒸燙、吊牌貼標、QC 品質檢驗與禮盒組裝。": "Garment steaming, label tagging, QC inspection, and luxury gift box assembly.", "企業級 3PL 專道 • 30年基業 / 稳定合規": "Enterprise 3PL • 30-Year Heritage & Compliance", "企業級 3PL 專道 • 30年基業 / 穩定合規": "Enterprise 3PL • 30-Year Heritage & Compliance", "手工記錄 Excel，常發生「網上賣出但倉庫無貨」": "Manual Excel tracking often causing overselling when stock is out", "📍 香港葵涌梨木道88號達利中心5樓502A-B室": "📍 Unit 502A-B, 5/F, Mai Luen Industrial Building, 88 Lei Muk Road, Kwai Chung, HK", "自設香港本地車隊每日定點巡迴補貨，熟悉全港商場裝卸流程。": "Dual-plated vehicle fleet operating daily between HK and Mainland with bonded customs clearance.", "✓ 專業業務範圍：涵蓋香港及澳門區批發與零售通路": "✓ Coverage: Wholesale & retail distribution across HK and Macau", "✓ 專屬手機 App 一鍵管理存儲物品與調撥預約": "✓ Dedicated mobile app to manage stored items & schedule retrieval anytime", "✓ 按日計租，按實際件數/板位收費，零死約包袱": "✓ Daily flex rental by actual cartons/pallets; zero lease lock-in", "✓ 專人專車上門派送收箱，免去奔波迷你倉煩惱": "✓ Door-to-door delivery & pickup by dedicated fleet, ending mini-storage hassles", "2至3年固定死約，淡季空倉照付高額租金水電": "2-3 year rigid leases; paying high rent and utilities during low seasons", "單量小無法爭取折扣，需親自送貨到自提點排隊": "Low volume means no discount; queueing at pickup stations in person", "🕒 星期一至五 09:00 - 18:00": "🕒 Monday - Friday 09:00 - 18:00", "兼職流動率高，大促爆單親友通宵包貨易出錯": "High turnover of temp staff; late-night packing rushes lead to errors", "✓ 專業恆溫寵物糧倉儲與嚴格批次效期控管": "✓ Climate-Controlled pet food warehousing & strict expiry date management", "深受眾多知名國際時尚及零售品牌長期信賴": "Trusted Long-Term by World-Renowned Fashion & Retail Brands", "以集團級硬實力，支撐你的每一次業務爆發": "Empowering Your Business Surges with Enterprise Infrastructure", "✓ 靈活支援微型電商寄賣庫存與快遞分撥": "✓ Flexible micro-warehousing, consignment stock, and courier dispatch", "中小網店專道 • 決策快 / 零負擔": "Boutique eCommerce • Agile & Burden-Free", "自租工廈 vs FLS 智慧物流對比": "Self-Leased Industrial Space vs. FLS Smart Logistics", "💬 透過 WhatsApp 即時諮詢": "💬 Chat via WhatsApp Now", "旗下品牌 ｜ 連接多元市場的創新服務": "Our Brands | Connecting Diverse Markets with Innovative Logistics", "訪問 Fenix Pet 官網 ↗": "Visit Fenix Pet Website ↗", "語言選擇 / Language:": "Select Language:", "FENIX GROUP 強大後盾": "Strong Backing from FENIX GROUP", "新世代電商 Fulfilment": "Next-Gen eCommerce Fulfillment", "準備好升級您的品牌倉配體驗了嗎？": "Ready to Upgrade Your Brand's Logistics Experience?", "Fenix Pet": "Fenix Pet", "小威 & 小黃 (隨頁解密內幕)": "Siu Wai & Siu Wong (Behind the Scenes)", "葵涌達利總部與深圳大灣區雙樞紐": "Mai Luen Headquarters & Shenzhen GBA Hubs", "Google Play App": "Google Play App", "30年 國際品牌零售倉配經驗": "30+ Years Enterprise Retail 3PL Experience", "24/7 CCTV 防盜監控": "24/7 CCTV Security", "八大核心物流與企業全方位支援": "Eight Core Logistics & Enterprise Support Capabilities", "告別死約束縛，用幾多算幾多": "Say Goodbye to Fixed Leases — Pay Only for What You Use", "諮詢企業 3PL 合作 →": "Consult Enterprise 3PL →", "電商 Fulfilment": "eCommerce Fulfillment", "中小網店，同樣輕鬆擁有。": "Accessible for Growing eCommerce Brands.", "06. 貨倉 ERP 庫存管理系統": "06. Warehouse ERP Stock System", "威黃物流服務有限公司方案": "FLS Smart Logistics Solution", "貨倉 ERP 查貨系統 ↗": "Warehouse ERP Online Tracking ↗", "大公司級數的倉配支援。": "Enterprise-Grade Fulfillment Support.", "中小網店按日計租零死約": "Daily Flex Rental · Zero Lock-In", "兩種客群，一套卓越標準": "Two Client Portfolios, One Standard of Excellence", "WhatsApp 諮詢": "WhatsApp Inquiry", "專屬 WhatsApp": "Dedicated WhatsApp", "服務以誠 · 真摰真心": "Service with Integrity · Dedication from Heart", "威黃物流服務有限公司": "Fenix Logistics Services Ltd.", "葵涌及深圳雙核心樞紐": "Dual Hubs in Kwai Chung & Shenzhen", "01. 智能倉存服務": "01. Smart Warehousing", "02. 電商履約代發": "02. eCommerce Fulfillment", "03. 定制增值服務": "03. Value-Added Services (VAS)", "04. 專業運輸派送": "04. Professional Delivery", "05. 門市庫存及 POS 數據管理": "05. Cross-Border Freight", "07. 電腦支援服務": "07. I.T. & Computer Support", "獲取網店方案報價 →": "Get eCommerce Quote →", "自行租工廈或親自包裝": "Self-Leasing / DIY Fulfillment", "立即獲取專屬報價 →": "Get Tailored Quote →", "Carry Kuma": "Carry Kuma", "出貨與庫存極致精準": "Extreme Precision in Fulfillment & Stock", "品牌大型供應鏈託管": "Enterprise Supply Chain Management", "⚙️ 系統管理後台": "⚙️ Admin Portal", "FLS 智慧導覽員": "FLS Smart Tour Guide", "立即獲取報價 →": "Get Instant Quote →", "試算網店倉租 →": "Calculate Storage Rent →", "大促訂單從容應對": "Handling Massive Order Surges with Ease", "08. 船務支援": "08. Shipping & Freight Forwarding", "🔄 重講當前頁段": "🔄 Replay Section", "企劃匯報與評審": "Proposal Deck & Review", "倉租成本與彈性": "Rental Cost & Flexibility", "人手管理與包裝": "Staffing & Packing", "快遞成本與時效": "Courier Cost & Speed", "庫存數據透明度": "Inventory Transparency", "客製化增值服務": "Value-Added Services (VAS)", "香港本地專業運輸派送": "Local Professional Delivery", "專屬導覽員小威": "Tour Guide Siu Wai", "探索智慧物流": "Explore Smart Logistics", "雙城基地網絡": "Dual-City Hub Network", "恆溫冷氣溫控": "Climate-Controlled", "消防滅火系統": "Fire Suppression", "重型裝卸貨台": "Heavy Loading Docks", "彈性計費革命": "Flexible Billing Revolution", "每日處理動能": "Daily Processing Capacity", "自研科技支撐": "Proprietary Tech Power", "集團信譽保障": "Group Heritage Guarantee", "營運關鍵指標": "Key Metric", "寵物精品經銷": "Premium Pet Distribution", "智慧上門存儲": "Smart On-Demand Storage", "官方網站 ↗": "Official Website ↗", "核心物流服務": "Core Logistics Services", "智能倉存服務": "Smart Warehousing", "切換語音朗讀": "Toggle Voice Readout", "📍 準備導覽": "📍 Ready for Tour", "試算報價 →": "Instant Quote →", "點擊即時解密": "Click for Insights", "新聞及媒體": "News & Media", "隱私與免責": "Privacy & Disclaimer", "收起導覽框": "Minimize Tour Box", "威黃物流": "Fenix Logistics Services", "關於威黃": "About FLS", "服務範疇": "Services", "旗下品牌": "Our Brands", "物流網誌": "Logistics Blog", "聯絡我們": "Contact Us", "企劃匯報": "Proposal Deck", "免責聲明": "Disclaimer", "立即報價": "Instant Quote", "概念影片": "Concept Video", "概念圖片": "Concept Image", "按日計租": "Daily Flex Rental", "快速導航": "Quick Links", "總部聯絡": "Headquarters Contact", "版權所有": "All Rights Reserved", "3D高清": "3D Smooth", "粗像素": "Pixel Art", "網誌": "Blog"};

  function convertToSimplified(text) {
    if (!text || typeof text !== 'string') return text;
    for (let i = 0; i < CANTONESE_PHRASES.length; i++) {
      const p = CANTONESE_PHRASES[i];
      if (text.indexOf(p[0]) !== -1) {
        text = text.split(p[0]).join(p[1]);
      }
    }
    let res = '';
    for (let i = 0; i < text.length; i++) {
      const ch = text[i];
      res += T2S_MAP[ch] || ch;
    }
    return res;
  }

  function convertToEnglish(text) {
    if (!text || typeof text !== 'string') return text;
    const trimmed = text.trim();
    if (EN_PHRASES[trimmed]) {
      return text.replace(trimmed, EN_PHRASES[trimmed]);
    }
    let cur = text;
    for (const [tc, en] of Object.entries(EN_PHRASES)) {
      if (cur.indexOf(tc) !== -1) {
        cur = cur.split(tc).join(en);
      }
    }
    return cur;
  }

  function walkAndTranslateNodes(root, lang) {
    const walker = document.createTreeWalker(
      root || document.body,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode: function(node) {
          if (!node || !node.parentElement) return NodeFilter.FILTER_REJECT;
          const tag = node.parentElement.tagName.toLowerCase();
          if (tag === 'script' || tag === 'style' || tag === 'svg' || tag === 'noscript' || tag === 'code') {
            return NodeFilter.FILTER_REJECT;
          }
          if (node.parentElement.closest('.no-translate')) {
            return NodeFilter.FILTER_REJECT;
          }
          if (!node.nodeValue || !node.nodeValue.trim()) {
            return NodeFilter.FILTER_REJECT;
          }
          return NodeFilter.FILTER_ACCEPT;
        }
      }
    );

    const nodes = [];
    while (walker.nextNode()) {
      nodes.push(walker.currentNode);
    }

    nodes.forEach(node => {
      if (node._origTc === undefined) {
        node._origTc = node.nodeValue;
      }
      if (lang === 'zh-Hant') {
        node.nodeValue = node._origTc;
      } else if (lang === 'zh-Hans') {
        node.nodeValue = convertToSimplified(node._origTc);
      } else if (lang === 'en') {
        node.nodeValue = convertToEnglish(node._origTc);
      }
    });

    // Also translate attributes (placeholder, title, alt)
    const attrEls = (root || document.body).querySelectorAll('[placeholder], [title], [alt]');
    attrEls.forEach(el => {
      if (el.placeholder) {
        if (el._origPlaceholder === undefined) el._origPlaceholder = el.placeholder;
        if (lang === 'zh-Hant') el.placeholder = el._origPlaceholder;
        else if (lang === 'zh-Hans') el.placeholder = convertToSimplified(el._origPlaceholder);
        else if (lang === 'en') el.placeholder = convertToEnglish(el._origPlaceholder);
      }
      if (el.title) {
        if (el._origTitle === undefined) el._origTitle = el.title;
        if (lang === 'zh-Hant') el.title = el._origTitle;
        else if (lang === 'zh-Hans') el.title = convertToSimplified(el._origTitle);
        else if (lang === 'en') el.title = convertToEnglish(el._origTitle);
      }
      if (el.alt) {
        if (el._origAlt === undefined) el._origAlt = el.alt;
        if (lang === 'zh-Hant') el.alt = el._origAlt;
        else if (lang === 'zh-Hans') el.alt = convertToSimplified(el._origAlt);
        else if (lang === 'en') el.alt = convertToEnglish(el._origAlt);
      }
    });

    // Translate document title
    if (window._origDocTitle === undefined) window._origDocTitle = document.title;
    if (lang === 'zh-Hant') document.title = window._origDocTitle;
    else if (lang === 'zh-Hans') document.title = convertToSimplified(window._origDocTitle);
    else if (lang === 'en') document.title = convertToEnglish(window._origDocTitle);
  }

  // F. 多語言切換處理 (整合全站即時翻譯與記憶)
  const langBtns = document.querySelectorAll(".lang-btn");
  function setLanguage(lang) {
    if (!lang) lang = "zh-Hant";
    const dict = I18N_DICT[lang] || I18N_DICT["zh-Hant"];

    // 1. 先處理標註有 data-i18n 的固定結構項目
    document.querySelectorAll("[data-i18n]").forEach(el => {
      const key = el.dataset.i18n;
      if (dict[key]) el.textContent = dict[key];
    });

    // 2. 進行全站深度 DOM 文字節點即時翻譯 (支援 100% 繁、簡、英轉換)
    walkAndTranslateNodes(document.body, lang);

    // 3. 更新所有語言切換按鈕狀態 (包含頂欄與手機漢堡選單內)
    document.querySelectorAll(".lang-btn").forEach(btn => {
      btn.classList.toggle("is-active", btn.dataset.lang === lang);
    });

    // 4. 設定 HTML lang 屬性
    document.documentElement.setAttribute("lang", lang);

    // 5. 跨頁無縫保存
    safeStorage.setItem("fls_site_lang", lang);

    // 6. 廣播自訂事件通知導覽機械人等其他元件
    window.dispatchEvent(new CustomEvent("fls:languagechange", { detail: { lang: lang } }));
  }

  document.querySelectorAll(".lang-btn").forEach(btn => {
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
