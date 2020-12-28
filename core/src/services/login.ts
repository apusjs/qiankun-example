import { request } from 'umi';

export type LoginParamsType = {
  userName: string;
  password: string;
  mobile: string;
  captcha: string;
  type: string;
};

export async function fakeAccountLogin(params: LoginParamsType) {
  return request<API.LoginStateType>('/auth/login', {
    method: 'POST',
    data: params,
  });
}

export async function updateToken() {
  return request('/auth/updateToken');
}

export async function getFakeCaptcha(mobile: string) {
  return request(`/login/captcha?mobile=${mobile}`);
}

export async function outLogin() {
  return request('/auth/outLogin');
}
