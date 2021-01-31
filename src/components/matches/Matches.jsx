/*
 * Component for displaying the Matches tab, showing users who have been
 * previously matched, allowing for chats, profile, etc.
 *
 * Takes data from the state.matches
 */

import React, { useEffect, useState, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { loadMatches } from './matchesSlice'

import MatchesView from './MatchesView'

export default function Matches (props) {
  const dispatch = useDispatch()

  const currentUser = useSelector((state) => state.account.username)
  const matches = useSelector((state) => state.matches.matches)

  const [ loading, setLoading ] = useState(false)

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

  const onCloseClick =({user}) => {
    console.log('closing...')
  }

  return (
    <MatchesView
      matches={matches}
      loading={loading}
      onRefreshClick={reloadMatches}
      onCloseClick={onCloseClick}
    />
  )
}
