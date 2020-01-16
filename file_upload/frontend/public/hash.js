self.importScripts('/spark-md5.min.js') // 导入脚本

self.onmessage = function (e) {
  const { fileChunks } = e.data
  const spark = new self.SparkMD5.ArrayBuffer()
  let percentage = 0
  let count = 0
  function loadNext(index) {
    const reader = new FileReader()
    reader.readAsArrayBuffer(fileChunks[index].file)
    reader.onload = e => {
      count++
      spark.append(e.target.result)
      if (count === fileChunks.length) {
        self.postMessage({
          percentage: 100,
          hash: spark.end()
        })
        self.close()
      } else {
        percentage += 100 / fileChunks.length
        // 不断向另一边传递信息
        self.postMessage({
          percentage
        })
        loadNext(count)
      }
    }
  }
  loadNext(0)
}
