
/*
 * Component for displaying the general "Matches" view
 *
 * Intended to be more general and used between both "Matches" and "Meet" tabs,
 * given their similarities. Noted as "Match" since "Meet" is a special case,
 * disabling some items
 *
 * If using this for meeting, inMatchMode flag should be used
 */

import React, { useState } from 'react'
// import { useSelector, useDispatch } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles'

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

export default function MatchesView (props) {
  const classes = useStyles()

  const {
    inMatchMode,
    matches,
    onRefreshClick,
    onCloseClick,
    loading,
  } = props

  const [ selectedUser, selectUser ] = useState(null)
  const [ selectedTab, selectTab ] = useState(null)

  const onChatClick =({user}) => {
    selectTab('chat')
    selectUser(user)
  }
  const onProfileClick =({user}) => {
    selectTab('profile')
    selectUser(user)
  }
  const onSongsClick = ({user}) => {
    selectTab('songs')
    selectUser(user)
  }
  const closeUserView = () => {
    selectUser(null)
  }

  const userTiles = matches.map((user, i) => (
    <UserTile
      key={i}
      className={classes.card}
      user={user}
      onChatClick={() => onChatClick({user})}
      onProfileClick={() => onProfileClick({user})}
      onCloseClick={() => onCloseClick && onCloseClick({user})}
      onSongsClick={() => onSongsClick({user})}
    />
  ))

  const userView = (
    <div className={classes.userView}>
      <UserView
        onCloseClick={closeUserView}
        user={selectedUser}
        defaultTab={selectedTab}
      />
    </div>
  )

  const matchesView = (
    <div className={classes.matchesView}>
      <Grid container alignItems="flex-start" justify="flex-start">
        { userTiles }
      </Grid>
      <RefreshButton
        onClick={() => onRefreshClick && onRefreshClick()}
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
