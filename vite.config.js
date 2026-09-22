import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// The makeMyPass affiliates leaderboard API does not send CORS headers, so the
// browser cannot fetch it directly. Reverse-proxy it in dev/preview instead.
const leaderboardProxy = {
  "/api": {
    target: "https://affiliates.makemypass.com",
    changeOrigin: true,
    secure: true,
  },
};

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: leaderboardProxy,
  },
  preview: {
    proxy: leaderboardProxy,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/react-dom') || id.includes('node_modules/react/')) {
            return 'vendor';
          }
          if (id.includes('node_modules/motion') || id.includes('node_modules/framer-motion')) {
            return 'motion';
          }
          if (id.includes('node_modules/lenis')) {
            return 'lenis';
          }
        }
      }
    }
  }
});
