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
 *   // dismissible alert alert
 *   addAlert({
 *     title: 'Info', // Only displayed if 'dialog' type
 *     text: 'Test alert',
 *
 *     // Controls style of the alert
 *     // Same possible fields as Material UI's "Alert" severity:
 *     // 'info', 'error', 'success', or 'warning'
 *     severity: 'info',
 *
 *     // Controls how alert appears
 *     // Can be 'snackbar' or 'dialog'
 *     // (TODO)
 *     type: 'snackbar',
 *   })
 */

import React, { useContext, useState, useEffect } from 'react'
import { AlertContext } from './AlertProvider'
import { Snackbar } from '@material-ui/core'
import { Alert } from '@material-ui/lab'

export default function AlertNotification () {
  const { alert, removeAlert } = useContext(AlertContext)

  // Tie opening to separate variable as opposed to using alert itself to
  // ensure no visual glitches when clearing alert
  const [ open, setOpen ] = useState(false)

  useEffect(() => {
    if (alert) setOpen(true)
  }, [alert, setOpen])

  return (
    <Snackbar
      autoHideDuration={6000}
      open={open}
      onClose={() => setOpen(false)}
      onExited={() => removeAlert()}
      color="error"
    >
      <Alert
        severity={(alert && alert.severity) || 'info'}
        onClose={() => setOpen(false)}
      >
        { (alert && alert.text) || '(No details)' }
      </Alert>
    </Snackbar>
  )
}
