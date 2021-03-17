/*
 * "Intersect" portion of the app, selectable from the tab bar
 * Allows current user to intersect their liked songs with another user
 * (NOTE: Currently just contains test data)
 */

import React, { useState, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import useAlert from '../../hooks/useAlert'

import { setIntersectUsername, setSongs } from './intersectSlice'
import { getUserSongIntersection } from '../../server'

import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Grid from '@material-ui/core/Grid'

import SongTileList from '../SongTileList'
import ButtonProgress from '../ButtonProgress'

export default function Intersect (props) {
  const dispatch = useDispatch()
  const { addAlert } = useAlert()
  const textRef = useRef(null)

  const [loading, setLoading] = useState(false)

  // Use store primarily to maintain an internal "cache" when this gets unmounted
  const username = useSelector(state => state.intersect.username)
  const songs = useSelector(state => state.intersect.songs)

  const submitDisabled = !username || loading
  const textDisabled = loading

  const handleSubmit = () => {
    if (submitDisabled) return

    dispatch(setSongs([]))
    setLoading(true)
    getUserSongIntersection({ username })
      .then((songs) => {
        setLoading(false)
        dispatch(setSongs(songs))
      })
      .catch((e) => {
        setLoading(false)
        console.error(e)
        addAlert({
          type: 'snackbar',
          severity: 'error',
          text: 'Could not retrieve songs. Make sure the username is correct and try again!',
        })
      })
      .finally(() => {
        textRef.current.focus()
      })
  }

  const onKeypress = (e) => {
    const enterPressed = e.keyCode === 13
    if (enterPressed) handleSubmit()
  }

  return (
    <div>
      <Grid
        container
        alignItems="center"
        spacing={2}
      >
        <Grid item>
          <TextField
            label="Other User's Username"
            variant="outlined"
            value={username}
            disabled={textDisabled}
            onChange={e => dispatch(setIntersectUsername(e.target.value))}
            onKeyDown={onKeypress}
            inputRef={textRef}
            autoFocus
          />
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            disableElevation
            color="primary"
            disabled={submitDisabled}
            onClick={() => handleSubmit()}
          >
            { !loading ?
              "Submit" :
              <ButtonProgress/>
            }
          </Button>
        </Grid>
      </Grid>

      {/* TODO: Make scrollable, e.g.... */}
      {/* <div style={{ overflowY: 'auto', height: '200px' }}> */}
      <div>
        <SongTileList songs={songs}/>
      </div>
    </div>
  );
}
