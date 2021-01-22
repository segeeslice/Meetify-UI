/*
 * An area for displaying messages between two users
 *
 * Message objects:
 * { date: Date, sender: String, text: String }
 *
 * props:
 * - messages [List] = Message objects to display contents of
 * - rightSender [String] = sender to put on the right side of screen;
 *                          other sender(s) will be put on the left
 */

import React from 'react'
import { makeStyles } from '@material-ui/core/styles'

import ChatBubble from './ChatBubble'

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    width: '100%',
    height: '100%',
    flexDirection: 'column',
  },
  chat: {
    display: 'flex',
    width: '100%',
  },
  chatBubble: {
    maxWidth: '60%',
    marginBottom: theme.spacing(1),
  },
  chatRight: {
    justifyContent: 'flex-end',
  },
  chatLeft: {
    justifyContent: 'flex-start',
  },
}))

export default function ChatView (props) {
  const classes = useStyles()

  const {
    messages,
    rightSender,
  } = props

  const chats = messages.map((m, i) => {
    const otherUserSent = m.sender === rightSender
    const directionClass = otherUserSent ? classes.chatLeft : classes.chatRight
    const color = otherUserSent ? 'secondary' : 'primary'

    return (
      <div className={`${classes.chat} ${directionClass}`} key={i}>
        <div className={classes.chatBubble}>
          <ChatBubble
            color={color}
            text={m.text}
            date={m.date}
            left={otherUserSent}
            right={!otherUserSent}
          />
        </div>
      </div>
    )
  })

  return (
    <div className={classes.root}>
      {chats}
    </div>
  )
}
