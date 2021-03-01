/*
 * Component for viewing and interacting with a user
 *
 * props:
 * - onCloseClick [function] = method to call when the "close" button is clicked
 * - user [obj] = user object, as formatted in store
 * - refreshMethod [function] = method to call every second for refreshing this user's data
 *     - Expected arguments: { matchId }
 *     - Expected return: Promise
 */

import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'

import {
  AppBar,
  IconButton,
  Paper,
  Tab,
  Tabs,
  Toolbar,
  Typography,
} from '@material-ui/core'
import ProfileIcon from '@material-ui/icons/AccountCircle'
import CloseIcon from '@material-ui/icons/Close'
import ChatIcon from '@material-ui/icons/Chat'
import SongsIcon from '@material-ui/icons/LibraryMusic'

import ChatView from './chat/ChatView'
import Account from '../account/Account'
import SongTile from '../SongTile'

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
    height: '100%',
    overflow: 'auto',
  },
  appBar: {
    position: 'absolute',
    top: 0,
  },
  songTile: {
    height: theme.tile.height,
    width: '100%',
    padding: '8px',
  },
  title: {
    flexGrow: 1,
  },
  hintText: {
    color: theme.palette.text.hint
  },
}))

export default function UserView (props) {
  const classes = useStyles()

  const {
    onCloseClick,
    user,
    defaultTab,
    chatHidden,
    refreshMethod,
  } = props

  const {
    songs,
    profile,
    username,
    matchId,
  } = user

  const TABS_CONFIG = [{
    val: 'profile',
    icon: <ProfileIcon/>,
    component: <Account username={username} profile={profile}/>,
  }, {
    val: 'songs',
    icon: <SongsIcon/>,
    component: !songs || songs.length === 0
      ?
      <Typography variant="subtitle1" className={classes.hintText}>
        No matching songs found
      </Typography>
      :
      songs.map((row, index) => (
        <div className={classes.songTile} key={index}>
          <SongTile
            song={row.song}
            artist={row.artist}
            albumArtUrl={row.albumArtUrl}
          />
        </div>
      )),
  }, {
    val: 'chat',
    icon: <ChatIcon/>,
    component: (
      <ChatView
        otherUser={user}
      />
    ),
  }].filter(o => !(o.val === 'chat' && chatHidden))

  // Call refreshMethod every second
  // Allows any parent to consistently update data, as necessary
  //
  // Currently tied to matchId, but should always be tied to few parameters to
  // prevent repeated calls, especially avoiding parameters that refreshMethod
  // could change
  //
  // Utilizes setTimeout instead of setInterval to handle cases when server is slow
  // (This also allows the first call to be instant!)
  useEffect(() => {
    if (refreshMethod) {
      let timeout = null

      const intervalMethod = async () => {
        refreshMethod({ matchId })
          .then(() => {
            timeout = setTimeout(intervalMethod, 1000)
          })
          .catch(() => {
            clearTimeout(timeout)
          })
      }

      intervalMethod()
      return () => clearTimeout(timeout)
    }
  }, [ refreshMethod, matchId ])

  const DEFAULT_TAB_INDEX = (defaultTab && TABS_CONFIG.findIndex(o => o.val === defaultTab)) || 0
  const [activeTabIndex, setActiveTabIndex] = useState(DEFAULT_TAB_INDEX)

  useEffect(() => {
    setActiveTabIndex(DEFAULT_TAB_INDEX)
  }, [DEFAULT_TAB_INDEX])

  const activeComponent = TABS_CONFIG[activeTabIndex].component

  return (
    <Paper className={classes.root} elevation={5}>
      <AppBar className={classes.appBar} elevation={1}>
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            { user.profile.displayName }
          </Typography>
          <Tabs value={activeTabIndex} textColor="inherit" className={classes.tabs}>
            {TABS_CONFIG.map((o, i) => (
              <Tab key={o.val} label={o.val}
                   icon={o.icon}
                   onClick={() => setActiveTabIndex(i)}
                   className={classes.tab}/>
            ))}
          </Tabs>
          <IconButton color="inherit" onClick={onCloseClick}>
            <CloseIcon/>
          </IconButton>
        </Toolbar>
      </AppBar>

      <div className={classes.contents}>
        {activeComponent}
      </div>
    </Paper>
  )
}
