/*
 * Component for viewing and interacting with a user
 *
 * props:
 * - onCloseClick [function] = method to call when the "close" button is clicked
 * - user [obj] = user object, as formatted in store
 */

import React from 'react'
import { makeStyles } from '@material-ui/core/styles'

import {
  AppBar,
  IconButton,
  Paper,
  Toolbar,
  Typography,
} from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close'

import ChatView from './chat/ChatView'

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100%',
    width: '100%',
    position: 'relative',
  },
  // TODO: Can't scroll on overflow
  contents: {
    padding: theme.spacing(3),
    paddingTop: 60 + theme.spacing(3),
  },
  appBar: {
    position: 'absolute',
    top: 0,
  },
  title: {
    flexGrow: 1,
  },
}))

export default function UserView (props) {
  const classes = useStyles()

  const {
    onCloseClick,
    user,
  } = props

  return (
    <Paper className={classes.root} elevation={5}>
      <AppBar className={classes.appBar} elevation={1}>
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            { user.profile.displayName }
          </Typography>
          <IconButton color="inherit" onClick={onCloseClick}>
            <CloseIcon/>
          </IconButton>
        </Toolbar>
      </AppBar>

      <div className={classes.contents}>
        <ChatView
          messages={user.messages}
          rightSender={user.username}
        />
      </div>
    </Paper>
  )
}
