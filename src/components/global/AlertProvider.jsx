/*
 * Global React context provider, allowing for any component to import the same
 * source data
 *
 * addMessage can be used anywhere for alert display
 * message & removeMessage only intended for use in AlertNotification.jsx
 *
 * Use hooks/useAlert.jsx for simplified context import
 * See components/global/AlertNotification.jsx for UI component & further usage
 */

import React, { useState, useCallback } from 'react';

export const AlertContext = React.createContext({
  message: null, // { title, text, severity }
  addMessage: () => {},
  removeMessage: () => {},
})

export default function AlertProvider({ children }) {
  const [message, setMessage] = useState(null)

  const addMessage = useCallback(
      ({title, text, severity}) => setMessage({title, text, severity}),
      []
  )
  const removeMessage = useCallback(() => setMessage(null), [])

  const context = {
    message,
    addMessage,
    removeMessage,
  }

  return (
    <AlertContext.Provider value={context}>
      {children}
    </AlertContext.Provider>
  )
}
