import React from 'react'
import { makeStyles } from '@material-ui/core/styles'

import {
  IconButton,
} from '@material-ui/core'
import RefreshIcon from '@material-ui/icons/Refresh'
import ButtonProgress from './ButtonProgress'

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
    <div className={classes.progress}>
      <ButtonProgress/>
    </div>
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
