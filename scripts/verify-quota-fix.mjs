/**
 * Kiem thu nguyen nhan goc: localStorage vuot qua 5MB lam them/sua/xoa
 * "thanh cong" tren UI nhung mat sach sau khi F5.
 *
 * Chay: node scripts/verify-quota-fix.mjs
 */
import { register } from 'node:module';
import { pathToFileURL } from 'node:url';

// Cho phep import khong can duoi .js / .json (giong cach Vite xu ly trong du an)
register(
  'data:text/javascript,' + encodeURIComponent(`
    import { existsSync, readFileSync } from 'node:fs';
    import { fileURLToPath } from 'node:url';
    export async function resolve(specifier, context, next) {
      if (specifier.startsWith('.') && !specifier.endsWith('.js') && !specifier.endsWith('.json')) {
        const base = new URL(specifier, context.parentURL);
        for (const ext of ['.js', '/index.js']) {
          const cand = new URL(base.href + ext);
          if (existsSync(fileURLToPath(cand))) return next(cand.href, context);
        }
      }
      return next(specifier, context);
    }
    export async function load(url, context, next) {
      if (url.endsWith('.json')) {
        const json = readFileSync(fileURLToPath(url), 'utf-8');
        return { format: 'module', shortCircuit: true, source: 'export default ' + json };
      }
      return next(url, context);
    }
  `),
  pathToFileURL('./')
);

// ---- Mo phong localStorage voi quota that (5MB, tinh theo UTF-16) ----
const LIMIT = 5 * 1024 * 1024;
const store = new Map();
const usedMB = () => {
  let t = 0;
  for (const [k, v] of store) t += (k.length + v.length) * 2;
  return t / 1048576;
};

globalThis.localStorage = {
  get length() { return store.size; },
  key: (i) => [...store.keys()][i] ?? null,
  getItem: (k) => (store.has(k) ? store.get(k) : null),
  setItem(k, v) {
    const bytes = (k.length + String(v).length) * 2;
    let total = 0;
    for (const [key, val] of store) total += (key.length + val.length) * 2;
    if (total + bytes > LIMIT) {
      const err = new Error('quota');
      err.name = 'QuotaExceededError';
      throw err; // giong het trinh duyet
    }
    store.set(k, String(v));
  },
  removeItem: (k) => store.delete(k),
  clear: () => store.clear()
};

// ---- Canvas gia lap: nen base64 JPEG xuong ~30KB ----
const fakeCanvas = {
  width: 0, height: 0,
  getContext: () => ({
    drawImage() {}, fillRect() {},
    getImageData: (x, y, w, h) => ({ data: new Uint8ClampedArray(w * h * 4).fill(255) })
  }),
  toDataURL: () => 'data:image/jpeg;base64,' + 'A'.repeat(15 * 1024)
};
globalThis.document = { createElement: () => fakeCanvas };
globalThis.Image = class {
  set src(v) { this.width = 1600; this.height = 1200; setTimeout(() => this.onload?.(), 0); }
};
globalThis.window = { location: { hash: '' } };
globalThis.fetch = async () => ({
  ok: false, status: 404,
  json: async () => ({}),
  text: async () => 'not found'
});

const { storage } = await import('../src/services/storage.js');
const { cloudDatabase } = await import('../src/services/cloudDatabase.js');

const pass = [], fail = [];
const check = (name, ok) => (ok ? pass : fail).push(name);
const heavy = (kb) => 'data:image/jpeg;base64,' + 'B'.repeat(kb * 1024);
const line = () => console.log('='.repeat(64));

const ACC_KEY = 'shoptyseisei_accounts_v2';
const accounts = Array.from({ length: 14 }, (_, i) => ({
  id: `ff-${i}`, code: `#FF${i}`, title: `Acc ${i}`, price: 100000,
  gallery: [heavy(160), heavy(160)], thumbnail: heavy(210)
}));
// Bat chuoc code CU: try/catch nuot loi, khong persist
const oldSave = (list) => {
  try {
    localStorage.setItem(ACC_KEY, JSON.stringify(list));
    return { saved: true };
  } catch (e) {
    return { saved: false, error: e.name }; // <-- im lang nuot loi
  }
};

line();
console.log('KY ICH BAN 1 - Mo phong code CU (nuot loi quota)');
line();

// Nap day bo nho giong db.json that
localStorage.setItem('shoptyseisei_config_v2', JSON.stringify({
  mainBanner: heavy(582),
  supportCards: [heavy(143), heavy(159), heavy(162), heavy(161)]
}));
console.log(`Dung luong: ${usedMB().toFixed(2)}MB / 5MB`);

const delResult = oldSave(accounts.filter((_, i) => i !== 6));
console.log(`Xoa acc thu 7 -> ${delResult.saved ? 'da luu' : 'THAT BAI (' + delResult.error + ')'}`);
check('Code CU: xoa acc that bai ngam (khong bao loi)', delResult.saved === false);

const rawAfter = localStorage.getItem(ACC_KEY);
const afterReload = rawAfter ? JSON.parse(rawAfter) : [];
check('Code CU: du lieu khong duoc ghi, F5 lai mat trang', afterReload.length !== accounts.length - 1);

line();
console.log('KY ICH BAN 2 - Code MOI (tu nen khi vuot quota)');
line();

// Cloud bị mock nên không thành công -> chỉ kiểm tra việc GHI LOCAL đã thành công
const res = await storage.saveAccounts(accounts);
const storedNow = localStorage.getItem(ACC_KEY);
console.log(`Ket qua saveAccounts: success=${res.success} quotaExceeded=${!!res.quotaExceeded}`);
console.log(`(success=false o day la do cloud bi mock, khong phai loi luu cuc bo)`);
check('Code MOI: KHONG con bao loi quota', !res.quotaExceeded);
check('Code MOI: du lieu da duoc ghi that su vao localStorage', !!storedNow);

console.log(`Dung luong sau khi nen: ${usedMB().toFixed(2)}MB / 5MB (${Math.round(usedMB() / 5 * 100)}%)`);
check('Code MOI: dung luong da loi vao gioi han', usedMB() <= 5);

line();
console.log('KY ICH BAN 3 - Xoa acc co giu duoc sau khi tai lai trang?');
line();

const target = accounts[6];
const remaining = storage.getAccounts().filter((a) => a.id !== target.id && a.code !== target.code);
await storage.saveAccounts(remaining);

const reloaded = JSON.parse(localStorage.getItem(ACC_KEY));
const stillExists = reloaded.some((a) => a.id === target.id);
console.log(`So acc con lai sau khi xoa & tai lai: ${reloaded.length}/${accounts.length}`);
check('Code MOI: acc da xoa KHONG quay lai sau khi tai lai trang', !stillExists);
check('Code MOI: dung so luong acc con lai', reloaded.length === remaining.length);

line();
console.log('KY ICH BAN 4 - Cloud cu co ghi de mat ban sua moi khong?');
line();

const localBefore = reloaded.length;
cloudDatabase.getCloudUrl = () => 'https://example.firebaseio.com';
cloudDatabase.fetchShopData = async () => ({
  accounts: Array.from({ length: 20 }, (_, i) => ({ id: `old-${i}`, code: `#OLD${i}`, game: 'freefire', price: 1 })),
  shopConfig: {}, banners: [], categories: [],
  updatedAt: new Date(Date.now() - 86400000).toISOString() // 1 ngay truoc = cu hon
});

const cloudResult = await storage.fetchFromCloud();
const localAfter = JSON.parse(localStorage.getItem(ACC_KEY)).length;
console.log(`fetchFromCloud tra ve: ${cloudResult === null ? 'null (giu ban cuc bo)' : 'du lieu cloud'}`);
console.log(`So acc cuc bo: ${localBefore} -> ${localAfter}`);
check('Code MOI: tu choi du lieu cloud cu hon', cloudResult === null);
check('Code MOI: du lieu cuc bo khong bi ghi de', localBefore === localAfter);

line();
console.log(`KET QUA: ${pass.length} dat / ${fail.length} loi`);
line();
pass.forEach((p) => console.log('  [PASS] ' + p));
fail.forEach((f) => console.log('  [FAIL] ' + f));
process.exit(fail.length ? 1 : 0);