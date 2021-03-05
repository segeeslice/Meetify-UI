/*
 * UI component for displaying one chat bubble
 *
 * Note that right/left props only control shape
 * Alignment should be handled in the parent
 *
 * props:
 * - text [String] = text to display
 * - right [Boolean] = true if bubble on right side
 * - left [Boolean] = true if bubble on left side
 * - color [String] = "primary" or "secondary"
 */
import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { getShortDateTime } from '../../../util'

import {
  Paper,
  Typography,
} from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100%',
    width: '100%',
    padding: theme.spacing(1),
  },
  primaryColor: {
    backgroundColor: theme.palette.primary.dark
  },
  secondaryColor: {
    backgroundColor: theme.palette.background.default
  },
  text: {
    whiteSpace: 'pre', // Allow new lines
  },
  date: {
    color: theme.palette.text.hint
  },
}))

export default function ChatBubble (props) {
  const classes = useStyles()

  const {
    text,
    date,
    // TODO: Shape based on these
    // left,
    // right,
    color,
  } = props

  const colorClass = color === 'secondary' ? classes.secondaryColor : classes.primaryColor

  return (
    <Paper className={`${classes.root} ${colorClass}`} elevation={1}>
      <div>
        <Typography variant="body2" className={classes.text}>
          {text}
        </Typography>
      </div>
      <div>
        <Typography variant="caption" className={classes.date}>
          {getShortDateTime(date)}
        </Typography>
      </div>
    </Paper>
  )


}
