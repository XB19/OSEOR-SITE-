import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // BACKEND_URL (fichier .env.local) : adresse du backend Spring Boot à relayer
  const env = loadEnv(mode, process.cwd(), '');
  const backend = env.BACKEND_URL || 'http://localhost:8080';

  return {
    plugins: [react()],
    server: {
      port: 5173,
      open: true,
      // Les appels /api sont relayés vers le backend : pas de souci de CORS en local
      proxy: {
        '/api': { target: backend, changeOrigin: true },
        // Fichiers envoyés depuis le tableau de bord
        '/uploads': { target: backend, changeOrigin: true },
      },
    },
  };
});
