/*
 * Component for a single tile containing basic information and actions
 * Contains 3 actionable areas:
 * - "close" button
 * - "songs" button
 * - "action" button (variant chat or add person button)
 * - "profile" action area
 *
 * However, event handling must be controlled from parent
 *
 * props:
 * - closeButtonDisabled, songButtonDisabled, actionButtonDisabled
 *     - [Boolean] if true, respective button is grayed and cannot be clicked
 * - actionButtonIcon
 *     - [React component] Material UI icon to display for the action button
 * - onCloseClick, onSongsClick, onActionClick, onProfileClick
 *     - [function] method to call upon clicking that particular area
 *
 */

import React from 'react'
import { makeStyles } from '@material-ui/core/styles'

import {
  Card,
  CardActionArea,
  CardActions,
  CardHeader,
  IconButton,
} from '@material-ui/core'

import CloseIcon from '@material-ui/icons/Close'
import SongsIcon from '@material-ui/icons/LibraryMusic'

import UserAvatar from './UserAvatar'

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100%',
    width: '100%',
  },
  refresh: {
    position: 'absolute',
    right: 0,
    top: 0,
    // TODO: Re-define here and de-couple margin from refresh button
    // margin: theme.spacing(1),
  },
  closeButton: {
    color: theme.palette.error.light,
    marginRight: 'auto',
  },
}))

function UserTileActions(props) {
  const classes = useStyles()

  const {
    closeButtonDisabled, onCloseClick,
    songButtonDisabled, onSongsClick,
    actionButtonDisabled, onActionClick,
    actionButtonIcon,
  } = props

  return (
    <CardActions disableSpacing>
      <IconButton
        className={classes.closeButton}
        onClick={onCloseClick}
        disabled={closeButtonDisabled}
      >
        <CloseIcon/>
      </IconButton>
      <IconButton
        onClick={onSongsClick}
        disabled={songButtonDisabled}
      >
        <SongsIcon/>
      </IconButton>
      <IconButton
        color="primary"
        onClick={onActionClick}
        disabled={actionButtonDisabled}
      >
        {actionButtonIcon}
      </IconButton>
    </CardActions>
  )
}

const MemoizedUserTileActions = React.memo(UserTileActions)

export default function UserTile (props) {
  const classes = useStyles()

  const {
    user,
    closeButtonDisabled, onCloseClick,
    songButtonDisabled, onSongsClick,
    actionButtonDisabled, onActionClick,
    actionButtonIcon,
    onProfileClick,
    className,
    ...cardProps
  } = props

  const actionAreaProps = {
    closeButtonDisabled, onCloseClick,
    songButtonDisabled, onSongsClick,
    actionButtonDisabled, onActionClick, // TODO: Refactor to "actionButton" with variant icons
    actionButtonIcon,
  }

  // TODO: Use memoize to possibly remedy performance issues

  return (
    <div className={className}>
      <Card className={classes.root} raised {...cardProps}>
        <CardActionArea onClick={onProfileClick}>
          <CardHeader
            avatar={
              <UserAvatar src={user.profile.profilePicUrl} displayName={user.profile.displayName}/>
            }
            title={user.profile.displayName}
          />
        </CardActionArea>
        <MemoizedUserTileActions
          {...actionAreaProps}
        />
      </Card>
    </div>
  )
}
