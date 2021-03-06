/*
 * Dialog with fields for creating a new user account a user's profile
 * Communicates with server in-house
 *
 */

import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'

import { signup } from '../../server'
import useAlert from '../../hooks/useAlert'
import {
  checkValidEmail,
  checkValidPassword,
  checkValidUsername,
  spaceCaps,
} from '../../util'

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
  editableMargin: {
    marginTop: theme.spacing(2)
  },
  hintText: {
    color: theme.palette.text.hint
  },
}))

export default function CreateAccountDialog(props) {
  const {
    open,      // True if dialog open
    onCancel,  // Method to call on user cancel
    onSuccess, // Method to call on successful account creation
  } = props

  const classes = useStyles()
  const [ username, setUsername ] = useState('')
  const [ email, setEmail ] = useState('')
  const [ password, setPassword ] = useState('')
  const [ passwordRepeat, setPasswordRepeat ] = useState('')

  // Monitor if user has changed a field so we don't report errors for doing nothing
  const [ usernameChanged, setUsernameChanged ] = useState(false)
  const [ emailChanged, setEmailChanged ] = useState(false)
  const [ passwordChanged, setPasswordChanged ] = useState(false)
  const [ passwordRepeatChanged, setPasswordRepeatChanged ] = useState(false)

  const { addAlert } = useAlert()

  // Central location for field errors
  // If there's an error, should be set to error reason. Otherwise should be false
  const usernameError = usernameChanged &&
        (!checkValidUsername(username) && 'Username must be at least 5 letters, numbers, and/or allowed symbols')
  const emailError = emailChanged &&
        (!checkValidEmail(email) && 'Invalid email')
  const passwordError = passwordChanged &&
        (!checkValidPassword(password) && 'Password must be at least 10 characters')
  const passwordRepeatError = passwordRepeatChanged &&
        (password !== passwordRepeat && 'Passwords must match')

  const submitButtonDisabled =
        !username || !email || !password || !passwordRepeat ||
        !!usernameError || !!emailError || !!passwordError || !!passwordRepeatError

  // Reset any previous changes when opening
  useEffect(() => {
    if (open === true) {
      setUsername('')
      setEmail('')
      setPassword('')
      setPasswordRepeat('')

      setUsernameChanged(false)
      setEmailChanged(false)
      setPasswordChanged(false)
      setPasswordRepeatChanged(false)
    }
  }, [open])

  const onSubmit = () => {
    signup({username, email, password,})
      .then(() => {
        onSuccess && onSuccess()
      })
      .catch((e) => {
        addAlert({
          text: e.message || e,
          title: (e.name && spaceCaps(e.name)) || null,
          type: 'dialog',
          severity: 'error',
        })

        // Don't clear password if just a connection issue
        if (!e.name || e.name !== 'CouldNotConnect') {
          setPassword('')
          setPasswordRepeat('')
          setPasswordChanged(false)
          setPasswordRepeatChanged(false)
        }
      })
  }

  return (
    <FormDialog
      open={open}
      title="Create Account"
      submitButtonText="Create Account"
      submitButtonDisabled={submitButtonDisabled}
      onSubmit={() => onSubmit()}
      onClose={() => onCancel && onCancel()}
      onCancel={() => onCancel && onCancel()}
    >
      <Typography variant="body1">
        Welcome to <strong>Meetify</strong>! Before you start meeting people, we
        just need some basic info...
      </Typography>

      <TextField
        className={classes.editableMargin}
        label="Username"
        variant="outlined"
        error={!!usernameError}
        helperText={usernameError}
        fullWidth
        required
        value={username}
        onChange={(e) => {setUsername(e.target.value); setUsernameChanged(true)}}
        inputProps={{spellCheck: false}}
      />

      <TextField
        className={classes.editableMargin}
        label="Email Address"
        variant="outlined"
        error={!!emailError}
        helperText={emailError}
        fullWidth
        required
        value={email}
        onChange={(e) => {setEmail(e.target.value); setEmailChanged(true)}}
        inputProps={{spellCheck: false}}
      />

      <Typography variant="body1" className={`${classes.editableMargin} ${classes.hintText}`}>
        We don't have restrictions on what's in your password, but <strong>make
        it long!</strong> Password length is what really keeps you secure.

        <br/><br/>

        <strong>Our tip:</strong> Try a unique but easy-to-remember sentence, such as:<br/>
        <em>"Timetomeet42greatnewfriends!"</em>
      </Typography>

      <TextField
        className={classes.editableMargin}
        label="Password"
        type="password"
        variant="outlined"
        error={!!passwordError}
        helperText={passwordError}
        fullWidth
        required
        value={password}
        onChange={(e) => {setPassword(e.target.value); setPasswordChanged(true)}}
      />
      <TextField
        className={classes.editableMargin}
        label="Confirm Password"
        type="password"
        variant="outlined"
        error={!!passwordRepeatError}
        helperText={passwordRepeatError}
        fullWidth
        required
        value={passwordRepeat}
        onChange={(e) => {setPasswordRepeat(e.target.value); setPasswordRepeatChanged(true)}}
      />
    </FormDialog>
  )
}
