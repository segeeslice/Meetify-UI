
/*
 * Component for displaying the general "Matches" view
 *
 * Intended to be more general and used between both "Matches" and "Meet" tabs,
 * given their similarities. Noted as "Match" since "Meet" is a special case,
 * disabling some items
 *
 * If using this for meeting, inMeetMode flag should be used
 * This has the following changes:
 * - "Chat" button -> "Add Person" button
 * - No chat tab when viewing the user
 */

import React, { useState, useCallback } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import useAlert from '../../hooks/useAlert'

import { rejectMatch } from '../../server'

import {
  Grid,
  Typography,
} from '@material-ui/core'
import ChatIcon from '@material-ui/icons/Chat'
import PersonAddIcon from '@material-ui/icons/PersonAdd'

import RefreshButton from '../RefreshButton'
import UserTile from '../user/UserTile'
import UserView from '../user/UserView'
import MatchDismissDialog from './MatchDismissDialog'

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
  hintText: {
    color: theme.palette.text.hint,
    margin: theme.spacing(1),
  },
}))

export default function MatchesView (props) {
  const classes = useStyles()
  const { addAlert } = useAlert()

  const {
    inMeetMode,
    matches,
    onRefreshClick,
    loading,
    refreshMethod,
    useDismissWarningDialog,
    onDismiss,
  } = props

  const [ selectedTab, selectTab ] = useState(null)

  // Tie the selected user to an index to ensure reactivity if that item changes
  const [ selectedUserIndex, selectUserIndex ] = useState(null)
  const [ dismissDialogOpen, setDismissDialogOpen ] = useState(false)
  const [ onDismissDialogSubmit, setOnDismissDialogSubmit ] = useState(null)
  const selectedUser = selectedUserIndex != null ? matches[selectedUserIndex] : null

  const onChatClick = useCallback((index) => {
    selectTab('chat')
    selectUserIndex(index)
  }, [selectTab, selectUserIndex])

  const onProfileClick = useCallback((index) => {
    selectTab('profile')
    selectUserIndex(index)
  }, [selectTab, selectUserIndex])

  const onSongsClick = useCallback((index) => {
    selectTab('songs')
    selectUserIndex(index)
  }, [selectTab, selectUserIndex])

  const closeUserView = useCallback(() => {
    selectUserIndex(null)
  }, [selectUserIndex])

  const onAddClick = useCallback((index) => {
    console.log('Adding!')
  }, [])

  const onCloseClick = useCallback((user) => {
    const {
      matchId
    } = user

    const rejectMethod = () => {
      rejectMatch({ matchId })
        .then(() => {
          addAlert({
            type: 'snackbar',
            severity: 'info',
            text: 'Match dismissed',
          })
          onDismiss && onDismiss(user)
        })
        .catch((e) => {
          console.error(e)
          addAlert({
            type: 'snackbar',
            severity: 'error',
            text: 'Could not dismiss match',
          })
        })
    }

    if (useDismissWarningDialog) {
      setOnDismissDialogSubmit(() => () => {
        rejectMethod()
        setDismissDialogOpen(false)
      })
      setDismissDialogOpen(true)

    } else {
      rejectMethod()
    }
  }, [
    setOnDismissDialogSubmit,
    setDismissDialogOpen,
    useDismissWarningDialog,
    addAlert,
    onDismiss,
  ])

  const onDismissDialogCancel = useCallback(() => {
    setDismissDialogOpen(false)
    setOnDismissDialogSubmit(null)
  }, [setDismissDialogOpen, setOnDismissDialogSubmit])

  const userTiles = !matches || matches.length === 0
        ?
        <Typography variant="h6" className={classes.hintText}>
          No matches yet!
        </Typography>
        :
        matches.map((user, i) => (
          <UserTile
            key={i}
            className={classes.card}
            user={user}
            onActionClick={() => inMeetMode ? onAddClick(i) : onChatClick(i)}
            onProfileClick={() => onProfileClick(i)}
            onCloseClick={() => onCloseClick(user)}
            onSongsClick={() => onSongsClick(i)}
            actionButtonIcon={inMeetMode ? <PersonAddIcon/> : <ChatIcon/>}
          />
        ))

  const userView = (
    <div className={classes.userView}>
      <UserView
        onCloseClick={closeUserView}
        user={selectedUser}
        defaultTab={selectedTab}
        chatHidden={inMeetMode}
        refreshMethod={refreshMethod}
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
    <>
      <div className={classes.root}>
        { matchesView }
        { selectedUser && userView }
      </div>
      <MatchDismissDialog
        open={dismissDialogOpen}
        onSubmit={() => onDismissDialogSubmit && onDismissDialogSubmit()}
        onCancel={() => onDismissDialogCancel()}
      />
    </>
  )
}
