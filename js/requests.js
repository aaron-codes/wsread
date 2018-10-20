import queryString from 'query-string';
import { Toast } from 'antd-mobile-rn';

import config from './config'

const parseJSON = (response) => {
  if (response) {
    try {
      return response.json()
    } catch (e) {
      return null
    }
  }
  return null
}

const checkStatus = (response) => {
    if (response) {
      return response
    }
}

const headers = {
  'x-platform': config.platform,
  'x-version': config.version,
  'Accept': 'application/json',
  'Content-Type': 'application/json',
}

const requests = {
  async get(url, params) {
    if (params) {
      url += `?${queryString.stringify(params)}`
    }
    try {
      return fetch(url, {
          headers,
          credentials: 'include'
      }).then(checkStatus).then(parseJSON)
    } catch (e) {
      throw new Error('发生错误')
    }
  },

  async post(url, params, payload) {
    if (params) {
      url += `?${queryString.stringify(params)}`
    }

    try {
      return fetch(url, {
          headers,
          method: 'POST',
          credentials: 'include',
          body: JSON.stringify(payload),
      }).then(checkStatus).then(parseJSON)
    } catch (e) {
        throw new Error('发生错误')
    }
  },

  async put(url, params, payload) {
    if (params) {
      url += `?${queryString.stringify(params)}`
    }
    try {
      return fetch(url, {
          headers,
          method: 'PUT',
          credentials: 'include',
      }).then(checkStatus).then(parseJSON)
    } catch (e) {
        throw new Error('发生错误')
    }
  },

  async del(url, params, payload) {
    if (params) {
      url += `?${queryString.stringify(params)}`
    }
    try {
      return fetch(url, {
          headers,
          method: 'DELETE',
          credentials: 'include',
      }).then(checkStatus).then(parseJSON)
    } catch (e) {
        throw new Error('发生错误')
    }
  }
}

export default requests
