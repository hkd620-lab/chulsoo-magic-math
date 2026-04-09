import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import mkcert from 'vite-plugin-mkcert';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    mkcert()
  ],
  server: {
    port: 5173,
    strictPort: true,
    cors: true,       // 도메인 불일치(CORS) 에러 완화
    origin: 'https://localhost:5173', // Unsafe attempt 에러 방지용 리소스 출처 명시
  }
});
