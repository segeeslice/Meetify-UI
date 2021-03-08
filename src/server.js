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
axios.defaults.xsrfHeaderName = 'X-CSRFToken'

// === CONSTANTS ===

const SERVER_URL = 'http://localhost:8000'

const ENDPOINTS = {
  login: ['user', 'login'],
  logout: ['user', 'logout'],
  signup: ['user', 'signup'],
  profile: ['user', '{id}', 'profile'],
  linkSpotifyAccount: ['user', 'link-account'],
  checkSpotifyLinked: ['user', 'is-linked'],
  getPotentialMatches: ['matching', 'potential-matches'],
  getAcceptedMatches: ['matching', 'accepted-matches'],
  rejectMatch: ['matching', 'reject-match'],
  acceptMatch: ['matching', 'accept-match'],
  messages: ['chat', 'messages?match={match_id}'],
  userSongIntersection: ['intersection', 'liked-songs'],
  syncProfilePic: ['user', 'update-profile-pic'],
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
    })
    // Do any necessary synchronizations
    .then(async (user) => {
      await syncProfilePic()
      return user
    })
    .catch((e) => {
      throw e
    })
}

export const logout = async () => {
  const urlPath = joinUrl(SERVER_URL, ...ENDPOINTS.logout)

  return axios.get(urlPath)
    .then(async (r) => {
      if (r.status === 204)
        return
      else
        throw Error(`Received status ${r.status} from server`)
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
    ProfilePicURL: null,
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
        profilePicUrl: r.data.ProfilePicURL,
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
    ProfilePicURL: profilePicUrl,
  })

  return axios.post(urlPath, dataToSend)
    .then((r) => {
      if (r.status >= 300)
        throw Error(`Received status ${r.status} from server`)
      else if (!r.data)
        throw Error (`Received no profile data from server`)
      else return {
        displayName: r.data.DisplayName,
        profilePicUrl: r.data.ProfilePicURL,
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
        throw Error(`Received status ${r.status} from server`)
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
        throw Error(`Received status ${r.status} from server`)
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
    .then(async (r) => {
      if (r.status >= 300)
        throw Error(`Received status ${r.status} from server`)
      else if (!r.data)
        throw Error(`Received no match from server`)
      else {
        const profiles = await Promise.all(r.data.map(m => getProfile({ userId: m['matched_with'] })))
        const songs = await Promise.all(r.data.map(m => getUserSongIntersection({ userId: m['matched_with'] })))
        return r.data.map((m, i) => ({
          userId: m['matched_with'],
          matchId: m['match_id'],
          profile: profiles[i],
          songs: songs[i],
          messages: null,
        }))
      }
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
}

export const sendMessage = ({userTo, text}) => {
  const urlPath = joinUrl(SERVER_URL, ...ENDPOINTS.messages)

  const dataToSend = {
    ToUserID: userTo,
    Text: text,
  }

  return axios.post(urlPath, dataToSend)
    .then((r) => {
      if (r.status >= 300)
        throw Error(`Received status ${r.status} from server`)
      else return
    })
    .catch((e) => {
      throw e
    })
}

export const getMessages = ({ matchId }) => {
  const baseUrl = joinUrl(SERVER_URL, ...ENDPOINTS.messages)
  const urlPath = baseUrl.replace('{match_id}', matchId)

  return axios.get(urlPath)
    .then((r) => {
      if (r.status >= 300)
        throw Error(`Received status ${r.status} from server`)
      else if (!r.data)
        throw Error(`Received no messages from server`)
      else return r.data.map(m => ({
        matchId: m['MatchId'],
        senderUserId: m['SenderUserId'],
        // Stored as plain-text encoding on server; convert to real new-lines
        text: m['Text'].replaceAll('\\n', '\n'),
        date: new Date(m['META_StartDate']),
      }))
    })
    .catch((e) => {
      throw e
    })
}

export const rejectMatch = ({ matchId }) => {
  const urlPath = joinUrl(SERVER_URL, ...ENDPOINTS.rejectMatch)
  const dataToSend = {
    'match_id': matchId,
  }

  return axios.post(urlPath, dataToSend)
    .then((r) => {
      if (r.status >= 300)
        throw Error(`Received status ${r.status} from server`)
      else return
    })
    .catch((e) => {
      throw e
    })
}

export const acceptMatch = ({ matchId }) => {
  const urlPath = joinUrl(SERVER_URL, ...ENDPOINTS.acceptMatch)
  const dataToSend = {
    'match_id': matchId,
  }

  return axios.post(urlPath, dataToSend)
    .then((r) => {
      if (r.status >= 300)
        throw Error(`Received status ${r.status} from server`)
      else return
    })
    .catch((e) => {
      throw e
    })
}

export const getUserSongIntersection = ({ userId }) => {
  const urlPath = joinUrl(SERVER_URL, ...ENDPOINTS.userSongIntersection)
  const dataToSend = {
    'target_user_id': userId,
  }

  return axios.post(urlPath, dataToSend)
    .then((r) => {
      if (r.status >= 300)
        throw Error(`Received status ${r.status} from server`)
      else if (!r.data)
        throw Error('Received no data from server')
      else return Object.keys(r.data).map(k => ({...r.data[k], songId: k}))
    })
    .catch((e) => {
      throw e
    })
}

export const syncProfilePic = () => {
  const urlPath = joinUrl(SERVER_URL, ...ENDPOINTS.syncProfilePic)

  return axios.get(urlPath)
    .then((r) => {
      if (r.status >= 300)
        throw Error(`Received status ${r.status} from server`)
      else return
    })
    .catch((e) => {
      throw e
    })
}
