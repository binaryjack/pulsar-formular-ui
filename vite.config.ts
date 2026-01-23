import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'PulsarFormularUI',
      fileName: (format) => `index.${format}.js`,
      formats: ['es']
    },
    rollupOptions: {
      external: [
        'pulsar',
        '@pulsar-framework/core',
        '@pulsar-framework/ui',
        '@pulsar-framework/design-tokens',
        'formular.dev.lib'
      ]
    }
  }
});
