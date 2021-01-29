/*
 * UI Component for containing a chat input row
 * Displays a user input box and send button
 *
 * props:
 * - placeholder [String] = text to display in text box when no input
 * - onSendClick [Function] = method to call when the "send" button is clicked
 */

import React, { useCallback, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles'

import { sendMessage } from '../../../server'
import { loadMatches } from '../../matches/matchesSlice'

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
  const dispatch = useDispatch()
  const userFrom = useSelector(state => state.account.username)

  // NOTE: This may be causing too many re-renders? But unsure how to mitigate
  //       Doesn't appear to severely impact performance, given small component
  const [text, setText] = useState()
  // TODO: Loading icons and things

  const {
    placeholder,
    userTo,
  } = props

  const onSendClick = useCallback((text) => {
    // Send message to server
    sendMessage({
      userFrom,
      userTo,
      date: Date.now(),
      text: text,
    })
    // Reload messages from server to ensure we're seeing it properly
      .then(() => dispatch(loadMatches()))
      .finally(() => {
        setText('')
      })
  }, [dispatch, userTo, userFrom])

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
        <IconButton onClick={onSendClick}>
          <SendIcon/>
        </IconButton>
      </div>
    </div>
  )
}
