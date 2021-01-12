/*
 * UI component for a single "tile" displaying passed song information
 *
 * Props (all Strings):
 *   - song        (String)
 *   - artist      (String)
 *   - album       (String)
 *   - albumArtUrl (String)
 *
 * ^ If any are not included, it will simply be excluded from display
 */

import React from 'react';

import {
  Card,
  CardContent,
  CardMedia,
  Typography,
} from '@material-ui/core'

import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    height: '100%',
    width: '100%',
  },
  media: {
    height: '100%',
    width: 'auto'
  },
  contents: {
    height: '100%',
    display: 'flex',
    alignItems: 'center',
  },
  subText: {
    color: theme.palette.text.secondary
  },
}))

export default function SongTile (props) {
  const classes = useStyles()

  return (
    <Card className={classes.root} raised>
      {/*Album Art*/}
      <CardMedia
        image={props.albumArtUrl}
        title={props.album + ' album cover'}
        className={classes.media}
        component="img"
      />

      {/*Song detail display*/}
      <div className={classes.contents}>
        {/* TODO: Horizontal-scroll if too long */}
        <CardContent>
          <Typography variant="h6">
            {props.song}
          </Typography>
          <Typography variant="subtitle1" className={classes.subText}>
            {props.artist}
          </Typography>
          <Typography variant="caption" className={classes.subText}>
            {props.album}
          </Typography>
        </CardContent>
      </div>
    </Card>
  )
}
