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
 *     // Options: 'info', 'error', 'success', or 'warning'
 *     // Default: 'info'
 *     severity: 'info',
 *
 *     // Controls how alert appears
 *     // Options: 'snackbar', 'dialog'
 *     // Default: 'snackbar'
 *     type: 'snackbar',
 *   })
 */

import React, { useContext, useState, useEffect } from 'react'
import { AlertContext } from './AlertProvider'

import { Dialog, Snackbar } from '@material-ui/core'
import { Alert, AlertTitle } from '@material-ui/lab'

import { capitalize } from '../../util'

export default function AlertNotification () {
  const { alerts, removeAlert } = useContext(AlertContext)

  // Tie opening to separate variable as opposed to using alert itself
  // Ensures no visual glitches when clearing alert
  const [ open, setOpen ] = useState(false)

  // When an alert is given, open the notification
  useEffect(() => {
    if (alerts && alerts.length > 0) setOpen(true)
  }, [alerts, setOpen])

  // Exit early if no alert to avoid a million null checks
  if (!alerts || alerts.length === 0) return <div/>

  // Get top alert
  const alert = alerts[0]

  // Inject default values into alert in case they're not given
  const severity = alert.severity || 'info'
  const alertDefaulted = {
    severity: severity,
    title: alert.title || capitalize(severity),
    text: alert.text || '(no details)',
    type: ['dialog', 'snackbar'].includes(alert.type) ? alert.type : 'snackbar',
  }

  return alertDefaulted.type === 'snackbar' ? (
    <Snackbar
      autoHideDuration={6000}
      open={open}
      onClose={() => setOpen(false)}
      onExited={() => removeAlert()}
      color="error"
    >
      <Alert
        severity={alertDefaulted.severity}
        onClose={() => setOpen(false)}
      >
        { alertDefaulted.text }
      </Alert>
    </Snackbar>
  ) : (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      onExited={() => removeAlert()}
      maxWidth="sm"
    >
      <Alert
        severity={alertDefaulted.severity}
        onClose={() => setOpen(false)}
      >
        <AlertTitle>
          { alertDefaulted.title }
        </AlertTitle>
        { alertDefaulted.text }
      </Alert>
    </Dialog>
  )
}
