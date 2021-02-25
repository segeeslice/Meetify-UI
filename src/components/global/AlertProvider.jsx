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
  alerts: [], // { title, text, severity }
  addAlert: () => {},
  removeAlert: () => {},
})

export default function AlertProvider({ children }) {
  const [alerts, setAlerts] = useState([])

  // NOTE: may want to watch these methods performance-wise, as every time "alert"
  // changes, so does the method, meaning we *may* be triggering mass
  // re-renders...
  const addAlert = useCallback(({title, text, severity, type}) => {
    setAlerts([...alerts, {title, text, severity, type}])
  }, [alerts, setAlerts])
  const removeAlert = useCallback(() => {
    setAlerts(alerts.slice(0, -1))
  }, [alerts])

  const context = {
    alerts,
    addAlert,
    removeAlert,
  }

  return (
    <AlertContext.Provider value={context}>
      {children}
    </AlertContext.Provider>
  )
}
