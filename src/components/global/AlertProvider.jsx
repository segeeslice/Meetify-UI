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
