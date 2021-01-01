export const objectKeySort = (arys: any): string => {
  // 先用 Object 内置类的 keys 方法获取要排序对象的属性名数组，再利用Array的sort方法进行排序
  const newkey = Object.keys(arys).sort();
  let newObj = ''; // 创建一个新的对象，用于存放排好序的键值对
  for (let i = 0; i < newkey.length; i++) {
    // 遍历 newkey 数组
    newObj += `${[newkey[i]]  }=${  arys[newkey[i]]  }&`;
  }
  return newObj.substring(0, newObj.length - 1);
};


export const ArraySortAscending = (p: string) => {
  return function (m: { [x: string]: any }, n: { [x: string]: any }) {
    const a = m[p] || 0
    const b = n[p] || 0
    return a - b // 升序
  }
}

export const ArraySortDescending = (p: string) => {
  return function (m: { [x: string]: any }, n: { [x: string]: any }) {
    const a = m[p] || 0
    const b = n[p] || 0
    return b - a // 降序
  }
}
