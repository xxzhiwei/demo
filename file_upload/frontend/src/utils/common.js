const handler = {
  base64: 'readAsDataURL',
  buffer: 'readAsArrayBuffer',
}

/**
 * file格式转换为其他格式
 * @param {any} file 
 * @param {string} format 
 * @returns {Promise<any>}
 */
export const fileTransform = (file, format='base64') => {
  return new Promise(resolve => {
    const fileReader = new FileReader()
    fileReader.onloadend = res => {
      resolve(res.target.result)
    }
    fileReader[handler[format]](file)
  })
}
/**
 * Compare the value in object dataOne and dataTwo, return a boolean
 * @param {Object} dataOne 
 * @param {Object} dataTwo 
 */
export function compareData(dataOne, dataTwo) {
  let isEqual = true
  handler(dataOne, dataTwo)
  function handler(_dataOne, _dataTwo) {
    if (!isEqual) {
      return
    }
    for (const key in _dataOne) {
      if (typeof _dataOne[key] === 'string') {
        if (_dataOne[key] !== _dataTwo[key]) {
          return isEqual = false
        }
      } else if (Object.prototype.toString.call(_dataOne[key]).replace(/(.*?)\s(\w+).+/, '$2') === 'Object') {
        handler(_dataOne[key], _dataTwo[key])
      }
    }
  }
  return isEqual
}
