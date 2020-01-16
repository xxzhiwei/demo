const http = require('http')
const path = require('path')
const multiparty = require('multiparty')
const fse = require('fs-extra')

const server = http.createServer()
const staticPath = path.resolve(__dirname, 'static')

server.on('request', async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Headers', '*')
  res.setHeader('Content-Type', 'application/json; charset=utf-8') // 返回信息乱码问题
  if (req.method === 'OPTIONS') {
    res.status = 200
    res.end()
    return
  }
  if (req.url === '/') {
    const multipart = new multiparty.Form()
    multipart.parse(req, async (error, fields, files) => {
      if (error) {
        return console.error(error)
      }
      const [chunk] = files.chunk
      const [hash] = fields.hash
      const [fileHash] = fields.fileHash
      // const [size] = fields.size
      const chunkDir = `${staticPath}/${fileHash}`
      if (!fse.existsSync(chunkDir)) {
        await fse.mkdirs(chunkDir) // ensureDir(chunkDir) 创建目录
      }
      // 对比(size)数据是否完整, 不完整就丢掉
      const chunkPath = `${chunkDir}/${hash}`
      await fse.move(chunk.path, chunkPath) // 将chunk从临时文件夹移动到指定文件夹
      res.end(
        JSON.stringify({
          code: 0,
          data: hash,
          message: 'ok!'
        })
      )
      // fse.stat(chunkPath, (error, stats) => {
      //   if (error) {
      //     return res.end(
      //       JSON.stringify({
      //         code: 1,
      //         message: '服务器发生错误!'
      //       })
      //     )
      //   }
      //   if (+size === stats.size) {
      //     res.end(
      //       JSON.stringify({
      //         code: 0,
      //         data: hash,
      //         message: 'ok!'
      //       })
      //     )
      //   } else {
      //     fse.remove(chunkPath).catch(error => console.log(error))
      //     res.end(
      //       JSON.stringify({
      //         code: 1,
      //         data: hash,
      //         message: '传输数据丢失, 已删除该切片'
      //       })
      //     )
      //   }
      // })
    })
  }
  if (req.url === '/merge') {
    const { filename, fileHash } = await getRequestData(req)
    await mergeFileChunk(staticPath, filename, fileHash)
    res.end(
      JSON.stringify({
        code: 0,
        message: '文件合并成功!'
      })
    )
  }
  if (req.url === '/verify') {
    await verifyFile(req, res)
  }
})

// 获取请求参数
function getRequestData(req) {
  return new Promise(resolve => {
    let joinChunk = ''
    req.on('data', chunk => {
      joinChunk += chunk
    })
    req.on('end', () => {
      resolve(JSON.parse(joinChunk))
    })
  })
}

// 合并文件
async function mergeFileChunk(staticPath, filename, fileHash) {
  const chunkDir = `${staticPath}/${fileHash}`
  const filePath = `${staticPath}/${fileHash}${path.extname(filename)}` // 按照该路径创建文件
  await fse.writeFile(filePath, '') // 创建一个(同名)文件
  const chunkNames = await fse.readdir(chunkDir) // 读取chunk文件夹
  for (const chunkName of chunkNames) {
    const chunkPath = `${chunkDir}/${chunkName}`
    fse.appendFileSync(filePath, fse.readFileSync(chunkPath)) // 将chunk中的内容加入文件
    fse.unlinkSync(chunkPath) // 删除一个名称及其引用的文件(即每个chunk)
  }
  fse.rmdirSync(chunkDir) // 删除chunk文件夹
}

/**
 * 验证文件是否存在 
 * - 若整个文件已存在服务端, 返回一个标示给前端, 此时不需要上传了
 * - 若存在已上传的切片, 则把切片名称返回给前端, 此时前端应该跳过上传这些切片
 */
async function verifyFile(req, res) {
  const requestData = await getRequestData(req)
  const { filename, fileHash } = requestData
  const ext = path.extname(filename)
  const joinFileName = `${staticPath}/${fileHash}${ext}` // 尝试读取该名称的文件
  const isExist = await fse.existsSync(joinFileName)
  if (isExist) {
    res.end(
      JSON.stringify({
        code: 0,
        message: '文件已存在!'
      })
    )
  } else {
    // 尝试读取chunk
    const chunkDir = `${staticPath}/${fileHash}`
    const chunks = fse.existsSync(chunkDir) ? await fse.readdirSync(`${staticPath}/${fileHash}`) : []
    res.end(
      JSON.stringify({
        code: 1,
        message: chunks.length ? '文件不存在, 但是有部分切片' : '文件不存在, 也没有切片', 
        data: chunks,
      })
    )
  }
}

server.listen(3000, () => {
  console.log('Server listen on 3000.');
})
