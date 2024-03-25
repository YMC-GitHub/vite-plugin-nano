A vite plugin library package for nano packages to compress js files in dist and do more.

## Background

Some of the requirements have been accomplished: compress the built .js file on the command line, add the min label in front of the file name suffix, and add banner information.

Repeat the wheel? Add plug-and-pull to any build tool!

here we extract some of the core code and write it as a vite plugin.

## Features

- compress js files in dist and add the 'min' label to the file name in front of the file name suffix.
- add banner infomation to these js files

## User installing
```bash
npm i vite-plugin-nano --save-dev

```

```bash
yarn add vite-plugin-nano -D
```

```bash
pnpm add vite-plugin-nano -D
```

```ts
interface VitePluginNanoOption {
    [attr: string]: any;
    disable?: boolean;
    label: string;
    skipExt: string;
    allowExt: string;
    banner: string;
}
```


```ts
import { defineConfig } from 'vite'
import nanoMiniDist from 'vite-plugin-nano'
let plugins =[
  nanoMiniDist({
    disable:false,
    allowExt:'.js,.cjs',
    skipExt:'.test.js,.test.cjs',
    // banner:'your banner here',
  })
]
export default defineConfig({
  plugins: plugins,
})

```


## Product Closed Loop

Small, single function, only do one thing - compress js files in dist and add the 'min' label to the file name in front of the file name suffix.

## Product operation and maintenance

Because the function is simple, it determines its development speed, update speed, problem speed will not be slow

## Product plans

Because the function is simple, the function has been basically completed. In the later stage, small patches will be updated mainly according to the needs of binary packages or other library packages. There will be no major changes in functions. The architecture may change with the update of technology.

## License certificate

You can do anything with it, but please do not violate the laws of your area. I will not accept any responsibility for your actions.


## Concluding remarks

> I am proud to be a programmer, and although I don't leave home, I have the power to change the world (maybe a little big) at my fingertips. Even if it can't be achieved, it's a good goal to strive for. -- from lencx

It is a blank sheet of paper, you have any ideas, you can directly code out, how to compile, how to set the rules, you decide.
