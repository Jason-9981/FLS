
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
  // 完整全站中英翻譯詞庫 (涵蓋所有頁面、表單、按鈕、提示與多倉規格)
  const EN_PHRASES = {
  "在現今資訊發達的時代，資訊科技、資訊管理相關技術、電腦系統支援服務已經是每家企業不可缺少的一部份，但往往為企業帶來難以估計的負擔，而本公司提供一站式的 I.T. 服務，為簡化客戶對資訊科技的管理，將資源集中在公司核心的業務上，提高回報及營運成效，達到更好的投資回報。": "In today's information era, IT, information management, and computer support are essential for every enterprise, yet often create heavy operational overhead. We offer one-stop IT services to streamline client tech management, allowing resources to focus on core business, enhancing operational efficiency and achieving superior ROI.",
  "本網站內所顯示之商標（包括 FLS、FENIX GROUP、Fenix Pet、Carry Kuma）及合作客戶品牌商標（如 ANTEPRIMA、Marimekko、ATSURO TAYAMA 等）之產權均屬相應權利人所有，未經授權不得擅自轉載、抄襲或作商業用途。": "All trademarks displayed on this site (including FLS, FENIX GROUP, Fenix Pet, Carry Kuma) and partner brand trademarks (such as ANTEPRIMA, Marimekko, ATSURO TAYAMA) are the property of their respective owners. Unauthorized reproduction, copying, or commercial use is strictly prohibited.",
  "擺脫舊版沉悶厚重的工業網站版面。左上角公司 Logo 放大 50% 展現大器集團形象，搭配純白極簡底色、高通透毛玻璃（Glassmorphism）、微光影 Bento Grid，完美匹配 ANTEPRIMA、Marimekko 等國際時尚品牌的尊尚格調。": "Departing from the heavy industrial look of the old site. The company logo is enlarged by 50% for prestige, paired with pure white minimalism, glassmorphism, and subtle bento grid lighting, perfectly matching luxury brands like ANTEPRIMA and Marimekko.",
  "核心成員。母公司三黃集團自 1970 年在香港創立，深耕亞太高端消費市場逾 50 年，業務橫跨高端時裝零售（Sidefame 華鐙）、精品生活超市（city'super）及專業第三方物流（FLS），為 FLS 注入深厚的國際化視野與極致的品質追求。": "Core Group Member. Founded in Hong Kong in 1970, parent company FENIX GROUP has led APAC luxury markets for over 50 years, spanning luxury retail (Sidefame), lifestyle supermarkets (city'super), and third-party logistics (FLS), infusing global vision and quality excellence.",
  "本網站所載之一切文字、數據、報價試算與圖片僅供參考之用。本公司將盡力確保內容之準確性，但對於任何因依賴本網站資訊而產生之直接或間接損失，本公司不承擔任何法律責任。各項物流服務之實際費用及條款，均以本公司簽發之正式報價單或合約為準。": "All text, data, quote estimates, and images on this site are for reference only. While we endeavor to ensure accuracy, we accept no liability for any direct or indirect loss resulting from reliance on site information. Actual logistics rates and terms are subject to formal quotations or contracts issued by FLS.",
  "全站圖片統一歸檔於 images/ 目錄，最右側增設 5 款色系即時切換，並完整整合「港深 6 大專業倉儲」實體資料與實景照片，零伺服器維護成本，管理員透過可視化儀表板即可增修倉庫、文章與資訊，直接導出配置即完成發布。": "All site assets unified under images/, offering 5 instant theme palettes, integrating 6 HK-Shenzhen logistics hubs with physical photography. Zero server maintenance cost; administrators can manage hubs, articles, and content via visual CMS.",
  "30 年來，我們長期為 ANTEPRIMA、Marimekko、ATSURO TAYAMA 等國際奢侈品與時尚零售品牌管理極其嚴格的門市補貨及進出口物流，將「頂級零售品質」深植於每一項操作流程中。": "For 30 years, we have managed rigorous store replenishment and import/export logistics for premier global fashion brands such as ANTEPRIMA, Marimekko, and ATSURO TAYAMA, embedding luxury retail quality into every workflow.",
  "舊版倉庫資料寫死，改動極繁瑣。新版採用數據驅動架構，預留多個倉位插槽（葵涌達利中心(501、502A-B、502C-D)、荃灣永得利(7樓、11樓)及深圳龍崗港華倉），後台隨時一鍵新增或調整。": "Replacing hardcoded warehouse data with a data-driven architecture. Modular slots for Mai Luen (501, 502A-B, 502C-D), Ever Gain (7/F, 11/F), and Shenzhen Longgang enable instant one-click admin updates.",
  "專屬零售庫存管理團隊，現時專責管理 Sidefame 旗下多個國際知名時裝品牌之龐大庫存資料。設有專屬同事獨立負責各自品牌，透過私有網絡無縫連繫全港門市專櫃，提供高頻交易上傳與精準業務報表。": "Dedicated retail inventory team managing stock data for international fashion brands under Sidefame. Dedicated specialists oversee individual brands, linking mall stores via private network to deliver frequent transaction syncing and custom reporting.",
  "專為各倉庫多元貨主及散客打造的企業級倉儲管理系統。歷時逾一年深度定制研發，支援 24 小時線上登入，讓不同散客隨時隨地即時掌握存倉貨品之最新庫存結餘、批次出入庫明細與出貨單證。": "Enterprise warehouse management system developed over a year for diverse warehouse clients. Supports 24/7 online access, giving clients real-time visibility into stock balances, batch in/out records, and dispatch documentation anytime.",
  "精準直擊痛點：針對中小電商突出「按日計租、當日揀貨發貨、零死約」；針對企業大客彰顯「30 年信譽、FENIX GROUP 雄厚實力、12 萬呎港深基地、貨倉 ERP 系統」。": "Targeting core pain points: highlighting daily flex rental, same-day fulfillment, and zero lock-in for eCommerce stores; while showcasing 30-year heritage, FENIX GROUP strength, 120,000 sq.ft. hubs, and Warehouse ERP for enterprise clients.",
  "本公司能提供全面的船務支援服務，包括文件製作、代理專業報關、申請出入口證、產地證及熏蒸證、與貨代聯繫安排收發貨物及代訂進出口倉位等事宜，為客戶大大節省處理船務有關方面的時間。": "We provide comprehensive shipping support, including documentation, professional customs clearance, import/export licenses, Certificates of Origin, fumigation certificates, freight forwarder coordination, and cargo booking, saving clients significant administrative time.",
  "正式將官方「電腦支援服務」（一站式企業 IT 軟硬體維護）與「船務支援」（專業報關、產地來源證及熏蒸證代辦）升級納入官網核心架構，彰顯 I&TD 技術研發與全鏈條通關硬實力。": "Officially elevating Computer Support (one-stop enterprise IT maintenance) and Shipping Support (customs, origin & fumigation certificates) into core capabilities, demonstrating I&TD technological research and full-chain trade strength.",
  "在 FLS，我們堅信物流不只是貨物的搬運，更是承載創業者心血與顧客期待的信任紐帶。無論您是每月出貨數十件的小型手作店，抑或每日數千單的跨國企業，我們皆以誠相待，竭盡全力。": "At FLS, we believe logistics is more than moving cargo—it is a bond of trust carrying entrepreneurs' dedication and customers' expectations. Whether you ship dozens of handmade items monthly or thousands of orders daily, we serve with utmost sincerity.",
  "網誌升級為 Apple News 雜誌卡片排版，搭配高清圖文與精準標籤，佈局「網店倉存、香港 fulfilment、代寄貨」等高意向搜尋關鍵詞，源源不絕引入精準客流。": "Insights blog upgraded to an Apple News magazine card layout with HD visuals, category filters, and targeted keywords like 'eCommerce storage, Hong Kong fulfillment, drop shipping' to drive high-intent organic traffic.",
  "廢除舊版易失效的 mailto 機制，分流為「30秒快速諮詢」與「3步智能報價計算器」，並原生整合 WhatsApp 一鍵代入對話功能，大幅提升業務成交線索獲取率。": "Replacing fragile mailto links with dual channels: '30-Second Quick Inquiry' and '3-Step Smart Quote', natively integrated with WhatsApp pre-filled messaging to boost lead conversion.",
  "為支援本地新創網店與中小電商賣家，FLS 全面打破傳統倉庫簽署數年死約的陳規，推出零門檻按日計租與自動化揀貨包裝代發服務，以 30 年專業基建扶持電商生態蓬勃發展。": "To support local startups and SME eCommerce sellers, FLS breaks rigid multi-year leases with zero-barrier daily flex rental and automated pick & pack fulfillment, empowering the digital economy with 30 years of premier infrastructure.",
  "首頁 Hero 導入極簡純白（片一）與型格夜景（片二）無縫循環短片，全面更替重複圖片，港深六大倉儲樞紐各自配置專屬高解析度實景照，徹底告別傳統工業網站的沉悶感。": "Hero section features seamless looping video, replacing repeated imagery, with dedicated HD photography for each of our 6 HK-Shenzhen logistics hubs, transcending the dullness of traditional industrial websites.",
  "專為香港品牌與新一代電商打造。提供靈活按日計租、一站式揀貨包裝、門市POS庫存管理、香港本地車隊派送與貨倉ERP查貨系統，讓你專注品牌擴張，其餘繁瑣交給我們。": "Tailored for Hong Kong brands and modern eCommerce. Offering daily flex rental, seamless fulfillment, retail POS stock management, local fleet delivery, and Warehouse ERP, letting you focus on scaling while we handle the rest.",
  "與 Waylun Pet Care 攜手合作，成功將多個歐美日本頂級寵物糧與健康護理品牌引入香港及澳門市場，並依託 FLS 恆溫冷氣物流網絡實現高效週轉。": "In partnership with Waylun Pet Care, bringing premier European, American, and Japanese pet nutrition brands to HK & Macau markets, backed by FLS climate-controlled logistics.",
  "威黃物流服務有限公司自 1994 年成立，深耕香港及大灣區逾 30 年。以三黃集團堅實後盾，提供企業級倉配、本地專櫃快運與新一代電商智能履約方案。": "Established in 1994, Fenix Logistic Services Limited has served Hong Kong and the GBA for over 30 years, backed by Fenix Group.",
  "專為香港品牌與新一代電商打造。提供靈活按日計租、一站式揀貨包裝、門市庫存及 POS 數據管理與智能化庫存對接，讓你專注品牌擴張，其餘繁瑣交給我們。": "Empowering Hong Kong retail brands and modern e-commerce. We provide daily flex rental, seamless pick & pack, cross-border logistics, and automated system sync so you can focus on brand growth.",
  "本網站可能包含連往第三方網站或外部系統（如 貨倉 ERP 查貨系統、母公司官網）之連結。本公司對第三方網站之內容、私隱政策或營運狀況概不負責。": "This site may contain links to third-party sites or external systems (e.g., Warehouse ERP, parent company website). FLS is not responsible for third-party content, privacy policies, or operations.",
  "解決傳統表格跳脫率高的問題。左側提供「30秒快速查詢」，右側提供「3步智能報價計算器」，提交後支援自動轉換為格式化 WhatsApp 訊息。": "Addressing high bounce rates on conventional forms: offering '30-Second Quick Inquiry' on the left and '3-Step Smart Quote' on the right, with auto-formatted WhatsApp messaging upon submission.",
  "大氣俐落的 Hero 展示、品牌口號「集團經營 · 專業首選」、國際名牌客戶無縫走馬燈、Bento 數據矩陣、雙軌解決方案卡片與痛點對比表。": "Clean Hero display, brand motto 'Group Heritage · Professional Choice', client marquee, Bento data matrix, dual-solution cards, and pain-point comparison table.",
  "大公司級數的倉配與數據支援實力。從智能倉存、電商代發、門市庫存及 POS 數據管理，到自設香港本地車隊與電腦技術支援，打造一站式閉環服務。": "Enterprise-grade warehousing and data capabilities. From smart storage, eCommerce fulfillment, and store POS stock sync, to dedicated local fleet and IT support, delivering a full closed-loop solution.",
  "比照 Apple News 雜誌規格重新打造。包含 16:9 高清配圖、分類標籤切換按鈕、閱讀時間預估與吸引點擊的電商物流乾貨長尾詞文章。": "Redesigned to Apple News magazine standards, featuring 16:9 HD imagery, category filter chips, read-time estimates, and high-value long-tail logistics articles.",
  "專為連鎖時裝、高價精品與跨國企業打造。提供多門市點對點補貨、香港本地專櫃冷氣運輸與門市庫存管理、產地來源證申報及系統深度對接。": "Crafted for fashion chains, luxury boutiques, and enterprises. Offering store-to-store replenishment, temperature-controlled transit, and deep ERP integration.",
  "配備恆溫冷氣倉、高位重型貨架與專用吊掛成衣區。地處葵青物流咽喉，緊鄰葵涌貨櫃碼頭與 3 號幹線，自設車隊每日穿梭全港商場專櫃。": "Equipped with climate-controlled storage, heavy-duty racking, and dedicated GOH hanging garment areas in Kwai Tsing, with dedicated fleet servicing mall stores daily.",
  "總面積逾 120,000 平方呎，地處葵青物流要衝及大灣區核心，提供常溫、恆溫冷氣、專業吊掛成衣及高位貨架等多元化倉存支援。": "Over 120,000 sq.ft. strategically located in Kwai Tsing and GBA, offering ambient, climate-controlled, GOH hanging garment, and high-rack storage.",
  "展示 6 大核心物流能力，並獨家打造「動態多倉儲網絡卡片」，已預設達利總部、深圳大灣區、葵涌服裝倉及新界樞紐，支援隨時擴充。": "Showcasing 6 core logistics capabilities with dynamic multi-warehouse network cards, pre-configured for Mai Luen HQ, Shenzhen GBA, and NT hubs, ready for expansion.",
  "純白極簡、Bento Grid 微光影、毛玻璃高通透導航。完美匹配 ANTEPRIMA、Marimekko 等國際名牌調性。": "Pure white minimalism, subtle Bento grid lighting, and translucent glassmorphism navigation, matching luxury brands like ANTEPRIMA and Marimekko.",
  "：位於 FLS 機房之專屬 POS Server，透過加密 Private Network 實時連繫各門市 POS 系統": ": Dedicated POS Server in FLS data room linking store POS systems via encrypted Private Network in real time",
  "自設香港本地專業運輸車隊，深耕全港各大商場專櫃補貨與急件配送，提供拖櫃拆櫃、夾車夾櫃、機場碼頭提貨及 B2C 宅配直達。": "Dedicated local fleet specializing in shopping mall replenishment and express dispatch, offering container drayage, devanning, airport/port pickups, and B2C home delivery.",
  "中小網店的專屬管家。從訂單自動抓取、精準揀貨（Pick & Pack）、客製化包裝禮盒到即日發貨，讓你輕鬆應對促銷爆單。": "Dedicated partner for growing eCommerce. From automated order syncing and precision pick & pack, to custom gift boxing and same-day dispatch.",
  "專為連鎖時裝、高價精品與跨國企業打造。提供全港多門市點對點補貨、門市POS庫存高頻同步、產地來源證申報及深度系統對接。": "Crafted for fashion chains, luxury boutiques, and global enterprises. Providing point-to-point store replenishment, high-frequency POS stock sync, and customs declarations.",
  "歡迎瀏覽威黃物流服務有限公司（以下簡稱「本公司」或「FLS」）之官方網站。在您使用本網站前，請詳細閱讀以下各項條款：": "Welcome to the official website of Fenix Logistic Services Limited ('FLS' or 'the Company'). Please review the following terms carefully before using this site:",
  "配備恆溫冷氣倉、高位重型貨架與專用吊掛成衣區。地處葵青物流咽喉，緊鄰葵涌貨櫃碼頭與主要幹線，跨境運輸每日準時往返。": "Equipped with climate-controlled cold air storage, heavy pallet racks, and dedicated garment-on-hanger areas. Prime Kwai Tsing location next to container terminals with daily cross-border transit.",
  "Fenix Pet 為 FLS 公司旗下專營寵物用品銷售業務的子公司，致力代理世界各地著名優質寵物用品與食品品牌。": "Fenix Pet is an FLS subsidiary dedicated to distributing world-renowned premium pet food, accessories, and wellness products.",
  "目標：徹底顛覆傳統物流官網形象，打造結合「Apple 頂級純白質感」與「最強 SEO 流量轉化」的集團級旗艦入口。": "Objective: Redefine the logistics web experience, combining Apple-inspired pure white aesthetics with high-conversion SEO as an enterprise gateway.",
  "FENIX GROUP HOLDINGS LTD 業務橫跨頂級零售、品牌代理與物流，逾 30 年外資信譽卓越。": "FENIX GROUP HOLDINGS LTD spans luxury fashion retail, brand distribution, and logistics with over 30 years of impeccable heritage.",
  "不再需要自己下班包貨、排隊寄快遞。將貨品存入 FLS，我們為你自動接單、精美包裝並代寄出貨，助你專注市場行銷。": "No more packing late at night or queuing at couriers. Store your goods at FLS: we automate orders, pack delicately, and dispatch directly so you can focus on sales.",
  "我們已為您打造 4 款截然不同視覺調性與市場定位的完整網頁，請選出您認為最符合集團發展與業務轉化的官方主風格：": "We have created 4 distinct visual directions and market positions. Please select the primary official theme that best aligns with group growth and conversion:",
  "本公司保留隨時修改本條款內容之權利，恕不另行個別通知。本條款受中華人民共和國香港特別行政區法律管轄並依其解釋。": "The Company reserves the right to revise these terms without prior notice. These terms are governed by the laws of the Hong Kong Special Administrative Region.",
  "結合智慧上門派收存儲箱與微型電商寄賣轉運功能，使用者可於手機隨時一鍵預約存取，兼顧家庭換季收納與網店靈活備貨。": "Combining smart on-demand storage box delivery/collection with micro-eCommerce consignment, allowing app-based booking for household seasonal storage and business inventory.",
  "自 1994 年深耕香港，我們將 30 年累積的大型供應鏈基建，轉化為每一家中小網店都能即開即用的彈性資源。": "Rooted in Hong Kong since 1994, we convert 30 years of premier supply-chain infrastructure into ready-to-use scalable resources for every online brand.",
  "源於 1994 年，我們以守護每一個品牌的信任為使命，為跨國零售精品及香港新世代電商提供最穩健的供應鏈基石。": "Established in 1994, our mission is to safeguard brand trust, providing a solid supply chain foundation for international luxury retail and modern eCommerce.",
  "賽博深空黑、電光藍與霓虹青、HUD 數據儀表板。突出貨倉 ERP 雲端查貨系統與 100% 條碼流防呆出貨。": "Cyber dark mode, electric cyan accents, and HUD dashboard, emphasizing Warehouse ERP cloud tracking and 100% barcode-verified dispatch.",
  "母公司三黃集團自 1970 年深耕亞太逾 50 年，業務橫跨頂級零售、品牌代理與物流，半世紀外資信譽卓越。": "Parent company FENIX GROUP has led APAC retail for over 50 years since 1970, spanning luxury retail, distribution, and logistics with stellar heritage.",
  "三黃集團於 1994 年成立威黃物流（FLS），率先引入日本先進 3PL 物流理念，深耕物流逾 30 年。": "FENIX GROUP founded FLS in 1994, introducing advanced Japanese 3PL logistics principles with over 30 years of operational depth.",
  "滿足國際時尚與零售品牌嚴格上架標準。提供商品檢驗、吊牌更換、繁體中文化標籤打印、禮盒絲帶組裝與套裝打包。": "Meeting stringent luxury fashion retail standards. Offering QA/QC inspection, retagging, Traditional Chinese labeling, ribbon wrapping, and gift kitting.",
  "：每隔 2 至 3 分鐘自動上傳最新交易記錄（Transaction），客戶管理層隨時掌握各店即時營業額": ": Automatically syncing transactions every 2-3 minutes, giving client management real-time turnover visibility across all locations",
  "賽博深空黑、電光藍與霓虹青、HUD 數據儀表板，突出歷時逾一年定制研發的貨倉 ERP 系統與物聯網樞紐。": "Cyber dark mode, electric cyan accents, and HUD dashboard, highlighting Warehouse ERP and IoT logistics hubs developed over a year.",
  "Carry Kuma 專為家庭、個人及微小型電商提供上門儲存箱及靈活倉配服務，隸屬三黃集團與威黃物流。": "Carry Kuma delivers door-to-door storage box services and agile fulfillment for households, individuals, and boutique eCommerce brands.",
  "我們了解每家網店與品牌的供應鏈需求皆獨一無二。選擇下方適合您的途徑，讓我們為您快速測算最省成本的方案：": "We understand every eCommerce brand's supply chain is unique. Choose an option below to calculate your most cost-effective solution:",
  "🎨 分組二：官方主題色系偏好 (Grouping 2: Preferred Color Tone) *": "🎨 Grouping 2: Preferred Official Color Palette *",
  "彈性空間劃分，支援散件、整板、層架到高位貨架儲存。採用標準化條碼管理，即時掌握每件貨物位置與批次狀態。": "Flexible space allocation supporting pieces, full pallets, shelving, and high-bay racking with standardized barcode tracking.",
  "專屬庫存部以私有網絡每 2–3 分鐘實時連繫全港門市 POS，為客戶即時掌握營業額並製作客製化日報表。": "Dedicated inventory department connecting store POS systems every 2-3 minutes over private network, tracking sales and generating tailored daily reports.",
  "結合 30 年實體基建與現代數字化賦能，為品牌打造從倉儲、運輸、IT電腦支援到國際船務的一條龍閉環：": "Blending 30 years of physical infrastructure with digital empowerment to build a closed-loop ecosystem from warehousing, transport, and IT support to international freight:",
  "深邃海軍藍配香檳金、襯線排版、尊貴沉穩，完美彰顯 FENIX GROUP 30 年頂奢時尚倉配實力。": "Deep navy blue with champagne gold, serif typography, and dignified elegance, showcasing FENIX GROUP's 30-year luxury fashion logistics heritage.",
  "支援「一鍵下載更新檔 (site-data.js)」，檔案上傳覆蓋即可生效，非技術人員也能輕鬆打理！": "Supports one-click configuration export (site-data.js); simply overwrite the file to update the site without coding!",
  "例如：針對風格 A 與風格 B 的取捨、首頁 Slogan 調整、多倉照片細節或上線優先順序等...": "e.g., Feedback on Style A vs B, homepage slogan refinements, warehouse photo details, or rollout priority...",
  "⭐ 分組三：綜合評分與管理層指導 (Grouping 3: Scoring & Guidance)": "⭐ Grouping 3: Overall Rating & Management Guidance",
  "自設香港本地專業運輸車隊，熟悉各大商場專櫃補貨與急送，支援拖櫃拆櫃、碼頭機場提貨及 B2C 宅配。": "Dedicated local fleet experienced in mall store replenishment and express dispatch, supporting container drayage, airport/port pickups, and B2C home delivery.",
  "例如：針對風格 A 與風格 B 的取捨、首頁 Slogan 調整、多倉照片細節或後續推進排程...": "e.g., Thoughts on Style A vs B, homepage slogan refinements, warehouse photo details, or rollout schedule...",
  "📌 分組一：整體設計大風格偏好 (Grouping 1: Core Design Style) *": "📌 Grouping 1: Overall Design Style Preference *",
  "主頁 - 威黃物流服務有限公司 | 30年香港倉儲物流 · 電商 Fulfilment 按日計租": "Home - Fenix Logistic Services Limited | 30 Years Hong Kong 3PL Warehousing · Daily Flex eCommerce Fulfillment",
  "：由庫存部專人依品牌特定要求，每日製作並電郵呈交銷售及庫存分析日報（Daily Reports）": ": Dedicated inventory specialists compile and email customized daily sales and stock reports per brand specifications",
  "我們的供應鏈顧問提供免費 1 對 1 諮詢，為您精準拆解死約工廈與第三方按日計租的實際費用差距。": "Our supply chain consultants offer free 1-on-1 consultations, breaking down the exact cost difference between rigid industrial leases and 3PL daily flex rental.",
  "匯聚 30 年實戰經驗，為香港電商賣家、初創網店與零售品牌提供最具深度的倉配成本分析與營運指南。": "Combining 30 years of hands-on expertise to deliver in-depth fulfillment cost analyses and operational guides for HK sellers, startups, and brands.",
  "清新翠綠配極速亮橙、活潑圓角標章、親和力強。專攻中小網店「按日計租、當日即發、零死約」痛點對比。": "Fresh green with vibrant orange, friendly badges, addressing SME online store pain points: daily flex rental, same-day dispatch, and zero lock-in leases.",
  "針對三黃集團品牌基因與多元客群，特別精心打造 4 款截然不同視覺調性的完整風格，請點擊親身體驗：": "Crafted 4 distinct visual styles reflecting FENIX GROUP's heritage and diverse client bases. Click below to experience:",
  "深邃海軍藍配香檳金、襯線大器排版、尊貴沉穩。突出 30 年三黃集團外資實力與高級時裝倉配權威。": "Deep navy blue with champagne gold and serif typography, showcasing 30-year FENIX GROUP multinational prestige and luxury fashion logistics authority.",
  "無論您是迅速崛起的獨立網店，或是需要跨國供應鏈的品牌集團，FLS 皆能量身定制最優履約路徑：": "Whether you are a fast-growing boutique eCommerce store or a multinational brand group, FLS tailors the optimal fulfillment pathway:",
  "透過專業子公司與新世代品牌延伸，我們將集團物流優勢深耕至寵物用品代理與智慧上門生活存儲領域。": "Extending our 30-year logistics excellence into specialized premium pet care distribution and smart on-demand door-to-door storage.",
  "歷時逾一年定制研發，專為倉庫多元貨主及散客提供 24 小時線上即時查貨、庫存結餘與進出明細。": "Developed over a year specifically for warehouse clients, providing 24/7 online real-time inventory visibility, stock balances, and inbound/outbound records.",
  "您的指導是團隊持續精進的關鍵。請花 1 分鐘給予評分及具體建議，我們將即時納入後續微調：": "Your leadership feedback is essential. Please take 1 minute to share ratings and suggestions for our upcoming refinements:",
  "純白底色、Bento Grid 微光影、毛玻璃導航、清爽高通透，極致現代化集團旗艦質感。": "Pure white background, subtle Bento grid lighting, and glassmorphism navigation, presenting an ultra-modern group flagship aesthetic.",
  "配備客製化貨倉 ERP 雲端查貨系統與條碼雙重防呆驗證，庫存實時同步，徹底杜絕發錯貨。": "Powered by custom Warehouse ERP cloud tracking and double barcode proofing. Real-time stock synchronization eliminates shipping errors.",
  "清新翠綠配極速亮橙、親和力強、專攻中小網店「按日計租、當日即發、零死約」痛點效益對比。": "Fresh green with vibrant orange and strong approachability, spotlighting daily flex rental, same-day dispatch, and zero-lease benefits.",
  "只需 1 分鐘填寫需求，我們的資深物流顧問將為您量身定制最具性價比的倉儲及配送方案。": "Take 1 minute to outline your needs. Our logistics consultants will tailor the most cost-effective storage & delivery plan for you.",
  "集團經營 · 專業首選 ｜ 服務靈活 · 智慧之選 ｜ 服務以誠 · 真摰真心": "Group Heritage · Professional Choice | Flexible Solutions · Smart Choice | Service Integrity · Dedication from Heart",
  "可視化管理：隨時增刪改「倉庫據點」、「網誌文章」、「客戶走馬燈」與「公司資訊」": "Visual CMS: Manage 'Warehouse Hubs', 'Blog Articles', 'Client Logos', and 'Corporate Info' with zero coding",
  "淡季不用白繳租金，旺季促銷隨時擴倉。專為電商創業者量身定制的零負擔倉儲模型。": "No wasted rent during low seasons; scale up instantly during flash sales. A burden-free warehousing model tailored for modern entrepreneurs.",
  "透過 3 個簡單步驟提供詳細參數，系統將為您智能匹配最適倉儲規格與出貨運費：": "Provide your parameters in 3 simple steps, and our system will match the optimal storage specs and fulfillment rates:",
  "對接 Shopify / SHOPLINE / HKTVmall 等主流平台": "Direct API integration with Shopify, SHOPLINE, HKTVmall, and major platforms",
  "持續關注 威黃物流服務有限公司的技術創新、服務拓展、戰略合作及媒體最新報導。": "Stay updated on technological innovations, service expansions, strategic partnerships, and press coverage from Fenix Logistic Services Limited.",
  "感謝您的寶貴指導！最新統計數據已即時按分組 (Grouping) 匯總如下：": "Thank you for your valuable guidance! Live aggregated statistics by Grouping are displayed below:",
  "🔐 登入體驗管理後台 (admin.html - 密碼 Fen159) ↗": "🔐 Log In to CMS Admin (admin.html - Password Fen159) ↗",
  "標準化流水線與條碼覆核作業，無論雙11或節日促銷，保證當日訂單當日發出。": "Standardized assembly lines and barcode verification ensure same-day dispatch even during Double 11 and peak shopping seasons.",
  "1. 視覺革命：左上角 Logo 放大 50% ＆ Apple 極致美學": "1. Visual Transformation: Logo Enlarged by 50% & Apple Minimalist Aesthetic",
  "全站內建 5 款質感色調（前 3 款為淺色系），選出您最青睞的配色方案：": "Built-in 5 curated color palettes (top 3 are light themes). Select your preferred color scheme:",
  "Shopify/HKTVmall 對接，99.9% 掃描防呆當日發貨。": "Direct Shopify/HKTVmall integration, 99.9% barcode-verified same-day dispatch.",
  "涵蓋從上游進口、入庫質檢、條碼貼標、電商揀貨到最後一哩交付的完整閉環：": "Comprehensive closed-loop covering upstream import, QA inspection, barcoding, eCommerce fulfillment, and last-mile delivery:",
  "貨倉 ERP 查貨系統 24 小時在線，隨時隨地即時查詢庫存與貨流明細": "Warehouse ERP available 24/7 online for real-time stock balance and shipment tracking anytime, anywhere",
  "滿足日後放置在一般網頁寄存空間且方便修改特性的需求。管理密碼獨立存放於": "Designed for standard web hosting with easy maintenance. Admin password securely managed in ",
  "有初步想法或一般合作詢問？只需留下基本聯絡方式，專員即日與您跟進。": "Have an initial idea or general inquiry? Leave your basic contact info, and our specialists will follow up with you today.",
  "例如：想了解網店按日計租收費、現有 500 件時裝想搵地方擺...": "e.g. Inquiring about daily flex rental, looking to store 500 garments...",
  "• 拖櫃、拆櫃、分貨、按店拼箱（Cross-Docking）作業區": "• Container devanning, sorting, and store-by-store cross-docking operations",
  "關於威黃 - 威黃物流服務有限公司 | 30年B2B信譽與集團後盾": "About Us - Fenix Logistic Services Limited | 30-Year B2B Heritage & Group Backing",
  "✓ 即日揀貨發貨：串接順豐、Zeek 等主流快遞，享大客運費優惠": "✓ Same-Day Dispatch: Integrated with SF Express, Zeek, etc., with tier-1 corporate courier rates",
  "• 專業成衣蒸氣熨燙（Steaming）及品質檢驗（QC）流水線": "• Professional garment steaming lines and strict quality control (QC) inspection",
  "FLS 推出新一代電商 Fulfilment「按日計租」靈活方案": "FLS Launches Next-Gen Daily Flex Rental Fulfillment for eCommerce",
  "24小時雲端查貨，支援 API / EDI 對接客戶 ERP。": "24/7 cloud inventory visibility, supporting API/EDI integration with client ERPs.",
  "一站式 I.T. 軟硬體支援維護，簡化客戶管理，提升投資回報。": "One-stop hardware and software IT support to streamline operations and enhance ROI.",
  "✓ 戰略合作夥伴：與 Waylun Pet Care 緊密合作": "✓ Strategic Partner: Strong synergy with Waylun Pet Care",
  "歷時逾一年深度定制研發，精準貼合貨倉散客多元貨品儲存與查詢需求": "Developed over a year to perfectly match diverse inventory storage and tracking needs for warehouse clients",
  "旗下品牌 Carry Kuma 上門智慧存儲 App 正式推出": "Our Brand Carry Kuma Officially Launches Smart On-Demand Storage App",
  "數字不說謊，看看將倉儲交給專業團隊能為你節省多少精力與金錢：": "Numbers speak for themselves. Discover how outsourcing storage saves you time, energy, and costs:",
  "透明化出入倉記錄、批次效期與單證查閱，杜絕庫存誤差與溝通成本": "Transparent inbound/outbound records, batch expiry dates, and documentation, eliminating stock discrepancies",
  "深度整合倉儲條碼掃描、貨倉 ERP 及企業 ERP 系統對接": "Seamless integration of warehouse barcode scanning, Warehouse ERP, and enterprise ERP systems",
  "✓ 貨倉 ERP 查貨系統：24小時線上即時掌握庫存與貨流": "✓ Warehouse ERP System: 24/7 online stock tracking",
  "✓ 客製化包裝禮盒：支援附送品牌感謝卡、禮盒絲帶與防震包裝": "✓ Custom Gift Packaging: Support brand cards, satin ribbons, and premium protective wrapping",
  "EST. 1994 • FENIX GROUP 核心成員": "EST. 1994 • CORE MEMBER OF FENIX GROUP",
  "文件製作、專業報關、產地證及熏蒸證申請、代訂進出口倉位。": "Documentation, customs declaration, Certificate of Origin, fumigation, and freight booking.",
  "✓ 按日計租：無需簽署工廈死約，按實際佔用板位或箱數扣費": "✓ Daily Flex Rental: Zero lock-in leases; pay only for actual pallets or cartons used",
  "✓ 貨倉 ERP 系統 24 小時在線即時掌握庫存與貨流": "✓ Proprietary EBP system offers 24/7 real-time inventory visibility",
  "自設香港本地車隊每日定點巡迴補貨，熟悉全港商場裝卸流程。": "Dual-plated vehicle fleet operating daily between HK and Mainland with bonded customs clearance.",
  "• 恆溫冷氣及常溫多溫區規劃，設有重型裝卸貨台及專屬貨梯": "• Climate-controlled and ambient multi-temperature zones with heavy loading docks and cargo lifts",
  "代辦進出口許可證、產地來源證（CO）及木質/貨品熏蒸證書": "Handling import/export permits, Certificates of Origin (CO), and fumigation certificates",
  "📍 總部：香港葵涌梨木道88號達利中心5樓502A-B室": "📍 HQ: Unit 502A-B, 5/F, Mai Luen Industrial Building, 88 Lei Muk Road, Kwai Chung, HK",
  "常溫及18-22°C恆溫精品冷氣倉，按日按板靈活計租。": "Ambient & 18-22°C climate-controlled storage, flexible daily/pallet rental.",
  "✓ 專業增值處理：成衣防塵吊掛、蒸氣熨燙、繁體標籤貼換": "✓ Professional VAS: Garment-on-hanger protection, steaming, and Chinese label replacement",
  "• 總部綜合行政、IT Server 房及營運指揮中心": "• Headquarters administration, IT Server room, and operations command center",
  "📍 深圳市龍崗區南灣街道紅棉路港華工業園12號D棟5層": "📍 5/F, Block D, No. 12 Ganghua Industrial Park, Hongmian Road, Nanwan, Longgang, Shenzhen",
  "授權客戶請直接點擊進入專屬查貨入口，隨時掌控貨物動態。": "Authorized clients can log in directly to track inventory and shipment status in real time.",
  "請點擊下方卡片即可直接開啟各個新設計頁面進行詳細檢視：": "Click the cards below to review each newly designed page in detail:",
  "聯繫各大貨代安排收發貨物，代訂國際海運及空運進出口倉位": "Liaising with freight forwarders to manage cargo flows and booking sea/air freight capacity",
  "全港各大商場專櫃補貨、門市急送與 B2C 宅配直達。": "Shopping mall store replenishment, express retail dispatch, and door-to-door B2C delivery.",
  "✓ 全港商場專櫃補貨：自設車隊熟悉各大商場卸貨區規則": "✓ Mall Store Replenishment: Dedicated fleet familiar with loading dock regulations across HK malls",
  "✓ 專業全職員工流水線作業，99.9% 掃描防呆出貨": "✓ Dedicated full-time assembly teams; 99.9% barcode-verified dispatch",
  "✓ 集團級海量單量對接快遞，享大客運費並每日定時攬收": "✓ Enterprise shipping volume with top courier discounts and scheduled daily pickups",
  "• 服務大灣區製造端集貨、保稅存儲、電商出口預先質檢": "• Sourcing consolidation, bonded warehousing, and pre-export QC for GBA manufacturers",
  "一站式企業級 I.T. 技術與電腦軟硬體日常維護支援": "One-stop enterprise IT technical, hardware, and software maintenance support",
  "熟悉海港城、時代廣場、又一城等全港各大商場卸貨區規則": "Familiar with loading dock regulations across Harbour City, Times Square, Festival Walk, and all major malls",
  "6. 全局美化：5 款主題色系 ＆ 實體倉運圖片入庫": "6. Design Polish: 5 Theme Palettes & Real Warehouse Photography",
  "簡化客戶資訊管理，降低企業內部 IT 人力與維運負擔": "Simplifying IT management for clients and reducing internal technical staffing overhead",
  "成衣專業蒸燙、吊牌貼標、QC 品質檢驗與禮盒組裝。": "Garment steaming, label tagging, QC inspection, and luxury gift box assembly.",
  "企業級 3PL 專道 • 30年基業 / 稳定合規": "Enterprise 3PL • 30-Year Heritage & Compliance",
  "企業級 3PL 專道 • 30年基業 / 穩定合規": "Enterprise 3PL • 30-Year Heritage & Compliance",
  "手工記錄 Excel，常發生「網上賣出但倉庫無貨」": "Manual Excel tracking often causing overselling when stock is out",
  "📍 香港葵涌梨木道88號達利中心5樓502A-B室": "📍 Unit 502A-B, 5/F, Mai Luen Industrial Building, 88 Lei Muk Road, Kwai Chung, HK",
  "📍 香港葵涌梨木道88號達利中心5樓502C-D室": "📍 Unit 502C-D, 5/F, Mai Luen Industrial Building, 88 Lei Muk Road, Kwai Chung, HK",
  "• 支援中小網店按日計租、箱盒級儲存及當日極速出庫": "• Supporting daily flex rental for online stores, carton/pallet storage, and same-day dispatch",
  "• 24 小時溫濕度精密監控，杜絕高級面料受潮老化": "• 24/7 precision climate & humidity monitoring, protecting delicate designer fabrics",
  "📍 香港荃灣橫窩仔街43-57號永得利中心11/F": "📍 11/F, Ever Gain Centre, 43-57 Wang Wo Tsai Street, Tsuen Wan, HK",
  "• 設有寬敞的緩衝集裝區域，支援大批量貨物快進快出": "• Spacious staging and container consolidation buffer zones supporting high-volume turnaround",
  "自設香港本地專業車隊，靈活穿梭各大商業區及商場專櫃": "Dedicated local fleet operating across commercial districts and shopping mall counters",
  "雜誌風圖文網誌 (Insights & Blog)": "Magazine-Style Insights & Blog",
  "企劃匯報與五大新版面評審 - 威黃物流服務有限公司": "Executive Proposal & Design Review - Fenix Logistic Services Limited",
  "✓ 專業業務範圍：涵蓋香港及澳門區批發與零售通路": "✓ Coverage: Wholesale & retail distribution across HK and Macau",
  "✓ 專屬手機 App 一鍵管理存儲物品與調撥預約": "✓ Dedicated mobile app to manage stored items & schedule retrieval anytime",
  "成熟品牌 (1,000 - 3,000 單/月)": "Established Brand (1,000 - 3,000 orders/mo)",
  "• 專門服務國際一線時裝精品、配飾鞋履及百貨零售": "• Dedicated to tier-1 luxury fashion, accessories, footwear, and department store retail",
  "• 配套專用裝卸升降機直達卸貨區，保障全天候流轉": "• Dedicated freight lifts directly connected to loading bays for all-weather logistics",
  "📍 香港荃灣橫窩仔街43-57號永得利中心7/F": "📍 7/F, Ever Gain Centre, 43-57 Wang Wo Tsai Street, Tsuen Wan, HK",
  "4. 流程革新：雙表單與 WhatsApp 接通": "4. Workflow Innovation: Dual Forms & WhatsApp Lead Capture",
  "（如需查看港深 6 大倉庫詳細規格及地址，請前往": "(For detailed specs and addresses of our 6 HK-Shenzhen warehouses, visit",
  "支援直接透過 WhatsApp 直通客戶經理對話": "Direct one-click WhatsApp connection to dedicated account managers",
  "請輸入您的姓名 / 職稱（若勾選匿名則自動隱藏）": "Please enter your name/title (auto-hidden if anonymous is selected)",
  "Fenix Pet 深化港澳高端寵物用品批發分銷": "Fenix Pet expanding premium pet supplies distribution across HK & Macau",
  "：串接順豐、Zeek 等主流快遞，享大客運費優惠": ": Integrated with SF Express, Zeek, etc., enjoying tier-1 corporate shipping discounts",
  "✓ 按日計租，按實際件數/板位收費，零死約包袱": "✓ Daily flex rental by actual cartons/pallets; zero lease lock-in",
  "成長型網店 (300 - 1,000 單/月)": "Growing Store (300 - 1,000 orders/mo)",
  "• 適合精品時裝、高價值零售貨品、電商綜合履約": "• Ideal for luxury fashion, high-value retail goods, and multi-channel fulfillment",
  "• 設有專屬電子秤重、尺寸量測及條碼自動流水線": "• Dedicated automatic weighing, dimension scanning, and barcode assembly lines",
  "• 支援繁體中文標籤更換、防盜扣裝卸及禮盒包裝": "• Customized Traditional Chinese labeling, security tagging, and gift packaging",
  "• 毗鄰深圳主要物流幹道，銜接深港兩地貨物流轉": "• Adjacent to major expressways, seamlessly connecting HK-Shenzhen cargo flows",
  "分流輕量諮詢（低門檻）與精準規格報價（高意向）": "Diverting into low-barrier inquiries and high-intent precision quotations",
  "服務範疇與多倉儲網絡 - 威黃物流服務有限公司": "Services & Warehouse Network - Fenix Logistic Services Limited",
  "蘋果美學風格 · 雙軌商業增長 · 模組化擴展": "Apple Minimalist Aesthetic · Dual Growth Tracks · Modular Scalability",
  "支援碼頭提櫃、散貨拼箱、大促門市調撥與送貨到府": "Supporting container drayage, LCL consolidation, store transfers, and home delivery",
  "Shopify / SHOPLINE 快速開箱": "Shopify / SHOPLINE Quick Unboxing",
  "✓ 專人專車上門派送收箱，免去奔波迷你倉煩惱": "✓ Door-to-door delivery & pickup by dedicated fleet, ending mini-storage hassles",
  "聯絡我們與立即報價 - 威黃物流服務有限公司": "Contact Us & Instant Quote - Fenix Logistic Services Limited",
  "📍 香港葵涌梨木道88號達利中心5樓501室": "📍 Unit 501, 5/F, Mai Luen Industrial Building, 88 Lei Muk Road, Kwai Chung, HK",
  "• 設有高規格防塵吊掛成衣專用區及防靜電地坪": "• High-spec dust-free Garment-on-Hanger (GOH) zones with anti-static flooring",
  "物流網誌與行業趨勢 - 威黃物流服務有限公司": "Logistics Blog & Industry Insights - Fenix Logistic Services Limited",
  "中小網店按日計租 vs 自行租倉直觀效益對比": "Visual comparison: Daily flex rental vs. self-leasing industrial space",
  "模組化多倉網絡：規格、溫控、適用品類一目了然": "Modular multi-warehouse network: specs, climate control, and cargo categories at a glance",
  "：支援與客戶 ERP 系統對接，數據即時打通": ": Seamless API/EDI integration with client ERPs for real-time data synchronization",
  "：無需簽署工廈死約，按實際佔用板位或箱數扣費": ": Zero lock-in lease; billed strictly by actual pallets or cartons utilized",
  "全套船務進出口文件製作及專業代理海關清關報關": "Complete import/export shipping documentation and professional customs clearance representation",
  "24/7 CCTV 全方位監控及消防安防系統": "24/7 comprehensive CCTV surveillance, fire protection, and security systems",
  "2至3年固定死約，淡季空倉照付高額租金水電": "2-3 year rigid leases; paying high rent and utilities during low seasons",
  "單量小無法爭取折扣，需親自送貨到自提點排隊": "Low volume means no discount; queueing at pickup stations in person",
  "🕒 星期一至五 09:00 - 18:00": "🕒 Monday - Friday 09:00 - 18:00",
  "智能報價計算器 (Smart Quote)": "Smart Quote Calculator",
  "如需恆溫冷氣、成衣吊掛、退換貨檢驗等...": "e.g. Climate-control, garment hanging, RMA inspection...",
  "• 標準重型高位托盤貨架，空間使用率極大化": "• Heavy-duty high-bay pallet racking maximizing vertical storage efficiency",
  "貨倉 ERP 查貨系統及智慧 API 串接": "Warehouse ERP Tracking & Smart API Integration",
  "逾 120,000 平方呎多溫區現代化基地": "Over 120,000 sq.ft. Multi-Temperature Modern Logistics Hubs",
  "兼職流動率高，大促爆單親友通宵包貨易出錯": "High turnover of temp staff; late-night packing rushes lead to errors",
  "✓ 專業恆溫寵物糧倉儲與嚴格批次效期控管": "✓ Climate-Controlled pet food warehousing & strict expiry date management",
  "例如：陳先生 / ABC Trading": "e.g. Mr. Chan / ABC Trading",
  "電商 Fulfilment (按日計租)": "eCommerce Fulfillment (Daily Flex Rental)",
  "• 連通 502 總部，高效協同分流作業": "• Direct link to Unit 502 HQ for seamless cross-docking and order routing",
  "• 威黃倉管(深圳)有限公司直接運營管理": "• Directly managed by Fenix Warehousing (Shenzhen) Co., Ltd.",
  "純白卡片網格，排版清爽，支援即時分類過濾": "Pure white card grid with clean layout and instant category filtering",
  "：支援附送品牌感謝卡、禮盒絲帶與防震包裝": ": Value-added inserts with thank-you cards, satin ribbons, and protective wrapping",
  "促銷套裝（Kitting）與禮品包裝加工": "Promotional kitting, bundle assembly, and luxury gift wrapping",
  "深受眾多知名國際時尚及零售品牌長期信賴": "Trusted Long-Term by World-Renowned Fashion & Retail Brands",
  "以集團級硬實力，支撐你的每一次業務爆發": "Empowering Your Business Surges with Enterprise Infrastructure",
  "✓ 靈活支援微型電商寄賣庫存與快遞分撥": "✓ Flexible micro-warehousing, consignment stock, and courier dispatch",
  "葵涌-達利中心 (5樓 502A-B)": "Kwai Chung - Mai Luen Industrial Building (5/F 502A-B)",
  "葵涌-達利中心 (5樓 502C-D)": "Kwai Chung - Mai Luen Industrial Building (5/F 502C-D)",
  "條碼槍雙重覆核，99.9% 出貨準確率": "Double barcode scanner verification with 99.9% dispatch accuracy",
  "：成衣防塵吊掛、蒸氣熨燙、繁體標籤貼換": ": Garment dust-proof hanging, steam ironing, and Traditional Chinese relabeling",
  "靈活退換貨（RMA）及產品逆向物流處理": "Flexible returns (RMA) inspection and reverse logistics processing",
  "常溫及 18-22°C 恆溫精品冷氣倉": "Ambient & 18-22°C climate-controlled luxury storage",
  "中小網店專道 • 決策快 / 零負擔": "Boutique eCommerce • Agile & Burden-Free",
  "自租工廈 vs FLS 智慧物流對比": "Self-Leased Industrial Space vs. FLS Smart Logistics",
  "💬 透過 WhatsApp 即時諮詢": "💬 Chat via WhatsApp Now",
  "旗下品牌 ｜ 連接多元市場的創新服務": "Our Brands | Connecting Diverse Markets with Innovative Logistics",
  "05. 門市庫存及 POS 數據管理": "05. Cross-Border Freight",
  "請選擇您所需要的物流服務（可複選）：": "Please select the logistics services you require (Multiple choices):",
  "RECOMMENDED • 快速核算": "RECOMMENDED • Quick Estimate",
  "例如：ABC Fashion Ltd": "e.g. ABC Fashion Ltd",
  "想深入評估您現有網店的倉配成本結構？": "Looking to evaluate your current online store's warehousing and fulfillment cost structure?",
  "訪問 Carry Kuma 專頁 →": "Visit Carry Kuma Page →",
  "新聞及媒體報導 ｜ 集團最新發展動態": "News & Media Coverage | Corporate Developments",
  "訪問 Fenix Pet 官網 ↗": "Visit Fenix Pet Website ↗",
  "06. 貨倉 ERP 庫存管理系統": "06. Warehouse ERP Stock System",
  "初創試營運 (< 300 單/月)": "Startup (< 300 orders/mo)",
  "大型企業 (3,000+ 單/月)": "Enterprise (3,000+ orders/mo)",
  "聯絡電話 / WhatsApp *": "Phone / WhatsApp *",
  "智慧科技物流 Mood Board": "Smart Logistics Mood Board",
  "30 年信譽傳承 ｜ 集團雄厚實力": "30-Year Proven Heritage | Solid Group Strength",
  "訪問 Fenix Pet 專頁 →": "Visit Fenix Pet Page →",
  "語言選擇 / Language:": "Language:",
  "FENIX GROUP 強大後盾": "Strong Backing from FENIX GROUP",
  "新世代電商 Fulfilment": "Next-Gen eCommerce Fulfillment",
  "準備好升級您的品牌倉配體驗了嗎？": "Ready to Upgrade Your Brand's Logistics Experience?",
  "小威 & 小黃 (隨頁解密內幕)": "Siu Wai & Siu Wong (Behind the Scenes)",
  "聯絡電話 / WhatsApp：": "Phone / WhatsApp:",
  "✉️ 一鍵啟動電郵客戶端直接寄信": "✉️ Open Email Client Directly",
  "葵涌-達利中心 (5樓 501)": "Kwai Chung - Mai Luen Industrial Building (5/F 501)",
  "大灣區跨境車隊實時 GPS 調度": "Real-time GPS dispatch for Greater Bay Area cross-border fleet",
  "版面 04 • SEO 流量陣地": "Section 04 • SEO Traffic Hub",
  "自租工廈 vs FLS 智慧物流": "Self-Leased Space vs. FLS Smart Logistics",
  "：自設車隊熟悉各大商場卸貨區規則": ": Dedicated fleet familiar with dock regulations across major shopping malls",
  "香港葵涌梨木道88號達利中心5樓": "5/F, Mai Luen Industrial Building, 88 Lei Muk Road, Kwai Chung, HK",
  "電商 Fulfilment 履約": "eCommerce Fulfillment",
  "葵涌達利總部與深圳大灣區雙樞紐": "Mai Luen Headquarters & Shenzhen GBA Hubs",
  "Google Play App": "Google Play App",
  "📦 網店 Fulfilment": "📦 eCommerce Fulfillment",
  "聯絡我們 ｜ 智能在線即時報價": "Contact Us | Smart Online Instant Quote",
  "香港本地車隊 / 商場專櫃運輸": "Local Fleet / Shopping Mall Store Replenishment",
  "荃灣-永得利中心 (11 樓)": "Tsuen Wan - Ever Gain Centre (11/F)",
  "📊 管理層分組評審即時統計結果": "📊 Management Review Live Statistics",
  "商品品質檢驗（QC）及缺陷篩選": "Quality control (QC) inspection and defect screening",
  "物流洞察 ｜ 電商網店實戰專欄": "Logistics Insights | eCommerce & Retail Column",
  "戰略拓展 • 2025年11月": "Strategic Expansion • Nov 2025",
  "支援按日、按板或按材積靈活計租": "Flexible daily, pallet, or volume-based billing",
  "貨倉 ERP 網上智能查貨系統": "Warehouse ERP Online Smart Tracking System",
  "登入貨倉 ERP 查貨系統 ↗": "Log In to Warehouse ERP System ↗",
  "30年 國際品牌零售倉配經驗": "30+ Years Enterprise Retail 3PL Experience",
  "24/7 CCTV 防盜監控": "24/7 CCTV Security",
  "八大核心物流與企業全方位支援": "Eight Core Logistics & Enterprise Support Capabilities",
  "定制增值服務 (貼標/包裝)": "Value-Added Services (Labeling / Packaging)",
  "荃灣-永得利中心 (7 樓)": "Tsuen Wan - Ever Gain Centre (7/F)",
  "選擇匿名提交 (不透露姓名)": "Submit Anonymously (Hide Name)",
  "門市庫存及 POS 數據管理": "Retail Store POS & Inventory Management",
  "關於威黃 · 30年信譽傳承": "About FLS · 30-Year Heritage",
  "中小網店 vs 企業 3PL": "Boutique eCommerce vs. Enterprise 3PL",
  "FENIX GROUP 集團": "FENIX GROUP",
  "業務升級 • 2026年9月": "Business Upgrade • Sep 2026",
  "產品上線 • 2026年5月": "Product Launch • May 2026",
  "成衣專業蒸燙、掛裝、改衣貼標": "Garment steaming, hanging, alterations, and labeling",
  "告別死約束縛，用幾多算幾多": "Say Goodbye to Fixed Leases — Pay Only for What You Use",
  "諮詢企業 3PL 合作 →": "Consult Enterprise 3PL →",
  "電商 Fulfilment": "eCommerce Fulfillment",
  "貨倉 ERP 查貨系統 ↗": "Warehouse ERP Online Tracking ↗",
  "您的稱呼 / 公司名稱 *": "Your Name / Company Name *",
  "3. 具體建議與指導意見：": "3. Specific Suggestions & Guidance:",
  "1. 資訊準確性與免責聲明": "1. Information Accuracy & Disclaimer",
  "八大核心物流與企業支援服務": "Eight Core Logistics & Enterprise Support Capabilities",
  "全方位一站式供應鏈解決方案": "Comprehensive One-Stop Supply Chain Solutions",
  "貨倉 ERP 庫存管理系統": "Warehouse ERP Inventory System",
  "中小網店，同樣輕鬆擁有。": "Accessible for Growing eCommerce Brands.",
  "威黃物流服務有限公司方案": "FLS Smart Logistics Solution",
  "下一步：填寫聯絡方式 →": "Next: Contact Details →",
  "下一步：填寫貨量規模 →": "Next: Volume & Specs →",
  "智能倉存 (常溫/冷氣)": "Smart Warehousing (Ambient / Climate-Controlled)",
  "港深 6 大專業倉儲節點": "6 Major Hong Kong & Shenzhen Logistics Hubs",
  "4. 條款修訂與管轄法律": "4. Revisions & Governing Law",
  "服務範疇與 6 大倉網絡": "Services & 6 Major Hubs Network",
  "港深 6 大專業倉儲樞紐": "6 Major Hong Kong & Shenzhen Hubs",
  "企劃匯報與五大新版面評審": "Executive Proposal & Design Review",
  "04. 香港本地車隊派送": "04. Local Fleet Delivery",
  "聯絡我們 ➔ 各倉庫據點": "Contact Us ➔ Warehouse Hubs",
  "定制增值服務 (VAS)": "Custom Value-Added Services (VAS)",
  "大公司級數的倉配支援。": "Enterprise-Grade Fulfillment Support.",
  "中小網店按日計租零死約": "Daily Flex Rental · Zero Lock-In",
  "兩種客群，一套卓越標準": "Two Client Portfolios, One Standard of Excellence",
  "WhatsApp 諮詢": "WhatsApp Inquiry",
  "專屬 WhatsApp": "Dedicated WhatsApp",
  "服務以誠 · 真摰真心": "Service with Integrity · Dedication from Heart",
  "提交並產生報價摘要 ✓": "Submit & Generate Quote Summary ✓",
  "🏷️ 貼標包裝 VAS": "🏷️ Labeling & VAS Packaging",
  "精品時裝 / 鞋履配件": "Luxury Fashion / Footwear & Accessories",
  "美妝保養 / 個人護理": "Cosmetics & Skincare / Personal Care",
  "生活百貨 / 家居用品": "General Merchandise / Home Goods",
  "電子數碼 / 小型電器": "Consumer Electronics / Gadgets",
  "貨倉 ERP 查貨系統": "Warehouse ERP Tracking System",
  "最新企業動態與行業資訊": "Latest Corporate News & Industry Insights",
  "八大核心全方位企業支援": "Eight Core Logistics & Enterprise Support Capabilities",
  "專屬 ERP 查貨系統": "Proprietary ERP Tracking System",
  "威黃物流服務有限公司為": "Fenix Logistic Services Limited is a member of ",
  "2. 智慧財產權與商標": "2. Intellectual Property & Trademarks",
  "專業運輸與香港本地派送": "Professional Transport & Hong Kong Local Delivery",
  "威黃物流服務有限公司": "Fenix Logistic Services Limited",
  "葵涌及深圳雙核心樞紐": "Dual Hubs in Kwai Chung & Shenzhen",
  "01. 智能倉存服務": "01. Smart Warehousing",
  "02. 電商履約代發": "02. eCommerce Fulfillment",
  "03. 定制增值服務": "03. Value-Added Services (VAS)",
  "04. 專業運輸派送": "04. Professional Delivery",
  "07. 電腦支援服務": "07. I.T. & Computer Support",
  "獲取網店方案報價 →": "Get eCommerce Quote →",
  "自行租工廈或親自包裝": "Self-Leasing / DIY Fulfillment",
  "立即獲取專屬報價 →": "Get Tailored Quote →",
  "Carry Kuma": "Carry Kuma",
  "香港本地專業運輸派送": "Local Professional Delivery",
  "特殊倉儲與增值要求：": "Special Storage & VAS Requirements:",
  "🚛 本地專業運輸派送": "🚛 Local Professional Delivery",
  "預計每月訂單出貨量：": "Estimated Monthly Orders:",
  "深圳市龍崗區倉管中心": "Shenzhen Longgang Logistics Hub",
  "💬 最新提交指導意見": "💬 Latest Management Feedback",
  "對接各大主流網店平台": "Integrate with Main eCommerce Platforms",
  "專人專車上門派送收箱": "Dedicated Door-to-Door Delivery & Pickup",
  "✓ 戰略合作夥伴：與": "✓ Strategic Partner: In close synergy with ",
  "預約免費倉配評估 →": "Book Free Logistics Assessment →",
  "2–3 分鐘極速同步": "2-3 Minute High-Speed Sync",
  "Fenix Pet": "Fenix Pet",
  "出貨與庫存極致精準": "Extreme Precision in Fulfillment & Stock",
  "品牌大型供應鏈託管": "Enterprise Supply Chain Management",
  "⚙️ 系統管理後台": "⚙️ Admin Portal",
  "FLS 智慧導覽員": "FLS Smart Tour Guide",
  "1. 選擇服務模式": "1. Select Service",
  "2. 預估貨量規模": "2. Estimate Volume",
  "3. 聯絡人及送出": "3. Contact & Submit",
  "🏢 長期/短期倉存": "🏢 Long/Short-Term Storage",
  "發送快速查詢 ✉️": "Submit Quick Inquiry ✉️",
  "瀏覽器本地即時同步": "Real-Time Browser Local Sync",
  "合作品牌與品質保證": "Partner Brands & Quality Assurance",
  "專屬方案諮詢與預約": "Consultation & Tailored Proposal",
  "聯絡我們與線上報價": "Contact Us & Online Instant Quote",
  "免責聲明與使用條款": "Disclaimer & Terms of Use",
  "紮根香港，始終如一": "Rooted in Hong Kong, Committed to Excellence",
  "了解詳情及方案 →": "Learn More & Solutions →",
  "客製化每日專業報表": "Custom Daily Business Reports",
  "立即獲取報價 →": "Get Instant Quote →",
  "試算網店倉租 →": "Calculate Storage Rent →",
  "大促訂單從容應對": "Handling Massive Order Surges with Ease",
  "08. 船務支援": "08. Shipping & Freight Forwarding",
  "🔄 重講當前頁段": "🔄 Replay Section",
  "30 秒極速諮詢": "30-Second Quick Inquiry",
  "簡短需求說明 *": "Brief Requirements *",
  "✉️ 專屬電郵：": "✉️ Dedicated Email: ",
  "總部及核心旗艦倉": "Headquarters & Flagship Hub",
  "溫控成衣與增值倉": "Climate & VAS Processing Centre",
  "12萬呎網絡佈局": "120,000 sq.ft. Network",
  "全港商場專櫃補貨": "Hong Kong Mall Store Replenishment",
  "當日訂單當日發出": "Same-Day Order Dispatch",
  "第三方連結與免責": "Third-Party Links & Disclaimer",
  "本地專業運輸派送": "Local Professional Fleet Delivery",
  "專用機房私網互聯": "Dedicated Data Room Private Network",
  "企劃匯報與評審": "Proposal Deck & Review",
  "倉租成本與彈性": "Rental Cost & Flexibility",
  "人手管理與包裝": "Staffing & Packing",
  "快遞成本與時效": "Courier Cost & Speed",
  "庫存數據透明度": "Inventory Transparency",
  "客製化增值服務": "Value-Added Services (VAS)",
  "專屬導覽員小威": "Tour Guide Siu Wai",
  "主要商品品類：": "Primary Commodity Category:",
  "寵物用品及食品": "Pet Food & Supplies",
  "深圳大灣區樞紐": "Shenzhen GBA Cross-Border Gateway",
  "智慧科技物流風": "Smart Tech Logistics Style",
  "按日計租零死約": "Daily Flex Rental · Zero Lock-In",
  "30年信譽傳承": "30-Year Proven Heritage",
  "八大一站式閉環": "8-in-1 Closed-Loop Capabilities",
  "新聞及媒體報導": "News & Media Coverage",
  "客製化包裝禮盒": "Custom Gift Packaging",
  "3. 外部連結": "3. External Links",
  "探索智慧物流": "Explore Smart Logistics",
  "雙城基地網絡": "Dual-City Hub Network",
  "恆溫冷氣溫控": "Climate-Controlled",
  "消防滅火系統": "Fire Suppression",
  "重型裝卸貨台": "Heavy Loading Docks",
  "彈性計費革命": "Flexible Billing Revolution",
  "每日處理動能": "Daily Processing Capacity",
  "自研科技支撐": "Proprietary Tech Power",
  "集團信譽保障": "Group Heritage Guarantee",
  "營運關鍵指標": "Key Metric",
  "寵物精品經銷": "Premium Pet Distribution",
  "智慧上門存儲": "Smart On-Demand Storage",
  "官方網站 ↗": "Official Website ↗",
  "核心物流服務": "Core Logistics Services",
  "智能倉存服務": "Smart Warehousing",
  "切換語音朗讀": "Toggle Voice Readout",
  "📍 準備導覽": "📍 Ready for Tour",
  "試算報價 →": "Instant Quote →",
  "點擊即時解密": "Click for Insights",
  "直接聯絡專員": "Direct Contact",
  "例如：陳經理": "e.g. Manager Chan",
  "聯絡人稱呼：": "Contact Name:",
  "高週轉電商倉": "High-Turnover eCommerce Hub",
  "綜合物流中心": "Integrated High-Bay Hub",
  "即日揀貨發貨": "Same-Day Pick & Pack",
  "純白蘋果極簡": "Pure White Apple Minimalist",
  "門市專櫃補貨": "Mall Store Replenishment",
  "香港達利總部": "Mai Luen HK HQ",
  "深圳跨境樞紐": "Shenzhen Cross-Border Hub",
  "國際名牌信譽": "Global Luxury Reputation",
  "雙軌度身訂造": "Dual-Track Tailored Solutions",
  "精打細算對比": "Cost Breakdown Comparison",
  "即時線上估價": "Instant Online Estimate",
  "智慧導覽在線": "Smart Tour Guide Online",
  "專業增值處理": "Value-Added Processing (VAS)",
  "成衣專業蒸燙": "Professional Garment Steaming",
  "改衣貼標服務": "Alterations & Labeling",
  "條碼防呆揀貨": "Barcode Error-Proof Picking",
  "一板即可起租": "Start from Just 1 Pallet",
  "按日靈活計租": "Flexible Daily Billing",
  "智能倉儲網絡": "Smart Warehousing Network",
  "跨境保稅集運": "Cross-Border Bonded Consolidation",
  "電腦支援服務": "Computer & IT Support Services",
  "船務支援服務": "Shipping & Freight Support",
  "知識產權聲明": "Intellectual Property Rights",
  "關聯零售旗艦": "Affiliated Retail Flagships",
  "新聞及媒體": "News & Media",
  "隱私與免責": "Privacy & Disclaimer",
  "收起導覽框": "Minimize Tour Box",
  "← 上一步": "← Back",
  "📞 電話：": "📞 Phone: ",
  "公司名稱：": "Company Name:",
  "電子郵箱：": "Email Address:",
  "時裝精品倉": "Luxury Fashion & GOH Hub",
  "國際尊榮風": "International Luxury Style",
  "商務海軍藍": "Business Navy Blue",
  "極簡黑白灰": "Minimalist Monochrome",
  "科技電光藍": "Tech Electric Blue",
  "尊貴香檳金": "Luxury Champagne Gold",
  "活力品牌橙": "Vibrant FLS Orange",
  "基建設施：": "Infrastructure:",
  "總部位址：": "Headquarters:",
  "科技驅動：": "Tech-Driven:",
  "威黃物流": "Fenix Logistic Services Limited",
  "關於威黃": "About FLS",
  "服務範疇": "Services",
  "旗下品牌": "Our Brands",
  "物流網誌": "Logistics Blog",
  "聯絡我們": "Contact Us",
  "企劃匯報": "Proposal Deck",
  "免責聲明": "Disclaimer",
  "立即報價": "Instant Quote",
  "概念影片": "Concept Video",
  "概念圖片": "Concept Image",
  "按日計租": "Daily Flex Rental",
  "快速導航": "Quick Links",
  "總部聯絡": "Headquarters Contact",
  "版權所有": "All Rights Reserved",
  "3D高清": "3D Smooth",
  "其他商品": "Other Commodities",
  "緊密合作": " close cooperation",
  "倉儲管理": "Warehouse Management",
  "全部文章": "All Articles",
  "行業趨勢": "Industry Trends",
  "電商實戰": "eCommerce Practical",
  "品牌動態": "Brand News",
  "官方公告": "Official Announcements",
  "業務擴張": "Business Expansion",
  "船務支援": "Shipping & Freight Forwarding Support",
  "粗像素": "Pixel Art",
  "網誌": "Blog",
  "EN": "EN",
  "首頁": "Home",
  "主頁": "Home",
  "繁": "TC",
  "簡": "SC",
  "年": "Years",
  "尺": "sq.ft.",
  "呎": "sq.ft.",
  "件": "pcs",
  "單": "orders",
  "板": "pallets"
};

  // 長句優先排序索引，防止短詞破壞長語句完整度
  const SORTED_EN_KEYS = Object.keys(EN_PHRASES).sort((a, b) => b.length - a.length);

  function convertToEnglish(text) {
    if (!text || typeof text !== 'string') return text;
    const trimmed = text.trim();
    if (EN_PHRASES[trimmed]) {
      return text.replace(trimmed, EN_PHRASES[trimmed]);
    }
    if (!/[\u4e00-\u9fff]/.test(text)) return text;

    let cur = text;
    for (let i = 0; i < SORTED_EN_KEYS.length; i++) {
      const tc = SORTED_EN_KEYS[i];
      if (cur.indexOf(tc) !== -1) {
        cur = cur.split(tc).join(EN_PHRASES[tc]);
        if (!/[\u4e00-\u9fff]/.test(cur)) break;
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
