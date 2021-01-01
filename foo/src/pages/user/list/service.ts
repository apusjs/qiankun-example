import { request } from 'umi';
import { TableListParams, TableListItem } from './data.d';
import { formatListParams } from "@/common/helpers/service.helper";

export async function queryRule(params?: TableListParams) {
  return request('/user', {
    params: formatListParams(params)
  });
}

export async function removeRule(params: { key: number[] }) {
  return request('/api/rule', {
    method: 'POST',
    data: {
      ...params,
      method: 'delete',
    },
  });
}

export async function addRule(params: TableListItem) {
  return request('/user', {
    method: 'POST',
    data: params
  });
}

export async function updateRule(params: TableListParams) {
  return request('/user', {
    method: 'PUT',
    data: params
  });
}
