// Dữ liệu mẫu chuẩn 99% cho SHOPTYSEISEI.NET

export const DEFAULT_SHOP_CONFIG = {
  shopName: 'VANCHUNG.CLICK',
  siteTitle: 'SHOWROOM CHO THUÊ ACC GAME',
  tagline: 'SHOWROOM CHO THUÊ ACC GAME UY TÍN HÀNG ĐẦU',
  blackLogo: '/images/logo-shopvanchung.png',
  whiteLogo: '/images/logo-shopvanchung.png',
  avatar: '/images/logo-shopvanchung.png',
  hotline: '0362481351',
  zaloFF: '0362481351',
  zaloFCM: '0963566724',
  zaloLQ: '0362481351',
  facebookLink: 'https://www.facebook.com/tyseiseiff/',
  workingHours: '24/7',
  cloudDbUrl: 'https://shopaccvchun-default-rtdb.asia-southeast1.firebasedatabase.app',
  supabaseUrl: 'https://gkkonaaxggjulbutweoc.supabase.co',
  supabaseAnonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdra29uYWF4Z2dqdWxidXR3ZW9jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA5NDM2NDIsImV4cCI6MjEwNjUxOTY0Mn0.8pChGd7DRl-4QRLpQoM0mI3vZ5IjBsjEL9MlYow-P10',
  supabaseBucket: 'shop-images',
  adminCredentials: {
    username: 'chungdzvcl',
    password: 'chungdzvcl'
  },
  
  // Banner chính trên cùng
  mainBanner: '/images/banners/main-banner.jpg',
  
  // 4 Thẻ hỗ trợ nhanh trên trang chủ
  supportCards: [
    {
      id: 'sp-ff',
      title: 'Support Free Fire',
      image: '/images/banners/sp-ff.jpg',
      link: 'https://zalo.me/0868994712',
      badge: 'Zalo FF'
    },
    {
      id: 'sp-topup',
      title: 'Support kim cương và hồ sơ',
      image: '/images/banners/sp-topup.jpg',
      link: 'https://zalo.me/0359637777',
      badge: 'Topup'
    },
    {
      id: 'sp-fcm',
      title: 'Support FC Mobile',
      image: '/images/banners/sp-fcm.jpg',
      link: 'https://zalo.me/0963566724',
      badge: 'Zalo FCM'
    },
    {
      id: 'sp-lq',
      title: 'Thu acc và support Liên Quân',
      image: '/images/banners/sp-lq.jpg',
      link: 'https://zalo.me/0977296049',
      badge: 'Zalo LQ'
    }
  ],

  // Banner tiêu đề từng mục game
  gameHeaders: {
    freefire: {
      title: 'ACC FREE FIRE VIP PRO',
      banner: 'https://pub-49db8d8cc54b4abc84b979c54f4fdd5b.r2.dev/items/2026/07/07/img_6a4c82265ec8e_1783398950.png',
      supportBanner: 'https://shoptyseisei.net/uploads/03-09-2026/dc83a6e4-0b77-40f2-8cd1-47c8a2eb407c.jpg',
      supportLink: 'https://zalo.me/0362481351'
    },

    lienquan: {
      title: 'Acc Liên Quân Rẻ Chất',
      banner: 'https://pub-49db8d8cc54b4abc84b979c54f4fdd5b.r2.dev/items/2026/05/07/img_69fc221b2eacc_1778131483.png',
      supportBanner: 'https://shoptyseisei.net/uploads/03-09-2026/2ec58ca4-af38-42d3-9cb4-087b08ac7271.jpg',
      supportLink: 'https://zalo.me/0362481351'
    }
  },

  // Thông báo Popup mở lên khi vào web
  popupAnnouncement: {
    enabled: true,
    headerTitle: 'Thông Báo Mới',
    title: 'SHOWROOM SHOW ACC',
    subtitle: 'ZALO HỖ TRỢ MỌI VẤN ĐỀ',
    ffLabel: 'ZALO FF:',
    ffZalo: '0362481351',
    lqLabel: 'ZALO LQ:',
    lqZalo: '0362481351',
    fcmLabel: 'ZALO FC:',
    fcmZalo: '0963566724',
    showFcmZalo: false,
    note: 'LƯU Ý: AE MUA ACC FC TTT HAY ACC REG NHỚ QUAY VIDEO TỪ LÚC MUA ĐẾN LÚC ĐĂNG NHẬP RỒI VÔ GAME NẾU KHÔNG CÓ VIDEO BÊN VCHUN KHÔNG HỖ TRỢ ĐƯỢC NHA AE CHÚ Ý!!!',
    footerAlert: 'THUÊ ACC FF VUI LÒNG NHẮN ZALO',
    buttonText: 'Tôi Đã Hiểu'
  },

  // Thông báo lưu ý ở đầu trang danh mục showroom (chuẩn shoptyseisei)
  categoryNotice: 'lưu ý: bạn không thể thuê acc free fire bằng tiền trên shop. acc free fire chỉ có thể mua qua zalo. nếu bạn dùng card hoặc đã nạp tiền vào shop vui lòng liên hệ admin để được hỗ trợ'
};

export const SHOP_INFO = {
  name: DEFAULT_SHOP_CONFIG.shopName,
  tagline: DEFAULT_SHOP_CONFIG.tagline,
  hotline: DEFAULT_SHOP_CONFIG.hotline,
  zalo: DEFAULT_SHOP_CONFIG.zaloFF,
  zaloLink: `https://zalo.me/${DEFAULT_SHOP_CONFIG.zaloFF}`,
  zaloFF: DEFAULT_SHOP_CONFIG.zaloFF,
  zaloFCM: DEFAULT_SHOP_CONFIG.zaloFCM,
  zaloLQ: DEFAULT_SHOP_CONFIG.zaloLQ,
  facebookLink: DEFAULT_SHOP_CONFIG.facebookLink,
  workingHours: DEFAULT_SHOP_CONFIG.workingHours,
  address: 'Hà Nội, Việt Nam'
};

export const INITIAL_CATEGORIES = [
  // --- FREE FIRE ---
  {
    id: 'ff-under-2m',
    game: 'freefire',
    name: 'THUÊ ACC DƯỚI 2M',
    tag: 'FREE FIRE',
    image: 'https://shoptyseisei.net/uploads/03-09-2026/4a880721-608d-4cd0-af80-103f8bd1764b.jpg',
    minPrice: 0,
    maxPrice: 2000000,
    order: 1
  },
  {
    id: 'ff-2m-7m',
    game: 'freefire',
    name: 'THUÊ ACC FF 2M ĐẾN 7M',
    tag: 'FREE FIRE',
    image: 'https://shoptyseisei.net/uploads/03-09-2026/78a0cdf7-2f99-4686-a9ca-a321c5038337.jpg',
    minPrice: 2000000,
    maxPrice: 7000000,
    order: 2
  },
  {
    id: 'ff-7m-15m',
    game: 'freefire',
    name: 'THUÊ ACC FF 7M ĐẾN 15M',
    tag: 'FREE FIRE',
    image: 'https://shoptyseisei.net/uploads/03-09-2026/f3c5a959-b29d-428a-be32-ef5aeaa8c072.jpg',
    minPrice: 7000000,
    maxPrice: 15000000,
    order: 3
  },
  {
    id: 'ff-sieu-pham',
    game: 'freefire',
    name: 'THUÊ ACC SIÊU PHẨM',
    tag: 'FREE FIRE VIP',
    image: 'https://shoptyseisei.net/uploads/03-09-2026/f420bf92-5e11-4e1b-b050-7dd4764945ae.jpg',
    minPrice: 15000000,
    maxPrice: 999999999,
    order: 4
  },

  // --- LIÊN QUÂN (CHỈ DUY NHẤT MỤC NICK LIÊN QUÂN CỰC PHẨM THEO YÊU CẦU CỦA USER, BỎ PHẦN RANDOM) ---
  {
    id: 'lq-cuc-pham',
    game: 'lienquan',
    name: 'NICK LIÊN QUÂN CỰC PHẨM',
    tag: 'LIÊN QUÂN VIP',
    image: 'https://shoptyseisei.net/uploads/03-09-2026/4bb14574-5f3d-426a-9da7-11f8215e3b11.jpg',
    minPrice: 0,
    maxPrice: 999999999,
    order: 11
  }
];

export const INITIAL_BANNERS = [
  {
    id: 'bn-main',
    title: 'SHOWROOM SHOW ACC',
    subtitle: 'ZALO HỖ TRỢ MỌI VẤN ĐỀ - BẢO HÀNH VĨNH VIỄN',
    tag: 'BANNER CHÍNH',
    buttonText: 'LIÊN HỆ ZALO NGAY',
    link: 'https://zalo.me/0362481351',
    badge: 'HOT',
    image: 'https://shoptyseisei.net/uploads/03-09-2026/ee76f8d7-7306-4d6c-9a8b-7f0b60703bea.jpg',
    active: true,
    order: 1
  }
];

export const INITIAL_ACCOUNTS = [
  {
    "id": "#FF26081",
    "code": "#FF26081",
    "title": "ACC FF VIP #26081 - SET GINTOKI SAKATA + AK RỒNG LV7 + MP40 LV7",
    "game": "freefire",
    "categoryId": "ff-2m-7m",
    "price": 2600000,
    "originalPrice": 3200000,
    "level": 66,
    "rank": "Huyền Thoại",
    "skins": 246,
    "characters": "Full nhân vật",
    "pets": "18 Pet",
    "gunSkins": "AK Rồng Xanh Lv7, MP40 Mãng Xà Lv7, Famas Lv4, SCAR Lv4",
    "outfits": "Set Gintoki Sakata (Gintama), Áo Mùa 2, Đồ Cổ",
    "rareItems": "Đồ Cổ S1-S2, Gintoki Sakata",
    "description": "Tài khoản Free Fire chính chủ, thông tin trắng sạch 100%, bảo hành trọn đời.",
    "thumbnail": "https://gkkonaaxggjulbutweoc.supabase.co/storage/v1/object/public/shop-images/accounts/1791272128244_9r7t11d.jpg",
    "gallery": [
      "https://gkkonaaxggjulbutweoc.supabase.co/storage/v1/object/public/shop-images/accounts/1791272128244_9r7t11d.jpg"
    ],
    "status": "available",
    "hidden": false,
    "isVip": false,
    "isFeatured": true,
    "views": 0,
    "createdAt": "2026-10-06T07:35:29.000Z"
  },
  {
    "id": "#FF23092",
    "code": "#FF23092",
    "title": "ACC FF VIP #23092 - ĐẤU SĨ HUYỀN THOẠI + SCAR CÁ MẬP LV6 + MP40 LV5",
    "game": "freefire",
    "categoryId": "ff-2m-7m",
    "price": 2300000,
    "originalPrice": 3000000,
    "level": 68,
    "rank": "Huyền Thoại",
    "skins": 354,
    "characters": "Full nhân vật",
    "pets": "20 Pet",
    "gunSkins": "SCAR Cá Mập Lv6, MP40 Mãng Xà Lv5, AK Rồng Lv4",
    "outfits": "Áo Đấu Sĩ Huyền Thoại, Quần Cổ, Full Set Hiếm",
    "rareItems": "Set Quỷ Dạ Xoa, Đấu Sĩ",
    "description": "Tài khoản Free Fire cực VIP, bảo mật trắng, hỗ trợ đổi thông tin vĩnh viễn.",
    "thumbnail": "https://gkkonaaxggjulbutweoc.supabase.co/storage/v1/object/public/shop-images/accounts/1791272170293_76m5rme.jpg",
    "gallery": [
      "https://gkkonaaxggjulbutweoc.supabase.co/storage/v1/object/public/shop-images/accounts/1791272170293_76m5rme.jpg"
    ],
    "status": "available",
    "hidden": false,
    "isVip": false,
    "isFeatured": true,
    "views": 0,
    "createdAt": "2026-10-06T07:36:11.000Z"
  },
  {
    "id": "#FF30018",
    "code": "#FF30018",
    "title": "ACC FF VIP #30018 - COMBO BLUE LOCK (NAGI ĐỘI V) + AK RỒNG LV7 + M1014 LV7",
    "game": "freefire",
    "categoryId": "ff-2m-7m",
    "price": 3000000,
    "originalPrice": 4000000,
    "level": 57,
    "rank": "Huyền Thoại",
    "skins": 208,
    "characters": "Full nhân vật",
    "pets": "15 Pet",
    "gunSkins": "AK Rồng Lv7, M1014 Long Tộc Lv7, MP40 Mãng Xà Lv5, UMP Lv5",
    "outfits": "Set Nagi Đội V (Blue Lock), Áo Số 9, Set Hiếm S1",
    "rareItems": "Nagi Đội V (Blue Lock), AK Rồng Lv7",
    "description": "Tài khoản siêu phẩm combo Blue Lock, full súng nâng cấp Lv7 cực cháy.",
    "thumbnail": "https://gkkonaaxggjulbutweoc.supabase.co/storage/v1/object/public/shop-images/accounts/1791272211487_yidwhkm.jpg",
    "gallery": [
      "https://gkkonaaxggjulbutweoc.supabase.co/storage/v1/object/public/shop-images/accounts/1791272211487_yidwhkm.jpg"
    ],
    "status": "available",
    "hidden": false,
    "isVip": true,
    "isFeatured": true,
    "views": 0,
    "createdAt": "2026-10-06T07:36:52.000Z"
  },
  {
    "id": "#FF15024",
    "code": "#FF15024",
    "title": "ACC FF VIP #15024 - ÁO KHOÁC DA BIKER + MP40 LV4 + AK RỒNG LV4",
    "game": "freefire",
    "categoryId": "ff-duoi-2m",
    "price": 1500000,
    "originalPrice": 2000000,
    "level": 62,
    "rank": "Huyền Thoại",
    "skins": 121,
    "characters": "Full nhân vật",
    "pets": "16 Pet",
    "gunSkins": "MP40 Mãng Xà Lv4, AK Rồng Xanh Lv4, M1014 Lv3, UMP Lv3",
    "outfits": "Áo Khoác Da Biker, Râu Bạc, Quần Bò Rách",
    "rareItems": "Áo Biker, Râu Bạc",
    "description": "Tài khoản giá học sinh cấu hình khủng, súng nâng cấp đầy đủ, thông tin trắng sạch.",
    "thumbnail": "https://gkkonaaxggjulbutweoc.supabase.co/storage/v1/object/public/shop-images/accounts/1791272243158_d66qzkw.jpg",
    "gallery": [
      "https://gkkonaaxggjulbutweoc.supabase.co/storage/v1/object/public/shop-images/accounts/1791272243158_d66qzkw.jpg"
    ],
    "status": "available",
    "hidden": false,
    "isVip": false,
    "isFeatured": true,
    "views": 0,
    "createdAt": "2026-10-06T07:37:24.000Z"
  },
  {
    "id": "#FF16065",
    "code": "#FF16065",
    "title": "ACC FF VIP #16065 - TIỆC PIJAMA NAM + MP40 MÃNG XÀ LV4 + M1014 LV4",
    "game": "freefire",
    "categoryId": "ff-duoi-2m",
    "price": 1600000,
    "originalPrice": 2200000,
    "level": 65,
    "rank": "Huyền Thoại",
    "skins": 226,
    "characters": "Full nhân vật",
    "pets": "18 Pet",
    "gunSkins": "MP40 Mãng Xà Lv4, M1014 Lv4, AK Lv3, SCAR Lv1",
    "outfits": "Tiệc Pijama Nam (Áo), Râu Bạc, Áo Trắng Cổ",
    "rareItems": "Tiệc Pijama Nam, Râu Bạc",
    "description": "Acc Free Fire Pijama nam cực hot, kho súng và hành động phong phú.",
    "thumbnail": "https://gkkonaaxggjulbutweoc.supabase.co/storage/v1/object/public/shop-images/accounts/1791272268297_ne75psz.jpg",
    "gallery": [
      "https://gkkonaaxggjulbutweoc.supabase.co/storage/v1/object/public/shop-images/accounts/1791272268297_ne75psz.jpg"
    ],
    "status": "available",
    "hidden": false,
    "isVip": false,
    "isFeatured": true,
    "views": 0,
    "createdAt": "2026-10-06T07:37:49.000Z"
  },
  {
    "id": "#FF16563",
    "code": "#FF16563",
    "title": "ACC FF VIP #16563 - ÁO BÓNG ĐÁ ARGENTINA + MP40 MÃNG XÀ LV5 + UMP LV7",
    "game": "freefire",
    "categoryId": "ff-duoi-2m",
    "price": 1650000,
    "originalPrice": 2300000,
    "level": 63,
    "rank": "Huyền Thoại",
    "skins": 168,
    "characters": "Full nhân vật",
    "pets": "18 Pet",
    "gunSkins": "UMP Thần Thoại Lv7, MP40 Mãng Xà Lv5, AK Rồng Lv4",
    "outfits": "Áo Đội Tuyển Argentina, Quần Đùi Dâu, Áo Vest Đen",
    "rareItems": "Áo Argentina, UMP Lv7",
    "description": "Acc bóng đá Argentina cực chất, UMP Lv7 max ping, giao dịch bảo mật 100%.",
    "thumbnail": "https://gkkonaaxggjulbutweoc.supabase.co/storage/v1/object/public/shop-images/accounts/1791272298232_gqitkgr.jpg",
    "gallery": [
      "https://gkkonaaxggjulbutweoc.supabase.co/storage/v1/object/public/shop-images/accounts/1791272298232_gqitkgr.jpg"
    ],
    "status": "available",
    "hidden": false,
    "isVip": false,
    "isFeatured": true,
    "views": 0,
    "createdAt": "2026-10-06T07:38:19.000Z"
  },
  {
    "id": "#FF11071",
    "code": "#FF11071",
    "title": "ACC FF VIP #11071 - ÁO BÓNG MA PHÍA TÂY + M1014 LV5 + MP40 LV4",
    "game": "freefire",
    "categoryId": "ff-duoi-2m",
    "price": 1100000,
    "originalPrice": 1800000,
    "level": 71,
    "rank": "Huyền Thoại",
    "skins": 262,
    "characters": "Full nhân vật",
    "pets": "22 Pet",
    "gunSkins": "M1014 Lôi Long Lv5, MP40 Mãng Xà Lv4, AK Rồng Lv4, SCAR Lv4",
    "outfits": "Áo Bóng Ma Phía Tây, Quần Quỷ Dạ Xoa, Mặt Nạ Neon",
    "rareItems": "Bóng Ma Phía Tây, Quần Dạ Xoa",
    "description": "Acc level 71 cực nét, Áo Bóng Ma phía tây danh giá, giá siêu êm 1.1tr.",
    "thumbnail": "https://gkkonaaxggjulbutweoc.supabase.co/storage/v1/object/public/shop-images/accounts/1791272319716_zljq82v.jpg",
    "gallery": [
      "https://gkkonaaxggjulbutweoc.supabase.co/storage/v1/object/public/shop-images/accounts/1791272319716_zljq82v.jpg"
    ],
    "status": "available",
    "hidden": false,
    "isVip": false,
    "isFeatured": true,
    "views": 0,
    "createdAt": "2026-10-06T07:38:40.000Z"
  },
  {
    "id": "#FF18066",
    "code": "#FF18066",
    "title": "ACC FF VIP #18066 - ÁO BÓNG MA PHÍA TÂY + SCAR CÁ MẬP LV7 + MP40 LV7",
    "game": "freefire",
    "categoryId": "ff-duoi-2m",
    "price": 1800000,
    "originalPrice": 2500000,
    "level": 66,
    "rank": "Huyền Thoại",
    "skins": 195,
    "characters": "Full nhân vật",
    "pets": "17 Pet",
    "gunSkins": "SCAR Cá Mập Đen Lv7, MP40 Mãng Xà Lv7, AK Rồng Lv3, M1014 Lv3",
    "outfits": "Áo Bóng Ma Phía Tây, Quần Trắng Cổ, Râu Bạc",
    "rareItems": "SCAR Lv7 Max, MP40 Lv7 Max",
    "description": "Cặp đôi súng Lv7 Max huyền thoại kèm Áo Bóng Ma Phía Tây.",
    "thumbnail": "https://gkkonaaxggjulbutweoc.supabase.co/storage/v1/object/public/shop-images/accounts/1791272376701_yquy3s2.jpg",
    "gallery": [
      "https://gkkonaaxggjulbutweoc.supabase.co/storage/v1/object/public/shop-images/accounts/1791272376701_yquy3s2.jpg"
    ],
    "status": "available",
    "hidden": false,
    "isVip": false,
    "isFeatured": true,
    "views": 0,
    "createdAt": "2026-10-06T07:39:37.000Z"
  },
  {
    "id": "#FF15071",
    "code": "#FF15071",
    "title": "ACC FF VIP #15071 - ÁO KHOÁC ĐƯỜNG PHỐ + AK RỒNG XANH LV5 + SCAR LV4",
    "game": "freefire",
    "categoryId": "ff-duoi-2m",
    "price": 1500000,
    "originalPrice": 2000000,
    "level": 71,
    "rank": "Huyền Thoại",
    "skins": 418,
    "characters": "Full nhân vật",
    "pets": "25 Pet",
    "gunSkins": "AK Rồng Xanh Lv5, SCAR Thần Thoại Lv4, MP40 Mãng Xà",
    "outfits": "Đường Phố (Áo Khoác), Vòng Cổ Vàng, Kính Đen",
    "rareItems": "Áo Đường Phố, AK Lv5",
    "description": "Acc level 71 kho đồ 418 trang phục, AK Rồng Xanh Lv5 cực mạnh.",
    "thumbnail": "https://gkkonaaxggjulbutweoc.supabase.co/storage/v1/object/public/shop-images/accounts/1791272494791_7660dv4.jpg",
    "gallery": [
      "https://gkkonaaxggjulbutweoc.supabase.co/storage/v1/object/public/shop-images/accounts/1791272494791_7660dv4.jpg"
    ],
    "status": "available",
    "hidden": false,
    "isVip": false,
    "isFeatured": true,
    "views": 0,
    "createdAt": "2026-10-06T07:41:35.000Z"
  },
  {
    "id": "#FF12074",
    "code": "#FF12074",
    "title": "ACC FF SIÊU CỰC PHẨM VIP - 13 KHẨU SÚNG LV7 MAX + ÁO THÍCH KHÁCH KIM",
    "game": "freefire",
    "categoryId": "ff-7m-plus",
    "price": 12000000,
    "originalPrice": 15000000,
    "level": 74,
    "rank": "Thách Đấu",
    "skins": 566,
    "characters": "Full nhân vật",
    "pets": "30 Pet",
    "gunSkins": "13 Khẩu Evo Lv7 Max (AK, M1014, MP40, SCAR, XM8, UMP...)",
    "outfits": "Áo Thích Khách Kim, Set Thiên Thần, Quỷ Dạ Xoa, Quần Cổ S1",
    "rareItems": "13 Súng Lv7 Max, Thích Khách Kim, Cánh Thiên Thần",
    "description": "Siêu phẩm đỉnh nóc kịch trần Free Fire, 13 khẩu súng nâng cấp Lv7 Max toàn diện.",
    "thumbnail": "https://gkkonaaxggjulbutweoc.supabase.co/storage/v1/object/public/shop-images/accounts/1791272541955_qwnf0qo.jpg",
    "gallery": [
      "https://gkkonaaxggjulbutweoc.supabase.co/storage/v1/object/public/shop-images/accounts/1791272541955_qwnf0qo.jpg"
    ],
    "status": "available",
    "hidden": false,
    "isVip": true,
    "isFeatured": true,
    "views": 0,
    "createdAt": "2026-10-06T07:42:22.000Z"
  },
  {
    "id": "#FF25071",
    "code": "#FF25071",
    "title": "ACC FF VIP #25071 - ÁO THÍCH KHÁCH THIÊN + UMP LV6 + MP40 LV5 + AK LV4",
    "game": "freefire",
    "categoryId": "ff-2m-7m",
    "price": 2500000,
    "originalPrice": 3500000,
    "level": 71,
    "rank": "Huyền Thoại",
    "skins": 454,
    "characters": "Full nhân vật",
    "pets": "22 Pet",
    "gunSkins": "UMP Thần Thoại Lv6, MP40 Mãng Xà Lv5, AK Rồng Lv4",
    "outfits": "Áo Thích Khách Thiên, Set Nữ Hiếm, Quần Bò Siêu Phẩm",
    "rareItems": "Áo Thích Khách Thiên, UMP Lv6",
    "description": "Acc level 71 Áo Thích Khách Thiên nữ cực đẹp, UMP Lv6 bắn siêu đầm.",
    "thumbnail": "https://gkkonaaxggjulbutweoc.supabase.co/storage/v1/object/public/shop-images/accounts/1791272607385_v3xnlua.jpg",
    "gallery": [
      "https://gkkonaaxggjulbutweoc.supabase.co/storage/v1/object/public/shop-images/accounts/1791272607385_v3xnlua.jpg"
    ],
    "status": "available",
    "hidden": false,
    "isVip": false,
    "isFeatured": true,
    "views": 0,
    "createdAt": "2026-10-06T07:43:28.000Z"
  },
  {
    "id": "#LQ50030",
    "code": "#LQ50030",
    "title": "NICK LIÊN QUÂN CỰC PHẨM - FULL 127 TƯỚNG + 479 SKIN (THỨ NGUYÊN VỆ THẦN)",
    "game": "lienquan",
    "categoryId": "lq-cuc-pham",
    "price": 5000000,
    "originalPrice": 6500000,
    "level": 30,
    "rank": "Thách Đấu",
    "skins": 479,
    "characters": "127/127 Full Tướng",
    "pets": "Full Pet",
    "gunSkins": "479 Trang Phục (SSS Thần Thoại, Anime, Thứ Nguyên Vệ Thần)",
    "outfits": "Full Skin SSS Nakroth, Tulen Kiếm Tiên, Murad, Butterfly, Laville",
    "rareItems": "Nakroth Thứ Nguyên, Tulen Kiếm Tiên, Raz Muay Thái",
    "description": "Siêu phẩm Liên Quân Mobile cực phẩm, full 127 tướng, 479 trang phục bậc SSS, Thứ Nguyên Vệ Thần.",
    "thumbnail": "https://gkkonaaxggjulbutweoc.supabase.co/storage/v1/object/public/shop-images/accounts/1791272650736_el57hf5.jpg",
    "gallery": [
      "https://gkkonaaxggjulbutweoc.supabase.co/storage/v1/object/public/shop-images/accounts/1791272650736_el57hf5.jpg"
    ],
    "status": "available",
    "hidden": false,
    "isVip": true,
    "isFeatured": true,
    "views": 0,
    "createdAt": "2026-10-06T07:44:11.000Z"
  },
  {
    "id": "#FF17063",
    "code": "#FF17063",
    "title": "ACC FF VIP #17063 - ÁO TRAI NGỔ NGÁO + AK RỒNG XANH LV7 + MP40 LV6",
    "game": "freefire",
    "categoryId": "ff-duoi-2m",
    "price": 1700000,
    "originalPrice": 2400000,
    "level": 63,
    "rank": "Huyền Thoại",
    "skins": 192,
    "characters": "Full nhân vật",
    "pets": "19 Pet",
    "gunSkins": "AK Rồng Xanh Lv7, MP40 Mãng Xà Lv6, SCAR Cá Mập Lv4, UMP Lv4",
    "outfits": "Áo Trai Ngổ Ngáo, Áo Khoác Biker, Râu Bạc",
    "rareItems": "Áo Trai Ngổ Ngáo, AK Lv7, MP40 Lv6",
    "description": "Tài khoản chính chủ AK Rồng Xanh Lv7 max ping, MP40 Lv6, Áo Trai Ngổ Ngáo.",
    "thumbnail": "https://gkkonaaxggjulbutweoc.supabase.co/storage/v1/object/public/shop-images/accounts/1791272759428_o64aff8.jpg",
    "gallery": [
      "https://gkkonaaxggjulbutweoc.supabase.co/storage/v1/object/public/shop-images/accounts/1791272759428_o64aff8.jpg"
    ],
    "status": "available",
    "hidden": false,
    "isVip": false,
    "isFeatured": true,
    "views": 0,
    "createdAt": "2026-10-06T07:46:00.000Z"
  },
  {
    "code": "#FF64251",
    "id": "#FF64251",
    "title": "ACC FF VIP #64251 - AK RỒNG XANH + MP40 MÃNG XÀ",
    "game": "freefire",
    "categoryId": "ff-2m-7m",
    "price": 6500000,
    "originalPrice": 7500000,
    "level": 0,
    "rank": "Huyền Thoại",
    "skins": 150,
    "characters": "Full nhân vật",
    "pets": "18 Pet",
    "gunSkins": "AK RỒNG XANH Lv4, MP40 MÃNG XÀ Lv5",
    "outfits": "Set Quỷ Dạ Xoa, Áo Mùa 2",
    "rareItems": "Đồ Cổ S1-S2",
    "description": "Tài khoản chính chủ, thông tin trắng sạch 100%, hỗ trợ đổi thông tin bảo mật vĩnh viễn.",
    "thumbnail": "https://gkkonaaxggjulbutweoc.supabase.co/storage/v1/object/public/shop-images/accounts/1791259505500_lqzhonw.jpg",
    "gallery": [
      "https://gkkonaaxggjulbutweoc.supabase.co/storage/v1/object/public/shop-images/accounts/1791259505500_lqzhonw.jpg"
    ],
    "status": "available",
    "hidden": false,
    "isVip": false,
    "isFeatured": true,
    "views": 0,
    "createdAt": "2026-10-06T03:45:00.000Z"
  },
  {
    "code": "#FF15091",
    "id": "#FF15091",
    "title": "ACC FF VIP #15091 - AK RỒNG XANH + MP40 MÃNG XÀ",
    "game": "freefire",
    "categoryId": "ff-2m-7m",
    "price": 7000000,
    "originalPrice": 8000000,
    "level": 0,
    "rank": "Huyền Thoại",
    "skins": 150,
    "characters": "Full nhân vật",
    "pets": "18 Pet",
    "gunSkins": "AK RỒNG XANH Lv4, MP40 MÃNG XÀ Lv5",
    "outfits": "Set Quỷ Dạ Xoa, Áo Mùa 2",
    "rareItems": "Đồ Cổ S1-S2",
    "description": "Tài khoản chính chủ, thông tin trắng sạch 100%, hỗ trợ đổi thông tin bảo mật vĩnh viễn.",
    "thumbnail": "https://gkkonaaxggjulbutweoc.supabase.co/storage/v1/object/public/shop-images/accounts/1791259466582_ryn56ji.jpg",
    "gallery": [
      "https://gkkonaaxggjulbutweoc.supabase.co/storage/v1/object/public/shop-images/accounts/1791259466582_ryn56ji.jpg"
    ],
    "status": "available",
    "hidden": false,
    "isVip": false,
    "isFeatured": true,
    "views": 0,
    "createdAt": "2026-10-06T03:44:00.000Z"
  },
  {
    "code": "#FF63507",
    "id": "#FF63507",
    "title": "ACC FF VIP #63507 - AK RỒNG XANH + MP40 MÃNG XÀ",
    "game": "freefire",
    "categoryId": "ff-7m-plus",
    "price": 11500000,
    "originalPrice": 13000000,
    "level": 0,
    "rank": "Huyền Thoại",
    "skins": 150,
    "characters": "Full nhân vật",
    "pets": "18 Pet",
    "gunSkins": "AK RỒNG XANH Lv4, MP40 MÃNG XÀ Lv5",
    "outfits": "Set Quỷ Dạ Xoa, Áo Mùa 2",
    "rareItems": "Đồ Cổ S1-S2",
    "description": "Tài khoản chính chủ, thông tin trắng sạch 100%, hỗ trợ đổi thông tin bảo mật vĩnh viễn.",
    "thumbnail": "https://gkkonaaxggjulbutweoc.supabase.co/storage/v1/object/public/shop-images/accounts/1791259416159_83md6ad.jpg",
    "gallery": [
      "https://gkkonaaxggjulbutweoc.supabase.co/storage/v1/object/public/shop-images/accounts/1791259416159_83md6ad.jpg"
    ],
    "status": "available",
    "hidden": false,
    "isVip": false,
    "isFeatured": true,
    "views": 0,
    "createdAt": "2026-10-06T03:43:00.000Z"
  },
  {
    "code": "#FF60145",
    "id": "#FF60145",
    "title": "ACC FF VIP #60145 - AK RỒNG XANH + MP40 MÃNG XÀ",
    "game": "freefire",
    "categoryId": "ff-7m-plus",
    "price": 9000000,
    "originalPrice": 10000000,
    "level": 65,
    "rank": "Huyền Thoại",
    "skins": 150,
    "characters": "Full nhân vật",
    "pets": "18 Pet",
    "gunSkins": "AK RỒNG XANH Lv4, MP40 MÃNG XÀ Lv5",
    "outfits": "Set Quỷ Dạ Xoa, Áo Mùa 2",
    "rareItems": "Đồ Cổ S1-S2",
    "description": "Tài khoản chính chủ, thông tin trắng sạch 100%, hỗ trợ đổi thông tin bảo mật vĩnh viễn.",
    "thumbnail": "https://gkkonaaxggjulbutweoc.supabase.co/storage/v1/object/public/shop-images/accounts/1791259369522_h908zdx.jpg",
    "gallery": [
      "https://gkkonaaxggjulbutweoc.supabase.co/storage/v1/object/public/shop-images/accounts/1791259369522_h908zdx.jpg"
    ],
    "status": "available",
    "hidden": false,
    "isVip": false,
    "isFeatured": true,
    "views": 0,
    "createdAt": "2026-10-06T03:42:00.000Z"
  }
];
