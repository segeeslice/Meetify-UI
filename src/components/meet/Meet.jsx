/*
 * UI component for the "Meet" section of the app, allowing people to find
 * others with like music interests
 */

import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'

import {
  Button,
  CircularProgress,
  Grid,
  Typography,
} from '@material-ui/core'
import { Check } from '@material-ui/icons'
import MeetCard from './MeetCard'

const TEST_USERS = [{
  displayName: 'Dougy doug',
  profilePicUrl: 'https://wi-images.condecdn.net/image/jgov7eBrRvb/crop/2040/f/6-facial-recognition-hero.jpg',
  songsMatched: 27,
},{
  displayName: 'Dougina Dougette',
  profilePicUrl: 'https://www.4dface.io/wp-content/uploads/2018/10/4DFM_sample2.jpg',
  songsMatched: 57,
}, {
  displayName: 'Dougronamopolis Jr. doug',
  profilePicUrl: 'https://www.cbc.ca/natureofthings/content/legacy/Universal_Expression_Surprise.jpg',
  songsMatched: 5,
}]

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
  }
}))

export default function Meet () {
  // TODO: Move to store
  const classes = useStyles()
  const [matches, setMatches] = useState([])
  const [showMatches, setShowMatches] = useState(false)
  const [searching, setSearching] = useState(false)
  const [buttonDisabled, setButtonDisabled] = useState(false)
  const [success, setSuccess] = useState(false)

  let timeout = null

  useEffect(() => (clearTimeout(timeout)))

  function findMatches () {
    // Temporarily just swap after some delays
    setButtonDisabled(true)
    setSearching(true)
    timeout = setTimeout(() => {
      setSearching(false)
      setMatches(TEST_USERS)
      setSuccess(true)
      timeout = setTimeout(() => {
        setShowMatches(true)
        setButtonDisabled(false)
      }, 2000)
    }, 2000)
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
          onClick={() => findMatches()}
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
        <div style={{margin: '8px'}} key={i}>
          <MeetCard {...o}/>
        </div>
      )
  })

  // TODO: Add fade animation between these, possibly put into generic component first
  if (showMatches) return meetCards
  else return initComp
}
