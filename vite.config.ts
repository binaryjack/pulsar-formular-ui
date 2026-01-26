import { pulsarPlugin } from '@pulsar-framework/vite-plugin';
import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  root: './src',
  plugins: [pulsarPlugin()],
  server: {
    hmr: {
      overlay: true,
    },
    open: true,
  },
  resolve: {
    alias: [
      {
        find: /^pulsar\/jsx-runtime$/,
        replacement: resolve(__dirname, '../pulsar.dev/src/jsx-runtime.ts'),
      },
      {
        find: /^pulsar\/jsx-dev-runtime$/,
        replacement: resolve(__dirname, '../pulsar.dev/src/jsx-runtime.ts'),
      },
      { find: /^pulsar\/ssr$/, replacement: resolve(__dirname, '../pulsar.dev/src/ssr/index.ts') },
      {
        find: /^pulsar\/reactivity$/,
        replacement: resolve(__dirname, '../pulsar.dev/src/reactivity/index.ts'),
      },
      {
        find: /^pulsar\/hooks$/,
        replacement: resolve(__dirname, '../pulsar.dev/src/hooks/index.ts'),
      },
      {
        find: /^pulsar\/state$/,
        replacement: resolve(__dirname, '../pulsar.dev/src/state/index.ts'),
      },
      {
        find: /^pulsar\/resource$/,
        replacement: resolve(__dirname, '../pulsar.dev/src/resource/index.ts'),
      },
      {
        find: /^pulsar\/context$/,
        replacement: resolve(__dirname, '../pulsar.dev/src/context/index.ts'),
      },
      {
        find: /^pulsar\/portal$/,
        replacement: resolve(__dirname, '../pulsar.dev/src/portal/index.ts'),
      },
      {
        find: /^pulsar\/error-boundary$/,
        replacement: resolve(__dirname, '../pulsar.dev/src/error-boundary/index.ts'),
      },
      { find: /^pulsar\/di$/, replacement: resolve(__dirname, '../pulsar.dev/src/di/index.ts') },
      {
        find: /^pulsar\/control-flow$/,
        replacement: resolve(__dirname, '../pulsar.dev/src/control-flow/index.ts'),
      },
      { find: /^pulsar$/, replacement: resolve(__dirname, '../pulsar.dev/src/index.ts') },
      {
        find: '@pulsar-framework/core',
        replacement: resolve(__dirname, '../pulsar.dev/src/index.ts'),
      },
      {
        find: '@pulsar-framework/ui',
        replacement: resolve(__dirname, '../pulsar-ui.dev/src/index.ts'),
      },
      {
        find: '@pulsar-framework/design-tokens',
        replacement: resolve(__dirname, '../pulsar-design-system/src/index.ts'),
      },
      { find: 'formular.dev.lib', replacement: resolve(__dirname, '../formular.dev/src/index.ts') },
      // formular.dev path aliases (no trailing slash)
      { find: '@core', replacement: resolve(__dirname, '../formular.dev/src/core') },
      { find: '@setup', replacement: resolve(__dirname, '../formular.dev/src/setup') },
      {
        find: '@factory',
        replacement: resolve(__dirname, '../formular.dev/src/core/field-engine/generator/factory'),
      },
      { find: '@framework', replacement: resolve(__dirname, '../formular.dev/src/core/framework') },
      {
        find: '@utility',
        replacement: resolve(__dirname, '../formular.dev/src/core/framework/utility'),
      },
      {
        find: '@common',
        replacement: resolve(__dirname, '../formular.dev/src/core/framework/common'),
      },
    ],
  },
  optimizeDeps: {
    include: [
      'pulsar',
      'pulsar/reactivity',
      'pulsar/hooks',
      'pulsar/jsx-runtime',
      'pulsar/jsx-dev-runtime',
      'pulsar/state',
      'pulsar/resource',
      'pulsar/context',
      'pulsar/portal',
      'pulsar/error-boundary',
      'pulsar/di',
      'pulsar/control-flow',
      'formular.dev.lib',
    ],
    exclude: ['pulsar/ssr', '@pulsar-framework/ui'],
    force: true,
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'PulsarFormularUI',
      fileName: (format) => `index.${format}.js`,
      formats: ['es'],
    },
    rollupOptions: {
      external: [
        'pulsar',
        '@pulsar-framework/core',
        '@pulsar-framework/ui',
        '@pulsar-framework/design-tokens',
        'formular.dev.lib',
      ],
    },
  },
});
