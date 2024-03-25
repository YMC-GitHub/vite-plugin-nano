import { defineConfig } from 'tsup'
import path from 'path'
import fs from 'fs' 
import pkg from './package.json'
let bannerText = `/**\n * name: ${pkg.name}\n * version: v${pkg.version}\n * description: ${pkg.description}\n * author: ${pkg.author}\n * homepage: ${pkg.homepage}\n */`
export default defineConfig ({
  entry: ['src/main.ts'],
  outDir: 'dist',
  legacyOutput: false,
  banner: {
    js:bannerText
  },
  sourcemap: false,
  clean: true,
  dts: true,
  minify: true,
  splitting: false,
  format: ["esm", "cjs"],
  async onSuccess() {
    await fs.renameSync(path.resolve(__dirname, 'dist/main.js'), path.resolve(__dirname, 'dist/main.cjs'))
    console.log('Build Success')
  },
},)