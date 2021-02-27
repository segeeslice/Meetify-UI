/*
 * Various utility methods for use in connection with the server
 * (NOTE: Not yet supported or used)
 */

// const axios = require('axios')
import axios from 'axios'
import jQuery from 'jquery'

import {
  checkValidUsername,
  checkValidEmail,
  checkValidPassword,
  cleanEmptyKeys,
} from './util'

// Always send with credentials to ensure cookies are sent/received
axios.defaults.withCredentials = true

// === CONSTANTS ===

const SERVER_URL = 'http://localhost:8000'

const ENDPOINTS = {
  login: ['user', 'login'],
  signup: ['user', 'signup'],
  profile: ['user', '{id}', 'profile'],
  linkSpotifyAccount: ['user', 'link-account'],
  checkSpotifyLinked: ['user', 'is-linked'],
  getPotentialMatches: ['matching', 'potential-matches'],
  getAcceptedMatches: ['matching', 'accepted-matches'],
}

// === INTERVAL(S) ===

let spotifyLinkedInterval = null

// === UTIL METHODS ===

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

// TODO: Central "handleResponse" message to parse axios responses

// joinUrl('www.some.link', 'sub', 'path') = 'www.some.link/sub/path'
const joinUrl = (URL, ...args) => {
  return URL + (URL.endsWith('/') ? '' : '/') + args.join('/')
}

// getUrlQuery({key: 'value'}) = '?key=value'
// NOTE: May not need
const getUrlQuery = (o) => {
  return '?' + Object.keys(o).map(k => `${k}=${o[k]}`).join('&')
}

// === EXPORTED METHODS ===

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

// NOTE: Currently doesn't use email... should allow either in the future?
export const login = async ({ username, email, password }) => {
  const urlPath = joinUrl(SERVER_URL, ...ENDPOINTS.login)
  const dataToSend = {
    Username: username,
    Password: password,
  }

  return axios.post(urlPath, dataToSend)
    .then(async (r) => {
      if (r.status >= 300)
        throw Error(`Received status ${r.status} from server`)
      else if (!r.data)
        throw Error (`Received no data from server`)
      else return {
        username: r.data.username,
        userId: r.data.id,
      }
    }).catch((e) => {
      throw e
    })
}

export const signup = async ({ username, email, password }) => {
  if (!checkValidUsername(username)) throw Error (`Invalid registration username: ${email}`)
  if (!checkValidEmail(email)) throw Error (`Invalid registration email: ${email}`)
  if (!checkValidPassword(password)) throw Error (`Invalid registration email`)

  const urlPath = joinUrl(SERVER_URL, ...ENDPOINTS.signup)
  const defaultDisplayName = email.split('@')[0]

  const dataToSend = {
    Username: username,
    Email: email,
    Password: password,
    DisplayName: defaultDisplayName,
    ZipCode: null,
    ProfilePic: null,
  }

  return axios.post(urlPath, dataToSend)
    .then((r) => ({}))
    .catch((e) => {
      if (e.hasOwnProperty('response')) {
        if (!e.response) {
          const newErr = Error('Please check your connection and try again.')
          newErr.name = 'CouldNotConnect'
          throw newErr

        } else if (e.response.status === 409) {
          throw Error('Could not create account: That username is already taken!')
        }
      } else {
        throw e
      }
    })
}

export const getProfile = async({ userId }) => {
  const baseUrl = joinUrl(SERVER_URL, ...ENDPOINTS.profile)
  const urlPath = baseUrl.replace('{id}', userId)

  return axios.get(urlPath)
    .then((r) => {
      if (r.status >= 300)
        throw Error(`Received status ${r.status} from server`)
      else if (!r.data)
        throw Error (`Received no profile data from server`)
      else return {
        displayName: r.data.DisplayName,
        profilePicUrl: r.data.ProfilePic,
        description: r.data.Description,
      }
    }).catch((e) => {
      throw e
    })
}

export const editProfile = async({ userId, changes }) => {
  const baseUrl = joinUrl(SERVER_URL, ...ENDPOINTS.profile)
  const urlPath = baseUrl.replace('{id}', userId)

  const {
    description,
    displayName,
    profilePicUrl,
  } = changes

  const dataToSend = cleanEmptyKeys({
    Description: description,
    DisplayName: displayName,
    ProfilePic: profilePicUrl,
  })

  return axios.post(urlPath, dataToSend)
    .then((r) => {
      console.log(r)
      if (r.status >= 300)
        throw Error(`Received status ${r.status} from server`)
      else if (!r.data)
        throw Error (`Received no profile data from server`)
      else return {
        displayName: r.data.DisplayName,
        profilePicUrl: r.data.ProfilePic,
        description: r.data.Description,
      }
    })
    .catch((e) => {
      if (e.hasOwnProperty('response')) {
        if (!e.response) {
          const newErr = Error('Please check your connection and try again.')
          newErr.name = 'CouldNotConnect'
          throw newErr
        } else if (e.response.status === 401) {
          throw Error('Could not update. Please login and try again.')
        }
      } else {
        throw e
      }
    })
}

export const linkSpotifyAccount = async ({ userId }) => {
  const urlPath = joinUrl(SERVER_URL, ...ENDPOINTS.linkSpotifyAccount)

  return axios.get(urlPath)
    .then((r) => {
      if (r.status >= 300)
        throw Error(`Received status ${r.status} from serer`)
      else if (!r.data)
        throw Error(`Received no Spotify link URL from server`)
      else return {
        url: r.data
      }
    })
    .catch((e) => {
      throw e
    })
}

export const checkSpotifyLinked = async ({ userId }) => {
  const urlPath = joinUrl(SERVER_URL, ...ENDPOINTS.checkSpotifyLinked)

  return axios.get(urlPath)
    .then((r) => {
      if (r.status >= 300)
        throw Error(`Received status ${r.status} from serer`)
      else if (!r.data || r.data.IsLinked === null || r.data.IsLinked === undefined)
        throw Error(`Received no Spotify link check from server`)
      else return {
        spotifyLinked: r.data.IsLinked
      }
    })
    .catch((e) => {
      throw e
    })
}

// Gives access to two methods for repeatedly checking for Spotify link status
// To be used in tandem with the link at linkSpotifyAccount()
export const waitUntilSpotifyLinked = {
  start: async ({ userId }) => {
    clearInterval(spotifyLinkedInterval)

    let iters = 0
    const maxIters = 100
    const delay = 2000

    return new Promise ((resolve, reject) => {
      spotifyLinkedInterval = setInterval(() => {
        // Log on each iteration just to be 200% sure we stop this interval
        console.log('Checking if Spotify linked...')

        if (!spotifyLinkedInterval) reject('Cancelled')

        checkSpotifyLinked({ userId })
          .then(({spotifyLinked}) => {
            if (spotifyLinked === true) {
              clearInterval(spotifyLinkedInterval)
              resolve({ spotifyLinked })

            } else {
              iters = iters + 1

              if (iters > maxIters) {
                clearInterval(spotifyLinkedInterval)
                reject('Timed out')
              }
            }
          })
          .catch((e) => {
            clearInterval(spotifyLinkedInterval)
            reject(e)
          })
      }, delay)
    })
  },
  stop: () => {
    clearInterval(spotifyLinkedInterval)
  },
}

// Central point of interface for getPotentialMatches and getAcceptedMatches,
// given their similarities
const getMatches = (url) => {
  return axios.get(url)
    .then((r) => {
      if (r.status >= 300)
        throw Error(`Received status ${r.status} from serer`)
      else if (!r.data)
        throw Error(`Received no match from server`)
      else return Promise.all(r.data.map(m => getProfile({ userId: m['matched_with'] })))
    })
    .then(async (profiles) => {
      return profiles.map(p => ({ profile: p }))
    })
    .catch((e) => {
      throw e
    })
}

export const getPotentialMatches = () => {
  const urlPath = joinUrl(SERVER_URL, ...ENDPOINTS.getPotentialMatches)
  return getMatches(urlPath)
}

export const getAcceptedMatches = () => {
  const urlPath = joinUrl(SERVER_URL, ...ENDPOINTS.getAcceptedMatches)
  return getMatches(urlPath)
    .then(async (users) => {
      // TODO: Integrate chat with server; set empty for now
      return users.map(u => ({ ...u, messages: [] }))
    })
}

// TODO: Test db here to actually apply changes
export const sendMessage = async ({userFrom, userTo, date, text}) => {
  return new Promise(resolve => setTimeout(() => {
    resolve()
  }, 2000))
}
