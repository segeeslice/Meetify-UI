/*
 * Component for displaying the Matches tab, showing users who have been
 * previously matched, allowing for chats, profile, etc.
 *
 * Takes data from the state.matches
 */

import React, { useEffect, useState, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import useAlert from '../../hooks/useAlert'

import { setMatches, setMessages } from './matchesSlice'
import { getAcceptedMatches, getMessages } from '../../server'

import MatchesView from './MatchesView'

export default function Matches (props) {
  const dispatch = useDispatch()
  const { addAlert } = useAlert()

  const matches = useSelector((state) => state.matches.matches)

  const [ loading, setLoading ] = useState(false)

  // useCallback necessary for object creation
  // https://dmitripavlutin.com/dont-overuse-react-usecallback/
  const reloadMatches = useCallback((opts) => {
    setLoading(true)

    return getAcceptedMatches()
      .then((matches) => {
        dispatch(setMatches(matches))
      })
      .catch((e) => {
        console.error(e)
        addAlert({
          type: 'snackbar',
          severity: 'error',
          text: 'Could not load matches',
        })
        throw e
      })
      .finally(() => {
        setLoading(false)
      })
  }, [dispatch, addAlert])

  // Automatically load or reload chats upon opening the tab
  useEffect(() => { reloadMatches() }, [reloadMatches])

  // Method to continually call for refreshing a single user's data from server
  // Called here to ensure lower components can remain mostly decoupled
  const refreshMatch = useCallback(({ matchId }) => {
    console.info(`Refreshing match ${matchId} data...`)

    return getMessages({ matchId })
      .then((messages) => {
        dispatch(setMessages({ matchId, messages }))
      })
      .catch((e) => {
        console.error(e)
        addAlert({
          type: 'snackbar',
          severity: 'error',
          text: 'Could not load messages'
        })
        throw e
      })
  }, [dispatch, addAlert])

  const onCloseClick =({user}) => {
    console.log('closing...')
  }

  return (
    <MatchesView
      matches={matches}
      loading={loading}
      onRefreshClick={reloadMatches}
      onCloseClick={onCloseClick}
      refreshMethod={refreshMatch}
    />
  )
}
