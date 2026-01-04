import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
    base: "/",
    plugins: [react()],
    preview: {
        port: 8080,
        strictPort: true,
    },
    server: {
        port: 8080,
        strictPort: true,
        host: true,
        origin: "http://0.0.0.0:8080",
    },
    resolve: {
        alias: {
            '~modules': path.resolve(__dirname, './src/modules'),
            '~shared': path.resolve(__dirname, './src/shared'),
            '~styles': path.resolve(__dirname, './src/styles'),
        }
    }
})
