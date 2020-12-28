import { request } from 'umi';
import { MenuList } from './data.d';

export async function addMenu(params?: MenuList) {
  return request('/menu', {
    method: 'POST',
    data: params,
  });
}

export async function removeMenu(params?: MenuList) {
  return request('/menu', {
    method: 'DELETE',
    data: params,
  });
}

export async function updateMenu(params?: MenuList) {
  return request('/menu', {
    method: 'PUT',
    data: params,
  });
}

export async function queryMenus(params?: MenuList) {
  return request('/menu', {
    params,
  });
}
