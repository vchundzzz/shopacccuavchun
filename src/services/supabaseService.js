import { createClient } from '@supabase/supabase-js';
import { supabaseClient } from './supabaseClient';

export const supabaseService = {
  // Test connection
  async testConnection(url, anonKey) {
    if (!url || !anonKey) {
      return { success: false, message: 'Vui lòng nhập đầy đủ Supabase Project URL và Anon Key!' };
    }
    try {
      const client = createClient(url.trim(), anonKey.trim());
      const startTime = Date.now();
      const { data, error } = await client.from('categories').select('id').limit(1);
      const latency = Date.now() - startTime;

      if (error) {
        // If table doesn't exist yet, it's still a valid connection to Supabase!
        if (error.code === '42P01') {
          return {
            success: true,
            latency,
            message: `Kết nối thành công tới Supabase! (Lưu ý: Chưa chạy file supabase_schema.sql để tạo bảng)`
          };
        }
        return { success: false, message: `Lỗi kết nối Supabase: ${error.message}` };
      }

      return {
        success: true,
        latency,
        message: `Kết nối thành công tới Supabase PostgreSQL Database! (Tốc độ: ${latency}ms)`
      };
    } catch (err) {
      return { success: false, message: `Lỗi kết nối mạng tới Supabase: ${err.message}` };
    }
  },

  // Fetch all shop data from Supabase
  async fetchShopData(shopConfig) {
    const client = supabaseClient.getClient(shopConfig);
    if (!client) return null;

    try {
      const [configRes, catRes, accRes, bannerRes] = await Promise.all([
        client.from('shop_config').select('*').limit(1),
        client.from('categories').select('*').order('order', { ascending: true }),
        client.from('accounts').select('*').order('created_at', { ascending: false }),
        client.from('banners').select('*').order('order', { ascending: true })
      ]);

      const result = {};

      // 1. Shop Config
      if (configRes.data && configRes.data.length > 0) {
        const row = configRes.data[0];
        result.shopConfig = {
          shopName: row.shop_name || 'VANCHUNG.CLICK',
          siteTitle: row.banner_title || row.site_title || 'SHOWROOM CHO THUÊ ACC GAME',
          tagline: row.banner_subtitle || row.tagline || 'SHOWROOM CHO THUÊ ACC GAME UY TÍN HÀNG ĐẦU',
          blackLogo: row.logo_url || row.black_logo || '/images/logo-shopvanchung.png',
          whiteLogo: row.logo_url || row.white_logo || '/images/logo-shopvanchung.png',
          avatar: row.logo_url || row.avatar || '/images/logo-shopvanchung.png',
          hotline: row.hotline || '0362481351',
          zaloFF: row.zalo_url || row.zalo_ff || '0362481351',
          zaloFCM: row.zalo_url || row.zalo_fcm || '0362481351',
          zaloLQ: row.zalo_url || row.zalo_lq || '0362481351',
          facebookLink: row.facebook_url || row.facebook_link || 'https://www.facebook.com/profile.php?id=100078023670452',
          workingHours: row.working_hours || '24/7',
          mainBanner: row.main_banner || '',
          notification: row.notification_text || '',
          atmBankName: row.atm_bank_name || '',
          atmAccountNumber: row.atm_account_number || '',
          atmAccountName: row.atm_account_name || '',
          supportCards: row.support_cards,
          gameHeaders: row.game_headers,
          popupAnnouncement: row.popup_announcement,
          categoryNotice: row.category_notice,
          depositBanners: row.deposit_banners
        };
      }

      // 2. Categories
      if (Array.isArray(catRes.data) && catRes.data.length > 0) {
        result.categories = catRes.data.map(c => ({
          id: c.id,
          game: c.slug || c.game || c.id,
          name: c.name,
          tag: c.tag || c.slug || c.id,
          image: c.image,
          minPrice: Number(c.min_price) || 0,
          maxPrice: Number(c.max_price) || 0,
          order: c.display_order ?? c.order ?? 0
        }));
      }

      // 3. Accounts
      if (Array.isArray(accRes.data) && accRes.data.length > 0) {
        result.accounts = accRes.data.map(a => ({
          id: a.id,
          code: a.code || a.id,
          title: a.title,
          game: a.game || a.category_id,
          categoryId: a.category_id,
          price: Number(a.price) || 0,
          originalPrice: Number(a.original_price) || Number(a.price) || 0,
          level: a.level || 1,
          rank: a.rank || (Array.isArray(a.highlights) ? a.highlights[0] : ''),
          skins: a.skins || 0,
          characters: a.characters,
          pets: a.pets,
          gunSkins: a.gun_skins,
          outfits: a.outfits,
          rareItems: a.rare_items,
          description: a.description,
          thumbnail: a.thumb || a.thumbnail,
          gallery: Array.isArray(a.images) && a.images.length > 0 ? a.images : (Array.isArray(a.gallery) ? a.gallery : [a.thumb || a.thumbnail]),
          status: a.status || 'available',
          hidden: Boolean(a.hidden),
          isVip: Boolean(a.is_vip),
          isFeatured: Boolean(a.is_featured),
          views: a.views || 0,
          createdAt: a.created_at
        }));
      }

      // 4. Banners
      if (Array.isArray(bannerRes.data) && bannerRes.data.length > 0) {
        result.banners = bannerRes.data.map(b => ({
          id: b.id,
          image: b.image,
          title: b.title,
          link: b.link,
          active: b.active !== false,
          order: b.display_order ?? b.order ?? 0
        }));
      }

      return Object.keys(result).length > 0 ? result : null;
    } catch (err) {
      console.warn('Lỗi khi tải dữ liệu từ Supabase:', err);
      return null;
    }
  },

  // Save all shop data to Supabase (upsert)
  async saveAllData(payload, shopConfig) {
    const client = supabaseClient.getClient(shopConfig);
    if (!client) return { success: false, message: 'Chưa cấu hình Supabase Client' };

    try {
      const promises = [];

      // 1. Upsert shopConfig
      if (payload.shopConfig) {
        const sc = payload.shopConfig;
        promises.push(
          client.from('shop_config').upsert({
            id: 'main',
            shop_name: sc.shopName || 'VANCHUNG.CLICK',
            logo_url: sc.avatar || sc.blackLogo || sc.logo_url || '/images/logo-shopvanchung.png',
            banner_title: sc.siteTitle || sc.banner_title || '',
            banner_subtitle: sc.tagline || sc.banner_subtitle || '',
            hotline: sc.hotline || '',
            zalo_url: sc.zaloFF || sc.zalo_url || '',
            facebook_url: sc.facebookLink || sc.facebook_url || '',
            notification_text: sc.notification || sc.notification_text || '',
            atm_bank_name: sc.atmBankName || sc.atm_bank_name || '',
            atm_account_number: sc.atmAccountNumber || sc.atm_account_number || '',
            atm_account_name: sc.atmAccountName || sc.atm_account_name || '',
            updated_at: new Date().toISOString()
          })
        );
      }

      // 2. Upsert categories
      if (Array.isArray(payload.categories)) {
        const catRows = payload.categories.map((c, i) => ({
          id: String(c.id),
          name: c.name || '',
          slug: c.game || c.tag || c.slug || c.id,
          image: c.image || '',
          description: c.description || c.name || '',
          display_order: c.order ?? c.display_order ?? i
        }));
        promises.push(client.from('categories').upsert(catRows));
      }

      // 3. Upsert accounts
      if (Array.isArray(payload.accounts)) {
        const accRows = payload.accounts.map(a => ({
          id: String(a.id || a.code),
          category_id: String(a.categoryId || a.category_id || ''),
          title: a.title || '',
          price: Number(a.price) || 0,
          original_price: Number(a.originalPrice) || Number(a.price) || 0,
          thumb: a.thumbnail || a.thumb || (Array.isArray(a.gallery) ? a.gallery[0] : (Array.isArray(a.images) ? a.images[0] : '')) || '',
          images: Array.isArray(a.gallery) && a.gallery.length > 0 ? a.gallery : (Array.isArray(a.images) ? a.images : []),
          highlights: Array.isArray(a.highlights) ? a.highlights : [a.rank, a.skins ? `${a.skins} Trang phục` : ''].filter(Boolean),
          description: a.description || '',
          status: a.status || 'available',
          username: a.username || null,
          password: a.password || null
        }));
        promises.push(client.from('accounts').upsert(accRows));
      }

      // 4. Upsert banners
      if (Array.isArray(payload.banners)) {
        const bannerRows = payload.banners.map((b, i) => ({
          id: String(b.id || `banner_${i}`),
          title: b.title || '',
          image: b.image || '',
          link: b.link || '',
          display_order: b.order ?? b.display_order ?? i
        }));
        promises.push(client.from('banners').upsert(bannerRows));
      }

      const results = await Promise.all(promises);
      const errors = results.filter(r => r.error).map(r => r.error.message);

      if (errors.length > 0) {
        return { success: false, message: `Lỗi đồng bộ Supabase: ${errors.join(', ')}` };
      }

      return { success: true, message: 'Đã lưu và đồng bộ toàn bộ dữ liệu lên Supabase thành công!' };
    } catch (err) {
      return { success: false, message: `Lỗi đồng bộ Supabase: ${err.message}` };
    }
  },

  // Delete an account from Supabase
  async deleteAccount(id, shopConfig) {
    const client = supabaseClient.getClient(shopConfig);
    if (!client) return;
    try {
      await client.from('accounts').delete().or(`id.eq.${id},code.eq.${id}`);
    } catch (e) {
      console.warn('Lỗi xóa acc trên Supabase:', e);
    }
  }
};
