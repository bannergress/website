import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import svgr from 'vite-plugin-svgr'
import basicSsl from '@vitejs/plugin-basic-ssl'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), svgr(), basicSsl()],
  server: {
    host: true,
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: (content, filename) =>
          filename.endsWith('/base/_mixins.scss')
            ? `@use "/src/assets/stylesheets/base/_variables.scss";\n${content}`
            : `@use "/src/assets/stylesheets/base/_variables.scss";\n@use "/src/assets/stylesheets/base/mixins" as *;\n${content}`,
      },
    },
  },
})
