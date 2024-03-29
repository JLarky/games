import { defineConfig } from "astro/config";
import checker from "vite-plugin-checker";

import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
  integrations: [react()],
  vite: {
    build: { sourcemap: true },
    plugins: [checker({ typescript: true })],
  },
});
