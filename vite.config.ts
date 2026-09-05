import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode`
  const env = loadEnv(mode, process.cwd(), "");

  return {
    server: {
      host: "::",
      port: 8080,
    },
    plugins: [react()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    build: {
      outDir: "dist",
      // Enable source maps for debugging (disable in production if needed)
      sourcemap: mode === "development",
      // Minification settings
      minify: "esbuild",
      // Target modern browsers for smaller bundles
      target: "esnext",
      // Chunk splitting for better caching
      rollupOptions: {
        output: {
          manualChunks: {
            // Vendor chunks - split large dependencies
            "vendor-react": ["react", "react-dom", "react-router-dom"],
            "vendor-ui": [
              "@radix-ui/react-dialog",
              "@radix-ui/react-dropdown-menu",
              "@radix-ui/react-popover",
              "@radix-ui/react-select",
              "@radix-ui/react-tabs",
              "@radix-ui/react-tooltip",
            ],
            "vendor-utils": ["date-fns", "clsx", "tailwind-merge", "zod"],
            "vendor-query": ["@tanstack/react-query"],
            "vendor-charts": ["recharts"],
          },
          // Cleaner chunk names
          chunkFileNames: "assets/js/[name]-[hash].js",
          entryFileNames: "assets/js/[name]-[hash].js",
          assetFileNames: "assets/[ext]/[name]-[hash].[ext]",
        },
      },
      // Increase chunk size warning limit
      chunkSizeWarningLimit: 1000,
    },
    // Optimize dependencies
    optimizeDeps: {
      include: [
        "react",
        "react-dom",
        "react-router-dom",
        "@tanstack/react-query",
      ],
    },
    // Environment variable prefix
    envPrefix: "VITE_",
    // Preview server settings (for `npm run preview`)
    preview: {
      port: 4173,
      host: true,
    },
  };
});
