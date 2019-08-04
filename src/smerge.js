const deepmerge = (target, src, mergeArrays) => {
  mergeArrays = mergeArrays || false;
  const array = Array.isArray(src);
  let dst = array && [] || {};
  if (src === null || src instanceof Date) {
    return src;
  }
  if (array) {
    let arrTarget = typeof target === 'undefined' ? [] : target;
    switch (src[0]) {
      case '$function': {
        dst = src[1](target);
        break;
      }
      case '$set': {
        dst = src[1];
        break;
      }
      case '$push': {
        arrTarget.push(src[1]);
        dst = arrTarget;
        break;
      }
      case '$unshift': {
        arrTarget.unshift(src[1]);
        dst = arrTarget;
        break;
      }
      case '$concat': {
        arrTarget = arrTarget.concat(src[1]);
        dst = arrTarget;
        break;
      }
      default: {
        if (mergeArrays && Array.isArray(arrTarget)) {
          dst = dst.concat(arrTarget);
        }
        src.forEach(function (e, i) {
          if (typeof dst[i] === 'undefined') {
            dst[i] = e;
          } else if (typeof e === 'object') {
            dst[i] = deepmerge(arrTarget[i], e, mergeArrays);
          } else {
            if (arrTarget.indexOf(e) === -1) {
              dst.push(e);
            }
          }
        });
      }
    }
  } else {
    if (target === null || typeof target === 'undefined') {
      return src;
    } else {
      if (typeof target === 'object') {
        dst = Object.assign({}, dst, target);
      }
      Object.keys(src).forEach(function (key) {
        if (typeof src[key] !== 'object') {
          dst[key] = src[key];
        } else {
          if (!target.hasOwnProperty(key)) {
            dst[key] = src[key];
          } else {
            dst[key] = deepmerge(target[key], src[key], mergeArrays);
          }
        }
      });
    }
  }
  return dst;
};
const smerge = (target, source, mergeArrays) => {
  if (typeof source === 'undefined') {
    return target;
  }
  if (source.constructor === Array) {
    if (source.length === 2) {
      let path = source[0];
      let parts = path.split('.');
      let part = '';
      let newRoot = deepmerge(target, {}, mergeArrays);
      let newRootSection = newRoot;
      while (parts.length > 0) {
        part = parts.shift();
        if (typeof newRootSection[part] === 'undefined') {
          newRootSection[part] = {};
        }
        if (parts.length === 0) {
          newRootSection[part] = smerge(newRootSection[part], source[1], mergeArrays);
        }
        newRootSection = newRootSection[part];
      }
      return newRoot;
    } else {
      return source.length === 0 ? {} : source[0];
    }
  }
  return deepmerge(target, source, mergeArrays);
};
module.exports = smerge;
