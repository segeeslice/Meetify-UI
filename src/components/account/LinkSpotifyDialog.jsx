/*
 * Dialog with fields for linking a spotify account
 * Connects with server in-house
 */

import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles'
import useAlert from '../../hooks/useAlert'

import {
  linkSpotifyAccount,
  waitUntilSpotifyLinked,
} from '../../server'

import {
  setSpotifyLinked,
} from './accountSlice'

import {
  Button,
  CircularProgress,
  Typography,
} from '@material-ui/core'
import { Alert } from '@material-ui/lab'
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
  spotifyLink: {
    textDecoration: 'none'
  },
}))

export default function LinkSpotifyDialog(props) {
  const {
    open,
    onCancel,
    onSuccess,
  } = props

  const classes = useStyles()
  const dispatch = useDispatch()
  const { addAlert } = useAlert()

  const userId = useSelector((state) => state.account.userId)
  const spotifyLinked = useSelector((state) => state.account.spotify.linked)
  const [ spotifyUrl, setSpotifyUrl ] = useState('')
  const [ linkError, setLinkError ] = useState('')

  // Automatically get the link from the server on dialog open
  useEffect(() => {
    setSpotifyUrl('')
    setLinkError('')

    if(open) {
      linkSpotifyAccount({ userId })
        .then(({ url }) => {
          setSpotifyUrl(url)
        })
        .catch((e) => {
          const head = 'Can\'t link:'
          if (e && e.message) setLinkError(`${head} ${e.message}`)
          else if (typeof(e) === 'string') setLinkError(`${head} ${e}`)
          else setLinkError(`${head} Unknown error occurred`)
        })
    }
  }, [open, userId])

  const onLinkButtonClick = () => {
    waitUntilSpotifyLinked.start({ userId })
      .then(({ spotifyLinked }) => {
        console.log('success!')
        dispatch(setSpotifyLinked(spotifyLinked))
      })
      .catch((e) => {
        console.error(e)
        addAlert({
          severity: 'error',
          text: 'Spotify linkage timed out; please try again!',
          type: 'snackbar',
        })
      })
  }

  const onSubmit = () => {
    onSuccess()
  }

  const onDialogCancel = () => {
    waitUntilSpotifyLinked.stop()
    if (spotifyLinked) onSuccess && onSuccess()
    else onCancel && onCancel()
  }

  return (
    <FormDialog
      open={open}
      title="Spotify Account Link"
      submitButtonText="Continue"
      submitButtonDisabled={!spotifyLinked}
      cancelButtonDisabled={spotifyLinked}
      onSubmit={onSubmit}
      onClose={onDialogCancel}
      onCancel={onDialogCancel}
    >
      <Typography variant="body1">
        To use <strong>Meetify</strong>, we will need some basic info from your
        Spotify account.<br/>
        <em>(You can always do this later from within the app!)</em>
      </Typography>

      { linkError &&
        <Alert className={classes.editableMargin} severity="error">
          {linkError}
        </Alert>
      }

      { !linkError &&
        <a
          className={classes.spotifyLink}
          href={spotifyUrl}

          /* Allow it to be opened in new window/tab */
          target="_blank"
          rel="noreferrer"
        >
          <Button
            fullWidth
            onClick={onLinkButtonClick}
            className={classes.editableMargin}
            variant="outlined"
            color="primary"
            disabled={!spotifyUrl || spotifyLinked}
          >
            { (!spotifyUrl && <CircularProgress size={26} thickness={5}/>) ||
              (spotifyLinked && "Complete!") ||
              "Link Account"}
          </Button>
        </a>
      }
    </FormDialog>
  )
}
