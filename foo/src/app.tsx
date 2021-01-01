import React from 'react';
import type { Settings as LayoutSettings } from '@ant-design/pro-layout';
import { PageLoading } from '@ant-design/pro-layout';
import type { RequestConfig, RunTimeLayoutConfig } from 'umi';
import { history } from 'umi';
import RightContent from '@/components/RightContent';
import Footer from '@/components/Footer';
import { queryCurrent } from './services/user';
import defaultSettings from '../config/defaultSettings';
import {
  errorConfig,
  errorHandler,
  useAuthorization,
  useFormatResult,
  usePath
} from '@/utils/request';
import { getAuthorization } from '@/utils/authorization';
import menuIconEnum from '@/common/enums/menu-icon.enum';
import actions, { initGlobalState } from "@/models/useGlobalState";
import { queryMenus } from './services/menu';

interface Authorization {
  accessToken?: string;
  expiresIn?: number;
}

const replaceLogin = (uri?: string) => {
  history.push({
    pathname: '/login',
    query: {
      redirect: uri || history.location.pathname,
    },
  });
}

/**
 * 获取用户信息比较慢的时候会展示一个 loading
 */
export const initialStateConfig = {
  loading: <PageLoading />,
};

export async function getInitialState(): Promise<{
  settings?: LayoutSettings;
  authorization?: Authorization,
  currentUser?: API.CurrentUser;
  currentMenus?: API.CurrentMenus | undefined;
  fetchUserInfo: () => Promise<API.CurrentUser | undefined>;
  fetchMenus: () => Promise<API.CurrentMenus | undefined>;
}> {
  actions.setActions(initGlobalState())
  const fetchUserInfo = async () => {
    try {
      // eslint-disable-next-line no-underscore-dangle
      if (window.__POWERED_BY_QIANKUN__) {
        const { currentUser } = actions.getGlobalState(['currentUser']);
        return currentUser;
      }
      const data = await queryCurrent();
      // TODO 需要增加用户角色管理
      data.access = 'admin'
      return data;
    } catch (error) {
      replaceLogin()
    }
    return undefined;
  };

  const fetchMenus = async () => {
    try {
      // eslint-disable-next-line no-underscore-dangle
      if (window.__POWERED_BY_QIANKUN__) {
        return;
      }
      return await queryMenus();
    } catch (error) {
      console.error(error);
      replaceLogin();
    }
    return;
  };
  // 如果是登录页面，不执行
  if (getAuthorization() && !(location.pathname === '/login' || location.pathname === '/error' || location.pathname === '/404')) {
    const currentUser = fetchUserInfo()
    const currentMenus = fetchMenus()

    await Promise.all([currentUser, currentMenus])
    return {
      fetchUserInfo,
      fetchMenus,
      authorization: getAuthorization(),
      currentUser: await currentUser,
      currentMenus: await currentMenus,
      settings: defaultSettings,
    };
  }
  return {
    fetchUserInfo,
    fetchMenus,
    settings: defaultSettings,
  };
}

export const layout: RunTimeLayoutConfig = ({ initialState }) => {
  const { currentMenus } = initialState;
  return {
    rightContentRender: () => <RightContent />,
    disableContentMargin: false,
    footerRender: () => <Footer />,
    onPageChange: () => {
      const { location } = history;
      // 如果没有登录，重定向到 login
      if (!getAuthorization() && !(location.pathname === '/login' || location.pathname === '/error' || location.pathname === '/404')) {
        replaceLogin();
      }
    },
    menuHeaderRender: undefined,
    menuDataRender: () => {
      // 将服务端获取的菜单 icon 字符串映射为对应的 icon Dom
      const mappingIcon = (menuData: any) => {
        return menuData.map((item: any) => ({
          ...item,
          icon: menuIconEnum[item.icon],
          children: item.children ? mappingIcon(item.children) : [],
        }));
      };

      // menuData 为服务端获取的菜单数据
      return mappingIcon(currentMenus || []);
    },
    // 自定义 403 页面
    // unAccessible: <div>unAccessible</div>,
    ...initialState?.settings,
    pure: !!window.__POWERED_BY_QIANKUN__,
    menu: {
      ...initialState?.settings?.menu,
      loading: (!currentMenus),
    },
  };
};

export const request: RequestConfig = {
  requestInterceptors: [
    usePath,
    useAuthorization,
  ],
  responseInterceptors: [
    useFormatResult,
  ],
  errorHandler,
  errorConfig,
};

export const qiankun = {
  // 应用加载之前
  async bootstrap(props: any) {
    console.log(`bootstrap`, props)
    if(props){
      actions.setActions(initGlobalState())
      actions.setGlobalState(props.initialState)
    }
  },
  // 应用 render 之前触发
  async mount(props: any) {
    console.log("应用 render 之前触发")
    console.log('foo mount', props);
  },
  // 应用卸载之后触发
  async unmount(props: any) {
    console.log('foo unmount', props);
  },
};
