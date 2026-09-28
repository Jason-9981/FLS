/**
 * 威黃物流服務有限公司 - 核心數據庫 (Central Data Store)
 * 包含港深 6 大專業倉儲樞紐詳細資料、合作客戶、服務及網誌
 */
window.FLS_DATA = {
  siteInfo: {
    name: "威黃物流服務有限公司",
    nameEn: "Fenix Logistics Services Ltd.",
    parentCompany: "FENIX GROUP HOLDINGS LTD",
    parentCompanyUrl: "http://www.fenixgh.com",
    sidefameUrl: "https://sidefame.com.hk/",
    establishedYear: "1994",
    phone: "(852) 2487 1968",
    whatsapp: "85297242234",
    email: "jason@fls.com.hk",
    headquarters: "香港葵涌梨木道88號達利中心5樓502A-B室",
    ebpUrl: "http://103.243.0.131:8080/fxlsebp/login.htm",
    slogan: "集團經營 · 專業首選 ｜ 服務靈活 · 智慧之選 ｜ 服務以誠 · 真摰真心"
  },
  
  clients: [
    { name: "ANTEPRIMA", url: "https://hk.anteprima.com/", category: "Luxury Fashion" },
    { name: "Marimekko", url: "https://sidefame.com.hk/pages/brand-story-marimekko", category: "Design Lifestyle" },
    { name: "ATSURO TAYAMA", url: "https://sidefame.com.hk/pages/brand-story-atsuro-tayama", category: "Designer Fashion" },
    { name: "Cocktail", url: "https://sidefame.com.hk/pages/brand-story-cocktail-select-shop", category: "Select Shop" },
    { name: "The Little Shop", url: "https://sidefame.com.hk/pages/brand-story-the-little-shop", category: "Kids & Family" },
    { name: "ANTEPRIMA WIREBAG", url: "https://hk.anteprima-eshop.com/collections/wirebag", category: "Accessories" }
  ],

  // 港深 6 大專業倉儲樞紐 (依據官方檔案「港深 6 大專業倉儲.txt」完整建構)
  warehouses: [
    {
      id: "hub-01",
      name: "葵涌-達利中心 (5樓 502A-B)",
      tag: "總部與核心旗艦倉",
      status: "營運中",
      address: "香港葵涌梨木道88號達利中心5樓502A-B室",
      features: ["總部綜合行政與營運指揮中心", "恆溫冷氣及常溫多溫區規劃", "重型裝卸貨台及專屬貨梯直達", "24/7 CCTV 全方位監控及消防安防系統"],
      suitableFor: "精品時裝、高價值零售貨品、美妝生活百貨、電商綜合履約",
      area: "旗艦核心樓層",
      temp: "常溫 / 18-22°C 恆溫冷氣",
      image: ""
    },
    {
      id: "hub-02",
      name: "葵涌-達利中心 (5樓 502C-D)",
      tag: "電商智能履約倉",
      status: "營運中",
      address: "香港葵涌梨木道88號達利中心5樓502C-D室",
      features: ["電商 Fulfilment 專屬揀貨包裝流水線", "標準化條碼掃描防呆出貨作業", "對接各大網店平台與快遞自動化代發", "退換貨（RMA）及逆向物流處理專區"],
      suitableFor: "中小網店訂單、當日即發包裹、促銷爆款商品、按日計租",
      area: "高周轉電商專區",
      temp: "空調恆溫倉",
      image: ""
    },
    {
      id: "hub-03",
      name: "葵涌-達利中心 (5樓 501)",
      tag: "精品時裝專用倉",
      status: "營運中",
      address: "香港葵涌梨木道88號達利中心5樓501室",
      features: ["專用防塵成衣吊掛儲存區", "高級名牌服裝與皮具獨立分區", "無塵防潮防蟲恆溫控制", "門禁卡雙重安保隔離"],
      suitableFor: "國際奢品、高級時裝、吊掛西裝禮服、名牌皮具手袋",
      area: "高安保精品專區",
      temp: "24小時恆溫恆濕",
      image: ""
    },
    {
      id: "hub-04",
      name: "荃灣 - 永得利中心 (11樓)",
      tag: "大宗儲運與重貨樞紐",
      status: "營運中",
      address: "荃灣橫窩仔街 43-57 號永得利中心 11/F",
      features: ["高承重地台與超高立體重型貨架", "配備多部大型專用工業貨梯", "支援整托盤（Pallet）大批量進出庫", "鄰近荃灣西及主要跨區幹道"],
      suitableFor: "大宗商品儲備、原箱整板週轉、家品建材、快速消費品",
      area: "大型高位貨架倉",
      temp: "通風常溫倉",
      image: ""
    },
    {
      id: "hub-05",
      name: "荃灣 - 永得利中心 (7樓)",
      tag: "定制增值服務中心 (VAS Hub)",
      status: "營運中",
      address: "荃灣橫窩仔街 43-57 號永得利中心 7/F",
      features: ["成衣專業蒸氣熨燙與掛裝工位", "改衣、換吊牌、繁體中文標籤打印貼標", "商品品質檢驗（QC）與缺陷篩選工位", "套裝禮盒（Kitting）組裝與絲帶包裝加工"],
      suitableFor: "各大品牌門市上架前預處理、促銷禮盒包裝、產品翻新檢驗",
      area: "增值加工作業中心",
      temp: "專業作業工位",
      image: ""
    },
    {
      id: "hub-06",
      name: "深圳市龍崗區港華工業園倉",
      tag: "大灣區跨境樞紐",
      status: "營運中",
      address: "深圳市龍崗區南灣街道紅棉路港華高科技工業園12號第D棟第五層",
      features: ["大灣區生產端集貨與境內中轉倉儲", "原廠大宗貨物預先品質檢驗與分裝", "原廠大宗貨物集散集運與境內中轉", "兩地庫存數據無縫即時聯網同步"],
      suitableFor: "內地供港商品、原廠批量備貨、跨境電商直郵、集運轉運",
      area: "大灣區跨境基地",
      temp: "現代化常溫智慧倉",
      image: ""
    }
  ],

  services: [
    {
      id: "warehousing",
      num: "01",
      title: "智能倉存服務",
      titleEn: "Smart Warehousing",
      desc: "彈性空間劃分，支援散件、整板、層架到高位貨架儲存。採用標準化條碼管理，即時掌握每件貨物位置與批次狀態。",
      points: ["常溫及 18-22°C 恆溫精品冷氣倉", "支援按日、按板或按材積靈活計租", "24/7 CCTV 全方位監控及消防安防系統"]
    },
    {
      id: "fulfillment",
      num: "02",
      title: "電商 Fulfilment 履約",
      titleEn: "E-Commerce Fulfillment",
      desc: "中小網店的專屬管家。從訂單自動抓取、精準揀貨（Pick & Pack）、客製化包裝禮盒到即日發貨，讓你輕鬆應對促銷爆單。",
      points: ["對接 Shopify / SHOPLINE / HKTVmall 等主流平台", "條碼槍雙重覆核，99.9% 出貨準確率", "靈活退換貨（RMA）及產品逆向物流處理"]
    },
    {
      id: "vas",
      num: "03",
      title: "定制增值服務",
      titleEn: "Value-Added Services (VAS)",
      desc: "滿足國際時尚與零售品牌嚴格上架標準。提供商品檢驗、吊牌更換、繁體中文化標籤打印、禮盒絲帶組裝與套裝打包。",
      points: ["成衣專業蒸燙、掛裝、改衣貼標", "促銷套裝（Kitting）與禮品包裝加工", "商品品質檢驗（QC）及缺陷篩選"]
    },
    {
      id: "transport",
      num: "04",
      title: "專業運輸與派送",
      titleEn: "Transport & Fleet Fleet",
      desc: "自設及深度合作專業車隊，覆蓋全港各大商場旗艦店、街舖及百貨專櫃定時補貨，並深度對接順豐、Zeek 等主流快遞。",
      points: ["香港商場專櫃與門市點對點日間/夜間補貨", "B2C 上門派送與自提點無縫銜接", "大型會展、快閃店（Pop-up Store）專車急送"]
    },
    {
      id: "inventory",
      icon: "📊",
      num: "05",
      title: "門市庫存及 POS 數據管理",
      desc: "專屬庫存部管理 Sidefame 旗下多個國際時裝品牌之大規模零售庫存，以機房 POS Server 透過私有網絡每 2–3 分鐘實時同步各店交易，每日呈送客製化分析報表。",
      points: [
        "專用機房私網互聯：FLS 機房 POS Server 透過 Private Network 實時連繫各門市 POS",
        "2–3 分鐘極速同步：每隔 2–3 分鐘自動上傳一次交易記錄，即時掌握各店最新生意",
        "客製化每日專業報表：庫存部專人每日按客戶特定指標，製作並電郵發送銷售與庫存日報"
      ]
    },
    {
      id: "system",
      num: "06",
      title: "貨倉 ERP 庫存管理系統",
      titleEn: "Warehouse ERP Stock System",
      desc: "專為各倉庫多元貨主及散客打造，歷時逾一年深度定制研發，支援 24 小時線上登入，隨時即時掌握存倉貨品最新結餘與出入庫明細。",
      points: ["貨倉 ERP 查貨系統 24 小時線上即時查貨", "支援 API / EDI 資料無縫對接客戶 ERP", "自動化出庫日報、月報及貨存警報"]
    }
  ,
    {
      id: "it-support",
      num: "07",
      title: "電腦支援服務",
      titleEn: "IT Support Services",
      desc: "在現今資訊發達的時代，資訊科技、資訊管理相關技術、電腦系統支援服務已經是每家企業不可缺少的一部份，但往往為企業帶來難以估計的負擔，而本公司提供一站式的 I.T. 服務，為簡化客戶對資訊科技的管理，將資源集中在公司核心的業務上，提高回報及營運成效，達到更好的投資回報。",
      points: [
        "一站式企業級 I.T. 技術與電腦軟硬體日常維護支援",
        "簡化客戶資訊管理，降低企業內部 IT 人力與維運負擔",
        "深度整合倉儲條碼掃描、貨倉 ERP 查貨系統 系統對接"
      ]
    },
    {
      id: "shipping",
      num: "08",
      title: "船務支援",
      titleEn: "Shipping & Forwarding Support",
      desc: "本公司能提供全面的船務支援服務，包括文件製作、代理專業報關、申請出入口證、產地證及熏蒸證、與貨代聯繫安排收發貨物及代訂進出口倉位等事宜，為客戶大大節省處理船務有關方面的時間。",
      points: [
        "全套船務進出口文件製作及專業代理海關清關報關",
        "代辦進出口許可證、產地來源證（CO）及木質/貨品熏蒸證書",
        "聯繫各大貨代安排收發貨物，代訂國際海運及空運進出口倉位"
      ]
    }
  ],

  blogPosts: [
    {
      id: "post-01",
      title: "網店倉存點揀好？自租工廈 vs 第三方 Fulfilment 成本效益全剖析",
      category: "電商實戰",
      date: "2026-09-18",
      readTime: "4 分鐘閱讀",
      summary: "許多中小網店老闆面臨業務成長時，常猶豫要不要自己租工廈請兼職。本文拆解水電、死約租金、包材與人手隱形成本，幫你精打細算。",
      image: ""
    },
    {
      id: "post-02",
      title: "電商大促揀貨避坑指南：如何做到 99.9% 出貨準確率？",
      category: "倉儲管理",
      date: "2026-09-05",
      readTime: "5 分鐘閱讀",
      summary: "雙 11、SOGO 感謝祭或聖誕大促銷期間，爆單是好事，但發錯貨退貨卻能吃掉所有利潤。看 30 年物流老兵如何用條碼流與防呆機制守護信譽。",
      image: ""
    },
    {
      id: "post-03",
      title: "香港精品零售供應鏈升級：B2B 門市補貨與 B2C 網購合流新常態",
      category: "行業趨勢",
      date: "2026-08-20",
      readTime: "6 分鐘閱讀",
      summary: "線下高端實體專櫃與線上官方網店不再各自為政。一套庫存全渠道打通（Omnichannel），如何幫助時尚國際名牌減少 30% 庫存積壓？",
      image: ""
    }
  ]
,

  // 專屬 AI 導覽機械人知識庫 (可於 CMS 中視覺化修改並一鍵匯出)
  tourKnowledge: {
    'sec-hero': {
      title: '首頁啟航 · 30年信譽傳承',
      shortTag: '首頁啟航',
      firstTimeText: '你好！我係導覽員小威，身邊呢位戴眼鏡嘅係小黃。歡迎參觀威黃物流（FLS）！向下滾動我會為你解密每個位置嘅物流內幕！\n\n【幕後解密】母公司三黃集團（FENIX GROUP）自 1970 年在香港創立，深耕亞太精品市場超過 50 年；而 1994 年集團因應時裝零售高速發展，正式成立「威黃物流（FLS）」，率先引入日本先進 3PL 理念打造恆溫吊掛倉，30 年來深耕精品供應鏈！',
      text: '【首頁總覽】歡迎返嚟首頁！向下滾動即可隨時探索 12 萬呎港深倉網、按日計租與八大核心服務，我會即時為你解讀幕後運作細節。',
      quickReplies: [
        { label: '🏢 威黃物流與三黃集團的關係', reply: '【品牌由來】公司英文全名為 Fenix Logistics Services Ltd.（FLS）。源於 1994 年母公司三黃集團（FENIX GROUP HOLDINGS LTD），「威黃」一名正是由母公司 FENIX 英文名音譯結合「三黃集團」體系命名而來，代表正統傳承 30 年的集團信譽與專業物流實力！' },
        { label: '🎮 吉祥物設計彩蛋', reply: '【吉祥物設計彩蛋】哈哈，眼利！頭頂個遊戲手掣代表我們像打機一樣操控自如的智慧數據系統；手中捧著的書本代表嚴謹的 ISO 與標準作業程序（SOP），快得來又極度精準！' }
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
      text: '【港深雙城樞紐】120,000+ 呎倉儲策略性分佈於三地：\n1. 葵涌達利中心 5 樓（總部、旗艦精品恆溫倉及高周轉電商專區）\n2. 荃灣永得利中心（11樓大宗高位貨架倉、7樓增值加工中心 VAS Hub）\n3. 深圳龍崗大運軟件小鎮跨境物流園（大灣區供應鏈與境內倉儲樞紐）！',
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
        { label: '💻 貨倉 ERP 同庫存部有咩分工？', reply: '【清晰雙軌分工】庫存部專門處理各大時裝品牌的門市 POS 零售交易數據與報表；而歷時逾一年深度定制研發的「貨倉 ERP 系統」，則專門為貨倉各類散客提供 24 小時線上自主查庫存、入出庫明細與結餘，方便多元貨主隨時管理！' }
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
      text: '【行到最底喇！】想試算具體倉租、或者了解你的貨物適合哪一個倉庫，歡迎直接透過 WhatsApp 找我們的物流專員！小威和小黃隨時為你提供支援！',
      quickReplies: [
        { label: '💬 WhatsApp 找專員傾傾', reply: '你可以點擊畫面上的 WhatsApp 按鈕，或直接致電 (852) 2487 1968。Jason 同我們團隊會即時為你評估最划算的物流方案！' }
      ]
    },
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
      text: '【八大一站式閉環】呢個頁面完整展示咗 FLS 嘅八大核心服務！我哋不單只提供智能倉存同電商代發（Fulfilment），更設有專門嘅門市庫存部、貨倉 ERP 系統、自設本地車隊、企業電腦 IT 支援同全套船務代理，形成完整閉環！\\n\\n（註：如欲查閱港深 6 大貨倉規格及地址，可前往【聯絡我們 ➔ 各倉庫據點】）',
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
  }
};
