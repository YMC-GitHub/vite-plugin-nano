
/* eslint-disable prefer-const */

import fs from 'node:fs'
import path from 'node:path'
import { spawn } from 'node:child_process'
import { builtinModules } from 'node:module'
import { defineConfig } from 'vite'
// import plainText from 'vite-plugin-plain-text';
// import banner from 'vite-plugin-banner'
// import eslint from "vite-plugin-eslint";
import nanoViteMiniDist from "./src/main"

import pkg from './package.json'
// import fg from 'fast-glob';
// prefer-const
const isDevEnv = process.argv.slice(2).includes('--watch')
const jsfileOutDir: string = "dist"
const tsTypeOutDir: string = "types"

const jsfileSrcDir='src'
let bannerText = `/**\n * name: ${pkg.name}\n * version: v${pkg.version}\n * description: ${pkg.description}\n * author: ${pkg.author}\n * homepage: ${pkg.homepage}\n */`
let  plugins =[
  // isDevEnv?eslint({ lintOnStart: true, cache: false }):undefined,
  // allow all *.md files can be import as es module
  // plainText(['*.md'], { namedExport: false, dtsAutoGen: true, distAutoClean: true },),
  {
      name: 'generate-types',
      async closeBundle() {
          if (process.env.NODE_ENV === 'test') return

          removeTypes()
          await generateTypes()
          moveTypesToDist()
          removeTypes()
      },
  },
  nanoViteMiniDist({banner:bannerText,allowExt:'.js,.cjs,.mjs'}),
]
// console.log(stdUmdName(pkg.name))


function removeTypes() {
    console.log(`[types] declaration remove`)
    fs.rmSync(path.join(__dirname, tsTypeOutDir), { recursive: true, force: true })
}

function generateTypes() {
    return new Promise(resolve => {
        const cp = spawn(
            process.platform === 'win32' ? 'npm.cmd' : 'npm',
            ['run', 'types'],
            { stdio: 'inherit' },
        )
        cp.on('exit', code => {
            !code && console.log('[types]', 'declaration generated')
            resolve(code)
        })
        cp.on('error', process.exit)
    })
}

function moveTypesToDist() {
    let types = path.join(__dirname, tsTypeOutDir,jsfileSrcDir)
    const dist = path.join(__dirname, jsfileOutDir)
    // use types when types/lib not exsits for file in src  disable -> types/src not exist 
    if(!fs.existsSync(types)) types = path.join(__dirname, tsTypeOutDir)
    if(!fs.existsSync(types)) return
    let files = fs.readdirSync(types).filter(n => n.endsWith('.d.ts'))

    // ignore test files
    files = files.filter(name=> !name.endsWith('.test.d.ts'))
    for (const file of files) {
        fs.copyFileSync(path.join(types, file), path.join(dist, file))
        console.log('[types]', `${tsTypeOutDir}/${file} -> ${jsfileOutDir}/${file}`)
    }
}

function stdUmdName(name:string){
  return name.replace(/'@.*\/'/ig,'').replace(/-/ig,'')
}


export default defineConfig({
  build: {
      // terserOptions: {
      //     compress: {
      //         drop_console: true,
      //         drop_debugger: true,
      //     },
      // },
      // minify: !isDevEnv?'terser':false,
      minify:false,
      outDir: jsfileOutDir,
      emptyOutDir: !isDevEnv,
      // target: 'node14',
      lib: {
          entry: [jsfileSrcDir,'main.ts'].join("/"),
          name: stdUmdName(pkg.name),
          formats: ['cjs', 'es'],
          // fileName: format => format === 'es' ? '[name].mjs' : '[name].js',
          // fileName: format => format === 'es' ? '[name].js' : format === 'umd' ?'[name].umd.cjs':'[name].cjs',
          fileName: format => format === 'es' ? '[name].mjs' : format === 'umd' ?'[name].umd.cjs':'[name].cjs',
      },
      rollupOptions: {
          external: [
              'vite',
              ...builtinModules,
              ...builtinModules.map(m => `node:${m}`),
              ...Object.keys('dependencies' in pkg ? pkg.dependencies as object : {}),
          ],
          output: {
              exports: 'named',
          },
      },
  },
  plugins: plugins.filter(v=>v),
})