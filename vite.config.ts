import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import fs from 'fs'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  server: {
    https: {
      key: fs.readFileSync(path.resolve(__dirname, 'key.pem')),       // raíz
      cert: fs.readFileSync(path.resolve(__dirname, 'localhost.pem')) // raíz
    },
    port: 3000
  }
})