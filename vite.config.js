import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import fs from 'fs';
import path from 'path';

function autoSaveShopDataPlugin() {
  return {
    name: 'auto-save-shop-data-plugin',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url === '/api/save-shop-data' && req.method === 'POST') {
          let body = '';
          req.on('data', chunk => {
            body += chunk;
          });
          req.on('end', () => {
            try {
              const rootDir = import.meta.dirname || process.cwd();
              const data = JSON.parse(body);
              const dbFilePath = path.resolve(rootDir, 'src/data/db.json');
              fs.writeFileSync(dbFilePath, JSON.stringify(data, null, 2), 'utf-8');

              // If shopConfig is provided, also sync default seedData to avoid losing changes
              if (data.shopConfig) {
                try {
                  const seedPath = path.resolve(rootDir, 'src/data/seedData.js');
                  if (fs.existsSync(seedPath)) {
                    let seedContent = fs.readFileSync(seedPath, 'utf-8');
                    const { shopName, hotline, zaloFF, zaloLQ, zaloFCM } = data.shopConfig;
                    if (zaloFF) {
                      seedContent = seedContent.replace(/zaloFF:\s*'[^']*'/, `zaloFF: '${zaloFF}'`);
                      seedContent = seedContent.replace(/ffZalo:\s*'[^']*'/, `ffZalo: '${zaloFF}'`);
                    }
                    if (zaloLQ) {
                      seedContent = seedContent.replace(/zaloLQ:\s*'[^']*'/, `zaloLQ: '${zaloLQ}'`);
                      seedContent = seedContent.replace(/lqZalo:\s*'[^']*'/, `lqZalo: '${zaloLQ}'`);
                    }
                    if (hotline) {
                      seedContent = seedContent.replace(/hotline:\s*'[^']*'/, `hotline: '${hotline}'`);
                    }
                    if (shopName) {
                      seedContent = seedContent.replace(/shopName:\s*'[^']*'/, `shopName: '${shopName}'`);
                    }
                    fs.writeFileSync(seedPath, seedContent, 'utf-8');
                  }
                } catch (e) {
                  console.warn('Could not sync to seedData.js:', e.message);
                }
              }

              res.setHeader('Content-Type', 'application/json');
              res.statusCode = 200;
              res.end(JSON.stringify({ success: true, message: 'Dữ liệu đã được lưu vĩnh viễn vào file mã nguồn!' }));
            } catch (err) {
              console.error('Error saving data to disk:', err);
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: false, error: err.message }));
            }
          });
          return;
        }

        if (req.url === '/api/get-shop-data' && req.method === 'GET') {
          const rootDir = import.meta.dirname || process.cwd();
          const dbFilePath = path.resolve(rootDir, 'src/data/db.json');
          if (fs.existsSync(dbFilePath)) {
            const content = fs.readFileSync(dbFilePath, 'utf-8');
            res.setHeader('Content-Type', 'application/json');
            res.statusCode = 200;
            res.end(content);
            return;
          } else {
            res.statusCode = 404;
            res.end(JSON.stringify({ error: 'db.json not found' }));
            return;
          }
        }

        next();
      });
    }
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), autoSaveShopDataPlugin()],
  server: {
    host: true,
    watch: {
      ignored: ['**/src/data/db.json']
    }
  }
});
