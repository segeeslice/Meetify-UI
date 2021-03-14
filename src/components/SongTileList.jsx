/*
 * Brief, stylized, memoized wrapper for a list of SongTiles
 *
 * Memoizing ensures this doesn't re-render if the song list remains the same,
 * preventing lag when used
 */

import React from 'react'
import { makeStyles } from '@material-ui/core/styles'

import SongTile from './SongTile'

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100%',
    width: '100%',
  },
  songTile: {
    height: theme.tile.height,
    width: '100%',
    padding: theme.spacing(1),
  },
}))

const SongList = React.memo(({ songs }) => {
  const classes = useStyles()

  return songs.map((row, index) => (
    <div className={classes.songTile} key={index}>
      <SongTile
        song={row.song}
        artist={row.artist}
        /* album={row.album} */
        albumArtUrl={row.albumArtUrl}
      />
    </div>
  ))
})

export default SongList
