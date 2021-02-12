/*
 * Consumes items from the global Alert context to display an error
 *
 * Intended for use at the top level to be displayed throughout the program
 * (i.e. not intended for importing outside of index.js!)
 *
 * Strongly referenced Medium article at:
 * https://medium.com/yld-blog/handling-global-notifications-with-reacts-context-api-7d8135510d50
 *
 * Example usage for displaying alert:
 *   import useAlert from '../hooks/userAlert'
 *   const [ addAlert ] = useAlert()
 *
 *   // addAlert will automatically call this component and display a
 *   // dismissible alert message
 *   addAlert({
 *     title: 'Info',
 *     message: 'Test message',
 *
 *     // Controls style of the alert
 *     // Same possible fields as Material UI's "Alert" severity:
 *     // 'info', 'error', 'success', or 'warning'
 *     severity: 'info',
 *
 *     // Controls how alert appears
 *     // Can be 'snackbar' or 'dialog'
 *     type: 'snackbar',
 *   })
 */

import React, { useContext, useState, useEffect } from 'react'
import { AlertContext } from './AlertProvider'
import { Snackbar } from '@material-ui/core'
import { Alert } from '@material-ui/lab'

export default function AlertNotification () {
  const { message, removeMessage } = useContext(AlertContext)

  // Tie opening to separate variable as opposed to using message itself to
  // ensure no visual glitches when clearing message
  const [ open, setOpen ] = useState(false)

  useEffect(() => {
    if (message) setOpen(true)
  }, [message, setOpen])

  return (
    <Snackbar
      autoHideDuration={6000}
      open={open}
      onClose={() => setOpen(false)}
      onExited={() => removeMessage()}
      color="error"
    >
      <Alert
        severity={(message && message.severity) || 'info'}
        onClose={() => setOpen(false)}
      >
        { (message && message.text) || '(No details)' }
      </Alert>
    </Snackbar>
  )
}
