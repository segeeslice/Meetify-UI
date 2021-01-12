/*
 * UI component for the "Meet" section of the app, allowing people to find
 * others with like music interests
 */

import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { unwrapResult } from '@reduxjs/toolkit'
import { findMatches, clearMatches } from './meetSlice'

import { makeStyles } from '@material-ui/core/styles'

import {
  Button,
  CircularProgress,
  Grid,
  Typography,
} from '@material-ui/core'
import { Check } from '@material-ui/icons'
import MeetCard from './MeetCard'

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
  const matches = useSelector(state => state.meet.matches)
  const currentUser = useSelector(state => state.account.username)

  const matchesPresent = matches && matches.length > 0
  const [showMatches, setShowMatches] = useState(matchesPresent)

  const [searching, setSearching] = useState(false)
  const [buttonDisabled, setButtonDisabled] = useState(false)
  const [success, setSuccess] = useState(false)

  let timeout = null

  useEffect(() => (clearTimeout(timeout)))

  function handleClick () {
    // Change UI to indicate loading
    setButtonDisabled(true)
    setSearching(true)

    // Find matches from server and handle accordingly
    dispatch(findMatches({ username: currentUser }))
      .then(unwrapResult)
      .then(async (matches) => {
        setSearching(false)

        if (matches && matches.length > 0) {
          setSuccess(true)

          // Run success animation before showing matches
          timeout = setTimeout(() => {
            setShowMatches(true)
            setSuccess(false)
            setButtonDisabled(false)
          }, 2000)

        } else throw Error("No matches found.")

      }).catch((err) => {
        setSearching(false)
        console.error("Error in finding matches", err)

        // TODO: Display error alert with more details
        setShowMatches(false)
        setSuccess(false)
        setButtonDisabled(false)
        dispatch(clearMatches())
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
          onClick={() => handleClick()}
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

  // TODO: Start with primary background gradient and slowly reduce opacity down list
  const meetCards = [...matches]
    .sort((a, b) => b.songsMatched-a.songsMatched)
    .map((o, i) => {
      return (
        <div className={classes.tile} key={i}>
          <MeetCard {...o}/>
        </div>
      )
  })

  // TODO: Add fade animation between these, possibly put into generic component first
  if (showMatches) return meetCards
  else return initComp
}
