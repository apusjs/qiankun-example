import { RequestOptionsInit, ResponseError } from "umi-request";
import { ErrorShowType } from "@@/plugin-request/request";
import { message, notification } from "antd";
import { history } from "@@/core/history";
import { getAuthorization } from './authorization';
import { ApiConfig, ApiErrorMessage } from '../../config/request';

export interface RequestOptions extends RequestOptionsInit {
  showType: 0 | 1 | 4 | 9
}

/**
 * 配置request请求时的authorization
 */

export const useAuthorization = (url: string, options:  { [key: string]: any; }) => {
  const authorization = getAuthorization();
  if (authorization?.accessToken) {
    return {
      url,
      options: {
        ...options,
        headers: {
          authorization: `Bearer ${authorization.accessToken}`,
          ...options.headers,
        },
      },
    };
  }
  return { url, options };
};

/**
 * 路径前缀处理
 */
export const usePath = (path: string, options:  { [key: string]: any; }) => {
  // 判断是否是外域地址
  const url = path.indexOf('//') === 0 ? path : `${ApiConfig.BASE_PATH}${path}`;
  return {
    url,
    ...options
  };
};

/**
 * 响应处理
 */
export const  useFormatResult = async (response: Response, options: RequestOptions) => {
  const data = await response.clone().json();
  // 判断状态是否被标记为成功
  if (data[ApiConfig.SUCCESS]) {
    return data[ApiConfig.DATA];
  }
  // 判断是否配置错误显示类型
  const { showType } = options
  if (typeof showType === 'number' ) {
    throw {...data, showType}
  }
  throw data
};

/**
 * 异常处理程序
 */
export const errorHandler = (error: ResponseError) => {
  // @ts-ignore
  if (error?.request?.options?.skipErrorHandler) {
    throw error;
  }
  let errorInfo: any | undefined;
  if (error.name === 'ResponseError' && error.data && error.request) {
    errorInfo = error.data;
    error.message = errorInfo?.errorMessage || error.message;
    error.data = error.data;
    error.info = errorInfo;
  }
  errorInfo = error.info || error;

  if (errorInfo) {
    const errorMessage = ApiErrorMessage[errorInfo[ApiConfig.ERROR_CODE]] || errorInfo[ApiConfig.ERROR_MESSAGE];
    const errorCode = errorInfo[ApiConfig.ERROR_CODE];
    const {errorPage} = errorConfig;

    switch (errorInfo?.showType) {
      case ErrorShowType.SILENT:
        // do nothing
        break;
      case ErrorShowType.WARN_MESSAGE:
        message.warn(errorMessage);
        break;
      case ErrorShowType.ERROR_MESSAGE:
        message.error(errorMessage);
        break;
      case ErrorShowType.NOTIFICATION:
        notification.open({
          message: errorMessage,
        });
        break;
      case ErrorShowType.REDIRECT:
        // @ts-ignore
        history.push({
          pathname: errorPage,
          query: { errorCode, errorMessage },
        });
        // redirect to error page
        break;
      default:
        message.error(errorMessage);
        break;
    }
  } else {
    message.error(error.message || 'Request error, please retry.');
  }
  throw error;
};

export const errorConfig = {
  errorPage: ApiConfig.ERROR_PAGE,
  adaptor: (res: { [x: string]: any; }) => {
    return {
      ...res,
      errorCode: res[ApiConfig.ERROR_CODE],
      errorMessage: res[ApiConfig.ERROR_MESSAGE],
    };
  },
};
