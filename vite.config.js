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
        'app_icon_512.png', // app icon
        'bg_pattern_blue.jpg', // background image
        'rawdah_mosque_logo.png' // logo
      ],
      manifest: {
        name: 'Rawdah Mosque',
        short_name: 'Rawdah',
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
