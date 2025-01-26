import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const ReactCompilerConfig = {
  target: '18' // '17' | '18' | '19'
};

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(
    {
      babel: {
        plugins: [
          ["babel-plugin-react-compiler", ReactCompilerConfig],
        ],
      },
    }
  )],
})