<template>
  <div class="wrapper-file-upload">
    <div class="header">
      <p class="title">文件上传</p>
      <span>支持分片、断点上传</span>
    </div>
    <input type="file" @change="onChange" />
    <div>
      <el-button type="text" @click="handleUpload">上传</el-button>
      <el-button type="text" @click="onPause">暂停</el-button>
      <el-button type="text" @click="onResume">恢复</el-button>
    </div>
    <div>
      <div>计算文件hash进度</div>
      <el-progress :percentage="hashPercentage"></el-progress>
      <div>总进度</div>
      <el-progress :percentage="fakeUploadPercentage"></el-progress>
    </div>
    <el-table :data="chunkData" style="width: 100%">
      <el-table-column
        prop="hash"
        label="切片hash" align="center">
      </el-table-column>
      <el-table-column
        label="大小(KB)" align="center" width="120">
        <template slot-scope="{ row }">
          {{(row.size / 1000/*1000?1024? byte=1kb*/).toFixed(2)}}
        </template>
      </el-table-column>
      <el-table-column
        label="进度">
        <template slot-scope="{ row }">
          <el-progress :percentage="row.percentage" color="#6495ED" />
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { Factory as xFetch } from '@/api'
import { CancelToken } from '@/api/fetch'

const CHUNK_COUNT = 10 // 切片数量

export default {
  data() {
    return {
      container: {
        file: null,
        worker: null,
        hash: ''
      },
      hashPercentage: 0,
      fakeUploadPercentage: 0,
      chunkData: [],
      serveChunkData: [],
      requestExecutors: [],
      uploadSuccessfulCount: 0 // 上传成功的切片
    }
  },
  computed: {
    uploadPercentage() {
      const { chunkData, container: { file } } = this
      if (!chunkData.length) return 0
      const loaded = chunkData.map(item => item.size * item.percentage).reduce((accumulator, currentValue) => accumulator + currentValue)
      return parseInt((loaded / file.size).toFixed(2))
    },
  },
  watch: {
    uploadPercentage(newVal) {
      if (newVal > this.fakeUploadPercentage) {
        this.fakeUploadPercentage = newVal
      }
    },
  },
  methods: {
    onChange(e) {
      // 获取input中的第一个文件
      const [file] = e.target.files
      // Object.assign(this.$data, this.$options.data()); -> 重制?
      this.container.file = file
    },
    onProgress(targetChunk) {
      return (progressEvent) => {
        const percentage = parseInt(progressEvent.loaded / progressEvent.total * 100)
        // 假的进度条, 不让进度条后退
        targetChunk.percentage = percentage < targetChunk.percentage ? targetChunk.percentage : percentage
      }
    },
    // 暂停
    onPause() {
      for (const executor of this.requestExecutors) {
        executor('pause')
      }
      this.uploadSuccessfulCount = 0
      this.requestExecutors = []
    },
    // 恢复
    async onResume() {
      const verifyRes = await xFetch({
        url: 'http://localhost:3000/verify',
        method: 'post',
        data: {
          filename: this.container.file.name,
          fileHash: this.container.hash
        },
      })
      const { data: serveChunkData = [] } = verifyRes
      this.serveChunkData = serveChunkData
      this.uploadChunk()
    },
    async mergeChunks(filename, fileHash) {
      await xFetch({
        url: 'http://localhost:3000/merge',
        data: {
          filename,
          fileHash
        },
        method: 'post',
        headers: {
          'Content-Type': 'application/json'
        },
      })
    },
    /**
     * 将单个文件按计算出来的size进行切割
     */
    createFileChunk(file, count=CHUNK_COUNT) {
      const fileChunks = []
      const chunkSize = Math.ceil(file.size / count)
      let index = 0
      while (index < file.size) {
        let temp = index + chunkSize // 用于临时存储size位置的变量
        fileChunks.push({ file: file.slice(index, temp)}) // 将file按区间[index, temp]进行切割, 并存入变量
        index = temp
      }
      return fileChunks
    },
    // 上传后, 返回是否合并的标示
    async uploadChunk() {
      const { chunkData, serveChunkData, requestExecutors, uploadResult, container } = this
      const requests = chunkData
        .filter(item => !serveChunkData.includes(item.hash))
        .map((item) => {
          const formData = new FormData()
          formData.append('chunk', item.chunk)
          formData.append('hash', item.hash)
          formData.append('filename', item.chunkName)
          formData.append('fileHash', item.fileHash)
          // formData.append('size', item.size)
          return { formData, origin: item }
        })
        .map(({ formData, origin }) => xFetch({
          url: 'http://localhost:3000',
          method: 'post',
          data: formData,
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          onUploadProgress: this.onProgress(chunkData.find(item => item.hash === origin.hash)), // 读取chunkData中对应的chunk(引用数据类型)
          cancelToken: new CancelToken(function executor(c) {
            requestExecutors.push(c)
          })
        }).then(res => {
          if (res.code === 0) {
            // uploadResult.push(true)
            this.uploadSuccessfulCount += 1
          }
        }).catch(error => {
          // console.log(error);
          if (error.message === 'pause') {
            // uploadResult.push(false)
          }
        }))
      // 上传成功的切片 + 服务端返回的切片 = 所有切片数量时
      await Promise.all(requests)
      if (this.uploadSuccessfulCount + serveChunkData.length === chunkData.length) {
        this.mergeChunks(container.file.name, container.hash)
      }
    },
    // 在上传前, 获取上传文件是否已存在服务端
    async handleUpload() {
      const { file } = this.container
      const fileChunks = this.createFileChunk(file)
      const hash = await this.calculateHash(fileChunks)
      this.container.hash = hash
      const verifyRes = await xFetch({
        url: 'http://localhost:3000/verify',
        method: 'post',
        data: {
          filename: file.name,
          fileHash: hash
        },
      })
      // 表示文件已存在
      const { code, data: serveChunkData = [] } = verifyRes
      if (verifyRes.code === 0) {
        console.log('秒传成功!');
        return
      }
      this.serveChunkData = serveChunkData
      this.chunkData = fileChunks.map((item, index) => {
        const chunkHash = `${hash}-${index}`
        return {
          fileHash: hash,
          chunk: item.file,
          hash: chunkHash,
          chunkName: file.name,
          percentage: serveChunkData.includes(chunkHash) ? 100 : 0,
          size: item.file.size // 读取到的size应该是字节吧
        }
      })
      await this.uploadChunk()
    },
    /**
     * 根据文件内容计算hash(断点传输需要)
     * 因为根据内容计算hash, 需要一定的时间, 特别是大文件的时候, 读取文件内容计算hash是非常耗费时间, 可能会造成UI卡住无响应, 所以这里使用worker线程计算hash, 让用户仍然可以在页面正常交互
     */
    calculateHash(fileChunks) {
      return new Promise((resolve, reject) => {
        this.container.worker = new Worker('/hash.js') // 需要放在与index.html同一级目录(*public, worker不允许跨域)
        this.container.worker.postMessage({ fileChunks })
        this.container.worker.onmessage = e => {
          const { percentage, hash } = e.data
          // 不断接收hash计算进度, 知道hash计算完毕后才resolve
          this.hashPercentage = percentage
          if (hash) {
            resolve(hash)
          }
        }
      })
    },
  },
}
</script>

<style lang="stylus" scoped>
.wrapper-file-upload
  padding 20px
  .header
    margin-bottom 10px
  .title
    font-size 28px
    margin-bottom 5px
</style>