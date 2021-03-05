/*
 * Small FormDialog wrapper for confirming a match dismissal
 * Primarily intended for use in the Matches tab when dismissing a user with chat history
 */

import React from 'react'

import {
  Typography,
} from '@material-ui/core'
import FormDialog from '../FormDialog'

export default function MatchDismissDialog(props) {
  const {
    open,
    onCancel,
    onSubmit,
  } = props

  return (
    <FormDialog
      open={open}
      title="Match Dismiss"
      submitButtonText="Dismiss"
      onSubmit={() => onSubmit && onSubmit()}
      onClose={() => onCancel && onCancel()}
      onCancel={() => onCancel && onCancel()}
    >
      <Typography variant="body1">
        Are you sure you want to dismiss this user? You will lose access to all
        prior chat history.<br/>
        <strong>This cannot be undone.</strong>
      </Typography>
    </FormDialog>
  )
}
