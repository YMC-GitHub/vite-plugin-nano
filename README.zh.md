一个Vite插件库包，用于Nano包，用于在dist中压缩js文件并执行更多操作。

## 项目背景

曾经完成过这样的一些需求：在命令行中压缩 构建的 .js文件 ，在文件名后缀前添加 min 标识，添加banner信息。

重复造轮子？ 为了插拔式添加到任意的构建工具中！

这里提取部分核心代码 ，写成一个 vite 插件。

## 当前功能

- 压缩输出的 .js 文件，压缩后的文件名为在原文件名后缀前添加 min 标识，
- 在文件头部添加 banner 信息 (可选)


## 用户安装

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


## 产品闭环

很小，功能单一，只做一件事 —— 压缩输出的 .js 文件，压缩后的文件名为在原文件名后缀前添加 min 标识

## 产品运维

因为功能简单，决定了它的开发速度，更新速度，问题速度不会很慢

## 产品计划

因为功能单一，功能已经基本完成，后期主要根据命令包或其他类库包的需要，更新小补丁，不会有功能大改的情况出现，架构可能会随着技术的更新而有变化

## 许可证书

您可以使用它做任何事，但是请不要违发您所在地区法律。我不会为您的行为承担任何责任。

## 结束语

> 身为一名程序员我很自豪，虽然足不出户，指尖却有着可以改变世界 (可能有点大了) 自己的力量。即使不能实现，将其作为努力的目标也不错。———— 摘自 lencx

它就是一张白纸，您有什么设想，可以直接编码出来，怎么编，规则怎么定，有您决定。