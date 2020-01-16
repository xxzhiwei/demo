/**
 * 基本配置
 */
import axios from 'axios'
// import store from '@/store'
// import { Loading, Message } from 'element-ui'

const { FETCH_URL } = process.env

const baseConfig = {
  baseURL: FETCH_URL,
  timeout: 20000,
  headers: {
    'Content-Type': "application/json",
  }
}
const instance = axios.create(baseConfig)
// let loadingInstance = null
// const loadingConfig = {
//   open: true,
//   lock: true,
//   text: '数据加载中...',
//   spinner: 'el-icon-loading',
// }

instance.interceptors.request.use(
  config => {
    // loadingInstance = Loading.service(loadingConfig)
    // const token = store.getters.token
    // token && (config.headers['Authorization'] = `Bearer ${token}`)
    return config
  },
  error => {
    // loadingInstance.close()
    Promise.reject(error)
  }
)
instance.interceptors.response.use(
  response => {
    // loadingInstance.close()
    if (response.status === 200) {
      return response.data
    } else {
      return Promise.reject(response)
    }
  },
  error => {
    // loadingInstance.close()
    // const { response } = error
    // Message.error(response.data.message || 'bad request')
    // console.log(error);
    return Promise.reject(error)
  }
)

export default instance
export const CancelToken = axios.CancelToken
