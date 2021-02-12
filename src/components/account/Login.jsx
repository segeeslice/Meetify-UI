/*
 * UI component for the opening login screen w/ welcome animation
 */

import React, { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { CSSTransition } from 'react-transition-group'
import { makeStyles } from '@material-ui/core/styles'

import useAlert from '../../hooks/useAlert'

import {
  Button,
  Grid,
  Snackbar,
  TextField,
  Typography,
} from '@material-ui/core'
import { Alert } from '@material-ui/lab'
import CreateAccountDialog from './CreateAccountDialog'

import { login } from '../../server'
import { setUsername, setLoggedIn } from './accountSlice'
import { theme } from '../../theme'

const TRANSITION_DURATION = 500
const WELCOME_DURATION = 2000

const useStyles = makeStyles((theme) => ({
  registerButton: {
    color: theme.palette.secondary.light
  },
}))

export default function Login (props) {
  const classes = useStyles()
  const dispatch = useDispatch()

  const { addMessage } = useAlert()

  const username = useSelector(state => state.account.username)
  const [password, setPassword] = useState('')

  const [loginVisible, setLoginVisible] = useState(true)
  const [welcomeVisible, setWelcomeVisible] = useState(false)
  const [timeoutVar, setTimeoutVar] = useState(null)

  const [createDialogOpen, setCreateDialogOpen] = useState(false)

  const onLoginClick = async () => {
    login({ username, password })
      // Set username from server just to be sure
      .then(({ username }) => dispatch(setUsername(username)))

      // Trigger login animation chain
      .then(() => setLoginVisible(false))

      .catch((e) => {
        console.log(e)
        addMessage({text: 'Invalid username or password', severity: 'error'})
        setPassword('')
      })
  }

  // Login and welcome transition handling
  useEffect(() => {
    if (loginVisible === false) setWelcomeVisible(true)
  }, [loginVisible])
  useEffect(() => {
    if (welcomeVisible === true) {
      setTimeoutVar(setTimeout(() => {
        dispatch(setLoggedIn(true))
      }, TRANSITION_DURATION + WELCOME_DURATION))
    }
  }, [welcomeVisible, dispatch])

  // Cleanup timeout on destroy, just in case
  useEffect(() => {
    return function cleanup() {
      clearTimeout(timeoutVar)
    }
  })

  const onRegisterClick = () => setCreateDialogOpen(true)
  const onCreateAccountSubmit = (obj) => setCreateDialogOpen(false)

  // TODO: Move these to material-ui's makeStyle syntax
  const gridItemStyle = { textAlign: 'center', paddingBottom: '10px' }

  // Login component, where user enters username and password
  const loginComp = (
    <>
      <Grid item style={gridItemStyle}>
        <Typography variant='subtitle1' style={{color: theme.palette.text.hint}}>
          Welcome to
        </Typography>
        <Typography variant='h3'>
          Meetify
        </Typography>
      </Grid>
      <Grid item style={gridItemStyle} xs={12}>
        <TextField
          label="Username"
          value={username}
          onChange={(e) => dispatch(setUsername(e.target.value))}
        />
      </Grid>
      <Grid item style={gridItemStyle} xs={12}>
        <TextField
          label="Password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </Grid>
      <Grid item style={gridItemStyle} xs={12}>
        <Button
          disableElevation
          color="primary"
          variant="contained"
          onClick={onLoginClick}
        >
          Login
        </Button>
      </Grid>
      {/* TODO: Could add nice lilttle divider, but would need to mess with CSS */}
      {/* <Grid item style={gridItemStyle} xs={12}> */}
      {/*   <Divider/> */}
      {/* </Grid> */}
      <Grid item style={gridItemStyle} xs={12}>
        <Button
          disableElevation
          color="secondary"
          onClick={onRegisterClick}
          className={classes.registerButton}
        >
          Register
        </Button>
      </Grid>
    </>
  )

  // Basic component where user is welcomed
  const welcomeComp = (
    <>
      <Grid item style={gridItemStyle}>
        <Typography variant='h3'>
          Welcome, {username || 'user'}
        </Typography>
      </Grid>
    </>
  )

  const loginRef = useRef(null)
  const welcomeRef = useRef(null)

  // Return final result with transitions prepped between login and welcome screen
  // Note that weird "absolute" / "relative" interactions allow for
  // transitions to happen on top of each other
  return (
    <div
      style={{height: '100%', width: '100%', position: 'absolute'}}
    >
      {/* TODO: Would be nice to make this concise with common component, but
                CSSTransition doesn't seem to like using "in" from a prop */}
      <CSSTransition
        classNames="fade"
        timeout={TRANSITION_DURATION}
        unmountOnExit
        style={{position: 'absolute', height: '100%', width: '100%'}}
        nodeRef={loginRef}
        in={loginVisible}
      >
        <Grid
          style={{height: '100%', width: '100%', position: 'relative'}}
          justify="center"
          alignContent="center"
          container
          ref={loginRef}
        >
          {loginComp}
        </Grid>
      </CSSTransition>

      <CSSTransition
        classNames="fade"
        timeout={TRANSITION_DURATION}
        unmountOnExit
        style={{position: 'absolute', height: '100%', width: '100%'}}
        nodeRef={welcomeRef}
        in={welcomeVisible}
      >
        <Grid
          style={{height: '100%', width: '100%', position: 'relative'}}
          justify="center"
          alignContent="center"
          container
          ref={welcomeRef}
        >
          {welcomeComp}
        </Grid>
      </CSSTransition>

      <CreateAccountDialog
        open={createDialogOpen}
        onCancel={() => setCreateDialogOpen(false)}
        onSubmit={onCreateAccountSubmit}
      />
    </div>
  )
}
