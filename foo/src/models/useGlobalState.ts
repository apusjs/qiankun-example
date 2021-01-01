import _cloneDeep from "lodash/cloneDeep";

let gloabalState = {};



export const appStateActions = {

  // 获取数据
  getGlobalState: function onGlobalStateChange() {
    return gloabalState
  },
  // 更新数据
  setGlobalState: function setGlobalState(state={}) {
    if (typeof state === 'object') {
      gloabalState = {...gloabalState,...state}
    }else {
      console.warn('state has not object！');
    }
  },
  // 清除全局数据
  delGlobalState: function delGlobalState() {
    gloabalState = {}
  },

}

export function initGlobalState(state = {}) {
  if (state === gloabalState) {
    console.warn('state has not changed！');
  } else {
    gloabalState = _cloneDeep(state);
  }
  return appStateActions;
}

function emptyAction() {
  console.warn('Current execute action is empty!');
}

// 应用单独运行时的假数据
const initState = {
}

class Actions {
  private isqiankun: boolean;

  constructor() {
    this.isqiankun = false; // 是否注册 qiankun
  }

  actions = {
    getGlobalState: emptyAction,
    setGlobalState: emptyAction,
    delGlobalState: emptyAction
  };

  // 注册事件方法，一般在入口文件 调用一次
  setActions(actions: any) {
    this.isqiankun = true;
    this.actions = actions;
  }

  getGlobalState(args: any) {
    const globalState:any = this.actions.getGlobalState();
    if(this.isqiankun){
      // 判断是否为空 为空直接返回所有数据
      // eslint-disable-next-line no-void
      if(args === void 0){
        return globalState
      }
      // 获取单个值
      if(typeof(args) === 'string'){
        return args in globalState ? globalState[args] : ''
      }
      // 多参数数组的形式传入
      if(Array.isArray(args)){
        const reObj = {}
        args.forEach((item)=>{
          if(item in globalState){
            reObj[item] = globalState[item]
          }
        })
        return reObj;
      }
      // 查不到返回空
      return ''
    }
    // 如果没有注册 qiankun 则返货假数据
    return initState;
  }

  setGlobalState(args: any) {
    if(this.isqiankun){
      this.actions.setGlobalState(args);
    }else {
      console.warn("globalState no register");
    }
  }
}

const actions = new Actions();
export default actions;


