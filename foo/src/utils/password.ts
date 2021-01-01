/**
 *简单验证密码强度
 *必须包含数字、小写字母、大写字母、特殊字符 其三
 *如果返回值小于3 则说明密码过于简单
 *
 * * */

export const CheckPasswordSecurity = (s: string = ''): number => {

  if (s.length < 6) {
    return 0;
  }

  let ls = 0;
  if (s.length > 8) {
    ls += 1
  }
  if (s.match(/([a-z])+/)) {
    ls += 1
  }
  if (s.match(/([0-9])+/)) {
    ls += 1
  }
  if (s.match(/([A-Z])+/)) {
    ls += 1
  }
  if (s.match(/[^a-zA-Z0-9]+/)) {
    ls += 1
  }
  return ls

}
