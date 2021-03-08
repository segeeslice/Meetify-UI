/*
 * Dialog with fields for editing a user's profile
 * Events/data must be handled in parent
 */

import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'

import {
  TextField,
} from '@material-ui/core'
import UserAvatar from '../user/UserAvatar'
import FormDialog from '../FormDialog'

const useStyles = makeStyles((theme) => ({
  dialogContent: {
    maxWidth: 600,
    minWidth: 600,
    paddingTop: theme.spacing(2)
  },
  cancelButton: {
    // background: theme.palette.error.dark,
    color: theme.palette.error.light,
  },
  saveButton: {
    // background: theme.palette.primary.dark,
    color: theme.palette.primary.light,
  },
  editableMargin: {
    marginTop: theme.spacing(2)
  },
  avatarRow: {
    display: 'flex',
    alignItems: 'center',
  },
  avatarTextField: {
    marginLeft: theme.spacing(2),
  },
  avatar: {
    width: theme.spacing(6),
    height: theme.spacing(6),
  },
}))

export default function EditProfileDialog(props) {
  const {
    open,
    onCancel,
    onSave,
    profile,
  } = props

  const {
    description,
    displayName,
    profilePicUrl,
  } = (profile || {})

  const classes = useStyles()
  const [ descChange, setDescChange ] = useState(null)
  const [ dispNameChange, setDispNameChange ] = useState(null)

  const dispNameError = dispNameChange !== null && dispNameChange.length === 0

  // Reset any previous changes when opening
  useEffect(() => {
    if (open === true) {
      setDescChange(null)
      setDispNameChange(null)
    }
  }, [open])

  const onSaveClick = () => {
    if (!onSave) return

    const changeObj = {}
    if (descChange !== null) changeObj.description = descChange.trim()
    if (dispNameChange !== null) changeObj.displayName = dispNameChange.trim()

    onSave(changeObj)
  }

  return (
    <FormDialog
      open={open}
      title="Edit Profile"
      submitButtonText="Save Changes"
      submitButtonDisabled={dispNameError}
      onSubmit={onSaveClick}
      onClose={() => onCancel && onCancel()}
      onCancel={() => onCancel && onCancel()}
    >
      <span className={classes.avatarRow}>
        <UserAvatar
          className={classes.avatar}
          src={profilePicUrl}
          displayName={dispNameChange !== null ? dispNameChange : displayName}
        />
        {/* TODO: Image upload button? Paste button? */}
        <TextField
          className={classes.avatarTextField}
          fullWidth
          disabled
          variant="outlined"
          label="Profile Picture"
          value="(This is pulled from your Spotify account)"
        />
      </span>
      <TextField
        className={classes.editableMargin}
        label="Display Name"
        variant="outlined"
        error={dispNameError}
        helperText={dispNameError && "Must be defined!"}
        fullWidth
        required
        placeholder="What should we call you?"
        value={dispNameChange !== null ? dispNameChange : displayName}
        onChange={(e) => setDispNameChange(e.target.value)}
        inputProps={{ maxLength: 18 }}
      />
      <TextField
        className={classes.editableMargin}
        label="Personal Description"
        variant="outlined"
        fullWidth
        multiline
        placeholder="Tell us about yourself!"
        rowsMax={6}
        value={descChange !== null ? descChange : description}
        onChange={(e) => setDescChange(e.target.value)}
      />
    </FormDialog>
  )
}
