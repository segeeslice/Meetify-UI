/*
 * UI Component for containing a chat input row
 * Displays a user input box and send button
 *
 * props:
 * - placeholder [String] = text to display in text box when no input
 * - onSendClick [Function] = method to call when the "send" button is clicked
 */

import React, { useCallback, useState, useRef } from 'react'
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
  const inputRef = useRef(null)
  const { addAlert } = useAlert()

  // NOTE: This may be causing too many re-renders? But unsure how to mitigate
  //       Doesn't appear to severely impact performance, given small component
  const [text, setText] = useState('')
  const [disabled, setDisabled] = useState(false)

  const {
    placeholder,
    userTo,
  } = props

  const onSendClick = useCallback((text) => {
    // TODO: Loading icons and things
    setDisabled(true)

    // Send message to server
    sendMessage({userTo, text})
      .then(() => {
        setText('')

        setDisabled(false)
        inputRef.current.focus()
      })
      .catch((e) => {
        console.error(e)

        addAlert({
          type: 'snackbar',
          severity: 'error',
          text: 'Could not send message. Please try again.'
        })

        setDisabled(false)
        inputRef.current.focus()
      })
  }, [userTo, addAlert])

  // Shift+Enter makes new line
  // Enter sends message
  const onChatKeypress = (e) => {
    const enterPressed = e.keyCode === 13
    const shiftHeld = e.shiftKey
    if (enterPressed) {
      if (!shiftHeld) onSendClick(text)
      else setText(text + '\n')
    }
  }
  const onChatChange = (e) => {
    const newText = e.target.value

    // If we hit enter, let onChatKeypress handle the event
    const textAdded = newText.length > text.length
    const enterPressed = textAdded && newText.endsWith('\n')

    if (!enterPressed) setText(newText)
  }

  return (
    <div className={classes.root}>
      <TextField
        className={classes.textField}
        variant="outlined"
        placeholder={placeholder || 'Message'}
        multiline
        value={text}
        rowsMax={4}
        autoFocus
        onChange={onChatChange}
        onKeyDown={onChatKeypress}
        disabled={disabled}
        inputRef={inputRef}
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
