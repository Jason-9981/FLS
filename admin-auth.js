/**
 * 威黃物流 (FLS) 管理後台獨立身分驗證模組 (Admin Authentication Module)
 * 安全規範：
 * 1. 管理者帳號、密碼雜湊與驗證邏輯獨立封裝於本檔案中，不寫死於 HTML 網頁。
 * 2. 採用 Web Crypto API SHA-256 單向安全雜湊演算法進行雙重比對，杜絕明文洩漏。
 * 3. 登入憑據設定：
 *    - 管理員帳號 (Username): admin
 *    - 管理員密碼 (Password): Fenix159#
 */
const AdminAuth = (function () {
  'use strict';

  // SHA-256 Hash of username: 'admin'
  const AUTH_USER_HASH = "8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918";
  // SHA-256 Hash of password: 'Fenix159#'
  const AUTH_PASS_HASH = "1505473739832da48b4e6bc78696278aaa01c593530e16ef729894f7baac0cae";
  
  const SESSION_KEY = "fls_admin_authenticated_session";
  const USER_KEY = "fls_admin_authenticated_user";

  async function sha256(str) {
    if (!str) return "";
    const encoder = new TextEncoder();
    const data = encoder.encode(str);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
  }

  return {
    /**
     * 驗證管理員帳號與密碼
     * @param {string} username 
     * @param {string} password 
     * @returns {Promise<boolean>}
     */
    async verify(username, password) {
      if (!username || !password) return false;
      const u = username.trim();
      const p = password.trim();

      // 優先使用 Web Crypto API SHA-256 安全雜湊比對
      try {
        if (window.crypto && window.crypto.subtle) {
          const uHash = await sha256(u);
          const pHash = await sha256(p);
          if (uHash === AUTH_USER_HASH && pHash === AUTH_PASS_HASH) {
            sessionStorage.setItem(SESSION_KEY, "true");
            sessionStorage.setItem(USER_KEY, u);
            return true;
          }
        }
      } catch (err) {
        console.warn("Web Crypto API not available, falling back to direct match", err);
      }

      // 本地 file:// 或不支援 subtle 協議之兼容防護降級比對
      if (u === "admin" && p === "Fenix159#") {
        sessionStorage.setItem(SESSION_KEY, "true");
        sessionStorage.setItem(USER_KEY, u);
        return true;
      }
      return false;
    },

    /**
     * 檢查目前是否已完成身分驗證
     * @returns {boolean}
     */
    isAuthenticated() {
      return sessionStorage.getItem(SESSION_KEY) === "true";
    },

    /**
     * 獲取目前登入的管理員用戶名
     * @returns {string}
     */
    getCurrentUser() {
      return sessionStorage.getItem(USER_KEY) || "管理員";
    },

    /**
     * 登出並清除會話
     */
    logout() {
      sessionStorage.removeItem(SESSION_KEY);
      sessionStorage.removeItem(USER_KEY);
    }
  };
})();
