import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'

import {
  AppBar,
  Button,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  TextField,
} from '@material-ui/core'
import UserAvatar from '../user/UserAvatar'

const useStyles = makeStyles((theme) => ({
  dialogContent: {
    // height: '100%',
    // width: '100%',
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
  const [ profPicChange, setProfPicChange ] = useState(null)

  const dispNameError = dispNameChange !== null && dispNameChange.length === 0

  // Reset any previous changes when opening
  useEffect(() => {
    if (open === true) {
      setDescChange(null)
      setDispNameChange(null)
      setProfPicChange(null)
    }
  }, [open])

  const onSaveClick = () => {
    if (!onSave) return

    const changeObj = {}
    if (descChange !== null) changeObj.description = descChange.trim()
    if (dispNameChange !== null) changeObj.displayName = dispNameChange.trim()
    if (profPicChange !== null) changeObj.profilePicUrl = profPicChange.trim()

    onSave(changeObj)
  }

  return (
    <Dialog
      open={open}
      onClose={() => onCancel && onCancel()}
      maxWidth="lg"
    >
      <AppBar position="static">
        <DialogTitle>
          Edit Profile
        </DialogTitle>
      </AppBar>
      <DialogContent className={classes.dialogContent}>
        <span className={classes.avatarRow}>
          <UserAvatar
            className={classes.avatar}
            src={profPicChange !== null ? profPicChange : profilePicUrl}
            displayName={dispNameChange !== null ? dispNameChange : displayName}
          />
          {/* TODO: Image upload button? Paste button? */}
          <TextField
            className={classes.avatarTextField}
            fullWidth
            variant="outlined"
            label="Profile Picture URL"
            value={profPicChange !== null ? profPicChange : profilePicUrl}
            onChange={(e) => setProfPicChange(e.target.value)}
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
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => onCancel && onCancel()}
          className={classes.cancelButton}
        >
          Cancel
        </Button>
        <Button
          onClick={onSaveClick}
          className={classes.saveButton}
          disabled={dispNameError}
        >
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  )

}
