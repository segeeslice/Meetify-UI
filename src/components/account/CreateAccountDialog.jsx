/*
 * Dialog with fields for creating a new user account a user's profile
 * Events/data must be handled in parent
 */

import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'

import {
  TextField,
  Typography,
} from '@material-ui/core'
import FormDialog from '../FormDialog'

const useStyles = makeStyles((theme) => ({
  dialogContent: {
    maxWidth: 600,
    minWidth: 600,
    paddingTop: theme.spacing(2)
  },
  cancelButton: {
    // background: theme.palette.error.dark,
    color: theme.palette.error.light,
  },
  saveButton: {
    // background: theme.palette.primary.dark,
    color: theme.palette.primary.light,
  },
  editableMargin: {
    marginTop: theme.spacing(2)
  },
  avatarRow: {
    display: 'flex',
    alignItems: 'center',
  },
  avatarTextField: {
    marginLeft: theme.spacing(2),
  },
  avatar: {
    width: theme.spacing(6),
    height: theme.spacing(6),
  },
}))

export default function EditProfileDialog(props) {
  const {
    open,
    onCancel,
    onSubmit,
  } = props

  const classes = useStyles()
  const [ email, setEmail ] = useState('')
  const [ password, setPassword ] = useState('')
  const [ passwordRepeat, setPasswordRepeat ] = useState('')

  // TODO
  // const emailError = (!email && 'Email must be defined!') ||
  //       ()
  // const passwordError =

  // Reset any previous changes when opening
  useEffect(() => {
    if (open === true) {
      setEmail('')
      setPassword('')
      setPasswordRepeat('')
    }
  }, [open])

  return (
    <FormDialog
      open={open}
      title="Create Account"
      submitButtonText="Create Account"
      /* submitButtonDisabled={emailError || passwordError} */
      onSubmit={() => onSubmit && onSubmit({email, password})}
      onClose={() => onCancel && onCancel()}
      onCancel={() => onCancel && onCancel()}
    >
      <Typography variant="body1">
        Welcome to <strong>Meetify</strong>! Before you start meeting people, we
        just need some basic info...
      </Typography>

      <TextField
        className={classes.editableMargin}
        label="Email Address"
        variant="outlined"
        /* error={emailError} */
        /* helperText={emailError} */
        fullWidth
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <TextField
        className={classes.editableMargin}
        label="Password"
        type="password"
        variant="outlined"
        fullWidth
        required
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <TextField
        className={classes.editableMargin}
        label="Confirm Password"
        type="password"
        variant="outlined"
        fullWidth
        required
        value={passwordRepeat}
        onChange={(e) => setPasswordRepeat(e.target.value)}
      />
    </FormDialog>
  )
}
