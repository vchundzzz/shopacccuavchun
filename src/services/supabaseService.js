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
          shopName: row.shop_name,
          siteTitle: row.site_title,
          tagline: row.tagline,
          blackLogo: row.black_logo,
          whiteLogo: row.white_logo,
          avatar: row.avatar,
          hotline: row.hotline,
          zaloFF: row.zalo_ff,
          zaloFCM: row.zalo_fcm,
          zaloLQ: row.zalo_lq,
          facebookLink: row.facebook_link,
          workingHours: row.working_hours,
          mainBanner: row.main_banner,
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
          game: c.game,
          name: c.name,
          tag: c.tag,
          image: c.image,
          minPrice: Number(c.min_price) || 0,
          maxPrice: Number(c.max_price) || 0,
          order: c.order || 0
        }));
      }

      // 3. Accounts
      if (Array.isArray(accRes.data) && accRes.data.length > 0) {
        result.accounts = accRes.data.map(a => ({
          id: a.id,
          code: a.code,
          title: a.title,
          game: a.game,
          categoryId: a.category_id,
          price: Number(a.price) || 0,
          originalPrice: Number(a.original_price) || 0,
          level: a.level || 1,
          rank: a.rank,
          skins: a.skins || 0,
          characters: a.characters,
          pets: a.pets,
          gunSkins: a.gun_skins,
          outfits: a.outfits,
          rareItems: a.rare_items,
          description: a.description,
          thumbnail: a.thumbnail,
          gallery: Array.isArray(a.gallery) ? a.gallery : [a.thumbnail],
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
          active: Boolean(b.active),
          order: b.order || 0
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
            id: 'default',
            shop_name: sc.shopName,
            site_title: sc.siteTitle,
            tagline: sc.tagline,
            black_logo: sc.blackLogo,
            white_logo: sc.whiteLogo,
            avatar: sc.avatar,
            hotline: sc.hotline,
            zalo_ff: sc.zaloFF,
            zalo_fcm: sc.zaloFCM,
            zalo_lq: sc.zaloLQ,
            facebook_link: sc.facebookLink,
            working_hours: sc.workingHours,
            main_banner: sc.mainBanner,
            support_cards: sc.supportCards,
            game_headers: sc.gameHeaders,
            popup_announcement: sc.popupAnnouncement,
            category_notice: sc.categoryNotice,
            deposit_banners: sc.depositBanners,
            updated_at: new Date().toISOString()
          })
        );
      }

      // 2. Upsert categories
      if (Array.isArray(payload.categories)) {
        const catRows = payload.categories.map(c => ({
          id: c.id,
          game: c.game,
          name: c.name,
          tag: c.tag,
          image: c.image,
          min_price: c.minPrice || 0,
          max_price: c.maxPrice || 0,
          order: c.order || 0
        }));
        promises.push(client.from('categories').upsert(catRows));
      }

      // 3. Upsert accounts
      if (Array.isArray(payload.accounts)) {
        const accRows = payload.accounts.map(a => ({
          id: a.id || a.code,
          code: a.code || a.id,
          title: a.title,
          game: a.game,
          category_id: a.categoryId,
          price: a.price || 0,
          original_price: a.originalPrice || a.price || 0,
          level: a.level || 1,
          rank: a.rank,
          skins: a.skins || 0,
          characters: a.characters,
          pets: a.pets,
          gun_skins: a.gunSkins,
          outfits: a.outfits,
          rare_items: a.rareItems,
          description: a.description,
          thumbnail: a.thumbnail,
          gallery: a.gallery,
          status: a.status || 'available',
          hidden: Boolean(a.hidden),
          is_vip: Boolean(a.isVip),
          is_featured: Boolean(a.isFeatured),
          views: a.views || 0
        }));
        promises.push(client.from('accounts').upsert(accRows));
      }

      // 4. Upsert banners
      if (Array.isArray(payload.banners)) {
        const bannerRows = payload.banners.map(b => ({
          id: b.id,
          image: b.image,
          title: b.title,
          link: b.link,
          active: Boolean(b.active),
          order: b.order || 0
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
