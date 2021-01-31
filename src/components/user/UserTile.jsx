/*
 * Component for a single tile containing basic information and actions
 * Contains 3 actionable areas:
 * - "close" button
 * - "songs" button
 * - "chat" button
 * - "profile" action area
 *
 * However, event handling must be controlled from parent
 *
 * props:
 * - disableCloseButton, disableSongsButton, disableChatButton
 *     - [Boolean] if true, respective button is grayed and cannot be clicked
 * - onCloseClick, onSongsClick, onChatClick, onProfileClick
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
import ChatIcon from '@material-ui/icons/Chat'
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
    disableCloseButton, onCloseClick,
    disableSongsButton, onSongsClick,
    disableChatButton, onChatClick,
  } = props

  return (
    <CardActions disableSpacing>
      <IconButton
        className={classes.closeButton}
        onClick={onCloseClick}
        disabled={disableCloseButton}
      >
        <CloseIcon/>
      </IconButton>
      <IconButton
        onClick={onSongsClick}
        disabled={disableSongsButton}
      >
        <SongsIcon/>
      </IconButton>
      <IconButton
        color="primary"
        onClick={onChatClick}
        disabled={disableChatButton}
      >
        <ChatIcon/>
      </IconButton>
    </CardActions>
  )
}

const MemoizedUserTileActions = React.memo(UserTileActions)

export default function UserTile (props) {
  const classes = useStyles()

  const {
    user,
    disableCloseButton, onCloseClick,
    disableSongsButton, onSongsClick,
    disableChatButton, onChatClick,
    onProfileClick,
    className,
    ...cardProps
  } = props

  const actionAreaProps = {
    disableCloseButton, onCloseClick,
    disableSongsButton, onSongsClick,
    disableChatButton, onChatClick,
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
