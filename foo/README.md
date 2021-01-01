# Ant Design Pro

This project is initialized with [Ant Design Pro](https://pro.ant.design). Follow is the quick guide for how to use.

## Environment Prepare

Install `node_modules`:

```bash
npm install
```

or

```bash
yarn
```

## Provided Scripts

Ant Design Pro provides some useful script to help you quick start and build with web project, code style check and test.

Scripts provided in `package.json`. It's safe to modify or add additional script:

### Start project

```bash
npm start
```

### Build project

```bash
npm run build
```

### Check code style

```bash
npm run lint
```

You can also use script to auto fix some lint error:

```bash
npm run lint:fix
```

### Test code

```bash
npm test
```

## 环境
在.env内修改启动命令，以添加对应环境变量。

示例代码如下：

```bash
// .env
PORT=8001
BROWSER=none
```
## 受权

> 对token管理必须通过 /src/utils/authorization.ts 进行，禁止直接更新缓存或删除。

通过 import { setAuthorization } from '@/utils/authorization.ts'; 你可以使用内置的方法。 setAuthorization 接收一个参数 token。

setAuthorization 通过它对token进行更新，一个不同的是 token 扩展了一个 timestamp token有效时间( '当前时间 + 有效时间（秒） = 有效时间'), 后对token进行更新并缓存（全局State&localStorage）。

getAuthorization 通过它可获取当前系统缓存的token，判断是否在有效时间内(有效时间 - 当前时间 > 300秒)，为 true 返回token, 为 false 返回undefined。

delAuthorization 通过它可删除当前系统缓存的token.

updateAuthorization 通它将自动在当前token过期前600秒时向后端发起更新当前token的api请求，如请求成功则调用setAuthorization 方法更新旧原token.

> 对token自动更新可根据自身业务需要修改为通过 refreshToken置换 token。

```bash
import { 
  setAuthorization,
  getAuthorization, 
  delAuthorization 
} from '@/utils/authorization.ts'

```

## 网络请求

通过 import { request } from 'umi'; 你可以使用内置的请求方法。 request 的用法等同于 umi-request，对应对中间件 & 拦截器等在 /src/utils/request.ts 进行维护。

useAuthorization 请求前拦截自动在请求头中增加token。

usePath 请求前拦截自动修改 request 接收第一个参数 url 前增加基础路径。

useFormatResult 响应拦截可全局判断请求状态是否为成功，不成功而导向错误处理。

errorHandler 异常处理程序。

通过 config/request.ts 可控制后端返回格式与错误处理Message，规范可以参考 @umijs/plugin-request 的文档，

## 自定义布局
Pro 中内置了 plugin-layout 来减少样板代码。如它不符合你的场景，可以参考以下两个layou样例

src/layout/BaseLayout.tsx 基础plugin-layout 之上再增加一层自定义包裹。

src/layout/fullScreenLayout.tsx 关闭默认 layout 之后的自定义包裹。
> 关闭默认 layout 可在一级路由中配置 layout: false。

## 新增页面

具体格式参考 [pro.ant](https://beta-pro.ant.design/docs/new-page-cn)

## 修改样式
使用[pro.ant](https://beta-pro.ant.design)的现有样式设计上
大部分用法等同于 [pro.ant](https://beta-pro.ant.design)，一个不同的是扩展了一个配置 theme入口。

```bash
config
src
  models
  pages
  theme
    default
      components
        index.less
        button.less
        ...
      variables
        antd.less
        colors.less
        index.js
        index.less
        var.less
      reset.less
      spa.less
  global.less
  ...
...
package.json
```

## 全局初始数据
具体格式参考 [pro.ant](https://beta-pro.ant.design/docs/initial-state-cn)

## 简易数据流
具体格式参考 [pro.ant](https://beta-pro.ant.design/docs/simple-model-cn)
## 权限管理
具体格式参考 [pro.ant](https://beta-pro.ant.design/docs/authority-management-cn)

