import React, { useEffect, useState, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles'
import { loadChats } from './chatSlice'

import {
  Card,
  CardActionArea,
  CardActions,
  CardHeader,
  Grid,
  IconButton,
} from '@material-ui/core'

import CloseIcon from '@material-ui/icons/Close'
import ChatIcon from '@material-ui/icons/Chat'
import SongsIcon from '@material-ui/icons/LibraryMusic'

import RefreshButton from '../RefreshButton'
import UserAvatar from '../UserAvatar'

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100%',
    width: '100%',
    position: 'relative',
    paddingRight: 50,
  },
  card: {
    margin: theme.spacing(1),
    minWidth: 200,
    maxWidth: 275,
  },
  refresh: {
    position: 'absolute',
    right: 0,
    top: 0,
    // TODO: Re-define here and de-couple margin from refresh button
    // margin: theme.spacing(1),
  },
  closeButton: {
    color: theme.palette.error.light,
    marginRight: 'auto',
  },
}))

export default function Chat (props) {
  const classes = useStyles()
  const dispatch = useDispatch()

  const currentUser = useSelector((state) => state.account.username)
  const chats = useSelector((state) => state.chat.chats)

  const [ loading, setLoading ] = useState(false)

  // useCallback necessary for object creation
  // https://dmitripavlutin.com/dont-overuse-react-usecallback/
  const reloadChats = useCallback((opts) => {
    setLoading(true)
    dispatch(loadChats({ username: currentUser }))
      .catch((e) => { console.error(e) })
      .finally(() => { setLoading(false) })
  }, [dispatch, currentUser])

  // Automatically load or reload chats upon opening the tab
  useEffect(reloadChats, [reloadChats])

  const chatTiles = chats.map((user, i) => (
    <Card key={i} className={classes.card} raised>
      <CardActionArea>
        <CardHeader
          avatar={
            <UserAvatar src={user.profile.profilePicUrl} displayName={user.profile.displayName}/>
          }
          title={user.profile.displayName}
        />
      </CardActionArea>
      <CardActions disableSpacing>
        <IconButton className={classes.closeButton}>
          <CloseIcon/>
        </IconButton>
        <IconButton>
          <SongsIcon/>
        </IconButton>
        <IconButton color="primary">
          <ChatIcon/>
        </IconButton>
      </CardActions>
    </Card>
  ))

  return (
    <div className={classes.root}>
      <Grid container alignItems="flex-start" justify="flex-start">
        { chatTiles }
      </Grid>
      <RefreshButton
        onClick={reloadChats}
        loading={loading}
        className={classes.refresh}
      />
    </div>
  )
}
