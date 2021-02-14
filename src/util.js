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
  const re = /(.){10,}$/
  // TODO: Make max lengths universal in central config doc
  return re.test(password) && password.length <= 128
}
