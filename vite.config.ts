import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vitejs.dev/config/
export default defineConfig({
  root: './', // index.html이 위치한 프로젝트 최상단 디렉토리 명시
  base: './', // 절대 경로 기준점 보장
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    port: 5173,
    strictPort: true,
    cors: true, // IDE 프리뷰(Iframe) CORS 허용
  }
});
