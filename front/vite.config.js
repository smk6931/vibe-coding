import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';
import { promises as fs } from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Dev-only middleware:
 *   POST /__dev/save-operator  body: operator JSON       → public/data/site.json 의 operator 섹션 덮어쓰기
 *   POST /__dev/save-events    body: events 배열 전체    → public/data/events.json 통째로 덮어쓰기
 * 운영(빌드)에는 포함되지 않음 (apply: 'serve').
 */
function devSiteDataPlugin() {
  async function writeJsonMirrors(fileName, data) {
    const text = JSON.stringify(data, null, 2) + '\n';
    await Promise.all([
      fs.writeFile(path.resolve(__dirname, `public/data/${fileName}`), text, 'utf-8'),
      fs.writeFile(path.resolve(__dirname, `src/data/${fileName}`), text, 'utf-8'),
    ]);
  }

  async function readJson(req) {
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    return JSON.parse(Buffer.concat(chunks).toString('utf-8'));
  }
  function ok(res, payload = { ok: true }) {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(payload));
  }
  function fail(res, e) {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: String(e) }));
  }

  return {
    name: 'dev-site-data',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use('/__dev/save-operator', async (req, res, next) => {
        if (req.method !== 'POST') return next();
        try {
          const operator = await readJson(req);
          const filePath = path.resolve(__dirname, 'public/data/site.json');
          const raw = await fs.readFile(filePath, 'utf-8');
          const data = JSON.parse(raw);
          data.operator = operator;
          await writeJsonMirrors('site.json', data);
          ok(res);
        } catch (e) { fail(res, e); }
      });

      server.middlewares.use('/__dev/save-events', async (req, res, next) => {
        if (req.method !== 'POST') return next();
        try {
          const events = await readJson(req);
          if (!Array.isArray(events)) throw new Error('events must be an array');
          await writeJsonMirrors('events.json', events);
          ok(res, { ok: true, count: events.length });
        } catch (e) { fail(res, e); }
      });
    },
  };
}

export default defineConfig({
  envDir: path.resolve(__dirname, '..'),
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
        target: 'http://localhost:8200',
        changeOrigin: true,
      },
    },
  },
});
