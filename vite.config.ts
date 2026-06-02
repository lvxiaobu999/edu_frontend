import { defineConfig, loadEnv, type UserConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'
import viteCompression from 'vite-plugin-compression'
import { visualizer } from 'rollup-plugin-visualizer'
import tailwindcss from '@tailwindcss/vite'
import svgr from 'vite-plugin-svgr'
import { viteMockServe } from 'vite-plugin-mock'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'

export default defineConfig(({ command, mode }): UserConfig => {
  const env = loadEnv(mode, process.cwd(), '')
  const isMock = mode === 'mock' || env.VITE_USE_MOCK === 'true'
  const isBuild = command === 'build'

  return {
    plugins: [
      react(),
      svgr(),
      tailwindcss(),
      isBuild &&
        viteCompression({
          threshold: 10240,
          algorithm: 'gzip',
          ext: '.gz',
        }),
      isBuild && visualizer({ open: false, gzipSize: true }),
      viteMockServe({
        mockPath: 'mock',
        enable: isMock,
        watchFiles: true,
        logger: true,
      }),
      createSvgIconsPlugin({
        iconDirs: [path.resolve(process.cwd(), 'src/assets/icons')],
        symbolId: 'icon-[name]',
      }),
    ].filter(Boolean),

    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },

    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        'react-router-dom',
        'antd',
        '@ant-design/icons',
        '@tanstack/react-query',
        'framer-motion',
      ],
    },

    server: {
      host: '0.0.0.0',
      port: 3333,
      open: true,
      cors: true,
      proxy: isMock
        ? undefined
        : {
            '/api': {
              target: env.VITE_API_BASE_URL,
              changeOrigin: true,
              rewrite: path => path.replace(/^\/api/, '/api'),
            },
          },
    },

    build: {
      target: 'es2020',
      sourcemap: false,
      reportCompressedSize: false,
      chunkSizeWarningLimit: 1000,
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true,
        },
        format: {
          comments: false,
        },
      },
      rollupOptions: {
        output: {
          manualChunks(id) {
            const normalizedId = id.replace(/\\/g, '/')

            if (!normalizedId.includes('/node_modules/')) {
              return
            }

            if (
              normalizedId.includes('/node_modules/react/') ||
              normalizedId.includes('/node_modules/react-dom/') ||
              normalizedId.includes('/node_modules/scheduler/')
            ) {
              return 'react-core'
            }

            if (
              normalizedId.includes('/node_modules/react-router/') ||
              normalizedId.includes('/node_modules/react-router-dom/')
            ) {
              return 'router'
            }

            if (normalizedId.includes('/node_modules/@ant-design/icons/')) {
              return 'ant-icons'
            }

            if (
              normalizedId.includes('/node_modules/antd/es/table') ||
              normalizedId.includes('/node_modules/rc-table/') ||
              normalizedId.includes('/node_modules/rc-pagination/')
            ) {
              return 'antd-table'
            }

            if (
              normalizedId.includes('/node_modules/antd/es/form') ||
              normalizedId.includes('/node_modules/antd/es/input') ||
              normalizedId.includes('/node_modules/antd/es/select') ||
              normalizedId.includes('/node_modules/antd/es/tree-select') ||
              normalizedId.includes('/node_modules/rc-field-form/') ||
              normalizedId.includes('/node_modules/rc-select/') ||
              normalizedId.includes('/node_modules/rc-tree-select/')
            ) {
              return 'antd-form'
            }

            if (
              normalizedId.includes('/node_modules/antd/') ||
              normalizedId.includes('/node_modules/antd-style/') ||
              normalizedId.includes('/node_modules/rc-util/') ||
              normalizedId.includes('/node_modules/rc-motion/') ||
              normalizedId.includes('/node_modules/rc-resize-observer/') ||
              normalizedId.includes('/node_modules/rc-overflow/') ||
              normalizedId.includes('/node_modules/rc-trigger/') ||
              normalizedId.includes('/node_modules/@rc-component/')
            ) {
              return 'antd-core'
            }

            if (normalizedId.includes('/node_modules/@tanstack/')) {
              return 'query'
            }

            if (normalizedId.includes('/node_modules/framer-motion/')) {
              return 'motion'
            }

            if (normalizedId.includes('/node_modules/echarts/')) {
              return 'echarts'
            }

            return 'vendor'
          },
          chunkFileNames: 'assets/js/[name]-[hash].js',
          entryFileNames: 'assets/js/[name]-[hash].js',
          assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
        },
      },
    },
  }
})
