import * as packageConfig from'../package.json';
// eslint-disable-next-line
if (window.__POWERED_BY_QIANKUN__) {
  // @ts-ignore
  // eslint-disable-next-line no-underscore-dangle,no-undef
  __webpack_public_path__ = `${window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__}${packageConfig.name}/`;// 处理资源
}

