import { request } from 'umi';

export async function queryMenus() {
  return request<API.CurrentMenus>('/menu');
}
