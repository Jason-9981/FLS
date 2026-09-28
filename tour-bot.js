/**
 * 威黃物流服務有限公司 (FLS) - 專屬網頁導覽 AI 機械人 (Tour Guide Bot)
 * 版本編號: v0.1 (Build 2026-09-26)
 * 設計風格: 蘋果極簡主義 (Apple Minimalist Aesthetic)
 * 核心功能:
 * 1. 滾動感知導覽 (IntersectionObserver)：根據訪客當前視角自動切換解密主題。
 * 2. 頁面專屬主題庫：自動感應當前頁面（首頁、關於威黃、服務範疇、旗下品牌、聯絡我們等），提供針對性的深度解說。
 * 3. 擬真打字機動畫 (Typewriter Effect) 與思考中動態跳動點。
 * 4. 延伸追問晶片 (Quick Reply Chips) 深度互動。
 * 5. 專屬 3D 高清吉祥物頭像（立體精緻質感）。
 * 6. 多語言切換適配（繁體中文 / 簡體中文 / 英文）。
 */

(function () {
  'use strict';

  // 1. 初次進入會話狀態管理 (SessionStorage 防止頻繁彈出)
  function hasUserBeenGreeted() {
    return sessionStorage.getItem('fls_tour_bot_has_greeted') === 'true';
  }

  function markUserAsGreeted() {
    sessionStorage.setItem('fls_tour_bot_has_greeted', 'true');
  }

  // 2. 導覽資料庫：首頁各區塊 + 全站各子頁面專屬解說（開門見山，內容精準吻合）
  const DEFAULT_TOUR_KNOWLEDGE = {
    // --- 首頁各區塊 (Index Sections) ---
    'sec-hero': {
      title: '首頁啟航 · 30年信譽傳承',
      shortTag: '首頁啟航',
      getFirstTimeText: () => '你好！我係導覽員小威，身邊呢位戴眼鏡嘅係小黃。歡迎參觀威黃物流（FLS）！向下滾動我會為你解密每個位置嘅物流內幕！\n\n【幕後解密】母公司三黃集團（FENIX GROUP）自 1970 年在香港創立，深耕亞太精品市場超過 50 年；而 1994 年集團因應時裝零售高速發展，正式成立「威黃物流（FLS）」，率先引入日本先進 3PL 理念打造恆溫吊掛倉，30 年來深耕精品供應鏈！',
      getDirectText: () => '【首頁總覽】歡迎返嚟首頁！向下滾動即可隨時探索 12 萬呎港深倉網、按日計租與八大核心服務，我會即時為你解讀幕後運作細節。',
      quickReplies: [
        { label: '🏢 威黃物流與三黃集團的關係？', reply: '【母公司半世紀雄厚後盾】母公司三黃集團（FENIX GROUP HOLDINGS LTD）由日本企業家荻野正明於 1970 年在香港創立，深耕亞太超過 50 年！1994 年集團因應國際品牌業務發展，引入日本先進 3PL 概念成立「威黃物流（FLS）」，兼顧集團專屬供應鏈與多元客群，深耕物流逾 30 年！' },
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
      text: '【港深雙城樞紐】120,000+ 呎倉儲策略性分佈於三地：\n1. 葵涌達利中心 5 樓（總部、旗艦精品恆溫倉及高周轉電商專區）\n2. 荃灣永得利中心（11樓大宗高位貨架倉、7樓增值加工中心 VAS Hub）\n3. 深圳龍崗港華工業園（威黃倉管(深圳)有限公司，大灣區供應鏈樞紐）！',
      quickReplies: [
        { label: '💰 點解真係可以「按日計租」？', reply: '傳統工廈一簽就要 2 至 3 年死約，淡季得幾板貨都要交幾千呎租金！FLS 計費模組精確到每一天：今日進 10 板收 10 板錢，明天爆單賣出 5 板，後天租金即刻減半，真正幫創業者打破死約束縛！' },
        { label: '📍 點解選址葵涌達利中心？', reply: '因為達利中心緊鄰葵涌貨櫃碼頭及 3 號幹線，往返葵涌碼頭只需 8 分鐘，到香港國際機場僅 25 分鐘，是香港物流的最黃金咽喉點！' }
      ]
    },

    'sec-core-services': {
      title: '八大核心全方位企業支援',
      shortTag: '八大一站式閉環',
      text: '【八大一站式閉環】普通 3PL 貨倉只負責搬運。FLS 真正核心在於「倉儲 + 門市零售數據庫存部 + 自設本地車隊 + IT 電腦軟硬體支援」全方位閉環！\n\n特別是我們設有專門的【庫存部】管理 Sidefame 旗下各大時裝品牌的龐大零售庫存，與專門為貨倉散客打造的【貨倉 ERP 查貨系統】，雙軌並行！',
      quickReplies: [
        { label: '📊 庫存部點樣幫零售品牌？', reply: '【庫存部核心職能】我們在庫房專屬 Server 房設有核心 POS Server，透過專用加密私有網絡（Private Network），每隔 2–3 分鐘自動上傳並同步全港各商場門市的 POS 交易數據，客戶隨時即時睇到各門市生意！更有專責同事每日按品牌要求，度身製作詳細銷售與庫存分析報表發送給客人。' },
        { label: '💻 貨倉 ERP 同庫存部有咩分工？', reply: '【清晰雙軌分工】庫存部專門處理各大時裝品牌的門市 POS 零售交易數據與報表；而歷時逾一年深度定制研發的「貨倉 ERP 系統」，則專門為貨倉各類散客提供 24 小時即時線上查庫存、入出庫明細與結餘，方便多元貨主隨時管理！' }
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
        { label: '💬 WhatsApp 找專員傾傾', reply: '你可以點擊畫面上的 WhatsApp 按鈕，或直接致電 (852) 2487 1968。我們專業物流顧問團隊會即時為你評估最划算的物流方案！' }
      ]
    },

    // --- 各子頁面專屬導覽主題 (Sub-pages) ---
    'page-about': {
      title: '關於威黃 · 30年信譽傳承',
      shortTag: '關於威黃',
      text: '【關於威黃】威黃物流（FLS）於 1994 年由三黃集團（FENIX GROUP HOLDINGS LTD）成立。母公司自 1970 年代深耕亞太逾 50 年；FLS 則承襲集團國際視野與嚴謹標準，在香港專業物流與倉儲領域深耕逾 30 年！',
      quickReplies: [
        { label: '🏢 母公司三黃集團有幾強實力？', reply: '【半世紀跨國集團三大支柱】母公司三黃集團於 1970 年由荻野正明先生創立，以「服裝、食品、生活必需品」縱向一體化著稱，旗下包括精品時裝代理零售（Sidefame 華鐙，創立及代理 ANTEPRIMA、Marimekko、ATSURO TAYAMA 等）、高端生活精品超市（city\'super），以及第三方物流（FLS 威黃物流）！' }
      ]
    },

    'page-services': {
      title: '八大核心物流與企業支援服務',
      shortTag: '八大核心服務',
      text: '【八大一站式閉環】呢個頁面完整展示咗 FLS 嘅八大核心服務！我哋不單只提供智能倉存同電商代發（Fulfilment），更設有專門嘅門市庫存部、貨倉 ERP 系統、自設本地車隊、企業電腦 IT 支援同全套船務代理，形成完整閉環！\n\n（註：如欲查閱港深 6 大貨倉規格及地址，可前往【聯絡我們 ➔ 各倉庫據點】）',
      quickReplies: [
        { label: '📊 門市庫存部同貨倉 ERP 有咩分別？', reply: '【清晰雙軌支援】庫存部專門獨立管理 Sidefame 旗下國際時裝名牌嘅全港門市專櫃 POS 交易數據，2–3 分鐘自動同步並製作每日專業報表；而「貨倉 ERP 系統」則專門為貨倉散客與多元貨主提供 24 小時網上自主查庫存、入出庫明細！' },
        { label: '👔 電腦支援同船務點樣幫企業？', reply: '【一站式 IT 與船務閉環】我們 IT 團隊提供一站式電腦系統維護、條碼與 ERP 對接，幫客戶大幅降低內部 IT 人力負擔；船務團隊則包辦進出口報關、產地來源證（CO）、熏蒸證及代訂海空運倉位，幫客戶省去大量繁瑣手續！' },
        { label: '🚚 自設本地車隊有咩優勢？', reply: '【商場專櫃極速補貨】自設本地專業車隊，熟悉海港城、時代廣場等各大商場卸貨限制與特定時段，能靈活安排專櫃補貨、急件派送、碼頭提櫃及門市調撥，免去外判車隊甩漏風險！' }
      ]
    },

    'page-brands': {
      title: '旗下多元品牌與創新服務',
      shortTag: '旗下多元品牌',
      text: '【旗下品牌簡介】呢個頁面介紹緊 FLS 旗下嘅兩大創新業務延伸品牌：專營優質寵物用品代理批發嘅「Fenix Pet」，以及提供智慧上門儲存箱與微電商物流嘅「Carry Kuma」！我哋將 30 年企業級物流實力，延伸至寵物生活與智能家居存儲領域。',
      quickReplies: [
        { label: '🐶 Fenix Pet 做咩業務？', reply: '【Fenix Pet 寵物精品】為 FLS 旗下專營優質寵物用品與食品銷售的子公司，與戰略夥伴 Waylun Pet Care 緊密合作，代理世界各地頂級寵物糧與用品，覆蓋港澳批發及零售通路，並享有 FLS 專業恆溫糧倉與嚴格批次效期控管！' },
        { label: '📦 Carry Kuma 點樣幫香港人？', reply: '【Carry Kuma 上門智能存儲】針對香港家居空間有限嘅痛點，提供一站式上門收送儲存箱服務！客戶手機落單，我哋就有專人派箱、上門提存並入倉保管；同時亦為微型電商提供按箱按件代發，極為靈活便捷！' },
        { label: '👜 國際時裝名牌（ANTEPRIMA 等）喺邊度睇？', reply: '【合作品牌在首頁】ANTEPRIMA、Marimekko、ATSURO TAYAMA、Cocktail 等國際時裝名牌係我哋長期服務嘅「合作品牌客戶」，詳細合作介紹在【首頁】的走馬燈與服務專區展示！' }
      ]
    },

    'page-contact': {
      title: '聯絡我們與 6 大倉庫據點',
      shortTag: '聯絡與 6 大倉',
      text: '【聯絡與 6 大倉據點】想獲取專屬報價，或者了解你嘅貨物適合放邊個倉？呢度唔單止有 30 秒極速線上智能報價計算器，仲完整列出咗我哋港深 6 大專業倉庫（葵涌總部、荃灣永得利、深圳龍崗）嘅詳細規格與聯絡地址！',
      quickReplies: [
        { label: '🏭 港深 6 大倉有咩分工？', reply: '葵涌達利中心為總部及精品恆溫電商倉，鄰近碼頭專出急件；荃灣永得利中心則為大宗立體重貨架與 VAS 增值加工中心；深圳龍崗則是跨境大灣區供應鏈樞紐！' },
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
        { label: '📰 最近有咩升級項目？', reply: '我們近期全面完成了港深雙資料庫容災架構升級、貨倉 ERP 查貨系統手機版對接，以及葵涌總部電商履約流水線自動化擴容！' }
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

    'page-disclaimer': {
      title: '免責聲明與法律合規聲明',
      shortTag: '免責聲明',
      text: '【法律合規與服務聲明】本頁面闡明威黃物流（FLS）各項服務之知識產權、資料隱私條款及法律合規標準。我們秉持 30 年商譽，確保客戶資產與商業數據受到最高級別保障。',
      quickReplies: [
        { label: '🔒 客戶商業數據安全', reply: '所有客戶之庫存數據、門市 POS 銷售紀錄及進出倉明細均透過專用私有加密網路傳輸，並具備雙資料庫即時異地備份，保障商業機密。' }
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

  // 優先使用 site-data.js 中可由 CMS 動態管理的知識庫，若無則回退預設值
  // 優先使用 site-data.js 中可由 CMS 動態管理的知識庫，並合併預設所有子頁面知識，確保各頁面永不白屏
  const TOUR_KNOWLEDGE = Object.assign({}, DEFAULT_TOUR_KNOWLEDGE, (window.FLS_DATA && window.FLS_DATA.tourKnowledge) || {});

  // 3. 專屬 3D 高清吉祥物頭像配置（立體精緻圓潤質感）
  const AVATAR_CONFIG = {
    src: 'images/tour-bot-avatar-hd.jpg',
    fallback: 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="48" height="48"><rect width="48" height="48" rx="24" fill="#f8fafc"/><ellipse cx="22" cy="27" rx="14" ry="15" fill="#f1f5f9"/><circle cx="18" cy="23" r="2" fill="#0f172a"/><circle cx="26" cy="23" r="2" fill="#0f172a"/><circle cx="15.5" cy="26" r="2" fill="#fda4af"/><circle cx="28.5" cy="26" r="2" fill="#fda4af"/><path d="M21 27 Q22 28.5 23 27" stroke="#334155" stroke-width="1.2" stroke-linecap="round" fill="none"/><ellipse cx="36" cy="30" rx="8" ry="9" fill="#f1f5f9"/><circle cx="33" cy="28" r="3.5" fill="none" stroke="#0f172a" stroke-width="1.5"/><circle cx="39" cy="28" r="3.5" fill="none" stroke="#0f172a" stroke-width="1.5"/></svg>'
    )
  };

  // 狀態管理
  // 狀態管理：預設常駐於右下角未打開（收起狀態），維持 Apple 極簡主義清爽體驗
  const isMobile = window.innerWidth <= 640;
  const storedOpen = sessionStorage.getItem('fls_bot_open');
  // 預設關閉（未打開）
  let isPanelOpen = storedOpen === 'true';

  // 語音朗讀開關：預設開啟（true），但受瀏覽器 Autoplay 規範保護，訪客點擊打開機械人時觸發播放
  const storedSpeech = localStorage.getItem('fls_bot_speech');
  let isSpeechEnabled = storedSpeech !== null ? storedSpeech === 'true' : true;
  let utterLang = 'zh-HK';
  let activeTourKey = null;
  let typingInterval = null;

  // 安全賦予圖片源 (JS 事件監聽，防 HTML 標籤破裂)
  function applySafeAvatar(imgEl) {
    if (!imgEl) return;
    imgEl.onerror = null;
    imgEl.onerror = function () {
      this.onerror = null;
      this.src = AVATAR_CONFIG.fallback;
    };
    imgEl.src = AVATAR_CONFIG.src;
  }

  // 語音朗讀管理：防止 GC 垃圾回收與防非同步 cancel 衝突
  window._flsActiveUtterance = null;
  let speechKeepAliveTimer = null;

  function stopSpeech() {
    if (speechKeepAliveTimer) {
      clearInterval(speechKeepAliveTimer);
      speechKeepAliveTimer = null;
    }
    window._flsActiveUtterance = null;
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }

  function speakText(text) {
    if (!isSpeechEnabled || !('speechSynthesis' in window)) return;
    try {
      stopSpeech();

      const cleanText = text
        .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '')
        .replace(/【.*?】/g, '')
        .replace(/<[^>]+>/g, '')
        .replace(/[#*_`]/g, '')
        .trim();

      if (!cleanText) return;

      const utter = new SpeechSynthesisUtterance(cleanText);
      utter.lang = utterLang || 'zh-HK';
      utter.rate = 1.0;
      utter.pitch = 1.0;

      // 保持全域強引用，防止 Chromium V8 / WebKit 在 14 秒時垃圾回收 (GC) 導致中途靜音
      window._flsActiveUtterance = utter;

      utter.onend = () => {
        stopSpeech();
      };
      utter.onerror = (e) => {
        console.warn('[TourBot] 語音提示:', e);
        stopSpeech();
      };

      // 延遲 60ms 執行 speak()，避開 cancel() 的非同步線程衝突
      setTimeout(() => {
        try {
          window.speechSynthesis.resume();
          window.speechSynthesis.speak(utter);

          // Chrome 15 秒保活心跳 (每 8 秒 pause + resume 確保長文本讀完全文)
          if (speechKeepAliveTimer) clearInterval(speechKeepAliveTimer);
          speechKeepAliveTimer = setInterval(() => {
            if (!window.speechSynthesis.speaking) {
              stopSpeech();
            } else {
              window.speechSynthesis.pause();
              window.speechSynthesis.resume();
            }
          }, 8000);
        } catch (err) {
          console.warn('[TourBot] 播放失敗:', err);
        }
      }, 60);

    } catch (e) {
      console.warn('[TourBot] 語音朗讀未就緒:', e);
    }
  }

  // 構建 DOM 元素
  function buildTourBotUI() {
    const container = document.createElement('div');
    container.id = 'fls-tour-bot-container';

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

        <!-- 當前導覽重點導航列 -->
        <div class="fls-topic-toolbar">
          <span class="fls-topic-label">📍 當前導覽重點</span>
          <div class="fls-current-topic-pill" id="fls-topic-pill">
            準備導覽
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

      <!-- 縮小狀態下的懸浮膠囊啟動按鈕 -->
      <div class="fls-bot-launcher" id="fls-bot-launcher" style="${isPanelOpen ? 'display:none;' : 'display:flex;'}" role="button" aria-label="打開導覽機械人">
        <div class="fls-launcher-avatar" id="fls-launcher-avatar-box">
          <img id="fls-launcher-avatar-img" alt="FLS 導覽員" />
          <span class="fls-launcher-badge"></span>
        </div>
        <div class="fls-launcher-text">
          <div class="fls-launcher-title">專屬導覽員小威</div>
          <div class="fls-launcher-sub" id="fls-launcher-sub-text">點擊即時解密</div>
        </div>
      </div>
    `;

    document.body.appendChild(container);

    applySafeAvatar(document.getElementById('fls-bot-avatar-img'));
    applySafeAvatar(document.getElementById('fls-launcher-avatar-img'));

    bindEvents();
    startInitialPageTour();
  }

  // 面板展開與收起
  function togglePanel(open) {
    isPanelOpen = typeof open === 'boolean' ? open : !isPanelOpen;
    sessionStorage.setItem('fls_bot_open', isPanelOpen);

    const panel = document.getElementById('fls-bot-panel');
    const launcher = document.getElementById('fls-bot-launcher');

    if (panel && launcher) {
      if (isPanelOpen) {
        panel.classList.add('active');
        launcher.style.display = 'none';

        if (activeTourKey && TOUR_KNOWLEDGE[activeTourKey]) {
          const chatBody = document.getElementById('fls-chat-body');
          const hasBubble = chatBody && chatBody.querySelectorAll('.fls-msg-bubble').length > 0;
          if (!hasBubble) {
            presentTourMessage(activeTourKey, true);
          } else if (isSpeechEnabled) {
            const data = TOUR_KNOWLEDGE[activeTourKey];
            let textToSpeak = typeof data.text === 'function' ? data.text() : (data.text || '');
            if (activeTourKey === 'sec-hero') {
              textToSpeak = typeof data.getFirstTimeText === 'function' ? data.getFirstTimeText() : (data.getFirstTimeText || textToSpeak);
            }
            speakText(textToSpeak);
          }
        }
      } else {
        panel.classList.remove('active');
        launcher.style.display = 'flex';
        if ('speechSynthesis' in window) {
          stopSpeech();
        }
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
    let outputText = typeof data.text === 'function' ? data.text() : (data.text || '');
    if (key === 'sec-hero') {
      if (!hasUserBeenGreeted()) {
        outputText = typeof data.getFirstTimeText === 'function' ? data.getFirstTimeText() : (data.getFirstTimeText || outputText);
        markUserAsGreeted(); // 標記已完成首次打招呼，之後換頁絕不重複
      } else {
        outputText = typeof data.getDirectText === 'function' ? data.getDirectText() : (data.getDirectText || outputText);
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

      // 清空舊對話訊息，只保留當前焦點與追問（極致乾淨不繁雜）
      const existingBubbles = chatBody.querySelectorAll('.fls-msg-bubble');
      existingBubbles.forEach(b => b.remove());

      const botBubble = document.createElement('div');
      botBubble.className = 'fls-msg-bubble fls-msg-bot';
      botBubble.innerHTML = `
        <div class="fls-msg-meta">${data.title}</div>
        <div class="fls-msg-content"></div>
        <div class="fls-quick-replies" style="display:none;"></div>
      `;
      chatBody.appendChild(botBubble);

      const contentEl = botBubble.querySelector('.fls-msg-content');
      const repliesEl = botBubble.querySelector('.fls-quick-replies');

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

  // 依據當前 URL 決定初始導覽重點
  function startInitialPageTour() {
    const path = window.location.pathname.toLowerCase();
    const page = path.split('/').pop() || 'index.html';

    let pageKey = 'page-generic';

    if (page === '' || page.includes('index')) {
      pageKey = 'sec-hero';
      setupIntersectionObserver();
    } else if (page.includes('about')) pageKey = 'page-about';
    else if (page.includes('services')) pageKey = 'page-services';
    else if (page.includes('brands')) pageKey = 'page-brands';
    else if (page.includes('contact')) pageKey = 'page-contact';
    else if (page.includes('blog')) pageKey = 'page-blog';
    else if (page.includes('media')) pageKey = 'page-media';
    else if (page.includes('proposal')) pageKey = 'page-proposal';
    else if (page.includes('disclaimer')) pageKey = 'page-disclaimer';
    else if (page.includes('report') || page.includes('presentation')) pageKey = 'page-proposal';

    presentTourMessage(pageKey);
  }

  // 首頁滾動監聽（現代瀏覽器原生 IntersectionObserver）
  function setupIntersectionObserver() {
    if (!('IntersectionObserver' in window)) return;

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
    if (launcher) {
      launcher.addEventListener('click', () => {
        if ('speechSynthesis' in window) {
          window.speechSynthesis.resume();
        }
        togglePanel(true);
      });
    }
    if (btnMin) btnMin.addEventListener('click', () => togglePanel(false));

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
          stopSpeech();
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

  // ==========================================================================
  // 多語言切換適配監聽 (Tour Bot Multilingual Support)
  // ==========================================================================
  window.addEventListener('fls:languagechange', function (e) {
    const lang = (e.detail && e.detail.lang) || 'zh-Hant';
    
    // 更新語音朗讀口音
    if (lang === 'en') {
      utterLang = 'en-US';
    } else if (lang === 'zh-Hans') {
      utterLang = 'zh-CN';
    } else {
      utterLang = 'zh-HK';
    }

    // 更新導覽機械人介面文字
    const launcherTitle = document.querySelector('.fls-launcher-title');
    const launcherSub = document.querySelector('.fls-launcher-sub');
    const panelTitle = document.querySelector('.fls-bot-info h3');
    const panelSub = document.querySelector('.fls-bot-info p');
    const btnReplay = document.getElementById('fls-btn-replay');
    const quoteLink = document.querySelector('.fls-btn-quote-link');
    const topicPill = document.getElementById('fls-topic-pill');

    if (lang === 'en') {
      if (launcherTitle) launcherTitle.textContent = 'Tour Guide Siu Wai';
      if (launcherSub) launcherSub.textContent = 'Click for Insights';
      if (panelTitle) panelTitle.innerHTML = 'FLS Smart Tour Guide <span class="fls-online-dot"></span> <span style="font-size:0.75rem; color:var(--bot-accent); font-weight:700;">Online</span>';
      if (panelSub) panelSub.textContent = 'Siu Wai & Siu Wong (Behind the Scenes)';
      if (btnReplay) btnReplay.textContent = '🔄 Replay Section';
      if (quoteLink) quoteLink.textContent = 'Instant Quote →';
      if (topicPill && topicPill.textContent.indexOf('導覽') !== -1) topicPill.textContent = '📍 Ready for Tour';
    } else if (lang === 'zh-Hans') {
      if (launcherTitle) launcherTitle.textContent = '专属导览员小威';
      if (launcherSub) launcherSub.textContent = '点击即时解密';
      if (panelTitle) panelTitle.innerHTML = 'FLS 智慧导览员 <span class="fls-online-dot"></span> <span style="font-size:0.75rem; color:var(--bot-accent); font-weight:700;">在线</span>';
      if (panelSub) panelSub.textContent = '小威 & 小黄 (随页解密内幕)';
      if (btnReplay) btnReplay.textContent = '🔄 重讲当前页段';
      if (quoteLink) quoteLink.textContent = '试算报价 →';
      if (topicPill && topicPill.textContent.indexOf('導覽') !== -1) topicPill.textContent = '📍 准备导览';
    } else {
      if (launcherTitle) launcherTitle.textContent = '專屬導覽員小威';
      if (launcherSub) launcherSub.textContent = '點擊即時解密';
      if (panelTitle) panelTitle.innerHTML = 'FLS 智慧導覽員 <span class="fls-online-dot"></span> <span style="font-size:0.75rem; color:var(--bot-accent); font-weight:700;">在線</span>';
      if (panelSub) panelSub.textContent = '小威 & 小黃 (隨頁解密內幕)';
      if (btnReplay) btnReplay.textContent = '🔄 重講當前頁段';
      if (quoteLink) quoteLink.textContent = '試算報價 →';
      if (topicPill && topicPill.textContent.indexOf('導覽') !== -1) topicPill.textContent = '📍 準備導覽';
    }
  });

})();
