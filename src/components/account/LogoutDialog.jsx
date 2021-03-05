/*
 * Form dialog for handling account logout
 * Sends actions directly to store
 */
import React from 'react'
import { useDispatch } from 'react-redux'
import useAlert from '../../hooks/useAlert'

import { logout } from '../../server'
import { setLoggedIn, resetAccountData } from './accountSlice'
import { resetIntersectData } from '../intersect/intersectSlice'
import { resetMatchesData } from '../matches/matchesSlice'
import { clearMatches as resetMeetData } from '../meet/meetSlice'

import {
  // Button,
  // CircularProgress,
  Typography,
} from '@material-ui/core'
import FormDialog from '../FormDialog'

export default function LogoutDialog (props) {
  const dispatch = useDispatch()
  const { addAlert } = useAlert()

  const {
    open,
    onCancel,
    onSuccess,
  } = props

  const onSubmit = () => {
    console.log('submitting')
    logout()
      .then(() => {
        dispatch(setLoggedIn(false))

        dispatch(resetAccountData())
        dispatch(resetIntersectData())
        dispatch(resetMatchesData())
        dispatch(resetMeetData())

        onSuccess && onSuccess()
      })
      .catch((e) => {
        console.error(e)
        addAlert({
          type: 'snackbar',
          severity: 'error',
          text: 'Could not log out. Please try again.'
        })
      })
  }

  return (
    <FormDialog
      open={open}
      title="Account Logout"
      submitButtonText="Logout"
      onSubmit={onSubmit}
      onClose={() => { onCancel && onCancel() }}
      onCancel={() => { onCancel && onCancel() }}
    >
      <Typography variant="body1">
        Are you sure you want to log out?
      </Typography>
    </FormDialog>
  )
}
