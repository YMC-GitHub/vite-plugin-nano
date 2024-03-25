
import { minify } from "terser";

import { PluginOption, Plugin } from 'vite'
import type { ResolvedConfig } from 'vite'
// pnpm add rollup -D
import type { NormalizedOutputOptions, OutputBundle } from 'rollup'

import path from "path"
import fs from "fs"

import {extname,addBannerHead, confOption as likeOption,addLabelInfrontOfExt} from "./nano-shared"

import type {FileOption,FileLike} from "./nano-shared"
export interface VitePluginNanoOption {
  [attr: string]: any,
  disable?:boolean
  label:string
  skipExt:string
  allowExt:string
  banner:string
}
export type VitePluginNanoOptionLike = Partial<VitePluginNanoOption>

const builtinVitePluginNanoOption:VitePluginNanoOption = {
  banner:'',
  disable:false,
  allowExt:'.js,.cjs',
  skipExt:'.test.js,.test.cjs',
  label:'min'
}
// to be vite plug


// https://juejin.cn/post/6998736350841143326
interface FileTransformResult extends Partial<FileOption>  {src:string,des:string}
// done:
// HelpTransfromFilterFiles<FileLike extends FileOption>(files:FileLike[]):FileTransformResult[]

interface TerserFileTransformOption  {label:string}
type TerserFileTransformOptionLike = Partial<TerserFileTransformOption>

const builtinFileTransformOption={label:'min'}

// idea: make func like func(data,conf,util) to adapter different env (todo)

/**
 * files filter by name and add label in front of ext
 * @sample
 * ```ts
 * ignoreMatchedFilesPerf()
 * ```
 */
function ignoreMatchedFilesPerf(files:FileLike[],options?:TerserFileTransformOptionLike):FileTransformResult[]{
  let option:TerserFileTransformOption = likeOption(options,builtinFileTransformOption)
  // get label from prompt
  let {label} = option

  let midd= files.map(file => {

    let ext = extname(file.name)
    // label rule to regexp
    let rulereg = new RegExp(`.${label}${ext}$`,'i');

    // file match with label rule
    if(file.name.match(rulereg)){
        return {...file,src:file.name,des:''}
    }

    // add label in front of ext
    let outloc =addLabelInfrontOfExt(file.name,label,ext)
    return {...file,src:file.name,des:outloc}
  })

  // ignore files that match label rule
  midd = midd.filter(item=>item.des!=='')

  return midd
}

function ruleRegify(rules:string){
  return rules.split(",").map(v=>v.trim()).filter(v=>v).map(v=>new RegExp(`${v}$`,'i'))
}

export default (pluginOptions?: VitePluginNanoOptionLike):any => {
  // cache vite config in this plugin block scop
  let viteConfig:ResolvedConfig

  return {
    name: 'vite-plugin-nano',

    configResolved(resolvedConfig:ResolvedConfig) {
      // get vite config from vite data flow
      viteConfig = resolvedConfig
    },

    // writeBundle,closeBundle,
    async closeBundle(_options: NormalizedOutputOptions, outBundle:  OutputBundle) {
      try {
        const pluginConfig:VitePluginNanoOption = likeOption(pluginOptions,builtinVitePluginNanoOption)

        // console.log(JSON.stringify(pluginConfig,null,''))

        // console.log(viteConfig)
        // @ts-ignore
        if (viteConfig.DEV || pluginConfig.disable) return;
        const root: string = viteConfig.root
        const outDir: string = pluginConfig.outDir || viteConfig.build.outDir || 'dist'

        let files = fs.readdirSync(path.resolve(root, outDir))
        files=files.map(name=>path.resolve(root, outDir,name))

        // console.log(files)


        const rule: string = pluginConfig.allowExt
        const skipRule: string = pluginConfig.skipExt
        // let rulesreg = [new RegExp(rule)] 
        // rulesreg = ['.js',".cjs"].map(v=>new RegExp(`${v}$`,'ig'))
        // rulesreg = rule.split(",").map(v=>v.trim()).filter(v=>v).map(v=>new RegExp(`${v}$`,'i'))
        // console.log(`[mini-dist] files length before filter ext:`,files.length)
        if(rule){
          let rulesreg = ruleRegify(skipRule)
          files = files.filter(location => rulesreg.some(rule=>rule.test(location)))
        }
        if(skipRule){
          let skiprulereg = ruleRegify(skipRule)
          files = files.filter(location => skiprulereg.some(rule=>!rule.test(location)))
        }

        // ['.js','.cjs'].map()
        let filex = ignoreMatchedFilesPerf(files.map(name=>{return {name}}),{label:pluginConfig.label})
        // console.log(filex)
        // console.log(`[mini-dist] files length after filter ext:`,filex.length)

        let task = filex.map(file=>{
          return async ()=>{
            let text = fs.readFileSync(file.src,'utf-8')
            let {code} = await minify(text)
            code= code?code:''
            // banner des
            code= pluginConfig.banner?addBannerHead(code,pluginConfig.banner):code
            fs.writeFileSync(file.des,code)

            // banner src
            // code = fs.readFileSync(file.src,'utf-8')
            // code= pluginConfig.banner?addBannerHead(text,pluginConfig.banner):text
            // fs.writeFileSync(file.src,code)
            if(pluginConfig.banner){
              fs.writeFileSync(file.src,addBannerHead(text,pluginConfig.banner))
            }
          }
        })
        
        return Promise.all(task.map(fn=>fn()))
      } catch (error) {
        console.error(error)
      }
    },
  }
}
