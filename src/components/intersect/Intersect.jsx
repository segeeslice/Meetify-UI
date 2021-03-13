/*
 * "Intersect" portion of the app, selectable from the tab bar
 * Allows current user to intersect their liked songs with another user
 * (NOTE: Currently just contains test data)
 */

import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import useAlert from '../../hooks/useAlert'
import { makeStyles } from '@material-ui/core/styles'

import { setIntersectUsername, setSongs } from './intersectSlice'
import { getUserSongIntersection } from '../../server'

import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Grid from '@material-ui/core/Grid'
import SongTile from '../SongTile';

const useStyles = makeStyles((theme) => ({
  songTile: {
    height: theme.tile.height,
    width: '100%',
    padding: '8px',
  }
}))

export default function Intersect (props) {
  const classes = useStyles()
  const dispatch = useDispatch()
  const { addAlert } = useAlert()

  // Use state primarily to maintain an internal "cache" when this gets unmounted
  const username = useSelector(state => state.intersect.username)
  const songs = useSelector(state => state.intersect.songs)

  const submitDisabled = !username

  const handleSubmit = () => {
    if (submitDisabled) return

    dispatch(setSongs([]))
    // TODO: Reload animation on button
    getUserSongIntersection({ username })
      .then((songs) => {
        dispatch(setSongs(songs))
      })
      .catch((e) => {
        console.error(e)
        addAlert({
          type: 'snackbar',
          severity: 'error',
          text: 'Could not retrieve songs. Make sure the username is correct and try again!',
        })
      })
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
            onChange={e => dispatch(setIntersectUsername(e.target.value))}
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
            Submit
          </Button>
        </Grid>
      </Grid>

      {/* TODO: Make scrollable, e.g.... */}
      {/* <div style={{ overflowY: 'auto', height: '200px' }}> */}
      <div>
        {songs.map((row, index) => (
          <div className={classes.songTile} key={index}>
            <SongTile
              song={row.song}
              artist={row.artist}
              /* album={row.album} */
              albumArtUrl={row.albumArtUrl}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
