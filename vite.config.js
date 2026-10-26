import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// For GitHub Pages set base to '/portfolio/'. For Vercel keep '/'.
export default defineConfig({
  plugins: [react()],
  base: process.env.VITE_BASE || '/',
});
