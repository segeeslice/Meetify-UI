/*
 * Global React context provider, allowing for any component to import the same
 * source data
 *
 * addAlert can be used anywhere for alert display
 * alert & removeAlert only intended for use in AlertNotification.jsx
 *
 * Use hooks/useAlert.jsx for simplified context import
 * See components/global/AlertNotification.jsx for UI component & further usage
 */

import React, { useState, useCallback } from 'react';

export const AlertContext = React.createContext({
  alert: null, // { title, text, severity }
  addAlert: () => {},
  removeAlert: () => {},
})

export default function AlertProvider({ children }) {
  const [alert, setAlert] = useState(null)

  const addAlert = useCallback(
      ({title, text, severity}) => setAlert({title, text, severity}),
      []
  )
  const removeAlert = useCallback(() => setAlert(null), [])

  const context = {
    alert,
    addAlert,
    removeAlert,
  }

  return (
    <AlertContext.Provider value={context}>
      {children}
    </AlertContext.Provider>
  )
}
