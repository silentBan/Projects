import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// In dev, proxy /api to the Express server so the frontend can use relative URLs.
// In production, set VITE_API_URL instead (see src/api.ts).
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: true,
    proxy: {
      "/api": "http://localhost:4000",
    },
  },
});