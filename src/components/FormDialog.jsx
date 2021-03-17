/*
 * Generic dialog for centrally styling form dialogs
 * Has a title area, contents, a cancel button, and a submit button
 *
 * Various props detailed within function itself
 *
 * Example usage:
 *<FormDialog
 *  open={true}
 *  title="My Form"
 *  submitButtonText="Save Form"
 *  onSubmit={() => handleSubmit()}
 *  onClose={() => handleClose()}
 *  onCancel={() => handleCancel()}
 *>
 *  <TextField
 *    label="My Text Field"
 *    variant="outlined"
 *  />
 *</FormDialog>
 *
 */


import React from 'react'
import { makeStyles } from '@material-ui/core/styles'

import {
  AppBar,
  Button,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
} from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
  dialogContent: {
    maxWidth: 600,
    minWidth: 600,
    paddingTop: theme.spacing(2)
  },
  cancelButton: {
    color: theme.palette.error.light,
  },
  submitButton: {
    color: theme.palette.primary.light,
  },
}))

export default function EditProfileDialog(props) {
  const classes = useStyles()

  const {
    // Booleans
    open, // true if dialog should open (from Material-UI)
    submitButtonDisabled,
    cancelButtonDisabled,

    // Method callbacks
    onClose,
    onCancel,
    onSubmit,

    // Strings
    title,
    submitButtonText,
    cancelButtonText,

    // Other
    children,
  } = props

  return (
    <Dialog
      open={open}
      onClose={() => onClose && onClose()}
      maxWidth="lg"
    >
      <AppBar position="static">
        <DialogTitle>
          { title || 'Form Dialog' }
        </DialogTitle>
      </AppBar>
      <DialogContent className={classes.dialogContent}>
        { children }
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => onCancel && onCancel()}
          className={classes.cancelButton}
          disabled={cancelButtonDisabled}
        >
          { cancelButtonText || 'Cancel' }
        </Button>
        <Button
          onClick={() => onSubmit && onSubmit()}
          className={classes.submitButton}
          disabled={submitButtonDisabled}
        >
          { submitButtonText || 'Submit' }
        </Button>
      </DialogActions>
    </Dialog>
  )
}
