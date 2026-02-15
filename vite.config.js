import { defineConfig } from 'vite';

export default defineConfig({
  // IMPORTANT: This must match your GitHub repository name exactly!
  // If your repo is named 'neural-ar', this should be '/neural-ar/'
  base: '/neural-ar/', 
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    // Ensure large video files are handled correctly
    rollupOptions: {
      output: {
        manualChunks: undefined
      }
    }
  }
});