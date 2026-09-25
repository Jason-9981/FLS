/**
 * 威黃物流服務有限公司 (FLS) - 專屬網頁導覽 AI 機械人 (Tour Guide Bot)
 * 版本：v0.1 (Build 2026-09-26)
 * 特色：
 * 1. 滾動位置智能感知 (IntersectionObserver 自動追蹤目前閱讀位置)
 * 2. 雙吉祥物頭像模式即時切換 (粗像素 Pixelated Crisp ⇄ 3D 高清 Smooth HD)
 * 3. 網頁未公開之深度物流內幕、營運秘辛與冷知識彩蛋
 * 4. 擬真打字機動畫 (Typewriter Effect) + 思考等待跳動點
 * 5. 互動式快捷追問按鈕 (Quick Reply Chips)
 * 6. 原生廣東話/中文語音朗讀支援 (Web Speech API)
 */

(function () {
  'use strict';

  // 1. Triple In-App Version Verification: Console Self-Report
  console.log(
    "%c FLS Tour Bot %c v0.1 [2026-09-26] ",
    "background:#ff6b00;color:#fff;padding:2px 6px;border-radius:3px 0 0 3px;font-weight:bold;",
    "background:#1d1d1f;color:#00f2fe;padding:2px 6px;border-radius:0 3px 3px 0;"
  );

  // 2. 導覽資料庫：包含網頁上未印出的獨家商業與營運細節
  const TOUR_KNOWLEDGE = {
    // 首頁頂部 (Hero)
    'sec-hero': {
      title: '歡迎光臨 FLS 威黃物流',
      shortTag: '首頁啟航',
      text: '你好呀！我是你的專屬 AI 導覽員小威，身邊這位戴黑框眼鏡的是小黃！\n\n【幕後解密】網頁畫面上雖然寫著 30 年經驗，但其實 FLS 早在 1994 年就已經是香港知名時裝集團 FENIX GROUP 的專屬物流心臟！當年全香港第一批進口頂級名牌的吊掛時裝與精品皮具倉，就是由我們達利中心工程團隊一手打造。你一邊向下滾動，我會一邊為你揭曉網頁上看不到的物流內幕！',
      quickReplies: [
        { label: '🤔 點解叫「威黃物流」？', reply: '【品牌由來】母公司 FENIX GROUP 在香港創立時中文名叫「三黃集團」，旗下代理 ANTEPRIMA、ATSURO TAYAMA 等一線名牌。「威黃物流」的「威」代表靈活敏銳，「黃」傳承自三黃集團穩健基石，專為頂級品牌與新世代電商保駕護航！' },
        { label: '🎮 頭頂個手掣代表咩意思？', reply: '【吉祥物設計彩蛋】哈哈，眼利！頭頂個遊戲手掣代表我們像打機一樣操控自如的智慧數據系統；手中捧著的書本代表嚴謹的 ISO 與標準作業程序（SOP），快得來又極度精準！' }
      ]
    },

    // 合作名牌走馬燈
    'sec-clients': {
      title: '合作品牌與品質保證',
      shortTag: '國際名牌信譽',
      text: '【合作品牌內幕】你見到上方走馬燈的 ANTEPRIMA、Marimekko 同 ATSURO TAYAMA 嗎？\n\n這些品牌動輒一件衣服幾千至上萬元，對防塵、防潮、防蟲以及熨燙的要求近乎苛刻！我們葵涌達利中心 5 樓特別設有獨立安保隔離吊掛倉，30 年來破損失竊率近乎 0！',
      quickReplies: [
        { label: '👗 吊掛倉有咩咁特別？', reply: '普通貨倉是摺好放箱，但高級西裝與晚裝一壓就會起皺變形！我們的 GOH（Garment on Hanger）專用吊掛軌道系統，衣服從深圳或機場抵港、上架到出貨送去專櫃，全程保持立體懸掛，店舖拆袋即可直接上架賣！' }
      ]
    },

    // 12萬呎數據 Bento Grid
    'sec-bento-scale': {
      title: '港深 6 大專業倉儲樞紐',
      shortTag: '12萬呎網絡佈局',
      text: '【Bento 數據矩陣背後】網頁上寫 120,000+ 呎，究竟分佈在哪裡？\n\n【策略佈局揭秘】我們並非集中在單一工廈，而是策略性分散於：\n1. 葵涌達利中心 5 樓（總部、旗艦精品恆溫倉及高周轉電商專區）\n2. 荃灣永得利中心（11樓大宗高位貨架倉、7樓增值加工中心 VAS Hub）\n3. 深圳龍崗大運軟件小鎮跨境物流園（中港通關與境內集運樞紐）！',
      quickReplies: [
        { label: '💰 點解真係可以「按日計租」？', reply: '傳統工廈一簽就要 2 至 3 年死約，淡季得幾板貨都要交幾千呎租金！FLS 研發的計費模組精確到每一天：今日進 10 板收 10 板錢，明天爆單賣出 5 板，後天租金即刻減半，真正幫創業者打破死約束縛！' },
        { label: '📍 點解選址葵涌達利中心？', reply: '因為達利中心緊鄰中港貨櫃碼頭及 3 號幹線，往返葵涌碼頭只需 8 分鐘，到香港國際機場僅 25 分鐘，是香港物流的最黃金咽喉點！' }
      ]
    },

    // 八大核心服務
    'sec-core-services': {
      title: '八大核心全方位企業支援',
      shortTag: '八大一站式閉環',
      text: '【八大服務關鍵】普通 3PL 貨倉只負責搬貨，電腦有問題叫你找 IT，報關叫你找船務報關行。\n\n【FLS 獨家優勢】我們是全香港少數「物流 + 門市 IT 軟硬體支援 + 船務通關」全包的公司！由店舖網絡、POS 卡機、到自研 EBP 查貨系統，一個電話全部搞定，省去客戶跨公司溝通的時間成本。',
      quickReplies: [
        { label: '⚡ EBP 系統有咩功能？', reply: 'EBP 是我們內部研發團隊為客戶打造的 24 小時在線雲端倉存系統。支援用手機即時查庫存、抓取訂單追蹤碼，更可直接用 API 對接 Shopify、SHOPLINE 及 HKTVmall，實現自動出貨！' },
        { label: '✂️ VAS 增值服務包咩？', reply: '包括：專業服裝蒸氣熨燙、換吊牌、改衣、打印貼上香港海關規定的繁體中文標籤、商品品質檢驗（QC），以及精美禮盒絲帶包裝等！' }
      ]
    },

    // 雙軌客群解決方案
    'sec-dual-solutions': {
      title: '中小網店 vs 企業 3PL',
      shortTag: '雙軌度身訂造',
      text: '【網店老闆的痛點】你是不是也試過下班後自己貼單、全家通宵包貨、還要趕在順豐關門前排隊？\n\n【FLS 解法】將貨存入 FLS，我們為你自動接單、條碼防呆揀貨、並享受我們的大客快遞優惠價。無論你是每月幾十單的網店，還是每月幾萬單的知名品牌，享受的都是同樣嚴謹的企業級倉配標準！',
      quickReplies: [
        { label: '📦 大促銷爆單處理得切嗎？', reply: '我們最高日出貨動能超過 12,000 件！配備自動流水線與條碼覆核作業，雙11或節慶大促當日截單前訂單保證當日出庫！' }
      ]
    },

    // 痛點對比表
    'sec-comparison': {
      title: '自租工廈 vs FLS 智慧物流',
      shortTag: '精打細算對比',
      text: '【計一計營運筆帳】好多老闆看完這個表才恍然大悟：\n\n自己租個 500 呎工廈要 8,000-10,000 元，請個全職倉務員連 MPF 要 15,000 元，加上冷氣電費、快遞沒量拿不到折扣... \n\n轉用 FLS 按日計租 + 一件代發，每月固定營運成本即刻慳 35% 至 45% 以上，省下來的時間更能專心搞行銷引流！',
      quickReplies: [
        { label: '🤝 請問最少幾板起租？', reply: '一板即可起租！甚至只有幾箱小件貨品都可以按實際佔用空間計費，完全無最低消費門檻，對剛起步的網店非常友好！' }
      ]
    },

    // 底部 CTA
    'sec-cta': {
      title: '專屬方案諮詢與預約',
      shortTag: '立即行動',
      text: '【行到最底喇！】多謝你跟我和小黃一起參觀威黃物流的全新網站！\n\n如果你想試算具體倉租、了解你的貨物適合哪一個倉庫，點擊上方按鈕即可獲取報價，或者直接透過 WhatsApp 找我們的物流專員！我們隨時為你提供支援！',
      quickReplies: [
        { label: '💬 WhatsApp 找專員傾傾', reply: '你可以點擊畫面上的 WhatsApp 按鈕，或直接致電 (852) 2487 1968。Jason 同我們團隊會即時為你評估最划算的物流方案！' }
      ]
    }
  };

  // 3. 預設圖片路徑 (雙模式)
  const AVATAR_CONFIG = {
    // 粗像素版 (Pixel Art) - 預設
    pixel: {
      src: 'images/tour-bot-avatar-pixel.jpg',
      label: '粗像素',
      fallbackSvg: createPixelSvg()
    },
    // 3D 高清版 (Smooth HD)
    hd: {
      src: 'images/tour-bot-avatar-hd.jpg',
      label: '3D高清',
      fallbackSvg: createHdSvg()
    }
  };

  // 生成粗像素 SVG 備援 (即使未放 JPG 也能完美呈現復古像素公仔)
  function createPixelSvg() {
    return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="48" height="48" style="image-rendering:pixelated;shape-rendering:crispEdges;"><rect width="48" height="48" fill="%23fff4e6"/><rect x="16" y="8" width="16" height="6" fill="%2394a3b8"/><rect x="18" y="6" width="12" height="2" fill="%2364748b"/><rect x="22" y="10" width="4" height="2" fill="%23ef4444"/><rect x="12" y="14" width="24" height="24" rx="4" fill="%23ffffff" stroke="%231e293b" stroke-width="2"/><circle cx="19" cy="22" r="2" fill="%231e293b"/><circle cx="29" cy="22" r="2" fill="%231e293b"/><rect x="16" y="25" width="2" height="1" fill="%23f43f5e"/><rect x="30" y="25" width="2" height="1" fill="%23f43f5e"/><path d="M22 26 Q24 28 26 26" stroke="%231e293b" stroke-width="1.5" fill="none"/><rect x="18" y="28" width="12" height="10" fill="%230284c7" stroke="%231e293b" stroke-width="1.5"/></svg>`;
  }

  // 生成 3D 高清立體 SVG 備援
  function createHdSvg() {
    return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="48" height="48"><defs><radialGradient id="g1" cx="40%" cy="35%" r="65%"><stop offset="0%" stop-color="%23ffffff"/><stop offset="70%" stop-color="%23f1f5f9"/><stop offset="100%" stop-color="%23cbd5e1"/></radialGradient><filter id="sh" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="2" stdDeviation="2" flood-opacity="0.15"/></filter></defs><rect width="48" height="48" rx="24" fill="%23f8fafc"/><ellipse cx="22" cy="27" rx="14" ry="15" fill="url(%23g1)" filter="url(%23sh)"/><ellipse cx="18" cy="23" rx="1.8" ry="2.2" fill="%230f172a"/><ellipse cx="26" cy="23" rx="1.8" ry="2.2" fill="%230f172a"/><circle cx="15.5" cy="26" r="2" fill="%23fda4af" opacity="0.7"/><circle cx="28.5" cy="26" r="2" fill="%23fda4af" opacity="0.7"/><path d="M21 27 Q22 28.5 23 27" stroke="%23334155" stroke-width="1.2" stroke-linecap="round" fill="none"/><rect x="18" y="8" width="8" height="4" rx="2" fill="%23e2e8f0"/><ellipse cx="36" cy="30" rx="8" ry="9" fill="url(%23g1)" filter="url(%23sh)"/><circle cx="33" cy="28" r="3.5" fill="none" stroke="%230f172a" stroke-width="1.5"/><circle cx="39" cy="28" r="3.5" fill="none" stroke="%230f172a" stroke-width="1.5"/><line x1="36.5" y1="28" x2="35.5" y2="28" stroke="%230f172a" stroke-width="1.5"/></svg>`;
  }

  // 狀態管理
  let currentAvatarMode = localStorage.getItem('fls_bot_avatar_mode') || 'pixel'; // 'pixel' or 'hd'
  let isPanelOpen = localStorage.getItem('fls_bot_open') === 'true'; // 預設依儲存狀態
  let isSpeechEnabled = localStorage.getItem('fls_bot_speech') === 'true';
  let activeSectionId = null;
  let typingInterval = null;

  // 語音朗讀合成器 (SpeechSynthesis)
  function speakText(text) {
    if (!isSpeechEnabled || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      // 過濾 emoji 和特殊標記以保持語音自然
      const cleanText = text.replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '')
        .replace(/【.*?】/g, '');
      const utter = new SpeechSynthesisUtterance(cleanText);
      utter.lang = 'zh-HK'; // 優先廣東話
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
              <img id="fls-bot-avatar-img" src="${AVATAR_CONFIG[currentAvatarMode].src}" onerror="this.src='${AVATAR_CONFIG[currentAvatarMode].fallbackSvg}'" alt="FLS 導覽員" />
            </div>
            <div class="fls-bot-info">
              <h3>FLS 智慧導覽員 <span style="font-size:0.75rem; color:var(--bot-accent); font-weight:700;">● 在線</span></h3>
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

      <!-- 縮小懸浮按鈕 (Launcher) -->
      <div class="fls-bot-launcher" id="fls-bot-launcher" style="${isPanelOpen ? 'display:none;' : 'display:flex;'}">
        <div class="fls-launcher-avatar" id="fls-launcher-avatar-box">
          <img id="fls-launcher-avatar-img" src="${AVATAR_CONFIG[currentAvatarMode].src}" onerror="this.src='${AVATAR_CONFIG[currentAvatarMode].fallbackSvg}'" alt="FLS 導覽" />
        </div>
        <div class="fls-launcher-text">
          <span class="fls-launcher-title">專屬導覽員小威</span>
          <span class="fls-launcher-sub" id="fls-launcher-sub-text">點擊隨頁解密 💡</span>
        </div>
      </div>
    `;

    document.body.appendChild(container);
    bindEvents();
  }

  // 切換頭像風格 (Pixel vs HD)
  function setAvatarMode(mode) {
    if (!AVATAR_CONFIG[mode]) return;
    currentAvatarMode = mode;
    localStorage.setItem('fls_bot_avatar_mode', mode);

    const container = document.getElementById('fls-tour-bot-container');
    if (container) {
      container.className = mode === 'pixel' ? 'fls-mode-pixel' : 'fls-mode-hd';
    }

    // 更新圖片
    const headerImg = document.getElementById('fls-bot-avatar-img');
    const launcherImg = document.getElementById('fls-launcher-avatar-img');
    if (headerImg) {
      headerImg.src = AVATAR_CONFIG[mode].src;
      headerImg.onerror = () => { headerImg.src = AVATAR_CONFIG[mode].fallbackSvg; };
    }
    if (launcherImg) {
      launcherImg.src = AVATAR_CONFIG[mode].src;
      launcherImg.onerror = () => { launcherImg.src = AVATAR_CONFIG[mode].fallbackSvg; };
    }

    // 更新 Seg 按鈕樣式
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
        // 第一次打開若無內容則播放當前章節
        if (activeSectionId && TOUR_KNOWLEDGE[activeSectionId]) {
          const chatBody = document.getElementById('fls-chat-body');
          if (chatBody && chatBody.children.length <= 1) {
            presentSectionTour(activeSectionId, true);
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
    const speed = 20; // 每個字符毫秒數

    typingInterval = setInterval(() => {
      if (i < text.length) {
        element.textContent += text.charAt(i);
        i++;
        // 自動跟隨滾動到底部
        const chatBody = document.getElementById('fls-chat-body');
        if (chatBody) chatBody.scrollTop = chatBody.scrollHeight;
      } else {
        clearInterval(typingInterval);
        if (typeof onComplete === 'function') onComplete();
      }
    }, speed);
  }

  // 呈現特定區塊的導覽解說
  function presentSectionTour(sectionId, forceReplay = false) {
    const data = TOUR_KNOWLEDGE[sectionId];
    if (!data) return;

    activeSectionId = sectionId;

    // 更新頂部標籤與 Launcher 副標
    const topicPill = document.getElementById('fls-topic-pill');
    if (topicPill) topicPill.textContent = `📍 ${data.shortTag}`;

    const launcherSub = document.getElementById('fls-launcher-sub-text');
    if (launcherSub) launcherSub.textContent = `導覽中：${data.shortTag}`;

    // 如果面板未打開，只做標記與提示
    if (!isPanelOpen && !forceReplay) return;

    const chatBody = document.getElementById('fls-chat-body');
    const indicator = document.getElementById('fls-typing-indicator');
    if (!chatBody) return;

    // 顯示打字思考中動畫
    if (indicator) {
      indicator.style.display = 'inline-flex';
      chatBody.appendChild(indicator);
      chatBody.scrollTop = chatBody.scrollHeight;
    }

    // 模擬思考 350ms 後輸出
    setTimeout(() => {
      if (indicator) indicator.style.display = 'none';

      // 建立新的導覽訊息卡
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

      // 開始打字機動畫
      typeWriter(contentEl, data.text, () => {
        // 打字完成後呈現快捷追問按鈕
        if (data.quickReplies && data.quickReplies.length > 0) {
          repliesEl.innerHTML = data.quickReplies.map((qr, index) => `
            <button type="button" class="fls-chip-btn" data-qr-index="${index}">
              <span>${qr.label}</span>
              <span>➔</span>
            </button>
          `).join('');
          repliesEl.style.display = 'flex';

          // 綁定快捷追問點擊
          repliesEl.querySelectorAll('.fls-chip-btn').forEach(btn => {
            btn.addEventListener('click', function () {
              const idx = parseInt(this.getAttribute('data-qr-index'), 10);
              handleQuickReply(data.quickReplies[idx]);
            });
          });
        }
        chatBody.scrollTop = chatBody.scrollHeight;
      });

      // 同步語音朗讀
      speakText(data.text);
    }, 350);
  }

  // 處理追問按鈕點擊
  function handleQuickReply(qr) {
    const chatBody = document.getElementById('fls-chat-body');
    if (!chatBody) return;

    // 1. 先加入使用者提問氣泡
    const userMsg = document.createElement('div');
    userMsg.className = 'fls-msg-bubble fls-msg-user';
    userMsg.textContent = qr.label;
    chatBody.appendChild(userMsg);

    // 2. 顯示思考點
    const indicator = document.getElementById('fls-typing-indicator');
    if (indicator) {
      indicator.style.display = 'inline-flex';
      chatBody.appendChild(indicator);
      chatBody.scrollTop = chatBody.scrollHeight;
    }

    // 3. 輸出回答
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
    }, 300);
  }

  // 綁定所有互動事件
  function bindEvents() {
    // 展開/收起
    const launcher = document.getElementById('fls-bot-launcher');
    const btnMin = document.getElementById('fls-btn-minimize');
    if (launcher) launcher.addEventListener('click', () => togglePanel(true));
    if (btnMin) btnMin.addEventListener('click', () => togglePanel(false));

    // 模式切換按鈕 (粗像素 / 3D 高清)
    document.querySelectorAll('.fls-seg-btn').forEach(btn => {
      btn.addEventListener('click', function () {
        setAvatarMode(this.getAttribute('data-mode'));
      });
    });

    // 語音切換
    const btnSpeech = document.getElementById('fls-btn-speech');
    if (btnSpeech) {
      btnSpeech.addEventListener('click', () => {
        isSpeechEnabled = !isSpeechEnabled;
        localStorage.setItem('fls_bot_speech', isSpeechEnabled);
        btnSpeech.textContent = isSpeechEnabled ? '🔊' : '🔇';
        if (isSpeechEnabled && activeSectionId && TOUR_KNOWLEDGE[activeSectionId]) {
          speakText(TOUR_KNOWLEDGE[activeSectionId].text);
        } else if (!isSpeechEnabled && 'speechSynthesis' in window) {
          window.speechSynthesis.cancel();
        }
      });
    }

    // 重播當前頁段
    const btnReplay = document.getElementById('fls-btn-replay');
    if (btnReplay) {
      btnReplay.addEventListener('click', () => {
        if (activeSectionId) {
          presentSectionTour(activeSectionId, true);
        }
      });
    }

    // 4. 設定 IntersectionObserver 監聽頁面滾動位置
    initScrollObserver();
  }

  // 滾動位置智能感知
  function initScrollObserver() {
    const targetSections = [
      'sec-hero',
      'sec-clients',
      'sec-bento-scale',
      'sec-core-services',
      'sec-dual-solutions',
      'sec-comparison',
      'sec-cta'
    ];

    // 檢查頁面中存在的 sections
    const elementsToObserve = targetSections
      .map(id => document.getElementById(id))
      .filter(el => el !== null);

    if (elementsToObserve.length === 0) {
      // 若為其他頁面 (如 about.html, services.html 等通用頁面)
      const pageSections = document.querySelectorAll('main section, main .section, main .hero');
      if (pageSections.length > 0) {
        activeSectionId = 'sec-hero';
        setTimeout(() => presentSectionTour('sec-hero'), 800);
      }
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const secId = entry.target.id;
          if (secId && secId !== activeSectionId && TOUR_KNOWLEDGE[secId]) {
            console.log(`[TourBot] 偵測到用戶閱讀新章節: #${secId}`);
            presentSectionTour(secId);
          }
        }
      });
    }, {
      threshold: 0.35, // 進入視野 35% 即可觸發
      rootMargin: '0px 0px -15% 0px'
    });

    elementsToObserve.forEach(el => observer.observe(el));

    // 預設進入首頁 600ms 後主動啟動導覽
    setTimeout(() => {
      if (!activeSectionId && document.getElementById('sec-hero')) {
        presentSectionTour('sec-hero');
      }
    }, 600);
  }

  // 5. 頁面載入完成時啟動
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', buildTourBotUI);
  } else {
    buildTourBotUI();
  }

})();
