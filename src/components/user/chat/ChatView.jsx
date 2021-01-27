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
import ChatInput from './ChatInput'

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column-reverse',
    position: 'relative',
  },
  inputContainer: {
    width: '100%',
  },
  chatContainer: {
    display: 'flex',
    flexGrow: 1,
    width: '100%',
    height: '100%',
    flexDirection: 'column',
    overflow: 'auto', // TODO: Make scrollbar look prettier?
    marginBottom: theme.spacing(1)
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
    otherUser
  } = props

  const { messages } = otherUser

  const otherUserFirstName = otherUser.profile.displayName.split(' ')[0]
  const inputPlaceholder = `Message ${otherUserFirstName}`

  const chats = messages.map((m, i) => {
    const otherUserSent = m.sender === otherUser.username
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
      <div className={classes.inputContainer}>
        <ChatInput
          placeholder={inputPlaceholder}
        />
      </div>
      <div className={classes.chatContainer}>
        {chats}
      </div>
    </div>
  )
}
