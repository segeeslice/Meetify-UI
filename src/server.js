/*
 * Various utility methods for use in connection with the server
 * (NOTE: Not yet supported or used)
 */

// const axios = require('axios')
import axios from 'axios'
import jQuery from 'jquery'

// Always send with credentials to ensure cookies are sent/received
axios.defaults.withCredentials = true

const SERVER_URL = 'http://localhost:8000'

const ENDPOINTS = {
  login: ['user', 'login']
}

// Nabs any cookie (that's not http-only) from the browser
// https://stackoverflow.com/questions/50732815/how-to-use-csrf-token-in-django-restful-api-and-react
const getCookie = (name) => {
  var cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    var cookies = document.cookie.split(';');
    for (var i = 0; i < cookies.length; i++) {
      var cookie = jQuery.trim(cookies[i]);
      if (cookie.substring(0, name.length + 1) === (name + '=')) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

export const getCsrfToken = () => getCookie('csrftoken')
export const getSessionId = () => getCookie('sessionid')

// joinUrl('www.some.link', 'sub', 'path') = 'www.some.link/sub/path'
const joinUrl = (URL, ...args) => {
  return URL + (URL.endsWith('/') ? '' : '/') + args.join('/')
}

// getUrlQuery({key: 'value'}) = '?key=value'
// NOTE: May not need
const getUrlQuery = (o) => {
  return '?' + Object.keys(o).map(k => `${k}=${o[k]}`).join('&')
}

export const getPlaylistIntersect = (userId1, userId2) => {
  const query = getUrlQuery({ target: userId1, target2: userId2 })
  const urlPath = joinUrl(SERVER_URL, 'polls', 'intersection', query)

  return axios.get(urlPath, { mode: 'no-cors' })
    .then((r) => {
      return r
    }).catch((e) => {
      return e
    })
}

export const login = ({ username, email, password }) => {
  const urlPath = joinUrl(SERVER_URL, ...ENDPOINTS.login)
  const dataToSend = {
    Username: username,
    Password: password,
  }

  return axios.post(urlPath, dataToSend)
    .then(async (r) => {
      if (r.status >= 300)
        throw Error(`Received status ${r.status} from server`)
      else if (!r.data || !r.data.fields)
        throw Error (`Received no data from server`)
      else return {
        username: r.data.fields.username
      }
    }).catch((e) => {
      throw e
    })
}

// TODO: Test db here to actually apply changes
export const sendMessage = async ({userFrom, userTo, date, text}) => {
  return new Promise(resolve => setTimeout(() => {
    resolve()
  }, 2000))
}
