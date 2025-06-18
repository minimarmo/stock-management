import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
  base: "/stock-management/",
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.svg", "robots.txt", "apple-touch-icon.png"],
      manifest: {
        name: "Stock Management",
        short_name: "Stock App",
        start_url: "/stock-management/",
        display: "standalone",
        background_color: "#ffffff",
        theme_color: "#7649DF", // สี app bar
        icons: [
          {
            src: "stock.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "stock.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
    }),
  ],
});
