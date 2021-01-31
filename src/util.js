/*
 * File containing short utility methods for use across app
 */

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
