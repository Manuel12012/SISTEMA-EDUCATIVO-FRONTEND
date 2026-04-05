import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import fs from 'fs'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  server: {
    https: {
      key: fs.readFileSync(path.resolve(__dirname, 'localhost-key.pem')), // clave correcta
      cert: fs.readFileSync(path.resolve(__dirname, 'localhost.pem')),     // certificado correcto
    },
    port: 3000
  }
})