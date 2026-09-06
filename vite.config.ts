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
      less: {
        javascriptEnabled: true,
        // antd v4 components are compiled against these Less theme variables.
        // Keep in sync with --primary-color/--link-color/etc. in _variables.scss.
        modifyVars: {
          'primary-color': '#1da57a',
          'link-color': '#1da57a',
          'body-background': '#0b0c0d',
          'card-head-padding': '0.6rem',
          'card-padding-base': '0.6rem',
          'border-color-base': '#004f4a',
        },
      },
      scss: {
        additionalData: `@use "/src/assets/stylesheets/base/_variables.scss";`,
      },
    },
  },
})
