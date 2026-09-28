/**
 * 威黃物流服務有限公司 (FLS) & AJ Studio
 * 通用多租戶雙資料庫容災資料適配器 (Universal Dual-DB Fallback Loader)
 * 版本：v0.22 (2026-09-25)
 * 遵循標準：dual-db-cms-architecture
 * 
 * 機制：
 * 1. 優先請求 Oracle APEX ORDS REST API (Master)
 * 2. 1.5 秒超時或網絡失敗 ➔ 自動無縫切換讀取 Firebase Realtime Database (Replica)
 * 3. 兩者皆斷網 ➔ 自動降級使用 LocalStorage 或本地預設備底，確保 100% 不白屏
 * 4. 自動綁定渲染 DOM (Slogans, Warehouses 等)
 */
const DualDbLoader = (function () {
  const CONFIG = {
    tenant: "FLS",
    project: "FLS_OFFICIAL_WEB",
    version: "v0.22",
    timeoutMs: 1500, // 1.5 秒超時門檻
    // Oracle APEX ORDS 端點配置 (Master) - 已正式上線
    oracleBaseUrl: "https://oracleapex.com/ords/fls/api",
    // Firebase Realtime Database 端點配置 (Secondary / Replica)
    firebaseBaseUrl: "https://planning-with-ai-47f70-default-rtdb.asia-southeast1.firebasedatabase.app"
  };

  const CACHE_KEY = `fls_cms_cache_${CONFIG.tenant}_${CONFIG.project}`;

  function fetchWithTimeout(url, timeoutMs) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    return fetch(url, { signal: controller.signal })
      .then(async (response) => {
        clearTimeout(timeoutId);
        if (!response.ok) {
          throw new Error(`HTTP Error ${response.status}: ${response.statusText}`);
        }
        return await response.json();
      })
      .catch((error) => {
        clearTimeout(timeoutId);
        throw error;
      });
  }

  function getLocalCache() {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      return cached ? JSON.parse(cached) : null;
    } catch (e) {
      return null;
    }
  }

  function setLocalCache(data) {
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify(data));
    } catch (e) {}
  }

  function updateDOM(data) {
    if (!data) return;

    // 1. 動態更新 Slogans 口號
    if (data.slogans && data.slogans.length > 0) {
      const s = data.slogans[0];
      const title1El = document.querySelector('[data-i18n="heroTitle1"]');
      if (title1El && s.title1) title1El.textContent = s.title1;

      const title2El = document.querySelector('[data-i18n="heroTitle2"]');
      if (title2El && s.title2) title2El.textContent = s.title2;

      const taglineEl = document.querySelector('[data-i18n="heroTagline"]');
      if (taglineEl && s.tagline) taglineEl.textContent = s.tagline;

      const descEl = document.querySelector('[data-i18n="heroDesc"]');
      if (descEl && s.desc) descEl.textContent = s.desc;
    }

    // 2. 動態渲染 Warehouses 倉庫網格 (適用於 services.html 或首頁)
    const whGrid = document.getElementById("warehouses-dynamic-grid");
    if (whGrid && data.warehouses && data.warehouses.length > 0) {
      whGrid.innerHTML = data.warehouses.map(w => `
        <div class="warehouse-card bento-card">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
            <span class="badge badge-orange">${w.code || "FLS"}</span>
            <span style="font-size:0.85rem; color:var(--text-muted); font-weight:600;">📐 ${w.area || ""}</span>
          </div>
          <h3 style="font-size:1.35rem; margin-bottom:8px;">${w.name || ""}</h3>
          <p style="font-size:0.875rem; color:var(--text-secondary); margin-bottom:12px;">📍 ${w.address || ""}</p>
          <div style="display:flex; flex-wrap:wrap; gap:6px; margin-bottom:14px;">
            <span class="badge" style="background:var(--bg-secondary); color:var(--text-primary); font-size:0.75rem;">🏷️ ${w.type || ""}</span>
            <span class="badge" style="background:rgba(0,113,227,0.1); color:#0071e3; font-size:0.75rem;">🌡️ ${w.temp || ""}</span>
          </div>
          <ul style="font-size:0.85rem; color:var(--text-secondary); padding-left:18px; line-height:1.6;">
            ${(w.features || []).map(f => `<li>✓ ${f}</li>`).join("")}
          </ul>
        </div>
      `).join("");
    }

    console.log("[DualDbLoader] DOM 元素動態注入更新完成 ✅");
  }

  return {
    async load(customConfig = {}) {
      const cfg = { ...CONFIG, ...customConfig };
      const oracleUrl = `${cfg.oracleBaseUrl}/${cfg.tenant}/${cfg.project}/content`;
      const firebaseUrl = `${cfg.firebaseBaseUrl}/tenants/${cfg.tenant.toLowerCase()}/projects/${cfg.project.toLowerCase()}.json`;

      console.log(`[DualDbLoader] 正在啟動雙庫自適應讀取器 [${cfg.version}] (Tenant: ${cfg.tenant}, Project: ${cfg.project})`);

      // 步驟 1：優先嘗試讀取 Oracle APEX (Master)
      try {
        const oracleResult = await fetchWithTimeout(oracleUrl, cfg.timeoutMs);
        if (oracleResult && (oracleResult.data || oracleResult.status === "success")) {
          const content = oracleResult.data || oracleResult;
          setLocalCache(content);
          updateDOM(content);
          console.log("%c[DualDbLoader] 成功從主庫 (Oracle APEX ORDS) 載入即時資料 🟢", "color:#10b981; font-weight:bold;");
          return { source: "ORACLE_APEX", data: content, status: "live" };
        }
        throw new Error("Oracle API 回傳空資料");
      } catch (oracleErr) {
        console.warn(`[DualDbLoader] 主庫 Oracle APEX 連線逾時或受限 (${oracleErr.message})，自動降級切換至 Firebase 備援庫 🟡`);
      }

      // 步驟 2：切換至 Firebase Realtime Database 鏡像 (Replica)
      try {
        const firebaseResult = await fetchWithTimeout(firebaseUrl, 3000);
        if (firebaseResult) {
          setLocalCache(firebaseResult);
          updateDOM(firebaseResult);
          console.log("%c[DualDbLoader] 成功從備援鏡像庫 (Firebase RTDB) 載入資料 🚀", "color:#0284c7; font-weight:bold;");
          return { source: "FIREBASE_REPLICA", data: firebaseResult, status: "fallback_live" };
        }
        throw new Error("Firebase 鏡像庫回傳空資料");
      } catch (firebaseErr) {
        console.warn(`[DualDbLoader] Firebase 備援庫連線失敗 (${firebaseErr.message})，啟動本地韌性防護 🟠`);
      }

      // 步驟 3：極致降級保護 (Local Cache 或 打包底稿)
      const cached = getLocalCache();
      if (cached) {
        updateDOM(cached);
        console.log("%c[DualDbLoader] 成功從瀏覽器本機快取 (LocalStorage) 載入歷史資料 🛡️", "color:#f59e0b; font-weight:bold;");
        return { source: "LOCAL_CACHE", data: cached, status: "cached" };
      }

      const bundled = window.FLS_DEFAULT_SITE_DATA || {};
      updateDOM(bundled);
      console.log("%c[DualDbLoader] 使用打包本機預設資料 (Bundled Defaults) 📦", "color:#6b7280; font-weight:bold;");
      return { source: "BUNDLED_DEFAULTS", data: bundled, status: "default" };
    }
  };
})();

// 頁面載入完成後自動執行雙庫自適應讀取
if (typeof document !== "undefined") {
  document.addEventListener("DOMContentLoaded", () => {
    DualDbLoader.load();
  });
}

// 在瀏覽器主控台宣告版本
console.log(
  "%c FLS DUAL-DB ADAPTER %c v0.22 [Build 2026-09-25] ",
  "background: #ff6b00; color: #ffffff; padding: 2px 6px; border-radius: 3px 0 0 3px; font-weight: bold;",
  "background: #111827; color: #38bdf8; padding: 2px 6px; border-radius: 0 3px 3px 0; font-weight: bold;"
);
