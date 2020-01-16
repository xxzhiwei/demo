import fetch from './fetch'

export const Factory = params => fetch(params).catch(error => Promise.reject(error))
