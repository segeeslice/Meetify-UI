import React, { useRef, useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'

import {
  AppBar,
  Dialog,
  DialogTitle,
  IconButton,
  Tabs,
  Tab,
  Toolbar,
  Typography,
} from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close'

import Account from '../account/Account.jsx'
import SongTile from '../SongTile'

const useStyles = makeStyles((theme) => ({
  title: {
    flexGrow: 1,
  },
  tab: {
    padding: 0,
    margin: 0,
    height: '100%',
  },
  tabs: {
    height: '100%',
    margin: 0,
  },
  songTile: {
    height: theme.tile.height,
    width: '100%',
    padding: '8px',
  },
  mainContainer: {
    paddingTop: 75
  }
}))


export default function MeetUserDialog (props) {
  const ref = useRef(null)
  const classes = useStyles()
  const { username, profile, songs, defaultTab } = props

  const TABS_CONFIG = [{
    val: 'profile',
    component: <Account username={username} profile={profile}/>,
  }, {
    val: 'songs',
    component: songs.map((row, index) => (
      <div className={classes.songTile} key={index}>
        <SongTile
          song={row.song}
          artist={row.artist}
      /* album={row.album} */
          albumArtUrl={row.albumArtUrl}
        />
      </div>
    ))
  }]

  const DEFAULT_TAB_INDEX = (defaultTab && TABS_CONFIG.findIndex(o => o.val === defaultTab)) || 0
  const [activeTabIndex, setActiveTabIndex] = useState(DEFAULT_TAB_INDEX)

  useEffect(() => {
    setActiveTabIndex(DEFAULT_TAB_INDEX)
  }, [DEFAULT_TAB_INDEX])

  const activeComponent = TABS_CONFIG[activeTabIndex].component

  return (
    <Dialog
      onClose={props.onClose}
      open={props.open}
      fullScreen
      ref={ref}
    >
      <AppBar position="fixed">
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            Match details
          </Typography>
          <Tabs value={activeTabIndex} textColor="inherit" className={classes.tabs}>
            {TABS_CONFIG.map((o, i) => (
              <Tab key={o.val} label={o.val}
                   onClick={() => setActiveTabIndex(i)}
                   className={classes.tab}/>
            ))}
          </Tabs>
          <IconButton color="inherit" onClick={props.onClose}>
            <CloseIcon/>
          </IconButton>
        </Toolbar>
      </AppBar>
      <div className={classes.mainContainer}>
        {activeComponent}
      </div>
    </Dialog>
  )
}
