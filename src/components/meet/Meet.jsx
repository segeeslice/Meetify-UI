/*
 * UI component for the "Meet" section of the app, allowing people to find
 * others with like music interests
 */

import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import useAlert from '../../hooks/useAlert'
import { makeStyles } from '@material-ui/core/styles'

import { clearMatches, setMatches } from './meetSlice'
import { getPotentialMatches } from '../../server'

import {
  Button,
  CircularProgress,
  Grid,
  Typography,
} from '@material-ui/core'
import { Check } from '@material-ui/icons'

import MatchesView from '../matches/MatchesView'

const BUTTON_HEIGHT = 70
const PROGRESS_HEIGHT = BUTTON_HEIGHT / 1.5

const useStyles = makeStyles((theme) => ({
  button: {
    height: BUTTON_HEIGHT,
  },
  buttonProgress: {
    color: theme.palette.primary.main,
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: (-PROGRESS_HEIGHT)/2,
    marginTop: (-PROGRESS_HEIGHT)/2,
  },
  initContainer: {
    display: 'flex',
    height: '100%',
    width: '100%',
  },
  tile: {
    height: theme.tile.height,
    width: '100%',
    padding: '8px',
  },
}))

export default function Meet () {
  const classes = useStyles()
  const dispatch = useDispatch()
  const { addAlert } = useAlert()
  const matches = useSelector(state => state.meet.matches)

  const matchesPresent = matches && matches.length > 0
  const [showMatches, setShowMatches] = useState(matchesPresent)

  const [searching, setSearching] = useState(false)
  const [buttonDisabled, setButtonDisabled] = useState(false)
  const [success, setSuccess] = useState(false)

  let timeout = null

  useEffect(() => (() => { clearTimeout(timeout) }))

  function onRefreshClick () {
    // Change UI to indicate loading
    setButtonDisabled(true)
    setSearching(true)

    getPotentialMatches()
      .then((matches) => {
        dispatch(setMatches(matches))

        // Success animation
        setSuccess(true)
        timeout = setTimeout(() => {
          setShowMatches(true)
          setSuccess(false)
          setButtonDisabled(false)
        }, 2000)
      })

      .catch ((e) => {
        console.error(e)
        addAlert({
          type: 'snackbar',
          severity: 'error',
          text: 'Could not retrieve potential matches'
        })

        setShowMatches(false)
        setSuccess(false)
        setButtonDisabled(false)
        dispatch(clearMatches())
      })

      .finally(() => {
        setSearching(false)
      })
  }

  // TODO: Put this logic into a re-usable component
  // TODO: Add animation between progress and check
  const initComp = (
    <div className={classes.initContainer}>
      <Grid
        justify="center"
        alignContent="center"
        container
      >
        <Button
          variant="contained"
          className={classes.button}
          size="large"
          color="primary"
          disabled={buttonDisabled}
          onClick={onRefreshClick}
        >
          <Typography variant="h4">
            Meetify!
          </Typography>

          {searching && !success &&
           <CircularProgress
             className={classes.buttonProgress}
             size={PROGRESS_HEIGHT}
           />}

          {success &&
           <Check
             className={classes.buttonProgress}
             style={{fontSize: PROGRESS_HEIGHT}}
           />}
        </Button>
      </Grid>
    </div>
  )

  const meetView = (
    <MatchesView
      inMeetMode
      matches={matches}
      loading={searching}
      onRefreshClick={onRefreshClick}
      onDismiss={() => onRefreshClick()}
    />
  )
  // TODO: Add fade animation between these, possibly put into generic component first
  if (showMatches) return meetView
  else return initComp
}
