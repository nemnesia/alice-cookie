import { defineConfig } from 'vite'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import singleFileCompression from 'vite-plugin-singlefile-compression'
import wasm from 'vite-plugin-wasm'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    singleFileCompression(),
    wasm(),
    nodePolyfills({
      globals: { Buffer: true },
      include: ['buffer', 'crypto', 'stream', 'util'],
    }),
  ],
})
