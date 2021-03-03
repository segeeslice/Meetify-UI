/*
 * UI Component for containing a chat input row
 * Displays a user input box and send button
 *
 * props:
 * - placeholder [String] = text to display in text box when no input
 * - onSendClick [Function] = method to call when the "send" button is clicked
 */

import React, { useCallback, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import useAlert from '../../../hooks/useAlert'

import { sendMessage } from '../../../server'

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
  const { addAlert } = useAlert()

  // NOTE: This may be causing too many re-renders? But unsure how to mitigate
  //       Doesn't appear to severely impact performance, given small component
  const [text, setText] = useState()

  const {
    placeholder,
    userTo,
  } = props

  const onSendClick = useCallback((text) => {
    // TODO: Loading icons and things

    // Send message to server
    sendMessage({userTo, text})
      .then(() => {
        setText('')
      })
      .catch((e) => {
        console.error(e)
        addAlert({
          type: 'snackbar',
          severity: 'error',
          text: 'Could not send message. Please try again.'
        })
      })
  }, [userTo, addAlert])

  return (
    <div className={classes.root}>
      <TextField
        className={classes.textField}
        variant="outlined"
        placeholder={placeholder || 'Message'}
        multiline
        value={text}
        onChange={(e) => setText(e.target.value)}
        rowsMax={4}
        autoFocus
      />

      {/* Wrap in div so button doesn't grow in height */}
      <div>
        <IconButton onClick={() => onSendClick(text)}>
          <SendIcon/>
        </IconButton>
      </div>
    </div>
  )
}
