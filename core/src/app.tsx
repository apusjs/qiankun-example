import React, { useState }  from 'react';
import type { Settings as LayoutSettings } from '@ant-design/pro-layout';
import { PageLoading } from '@ant-design/pro-layout';
import type { RequestConfig, RunTimeLayoutConfig} from 'umi';
import { history, useModel } from 'umi';
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
import { query } from '@/services/apps';

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
};

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
      const data = await queryCurrent();
      // TODO 需要增加用户角色管理
      data.access = 'admin'
      return data;
    } catch (error) {
      replaceLogin();
    }
    return undefined;
  };

  const fetchMenus = async () => {
    try {
      return await queryMenus();
    } catch (error) {
      console.error(error);
      replaceLogin();
    }
    return undefined;
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

export const qiankun = async () => {
  const apps = await query()
    .then((res= []) => {
      return res.data?.map((item: any)=>{
        return {
          ...item,
        };
      });
    });
  return {
    // 注册子应用信息
    apps,
  };
}

export function useQiankunStateForSlave() {
  const { initialState } = useModel('@@initialState')
  const [spaGlobalState, setSpaGlobalState] = useState({ name: 'admin', password: '' });
  return {
    initialState,
    spaGlobalState,
    setSpaGlobalState
  }
}
