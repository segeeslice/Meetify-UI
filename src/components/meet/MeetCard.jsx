/*
 * UI component for a single "card" displaying passed contact information
 *
 * Props (all Strings):
 *   - displayName (String)
 *   - profilePicUrl (String)
 *   - songsMatched (int)
 */

import React from 'react'
import { makeStyles } from '@material-ui/core/styles'

import {
  Card,
  CardContent,
  CardMedia,
  Typography,
} from '@material-ui/core'
import UserAvatar from '../UserAvatar'

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
  contents: {
    display: 'flex',
    alignItems: 'center'
  }
}))

export default function MeetCard (props) {
  const classes = useStyles()

  return (
    // TODO: Possibly make common component between this and SongTile for alignment?
    <Card className={classes.root} raised>
      <CardMedia className={classes.media}>
        <UserAvatar
          src={props.profilePicUrl}
          displayName={props.displayName}
          className={classes.avatar}
        />
      </CardMedia>

      <div className={classes.contents}>
        <CardContent>
          <Typography variant="h6">
            {props.displayName || '(no display name)'}
          </Typography>
          <Typography variant="subtitle2">
            Matching songs: {props.songs.length || 0}
          </Typography>
        </CardContent>
      </div>
    </Card>
  )
}
