/*
 * UI component for containing the app's tab bar
 * Tabs themselves should be managed in parent
 */

import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles'
import useAlert from '../hooks/useAlert'

import {
  Paper,
  Tabs,
  IconButton,
} from '@material-ui/core'
import ErrorBadge from './ErrorBadge'
import LinkSpotifyDialog from './account/LinkSpotifyDialog'
import LogoutDialog from './account/LogoutDialog'

import LogoutIcon from '@material-ui/icons/ExitToApp'
import AccountIcon from '@material-ui/icons/AccountCircle'
import SpotifyIcon from './icons/SpotifyIcon'

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.default,
    height: '100%',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  tabs: {
    flexGrow: 1,
  },
  buttons: {
    display: 'flex',
    flexDirection: 'row',
    padding: theme.spacing(1),
  },
  divider: {
    borderColor: theme.palette.text.disabled,
  },
  logoutButton: {
    color: theme.palette.error.light
  },
}))

export default function VerticalTabBar (props) {
  const classes = useStyles()
  const { addAlert } = useAlert()

  const {
    children,     // tabs
    activeIndex,  // index of currently active tab
  } = props

  const spotifyLinked = useSelector(state => state.account.spotify.linked)
  const [ linkSpotifyDialogOpen, setLinkSpotifyDialogOpen ] = useState(false)
  const [ logoutDialogOpen, setLogoutDialogOpen ] = useState(false)

  const onSpotifyClick = () => {
    if (!spotifyLinked) {
      setLinkSpotifyDialogOpen(true)
    } else {
      addAlert({
        severity: 'info',
        text: 'Spotify account already linked!',
        type: 'snackbar',
      })
    }
  }

  const onLinkSpotifySuccess = () => {
    setLinkSpotifyDialogOpen(false)
    addAlert({
      severity: 'success',
      text: 'Your Spotify account has been linked! You can now use the Meetify services.',
      type: 'dialog',
    })
  }
  const onLinkSpotifyCancel = () => {
    setLinkSpotifyDialogOpen(false)
  }

  const onLogoutClick = () => {
    setLogoutDialogOpen(true)
  }

  const onLogoutCancel = () => {
    setLogoutDialogOpen(false)
  }
  const onLogoutSuccess = () => {
    setLogoutDialogOpen(false)
    addAlert({
      severity: 'success',
      text: 'You are now logged out from Meetify.',
      type: 'snackbar',
    })
  }

  return (
    <>
      <Paper
        className={classes.root}
        square
      >
        <Tabs
          className={classes.tabs}
          orientation="vertical"
          value={activeIndex || 0}
        >
          { children }
        </Tabs>

        <div><hr className={classes.divider}/></div>

        <div className={classes.buttons}>
          <IconButton
            className={classes.logoutButton}
            onClick={onLogoutClick}
          >
            <LogoutIcon/>
          </IconButton>

          <IconButton onClick={onSpotifyClick}>
            <ErrorBadge
              overlap="circle"
              invisible={spotifyLinked}
            >
              <SpotifyIcon/>
            </ErrorBadge>
          </IconButton>

          <IconButton><AccountIcon/></IconButton>
        </div>
      </Paper>

      <LinkSpotifyDialog
        open={linkSpotifyDialogOpen}
        onSuccess={onLinkSpotifySuccess}
        onCancel={onLinkSpotifyCancel}
      />
      <LogoutDialog
        open={logoutDialogOpen}
        onSuccess={onLogoutSuccess}
        onCancel={onLogoutCancel}
      />
    </>
  );
}
