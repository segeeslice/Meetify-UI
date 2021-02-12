// TODO: Header comments

import React, { useContext, useCallback, useState, useEffect } from 'react'
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
