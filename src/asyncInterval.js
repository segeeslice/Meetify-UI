/*
 * Replacement for setInterval for utilizing async functions, waiting for the
 * previous iteration to finish before running again
 *
 * Has same interaction as setInterval, e.g.:
 *   import { setAsyncInterval, clearAsyncInterval } from './asyncInterval'
 *   const interval = setAsyncInterval(myFunc, 1000)
 *   clearAsyncInterval(interval)
 */

export const setAsyncInterval = (func, ms) => {
  const intervalObj = {
    run: true,
    ref: null,
  }

  const intervalMethod = async () => {
    // "run" key makes sure that no timing issues can happen causing
    // clearTimeout to not happen
    if (!intervalObj.run) return

    func()
      .then(() => {
        intervalObj.ref = setTimeout(intervalMethod, ms)
      })
      .catch(() => {
        clearAsyncInterval(intervalObj)
      })
  }

  intervalMethod()
  return intervalObj
}

export const clearAsyncInterval = (intervalObj) => {
  intervalObj.run = false
  clearTimeout(intervalObj.ref)
}

const defaultExport = { setAsyncInterval, clearAsyncInterval }
export default defaultExport
