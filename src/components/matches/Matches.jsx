/*
 * Component for displaying the Matches tab, showing users who have been
 * previously matched, allowing for chats, profile, etc.
 *
 * Takes data from the state.matches
 */

import React, { useEffect, useState, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles'
import { loadMatches } from './matchesSlice'

import {
  Grid,
} from '@material-ui/core'

import RefreshButton from '../RefreshButton'
import UserTile from '../user/UserTile'
import UserView from '../user/UserView'

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100%',
    width: '100%',
    position: 'relative',
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
  userView: {
    height: '100%',
    width: '100%',
    position: 'absolute',
    top: 0,
  },
  matchesView: {
    height: '100%',
    width: '100%',
    paddingRight: 50,
    position: 'relative',
  },
}))

export default function Matches (props) {
  const classes = useStyles()
  const dispatch = useDispatch()

  const currentUser = useSelector((state) => state.account.username)
  const matches = useSelector((state) => state.matches.matches)

  const [ loading, setLoading ] = useState(false)
  const [ selectedUser, selectUser ] = useState(null)
  const [ selectedTab, selectTab ] = useState(null)

  // useCallback necessary for object creation
  // https://dmitripavlutin.com/dont-overuse-react-usecallback/
  const reloadMatches = useCallback((opts) => {
    setLoading(true)
    dispatch(loadMatches({ username: currentUser }))
      .catch((e) => { console.error(e) })
      .finally(() => { setLoading(false) })
  }, [dispatch, currentUser])

  // Automatically load or reload chats upon opening the tab
  useEffect(reloadMatches, [reloadMatches])

  const onChatClick =({user}) => {
    selectTab('chat')
    selectUser(user)
  }
  const onProfileClick =({user}) => {
    selectTab('profile')
    selectUser(user)
  }
  const onCloseClick =({user}) => {
    console.log('closing...')
  }
  const onSongsClick = ({user}) => {
    selectTab('songs')
    selectUser(user)
  }
  const closeUserView = () => {
    selectUser(null)
  }

  const chatTiles = matches.map((user, i) => (
    <UserTile
      key={i}
      className={classes.card}
      user={user}
      onChatClick={() => onChatClick({user})}
      onProfileClick={() => onProfileClick({user})}
      onCloseClick={() => onCloseClick({user})}
      onSongsClick={() => onSongsClick({user})}
    />
  ))

  const userView = (
    <div className={classes.userView}>
      <UserView
        onCloseClick={closeUserView}
        user={selectedUser}
      />
    </div>
  )

  const matchesView = (
    <div className={classes.matchesView}>
      <Grid container alignItems="flex-start" justify="flex-start">
        { chatTiles }
      </Grid>
      <RefreshButton
        onClick={reloadMatches}
        loading={loading}
        className={classes.refresh}
      />
    </div>
  )

  return (
    <div className={classes.root}>
      { matchesView }
      { selectedUser && userView }
    </div>
  )
}
