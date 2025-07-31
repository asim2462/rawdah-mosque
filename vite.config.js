import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: [
        'app_icon_512.png',
        'bg_pattern_blue.jpg',
        'rawdah_mosque_logo.png',
        'assets/fonts/avenir-next-demi-bold.ttf',
        'assets/fonts/avenir-next-regular.ttf',
        'assets/fonts/BerlingskeSerif-Md.ttf',
        'assets/fonts/BerlingskeSerif-Regular.ttf'
      ],
      manifest: {
        name: 'Rawdah Mosque',
        short_name: 'Rawdah Mosque',
        description: 'Live daily prayer times and announcements for Rawdah Mosque.',
        theme_color: '#56853c',
        background_color: '#163c4c',
        display: 'standalone',
        start_url: '.',
        icons: [
          {
            src: '/app_icon_192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/app_icon_512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: '/app_icon_144.png',
            sizes: '144x144',
            type: 'image/png',
          },
        ],
      },
    }),
  ],
})
