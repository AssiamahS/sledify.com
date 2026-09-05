import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
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
    // Performance: Enable source maps for debugging
    sourcemap: false,
    // Performance: Minify with esbuild (faster than terser)
    minify: 'esbuild',
    // Performance: Target modern browsers
    target: 'es2020',
    // Code splitting configuration
    rollupOptions: {
      output: {
        // Manual chunks for better caching
        manualChunks: {
          // Vendor chunks - these change rarely
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-ui': [
            '@radix-ui/react-slider',
            '@radix-ui/react-dialog',
            '@radix-ui/react-tooltip',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-tabs',
            '@radix-ui/react-toast',
            '@radix-ui/react-toggle',
            '@radix-ui/react-toggle-group',
          ],
          // Audio libraries - heavy but essential for studio
          'vendor-audio': ['tone', 'wavesurfer.js'],
          // Utility libraries
          'vendor-utils': ['clsx', 'tailwind-merge', 'class-variance-authority', 'date-fns'],
          // Charts (if used)
          'vendor-charts': ['recharts'],
        },
        // Optimize chunk file names
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
      },
    },
    // Increase chunk size warning limit (optional, we're optimizing anyway)
    chunkSizeWarningLimit: 300,
  },
  // Performance: Optimize dependency pre-bundling
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'tone', 'wavesurfer.js'],
    // Exclude heavy deps from pre-bundling if they cause issues
    exclude: [],
  },
});
