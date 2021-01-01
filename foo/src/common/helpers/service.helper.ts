export const formatListParams = (params:any = {}) => {
  const keys = {
    traceId: `${new Date().getTime()}`
  }
  Object.keys(params).forEach((v) => {
    if (v !== 'pageSize' && v !== 'current' && v !== 'sorter' && v !== 'filter') {
      keys[v] = params[v]
    }
  })
  const pageSize = params?.pageSize;
  const current = params?.current;
  const fieldSort = Object.keys(params.sorter)[0];
  const order = params.sorter[fieldSort] === 'ascend' ? 'ASC' : 'DESC';

  return {
    ...keys,
    pageSize,
    current,
    fieldSort,
    order,
  }
}
