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
  
  // Banner chính trên cùng
  mainBanner: '/images/banner-shopvanchung.png',
  
  // 4 Thẻ hỗ trợ nhanh trên trang chủ
  supportCards: [
    {
      id: 'sp-ff',
      title: 'Support Free Fire',
      image: 'https://shoptyseisei.net/uploads/03-09-2026/dc83a6e4-0b77-40f2-8cd1-47c8a2eb407c.jpg',
      link: 'https://zalo.me/0362481351',
      badge: 'Zalo FF'
    },
    {
      id: 'sp-topup',
      title: 'Support kim cương và hồ sơ',
      image: 'https://pub-49db8d8cc54b4abc84b979c54f4fdd5b.r2.dev/items/2026/09/13/img_6aa652bde02e9_1789285053.jpeg',
      link: 'https://topupgiare.com',
      badge: 'Topup'
    },
    {
      id: 'sp-rent',
      title: 'Thuê acc Free Fire & LQ qua Zalo',
      image: 'https://pub-49db8d8cc54b4abc84b979c54f4fdd5b.r2.dev/items/2026/07/07/img_6a4c82265ec8e_1783398950.png',
      link: 'https://zalo.me/0362481351',
      badge: 'Thuê Acc'
    },
    {
      id: 'sp-lq',
      title: 'Thu acc và support Liên Quân',
      image: 'https://shoptyseisei.net/uploads/03-09-2026/2ec58ca4-af38-42d3-9cb4-087b08ac7271.jpg',
      link: 'https://zalo.me/0362481351',
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
    image: '/images/banner-shopvanchung.png',
    active: true,
    order: 1
  }
];

export const INITIAL_ACCOUNTS = [
  // --- CÁC ACC FREE FIRE CHUẨN SHOWROOM SHOPTYSEISEI (MS 87898, MS 87897, MS 87892, MS 87889, MS 87886, MS 87885) ---
  {
    id: '87898',
    code: '87898',
    title: 'ACC FREE FIRE MS 87898 - SET CỔ ĐIỂN + FULL ĐỒ HIẾM',
    game: 'freefire',
    categoryId: 'ff-under-2m',
    price: 1000000,
    originalPrice: 1500000,
    level: 65,
    rank: 'Huyền Thoại',
    rankTier: 'legendary',
    tag: 'LH ZALO ĐỂ THUÊ 99 NĂM',
    skins: 180,
    characters: 'Full 45 nhân vật',
    pets: 'Full Pet',
    gunSkins: 'AK Rồng Xanh, MP40 Mãng Xà, M1014 Long Tộc',
    outfits: 'Set Trang Phục Mùa 2, Áo Thỏ Tim, Quần Búp Bê',
    rareItems: 'Nắm Đấm Hỏa Long, Quán Quân Thế Giới',
    description: 'Tài khoản Free Fire trưng bày showroom cực đẹp, nhiều trang phục hiếm, liên hệ Zalo 0868994712 để thuê hoặc mua ngay.',
    thumbnail: 'https://pub-49db8d8cc54b4abc84b979c54f4fdd5b.r2.dev/items/2026/09/28/img_6aba9a87a4713_1790614151.jpg',
    gallery: [
      'https://pub-49db8d8cc54b4abc84b979c54f4fdd5b.r2.dev/items/2026/09/28/img_6aba9a87a4713_1790614151.jpg',
      'https://pub-49db8d8cc54b4abc84b979c54f4fdd5b.r2.dev/mobile/2026/09/22/img_6ab22a3ed504c610094559_IMG_1497.jpg',
      'https://pub-49db8d8cc54b4abc84b979c54f4fdd5b.r2.dev/mobile/2026/09/22/img_6ab22a404745a456374664_IMG_1498.jpg',
      'https://pub-49db8d8cc54b4abc84b979c54f4fdd5b.r2.dev/mobile/2026/09/22/img_6ab22a4170261283468454_IMG_1501.jpg',
      'https://pub-49db8d8cc54b4abc84b979c54f4fdd5b.r2.dev/mobile/2026/09/22/img_6ab22a434d0cd769241559_IMG_1500.jpg',
      'https://pub-49db8d8cc54b4abc84b979c54f4fdd5b.r2.dev/mobile/2026/09/22/img_6ab22a448310a252291194_IMG_1499.jpg'
    ],
    status: 'available',
    hidden: false,
    isFeatured: true,
    isVip: true,
    views: 3120,
    createdAt: '2026-09-28T12:00:00Z'
  },
  {
    id: '87897',
    code: '87897',
    title: 'ACC FREE FIRE MS 87897 - COMBO QUẦN ÁO ĐỈNH CAO + SÚNG NÂNG CẤP',
    game: 'freefire',
    categoryId: 'ff-under-2m',
    price: 1900000,
    originalPrice: 2400000,
    level: 70,
    rank: 'Huyền Thoại (45 Sao)',
    rankTier: 'legendary',
    tag: 'LH ZALO ĐỂ THUÊ 99 NĂM',
    skins: 220,
    characters: '48 nhân vật',
    pets: 'Full Pet Trợ Thủ',
    gunSkins: 'AK Rồng Max Lv7, MP40 Mãng Xà Lv6, SCAR Cá Mập Lv5',
    outfits: 'Quỷ Dạ Xoa, Áo Mùa 1, Giày Búp Bê',
    rareItems: 'Điệu nhảy HipHop, Ván Lướt Vàng',
    description: 'Acc cực ngon tầm giá dưới 2M, súng sấy cực bốc, liên hệ Zalo 0868994712 để thuê hoặc giao dịch.',
    thumbnail: 'https://pub-49db8d8cc54b4abc84b979c54f4fdd5b.r2.dev/items/2026/09/28/img_6aba9a75a6f2a_1790614133.jpg',
    gallery: [
      'https://pub-49db8d8cc54b4abc84b979c54f4fdd5b.r2.dev/items/2026/09/28/img_6aba9a75a6f2a_1790614133.jpg'
    ],
    status: 'available',
    hidden: false,
    isFeatured: true,
    isVip: true,
    views: 2890,
    createdAt: '2026-09-28T11:45:00Z'
  },
  {
    id: '87892',
    code: '87892',
    title: 'ACC FREE FIRE MS 87892 - KHO ĐỒ CỰC VIP GIÁ RẺ',
    game: 'freefire',
    categoryId: 'ff-under-2m',
    price: 1000000,
    originalPrice: 1400000,
    level: 66,
    rank: 'Kim Cương IV',
    rankTier: 'diamond',
    tag: 'LH ZALO ĐỂ THUÊ 99 NĂM',
    skins: 155,
    characters: '42 nhân vật',
    pets: '18 Pet',
    gunSkins: 'MP40 Mãng Xà Lv5, UMP Nghệ Sĩ, M1014 Long Tộc',
    outfits: 'Set Chiến Binh Cổ, Áo Khoác Đen, Quần Đi Biển',
    rareItems: 'Nắm Đấm Băng Giá, Ván Rồng',
    description: 'Kho skin cực xịn, thông tin sạch 100%, bảo mật đầy đủ 2 lớp, liên hệ Zalo admin.',
    thumbnail: 'https://pub-49db8d8cc54b4abc84b979c54f4fdd5b.r2.dev/items/2026/09/28/img_6aba9a1b788ff_1790614043.jpg',
    gallery: [
      'https://pub-49db8d8cc54b4abc84b979c54f4fdd5b.r2.dev/items/2026/09/28/img_6aba9a1b788ff_1790614043.jpg'
    ],
    status: 'available',
    hidden: false,
    isFeatured: false,
    isVip: false,
    views: 1980,
    createdAt: '2026-09-28T11:15:00Z'
  },
  {
    id: '87889',
    code: '87889',
    title: 'ACC FREE FIRE MS 87889 - GIÁ HỌC SINH 700K',
    game: 'freefire',
    categoryId: 'ff-under-2m',
    price: 700000,
    originalPrice: 950000,
    level: 59,
    rank: 'Bạch Kim II',
    rankTier: 'platinum',
    tag: 'LH ZALO ĐỂ THUÊ 99 NĂM',
    skins: 110,
    characters: '38 nhân vật',
    pets: '15 Pet',
    gunSkins: 'AK Rồng Xanh Lv4, Scar Đẳng Cấp Titan',
    outfits: 'Set Thỏ Hồng, Áo Mùa 4, Quần HipHop',
    rareItems: 'Ba Lô Cánh Bướm, Ván Sấm Sét',
    description: 'Giá cực êm chỉ 700k cho học sinh sinh viên, leo rank mượt mà, bao đổi thông tin.',
    thumbnail: 'https://pub-49db8d8cc54b4abc84b979c54f4fdd5b.r2.dev/items/2026/09/28/img_6aba99e44336a_1790613988.jpg',
    gallery: [
      'https://pub-49db8d8cc54b4abc84b979c54f4fdd5b.r2.dev/items/2026/09/28/img_6aba99e44336a_1790613988.jpg'
    ],
    status: 'available',
    hidden: false,
    isFeatured: false,
    isVip: false,
    views: 1650,
    createdAt: '2026-09-28T10:45:00Z'
  },
  {
    id: '87886',
    code: '87886',
    title: 'ACC FREE FIRE MS 87886 - FULL SET VIP + SÚNG EVO',
    game: 'freefire',
    categoryId: 'ff-under-2m',
    price: 1700000,
    originalPrice: 2100000,
    level: 68,
    rank: 'Huyền Thoại',
    rankTier: 'legendary',
    tag: 'LH ZALO ĐỂ THUÊ 99 NĂM',
    skins: 195,
    characters: '46 nhân vật',
    pets: '20 Pet',
    gunSkins: 'AK47 Rồng Xanh Lv6, MP40 Mãng Xà Lv5, XM8 Lôi Thần',
    outfits: 'Set Hắc Ám Cổ Tộc, Áo Thỏ Tim, Kính Râm',
    rareItems: 'Nắm Đấm Hỏa Long, Hành Động Ngai Vàng',
    description: 'Acc Free Fire cực chất, liên hệ Zalo 0868994712 để được hỗ trợ giao dịch nhanh.',
    thumbnail: 'https://pub-49db8d8cc54b4abc84b979c54f4fdd5b.r2.dev/items/2026/09/28/img_6aba99c364db0_1790613955.jpg',
    gallery: [
      'https://pub-49db8d8cc54b4abc84b979c54f4fdd5b.r2.dev/items/2026/09/28/img_6aba99c364db0_1790613955.jpg'
    ],
    status: 'available',
    hidden: false,
    isFeatured: false,
    isVip: true,
    views: 2410,
    createdAt: '2026-09-28T10:15:00Z'
  },
  {
    id: '87885',
    code: '87885',
    title: 'ACC FREE FIRE MS 87885 - ACC ĐẸP TRANG PHỤC PHONG PHÚ',
    game: 'freefire',
    categoryId: 'ff-under-2m',
    price: 1000000,
    originalPrice: 1350000,
    level: 63,
    rank: 'Kim Cương III',
    rankTier: 'diamond',
    tag: 'LH ZALO ĐỂ THUÊ 99 NĂM',
    skins: 140,
    characters: '40 nhân vật',
    pets: '16 Pet',
    gunSkins: 'MP40 Mãng Xà Lv4, Scar Titan, M1014 Long Tộc',
    outfits: 'Set Ninja, Áo Khoác Mùa 3, Quần Đi Biển',
    rareItems: 'Ván Lướt Rồng, Ba Lô Đầu Lâu',
    description: 'Acc đẹp giá tốt, thông tin sạch, hỗ trợ giao dịch Zalo 24/7.',
    thumbnail: 'https://pub-49db8d8cc54b4abc84b979c54f4fdd5b.r2.dev/items/2026/09/28/img_6aba99b5277f2_1790613941.jpg',
    gallery: [
      'https://pub-49db8d8cc54b4abc84b979c54f4fdd5b.r2.dev/items/2026/09/28/img_6aba99b5277f2_1790613941.jpg'
    ],
    status: 'available',
    hidden: false,
    isFeatured: false,
    isVip: false,
    views: 1820,
    createdAt: '2026-09-28T09:45:00Z'
  },
  // --- FREE FIRE ACCOUNTS ---
  {
    id: 'FF-88219',
    code: '#FF88219',
    title: 'ACC FF SIÊU CỰC PHẨM - QUỶ DẠ XOA + 4 KHẨU SÚNG LV7',
    game: 'freefire',
    categoryId: 'ff-sieu-pham',
    price: 18500000,
    originalPrice: 22000000,
    level: 82,
    rank: 'Huyền Thoại (68 Sao)',
    rankTier: 'legendary',
    skins: 350,
    characters: 'Full 52 nhân vật',
    pets: 'Full Pet Trợ Thủ',
    gunSkins: 'AK47 Rồng Xanh Max Lv7, MP40 Mãng Xà Max Lv7, M1014 Long Tộc Max Lv7, SCAR Cá Mập Đen Lv7',
    outfits: 'Set Quỷ Dạ Xoa, Áo Mùa 2, Quần Đi Biển, Giày Búp Bê Nữ, Mặt Nạ Cổ Điển',
    rareItems: 'Quỷ Dạ Xoa S1, Điệu Nhảy HipHop S2, Nắm Đấm Hỏa Long, Quán Quân Thế Giới',
    description: 'Tài khoản siêu phẩm Free Fire đỉnh cao, súng max lv7 full hiệu ứng chưởng rồng rực lửa. Đổi mật khẩu Facebook trắng tinh, hỗ trợ sang tên 100%.',
    thumbnail: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?q=80&w=1200&auto=format&fit=crop'
    ],
    status: 'available',
    hidden: false,
    isFeatured: true,
    isVip: true,
    views: 3420,
    createdAt: '2026-09-28T10:00:00Z'
  },
  {
    id: 'FF-74190',
    code: '#FF74190',
    title: 'ACC FF VIP 7M-15M - MP40 MÃNG XÀ LV6 + XM8 LÔI THẦN LV5',
    game: 'freefire',
    categoryId: 'ff-7m-15m',
    price: 8900000,
    originalPrice: 10500000,
    level: 75,
    rank: 'Huyền Thoại (32 Sao)',
    rankTier: 'legendary',
    skins: 220,
    characters: '48 nhân vật xịn',
    pets: '22 Pet',
    gunSkins: 'MP40 Mãng Xà Lv6, XM8 Lôi Thần Lv5, UMP Phong Cách, M1887 Vũ Trụ',
    outfits: 'Set Hắc Ám Cổ Tộc, Quần Búp Bê, Áo Thỏ Tim, Kính Râm',
    rareItems: 'Ba Lô Đầu Lâu Lửa, Hành Động Ngai Vàng',
    description: 'Kho skin cực xịn, đạn ra hiệu ứng cực bắt mắt, chuyên sấy tử chiến headshot cực dễ. Hỗ trợ giao dịch qua Zalo 0868994712 bảo hành vĩnh viễn.',
    thumbnail: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=800&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?q=80&w=1200&auto=format&fit=crop'
    ],
    status: 'available',
    hidden: false,
    isFeatured: true,
    isVip: true,
    views: 2150,
    createdAt: '2026-09-29T11:20:00Z'
  },
  {
    id: 'FF-55102',
    code: '#FF55102',
    title: 'ACC FF TẦM TRUNG 2M-7M - AK RỒNG XANH LV5 + SCAR CÁ MẬP LV4',
    game: 'freefire',
    categoryId: 'ff-2m-7m',
    price: 4500000,
    originalPrice: 5200000,
    level: 68,
    rank: 'Kim Cương IV',
    rankTier: 'diamond',
    skins: 165,
    characters: '44 nhân vật',
    pets: '18 Pet',
    gunSkins: 'AK Rồng Xanh Lv5, SCAR Cá Mập Lv4, MP5 Sấm Sét',
    outfits: 'Set Chiến Binh Samurai, Áo Mùa 4, Quần HipHop',
    rareItems: 'Nắm Đấm Băng Giá, Ván Lướt Vàng',
    description: 'Acc chơi rất mượt mà, thông tin sạch 100%, bảo mật đầy đủ 2 lớp.',
    thumbnail: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?q=80&w=800&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?q=80&w=1200&auto=format&fit=crop'
    ],
    status: 'available',
    hidden: false,
    isFeatured: false,
    isVip: false,
    views: 1840,
    createdAt: '2026-09-30T09:15:00Z'
  },
  {
    id: 'FF-12048',
    code: '#FF12048',
    title: 'ACC FF GIÁ HỌC SINH DƯỚI 2M - AK RỒNG XANH LV4 CỰC BÉN',
    game: 'freefire',
    categoryId: 'ff-under-2m',
    price: 1650000,
    originalPrice: 1950000,
    level: 62,
    rank: 'Bạch Kim I',
    rankTier: 'platinum',
    skins: 98,
    characters: '38 nhân vật',
    pets: '12 Pet',
    gunSkins: 'AK Rồng Xanh Lv4 (hiệu ứng bắn), UMP Nghệ Sĩ',
    outfits: 'Set Thỏ Hồng, Áo Khoác Jean',
    rareItems: 'Ba Lô Cánh Bướm, Ván Lướt Rồng',
    description: 'Phù hợp túi tiền học sinh sinh viên, leo rank Tử Chiến tốt, thông tin trắng.',
    thumbnail: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=800&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1200&auto=format&fit=crop'
    ],
    status: 'available',
    hidden: false,
    isFeatured: false,
    isVip: false,
    views: 1290,
    createdAt: '2026-09-30T14:40:00Z'
  },



  // --- LIÊN QUÂN (DUY NHẤT MỤC NICK LIÊN QUÂN CỰC PHẨM) ---
  {
    id: 'LQ-99999',
    code: '#LQ99999',
    title: 'NICK LIÊN QUÂN CỰC PHẨM #01 - FULL 118 TƯỚNG + 480 SKIN VIP SSS THẦN THOẠI',
    game: 'lienquan',
    categoryId: 'lq-cuc-pham',
    price: 12500000,
    originalPrice: 15000000,
    level: 90,
    rank: 'Thách Đấu 55 Sao',
    rankTier: 'challenger',
    skins: 480,
    characters: '118/118 Full Tướng (100% bảng ngọc 300 cấp)',
    pets: 'N/A',
    gunSkins: 'Raz Muay Thái, Nakroth Bạch Công Tử & Quán Quân, Murad Siêu Việt, Florentino Tinh Hệ',
    outfits: 'Raz Muay Thái, Nakroth Quán Quân, Tel\'Annas Thứ Nguyên Vệ Thần, Lauriel Thứ Nguyên Vệ Thần',
    rareItems: '4 Skin Thứ Nguyên Vệ Thần, 12 Skin Tuyệt Sắc SSS, Khung Thách Đấu Top 1 Toàn Server',
    description: 'Siêu phẩm Liên Quân Độc Bản tại Shop Ty Sei Sei! Tài khoản Đại Gia full tướng, full ngọc, sở hữu toàn bộ skin SSS Thần Thoại hiếm nhất game. Thông tin Garena trắng thông tin 100%, hỗ trợ đổi SĐT & Email bảo hành trọn đời.',
    thumbnail: 'https://shoptyseisei.net/uploads/03-09-2026/4bb14574-5f3d-426a-9da7-11f8215e3b11.jpg',
    gallery: [
      'https://shoptyseisei.net/uploads/03-09-2026/4bb14574-5f3d-426a-9da7-11f8215e3b11.jpg',
      'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1563089145-599997674d42?q=80&w=1200&auto=format&fit=crop'
    ],
    status: 'available',
    hidden: false,
    isFeatured: true,
    isVip: true,
    views: 4520,
    createdAt: '2026-09-28T08:00:00Z'
  },
  {
    id: 'LQ-88888',
    code: '#LQ88888',
    title: 'NICK LIÊN QUÂN CỰC PHẨM #02 - TULEN CHÍ TÔN KIẾM TIÊN + YORN THẾ TỬ',
    game: 'lienquan',
    categoryId: 'lq-cuc-pham',
    price: 7800000,
    originalPrice: 9200000,
    level: 85,
    rank: 'Chiến Tướng 30 Sao',
    rankTier: 'legendary',
    skins: 360,
    characters: '118/118 Full Tướng',
    pets: 'N/A',
    gunSkins: 'Tulen Kiếm Tiên SSS, Yorn Thế Tử Long Cung, Liliana Wave',
    outfits: 'Tulen Chí Tôn Kiếm Tiên, Yorn Thế Tử, Liliana Nguyệt Mị Ly, Allain Hắc Kiếm Sĩ Kirito',
    rareItems: 'Allain Kirito & Butterfly Asuna (Bộ đôi SAO hiếm), Tulen Kiếm Tiên, Bảng Ngọc Chuẩn 300 Cấp',
    description: 'Acc Liên Quân Cực Phẩm chuyên đi rừng và gánh team rank cao. Tài khoản chính chủ lâu năm, thông tin trắng bao back vĩnh viễn.',
    thumbnail: 'https://images.unsplash.com/photo-1563089145-599997674d42?q=80&w=800&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1563089145-599997674d42?q=80&w=1200&auto=format&fit=crop',
      'https://shoptyseisei.net/uploads/03-09-2026/4bb14574-5f3d-426a-9da7-11f8215e3b11.jpg'
    ],
    status: 'available',
    hidden: false,
    isFeatured: true,
    isVip: true,
    views: 3100,
    createdAt: '2026-09-29T14:30:00Z'
  },
  {
    id: 'LQ-77777',
    code: '#LQ77777',
    title: 'NICK LIÊN QUÂN CỰC PHẨM #03 - FLORENTINO SEVEN VÔ ĐỊCH + NAKROTH THỨ NGUYÊN',
    game: 'lienquan',
    categoryId: 'lq-cuc-pham',
    price: 5900000,
    originalPrice: 7000000,
    level: 78,
    rank: 'Cao Thủ 20 Sao',
    rankTier: 'master',
    skins: 290,
    characters: '115 Tướng hot pick',
    pets: 'N/A',
    gunSkins: 'Florentino Tinh Hệ & Ultraman, Nakroth Thứ Nguyên Vệ Thần, Hayate Tử Thần Vũ Trụ',
    outfits: 'Bộ sưu tập skin Flo múa hoa cực dẻo, Nakroth Thứ Nguyên hiệu ứng biến về độc quyền',
    rareItems: 'Nakroth Thứ Nguyên Vệ Thần SSS, Florentino Giám Sát Tinh Hệ, Hayate Chiến Binh Trăng Khuyết',
    description: 'Acc tay to cho anh em múa Flo và Nakroth ảo tung chảo. Cam kết thông tin sạch 100%, bảo hành uy tín số 1.',
    thumbnail: 'https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?q=80&w=800&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?q=80&w=1200&auto=format&fit=crop',
      'https://shoptyseisei.net/uploads/03-09-2026/4bb14574-5f3d-426a-9da7-11f8215e3b11.jpg'
    ],
    status: 'available',
    hidden: false,
    isFeatured: true,
    isVip: true,
    views: 2890,
    createdAt: '2026-09-30T15:10:00Z'
  }
];
