import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      "/api": {
        target: "http://dnd-core-svc.default:8080",
        rewrite: (path) => path.replace(/^\/api/, "")
      }
    }
  }
})
