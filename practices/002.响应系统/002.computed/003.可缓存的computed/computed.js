// page 68
import { effect } from './proxy.js';

/**
 * 计算属性
 * @param {Function} getter 包含依赖项的计算函数
 * @returns {{readonly value: *}|*}
 */
function computed(getter) {
  // +++ 用于缓存计算值
  let value;
  // +++ 用于判断是否需要更新计算值
  let dirty = true;
  // 生成延迟计算结果的effect
  const effectFn = effect(getter, {
    // +++ 在调用副作用前，将值设置为dirty
    scheduler() {
      // +++ 当读取或设置依赖项时，将dirty设置为true，以便再次读取计算值时更新
      dirty = true;
    },
    // lazy为true，手动调用副作用
    lazy: true,
  });

  // 拦截对象的value属性，当读取value时返回计算结果
  const obj = {
    get value() {
      // +++ 如果值脏了（首次计及后续依赖更新），更新计算值
      if (dirty) {
        // +++ 缓存计算值
        value = effectFn();
        // +++ value已被更新，重置dirty的值
        dirty = false;
      }
      // *** 返回计算结果
      return value;
    }
  };

  // 返回拦截后的对象
  return obj;
}

export { computed };
