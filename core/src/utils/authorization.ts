import actions from '@/models/useGlobalState';
import { updateToken } from '@/services/login'

// use localStorage to store the authority info, which might be sent from server in actual project.
export function getAuthorization(str?: string): API.LoginStateType | undefined {
  let authorization =
    typeof str === 'undefined' ? actions.getGlobalState('authorization') || localStorage.getItem('authorization') : str;
  // authorityString could be {"accessToken":"SNNRxTb6TJ1SPkOER5MA","expiresIn":7200}
  try {
    if (typeof authorization === 'string') {
      authorization = JSON.parse(authorization);
    }
  } catch (e) {
    authorization = {};
  }

  if (authorization && typeof authorization.accessToken === 'string') {
    // 当前时间
    const nowTime = parseInt(`${new Date().getTime() / 1000  }`, 10);
    // 有效时间
    const expiryTime = authorization.timestamp + authorization.expiresIn;
    // 判断是否过期
    const isTimeout = (expiryTime - nowTime) > 300

    // 当全局数据为空时 进行缓存
    if (!actions.getGlobalState('authorization') && isTimeout) {
      actions.setGlobalState({authorization})
      updateAuthorization()
    }
    return isTimeout ? authorization : undefined;
  }
  return undefined;
}

export function setAuthorization(authorization: API.LoginStateType): void {
  const proAuthority = {
    accessToken: authorization.accessToken,
    expiresIn: authorization.expiresIn,
    timestamp: parseInt(String(new Date().getTime() / 1000), 10),
  };
  actions.setGlobalState({authorization: proAuthority})
  localStorage.setItem('authorization', JSON.stringify(proAuthority));
}

export function delAuthorization() {
  actions.setGlobalState({ authorization: undefined })
  localStorage.removeItem('authorization');
}

export function updateAuthorization(): void {
  const authorization = getAuthorization();

  // 当前时间
  const nowTime = parseInt(`${new Date().getTime() / 1000  }`, 10);
  // 有效时间
  const expiryTime = authorization.timestamp + authorization.expiresIn;
  // 计算过期时间
  const tiem = ((expiryTime - nowTime) - 600) * 1000
  setTimeout(() => {
    try {
      updateToken().then((data) => {
        setAuthorization(data)
        updateAuthorization()
      })
    } catch (e) {
      console.error(e)
    }
  }, tiem)
}
