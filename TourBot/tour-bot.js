/**
 * 威黃物流服務有限公司 (FLS) - 專屬網頁導覽 AI 機械人 (Tour Guide Bot)
 * 版本：v0.1.2 (Build 2026-09-26)
 * 最新升級：
 * 1. 智能會話記憶（Session Memory）：進入網站只在第一次作簡要自我介紹，換頁/開新頁絕不重複「你好呀...」客套話，直接切入當前頁面核心主題！
 * 2. 頁面專屬主題庫：自動感應當前頁面（首頁、關於威黃、服務範疇、合作品牌、聯絡報價等），提供針對性的深度解說。
 * 3. 滾動區塊開門見山：首頁各區塊解密直接講乾貨、冷知識與商業情報，去除冗長套話。
 * 4. 徹底修復收起態（Launcher Capsule）排版與頭像載入。
 * 5. 雙吉祥物頭像模式即時切換 (粗像素 Pixelated Crisp ⇄ 3D 高清 Smooth HD)。
 */

(function () {
  'use strict';

  // 1. Triple In-App Version Verification: Console Self-Report
  console.log(
    "%c FLS Tour Bot %c v0.1.2 [2026-09-26] ",
    "background:#ff6b00;color:#fff;padding:2px 6px;border-radius:3px 0 0 3px;font-weight:bold;",
    "background:#1d1d1f;color:#00f2fe;padding:2px 6px;border-radius:0 3px 3px 0;"
  );

  // 判斷當前頁面檔名
  function getCurrentPageName() {
    const path = window.location.pathname;
    const page = path.split('/').pop().toLowerCase() || 'index.html';
    return page.includes('.html') ? page : 'index.html';
  }

  // 檢查是否已在本次會話中問候過
  function hasUserBeenGreeted() {
    return sessionStorage.getItem('fls_tour_bot_has_greeted') === 'true';
  }

  function markUserAsGreeted() {
    sessionStorage.setItem('fls_tour_bot_has_greeted', 'true');
  }

  // 2. 導覽資料庫：首頁各區塊 + 全站各子頁面專屬解說（開門見山，無重複套話）
  const TOUR_KNOWLEDGE = {
    // --- 首頁各區塊 (Index Sections) ---
    'sec-hero': {
      title: '首頁啟航 · 30年信譽傳承',
      shortTag: '首頁啟航',
      // 初次進入有簡短招呼，非初次則開門見山講重點
      getFirstTimeText: () => '你好！我係導覽員小威，身邊呢位戴眼鏡嘅係小黃。歡迎參觀威黃物流（FLS）！向下滾動我會為你解密每個位置嘅物流內幕！\n\n【幕後解密】FLS 早在 1994 年就已經係香港時裝巨頭 FENIX GROUP（三黃集團）嘅專屬物流心臟。當年全港第一批進口名牌嘅恆溫吊掛時裝倉，就係由我哋達利中心工程團隊一手打造！',
      getDirectText: () => '【首頁總覽】歡迎返嚟首頁！向下滾動即可隨時探索 12 萬呎港深倉網、按日計租與八大核心服務，我會即時為你解讀幕後運作細節。',
      quickReplies: [
        { label: '🤔 點解叫「威黃物流」？', reply: '【品牌由來】母公司 FENIX GROUP 在香港創立時中文名叫「三黃集團」，旗下代理 ANTEPRIMA、ATSURO TAYAMA 等一線名牌。「威黃物流」的「威」代表靈活敏銳，「黃」傳承自三黃集團穩健基石，專為頂級品牌與新世代電商保駕護航！' },
        { label: '🎮 頭頂個手掣代表咩意思？', reply: '【吉祥物設計彩蛋】哈哈，眼利！頭頂個遊戲手掣代表我們像打機一樣操控自如的智慧數據系統；手中捧著的書本代表嚴謹的 ISO 與標準作業程序（SOP），快得來又極度精準！' }
      ]
    },

    'sec-clients': {
      title: '合作品牌與品質保證',
      shortTag: '國際名牌信譽',
      text: '【合作品牌內幕】上方走馬燈嘅 ANTEPRIMA、Marimekko 同 ATSURO TAYAMA 動輒一件時裝幾千至上萬元，對防塵、防潮、防蟲以及熨燙嘅要求極高！達利中心 5 樓特別設有獨立安保隔離吊掛倉，30 年來破損失竊率近乎 0！',
      quickReplies: [
        { label: '👗 吊掛倉有咩咁特別？', reply: '普通貨倉是摺好放箱，但高級西裝與晚裝一壓就會起皺變形！我們的 GOH（Garment on Hanger）專用吊掛軌道系統，衣服從深圳或機場抵港、上架到出貨送去專櫃，全程保持立體懸掛，店舖拆袋即可直接上架賣！' }
      ]
    },

    'sec-bento-scale': {
      title: '港深 6 大專業倉儲樞紐',
      shortTag: '12萬呎網絡佈局',
      text: '【港深雙城樞紐】120,000+ 呎倉儲策略性分佈於三地：\n1. 葵涌達利中心 5 樓（總部、旗艦精品恆溫倉及高周轉電商專區）\n2. 荃灣永得利中心（11樓大宗高位貨架倉、7樓增值加工中心 VAS Hub）\n3. 深圳龍崗大運軟件小鎮跨境物流園（中港通關與境內集運樞紐）！',
      quickReplies: [
        { label: '💰 點解真係可以「按日計租」？', reply: '傳統工廈一簽就要 2 至 3 年死約，淡季得幾板貨都要交幾千呎租金！FLS 計費模組精確到每一天：今日進 10 板收 10 板錢，明天爆單賣出 5 板，後天租金即刻減半，真正幫創業者打破死約束縛！' },
        { label: '📍 點解選址葵涌達利中心？', reply: '因為達利中心緊鄰中港貨櫃碼頭及 3 號幹線，往返葵涌碼頭只需 8 分鐘，到香港國際機場僅 25 分鐘，是香港物流的最黃金咽喉點！' }
      ]
    },

    'sec-core-services': {
      title: '八大核心全方位企業支援',
      shortTag: '八大一站式閉環',
      text: '【一站式閉環優勢】普通 3PL 貨倉只負責搬貨，電腦問題叫你找 IT，報關叫你找船務報關行。FLS 是全港少見的「物流 + 門市 IT 電腦軟硬體支援 + 船務通關」全包服務！由店舖網絡、卡機到自研 EBP 查貨系統，一個電話全部搞定。',
      quickReplies: [
        { label: '⚡ EBP 系統有咩功能？', reply: 'EBP 是我們內部研發團隊為客戶打造的 24 小時在線雲端倉存系統。支援用手機即時查庫存、抓取訂單追蹤碼，更可直接用 API 對接 Shopify、SHOPLINE 及 HKTVmall，實現自動出貨！' },
        { label: '✂️ VAS 增值服務包咩？', reply: '包括：專業服裝蒸氣熨燙、換吊牌、改衣、打印貼上香港海關規定的繁體中文標籤、商品品質檢驗（QC），以及精美禮盒絲帶包裝等！' }
      ]
    },

    'sec-dual-solutions': {
      title: '中小網店 vs 企業 3PL',
      shortTag: '雙軌度身訂造',
      text: '【中小網店零負擔】將貨存入 FLS，我們為你自動接單、條碼防呆揀貨、並享受大客快遞優惠價。無論是每月幾十單的獨立網店，還是每月幾萬單的跨國品牌，享受的都是同樣嚴謹的企業級倉配標準！',
      quickReplies: [
        { label: '📦 大促銷爆單處理得切嗎？', reply: '我們最高日出貨動能超過 12,000 件！配備自動流水線與條碼覆核作業，雙11或節慶大促當日截單前訂單保證當日出庫！' }
      ]
    },

    'sec-comparison': {
      title: '自租工廈 vs FLS 智慧物流',
      shortTag: '精打細算對比',
      text: '【精打細算成本帳】自己租 500 呎工廈要 8,000-10,000 元，請個全職倉務員連 MPF 要 15,000 元，加上冷氣電費、快遞沒量拿不到折扣... 轉用 FLS 按日計租 + 一件代發，每月固定營運成本即刻慳 35% 至 45% 以上！',
      quickReplies: [
        { label: '🤝 請問最少幾板起租？', reply: '一板即可起租！甚至只有幾箱小件貨品都可以按實際佔用空間計費，完全無最低消費門檻，對剛起步的網店非常友好！' }
      ]
    },

    'sec-cta': {
      title: '專屬方案諮詢與預約',
      shortTag: '立即行動',
      text: '【行到最底喇！】想試算具體倉租、或者了解你的貨物適合哪一個倉庫，點擊上方按鈕即可獲取報價，或者直接透過 WhatsApp 找我們的物流專員！小威和小黃隨時為你提供支援！',
      quickReplies: [
        { label: '💬 WhatsApp 找專員傾傾', reply: '你可以點擊畫面上的 WhatsApp 按鈕，或直接致電 (852) 2487 1968。Jason 同我們團隊會即時為你評估最划算的物流方案！' }
      ]
    },

    // --- 各子頁面專屬導覽主題 (Sub-pages) ---
    'page-about': {
      title: '關於威黃 · 30年信譽傳承',
      shortTag: '關於威黃',
      text: '【關於威黃】呢度記錄咗我哋自 1994 年成立 30 年來嘅發展歷程。母公司為 FENIX GROUP（三黃集團），當年為咗支持集團旗下嘅國際時裝名牌，專門喺葵涌達利中心建立咗全港最高規格嘅恆溫吊掛倉，守護品牌價值。',
      quickReplies: [
        { label: '🏢 母公司背景有幾強？', reply: '母公司 FENIX GROUP HOLDINGS LTD 深耕亞太精品零售與品牌代理逾 30 年，代理包括 ANTEPRIMA、Marimekko、ATSURO TAYAMA 等國際名牌，信譽卓越。' }
      ]
    },

    'page-services': {
      title: '服務範疇與 6 大倉網絡',
      shortTag: '服務範疇',
      text: '【服務範疇與多倉網絡】呢度完整展示咗 FLS 嘅 6 大專業倉儲樞紐同 8 大供應鏈服務。支援中小網店「按日計租、一板起租」，所有倉庫均配備條碼防呆與 EBP 即時查貨系統！',
      quickReplies: [
        { label: '🏭 葵涌同荃灣倉有咩分工？', reply: '葵涌達利中心為總部及精品恆溫電商倉，鄰近碼頭專出急件；荃灣永得利中心則為大宗立體重貨架與 VAS 增值加工中心，各展所長！' }
      ]
    },

    'page-brands': {
      title: '旗下品牌與合作品牌',
      shortTag: '旗下品牌',
      text: '【合作品牌走廊】呢度展示緊我哋多年來長期服務嘅國際精品名牌。高價位時裝與皮具對於防塵、防潮、溫控嘅要求極嚴，30 年來我們團隊始終保持著無可挑剔的專業標準。',
      quickReplies: [
        { label: '👜 哪些品牌由 FLS 負責？', reply: '包括 ANTEPRIMA、ANTEPRIMA WIREBAG、Marimekko、ATSURO TAYAMA、Cocktail、The Little Shop 等知名零售品牌！' }
      ]
    },

    'page-contact': {
      title: '聯絡我們與線上估價',
      shortTag: '聯絡與報價',
      text: '【聯絡與報價】想了解你嘅貨物適合放邊個倉，或者試算按日計租嘅成本？喺呢度填寫需求，或者直接 WhatsApp 搵我哋團隊即可極速獲取專屬報價！',
      quickReplies: [
        { label: '⚡ 最快幾時覆報價？', reply: '工作天內收到查詢後，我們物流專員一般會在 30 分鐘至 2 小時內透過電話或 WhatsApp 為你提供初步評估與方案建議！' }
      ]
    },

    'page-blog': {
      title: '物流網誌與實戰指南',
      shortTag: '物流網誌',
      text: '【物流網誌】呢度匯集咗香港電商倉存、跨境物流通關及供應鏈營運嘅最新市場動態、實戰分析與行業乾貨。',
      quickReplies: [
        { label: '📖 網店入倉有咩注意事項？', reply: '建議貨品入倉前先預備好標準條碼標籤（Barcode），並按 SKU 分箱清點。我們會提供標準送貨預報表，確保當日入庫即日上架！' }
      ]
    },

    'page-media': {
      title: '新聞及媒體中心',
      shortTag: '新聞媒體',
      text: '【新聞及媒體】記錄威黃物流在智慧供應鏈升級、綠色物流、企業合作及行業研討活動的最新新聞動態。',
      quickReplies: [
        { label: '📰 最近有咩升級項目？', reply: '我們近期全面完成了港深雙資料庫容災架構升級、自研 EBP 查貨系統手機版對接，以及葵涌總部電商履約流水線自動化擴容！' }
      ]
    },

    'page-proposal': {
      title: '管理層企劃匯報',
      shortTag: '企劃匯報',
      text: '【企劃匯報】本頁面為管理層專用之新世代官網改版企劃案，記錄雙資料庫容災架構、GEO/SEO 旗艦升級及多租戶部署標準。',
      quickReplies: [
        { label: '📊 雙資料庫架構有咩優勢？', reply: '以 Oracle APEX 作為 Master 主庫，Firebase Realtime DB 作為 Replica 備援庫。前台具備 1.5 秒無縫容災切換，確保 100% 永不白屏！' }
      ]
    },

    'page-generic': {
      title: '威黃物流智慧導覽',
      shortTag: '導覽中',
      text: '歡迎瀏覽威黃物流服務有限公司。如有任何倉儲、配送或報價問題，隨時點擊下方快捷按鈕，小威與小黃隨時為你解答！',
      quickReplies: [
        { label: '💡 了解核心優勢', reply: 'FLS 具備 30 年品牌信譽、港深 6 大樞紐 12 萬呎倉、中小網店按日計租、一站式 IT 與物流閉環支援！' }
      ]
    }
  };

  // 3. 頭像配置
  const AVATAR_CONFIG = {
    pixel: {
      src: 'images/tour-bot-avatar-pixel.jpg',
      label: '粗像素',
      fallback: 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="48" height="48" style="image-rendering:pixelated;shape-rendering:crispEdges;"><rect width="48" height="48" fill="#fff4e6"/><rect x="16" y="8" width="16" height="6" fill="#94a3b8"/><rect x="18" y="6" width="12" height="2" fill="#64748b"/><rect x="22" y="10" width="4" height="2" fill="#ef4444"/><rect x="12" y="14" width="24" height="24" rx="4" fill="#ffffff" stroke="#1e293b" stroke-width="2"/><circle cx="19" cy="22" r="2" fill="#1e293b"/><circle cx="29" cy="22" r="2" fill="#1e293b"/><rect x="16" y="25" width="2" height="1" fill="#f43f5e"/><rect x="30" y="25" width="2" height="1" fill="#f43f5e"/><path d="M22 26 Q24 28 26 26" stroke="#1e293b" stroke-width="1.5" fill="none"/><rect x="18" y="28" width="12" height="10" fill="#0284c7" stroke="#1e293b" stroke-width="1.5"/></svg>'
      )
    },
    hd: {
      src: 'images/tour-bot-avatar-hd.jpg',
      label: '3D高清',
      fallback: 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="48" height="48"><rect width="48" height="48" rx="24" fill="#f8fafc"/><ellipse cx="22" cy="27" rx="14" ry="15" fill="#f1f5f9"/><circle cx="18" cy="23" r="2" fill="#0f172a"/><circle cx="26" cy="23" r="2" fill="#0f172a"/><circle cx="15.5" cy="26" r="2" fill="#fda4af"/><circle cx="28.5" cy="26" r="2" fill="#fda4af"/><path d="M21 27 Q22 28.5 23 27" stroke="#334155" stroke-width="1.2" stroke-linecap="round" fill="none"/><ellipse cx="36" cy="30" rx="8" ry="9" fill="#f1f5f9"/><circle cx="33" cy="28" r="3.5" fill="none" stroke="#0f172a" stroke-width="1.5"/><circle cx="39" cy="28" r="3.5" fill="none" stroke="#0f172a" stroke-width="1.5"/></svg>'
      )
    }
  };

  // 狀態管理
  let currentAvatarMode = localStorage.getItem('fls_bot_avatar_mode') || 'pixel';
  let isPanelOpen = localStorage.getItem('fls_bot_open') !== 'false';
  let isSpeechEnabled = localStorage.getItem('fls_bot_speech') === 'true';
  let activeTourKey = null;
  let typingInterval = null;

  // 安全賦予圖片源 (JS 事件監聽，防 HTML 標籤破裂)
  function applySafeAvatar(imgEl, mode) {
    if (!imgEl) return;
    const cfg = AVATAR_CONFIG[mode] || AVATAR_CONFIG.pixel;
    imgEl.onerror = null;
    imgEl.onerror = function () {
      this.onerror = null;
      this.src = cfg.fallback;
    };
    imgEl.src = cfg.src;
  }

  // 語音朗讀合成器
  function speakText(text) {
    if (!isSpeechEnabled || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const cleanText = text.replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '')
        .replace(/【.*?】/g, '');
      const utter = new SpeechSynthesisUtterance(cleanText);
      utter.lang = 'zh-HK';
      utter.rate = 1.05;
      window.speechSynthesis.speak(utter);
    } catch (e) {
      console.warn('[TourBot] 語音朗讀未就緒', e);
    }
  }

  // 構建 DOM 元素
  function buildTourBotUI() {
    const container = document.createElement('div');
    container.id = 'fls-tour-bot-container';
    container.className = currentAvatarMode === 'pixel' ? 'fls-mode-pixel' : 'fls-mode-hd';

    container.innerHTML = `
      <!-- 展開的導覽對話框 -->
      <div class="fls-bot-panel ${isPanelOpen ? 'active' : ''}" id="fls-bot-panel">
        <div class="fls-bot-header">
          <div class="fls-header-left">
            <div class="fls-bot-header-avatar" id="fls-header-avatar-box">
              <img id="fls-bot-avatar-img" alt="FLS 導覽員" />
            </div>
            <div class="fls-bot-info">
              <h3>FLS 智慧導覽員 <span class="fls-online-dot"></span> <span style="font-size:0.75rem; color:var(--bot-accent); font-weight:700;">在線</span></h3>
              <p>小威 & 小黃 (隨頁解密內幕)</p>
            </div>
          </div>
          <div class="fls-header-actions">
            <button type="button" class="fls-icon-btn" id="fls-btn-speech" title="切換語音朗讀">
              ${isSpeechEnabled ? '🔊' : '🔇'}
            </button>
            <button type="button" class="fls-icon-btn" id="fls-btn-minimize" title="收起導覽框">
              ✕
            </button>
          </div>
        </div>

        <!-- 模式切換列 (粗像素 / 3D 高清) -->
        <div class="fls-mode-toolbar">
          <div class="fls-segmented-control" role="group" aria-label="頭像模式切換">
            <button type="button" class="fls-seg-btn ${currentAvatarMode === 'pixel' ? 'active' : ''}" data-mode="pixel">👾 粗像素</button>
            <button type="button" class="fls-seg-btn ${currentAvatarMode === 'hd' ? 'active' : ''}" data-mode="hd">🎨 3D高清</button>
          </div>
          <div class="fls-current-topic-pill" id="fls-topic-pill">
            📍 準備導覽
          </div>
        </div>

        <!-- 對話內容區 -->
        <div class="fls-bot-chat-body" id="fls-chat-body">
          <div class="fls-typing-indicator" id="fls-typing-indicator" style="display:none;">
            <span></span><span></span><span></span>
          </div>
        </div>

        <!-- 底部快捷列 -->
        <div class="fls-bot-footer">
          <button type="button" class="fls-btn-replay" id="fls-btn-replay">
            🔄 重講當前頁段
          </button>
          <a href="contact.html#quote" class="fls-btn-quote-link">
            試算報價 →
          </a>
        </div>
      </div>

      <!-- 縮小懸浮膠囊按鈕 (Launcher) -->
      <div class="fls-bot-launcher" id="fls-bot-launcher" style="${isPanelOpen ? 'display:none;' : 'display:flex;'}">
        <div class="fls-launcher-avatar" id="fls-launcher-avatar-box">
          <img id="fls-launcher-avatar-img" alt="FLS 導覽員" />
        </div>
        <div class="fls-launcher-text">
          <span class="fls-launcher-title">
            專屬導覽員小威
            <span class="fls-online-dot"></span>
          </span>
          <span class="fls-launcher-sub" id="fls-launcher-sub-text">點擊隨頁解密 💡</span>
        </div>
      </div>
    `;

    document.body.appendChild(container);

    applySafeAvatar(document.getElementById('fls-bot-avatar-img'), currentAvatarMode);
    applySafeAvatar(document.getElementById('fls-launcher-avatar-img'), currentAvatarMode);

    bindEvents();
    startInitialPageTour();
  }

  // 切換頭像風格
  function setAvatarMode(mode) {
    if (!AVATAR_CONFIG[mode]) return;
    currentAvatarMode = mode;
    localStorage.setItem('fls_bot_avatar_mode', mode);

    const container = document.getElementById('fls-tour-bot-container');
    if (container) {
      container.className = mode === 'pixel' ? 'fls-mode-pixel' : 'fls-mode-hd';
    }

    applySafeAvatar(document.getElementById('fls-bot-avatar-img'), mode);
    applySafeAvatar(document.getElementById('fls-launcher-avatar-img'), mode);

    document.querySelectorAll('.fls-seg-btn').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-mode') === mode);
    });

    console.log(`[TourBot] 切換頭像顯示模式至: ${AVATAR_CONFIG[mode].label}`);
  }

  // 面板展開與收起
  function togglePanel(open) {
    isPanelOpen = typeof open === 'boolean' ? open : !isPanelOpen;
    localStorage.setItem('fls_bot_open', isPanelOpen);

    const panel = document.getElementById('fls-bot-panel');
    const launcher = document.getElementById('fls-bot-launcher');

    if (panel && launcher) {
      if (isPanelOpen) {
        panel.classList.add('active');
        launcher.style.display = 'none';
        if (activeTourKey && TOUR_KNOWLEDGE[activeTourKey]) {
          const chatBody = document.getElementById('fls-chat-body');
          if (chatBody && chatBody.children.length <= 1) {
            presentTourMessage(activeTourKey, true);
          }
        }
      } else {
        panel.classList.remove('active');
        launcher.style.display = 'flex';
      }
    }
  }

  // 逐字打字輸出效果
  function typeWriter(element, text, onComplete) {
    clearInterval(typingInterval);
    element.textContent = '';
    let i = 0;
    const speed = 18;

    typingInterval = setInterval(() => {
      if (i < text.length) {
        element.textContent += text.charAt(i);
        i++;
        const chatBody = document.getElementById('fls-chat-body');
        if (chatBody) chatBody.scrollTop = chatBody.scrollHeight;
      } else {
        clearInterval(typingInterval);
        if (typeof onComplete === 'function') onComplete();
      }
    }, speed);
  }

  // 核心輸出：動態判斷是否為初次問候，消除重複套話
  function presentTourMessage(key, forceReplay = false) {
    const data = TOUR_KNOWLEDGE[key];
    if (!data) return;

    activeTourKey = key;

    // 決定要輸出的文字：
    // 若有自訂函數（如 sec-hero 判斷是否初次進站），則動態取得
    let outputText = data.text;
    if (key === 'sec-hero') {
      if (!hasUserBeenGreeted()) {
        outputText = data.getFirstTimeText();
        markUserAsGreeted(); // 標記已完成首次打招呼，之後換頁絕不重複
      } else {
        outputText = data.getDirectText(); // 非初次，直接講重點
      }
    } else {
      // 任何其他子頁面或區塊：標記已問候
      markUserAsGreeted();
    }

    const topicPill = document.getElementById('fls-topic-pill');
    if (topicPill) topicPill.textContent = `📍 ${data.shortTag}`;

    const launcherSub = document.getElementById('fls-launcher-sub-text');
    if (launcherSub) launcherSub.textContent = `導覽中：${data.shortTag}`;

    if (!isPanelOpen && !forceReplay) return;

    const chatBody = document.getElementById('fls-chat-body');
    const indicator = document.getElementById('fls-typing-indicator');
    if (!chatBody) return;

    if (indicator) {
      indicator.style.display = 'inline-flex';
      chatBody.appendChild(indicator);
      chatBody.scrollTop = chatBody.scrollHeight;
    }

    setTimeout(() => {
      if (indicator) indicator.style.display = 'none';

      const msgDiv = document.createElement('div');
      msgDiv.className = 'fls-msg-bubble fls-msg-bot';
      msgDiv.innerHTML = `
        <div class="fls-msg-meta">💡 ${data.title}</div>
        <div class="fls-msg-content"></div>
        <div class="fls-quick-replies" style="display:none;"></div>
      `;

      chatBody.appendChild(msgDiv);
      const contentEl = msgDiv.querySelector('.fls-msg-content');
      const repliesEl = msgDiv.querySelector('.fls-quick-replies');

      typeWriter(contentEl, outputText, () => {
        if (data.quickReplies && data.quickReplies.length > 0) {
          repliesEl.innerHTML = data.quickReplies.map((qr, index) => `
            <button type="button" class="fls-chip-btn" data-qr-index="${index}">
              <span>${qr.label}</span>
              <span>➔</span>
            </button>
          `).join('');
          repliesEl.style.display = 'flex';

          repliesEl.querySelectorAll('.fls-chip-btn').forEach(btn => {
            btn.addEventListener('click', function () {
              const idx = parseInt(this.getAttribute('data-qr-index'), 10);
              handleQuickReply(data.quickReplies[idx]);
            });
          });
        }
        chatBody.scrollTop = chatBody.scrollHeight;
      });

      speakText(outputText);
    }, 300);
  }

  // 處理追問按鈕點擊
  function handleQuickReply(qr) {
    const chatBody = document.getElementById('fls-chat-body');
    if (!chatBody) return;

    const userMsg = document.createElement('div');
    userMsg.className = 'fls-msg-bubble fls-msg-user';
    userMsg.textContent = qr.label;
    chatBody.appendChild(userMsg);

    const indicator = document.getElementById('fls-typing-indicator');
    if (indicator) {
      indicator.style.display = 'inline-flex';
      chatBody.appendChild(indicator);
      chatBody.scrollTop = chatBody.scrollHeight;
    }

    setTimeout(() => {
      if (indicator) indicator.style.display = 'none';

      const botReply = document.createElement('div');
      botReply.className = 'fls-msg-bubble fls-msg-bot';
      botReply.innerHTML = `
        <div class="fls-msg-meta">💬 深入解密</div>
        <div class="fls-msg-content"></div>
      `;
      chatBody.appendChild(botReply);

      const contentEl = botReply.querySelector('.fls-msg-content');
      typeWriter(contentEl, qr.reply, () => {
        chatBody.scrollTop = chatBody.scrollHeight;
      });

      speakText(qr.reply);
    }, 280);
  }

  // 啟動當前頁面的初始導覽
  function startInitialPageTour() {
    const page = getCurrentPageName();

    if (page === 'index.html' || page === '') {
      // 首頁：初始化滾動監聽
      initIndexScrollObserver();
      setTimeout(() => {
        if (!activeTourKey) presentTourMessage('sec-hero');
      }, 400);
    } else {
      // 子頁面：依據頁面給予專屬解說，直接開門見山！
      let pageKey = 'page-generic';
      if (page.includes('about')) pageKey = 'page-about';
      else if (page.includes('services')) pageKey = 'page-services';
      else if (page.includes('brands')) pageKey = 'page-brands';
      else if (page.includes('contact')) pageKey = 'page-contact';
      else if (page.includes('blog')) pageKey = 'page-blog';
      else if (page.includes('media')) pageKey = 'page-media';
      else if (page.includes('proposal')) pageKey = 'page-proposal';

      setTimeout(() => {
        presentTourMessage(pageKey);
      }, 400);
    }
  }

  // 首頁滾動位置智能感知
  function initIndexScrollObserver() {
    const targetSections = [
      'sec-hero',
      'sec-clients',
      'sec-bento-scale',
      'sec-core-services',
      'sec-dual-solutions',
      'sec-comparison',
      'sec-cta'
    ];

    const elementsToObserve = targetSections
      .map(id => document.getElementById(id))
      .filter(el => el !== null);

    if (elementsToObserve.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const secId = entry.target.id;
          if (secId && secId !== activeTourKey && TOUR_KNOWLEDGE[secId]) {
            console.log(`[TourBot] 偵測到用戶閱讀新區塊: #${secId}`);
            presentTourMessage(secId);
          }
        }
      });
    }, {
      threshold: 0.35,
      rootMargin: '0px 0px -15% 0px'
    });

    elementsToObserve.forEach(el => observer.observe(el));
  }

  // 綁定按鈕事件
  function bindEvents() {
    const launcher = document.getElementById('fls-bot-launcher');
    const btnMin = document.getElementById('fls-btn-minimize');
    if (launcher) launcher.addEventListener('click', () => togglePanel(true));
    if (btnMin) btnMin.addEventListener('click', () => togglePanel(false));

    document.querySelectorAll('.fls-seg-btn').forEach(btn => {
      btn.addEventListener('click', function () {
        setAvatarMode(this.getAttribute('data-mode'));
      });
    });

    const btnSpeech = document.getElementById('fls-btn-speech');
    if (btnSpeech) {
      btnSpeech.addEventListener('click', () => {
        isSpeechEnabled = !isSpeechEnabled;
        localStorage.setItem('fls_bot_speech', isSpeechEnabled);
        btnSpeech.textContent = isSpeechEnabled ? '🔊' : '🔇';
        if (isSpeechEnabled && activeTourKey && TOUR_KNOWLEDGE[activeTourKey]) {
          const data = TOUR_KNOWLEDGE[activeTourKey];
          speakText(typeof data.getDirectText === 'function' ? data.getDirectText() : data.text);
        } else if (!isSpeechEnabled && 'speechSynthesis' in window) {
          window.speechSynthesis.cancel();
        }
      });
    }

    const btnReplay = document.getElementById('fls-btn-replay');
    if (btnReplay) {
      btnReplay.addEventListener('click', () => {
        if (activeTourKey) {
          presentTourMessage(activeTourKey, true);
        }
      });
    }
  }

  // 頁面載入完成時啟動
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', buildTourBotUI);
  } else {
    buildTourBotUI();
  }

})();
