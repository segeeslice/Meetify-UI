import React from 'react'
import { makeStyles } from '@material-ui/core/styles'

import {
  CircularProgress,
  IconButton,
} from '@material-ui/core'
import RefreshIcon from '@material-ui/icons/Refresh'

// TODO: De-couple with each other, centering progress on button
const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(1),
  },
  progress: {
    margin: theme.spacing(1) + 12,
  }
}))

export default function RefreshButton (props) {
  const classes = useStyles()
  const { loading, ...buttonProps} = props

  const activeComp = (loading && (
    <CircularProgress
      className={classes.progress}
      size={24}
      thickness={4.6}
    />
  )) || (
    <IconButton
      aria-label="refresh"
      {...buttonProps}
      className={classes.button}
    >
      <RefreshIcon/>
    </IconButton>
  )

  return (
    <div className={props.className}>
      { activeComp }
    </div>
  )
}
