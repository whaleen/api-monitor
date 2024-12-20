import path from "path"
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { crx } from '@crxjs/vite-plugin'
import manifest from './manifest.json'

export default defineConfig(({ mode }) => {
    if (mode === 'extension') {
        return {
            plugins: [react(), crx({ manifest })],
            build: {
                outDir: 'dist-extension',
                emptyOutDir: true,
                rollupOptions: {
                    input: {
                        background: 'src/extension/background.js',
                        content: 'src/extension/content.js'
                    }
                }
            }
        }
    }

    return {
        plugins: [react()],
        resolve: {
            alias: {
                "@": path.resolve(__dirname, "./src"),
            },
        },
        build: {
            outDir: 'dist-web',
            emptyOutDir: true
        },
        server: {
            port: 5173,
            strictPort: true,
            open: true
        }
    }
})
