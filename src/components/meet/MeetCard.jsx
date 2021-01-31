/*
 * UI component for a single "card" displaying passed contact information
 *
 * TODO: Total redesign; basic material card
 *
 * Props (all Strings):
 *   - displayName (String)
 *   - profilePicUrl (String)
 *   - songsMatched (int)
 */

import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'

import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Button,
  Divider,
  Grid,
  Typography,
} from '@material-ui/core'

import UserAvatar from '../user/UserAvatar'
import MeetUserDialog from './MeetUserDialog'

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    height: '100%',
    width: '100%',
  },
  media: {
    height: '100%',
    padding: '8px',
    display: 'flex',
    alignItems: 'center',
  },
  avatar: {
    height: '100%',
    width: 'auto'
  },
  centerAligned: {
    display: 'flex',
    alignItems: 'center'
  },
  gridItem: {
    height: '100%',
    display: 'flex',
    textAlign: 'left',
    justifyContent: 'start'
  },
  songText: {
    color: theme.palette.text
  },
  buttonContainer: {
    height: '100%',
    display: 'flex',
    padding: 0,
  },
  divider: {
    margin: -1, // Allows for it to be "forced" between flexible grid items
  },
  button: {
    color: theme.palette.primary.light
  }
}))

export default function MeetCard (props) {
  const { username, profile, songs } = props

  const classes = useStyles()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [dialogDefault, setDialogDefault] = useState('')

  const onProfileClick = () => {
    setDialogDefault('profile')
    setDialogOpen(true)
  }

  const onSongsClick = (obj) => {
    setDialogDefault('songs')
    setDialogOpen(true)
  }

  const onMatchClick = () => {
    console.log('Match clicked')
  }

  const onDialogClose = () => {
    setDialogOpen(false)
  }

  return (
    // TODO: Possibly make common component between this and SongTile for alignment?
    <>
      <Card className={classes.root} raised>
        <Grid container justify="space-between">
          <Grid item xs={6} className={classes.gridItem}>
            <CardActionArea className={classes.gridItem} onClick={onProfileClick}>
              <CardMedia className={classes.media}>
                <UserAvatar
                  src={profile.profilePicUrl}
                  displayName={profile.displayName}
                  className={classes.avatar}
                />
              </CardMedia>
              <div className={classes.centerAligned}>
                <CardContent>
                  <Typography variant="h6">
                    {profile.displayName || '(no display name)'}
                  </Typography>
                </CardContent>
              </div>
            </CardActionArea>
          </Grid>

          <Divider orientation="vertical" flexItem className={classes.divider}/>

          <Grid item xs={5} className={classes.gridItem}>
            <CardActionArea className={classes.gridItem} onClick={onSongsClick}>
              <div className={classes.centerAligned}>
                <CardContent>
                  <Typography variant="h6" className={classes.songText}>
                    Matching songs: {songs.length || 0}
                  </Typography>
                </CardContent>
              </div>
            </CardActionArea>
          </Grid>

          <Divider orientation="vertical" flexItem className={classes.divider}/>

          <Grid item xs={1} className={classes.buttonContainer}>
            <Button fullWidth onClick={onMatchClick} className={classes.button}>
              Match
            </Button>
          </Grid>
        </Grid>
      </Card>

      <MeetUserDialog
        username={username}
        profile={profile}
        songs={songs}
        defaultTab={dialogDefault}
        open={dialogOpen}
        onClose={onDialogClose}
      />
    </>
  )
}
