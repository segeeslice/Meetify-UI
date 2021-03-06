/*
 * UI component for the opening login screen w/ welcome animation
 */

import React, { useState, useEffect, useRef, useCallback, } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { CSSTransition } from 'react-transition-group'
import { makeStyles } from '@material-ui/core/styles'

import useAlert from '../../hooks/useAlert'

import {
  Button,
  Grid,
  TextField,
  Typography,
} from '@material-ui/core'

import CreateAccountDialog from './CreateAccountDialog'
import ButtonProgress from '../ButtonProgress'

import {
  login,
  getProfile,
  checkSpotifyLinked,
  syncProfilePic,
} from '../../server'
import {
  setUsername,
  setUserId,
  setLoggedIn,
  setProfile,
  setSpotifyLinked,
} from './accountSlice'

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
  const passwordRef = useRef(null)

  const { addAlert } = useAlert()

  const username = useSelector(state => state.account.username)
  const displayName = useSelector(state => state.account.profile.displayName)
  const [password, setPassword] = useState('')

  const [loginVisible, setLoginVisible] = useState(true)
  const [welcomeVisible, setWelcomeVisible] = useState(false)
  const [timeoutVar, setTimeoutVar] = useState(null)

  const [loginLoading, setLoginLoading] = useState(false)

  const [createDialogOpen, setCreateDialogOpen] = useState(false)

  const onLoginClick = useCallback(async () => {
    setLoginLoading(true)

    login({ username, password })

      .then(async ({ username, userId }) => {
       // Set basic account info in store
        dispatch(setUsername(username))
        dispatch(setUserId(userId))

        // We're now logged in; get any remaining related info
        const { spotifyLinked } = await checkSpotifyLinked ({ userId })
        dispatch(setSpotifyLinked(spotifyLinked))

        if (spotifyLinked) {
          await syncProfilePic()
        }

        const profile = await getProfile({ userId })
        dispatch(setProfile(profile))

        return
      })

      // Trigger login animation chain
      .then(() => {
        setLoginLoading(false)
        setLoginVisible(false)
      })

      .catch((e) => {
        console.error(e)
        addAlert({text: 'Invalid username or password',
                  type: 'snackbar',
                  severity: 'error'})
        setPassword('')
        setLoginLoading(false)
      })
  }, [dispatch, addAlert, password, username, setLoginLoading])

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
  const onRegisterSuccess = useCallback(() => {
    addAlert({
      text: 'Account successfully created!',
      severity: 'success',
      type: 'snackbar',
    })
    setCreateDialogOpen(false)
  }, [ addAlert, setCreateDialogOpen ])

  const onPassKeypress = useCallback((e) => {
    const enterPressed = e.keyCode === 13
    if (enterPressed) onLoginClick()
  }, [onLoginClick])

  const onUsernameKeypress = useCallback((e) => {
    const enterPressed = e.keyCode === 13
    if (enterPressed) passwordRef.current.focus()
  }, [passwordRef])

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
          onKeyDown={onUsernameKeypress}
          disabled={loginLoading}
        />
      </Grid>
      <Grid item style={gridItemStyle} xs={12}>
        <TextField
          label="Password"
          type="password"
          inputRef={passwordRef}
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={onPassKeypress}
          disabled={loginLoading}
        />
      </Grid>
      <Grid item style={gridItemStyle} xs={12}>
        <Button
          disableElevation
          color="primary"
          variant="contained"
          onClick={onLoginClick}
          disabled={loginLoading}
        >
          {loginLoading ?
          <ButtonProgress/> :
          "Login"
          }
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
          disabled={loginLoading}
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
          Welcome, {displayName || username || 'user'}
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
        onSuccess={onRegisterSuccess}
        onCancel={() => setCreateDialogOpen(false)}
      />
    </div>
  )
}
