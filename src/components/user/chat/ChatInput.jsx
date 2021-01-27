/*
 * UI Component for containing a chat input row
 * Displays a user input box and send button
 *
 * props:
 * - placeholder [String] = text to display in text box when no input
 * - onSendClick [Function] = method to call when the "send" button is clicked
 */

import React from 'react'
import { makeStyles } from '@material-ui/core/styles'

import { TextField, IconButton} from '@material-ui/core'
import SendIcon from '@material-ui/icons/Send'

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    width: '100%',
    height: '100%',
    alignItems: 'center',
  },
  textField: {
    flexGrow: 1,
    marginRight: theme.spacing(1),
  },
}))

export default function ChatInput (props) {
  const classes = useStyles()

  const {
    placeholder
  } = props

  return (
    <div className={classes.root}>
      <TextField
        className={classes.textField}
        variant="outlined"
        placeholder={placeholder || 'Message'}
        multiline
        rowsMax={4}
      />

      {/* Wrap in div so button doesn't grow in height */}
      <div>
        <IconButton>
          <SendIcon/>
        </IconButton>
      </div>
    </div>
  )
}
