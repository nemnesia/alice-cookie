import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { defineConfig } from 'vite'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import singleFileCompression from 'vite-plugin-singlefile-compression'
import wasm from 'vite-plugin-wasm'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

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
  server: {
    https: {
      key: fs.readFileSync(path.resolve(__dirname, 'cert/localhost.key')),
      cert: fs.readFileSync(path.resolve(__dirname, 'cert/localhost.crt')),
    },
  },
})
