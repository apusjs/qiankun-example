const TreeDeepSearch = function (root, key, children, name) {
  if (root[key] === name) {
    delete root[children]
    return [root]
  } 
    for (const item of (root[children] || [])) {
      const res = TreeDeepSearch(item, key, children, name)
      if (res.length) {
        delete root[children]
        return [...res, root]
      }
    }
    return []
  
}

export default function ({root, key, children, name}: {root: any[], key: string, children: string, name: string}) {
  let arr = []
  for (const item of (root instanceof Array) ? JSON.parse(JSON.stringify(root)) : [JSON.parse(JSON.stringify(root))]) {
    arr = TreeDeepSearch(item, key, children, name)
    if (arr.length > 0) {
      break
    }
  }
  return arr
}
