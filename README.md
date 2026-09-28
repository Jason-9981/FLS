# 威黃物流 (FLS) 蘋果極簡風格官網 ＆ 專屬網頁導覽 AI 機械人工作案

- **專案名稱**：FLS-TourBot-AppleStyle (導覽機械人工作案)
- **版本編號**：v0.1.2 (Build 2026-09-26)
- **所屬目錄**：`ai-FLS` / `導覽機械人`
- **負責人員**：Jason Chow (周志榮) ｜ 創新及科技發展部 (I&TD)
- **遵循標準**：`project-release-standards`

---

## 一、 工作案核心成果概述

1. **純粹蘋果極簡風格（Apple Minimalist Aesthetic）**：
   - 全面移除舊版管理層 4 大風格頂部切換列（風格 B/C/D 已抽離），專注於蘋果原汁原味的高質感毛玻璃（Glassmorphism）、微陰影與極簡黑白灰橙經典配色。
   - 保留全套完整多頁面結構：`index.html`、`about.html`、`services.html`、`brands.html`、`blog.html`、`media.html`、`contact.html`、`proposal.html`。

2. **專屬網頁導覽 AI 機械人（Tour Guide Bot）**：
   - **滾動位置智能感知**：採用現代瀏覽器原生 `IntersectionObserver`，訪客瀏覽到哪一個區塊（如 12萬呎倉、合作品牌、按日計租、八大服務），機械人即時自動切換並深入解讀。
   - **網頁未公開之深度商業情報**：導覽內容包含網頁上未印出的公司歷史內幕（1994年三黃集團專屬吊掛倉）、葵涌/荃灣/深圳三地樞紐具體分工、按日計租核心計費演算法等。
   - **頁面內容 100% 精準對齊**：
     - **服務範疇 (`services.html`)**：精準解讀八大核心物流與企業支援服務（智能倉存、電商 Fulfilment、定制增值 VAS、香港本地車隊、門市庫存及 POS 數據管理、貨倉 ERP 系統、電腦支援、船務支援），並貼心提示港深 6 大貨倉規格位於「聯絡我們」。
     - **旗下品牌 (`brands.html`)**：精準介紹 FLS 旗下多元品牌（Fenix Pet 寵物精品經銷與 Carry Kuma 智能上門儲存箱）；清楚區隔長期服務之國際時裝名牌客戶（ANTEPRIMA、Marimekko 等於首頁展示）。
     - **聯絡我們 (`contact.html`)**：整合 30 秒線上智能報價計算器與港深 6 大專業倉庫詳細規格與聯絡地址。
   - **擬真 AI 對話質感**：配備「正在思考中...」動態跳動點（Typing Indicator）以及每字 18ms 的打字機輸出特效（Typewriter Effect）。
   - **互動式快捷追問按鈕（Quick Reply Chips）**：每段導覽結束後附帶延伸話題，點擊後即時展開更深入的彩蛋解說。
   - **廣東話/中文語音朗讀**：整合瀏覽器原生 `Web Speech API`，點擊喇叭按鈕即可同步聽語音導覽。

3. **專屬 3D 高清吉祥物頭像（極簡純粹美感）**：
   - 預設專用 3D 高清立體圓潤質感頭像（`images/tour-bot-avatar-hd.jpg`，自帶向量 SVG 備援）。
   - 全面取消粗像素模式與模式切換開關，徹底移除「粗像素」與「3D高清」文字字眼，導覽框頂部改為高雅的「當前導覽重點」標籤，整體介面更加乾淨純粹，符合蘋果極簡美學。

---

## 二、 檔案結構清單

```
導覽機械人/
├── index.html            # 官網主頁（已整合 section ID 與導覽機械人）
├── about.html            # 關於威黃（30 年集團傳承）
├── services.html         # 八大核心物流與企業支援服務（移除 6 倉避免重複）
├── brands.html           # 旗下品牌（Fenix Pet & Carry Kuma）
├── blog.html             # 物流網誌
├── media.html            # 新聞與媒體
├── contact.html          # 聯絡我們、線上估價 ＆ 港深 6 大倉庫詳細規格
├── proposal.html         # 企劃匯報
├── disclaimer.html       # 免責聲明
├── admin.html            # 管理後台
├── tour-bot.css          # 導覽機械人專用樣式（蘋果毛玻璃 + 3D 高清專屬）
├── tour-bot.js           # 導覽機械人核心邏輯（滾動感知 + 知識庫 + 追問）
├── styles.css            # 蘋果極簡風全站樣式
├── script.js             # 前台主要互動邏輯
├── site-data.js          # 官網集中資料庫（6大倉、合作客戶等）
├── dual-db-loader.js     # Oracle APEX / Firebase 雙資料庫容災載入器
├── geo-seo-head.html     # GEO (生成式AI搜尋) 與 SEO 模組
├── images/               # 圖檔庫（3D 高清頭像、Logo、倉儲實景）
│   ├── tour-bot-avatar-hd.jpg     # 3D 高清立體頭像
│   └── ...
├── backup/               # 歷史備份資料夾
└── FLS-TourBot-AppleStyle-v0.1.zip # 完整發佈壓縮包
```

---

## 三、 自訂更換頭像指引

如需將自訂頭像更換：
1. 將頭像圖片命名為 `tour-bot-avatar-hd.jpg`，放入 `images/` 資料夾覆蓋原檔。
2. 重新整理網頁即可見到效果！
