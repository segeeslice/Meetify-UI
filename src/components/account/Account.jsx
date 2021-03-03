/*
 * UI component for viewing logged-in account details
 *
 * Props:
 * - username (String) = username of user's profile
 * - profile (obj) = { displayName, status, description }
 *   - (TODO: This should probably be a defined class)
 * - editable (Boolean) = true if should allow for editing
 *
 * TODO: Should rename to "Profile", which is more accurate
 *       Separate "Account" section should more be settings & logistics
 * TODO: Should have a "editor" mode where sections are editable
 */

import React, { useCallback, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import useAlert from '../../hooks/useAlert'

import { setProfile } from './accountSlice'
import { editProfile } from '../../server'

import {
  Button,
  Card,
  CardMedia,
  Grid,
  Typography,
} from '@material-ui/core'
import EditIcon from '@material-ui/icons/Edit'

import EditProfileDialog from './EditProfileDialog'

import './Account.css'
import { theme } from '../../theme'

// == CONSTANTS ==

const MAIN_CARD_MAX_WIDTH = '700px'
const MARGIN = '8px'

const HEADER_GRADIENT = theme.getGradient([theme.palette.background.default, theme.palette.primary.dark])
const BODY_GRADIENT = theme.getGradient([theme.palette.background.default, theme.palette.secondary.dark])

// == TEMP TEST STUFF ==

const PROFILE_IMG_SIZE = theme.images.squareImageHeight

// == CLASS ==

// TODO: Rename to Profile (account settings could & should be separate!)
export default function Account (props) {
  const userId = useSelector(state => state.account.userId)
  const dispatch = useDispatch()
  const { addAlert } = useAlert()

  const {
    username,
    profile,
    editable,
  } = props

  const [ editDialogOpen, setEditDialogOpen ] = useState(false)

  const openEditDialog = useCallback(() => {
    setEditDialogOpen(true)
  }, [])
  const onEditDialogCancel = useCallback(() => {
    setEditDialogOpen(false)
  }, [])
  const onEditDialogSave = useCallback((changes) => {
    editProfile({ userId, changes })
      .then((profile) => dispatch(setProfile(profile)))
      .then(() => setEditDialogOpen(false))
      .then(() => addAlert({
        text: 'Profile updated',
        severity: 'success',
        type: 'snackbar',
      }))
      .catch((e) => {
        addAlert({
          title: e.name,
          text: e.message || 'Could not profile. Please try again.',
          severity: 'error',
          type: 'dialog',
        })
      })
  }, [userId, dispatch, addAlert])

  const Header = (() => (
    <Card style={{width: '100%', background: HEADER_GRADIENT}}>
      <Grid
        container
        justify="center"
        align="center"
        style={{width: '100%', margin: 0}}
      >
        <Grid item container xs={10}>
          <Card style={{width: PROFILE_IMG_SIZE, margin: MARGIN, display: 'inline-flex'}}>
            <CardMedia
              image={profile.profilePicUrl}
              title={username + '\'s profile picture'}
              style={{height: PROFILE_IMG_SIZE, width: PROFILE_IMG_SIZE}}
            />
          </Card>
          <span style={{textAlign: 'left', margin: MARGIN, display: 'inline-flex', alignItems: 'center', flexGrow: 1}}>
            <div style={{flexGrow: 1}}>
              {/* TODO: Handle very long display names? */}
              <Typography variant="h5">
                {profile.displayName}
              </Typography>
            </div>
            {editable &&
             <Button
               startIcon={<EditIcon/>}
               variant="outlined"
               onClick={openEditDialog}
             >
               Edit Profile
             </Button>
            }
          </span>
        </Grid>
      </Grid>
    </Card>
  ))

  const Description = (() => (
    <Grid
      container
      justify="center"
      align="center"
    // TODO: Background gradient, primary -> black
      style={{width: '100%', margin: 0}}
    >
      <Grid item container xs={10}>
        <Card
          style={{width: '100%',
                  margin: MARGIN,
                  padding: MARGIN,
                  textAlign: 'left',}}
        >
          <Typography variant="h6">
            Personal Description
          </Typography>
          <Typography variant="body1">
            {profile.description}
          </Typography>
        </Card>
      </Grid>
    </Grid>
  ))

  return (
    <div style={{width: '100%', alignItems: 'middle'}}>
      <Card
        style={{padding: 0,
                maxWidth: MAIN_CARD_MAX_WIDTH,
                margin: 'auto',
                background: BODY_GRADIENT}}
      >
        {/* TODO: Probably should put all "Grid" type stuff here for easier modifications */}
        <Header/>
        <Description/>
      </Card>
      <EditProfileDialog
        open={editDialogOpen}
        onCancel={onEditDialogCancel}
        onSave={onEditDialogSave}
        profile={profile}
      />
    </div>
  );
}
