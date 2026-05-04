import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';
import { promises as fs } from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Dev-only middleware:
 *   POST /__dev/save-operator  body: operator JSON  → public/data/site.json 의 operator 섹션 덮어쓰기.
 * 운영(빌드)에는 포함되지 않음 (apply: 'serve').
 */
function devSiteDataPlugin() {
  return {
    name: 'dev-site-data',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use('/__dev/save-operator', async (req, res, next) => {
        if (req.method !== 'POST') return next();
        try {
          const chunks = [];
          for await (const chunk of req) chunks.push(chunk);
          const body = Buffer.concat(chunks).toString('utf-8');
          const operator = JSON.parse(body);

          const filePath = path.resolve(__dirname, 'public/data/site.json');
          const raw = await fs.readFile(filePath, 'utf-8');
          const data = JSON.parse(raw);
          data.operator = operator;
          await fs.writeFile(filePath, JSON.stringify(data, null, 2) + '\n', 'utf-8');

          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ ok: true }));
        } catch (e) {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: String(e) }));
        }
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), devSiteDataPlugin()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3200,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
    },
  },
});
