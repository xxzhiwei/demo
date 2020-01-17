/**
 * 基本配置
 */
import axios from 'axios'

const { FETCH_URL } = process.env

const baseConfig = {
  baseURL: FETCH_URL,
  timeout: 20000,
  headers: {
    'Content-Type': "application/json",
  }
}
const instance = axios.create(baseConfig)

instance.interceptors.request.use(
  config => {
    return config
  },
  error => {
    Promise.reject(error)
  }
)
instance.interceptors.response.use(
  response => {
    if (response.status === 200) {
      return response.data
    } else {
      return Promise.reject(response)
    }
  },
  error => {
    return Promise.reject(error)
  }
)

export default instance
export const CancelToken = axios.CancelToken
