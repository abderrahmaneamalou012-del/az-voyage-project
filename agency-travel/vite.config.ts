import "dotenv/config";
import { defineConfig, Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { createServer } from "./server";


export default defineConfig(({ mode }) => ({
  server: {
    host: "127.0.0.1",
    port: 8080,
    fs: {
      allow: [".","./client", "./shared"],
      deny: [".env", ".env.*", "*.{crt,pem}", "**/.git/**", "server/**"],
    },
    proxy: {
      
      "/cms-api": {
        // Default CMS dev port is 3001; override via VITE_CMS_URL / local .env when using another port
        target: process.env.VITE_CMS_URL?.replace(/\/$/, "") || "http://localhost:3001",
        changeOrigin: true,
        rewrite: (path: string) => path.replace(/^\/cms-api/, "/api"),
      },
    },
  },
  build: {
    outDir: "dist/spa",
  },
  plugins: [react(), expressPlugin()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./client"),
      "@shared": path.resolve(__dirname, "./shared"),
    },
  },
}));

function expressPlugin(): Plugin {
  return {
    name: "express-plugin",
    apply: "serve", 
    configureServer(server) {
      const app = createServer();

      
      server.middlewares.use(app);
    },
  };
}
