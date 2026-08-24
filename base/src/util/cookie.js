/**
 * 设置cookie
 * @param name cookie的名称
 * @param value cookie的值
 * @param day cookie的过期时间
 */
export function setCookie(name, value, day) {
  if (day !== 0) {
    const expires = day * 24 * 60 * 60 * 1000;
    const exp = new Date(new Date().getTime() + expires);
    document.cookie = `${name}=${value};expires=${exp.toUTCString()};path=/`;
  } else {
    document.cookie = `${name}=${value};path=/`;
  }
}

/**
 * 获取对应名称的cookie
 * @param name cookie的名称
 * @returns {null} 不存在时，返回null
 */
export function getCookie(name) {
  const reg = new RegExp(`(^| )${name}=([^;]*)(;|$)`);
  const arr = document.cookie.match(reg);
  if (arr) {
    return arr[2];
  }
  return null;
}

// 清除cookie
export function clearCookie(name) {
  const exp = new Date();
  exp.setTime(exp.getTime() - 1);
  const value = getCookie(name);
  if (value) {
    document.cookie = `${name}=;expires=${exp.toUTCString()};path=/`;
  }
}
