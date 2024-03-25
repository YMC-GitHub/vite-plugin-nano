/**
 * mock node.js path.extname
 * @sample
 * ```ts
 * extname('main.js') //'.js'
 * ```
 */
export function extname(wkd: string) {
  const reg = /(.*)?\./gi
  if (!reg.test(wkd)) return ''
  const res = wkd.trim().replace(/(.*)?\./gi, '')
  return res ? `.${res}` : ''
}


export function addBannerHead(data: string, head: string = '') {
  if (!head) return data

  let res: string = ''
  let exist = data.indexOf(head) >= 0
  if (!exist) {
    // add
    res = `${head}\n${data}`
  } else {
    res = data
  }
  return res
}


/**
 * let object like nano.flag as to be edit-able and custom is optional
 * @sample
 * ```ts
 * // need type check in develop ? yes
 * let option:FileTransformOption = confOption(options,builtinFileTransformOption)
 * 
 * / need type check in develop ? no
 * let nocheck = confOption(options,builtinFileTransformOption)
 * ```
 */
export function confOption(custom?: any, builtin: any = {}) {
  return { ...builtin, ...(custom ? custom : {}) };
}


export interface FileOption {name:string}
// <T extends FileLike>
export interface FileLike extends FileOption {}

/**
 * file-like filter - ignore files matched label rule
 * @sample
 * ```ts
 * ignoreFilesMatchedRule(files,{label:'min'})
 * // todo:
 * ignoreFilesMatchedRule(files,{label:'.min{ext}$'})
 * ```
 */
export function ignoreFilesMatchedRule(files:FileLike[],options?:{label?:string,matchRule?:(file:FileOption)=>boolean}){
  let option = confOption(options,{})
  let {label} = option

  let passedRule =option.matchRule
  // label + ext -> matchRule
  let matchRule = passedRule && typeof passedRule ==="function"?passedRule: (file:FileOption)=>{
    let ext = extname(file.name);
    let rulereg = new RegExp(`.${label}${ext}$`,'i');
    return file.name.match(rulereg)
  }
  return files.filter(file => !matchRule(file))
}

/**
 * path-like transform - add label in front of ext
 * @sample
 * ```ts
 * addLabelInfrontOfExt(file.name,'min',ext)
 * ```
 */
export function addLabelInfrontOfExt(pathLike:string,label:string,extCached?:string){
  // use cache ext when passed from args of func level
  let ext = extCached?extCached:extname(pathLike);
  return pathLike.replace(new RegExp(`${ext}$`,'i'),`.${label}${ext}`)
}

