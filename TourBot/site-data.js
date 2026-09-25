/**
 * 威黃物流服務有限公司服務有限公司 - 核心數據庫 (Central Data Store)
 * 包含港深 6 大專業倉儲樞紐詳細資料、合作客戶、服務及網誌
 */
window.FLS_DATA = {
  siteInfo: {
    name: "威黃物流服務有限公司服務有限公司",
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
      features: ["中港兩地牌跨境車隊每日固定對開班車", "一站式一般貿易與跨境電商進出口清關報關", "原廠大宗貨物集散集運與境內中轉", "兩地庫存數據無縫即時聯網同步"],
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
      id: "freight",
      num: "05",
      title: "中港運輸與通關支援",
      titleEn: "Cross-Border & Customs",
      desc: "超過 30 年跨境物流經驗，每日固定班車往返香港與深圳，提供一般貿易報關、跨境電商清關、轉口文件及產地來源證申報。",
      points: ["中港兩地牌噸車及貨櫃拖頭每日對開", "海關合規專業申報，大幅縮短通關時間", "全程 GPS 實時車載定位追蹤"]
    },
    {
      id: "system",
      num: "06",
      title: "自研系統與 EBP 查貨",
      titleEn: "IT Systems & EBP Tracking",
      desc: "配備自研 FLS-EBP 網上查貨系統，企業客戶可隨時隨地在雲端登入查閱庫存即時餘額、進出庫明細與出貨單證。",
      points: ["網上查貨系統 (EBP) 隨時隨地登入監控", "支援 API / EDI 資料無縫對接客戶 ERP", "自動化出庫日報、月報及貨存警報"]
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
        "深度整合倉儲條碼掃描、自研 EBP 及企業 ERP 系統對接"
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
};
