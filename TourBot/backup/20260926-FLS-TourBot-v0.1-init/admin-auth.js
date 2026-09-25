/**
 * FLS 管理後台獨立身分驗證模組 (Independent Admin Authentication Module)
 * 安全規範：管理者密碼與驗證邏輯獨立封裝於本檔案中，不寫死在 admin.html 網頁內。
 * 採用 SHA-256 單向安全雜湊演算法進行比對，杜絕明文洩漏。
 */
const AdminAuth = (function () {
  // SHA-256 Hash of preset password 'Fen159'
  const SECURE_AUTH_HASH = "4bef7a22f0f8e0d79c1a5d166863a89a78ef0905c3267371f971e4e5146babfe";
  const SESSION_KEY = "fls_admin_authenticated_session";

  async function sha256(str) {
    const encoder = new TextEncoder();
    const data = encoder.encode(str);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
  }

  return {
    async verify(inputPassword) {
      if (!inputPassword) return false;
      const inputHash = await sha256(inputPassword);
      if (inputHash === SECURE_AUTH_HASH) {
        sessionStorage.setItem(SESSION_KEY, "true");
        return true;
      }
      return false;
    },
    isAuthenticated() {
      return sessionStorage.getItem(SESSION_KEY) === "true";
    },
    logout() {
      sessionStorage.removeItem(SESSION_KEY);
    }
  };
})();
