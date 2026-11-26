import fs from 'fs';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    build: {
      rollupOptions: {
        input: {
          main: path.resolve(__dirname, 'index.html'),
          shop: path.resolve(__dirname, 'shop.html'),
          login: path.resolve(__dirname, 'login.html'),
          admin: path.resolve(__dirname, 'admin.html'),
          payment: path.resolve(__dirname, 'payment.html'),
        },
      },
    },
    plugins: [
      {
        name: 'copy-static-assets',
        apply: 'build',
        closeBundle(error) {
          if (error) return;
          const distDir = path.resolve(__dirname, 'dist');
          if (!fs.existsSync(distDir)) return;

          const srcDb = path.resolve(__dirname, 'database');
          const distDb = path.resolve(distDir, 'database');
          if (fs.existsSync(srcDb)) {
            fs.cpSync(srcDb, distDb, {recursive: true, force: true});
          }

          for (const jsFile of ['home.js', 'shop.js', 'login.js', 'admin.js', 'payment.js']) {
            const src = path.resolve(__dirname, jsFile);
            const dest = path.resolve(distDir, jsFile);
            if (fs.existsSync(src)) {
              fs.copyFileSync(src, dest);
            }
          }
        },
      },
    ],
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
