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

const SEVERITIES = [
  'success', 'info', 'warning', 'error',
]

export default function AlertNotification () {
  const { alert, removeAlert } = useContext(AlertContext)

  // Tie opening to separate variable as opposed to using alert itself
  // Ensures no visual glitches when clearing alert
  const [ open, setOpen ] = useState(false)

  // Manage a queue of alerts, should multiple occur one after another
  //
  // List state management can require a lot of re-renders, so this is managed
  // here as opposed to within AlertProvider to contain re-renders within this
  // component, as opposed to potentially propogating them app-wide
  const [ alertQueue, setAlertQueue ] = useState([])

  // Watch for new alerts and add them to the queue
  useEffect(() => {
    if (alert && !alertQueue.includes(alert)) {
      removeAlert(alert)
      setAlertQueue([...alertQueue, alert])
    }
  }, [alert, alertQueue, removeAlert])

  // Open alert when the alertQueue gets new items
  useEffect(() => {
    if (alertQueue.length > 0) {
      setOpen(true)
    }
  }, [alertQueue, setOpen])

  // Close animation complete; `open` already false
  // Remove item from alert queue
  const onExited = () => {
    setAlertQueue(alertQueue.slice(1))
  }

  if (alertQueue.length === 0) return <div/>
  const displayedAlert = alertQueue[0]

  const severity = (SEVERITIES.includes(displayedAlert.severity) && displayedAlert.severity) || 'info'
  const alertDefaulted = {
    severity: severity,
    title: displayedAlert.title || capitalize(severity),
    text: displayedAlert.text || '(no details)',
    type: ['dialog', 'snackbar'].includes(displayedAlert.type) ? displayedAlert.type : 'snackbar',
  }

  return alertDefaulted.type === 'snackbar' ? (
    <Snackbar
      autoHideDuration={6000}
      open={open}
      onClose={() => setOpen(false)}
      onExited={onExited}
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
      onExited={onExited}
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
