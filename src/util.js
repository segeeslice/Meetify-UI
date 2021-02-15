/*
 * File containing short utility methods for use across app
 */

// e.g. capitalize('info') = 'Info'
// e.g. capitalize('the onion') = 'The Onion'
export const capitalize = (str) => {
  return str.split()
            .map(([firstLetter, ...restOfStr]) => firstLetter.toUpperCase() + restOfStr.join(''))
            .join(' ')
}

// e.g. spaceCaps('HeyThere') = 'Hey There'
export const spaceCaps = (str) => {
  return str.match(/[A-Z][a-z]+/g).join(' ')
}

// e.g. cleanEmptyKeys({nullVal: null, notNull: 3}) = {notNull: 3}
export const cleanEmptyKeys = (obj) => {
  const cleaned = {...obj}
  for (let k in cleaned) {
    if (cleaned[k] === null || cleaned[k] === undefined)
      delete cleaned[k]
  }
  return cleaned
}

export const getShortTime = (date) => {
  // Original format: [hour]:[minute]:[second] [timezone]
  const re = /[0-9]+:[0-9]+/
  const matches = date.toTimeString().match(re)
  return matches.length > 0 ? matches[0] : '(no time)'
}

export const getShortDate = (date) => {
  // Original format example: Wed Jul 28 1993
  const re = /.+ [0-9]+ [0-9]+/
  const matches = date.toDateString().match(re)
  return matches.length > 0 ? matches[0] : '(no date)'
}

export const getShortDateTime = (date) => {
  return `${getShortDate(date)} ${getShortTime(date)}`
}

// True if valid email; originally supplied by:
// https://stackoverflow.com/questions/46155/how-to-validate-an-email-address-in-javascript
export const checkValidEmail = (email) => {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  // TODO: Make max lengths universal in central config doc
  return re.test(email.toLowerCase()) && email.length <= 254
}

// True if valid password
// Do NOT check for symbols; UI should instead encourage long passwords
export const checkValidPassword = (password) => {
  // TODO: Make lengths universal in central config doc
  const re = /(.){10,128}$/
  return re.test(password)
}

// True if valid username
// Username considered valid if uses at least 5 letters, numbers, -, ., and/or _
export const checkValidUsername = (username) => {
  // TODO: Make max lengths universal in central config doc
  // TODO: Run different regexes and return exact error from here?
  const re = /^([a-zA-Z0-9\-_.])*$/
  return re.test(username) && username.length >= 5 && username.length <= 128
}
