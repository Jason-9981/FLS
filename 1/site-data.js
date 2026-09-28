/**
 * FLS 威黃物流服務有限公司 (fls.com.hk) - 官方原始核心數據庫 (Central Data Store)
 * 100% 依據 fls.com.hk 舊網站原文建構
 * Version: v0.1 (Build 20260928)
 */
window.FLS_DEFAULT_DATA = {
  siteInfo: {
    name: "FLS 威黃物流服務有限公司",
    nameEn: "Fenix Logistics Services Ltd.",
    phone: "852 2487 1968",
    email: "cs@fls.com.hk",
    hours: "Mon - Fri 9:00 - 18:00 ｜ Saturday, Sunday Closed",
    headquarters: "香港葵涌梨木道88號達利中心5樓502A-B室",
    ebpUrl: "http://103.243.0.131:8080/fxlsebp/login.htm",
    formspreeEndpoint: "https://formspree.io/f/mljezogk",
    copyright: "© Copyright 2017 - 2026 Fenix Logistics Services Ltd.",
    sloganTop: "威黃物流",
    slogan1: "集團經營專業首選",
    slogan2: "服務靈活智慧之選",
    slogan3: "服務以誠真摰真心",
    aboutIntro: "三黃香港集團因應國際品牌的業務發展，率先引入日本先進的第三方物流經營概念及管理技術，並於1994年成立威黃物流服務有限公司，為集團開創了彈性營運成本的結構優勢。"
  },

  // 6 大核心物流方案 (100% 舊網站原文)
  services: [
    {
      id: "warehousing",
      code: "01",
      title: "倉存服務",
      titleEn: "Warehousing Services",
      image: "images/image.jpg",
      desc: "包括香港及深圳的文件倉存服務、一般貨品或個人物品的倉存服務、及儲存櫃租用服務。"
    },
    {
      id: "vas",
      code: "02",
      title: "增值服務",
      titleEn: "Value-Added Services",
      image: "images/index_icon1.png",
      desc: "包括條碼式標籤印製及處理、熱縮包裝、更換包裝、揀貨、代收款項、吊牌處理，代訂各式包裝物料及文具。"
    },
    {
      id: "transport",
      code: "03",
      title: "運輸服務",
      titleEn: "Transportation Services",
      image: "images/car.png",
      desc: "包括國際貨運代辦、中港運輸安排、拖櫃拆櫃、夾車夾櫃、本港貨物派送、機場碼頭提貨、轉口船務文件處理及報關。"
    },
    {
      id: "shipping",
      code: "04",
      title: "船務支援",
      titleEn: "Shipment Support",
      image: "images/single-service-1.jpg",
      desc: "本公司能提供全面的船務支援服務，包括文件製作、代理專業報關、申請出入口證、產地證及熏蒸證、與貨代聯繫安排收發貨物及代訂進出口倉位等事宜，為客戶大大節省處理船務有關方面的時間。"
    },
    {
      id: "it-support",
      code: "05",
      title: "資訊服務",
      titleEn: "Information & IT Services",
      image: "images/single-service-2.jpg",
      desc: "庫存記錄管理、網上存貨查詢及零售系統(POS)管理。"
    },
    {
      id: "ebp-tracking",
      code: "06",
      title: "網上查貨系統",
      titleEn: "Online Stock Checking System",
      image: "images/single-service-4.jpg",
      desc: "在轉變迅速的商業社會中，你永遠無法準確預知未來，但有了威黃可靠的物流管理，你再也不用擔心，在計劃之外驟增的存貨，又或相反地，當貨物存量需求減少時，面對人手及貨倉空間的過剩，所引起的成本負擔。無論你對物流服務的要求有多獨特、或有多複雜，我們都有足夠的經驗與專業知識，助你解決難題。"
    }
  ],

  // 企業核心價值 (100% 舊網站原文)
  coreValues: [
    {
      icon: "fa-user-check",
      title: "以客為先、服務至上",
      desc: "為客戶提供度身訂造的方案，以客戶利益為大原則，確保服務至上。"
    },
    {
      icon: "fa-sync-alt",
      title: "積極革新、與時並進",
      desc: "不斷引入新技術及新系統，配合經濟發展的步伐，令服務及配套更完善。"
    },
    {
      icon: "fa-handshake",
      title: "著重誠信、共同發展",
      desc: "堅持企業操守，與客戶一起成長，擴展開拓業務。"
    }
  ],

  // 網店倉庫服務 (100% 舊網站原文)
  ecommerce: {
    title: "網店倉庫服務",
    processTitle: "現時網店一般流程",
    processSteps: ["倉存服務", "加工服務", "接收訂單", "執貨", "包裝", "快遞"],
    pricingTitle: "租金按每日實際使用量計算",
    pricingPoints: [
      "客人可免除自設倉庫租金的硬支出",
      "也不用擔心在計劃之外驟增的存貨或空間過剩負擔"
    ]
  },

  // 主要客戶 (100% 舊網站原文)
  clientsIntro: "雖然我們的市場定位是第三方物流，但為完善“一條龍”的服務需求，尤其在拓展「項目發展」及「服務專案」時，往往會扮演著第四方物流的角色。我們需要與更多“行家”合作，尋找互惠互利的方案，共創雙贏。目前已有數間服務供應商與我們發展出長期友好合作關係，在良好的互動下，除了有助於雙方業務增長外，還創造了很好的品牌效應。",
  clients: [
    { name: "ANTEPRIMA", category: "Luxury Fashion" },
    { name: "Marimekko", category: "Design Lifestyle" },
    { name: "ATSURO TAYAMA", category: "Designer Fashion" },
    { name: "Cocktail", category: "Select Shop" },
    { name: "The Little Shop", category: "Kids & Family" },
    { name: "ANTEPRIMA WIREBAG", category: "Accessories" }
  ],

  // 位置圖清單 (100% 舊網站原文)
  locations: [
    { name: "葵涌-達利中心(5樓502A-B)", address: "葵涌梨木道88號達利中心5樓502A-B室 葵涌 香港" },
    { name: "葵涌-達利中心(5樓502C-D)", address: "葵涌梨木道88號達利中心5樓502C-D室 葵涌 香港" },
    { name: "葵涌-達利中心(5樓501)", address: "葵涌梨木道88號達利中心5樓501室 葵涌 香港" },
    { name: "荃灣－永得利中心（11 樓）", address: "荃灣橫窩仔街43-57 號永得利中心11/F 荃灣 香港" },
    { name: "荃灣－永得利中心（7 樓）", address: "荃灣橫窩仔街43-57 號永得利中心7/F 荃灣 香港" },
    { name: "深圳市龍崗區", address: "深圳市龙岗区南湾街道紅棉路港华工业园12号第D栋第五层 深圳 中國" }
  ]
};

// 載入函數：優先從 localStorage 讀取（CMS 修改後儲存的數據），若無則使用預設數據
function getActiveFLSData() {
  try {
    const saved = localStorage.getItem("fls_cms_data");
    if (saved) {
      const parsed = JSON.parse(saved);
      return Object.assign({}, window.FLS_DEFAULT_DATA, parsed);
    }
  } catch (e) {
    console.warn("Could not read local CMS override data", e);
  }
  return window.FLS_DEFAULT_DATA;
}

window.FLS_DATA = getActiveFLSData();
